import {  appFoldersType } from '@/lib/providers/state-provider';
import { File, Folder } from '@/lib/supabase/supabase.types'
import React from 'react'
import CustomDialogTrigger from '../globals/custom-dialog-trigger';
import BannerUploadForm from './banner-upload-form';

interface BannerUploadProps{
    details: File | Folder  |  appFoldersType; 
    id:string;
    dirType:"file" | "folder" ;
    children:React.ReactNode;
    className?:string;
}

const BannerUpload:React.FC<BannerUploadProps> = ({
    details,
    id,
    dirType,
    children,
    className
}) => {
  return (
    <CustomDialogTrigger header={"Upload Banner"} content={
        <BannerUploadForm details={details} dirType={dirType} id={id}/>
    } className={className}>
        {children}
    </CustomDialogTrigger>
  )
}

export default BannerUpload