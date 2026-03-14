import { ChatMistralAI } from "@langchain/mistralai";

const apikey = process.env.PERPLEXITY_API_KEY;
const model = new ChatMistralAI({
  model: "mistral-small-latest",
  temperature: 0,
  apikey: apikey,
});

export async function testAi() {
  await model.invoke("what is the capital of india").then((response) => {
    console.log(response.text);
  });
}
