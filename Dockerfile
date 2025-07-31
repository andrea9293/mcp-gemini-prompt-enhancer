# Dockerfile for MCP Gemini Prompt Enhancer (no API key baked in)
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3002
ENV NODE_ENV=production
CMD ["npm", "run", "start:http"]
