import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage,AIMessage } from "langchain";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  const response = await geminiModel.invoke(messages.map(msg=>{
    if(msg.role=="user"){
      return new HumanMessage(msg.content)
    }else if(msg.role=="ai"){
      return new AIMessage(msg.content)
    }
  }));

  return response.text;
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
