"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useAppState } from '@/lib/providers/state-provider';
import { Folder, User } from '@/lib/supabase/supabase.types';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Briefcase,CreditCard,ExternalLink,Lock, LogOut, Plus, Share, User as UserIcon } from 'lucide-react';
import { Separator } from '@radix-ui/react-select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { addCollaborators, deleteFolder, getCollaborators, getUsersFromSearch, removeCollaborators, updateFolder } from '@/lib/supabase/queries';
import { v4 } from 'uuid';
import { useToast } from '../ui/use-toast';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger,} from "@/components/ui/alert-dialog"
  
import CollaboratorSearch from '../globals/collaborator-search';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';
import EmojiPicker from '../globals/emoji-picker';
import CypressProfileIcon from '../icons/cypressProfileIcon';
import LogoutButton from '../globals/logout-button';
import Link from 'next/link';
// import { useSubscriptionModal } from '@/lib/providers/subscription-modal-provider';
// import { postData } from '@/lib/utils';

interface SettingsFormProps{

}

const SettingsForm = () => {
    const {toast} = useToast();
    const {state,folderId,dispatch} = useAppState();
    const [permissions,setPermissions] = useState("private");
    const [collaborators,setCollaborators] = useState<User[] | []>([]);
    const {user,subscription} = useSupabaseUser();
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [openAlertMessage,setOpenAlertMessage] = useState(false);
    const [folderDetails,setFolderDetails] = useState<Folder>();
    const titleTimerRef=useRef<ReturnType<typeof setTimeout>>();
    const [uploadingProfilePic,setUploadingProfilePic] = useState(false);
    const [uploadingLogo,setUploadingLogo] = useState(false);
    // const {setOpen,open} = useSubscriptionModal()
    const [loadingPortal, setLoadingPortal] = useState(false);
    

    //WIP Payment Portal
    // const redirectToCustomerPortal = async () => {
    //     setLoadingPortal(true);
    //     try {
    //         const {url,error} = await postData({url:'/api/create-portal-link'});
    //         window.location.assign(url);
    //     } catch (error) {
    //         console.log("error: ",error)
    //         setLoadingPortal(false)
    //     }
    //     setLoadingPortal(false);
    // }


    //add collaborators
    const addCollaborator = async (user:User) => {
        if(!folderId) return;
        //WIP subscription
        if(subscription?.status !== "active" && collaborators.length>=2){
            // setOpen(true);
            return;
        }
        await addCollaborators([user],folderId);
        setCollaborators([...collaborators,user]);
    }

    //remove collaborators
    const removeCollaborator = async (user:User) => {
        if(!folderId) return;
        if(collaborators.length===1){
            setPermissions("private");
        }
        setCollaborators(collaborators.filter(c=>c.id!==user.id))
        await removeCollaborators([user],folderId);
        router.refresh();  
    }

    //onchange folder title
    function folderNameChange(event: ChangeEvent<HTMLInputElement>): void {
        // console.log("event: ",event.target.value)
        if(!folderId || !event.target.value) return;
        dispatch({type:"UPDATE_FOLDER",payload:{folder:{title:event.target.value},folderId}});
        if(titleTimerRef.current) clearTimeout(titleTimerRef.current);
        titleTimerRef.current = setTimeout(async () => {
            await updateFolder({title:event.target.value},folderId);
        },500)

    }

    //onchange folder logo or banner or w/e
    const onChangeFolderLogo = async (event: ChangeEvent<HTMLInputElement>) => {
        if(!folderId) return;
        const file = event.target.files?.[0];
        if(!file) return;
        const uuid= v4();
        setUploadingLogo(true);
        const {data,error} = await supabase.storage.from('folderLogoz').upload(`folderLogoFromMyCock.${uuid}`,file,{
            cacheControl:'3600',
            upsert:true
        });

        if(!error){
            dispatch({type:"UPDATE_FOLDER",payload:{folder:{bannerUrl:data.path},folderId}});
            await updateFolder({bannerUrl:data.path},folderId);
            setUploadingLogo(false);
            toast({description:"Logo updated",title:"success"})
            return;
        }else if(error){
            toast({description:"Error at uploading the logo" + error,title:"error"})
            setUploadingLogo(false);
            return;
        
        }
    }
    //all onchanges
    const onPermissionChange = (value:string) => {
        if(value==="private"){
            setOpenAlertMessage(true);
        }else{
            setPermissions(value);
        }
    }


    //get all the collaborators
    useEffect(()=>{
        if(!folderId) return;
        const fetchCollaborators = async () => {
            const response = await getCollaborators(folderId);
            if(response.length){
                setPermissions("shared");
                setCollaborators(response);
            }
        }
        fetchCollaborators()
    },[folderId])
    //WIP payment portal redirect

    useEffect(()=>{
        const showingFolder = state.folders.find((folder) => folder.id === folderId);
        if(showingFolder) setFolderDetails(showingFolder);
    },[folderId,state])

    const [selectedEmoji,setSelectedEmoji] = useState("😈");

    //alert dialog confirm
    const onClickAlertConfirm = async () => {
        //shouldn't we check if the user trying to change the folder to private is the owner of the folder?
        //if not, we should throw an error
        if(!folderId) return;
        if(collaborators.length>0){
            await removeCollaborators(collaborators,folderId);
        }
        setPermissions("private");
        setOpenAlertMessage(false);
    }

    //change profile pic
    const onChangeProfilePicture = async (event: ChangeEvent<HTMLInputElement>) => {
        if(!user?.email) return;
        // const user = await getUsersFromSearch({email:user?.email});
        const us = await getUsersFromSearch(user?.email);
        const {data,error} = await supabase.storage.from('avatars').upload(`${user?.id}.png`,event.target.files?.[0] as File,{upsert:true});
        if(data){
            toast({title:"success",description:"profile picture updated"});
        }else if(error){
            toast({variant:"destructive",title:"error",description:"error at updating the profile picture"});
        }
    }
  return (
    <div className='flex gap-4 flex-col'>
        <>
        <p className='flex items-center gap-2 mt-6'>
            <Briefcase size={24}/>
            Folder
        </p>
        <Separator/>
        <div className='flex flex-col gap-2'>
            <Label htmlFor='folderName' className='text-sm text-muted-foreground'>Name</Label>
            <Input name='folderName' value={folderDetails ? folderDetails.title : ""} placeholder='Folder Name' onChange={folderNameChange}/>
            <Label htmlFor='folderLogo' className='text-sm text-muted-foreground'>Logo</Label>
            {/* WIP subscription */}
            <Input name="folderLogo" type="file" accept='image/*' placeholder='Folder logo' onChange={onChangeFolderLogo} disabled={uploadingLogo || subscription?.status !== "active"} />
            {subscription?.status !== "active" && <small className='text-muted-foreground'>to customize your folder, you need to be on a pro plan user</small>}
            <div className='flex justify-center items-center py-2 pt'>
                <Label htmlFor='emoji' className='text-5xl text-muted-foreground' content='select an emoji'>
                    <p className='absolute text-sm text-muted-foreground left-[5%]'>
                        Emoji
                    </p>
                    <div className='' id="emoji">
                        <EmojiPicker getValue={(emoji)=>{setSelectedEmoji(emoji)}} >
                            {selectedEmoji}
                        </EmojiPicker>
                    </div>
                </Label>
              </div>
        </div>
        <>
            <Label htmlFor='permissions' className='text-sm text-muted-foreground'>Permissions</Label>
            <Select onValueChange={onPermissionChange} value={permissions}>
                <SelectTrigger className='w-full h-26 -mt-3'>
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value='private'>
                            <div className='p-2 flex gap-4 justify-center items-center'>
                                <Lock/>
                                <article className='text-left flex flex-col'>
                                    <span> Private </span>
                                    <p>Your folder is private to you exclusively</p>
                                </article>
                            </div>
                        </SelectItem>
                        <SelectItem value='shared'>
                            <div className='p-2 flex gap-4 justify-center items-center'>
                                <Share/>
                                <article className='text-left flex flex-col'>
                                    <span> Shared </span>
                                    <p>Your folder is Shared to you and your friends</p>
                                </article>
                            </div>
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
        {permissions==="shared" && 
            <div>
                <CollaboratorSearch getCollaborator={(user)=>{addCollaborator(user);}} existingCollaborators={collaborators}>
                    <Button type='button' className='text-sm mt-4'>
                        <Plus/>
                        Add Collaborator
                    </Button>
                </CollaboratorSearch>
                <div className='mt-4'>
                    <span className='text-sm text-muted-foreground'>
                        Collaborators {collaborators.length || ""}
                    </span>
                    <ScrollArea className='h-[120px] overflow-y-scroll w-full rounded-md border border-muted-foreground/20'>
                        {collaborators.length>0 ? collaborators.map((collaborator)=>(<div className='p-4 flex justify-between items-center' key={collaborator.id}>
                            <div className='flex gap-4 items-center'>
                                <Avatar>
                                    <AvatarImage src="/avatars/7.png"/>
                                    <AvatarFallback>
                                        PJ
                                    </AvatarFallback>
                                </Avatar>
                                <div className='text-sm gap-2 text-muted-foreground overflow-hidden overflow-ellipsis sm:w-[300px] w-[140px]'>
                                    {collaborator.email}
                                </div>
                            </div>
                            <Button variant={"secondary"} onClick={()=>removeCollaborator(collaborator)}>
                                Remove
                            </Button>
                        </div>)) : (<div className='absolute right-0 left-0 top-o bottom-0 flex justify-center items-center'>
                            <span className='text-muted-foreground text-sm'>you have no friends</span>
                        </div>
                        )}
                    </ScrollArea>
                </div>
            </div>
        }
        <Alert variant={"destructive"}>
            <AlertDescription>
                Warning! Deleting your folder will permanently delete all data related to this folder
            </AlertDescription>
            <Button type={"submit"} size="sm" variant={'destructive'} className='mt-4 text-sm bg-destructive/40 border-2 border-destructive' onClick={async ()=> {
                if(!folderId) return;
                if(folderId) await deleteFolder(folderId); 
                toast({title:"suxes", description:"successfully deleted the folder"});
                dispatch({type:"DELETE_FOLDER",payload:folderId});
                router.replace("/dashboard");
            } }>
                Delete Folder
            </Button>
        </Alert>
        <p className='flex items-center gap-2 mt-6'>
            <UserIcon size={24}/> idk why i used profile lol
        </p>
        <Separator/>
        <div className='flex items-center'>
            <Avatar>
                <AvatarImage src="/avatars/7.png"/>
                <AvatarFallback>
                    <CypressProfileIcon/>
                </AvatarFallback>
            </Avatar>
            <div className='flex flex-col ml-6'>
                <small className='text-muted-foreground cursor-not-allowed'>
                    {user ? user.email : "loading..."}
                </small>
                <Label htmlFor='profilePic' className='text-sm text-muted-foreground'>Profile Picture</Label>
                <Input name="profilePic" type="file"  accept="image/*" placeholder='Profile Picture' onChange={onChangeProfilePicture} disabled={uploadingProfilePic}/>
            </div>
        </div>
        <LogoutButton>
            <div className='flex items-center'>
                <LogOut/>
            </div>
        </LogoutButton>
        <p className='flex items-center gap-2 mt-6'>
            <CreditCard size={20}/> Billing & Plan
        </p>
        <Separator/>
        <p className='text-muted-foreground '>
            You are currently on a {''} {subscription?.status === "active" ? "Pro" : "Free"} plan
        </p>
        <Link href={"/"} target="_blank" className='text-muted-foreground flex flex-row items-center gap-2'>
            View Plans <ExternalLink size={20}/>
            {/* WIP redirect directly to the plan section of the front page using some kind of attributes that i currently don't remember */}
        </Link>
        {subscription?.status === "active" ? <div>
            {/* <Button className='text-sm' type="button" variant={'secondary'} size={'sm'} onClick={redirectToCustomerPortal} disabled={loadingPortal}>
                Manage Subscriptions
            </Button> */}
        </div>
        :
        <div>
            {/* <Button variant={'secondary'} type="button" size={"sm"} className='text-sm' onClick={()=>setOpen(true)} >
                Start Plan
            </Button> */}
        </div>
        }
        </>
        <AlertDialog open={openAlertMessage}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to change permissions?
                    </AlertDialogTitle>
                    <AlertDescription>
                        Changin a shared folder to private will remove all the collaborators
                    </AlertDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={()=>{setOpenAlertMessage(false)}}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onClickAlertConfirm}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  )
}

export default SettingsForm