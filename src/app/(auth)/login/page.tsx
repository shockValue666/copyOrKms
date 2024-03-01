"use client";
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { FormSchema } from '@/lib/types';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../../../public/images/cypresslogo.svg'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/globals/Loader';
import {actionLoginUser} from '@/lib/server-actions/auth-actions'

const LoginPage = () => {
    //for navigation
    const router = useRouter();
    const [submitError,setSubmitError] = useState("");

    //react-hook-form: useform: custom hook management for forms, -it takes one object as optional arguement
    //zod: -typescript-first schema validation and declaration library, -better than interfaces because it checks api returns
    const form = useForm<z.infer<typeof FormSchema>>({
        //ig when the validation happens
        mode:"onSubmit", //https://react-hook-form.com/docs/useform#mode -obviously when is the validation happening, onchange may have 
        //performance issues

        //ig how the validation happens
        resolver:zodResolver(FormSchema), //-use extrenal validation for the form
        defaultValues: {email: "", password:""}
    })

    //return prop of useForm obv. formstate: -info about the object state, -helps keeping track of info about user interaction
    //with the form -dirtyharry shit lol
    const isLoading = form.formState.isSubmitting;

    //set function onSubmit type submitHandler, lol the FormSchema is just email and password
    const onSubmit:SubmitHandler<z.infer<typeof FormSchema>> = async (
        //obv the data from the input
        formData
    )=> {
        //signins in user , the function is in lib/server-action/auth-actions,ts and it's a function using createRouteHandlerClient 
        //with cookies so maybe i will have to see it obv returns an error and a really interesting response
        const {error} = await actionLoginUser(formData);
        console.log("error from auth login: ",error)
        if(error){
            form.reset();
            setSubmitError(error.message);
            return;
        }
        //immediately after loging in redirecting to my cock
        router.replace("/dashboard")
    }
  return (
    //form from shadcn: lol it uses react-hook-form and zod, -it provides reusable components,
    //A FormField component for building controlled(= the value of the input field is controlled by the state within
    // the component) form fields, -form validation using zod, -react.useid() for generating unique ids, 
    //-correct aria attributes based on the state 
    // as you can see the reason i used zod in the beggining of the file is because
    //it is needed for form to pass as an argument in the object of Form from shadcn
    <Form {...form} >
        <form action="" onChange={()=>{
            if(submitError){
                setSubmitError('');
            }
        // onSubmit, handleSubmit function of the form in react-hook-form
        //runs only if validation is successful
        }} onSubmit={form.handleSubmit(onSubmit)} className='w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col'>
            <Link href={"/"} className='w-full flex justify-left items-center'>
                <Image src={Logo} alt='cypress Logo' width={50} height={50}/>
                <span className='font-semibold dark:text-white text-4xl first-letter:ml-2 '>
                    cypress.
                </span>
            </Link>
            <FormDescription
                className='text-foreground/60'
            >
                An all-In-One Collaboration and Productivity Platform
            </FormDescription>
            <FormField
                //isLoading is a return from form form.formState.isSubmitting
                disabled={isLoading}
                //control react-hook-form: -an object that contains methods for registering components into React Hook Form and
                //handling their submissions
                control={form.control}
                name="email"
                //the render prop is a pattern in react for sharing code between components using a prop whose value
                //is a function. it takes an arguement here destructed as {field} which provides properties and 
                //methods related to this specific form field, managed by react-hook-form
                render={({ field }) => (
                    <FormItem>
                        {/* wraps the actual input control , maybe displays validation states? */}
                    <FormControl>
                        <Input
                        type="email"
                        placeholder="Email"
                        
                        // spread syntax in js. passes down all properties and methods from the field object to the input component 
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
                {submitError && <FormMessage>{submitError}</FormMessage>}
                <Button
                type="submit"
                className="w-full p-6"
                size="lg"
                disabled={isLoading}
                >
                {!isLoading ? 'Login' : <Loader />}
                </Button>
                <span className="self-container">
                    Dont have an account?{' '}
                    <Link
                        href="/signup"
                        className="text-primary"
                    >
                        Sign Up
                    </Link>
                </span>
        </form>
    </Form>
  )
}

export default LoginPage