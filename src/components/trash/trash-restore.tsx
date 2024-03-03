"use client";
import { appFoldersType, useAppState } from '@/lib/providers/state-provider';
import React, { useEffect, useState } from 'react'
import {File} from '@/lib/supabase/supabase.types'
import Link from 'next/link';
import { FileIcon, FolderIcon } from 'lucide-react';

const TrashRestore = () => {
    const {state,dispatch,folderId} = useAppState();
    const [files,setFiles] = useState<File[] | []>([])
    // const [files,setFiles] = useState<File[] | []>([]);

    useEffect(()=>{
        const stateFiles = state.folders
            .find((folder)=>folder.id === folderId)
            ?.files.filter(file=>file.inTrash) || [];

        setFiles(stateFiles);

    },[state,folderId])
  return (
    <section>
        {!!files.length && <>
            <h3>Files</h3>
            {files.map(file=>(
                <Link href={`/dashboard/${file.folderId}/${file.id}`} key={file.id} className='hover:bg-muted rounded-md p-2 flex items-center justify-between'>
                    <article>
                        <aside className='flex items-center gap-2'>
                            <FolderIcon/>
                            {file.title}
                        </aside>
                    </article>
                </Link>
            ))}
        </>}
        {!files.length  && <div className='text-muted-foreground absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2'>
                <p>Trash is empty</p>
            </div>}
    </section>
  )
}

export default TrashRestore