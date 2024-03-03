"use client";
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { Folder, User } from '@/lib/supabase/supabase.types';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { SelectGroup } from '@radix-ui/react-select';
import { Divide, Lock, Plus, Share } from 'lucide-react';
import { Button } from '../ui/button';
import { v4 } from 'uuid';
import { addCollaborators, createFolder } from '@/lib/supabase/queries';
import { useAppState } from '@/lib/providers/state-provider';
import { ToastAction } from '../ui/toast';
import { useToast } from '../ui/use-toast';
import CollaboratorSearch from './collaborator-search';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
  

interface FolderCreatorProps {
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
}

const FolderCreator:React.FC<FolderCreatorProps> = ({
    setIsOpen
}) => {
    const {dispatch} = useAppState();
    const {toast} = useToast();
    const [permissions,setPermissions] = useState("private");
    const [title, setTitle] = useState("");
    const [collaborators,setCollaborators] = useState<User[]>([]);
    const {user} = useSupabaseUser();
    const router = useRouter();
    const [isLoading,setIsLoading] = useState(false);

    const addCollaborator = (user:User) => {
        setCollaborators([...collaborators,user]);
    }

    const removeCollaborator = (user:User) => {
        setCollaborators(collaborators.filter(c=>c.id!==user.id))
    }
    const createItem = async () => {
        setIsLoading(true)
        const uuid = v4();
        if(user?.id){
            const newFolder:Folder = {
                data:null,
                createdAt:new Date().toISOString(),
                iconId:"🤑",
                id:uuid,
                inTrash:"",
                title,
                folderOwner:user.id,
                bannerUrl:""
            }
            if(permissions === "private"){
                const {data,error} = await createFolder(newFolder);
                if(error) console.log("error at creating the folder: ",error)
                dispatch({
                    type:"ADD_FOLDER",
                    payload:{... newFolder,files: [] }
                })
                toast({
                    title: 'Folder Created',
                    description: `${newFolder.title} has been created successfully.`,
                    action:(
                        <ToastAction altText="Folder created suxesfully">SUXES</ToastAction>
                    )
                })
                router.replace(`/dashboard/${newFolder.id}`)
            }

            if(permissions === "shared"){
                await createFolder(newFolder);
                await addCollaborators(collaborators,uuid);
                dispatch({
                    type:"ADD_FOLDER",
                    payload:{... newFolder,files: [] }
                })
                toast({
                    title: 'Folder Created',
                    description: `${newFolder.title} has been created successfully.`,
                    action:(
                        <ToastAction altText="Folder created suxesfully">SUXES</ToastAction>
                    )
                })
                router.refresh();
            }
            setIsLoading(false);
            setIsOpen(false);
        }
    }

  return (
    <div className='flex gap-4 flex-col'>
        <div>
            <Label htmlFor='name' className='text-sm text-muted-foreground mb-2'>Name folder creator</Label>
            <div className='flex justify-center items-center gap-2'>
                <Input name='name' value={title} placeholder='Folder Name' onChange={(e)=>{setTitle(e.target.value)}} />
            </div>
        </div>
        <div>
            <Label htmlFor='name' className='text-sm text-muted-foreground mb-2'>Name folder creator</Label>
            <div className='flex justify-center items-center gap-2'>
                <Input name='name' value={title} placeholder='Folder Name' onChange={(e)=>{setTitle(e.target.value)}} />
            </div>
        </div>
        <>
            <Label htmlFor='permissions' className='text-sm text-muted-foreground'>Permissions</Label>
            <Select onValueChange={(val)=>{setPermissions(val)}} defaultValue={permissions}>
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
                        </div>)}
                    </ScrollArea>
                </div>
            </div>
        }
        <Button type={"button"} disabled={!title || (permissions==="shared" && collaborators.length===0) || isLoading}
            variant={"secondary"}
            onClick={createItem}>
                Create
        </Button>
    </div>
  )
}

export default FolderCreator

