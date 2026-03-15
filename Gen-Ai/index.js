import "dotenv/config";
import readline from "readline/promises";
import { ChatMistralAI } from "@langchain/mistralai";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//infinite while loop just to make endless Ai Chat but the problem here is it cant remember the history of chats 


while(true){
  const userInput = await rl.question("you:")
  const response = await model.invoke(userInput)
  console.log(response.text);
  
}

rl.close()