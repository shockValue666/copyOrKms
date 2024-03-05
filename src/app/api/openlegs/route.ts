import { CopilotBackend, OpenAIAdapter } from "@copilotkit/backend";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {OpenAI} from 'openai'


export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
    const {text} = await req.json();
    const prompt = `The following is a text written by a human. Predict his next 10 words based on the context. \n\n${text} \n\n`
    const openai = new OpenAI({
        apiKey:process.env.OPENAI_API_KEY
    })
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
      });

    console.log('chatCompletion', chatCompletion.choices[0].message.content, "req.json: ",text, "typeof req.json: ",typeof text)
    const content = chatCompletion.choices[0].message.content

    return new Response(JSON.stringify({ content }));
    
}
