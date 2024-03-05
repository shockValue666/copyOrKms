export const dynamic = 'force-dynamic';

import QuillEditor from '@/components/quil-editor/quil-editor'
import { getFolderDetails } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import React from 'react'

const WorkspacePage = async ({params}: {params: {folderId:string}}) => {
  const {data,error} = await getFolderDetails(params.folderId)
  if(error) redirect('/dashboard');
  return (
    <div className='relative'>
      <QuillEditor dirType="folder" fileId={params.folderId} dirDetails={data[0] || {}}/>
    </div>
  )
}

export default WorkspacePage