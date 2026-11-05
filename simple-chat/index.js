import {configDotenv} from "dotenv"
configDotenv()
import {ChatGroq} from "@langchain/groq"
import readline from "node:readline/promises"
import {stdin, stdout} from "node:process"


const rl = readline.createInterface({
    input:stdin,
    output:stdout
})


const llm = new ChatGroq({
    model:"openai/gpt-oss-120b",
    apiKey:process.env.GROQ_API_KEY

})

while(true){

    const inp = await rl.question("Enter Your Question: ")
    
    const response = await llm.stream([
        {
            role:"human",
            content:inp
        }
    ])
    
    for await (const chunk of response) {
        // console.log(chunk.content);
        process.stdout.write(chunk.content)
    }

    process.stdout.write("\n")
}





