"use server";
import {db} from '@/lib/supabase/db'
import {  files, folders, profiles, subscriptions, users } from '../../../migrations/schema'
import { File, Folder, Profile, Subscription, User } from './supabase.types'
import { eq, ilike } from 'drizzle-orm'
import { validate } from 'uuid';


export const addProfile = async (profile:Profile) => {
    const response = await db.insert(profiles).values(profile)
    return response;
}

export const addUser = async (user:User) => {
    const response = await db.insert(users).values(user)
    return response;
}

export const getUserFromName = async (name:string) => {
    const response = await db.select().from(users).where(ilike(users.fullName,`${name}%`))
    return response;
}
export const getUserFromId = async (id:string) => {
    const response = await db.select().from(users).where(eq(users.id,id))
    return response;
}

// export const getFiles = async () => {

// }

//function that will fetch the folders
export const getFolderFromUserIdFirst = async (userId:string) => {
    try {
        const response = await db.query.folders.findFirst({
            where:((folder,{eq})=>eq(folder.folderOwner,userId))
        })
        return response;   
    } catch (error) {
        console.log("error at getFoldersFromUserId: ",error)
        return null;
    }
}

export const getFilesFromFolderId = async (folderId:string) => {
    const isValid = validate(folderId)
    if(!isValid){
        return {data:null,error:"Error validating the folderId"}
    }
    try {
        const response = (await db.select().from(files).orderBy(files.createdAt).where(eq(files.folderId,folderId))) as File[] | [];
        return {data:response,error:null};
    } catch (error) {
        console.log("error at getFilesFromFolderId: ",error)
        return {data:null,error:`error at fetching files at getFilesFromFolderId: ${error}`};
    }

}


export const createFolder = async(folder:Folder) => {
    try{
        const response = await db.insert(folders).values(folder);
        return {data:response,error:null}
    }catch(err){
        console.log("error at creating folder: ",err)
        return {data:null,error:"Error at creating a folder"}
    }
}

export const createFile = async (file:File) => {
    try{
        const response = await db.insert(files).values(file);
        return {data:response,error:null}
    }catch(err){
        console.log("error at creating file: ",err)
        return {data:null,error:"Error at creating a file"}
    }

}


export const getUserSubscriptionStatus = async (userId:string) => {
    try {
        const data = await db.query.subscriptions.findFirst({
            where:((subscription,{eq})=> eq(subscription.userId,userId))
        })
        if(data){
            return {
                data:data as Subscription,
                error:null
            }
        }else{
            return {
                data:null,
                error:null
            }
        }
    } catch (error) {
        console.log("error: ",error)
        return {
            data:null,
            error:`Error: ${error}`
        }
    }
}

export const getFiles = async (folderId: string) => {
    try {
        const data = await db.query.files.findMany({
            where:((file,{eq})=> eq(file.folderId,folderId))
        })
    }catch(err){    
        console.log("error at getFiles: ",err)
    }
}