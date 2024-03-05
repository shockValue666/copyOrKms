"use client";
import { useAppState } from '@/lib/providers/state-provider';
import { File } from '@/lib/supabase/supabase.types';
import React, { useEffect, useState } from 'react'
import TooltipComponent from '../globals/tooltip-component';
import { PlusIcon } from 'lucide-react';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { v4 } from 'uuid';
import { createFile, createFolder } from '@/lib/supabase/queries';
import { useToast } from '../ui/use-toast';
import { Accordion } from '../ui/accordion';
import Dropdown from './Dropdown';
import useSupabaseRealtime from '@/lib/hooks/useSupabaseRealtime';
// import { useSubscriptionModal } from '@/lib/providers/subscription-modal-provider';

interface FilesDropdownListProps{
    foldersFiles:File[] | null;
    folderId:string;
}

const FilesDropdownList:React.FC<FilesDropdownListProps> = ({foldersFiles,folderId}) => {
    //WIP local state folders 
    //WIP setup real time updates (when another user creates a folder we want to see it)
    useSupabaseRealtime();
    const {state,dispatch,fileId} = useAppState(); 
    const [files,setFiles] = React.useState<File[]>(foldersFiles || []);
    const {subscription} = useSupabaseUser();
    const {toast} = useToast();
    // const {setOpen,open} = useSubscriptionModal();

    //effect set initial state server app state
    useEffect(()=>{
        if(foldersFiles && foldersFiles?.length>0){
            dispatch({type:'SET_FILES',payload:{folderId,files:foldersFiles.map(file=>({...file,files:state.folders.find(file=>file.id===fileId) || []}))}})
        }   
    },[foldersFiles,folderId])

    //state
    useEffect(()=>{
        setFiles(state.folders.find((folder)=>folder.id===folderId)?.files || [])
        console.log("state.folders: ",files)
    },[state,folderId])

    // useEffect(()=>{
    //     console.log("createdFiles: ",files)
    // },[files])

    //add folder 
    const addFileHandler = async () => {
        //subscription modal
        // if(files.length>=3 && !subscription){
        //     console.log("greater than my cock")
        //     // setOpen(true);
        //     return;
        // }   
        const newFile:File = {
            data:null,
            id:v4(),
            createdAt:new Date().toISOString(),
            iconId:'📄',
            inTrash:"",
            title:"Untitled",
            folderId,
            bannerUrl:""
        }
        dispatch({type:'ADD_FILE',payload:{folderId,file:{...newFile}}})
        const {data,error} = await createFile(newFile);
        if(error){
            toast({
                title:"Error creating file",
                description:"There was an error creating the file",
                variant:"destructive"
            })
        }else{
            toast({
                title:"Successfully created a file",
                description:"the file was crated successfully",
            })
        }
    }
  return (
    <>
    <div className='flex sticky z-20 top-0 bg-background w-full h-10 group/title justify-between items-center pr-4 text-Neutrals/neutrals-8'>
        <span className='text-Neutrals-8 font-bold text-xs'>
            Files
        </span>
        <TooltipComponent message="Create a folder">
            <PlusIcon
            onClick={addFileHandler}

             size={16} className='group-hover/title:inline-block hidden cursor-pointer'/>
        </TooltipComponent>
    </div>
    <Accordion type="multiple" defaultValue={[folderId || '']} className='pb-20'>
        {files.filter(file=>!file.inTrash).map(file=>(
                <Dropdown
                    key={file.id}
                    title={file.title}
                    listType="file"
                    id={file.id}
                    iconId={file.iconId}
                />
        ))}
    </Accordion>
    </>
  )
}

export default FilesDropdownList