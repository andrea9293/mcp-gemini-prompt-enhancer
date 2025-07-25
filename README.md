
# mcp-gemini-prompt-enhancer

A Model Context Protocol (MCP) server that provides a prompt optimization service for Large Language Models (LLMs) using Google Gemini, with advanced prompt engineering support and automatic PDF asset management.

## Reference PDF
The service uses as its main asset the PDF “22365_3_Prompt_Engineering_v7”, a comprehensive guide on prompt engineering for Large Language Models (LLMs), authored by Lee Boonstra. The document (68 pages) covers techniques and best practices for crafting effective prompts, including zero-shot, one-shot, few-shot prompting, and configuration strategies to optimize interactions with models. It is designed to help developers and data scientists achieve better results with LLMs.

Direct download link: [22365_3_Prompt_Engineering_v7.pdf](https://www.innopreneur.io/wp-content/uploads/2025/04/22365_3_Prompt-Engineering_v7-1.pdf)

## Main Features
- API to enhance textual prompts using prompt engineering techniques
- Automatic download and management of reference PDF asset
- Cross-platform compatibility (Windows, macOS, Linux)
- FastMCP server with stdio and SSE transports

## Project Structure
```
├── src/
│   ├── core/
│   │   ├── services/
│   │   │   ├── prompt-enhancer-service.ts
│   │   │   ├── utils-service.ts
│   │   └── tools.ts
│   ├── server/
│   │   ├── http-server.ts
│   │   └── server.ts
│   └── index.ts
├── package.json
├── tsconfig.json
```

## How it works
- On startup, the server checks for the reference PDF in the `.mcp-enhancer-service` folder in the user's home directory. If not present, it downloads it automatically.
- Exposes the `enhance_prompt` tool via MCP, which optimizes a textual prompt using advanced techniques and the PDF content.

## Quick Start
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Set the `GEMINI_API_KEY` environment variable with your Google Gemini key.
3. Start the server as remote:
   ```powershell
   npm run start:http
   ```
   or with stdio transport:
   ```powershell
   npm run start
   ```

## Available API/tools
- `enhance_prompt`: optimizes a textual prompt

## Configuration
- The `GEMINI_API_KEY` environment variable must be set to enable integration with Google Gemini.
- The reference PDF is managed automatically.

## Main Dependencies
- [fastmcp](https://www.npmjs.com/package/fastmcp)
- [@google/genai](https://www.npmjs.com/package/@google/genai)
- [zod](https://www.npmjs.com/package/zod)
- [dotenv](https://www.npmjs.com/package/dotenv)

## Notes
- The project is designed to be extensible and integrable into MCP workflows.
- For questions or contributions, open an issue or contact the maintainer.
