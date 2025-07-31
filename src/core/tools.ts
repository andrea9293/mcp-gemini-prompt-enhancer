import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as services from "./services/index.js";

/**
 * Register all tools with the MCP server
 * 
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP) {
  server.addTool({
    name: "enhance_prompt",
    description: "A tool to enhance prompts",
    parameters: z.object({
      prompt: z.string().describe("The prompt to enhance")
    }),
    execute: async (params) => {
      const enhanced = await services.PromptEnhancerService.enhancePrompt(params.prompt, "");
      return enhanced;
    }
  });
}

export function registerRemoteTools(server: FastMCP<{ geminiApiKey: string }>) {
  server.addTool({
    name: "enhance_prompt",
    description: "A tool to enhance prompts",
    parameters: z.object({
      prompt: z.string().describe("The prompt to enhance")
    }),
    execute: async (params, context: { session?: { geminiApiKey?: string } }) => {
      const apiKey = context.session && context.session.geminiApiKey ? context.session.geminiApiKey : "";
      const enhanced = await services.PromptEnhancerService.enhancePrompt(params.prompt, apiKey);
      return enhanced;
    }
  });
}