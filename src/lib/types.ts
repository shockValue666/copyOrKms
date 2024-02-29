import { z } from "zod";

export const SubjectSchema = z.object({
    subject:z.string().describe("subject of the conversation").min(10,"subject should be at least 10 characters long")
})