import { FastMCP } from "fastmcp";
import { registerTools, registerRemoteTools } from "../core/tools.js";
import * as services from "../core/services/index.js";
import { cons } from "effect/List";

// Create and start the MCP server
async function startServer() {
  try {
    // Create a new FastMCP server instance
    const server = new FastMCP({
      name: "MCP Prompt Enhancer",
      version: "1.0.0"
    });

    registerTools(server);
    await services.UtilsService.ensurePdfExistsService();

    // Log server information
    console.error(`MCP Server initialized`);
    console.error("Server is ready to handle requests");

    return server;
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
}

async function startRemoteServer() {
  try {
    // Create a new FastMCP server instance
    const server = new FastMCP({
      name: "MCP Prompt Enhancer",
      version: "1.0.0",
      authenticate: async (request) => {
        const urlParams = new URL("http://dummy" + request.url);
        const apiKey = urlParams.searchParams.get("apiKey");

        console.error("Received Gemini API Key:", apiKey);
        if (!apiKey) {
          throw new Response(null, {
            status: 401,
            statusText: "gemini api key is required",
          });
        }

        console.error("Authenticated with Gemini API Key:", apiKey);

        // Whatever you return here will be accessible in the `context.session` object.
        return {
          geminiApiKey: apiKey,
        };
      },
    });

    registerRemoteTools(server);
    await services.UtilsService.ensurePdfExistsService();

    // Log server information
    console.error(`Remote MCP Server initialized`);
    console.error("Remote Server is ready to handle requests");

    return server;
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
}

// Export the server creation function
export { startServer, startRemoteServer };