import { CopilotBackend, OpenAIAdapter } from "@copilotkit/backend";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
    // const copilotKit = new CopilotBackend({
    //     actions: [
    //       {
    //         name: "sayHello",
    //         description: "Says hello to someone.",
    //         argumentAnnotations: [
    //           {
    //             name: "name",
    //             type: "string",
    //             description: "The name of the person to say hello to.",
    //             required: true,
    //           },
    //         ],
    //         implementation: async (name) => {
    //             console.log("name from implmentation in route in closeai: ", name)
    //           const prompt = ChatPromptTemplate.fromMessages([
    //             [
    //               "system",
    //               "The user tells you their name. Say hello to the person in the most " +
    //                 " ridiculous way, roasting their name.",
    //             ],
    //             ["user", "My name is {name}"],
    //           ]);
    //           const chain = prompt.pipe(new ChatOpenAI({openAIApiKey:process.env.OPENAI_API_KEY}));
    //           return chain.invoke({
    //             name: name,
    //           });
    //         },
    //       },
    //     ],
    //   });
    const copilotKit = new CopilotBackend();
    console.log("req: ",req)

      return copilotKit.response(req, new OpenAIAdapter({model:"gpt-3.5-turbo"}));
}
