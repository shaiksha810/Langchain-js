import { StateGraph, START, END} from "@langchain/langgraph"
import {z} from "zod"
import { LLMnode } from "./node.js"
import {rl} from "../../utils/readline.js"
import { HumanMessage, SystemMessage } from "langchain"


const stateFormate = z.object({
    messages : z.array(z.any())
})


const graph = new StateGraph(stateFormate)
  .addNode("LLMnode", LLMnode)
  .addEdge(START, "LLMnode")
  .addEdge("LLMnode", END)
  .compile()

export async function initGraph() {

    let messages = [
        new SystemMessage("You always answer only in 10 words ")
    ]

    while(true) {
        const userInput = await rl.question("[User]:")

        if(userInput === "/bye") {
            break
        }

        messages.push(new HumanMessage(userInput))

        const response = await graph.invoke({ messages })
    
        // console.log(response);
        
        messages = response.messages


    }
}
