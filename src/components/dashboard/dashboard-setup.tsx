"use client";
import { Folder, Subscription } from '@/lib/supabase/supabase.types';
import { AuthUser } from '@supabase/supabase-js';
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../ui/use-toast';
import {useRouter} from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { CreateFolderFromSchema } from '@/lib/types';
import EmojiPicker from '../globals/emoji-picker';
import { ToastAction } from '../ui/toast';
import { v4 } from 'uuid';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import Loader from '../globals/Loader';
import { actionLogCock } from '@/lib/server-actions/auth-actions';
import { createFolder, getUserFromId } from '@/lib/supabase/queries';
import { useAppState } from '@/lib/providers/state-provider';

interface DashboardSetupProps {
    user: AuthUser;
    subscription: Subscription | null;
    
}

const DashboardSetup:React.FC<DashboardSetupProps> = ({user,subscription}) => {
    const {toast} = useToast()
    const router= useRouter();
    const [selectedEmoji,setSelectedEmoji] = useState("🤑");
    const supabase = createClientComponentClient()
    const {register,handleSubmit,reset, formState:{isSubmitting:isLoading,errors}} = useForm<z.infer<typeof CreateFolderFromSchema>>({
        mode:"onChange",
        defaultValues:{
        folder:"", //only pro members can upload a custom logo for their workspace
        folderName:""
        }
    });
    const { dispatch } = useAppState();

    const dosth = async () =>{
        console.log("i am doing someshit")
        toast({
        variant:"destructive",
        title:"cock",
        action:(
            <ToastAction altText="Couldn't upload the cock">Errorlolcock</ToastAction>
        )
        })
    }

    const onCli:SubmitHandler<z.infer<typeof CreateFolderFromSchema>> = async (value,event) => {
        event?.preventDefault();
        console.log("value: ",value)
        const folderImage = value.folder[0]; //image
        let folderImagePath=null;
        const folderUUID = v4();
        const profile = await getUserFromId(user.id)
        if(!profile){
            toast({
                variant:"destructive",
                title:"not logged in",
                action: (
                    <ToastAction altText='Couldnt find profile'>Error</ToastAction>
                )
            })
        }
        if(folderImage){
        try{
            // const {data} = await supabase.storage.from('workspace-logos').getPublicUrl('4.jpeg')
            const {data,error} = await supabase.storage.from('folderLogoz').upload(`workspaceLogoFromMyCock.${folderUUID}`,folderImage,{
                cacheControl:'3600',
                upsert:true
            })
            if(error){
            console.log("error: at uploading",error)
            toast({
                variant: 'destructive',
                title: 'Error! Could not upload your workspace logo',
                action:(
                <ToastAction altText="Couldn't upload the shit">Errorlol</ToastAction>
                )
            });
            }
            folderImagePath=data?.path || null;
            // console.log("data: ",data);

        }catch(error){
            console.log("erorrorororo: ",error)
            toast({
            variant: 'destructive',
            title: 'Error! Could not upload your workspace logo',
            action:(
                <ToastAction altText="Couldn't upload the shit workspace logo">Errorlollogo</ToastAction>
            )
            });
        }

        try {
            const newFolder: Folder = {
            data:null,
            createdAt:new Date().toISOString(),
            iconId: selectedEmoji,
            id: folderUUID,
            inTrash:"",
            title: value.folderName,
            folderOwner:profile[0].id,
            bannerUrl:folderImagePath
            }
            // console.log("new workspace: asdsfasdfadsfasd",newWorkspace)
            const {data,error:createError} = await createFolder(newFolder);
    //        bring crateWorkspace here and piece by piece fix it
            if(data) {
            console.log("data from crating new folder: ",data)
            } else if(createError) {
            console.log("create folder error: ",createError)
            }
            if(createError){
            throw new Error();
            }
            dispatch({
            type:"ADD_FOLDER",
            payload:{... newFolder,files: [] }
            })
            toast({
            title: 'Folder Created',
            description: `${newFolder.title} has been created successfully.`,
            action:(
                <ToastAction altText="folder created suxesfully">SUXES</ToastAction>
            )
            })
            
            router.replace(`/dashboard/${newFolder.id}`);
        } catch (error) {
            console.log("error from the folder creation ig: ", error)
            toast({
            variant: 'destructive',
            title: 'Could not create your folder',
            description:
                "Oops! Something went wrong, and we couldn't create your folder. Try again or come back later.",
            action:(
                <ToastAction altText="Couldn't create the folder">Errorlolspace</ToastAction>
            )
            });
        }finally {
            reset();
        }
        }
    }
  return (
        <Card className='lg:w-[800px] h-screen sm:h-auto w-[100%]'>
            <CardHeader>
                <CardTitle>
                Create a folder
                </CardTitle>
                <CardDescription>
                Lets create a private folder to get you started.You can add
                    collaborators later from the folders settings tab.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onCli)} action="">
                <div className='flex flex-col gap-4'>
                    <div className='flex items-center gap-4'>
                    <div className='text-5xl'>
                        <EmojiPicker getValue={(emoji)=>{setSelectedEmoji(emoji)}} >
                        {selectedEmoji}
                        </EmojiPicker>
                    </div>
                    <Button
                        onClick={()=>{actionLogCock();dosth()}}
                    >
                        cock
                    </Button>
                    <div className='w-full'>
                        <Label htmlFor='folderName' className='text-sm text-muted-foreground'>
                        Folder Name
                        </Label>
                        <Input id="folderName" type='text' placeholder='Folder Name' className='bg-transparent' disabled={isLoading}
                        {...register("folderName",{required:"Folder name is required"})}
                        />
                        <small className='text-red-600'>
                        {errors?.root?.message?.toString()}
                        </small>
                    </div>
                    </div>
                    <div>
                    <Label htmlFor='folderLogo' className='text-sm text-muted-foreground'>
                        Folder Logo
                    </Label>
                    <Input id="folderLogo" type='file' accept='image/*' placeholder='Folder Logo' className='bg-transparent' disabled={
                        isLoading || 
                        // subscription?.status!=="active"
                        false
                    }
                        {...register("folder",{required:"Folder logo is required"})}
                    />
                    <small className='text-red-600'>
                        {errors?.root?.message?.toString()}
                    </small>
                    </div>
                    <div className="self-end">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className='bg-white text-black'
                    >
                        {!isLoading ? 'Create Folder' : <Loader />}
                    </Button>
                    </div>
                </div>
                </form>
            </CardContent>
        </Card>
  )
}

export default DashboardSetup