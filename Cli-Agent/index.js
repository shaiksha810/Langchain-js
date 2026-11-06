import { ChatGroq } from "@langchain/groq";
import { createInterface } from "node:readline/promises";
import { createAgent, tool } from "langchain";
import { configDotenv } from "dotenv";
import { z } from "zod";
configDotenv();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});


const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
});

let events = []

const createEvent = tool(
  async ({name, description, eventName}) => {

    events.push({
    name,
    description,
    eventName,
  })

   return `Event ${eventName} created successfully.`;
},

{
  name: "createEvent",
  description: "create a event based on the input",
  schema: z.object({
    name: z.string(),
    description: z.string(),
    eventName: z.string(),
  }),
});


const retrieveEvent = tool(
    async ({}) => {
       return events
    },

    {
  name: "retrieveEvent",
  description: "retrieve all events",
  schema: z.object({}),
});

const agent = createAgent({
  model,
  tools: [createEvent, retrieveEvent],
});


while(true) {
  
  const query = await rl.question("Enter your query: ")
  
  const response = await agent.invoke({
    messages: [
      {
        role:"user",
        content:query
      }
    ],
  });
  
  
  // console.log(response);
  console.log(response.messages.at(-1).content);
}

 