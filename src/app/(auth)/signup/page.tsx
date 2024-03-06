"use client";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx'//
//constructing className strings conditionally, tiny
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation' //
//useSearchParams: is a hook that is used to read and modify the query string in the URL for the current location.
//it returns a value which si the current params, and a function to modify them.
//THIS MEANS I CAN CHANGE THE URL
//SAUCE: THIS MEANS THAT I CAN CREATE A URL SHORTNR SAAS??????
import React, { useMemo, useState,Suspense } from 'react'//
//use memo is a React Hook that lets you cache the result of a calculation between re-renders? idk why we need to
//cache the result of a calculation between re-renders?
import { useForm } from 'react-hook-form';
import { z } from 'zod' //
//zod is any kind of data, here it's an object
//zod can be from a string to a comlex object
//the goal is to eliminate duplicate type declarations
// we just declare the validation once and zod will 
//automatically infer the static Typescript type.
//it's easy to compose simpler types=>copmlex 
//data-structures
import Image from 'next/image'
import Logo from '../../../../public/images/newLogo.png'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/globals/Loader'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MailCheck } from 'lucide-react';//
//if there is no codeexchangeerror this means but confirmation exists then we use this icon
//this means that the user will have successfully signed up on supabase (thus the confirmation=true)
//but there will probably be an error with the confirmation email
import { FormSchema } from '@/lib/types';
import { actionSignUpUser } from '@/lib/server-actions/auth-actions';

//the point is we create a schema of an object with zod
//just like we could do with interface
const SignupFormSchema = z.object({
    email:z.string().describe('Email').email({message:"Invaddid email"}),
    password:z.string().describe("Password").min(6,"PASSWORD mus have something"),
    confirmPassword:z.string().describe("Confirm Password").min(6,"password mus")
}).refine((data)=>data.password===data.confirmPassword,{
    message:"Password don't match",
    path:['confirmPassword']
})

const Signup = () => {
    //navigation
    const router = useRouter();
    //you already know the sauce with searchparams
    const searchParams = useSearchParams();
    const [submitError,setSubmitError] = useState('');
    const [confirmation,setConfirmation] = useState<boolean>();


    //here i am using useMemo to make the 
    //error_description persistent? across
    //my navigation URLs?? ig that's what's up
    //because ig it's reasonable to want to know
    //the error that the user had
    // yeah ig we use the codeexchange error in order to 
    //monitor whether there is any error with the 
    //email confirmation. i guess it will be rare that we will have
    //one but just in case.
    const codeExchangeError = useMemo(()=>{
        if(!searchParams) return '';
        return searchParams.get("error_description");
    },[searchParams])

    //here useMemo is used set some styles? ig that's it
    const confirmationAndErrorStyles = useMemo(()=>{
        return clsx('bg-primary',{
            "bg-red-500/10":codeExchangeError,
            "border-red-500/50":codeExchangeError,
            "text-red-700":codeExchangeError
        })
        //clsx is a library to make conditional classnames
    },[])


    //use-form is a react-hook-form function and returns, rhf is mainly form validations
    //use-form is -a custom hook for managing forms with ease
    //-it takes an object as an optional arguement
    //-the object has generic props (e.g. mode, revalidateMode, defaultValues, etc)
    //-it also has schema validation props(e.g. resolver:integrates with zod which is a schema validation library
    //, context: a context to supply for the schema validation)
    //the for useform function returns an object which includes a bunch of properties: 
    //e.g.: register, unregister, formState, handleSubmit etc.
    const form = useForm<z.infer<typeof SignupFormSchema>>({
        mode:"onChange", //behaviour before submit
        reValidateMode:"onChange", //behaviour after input gets revalidated
        resolver:zodResolver(SignupFormSchema),
        defaultValues:{
            email:"",
            password:"",
            confirmPassword:""
        }
    })
    const isLoading = form.formState.isSubmitting;

    //if the user successfully manages to signup,
    //which means successfully manages to communicate with supabas
    //we set the confirmation to true
    //if he faisl we set the submit error which will be appeared later on
    const onSubmit = async ({email,password}:z.infer<typeof FormSchema>) => {
        const {error} = await actionSignUpUser({email,password});
        if(error){
            setSubmitError(error.message);
            form.reset();
            return;
        }
        setConfirmation(true);
        //we don't have email validation yet so i will redirecto to dashboard
        router.push("/dashboard");
    }

  return (
    <Form {...form}>
        <form action="" onChange={()=>{if(submitError) setSubmitError("")}} onSubmit={form.handleSubmit(onSubmit)}
        className='w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col'
        >
            <Link href={"/"} className='w-full flex justify-left items-center'>
                <Image src={Logo} alt='FastNoteAI Logo' width={50} height={50} className='rounded-lg'/>
                <span className='font-semibold dark:text-white text-4xl first-letter:ml-2 '>
                    FastNoteAI.
                </span>
            </Link>
            <FormDescription
                className='text-foreground/60'
            >
                An all-In-One Collaboration and Productivity Platform
            </FormDescription>
            {!confirmation && !codeExchangeError && (
                <>

                {/* FormField is mainly used as an independent component of the form,
                ig the main advantage is that we can "decentralize" the form
                so we can monitor the errors easier*/}
                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input
                                type="email"
                                placeholder="Email"
                                {...field}
                                />
                            </FormControl>
                            {/* <FormMessage /> */}
                            </FormItem>
                        )}
                    />
                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input
                                type="password"
                                placeholder="Password"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <Input
                                type="password"
                                placeholder="Confirm Password"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className='w-full p-6 bg-white text-black' disabled={isLoading}>
                        {!isLoading ? "Create Account" : <Loader/>}
                    </Button>
                </>
            )}
            
                {submitError && <FormMessage>{submitError}</FormMessage>}
                <span className="self-container">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-primary"
                    >
                        Login
                    </Link>
                </span>
                {
                    (confirmation || codeExchangeError) && 
                        <>
                            <Alert className={confirmationAndErrorStyles}>  
                                {!codeExchangeError && (
                                    
                                    <MailCheck className='h-4 w-4'/>
                                )}
                                    <AlertTitle>
                                        {codeExchangeError ? "Invalid Link" : "Check your email"}
                                    </AlertTitle>
                                    <AlertDescription>
                                        {codeExchangeError || "an email confirmation has been sent"}
                                    </AlertDescription>
                            </Alert>
                        
                        </>
                }
        </form>
    </Form> 
  )
}

export default Signup


//the thing i don't understand with this code is how we handle the email confirmation?
//for example how we can validate that someone has truly confirmed the email?
//maybe he has just refreshed the page? idk