// import { CopilotBackend, OpenAIAdapter } from "@copilotkit/backend";
// export const runtime = "edge";


// export async function POST(req: Request): Promise<Response> {
//     console.log("request: ",req)
//   const copilotKit = new CopilotBackend();
//   console.log("copilotKit: ", copilotKit);

//   return copilotKit.response(req, new OpenAIAdapter({model: "gpt-3.5-turbo"}));
// }

import { CopilotBackend, OpenAIAdapter } from "@copilotkit/backend";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const copilotKit = new CopilotBackend({
    actions: [
      {
        name: "sayHello",
        description: "Says hello to someone.",
        argumentAnnotations: [
          {
            name: "name",
            type: "string",
            description: "The name of the person to say hello to.",
            required: true,
          },
        ],
        implementation: async (name) => {
          console.log("name from implementation: ", name)
          const prompt = ChatPromptTemplate.fromMessages([
            [
              "system",
              "The user tells you their name. Say hello to the person in the most " +
                " ridiculous way, roasting their name.",
            ],
            ["user", "My name is {name}"],
          ]);
          const chain = prompt.pipe(new ChatOpenAI({openAIApiKey:process.env.OPENAI_API_KEY}));
          return chain.invoke({
            name: name,
          });
        },
      },
    ],
    // langserve: [
    //   {
    //     chainUrl: "http://localhost:8000/retriever",
    //     name: "askAboutAnimals",
    //     description: "Always call this function if the users asks about a certain animal.",
    //   },
    //   {
    //     chainUrl: "http://localhost:8000/agent",
    //     name: "askAboutEugeneThoughts",
    //     description:
    //       "Always call this function if the users asks about Eugene's thoughts on a certain topic.",
    //   },
    // ],
  });

  return copilotKit.response(req, new OpenAIAdapter({model:"gpt-3.5-turbo"}));
}