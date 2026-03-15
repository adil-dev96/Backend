import "dotenv/config";
import readline from "readline/promises";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage } from "langchain";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatMistralAI({
  model: "mistral-small-latest",
});

const message = [];

while (true) {
  const userInput = await rl.question("\x1b[32mYou:\x1b[0m");

  message.push(new HumanMessage(userInput));

  const response = await model.invoke(message);
  message.push(response);
  console.log(`\x1b[34m[Ai]\x1b[0m ${response.content}`);
}

rl.close();
