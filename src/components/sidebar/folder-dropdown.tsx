"use client";
import { useAppState } from '@/lib/providers/state-provider';
import { Folder } from '@/lib/supabase/supabase.types'
import React, { useEffect, useState } from 'react'
import SelectedFolder from './selected-folder';
import CustomDialogTrigger from '../globals/custom-dialog-trigger';
import FolderCreator from '../globals/folder-creator'

interface FolderDropdownProps{
    privateFolders: Folder[] | [];
    sharedFolders: Folder[] | [];
    collaboratingFolders: Folder[] | [];
    defaultValue: Folder | undefined;
}

const FolderDropdown:React.FC<FolderDropdownProps> = ({
    privateFolders,
    sharedFolders,
    collaboratingFolders,
    defaultValue
}) => {
    const {dispatch,state} = useAppState() //the equivalent of useContext in order to access those values ig or not
    const [selectedOption,setSelectedOption] = useState(defaultValue)
    const [isOpen,setIsOpen] = useState(false)

    useEffect(()=>{
        if(!state.folders.length){
            dispatch({
                type:"SET_FOLDERS",
                payload:{
                    folders:
                        [...privateFolders,...collaboratingFolders,...sharedFolders]
                        .map((folder)=>({...folder,files:[]}))
                }
            })
        }
    },[privateFolders,sharedFolders,collaboratingFolders])

    const handleSelect = (option:Folder) => {
        setSelectedOption(option);
        console.log("option: ",option)
        setIsOpen(false);
    } 

    useEffect(()=>{
        const findSelectedFolder = state.folders.find(
            (folder)=>folder.id===defaultValue?.id
        )
        if(findSelectedFolder) setSelectedOption(findSelectedFolder)
    },[state,defaultValue])
  return (
    <div className='relative inline-block text-left'>
        <div>
            <span onClick={()=>{setIsOpen(!isOpen)}}>
                {selectedOption ? <SelectedFolder folder={selectedOption}/> : "Select a workspace"}
            </span>
        </div>
        {
            isOpen && (
                <div className='origin-top-right absolute w-full rounded-md shadow-md z-50 h-[390px] bg-black/10 backdrop-blur-lg group overflow-scroll border-[1px] border-muted'>
                    <div className='rounded-md flex flex-col'>
                        <div className='!p-2'>
                            {!!privateFolders.length && <>
                                <p className='text-muted-foreground'>Private</p>
                                <hr />
                                {privateFolders.map((option)=><SelectedFolder key={option.id} folder={option} onClick={handleSelect} />)}
                            </>}

                            {!!collaboratingFolders.length && <>
                                <p className='text-muted-foreground'>Collaborating</p>
                                <hr />
                                {collaboratingFolders.map((option)=><SelectedFolder key={option.id} folder={option} onClick={handleSelect} />)}
                            </>}

                            {!!sharedFolders.length && <>
                                <p className='text-muted-foreground'>Shared</p>
                                <hr />
                                {sharedFolders.map((option)=><SelectedFolder key={option.id} folder={option} onClick={handleSelect} />)}
                            </>}
                        </div>
                        <CustomDialogTrigger header='Create a workspace' content={<FolderCreator setIsOpen={setIsOpen}/>} description='you can change your folder privacy options later on'>
                            <div className='
                            flex
                            transition-all
                            hover:bg-muted
                            justify-center
                            items-center
                            gap-2
                            p-2
                            w-full
                            border 
                            rounded-md
                            bottom-[0.5%]
                            absolute
                            
                            '>
                                <article className='text-slate-500 rounded-full bg-slate-800 w-4 h-4 flex items-center justify-center'>
                                    +
                                </article>
                                Create Folder
                            </div>
                        </CustomDialogTrigger>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default FolderDropdown