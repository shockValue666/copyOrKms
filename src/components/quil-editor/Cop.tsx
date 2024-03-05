"use client";
import { AiContext } from '@/lib/providers/ai-context-provider'
import { SubjectSchema } from '@/lib/types';
import { CopilotTextarea } from '@copilotkit/react-textarea';
import React, { useContext, useEffect, useState } from 'react'
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createFile, updateFolder } from '@/lib/supabase/queries';
import { useAppState } from '@/lib/providers/state-provider';
import { v4 } from 'uuid';
import { File } from '@/lib/supabase/supabase.types';


const Cop = () => {
    const [subject,setSubject] = useState<string>("");
    const [hasSubject,setHasSubject] = useState<boolean>(false)
    const aiprovider = useContext(AiContext)
    const {folderId,dispatch}  = useAppState();
    useEffect(()=>{
        console.log('aiprovider: ', aiprovider)
    },[aiprovider])

    const form = useForm<z.infer<typeof SubjectSchema>>({
      mode:"onChange",
      resolver:zodResolver(SubjectSchema),
      defaultValues:{
        'subject':subject
      }
    })
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async ({subject}:z.infer<typeof SubjectSchema>) => {
      console.log('subject: ', subject)
      setSubject(subject);
      setHasSubject(true);
    }

    //save folder data
    const saveData = async () => {
        const data = {
            subject:subject,
            text:text
        }
        console.log('data: ', JSON.stringify(data))
        if(!folderId) return;
        await updateFolder({data:JSON.stringify(data)},folderId)
        const newFile:File = {
            data: JSON.stringify(data),
            id: v4(),
            createdAt: new Date().toISOString(),
            title: subject,
            iconId: "⚡️",
            inTrash: null,
            bannerUrl: null,
            folderId: folderId
        }
        const {data:creteFileData,error:createFileError} = await createFile(newFile)
        console.log('creteFileData: ', creteFileData, "createFileError: ", createFileError)
        dispatch({type:"ADD_FILE",payload:{file:newFile,folderId}})
    }
    const [text,setText] = useState<string>("")
  return (
    <div className='flex flex-col justify-center items-center w-full my-16 gap-8'>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-[50%] sm:justify-center sm:w-[400px] space-y-6 flex flex-col'>
            <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                    <Input placeholder="Write a subject..." {...field} />
                </FormControl>
                <FormDescription>
                    Write the subject you want to analyze
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit" className="bg-black text-white border-2 w-[50%]">set subject</Button>
        </form>
        </Form>
        <CopilotTextarea
            disabled={subject===""}
            className="px-4 py-4 w-[90%] h-[300px] bg-black text-white border border-white rounded-md"
            value={text}
            onValueChange={(value: string) => setText(value)}
            placeholder="Write your text here..."
            autosuggestionsConfig={{
            textareaPurpose: subject,
            chatApiConfigs: {
                suggestionsApiConfig: {
                forwardedParams: {
                    max_tokens: 15,
                    stop: [".", "?", "!"],
                },
                },
            },
            }}
        />
        <div>
          <Button onClick={saveData} className='bg-white text-black'>save</Button>
        </div>
        </div>
  )
}

export default Cop