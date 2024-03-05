"use client";
import { appFoldersType, useAppState } from '@/lib/providers/state-provider';
import { File, Folder } from '@/lib/supabase/supabase.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UploadBannerFormSchema} from '../../lib/types'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Loader from '../globals/Loader';
import { useToast } from '../ui/use-toast';
import { dir } from 'console';
import { updateFile, updateFolder } from '@/lib/supabase/queries';

interface BannerUploadFormProps{
    dirType:"file" | "folder" | "workspace";
    id:string;
    details: File | Folder | appFoldersType
}

const BannerUploadForm: React.FC<BannerUploadFormProps> = ({
    details,
    id,
    dirType
}) => {
    const supabase = createClientComponentClient();
    const {state,folderId,dispatch} = useAppState();
    const {register, handleSubmit,reset,formState:{isSubmitting:isUploading,errors}} = useForm<z.infer<typeof UploadBannerFormSchema>>({
        mode:"onChange",
        resolver:zodResolver(UploadBannerFormSchema),
        defaultValues:{
            banner:'',
        }
    });
    const {toast} = useToast();

    const onSubmitHandler:SubmitHandler<z.infer<typeof UploadBannerFormSchema>> = async (values) => {
        const file = values.banner[0];
        console.log("sibmittitngggggg",values)
        if(!file || !id) {
            console.log("DOESN'T EXISTfile: ",file,"id: ",id)
            return;
        }
        try {
            let filePath=null;
            //WIP check if alreadu exists and delete
            const uploadBanner = async () => {
                const {data,error} = await supabase.storage.from("file-banners").upload(`banner-${id}`,file,{
                    cacheControl:'5',
                    upsert:true
                })

                if(error) {
                    toast({
                        title:"error",
                        description:`Error at uploading the banner: ${error}`,
                    })
                    console.log("error from uplading: ",error)
                    return;
                }
                
                filePath = data?.path;
            }
                
                if(dirType==="folder"){
                    if(!folderId) return;
                    await uploadBanner();
                    dispatch({
                        type:"UPDATE_FOLDER",
                        payload:{
                            folder:{bannerUrl:filePath},
                            folderId:id,
                        }
                    })
                    await updateFolder({bannerUrl:filePath},id);
                }
                if(dirType==="file"){
                    if(!folderId) return;
                    await uploadBanner();
                    dispatch({
                        type:"UPDATE_FILE",
                        payload:{
                            file:{bannerUrl:filePath},
                            fileId:id,
                            folderId,
                        }
                    })
                    await updateFile({bannerUrl:filePath},id);
                }
        } catch (error) {
            
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmitHandler)} className='flex flex-col gap-2'>
            <Label className='text-sm text-muted-foreground' htmlFor='bannerImage'>
                Banner Image    
            </Label>
            <Input
                type='file'
                id='bannerImage'
                accept='image/*'
                disabled={isUploading}
                {...register('banner',{required:"Banner Image is required"})}
            />
            <small className='text-red-600'>{errors.banner?.message?.toString()}</small>
            <Button disabled={isUploading} type="submit">
                {!isUploading ? "Upload Banner" : <Loader/>}
            </Button>
        </form>
    )
}

export default BannerUploadForm