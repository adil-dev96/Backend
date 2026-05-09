import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage,AIMessage,tool,createAgent } from "langchain";
import * as z from 'zod'
import { searchInternet } from "./internet.service.js";


const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(
  searchInternet,
  {
    name:"searchInternet",
    description:"Use this tool to get the latest information from the internet",
    schema: z.object({
      query:z.string().describe("The search query to look up on the internet")
    })
  }
)

const agent = createAgent({
  model:geminiModel,
  tools:[searchInternetTool],
}) 





export async function generateResponse(messages) {
    console.log(messages)

    const response = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
            `),
            ...(messages.map(msg => {
                if (msg.role == "user") {
                    return new HumanMessage(msg.content)
                } else if (msg.role == "ai") {
                    return new AIMessage(msg.content)
                }
            })) ]
    });

    return response.messages[ response.messages.length - 1 ].text;

}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`you are a helpful assistent that generate consise and descriptive title for chat converstations
  
  user will provide you with the first message of the chat conversation and you will generate a title that capture the essence of the conversation in 2-3 words . The title should be clear, relevent , and engaging, giving the user a quick understanding of the chats topic
  
  `),
    new HumanMessage(`Generate a title for the chat conversation based on the follwing first message:
    ${message}
    `),
  ]);

  return response.text;
}
