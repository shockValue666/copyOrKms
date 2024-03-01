"use server";
import { z } from "zod";
import { FormSchema } from "../types";
import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs'
import { cookies } from "next/headers";
import { addProfile, addUser, createFolder } from "../supabase/queries";
import { v4 } from "uuid";
import { Folder } from "../supabase/supabase.types";

export async function actionLogCock(){
    console.log("cockies: ",cookies().getAll())
}


export async function actionLoginUser({email,password}:z.infer<typeof FormSchema>){

    const supabase = createRouteHandlerClient({cookies})
    
    //response returns AuthTokenResponse, it's a JSON object that contains
    //an access token, token type, expiration time, and refresh token. It is 
    //returned by supabase when a user successfully logs in or signs up. The 
    //access token is a JSON web token (JWT) that authorizes a client
    const response = await supabase.auth.signInWithPassword({
        email,
        password
    })

    // const newFolder:Folder = {
    //     id:v4(),
    //     createdAt:new Date().toISOString(),
    //     title:"another shit  folder from my cock",
    //     data:"some data",
    //     inTrash:null,
    //     bannerUrl:null,
    //     iconId:"💰"
    //   }
    // const folderResponse = await createFolder(newFolder);
    // console.log(folderResponse)

    // console.log("response: ", response)
    return response;

}

export async function actionSignUpUser({email,password}:z.infer<typeof FormSchema>){
    const supabase = createRouteHandlerClient({cookies})
    // const {data} = await supabase.from("profiles").select("*").eq("email",email);
    const {data} = await supabase.from("users").select("*").eq("email",email);
    console.log("data from profiles obviously doesn't exist so i gotta use users: ",data)
    if(data?.length){
        return {
            error: {
                message: "User already exists",
                data
            }
        }
    }
    const response = await supabase.auth.signUp({
        email,
        password,
        options:{
            emailRedirectTo:`${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`
        }
    })
    if(response.data.user){
        const res = await addProfile({
            referenceId:response.data.user.id,
            fullName:response.data.user.email || "",
            phone:"",
            id:v4()
        })
        // const anotherRes = await addUser({
        //     id:response.data.user.id,
        //     email:response.data.user.email || "",
        //     fullName:response.data.user.email || "",
        //     avatarUrl:null,
        //     billingAddress:null,
        //     paymentMethod:null
        // })
        console.log("res from inserting into public's users table: ", res)
    }
    // if(response.data && !response.error){
    //     const {data:insertData,error:insertErrro} = await supabase.from("users").insert({
    //         id:response.data.user?.id,
    //         email:response.data.user?.email
    //     })
    //     if(insertErrro){
    //         console.log("error at adding to the public users after authentication: ",insertErrro)
    //     }
    // }
    return response;
}