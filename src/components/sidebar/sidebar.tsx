import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react'
import {cookies} from 'next/headers'
import { getCollaboratingFolders, getFileslol, getPrivateFolders, getSharedFolders, getUserSubscriptionStatus }from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
// import WorkspaceDropdown from './workspace-dropdown';
// import PlanUsage from './plan-usage';
// import NativeNavigation from './native-navigation';
// import { ScrollArea } from '../ui/scroll-area';
// import FoldersDropdownList from './folders-dropdown-list';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import FolderDropdown from './folder-dropdown';
import NativeNavigation from './native-navigation';
import { ScrollArea } from '../ui/scroll-area';
import FilesDropdownList from './files-dropdown-list';

interface SidebarPros{
    params:{folderId:string};
    className?:string
}

const Sidebar:React.FC<SidebarPros> = async ({params,className}) => {
    console.log("params from [workspaceId]",params)
    const supabase = createServerComponentClient({cookies})

    //check if there is a user
    const {data:{user}} = await supabase.auth.getUser()
    // const {user} = useSupabaseUser();
    if(!user) return;
    //subscription status
    const {data:subscriptionData,error:subscriptionError} = await getUserSubscriptionStatus(user.id);
    //access to the folders
    const {data:fileData,error:fileError} = await getFileslol(params.folderId);
    //error
    if(subscriptionError){
        console.log("subscriptionError",subscriptionError)
    }
    if(fileError)[
        console.log("fileError",fileError)
    ]
    if(subscriptionError || fileError) redirect(`/?error=${subscriptionError || fileError}`);
    const [privateWorkspaces,collaboratingWorkspaces,sharedWorkspaces] = 
        await Promise.all([getPrivateFolders(user.id),getCollaboratingFolders(user.id),getSharedFolders(user.id)])
  return (
    <aside className={twMerge(
        'hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between',
        className
    )}>
        <div>
            idk
            <FolderDropdown defaultValue={[...privateWorkspaces,...collaboratingWorkspaces,...sharedWorkspaces].find(workspace=>workspace.id==params.folderId)} sharedFolders={sharedWorkspaces} collaboratingFolders={collaboratingWorkspaces} privateFolders={privateWorkspaces}></FolderDropdown>
            {/* <PlanUsage foldersLength={fileData?.length || 0} subscription={subscriptionData} />   */}
            <NativeNavigation myFolderId={params.folderId}></NativeNavigation>
            <ScrollArea className='overflow-scroll relative h-[450px] border border-green-400 '>
                <div className='pointer-events-none w-full absolute bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-40'>
                </div>
                <FilesDropdownList foldersFiles={fileData} folderId={params.folderId}/>
            </ScrollArea>
        </div>
    </aside>
  )
}

export default Sidebar