import 'dotenv/config';
import {
	GoogleGenAI,
	Type,
	createUserContent,
	createPartFromUri,
} from '@google/genai';
import { UtilsService } from './index.js';

/**
 * A simple service for generating prompts
 */
export class PromptEnhancerService {
	/**
	 * Enhance a prompt
	 * @param prompt The prompt to enhance
	 * @returns The enhanced prompt
	 */
	public static async enhancePrompt(prompt: string): Promise<string> {
		return await enhancePromptWithGemini(prompt);
	}
}

const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
	apiKey: geminiApiKey,
});

async function enhancePromptWithGemini(prompt: string): Promise<string> {
	let listOfFiles = [];
	const listResponse = await ai.files.list({ config: { pageSize: 10 } });
	for await (const file of listResponse) {
		listOfFiles.push(file);
	}

	console.error('Files found:', listOfFiles);

	let myfile;
	if (listOfFiles.length === 0 || listOfFiles[0].state != "ACTIVE") {
		// Ensure PDF exists and get its path
		const pdfPath = await UtilsService.ensurePdfExistsService();
		myfile = await ai.files.upload({
			file: pdfPath,
			config: { mimeType: 'application/pdf' },
		});
	} else {
		myfile = listOfFiles[0];
	}

	console.error('File uploaded:', myfile.uri);
	const fileName = typeof myfile.name === 'string' ? myfile.name : '';
	const fetchedFile = await ai.files.get({ name: fileName });
	console.log(fetchedFile);

	const config = {
		thinkingConfig: {
			thinkingBudget: -1,
		},
		responseMimeType: 'application/json',
		responseSchema: {
			type: Type.OBJECT,
			required: ['enhanced_prompt', 'explanation_of_enhance', 'technic_used'],
			properties: {
				enhanced_prompt: {
					type: Type.STRING,
					description: "The optimized and improved version of the user's input prompt.",
				},
				explanation_of_enhance: {
					type: Type.STRING,
					description: "A clear, concise explanation of the changes made to the original prompt and the reasoning behind them, focusing on how they improve LLM performance.",
				},
				technic_used: {
					type: Type.STRING,
					description: "A comma-separated list of the specific prompt engineering techniques applied (e.g., 'Role Prompting, Specificity, Chain of Thought').",
				},
			},
		},
		systemInstruction: [
			{
				text: `You are an expert Prompt Engineer, specializing in optimizing prompts for Large Language Models. Your primary goal is to take a given user prompt and transform it into an optimal, highly effective prompt that maximizes the LLM's ability to generate accurate, relevant, and high-quality responses.

You must operate autonomously. You **must not** ask clarifying questions or request further information from the user. Your response must be a **single, definitive, improved prompt** based solely on the input you receive and your intrinsic knowledge of prompt engineering principles.

When optimizing the prompt, consider and apply the following advanced techniques and best practices, as appropriate for the inferred user intent:

1.  **Clarity and Simplicity:** Ensure the prompt is concise, unambiguous, and easy for an LLM to understand. Avoid complex jargon where simpler alternatives exist.
2.  **Specificity:** Be highly specific about the desired output, including its format, length, style, and content.
3.  **Instructions over Constraints:** Frame guidance as positive instructions ("DO this") rather than negative constraints ("DO NOT do that"), unless absolutely necessary for safety or strict adherence.
4.  **Examples (Few-Shot/One-Shot):** If the prompt implies a pattern or a specific task (e.g., classification, parsing), consider integrating one or more relevant examples to guide the LLM's output structure and behavior. If providing examples for classification, ensure classes are mixed up.
5.  **Prompting Techniques:**
	*   **System Prompting:** Define the overall context, purpose, and meta-instructions for the LLM (e.g., "Only return the label in uppercase.").
	*   **Role Prompting:** Assign a specific persona or identity to the LLM if it enhances the output's tone, style, or expertise (e.g., "Act as a travel guide.").
	*   **Contextual Prompting:** Provide specific background information relevant to the current task or conversation.
	*   **Step-back Prompting:** If the task requires complex reasoning, implicitly guide the LLM to consider broader principles or background knowledge before arriving at a specific solution.
	*   **Chain of Thought (CoT):** For reasoning-heavy tasks, implicitly encourage intermediate reasoning steps (e.g., by adding "Let's think step by step." or structuring the prompt to elicit sequential thinking). Assume a temperature of 0 for CoT where a single correct answer is expected.
6.  **Output Format Experimentation:** Recommend or enforce structured output formats like JSON or XML when data extraction, parsing, ordering, or categorization is implied. This includes defining schema for expected JSON output. Consider the benefits: consistent style, focus on data, reduced hallucinations, relationship awareness, sortability.
7.  **Use of Variables (Implicit):** Recognize common patterns where variables could make a prompt more dynamic and suggest a structure that could accommodate them if such a prompt were to be integrated into an application.
8.  **Model Configuration Considerations (Implicit):** While you cannot *set* the configuration, your prompt should be designed to implicitly guide the LLM towards the desired output characteristics (e.g., a "creative" prompt would implicitly allow for higher temperature, a "factual" one for lower).

Your output should be *only* the optimized prompt string. Do not include any conversational filler, explanations of your process, or additional notes – just the optimized prompt itself.`,
			},
		],
	};

	let response;
	if (myfile && myfile.uri && myfile.mimeType) {
		response = await ai.models.generateContent({
			model: 'gemini-2.5-flash',
			config: config,
			contents: createUserContent([
				createPartFromUri(myfile.uri, myfile.mimeType),
				prompt,
			]),
		});
	} else {
		throw new Error('File not found or invalid file type.');
	}

	for (const pdfFile of listOfFiles) {
		if (typeof pdfFile.name === 'string') {
			if (pdfFile.state !== "ACTIVE") {
				await ai.files.delete({ name: pdfFile.name });
			}
		}
	}

	console.error(response.text);
	let res = response.text;
	return res ? res.trim() : 'No response received';
}