"use client"
import { actionLoginUser } from '@/lib/server-actions/auth-actions'
import { createFolder, getFolders, getUserFromName } from '@/lib/supabase/queries'
import { Folder } from '@/lib/supabase/supabase.types'
import React from 'react'
import { v4 } from 'uuid'


const Page = () => {
  const createNewFolder = async () => {
    // const newFolder:Folder = {
    //   id:v4(),
    //   createdAt:new Date().toISOString(),
    //   title:"new folder from my cock",
    //   data:"some data",
    //   inTrash:null,
    //   bannerUrl:null,
    //   iconId:"💰",
    //   folderOwner:
    // }
    // console.log("create folder: ",newFolder)
    // const response = await createFolder(newFolder)
    // console.log("response from creating new Folder: ",response)
  }
  return (
    <div className='flex flex-col justify-center items-center w-full'>
      <button onClick={async ()=>{console.log("some shit");createNewFolder();}}>some shit</button>
    </div>
  )
}

export default Page