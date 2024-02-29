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

const Page = () => {
  const [subject,setSubject] = useState<string>("racism in the 21st century");
    const aiprovider = useContext(AiContext)
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
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                Write the subject you want to analyze
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="text-primary border">Submit</Button>
      </form>
    </Form>


      <CopilotTextarea
        className="px-4 py-4 w-[50%] text-black"
        value={text}
        onValueChange={(value: string) => setText(value)}
        placeholder="What are your plans for your vacation?"
        autosuggestionsConfig={{
          textareaPurpose: "Travel notes from the user's previous vacations. Likely written in a colloquial style, but adjust as needed.",
          chatApiConfigs: {
            suggestionsApiConfig: {
              forwardedParams: {
                max_tokens: 20,
                stop: [".", "?", "!"],
              },
            },
          },
        }}
      />
    </div>
  )
}

export default Page


// "use client";

// import { useMakeCopilotReadable } from '@copilotkit/react-core';
// import { useMakeCopilotDocumentReadable, DocumentPointer } from '@copilotkit/react-core';

// You can pass top-level data to the Copilot engine by calling `useMakeCopilotReadable`.
// const employeeContextId = useMakeCopilotReadable(employeeName);

// Pass a parentID to maintain a hierarchical structure.
// Especially useful with child React components, list elements, etc.
// useMakeCopilotReadable(workProfile.description(), employeeContextId);
// useMakeCopilotReadable(metadata.description(), employeeContextId);

// const document: DocumentPointer = {
//   id: "2",
//   name: "Travel Pet Peeves",
//   sourceApplication: "Google Docs",
//   iconImageUri: "/images/GoogleDocs.svg",
//   getContents: () => { return "hello document" },
// } as DocumentPointer;

// // ...then, in a react component:
// useMakeCopilotDocumentReadable(document);

