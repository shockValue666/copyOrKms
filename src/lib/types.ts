import { z } from "zod";

export const SubjectSchema = z.object({
    subject:z.string().describe("subject of the conversation").min(10,"subject should be at least 10 characters long")
})

export const FormSchema = z.object(
    {
        email:z.string().describe("Email").email({message:"Invalid Emaillllll"}),
        password:z.string().describe("Password").min(1,'Password is required')
    }
)


export const CreateFolderFromSchema = z.object({
    folderName:z.string().describe("Name of the folder").min(1,"Folder name is required"),
    folder:z.any()
})