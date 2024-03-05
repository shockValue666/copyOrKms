"use client"
import { useAppState } from '@/lib/providers/state-provider'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { actionLoginUser } from '@/lib/server-actions/auth-actions'
import { createFile, createFolder, getFolderFromUserIdFirst, getUserFromId, getUserFromName } from '@/lib/supabase/queries'
import { Folder,File } from '@/lib/supabase/supabase.types'
import React from 'react'
import { v4 } from 'uuid'


const Page = () => {
  const {user} = useSupabaseUser();
  const {dispatch} = useAppState();

  const createNewFolder = async () => {
    if(!user) return;
    const userPublic = await getUserFromId(user.id)
    console.log("userPublic: ",userPublic)
    const folder = await getFolderFromUserIdFirst(user.id)
    console.log("folders: ",folder)

    // const newFolder:Folder = {
    //   id:v4(),
    //   createdAt:new Date().toISOString(),
    //   title:"new folder from my cock",
    //   data:"some data",
    //   inTrash:null,
    //   bannerUrl:null,
    //   iconId:"💰",
    //   folderOwner:userPublic[0].id
    // }
    // console.log("create folder: ",newFolder)
    // const response = await createFolder(newFolder)
    // console.log("response from creating new Folder: ",response)
    if(!folder) return;
    const newFile:File = {
      id:v4(),
      data:"cock",
      createdAt: new Date().toISOString(),
      title:"another one",
      iconId:"⚡️",
      inTrash:"",
      bannerUrl:null,
      folderId:folder?.id
    }
    dispatch({
      type:"ADD_FILE",
      payload:{
        file:newFile,
        folderId:folder.id
      }
    })
    console.log("new file: ",newFile)
    const nreRes = await createFile(newFile)
    console.log("nreRes: ",nreRes)
  }
  return (
    <div className='flex flex-col justify-center items-center w-full'>
      <button onClick={async ()=>{console.log("some shit");createNewFolder();}}>some shit</button>
    </div>
  )
}

export default Page