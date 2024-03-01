"use server";
import {db} from '@/lib/supabase/db'
import {  folders, profiles, subscriptions, users } from '../../../migrations/schema'
import { Folder, Profile, Subscription, User } from './supabase.types'
import { ilike } from 'drizzle-orm'


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

// export const getFiles = async () => {

// }

//function that will fetch the folders
export const getFolders = async () => {
    const response = await db.select().from(folders)
    return response;
}


export const createFolder = async(folder:Folder) => {
    try{
        const response = await db.insert(folders).values(folder);
        return {data:null,error:null}
    }catch(err){
        console.log("error at creating folder: ",err)
        return {data:null,error:"Error at creating a folder"}
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