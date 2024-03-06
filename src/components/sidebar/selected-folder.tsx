"use client";
import { Folder } from '@/lib/supabase/supabase.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface SelectedFolderProps{
    folder:Folder;
    onClick?:(option:Folder)=>void;
}

const SelectedFolder:React.FC<SelectedFolderProps> = ({folder,onClick}) => {
    const supabase = createClientComponentClient()
    const [folderLogo,setFolderLogo] = useState('/images/newLogo.png')

    useEffect(()=>{
        if(folder.bannerUrl){
            const path = supabase.storage.from('folderLogoz').getPublicUrl(folder.bannerUrl)?.data.publicUrl;
            setFolderLogo(path)
        }
    },[folder])
  return (
    <Link href={`/dashboard/${folder.id}`} onClick={()=>{if(onClick) onClick(folder)}}
        className='flex rounded-md hover:bg-muted transition-all flex-row
        p-2 gap-4 justify-center cursor-pointer items-center my-2 '
    >
        <Image src={folderLogo} alt="folder logo" width={26} height={26} className='rounded-lg' style={{objectFit:"cover",width:"auto",height:"auto"}}/>
        <div className='flex flex-col'>
            <p className='
                text-lg 
                w-[170px]
                overflow-hidden
                overflow-ellipsis
                whitespace-nowrap
            '>
                {folder.title}
            </p>
        </div>

    </Link>
  )
}

export default SelectedFolder