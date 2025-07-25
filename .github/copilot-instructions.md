# Copilot Instructions for mcp-gemini-prompt-enhancer

## Project Overview
- This is a Model Context Protocol (MCP) server for prompt optimization using Google Gemini and advanced prompt engineering techniques.
- The main reference is the PDF “22365_3_Prompt_Engineering_v7” (auto-managed in `.mcp-enhancer-service` in the user's home directory).
- The core API/tool is `enhance_prompt`, which uses the PDF and Gemini to optimize textual prompts.

## Architecture & Key Files
- `src/index.ts`: Main entry point for stdio transport.
- `src/server/http-server.ts`: HTTP server entry point.
- `src/core/services/prompt-enhancer-service.ts`: Implements prompt enhancement logic using Gemini and PDF.
- `src/core/services/utils-service.ts`: Utility functions for prompt processing and PDF management.
- `src/core/tools.ts`: Registers MCP tools (mainly `enhance_prompt`).
- PDF asset is auto-downloaded and managed; no manual intervention required.

## Developer Workflows
- **Install dependencies:**
  ```powershell
  npm install
  ```
- **Set up API key:**
  Set `GEMINI_API_KEY` in your environment (required for Gemini integration).
- **Start server (HTTP):**
  ```powershell
  npm run start:http
  ```
- **Start server (stdio):**
  ```powershell
  npm run start
  ```
- **Build:**
  ```powershell
  npm run build
  ```
- **Development mode:**
  ```powershell
  npm run dev
  ```

## Patterns & Conventions
- All prompt enhancement logic is centralized in `prompt-enhancer-service.ts`.
- PDF asset is always checked/downloaded on startup; do not hardcode PDF paths.
- Use Zod for schema validation and FastMCP for protocol transport.
- Environment variables are loaded via `dotenv`.
- Windows PowerShell is the default shell for all commands.

## Integration Points
- Google Gemini API via `@google/genai` (requires API key).
- MCP protocol via `fastmcp`.
- PDF asset is referenced but not directly exposed to API consumers.

## Examples
- To add a new prompt tool, extend `src/core/tools.ts` and implement logic in `src/core/services/prompt-enhancer-service.ts`.
- For PDF management, use utility functions in `utils-service.ts`.

## Additional Notes
- The project is cross-platform but defaults to Windows PowerShell for commands.
- For questions, see the README or open an issue.

---
**If any section is unclear or missing, please provide feedback to improve these instructions.**
