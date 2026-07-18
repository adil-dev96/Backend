import {
  StateGraph,
  StateSchema,
  START,
  END,
  type GraphNode,
} from "@langchain/langgraph";
import z from "zod";
import { mistralAIModel, cohereModel, geminiModel } from "./model.ai.js";
import { createAgent, HumanMessage, providerStrategy } from "langchain";

const state = new StateSchema({
  problem: z.string().default(""),
  solution_1: z.string().default(""),
  solution_2: z.string().default(""),

  judge: z.object({
    winner: z.string().default(""),
    summary: z.string().default(""),
    solution_1_score: z.number().default(0),    
    solution_2_score: z.number().default(0),
    solution_1_resoning: z.string().default(""),
    solution_2_resoning: z.string().default(""),
  }),
});

const solutionNode: GraphNode<typeof state> = async (state) => {
  const [mistralResponse, cohereResponse] = await Promise.all([
    mistralAIModel.invoke(state.problem),
    cohereModel.invoke(state.problem),
  ]);

  return {
    solution_1: mistralResponse.text,
    solution_2: cohereResponse.text,
  };
};

const judgeNode: GraphNode<typeof state> = async (state) => {
  const { problem, solution_1, solution_2 } = state;

  const judge = createAgent({
    model: geminiModel,
    responseFormat: providerStrategy(
      z.object({
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
        solution_1_resoning: z.string(),
        solution_2_resoning: z.string(),
        summary: z.string(),
      }),
    ),

    systemPrompt: `You are an expert AI evaluator.

Your task is to compare two AI-generated solutions.

Return:

1. Score Solution 1 out of 10
2. Score Solution 2 out of 10
3. Explain Solution 1's score
4. Explain Solution 2's score
5. Write one short overall summary recommending the better solution.`,
  });

  const judgeResponse = await judge.invoke({
    messages: [
      new HumanMessage(`
                Problem:${problem}
                Solution 1:${solution_1}
                Solution 2:${solution_2}
                `),
    ],
  });

  const {
    solution_1_score,
    solution_2_score,
    solution_1_resoning,
    solution_2_resoning,
    summary,
  } = judgeResponse.structuredResponse;

  let winner = "Tie";
  if (solution_1_score > solution_2_score) {
    winner = "Candidate Alpha";
  } else if (solution_2_score > solution_1_score) {
    winner = "Candidate Beta";
  }

  return {
    judge: {
      winner,
      summary,
      solution_1_score,
      solution_2_score,
      solution_1_resoning,
      solution_2_resoning,
    },
  };
};

const graph = new StateGraph(state)
  .addNode("solution", solutionNode)
  .addNode("judge_node", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge_node")
  .addEdge("judge_node", END)
  .compile();

export default async function runGraph(problem: string) {
  const result = await graph.invoke({
    problem: problem,
  });

  return result;
}
