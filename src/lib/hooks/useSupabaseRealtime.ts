import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import React, { useEffect } from 'react'
import { useAppState } from '../providers/state-provider';
import { useRouter } from 'next/navigation';
import { File } from '../supabase/supabase.types';
import { useSupabaseUser } from '../providers/supabase-user-provider';

const useSupabaseRealtime = () => {
  const supabase = createClientComponentClient();
  const {user} = useSupabaseUser()
  const {dispatch,state,folderId:selectedFolder} = useAppState();
  const router = useRouter();

  useEffect(()=>{
    const channel = supabase
      .channel('db-changes')
      .on("postgres_changes",{event:"*",schema:"public",table:"files"},async (payload)=>{
        console.log("change received: ",payload)
        if(payload.eventType==="INSERT"){
          console.log("received realtime insert");
          const {folder_id:folderId, id:fileId} = payload.new;
          if(!state.folders.find((folder)=>folder.id===folderId)
            ?.files.find(file=>file.id===fileId)
            )
            {
              const newFile:File = {
                id:payload.new.workspace_id,
                title:payload.new.title,
                createdAt:payload.new.created_at,
                iconId:payload.new.icon_id,
                data:payload.new.data,
                inTrash:payload.new.in_trash,
                folderId:payload.new.folder_id,
                bannerUrl:payload.new.banner_url
              }
              dispatch({type:'ADD_FILE',payload:{ folderId, file:newFile}})
            } 
        }else if(payload.eventType==="DELETE"){
          let workspaceId ="";
          let folderId ="";
          const fileExists = state.folders.some(folder=>
            folder.files.some(file=>{
                    if(file.id===payload.old.id){
                    folderId = folder.id;
                    // folderId = folder.id;
                    return true;
                    }
                }
              )
            )

          if(fileExists && folderId){
            router.replace(`/dashboard/${folderId}`);
            dispatch({type:'DELETE_FILE',payload:{folderId,fileId:payload.old.id}})
          }

        } else if (payload.eventType==="UPDATE"){
          const {folder_id:folderId, id:fileId} = payload.new; 
          state.folders.some(folder=>
            folder.files.some(file=>
                {
                  if(file.id===payload.new.id){
                    dispatch({type:'UPDATE_FILE',payload:{folderId,fileId:payload.new.id,file:{title:payload.new.title,iconId:payload.new.icon_id,inTrash:payload.new.in_trash}}})
                  }
                }
            )
          )
        }
      }).subscribe();

    //   const folderChannel = supabase.channel('db-changes')
    //     .on("postgres_changes", {event: "*", schema: "public", table: "folders"}, async (payload) => {
    //       console.log("Folder change received: ", payload);
    //       if(payload.eventType==="INSERT"){
    //         console.log("INSERTING FOLDER");
    //         const {id:folderId} = payload.new;
    //         if(!state.workspaces.find((workspace)=>workspace.id===workspaceId)?.folders.find(folder=>folder.id===folderId)){
    //           const newFolder = {
    //             id:folderId,
    //             title:payload.new.title,
    //             createdAt:payload.new.created_at,
    //             iconId:payload.new.icon_id,
    //             data:payload.new.data,
    //             inTrash:payload.new.in_trash,
    //             workspaceId:payload.new.workspace_id,
    //             bannerUrl:payload.new.banner_url
    //           }
    //           dispatch({type:'ADD_FOLDER',payload:{workspaceId,folder:{...newFolder,files:[]}}})
    //       }
    //     } else if(payload.eventType==="DELETE"){
    //       console.log("delete event shit")
    //       let workspaceId ="";
    //       let folderId ="";
    //       const folderExists = state.workspaces.some(workspace=>
    //         workspace.folders.some(folder=>
    //             {
    //               if(folder.id===payload.old.id){
    //                 workspaceId = workspace.id;
    //                 folderId = folder.id;
    //                 return true;
    //               }
    //             }
    //           )
    //         )

    //       if(folderExists && workspaceId && folderId){
    //         router.replace(`/dashboard/${workspaceId}`);
    //         dispatch({type:'DELETE_FOLDER',payload:{workspaceId,folderId}})
    //       }
          
    //     } else if (payload.eventType==="UPDATE"){
    //       const {id:folderId,workspace_id:workspaceId} = payload.new
    //       state.workspaces.some(workspace=>
    //         workspace.folders.some(
    //           folder=>{
    //             if (folder.id===folderId){
    //               dispatch({type:"UPDATE_FOLDER",payload:{folder:{inTrash:`Deleted by ${user?.email}`},workspaceId,folderId:folder.id}})
    //             }
    //           }
    //         )
    //       )

    //     }
    //     }).subscribe();
      return () => {
        channel.unsubscribe();
        // folderChannel.unsubscribe();
      }
  },[supabase,state,selectedFolder])

  return true;
}

export default useSupabaseRealtime