import { ChatMistralAI } from "@langchain/mistralai";

const apikey = process.env.PERPLEXITY_API_KEY;
const model = new ChatMistralAI({
  model: "mistral-small-latest",
  temperature: 0,
  apikey: apikey,
});


