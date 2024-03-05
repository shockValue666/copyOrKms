export const dynamic = 'force-dynamic';

import React from 'react'
import QuillEditorOld from '@/components/quil-editor/quil-editor-old'
import { createFile, getFileDetails, getFolderDetails } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import { v4 } from 'uuid';

const page = async (params:{params:{fileId:string}}) => {
  const {data,error} = await getFileDetails(params.params.fileId)
  if(error) redirect('/dashboard');
  return (
    <div className='relative'>
      <QuillEditorOld dirType="file" fileId={params.params.fileId} dirDetails={data[0] || {}}/>
    </div>
  )
}

export default page