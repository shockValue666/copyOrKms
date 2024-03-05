"use server";
import {db} from '@/lib/supabase/db'
import {  collaborators, files, folders, profiles, subscriptions, users } from '../../../migrations/schema'
import { Collaborator, File, Folder, Profile, Subscription, User } from './supabase.types'
import { and, eq, ilike, notExists } from 'drizzle-orm'
import { validate } from 'uuid';
import { revalidatePath } from 'next/cache';


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
    // const response = await db.select().from(users).where(eq(users.id,id))
    const response = await db.query.users.findFirst({where:(user,{eq})=> eq(user.id,id)}) 
    return response;
}

export const getUsersFromSearch = async (search:string) => {
    const response = await db.select().from(users).where(ilike(users.email,`%${search}%`))
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
        console.log("file: ",file)
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

export const addCollaborators = async (users:User[],folderId:string) => {
    const response = users.forEach(async (user:User) => {
        const userExists = await db.query.collaborators.findFirst({
            where:(u,{eq})=> and(eq(u.userId,user.id),eq(u.folderId,folderId))
        });
        if(!userExists) await db.insert(collaborators).values({folderId,userId:user.id})
    })
}

export const getCollaboratingFolders = async (userId:string) => {
    if(!userId) return [];
    const collaboratedFolders = await db.select({
        id:folders.id,
        createdAt:folders.createdAt,
        folderOwner:folders.folderOwner,
        title: folders.title,
        iconId:folders.iconId,
        data:folders.data,
        inTrash:folders.inTrash,
        bannerUrl:folders.bannerUrl
    })
        .from(users)
        .innerJoin(collaborators,eq(users.id,collaborators.userId))
        .innerJoin(folders,eq(collaborators.folderId,folders.id))
        .where(eq(users.id,userId)) as Folder[]

    return collaboratedFolders;

}

export const getFileslol = async (folderId:string)=> {
    const isValid=validate(folderId)
    if(!isValid){
        console.log("folderId: ",folderId)
        return {
            data:null,
            error:"error, invalid workspace id from uuid"
        }
    }
    try {
        const results: File[] | [] = await db
            .select()
            .from(files)
            .orderBy(files.createdAt)
            .where(eq(files.folderId,folderId))
            return {
                data:results,
                error:null
            }
    } catch (error) {
        console.log("error from getting files: ",error)
        return{
            data:null,
            error:`error retrieving the files lol danah tsaf ${error}`
        }   
    }
}


export const  getPrivateFolders = async (userId:string) => {
    if(!userId) return [];
    const privateWorkspaces = await db.select({
        id:folders.id,
        createdAt:folders.createdAt,
        folderOwner:folders.folderOwner,
        title: folders.title,
        iconId:folders.iconId,
        data:folders.data,
        inTrash:folders.inTrash,
        bannerUrl:folders.bannerUrl
    })
    .from(folders)
    .where(
        and(
          notExists(
            db
              .select()
              .from(collaborators)
              .where(eq(collaborators.folderId, folders.id))
          ),
          eq(folders.folderOwner, userId)
        )
      ) as Folder[];
    return privateWorkspaces;
}


export const getSharedFolders = async (userId:string) => {
    if(!userId) return [];
    const sharedWorkspaces = (await db
        .selectDistinct({
          id: folders.id,
          createdAt: folders.createdAt,
          folderOwner: folders.folderOwner,
          title: folders.title,
          iconId: folders.iconId,
          data: folders.data,
          inTrash: folders.inTrash,
          bannerUrl: folders.bannerUrl,
        })
        .from(folders)
        .orderBy(folders.createdAt)
        .innerJoin(collaborators, eq(folders.id, collaborators.folderId))
        .where(eq(folders.folderOwner, userId))) as Folder[];
    
        return sharedWorkspaces;

}

export const deleteFolder = async (folderId:string) => {
    const response = await db.delete(folders).where(eq(folders.id,folderId))
    return response;
}

export const getCollaborators = async (folderId:string) => {
    const response = await db.select().from(collaborators).where(eq(collaborators.folderId,folderId))
    if(!response.length) return []
    const userInformation:Promise<User | undefined>[] = response.map(async (user) => {
        const exists = db.query.users.findFirst({
            where:(u,{eq})=> eq(u.id,user.userId)
        })
        return exists;
    })
    const resolvedUsers = await Promise.all(userInformation);
    return resolvedUsers.filter(Boolean) as User[];
}

export const removeCollaborators = async (users:User[],folderId:string) => {
    const reponse = users.forEach(async (user:User)=> {
        const userExists = await db.query.collaborators.findFirst({
            where:(u,{eq})=> and(eq(u.userId,user.id),eq(u.folderId,folderId))
        })
        if(userExists) await db.delete(collaborators).where(and(eq(collaborators.folderId,folderId),eq(collaborators.userId,user.id)));        
    })
}


export const updateFolder = async (folder:Partial<Folder>,folderId:string) => {
    if(!folderId) return {data:null,error:"Error, no workspace id"}
    try {
        await db.update(folders).set(folder).where(eq(folders.id,folderId))
        revalidatePath(`/dashboard`); // it helps to revalidate the path
        //revalidate the path means that the page will be revalidated and the data will be updated
        return {data:null,error:null}
    } catch (error) {
        return {data:null,error:`Error at updating the workspace: ${error}`}
    }
}


export const updateFile = async (file:Partial<File>,fileId:string) => {
    try {
        await db.update(files).set(file).where(eq(files.id,fileId))
        return {data:null,error:null}
    } catch (error) {
        return {data:null,error:`error at updating the file: ${error}`}
    }
}


export const deleteFile = async (fileId:string) => {
    await db.delete(files).where(eq(files.id,fileId));
}

export const getFileDetails = async(fileId:string) => {
    const isValid = validate(fileId);
    if(!isValid) return {data:[],error:"Error, invalid file id from uuid"}
    try {
        const result = await (db.select().from(files).where(eq(files.id,fileId)).limit(1)) as File[] | [];
        return {data:result,error:null}
    } catch (error) {
        return {data:[],error:`Error at getting the file details: ${error}`}
    }
}


export const getFolderDetails = async(folderId:string) => {
    const isValid = validate(folderId);
    if(!isValid) return {data:[],error:"Error, invalid file id from uuid"}
    try {
        const result = await (db.select().from(folders).where(eq(folders.id,folderId)).limit(1)) as Folder[] | [];
        console.log("result from getFolderDetails: ",result)
        return {data:result,error:null}
    } catch (error) {
        console.log("error at getFolderDetails: ",error)
        return {data:[],error:`Error at getting the folder details: ${error}`}
    }
}

export const fileExists = async (fileTitle:string,folderId:string) => {
    try {
        const result = await db.query.files.findFirst({
            where:(f,{eq})=> and(eq(f.title,fileTitle),eq(f.folderId,folderId),eq(f.inTrash,""))
        })
        console.log("result from fileExists: ",result);   
        return {
            data:result,
            error:null
        
        }
    } catch (error) {
        return {
            data:null,
            error:`error at fileExists: ${error}`
        }   
    }
    // const userExists = await db.query.collaborators.findFirst({
    //     where:(u,{eq})=> and(eq(u.userId,user.id),eq(u.folderId,folderId))
    // });
}