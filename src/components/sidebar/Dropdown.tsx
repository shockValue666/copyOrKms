import { useAppState } from '@/lib/providers/state-provider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react'
import { AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import clsx from 'clsx';
import EmojiPicker from '../globals/emoji-picker';
import { createFile, updateFile, updateFolder } from '@/lib/supabase/queries';
import { useToast } from '../ui/use-toast';
import TooltipComponent from '../globals/tooltip-component';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { File } from '@/lib/supabase/supabase.types';
import { v4 } from 'uuid';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';

interface DropdownProps{
    title:string;
    id:string;
    listType:'folder' | 'file';
    iconId:string;
    children?:React.ReactNode;
    disabled?:boolean;
    customIcon?:React.ReactNode;
}
const Dropdown:React.FC<DropdownProps> = ({title,id,listType,iconId,children,disabled,customIcon,...props}) => {
    const {toast} = useToast();
    const {user} = useSupabaseUser();
    const supabase = createClientComponentClient();
    const {state,dispatch,folderId} = useAppState();
    const [isEditing,setIsEditing] = React.useState(false);
    const router = useRouter();
    //folder title that synced with server data and local data
    const fileTitle:string | undefined = useMemo(()=>{
        if(listType==="file"){
            const stateTitle = state.folders
                .find(folder=>folder.id===folderId)
                ?.files.find(file=>file.id===id)
                ?.title
            if(title === stateTitle || !stateTitle){
                return title;
            }
            console.log("stateTitle: ",stateTitle)
            return stateTitle;
        }
    },[state,listType,id,title])
    
    //navigate the user to a different page
    const navigatePage = (accordionId:string,type:'folder' | 'file') => {
        if(type==="file"){
            router.push(`/dashboard/${folderId}/${id}`)
        }
    }
    //add a file
    const addNewFile = async () => {
        if(!folderId) return;
        const newFile:File = {
            folderId:id,
            data:null,
            createdAt:new Date().toISOString(),
            inTrash:"",
            title:'Untitled',
            iconId:'📄',
            id:v4(),
            bannerUrl:''
        }
        dispatch({
            type:'ADD_FILE',
            payload:{
                folderId :id,
                file:newFile
            }
        })
        const {data,error} = await createFile(newFile);
        console.log("data from creating a file: ",data,"error from creating a file: ",error)
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

    //double click handler
    const handleDoubleClick = () => {
        setIsEditing(true);
    }
    //blur
    const handleBlur = async() => {
        if(!isEditing) return;
        setIsEditing(false);
        const fId = id.split('file');
        console.log("fid from handleBlur: ",fId)
        if(fId?.length === 1){
            console.log('fid?.length : ',fId?.length, "fileTitle: ",fileTitle, "title: ",title)
            if(!fileTitle) return;
            await updateFile({title},fId[0]);
            toast({
                title:"suxes",
                description:"successfully updated the file title"
            })
        }
    }

    //onchanges
    const onChangeEmoji = async (selectedEmoji:string) =>{
        if(!folderId) return;
        if(listType==="file"){

            dispatch({
                type:"UPDATE_FILE",
                payload:{
                    fileId:id,
                    file:{iconId:selectedEmoji},
                    folderId
                }
            })
            const {data,error} = await updateFolder({iconId:selectedEmoji},id);
            if(error){
                toast({
                    title:"Error",
                    variant:"destructive",
                    description:"There was an error updating the folder icon"
                })
            }else{
                toast({
                    title:"suxes",
                    description:"successfully updated the folder icon"
                })
            }
        }
    }

    //folder title change
    const fileTitleChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        console.log("file title change: ",e.target.value, "folderId: ",folderId,"id: ",id)
        if(!folderId) return;
        const fId=id.split('file');
        console.log("fId: ",fId)
        if(fId.length===1){
            dispatch({
                type:"UPDATE_FILE",
                payload:{
                    folderId,
                    fileId:fId[0],
                    file:{title:e.target.value}
                }
            })
            // const {data,error} = await updateFile({title:e.target.value},fId[0]);
        }
    }
    //move to trash
    const moveToTrash = async () => {
        if(!user?.email || !folderId) return;
        console.log("move to trash")
        const pathId = id.split("file")
        if(listType=="file"){
            dispatch({
                type:"UPDATE_FILE",
                payload:{
                    file:{
                        inTrash:`Deleted by ${user?.email} `
                    },
                    fileId:pathId[0],
                    folderId
                }
            })
            const {data,error} = await updateFile({inTrash:`Deleted by ${user?.email}`},pathId[0])
            if(error){
                toast({
                    title:"Error",
                    description:"There was an error moving the folder to the trash",
                    variant:"destructive"
                })
            }else{
                toast({
                    title:"suxes",
                    description:"successfully moved the folder to the trash"
                })
            }
        }
    }

    //css
    const isFile = listType === 'file';
    const listStyles = useMemo(()=>clsx('relative',{
        'border-none text-md':!isFile,
        'border-none ml-6 text-[16px] py-1':isFile
    }),[isFile])

    const groupIdentifies = clsx('dark:text-white whitespace-nowrap flex justify-between items-center w-full relative',{
        'group/folder':!isFile,
        "group/file":isFile
    })
    const hoverStyles = useMemo(
        () =>
            clsx(
            'h-[full] hidden rounded-sm absolute right-0 top-0 items-center justify-center',
            {
                'group-hover/file:block': listType === 'file',
                'group-hover/folder:block': listType === 'folder',
            }
            ),
        [isFile]
    );

  return (
    <div className={`${listStyles}`} onClick={()=>navigatePage('','file')}>
        <div className={`${groupIdentifies} `}>
                <div className='flex gap-4 items-center justify-center overflow-hidden'>
                    <div className='relative'>
                        {/* <EmojiPicker getValue={onChangeEmoji}> */}
                            {iconId}
                        {/* </EmojiPicker> */}
                    </div>
                    <input type="text" value={fileTitle} className={clsx(` outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7`,{
                        "bg-muted cursor-text":isEditing,
                        "bg-transparent cursor-pointer":!isEditing,
                    })} readOnly={!isEditing} onDoubleClick={handleDoubleClick} onBlur={handleBlur} onChange={fileTitleChange}/>
                </div>
                <div className={hoverStyles}>
                    <TrashIcon onClick={moveToTrash} size={15} className='hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors' />
                </div>
            </div>
    </div>
  )
}

export default Dropdown