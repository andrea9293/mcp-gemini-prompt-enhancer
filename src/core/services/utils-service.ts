import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import 'dotenv/config';

/**
 * A simple service for generating prompts
 */
export class UtilsService {
	/**
	 * Enhance a prompt
	 * @param prompt The prompt to enhance
	 * @returns The enhanced prompt
	 */
	public static async ensurePdfExistsService(): Promise<string> {
		console.error("Ensuring PDF exists asynchronously...");
		return await ensurePdfExists();
	}
}

async function ensurePdfExists(): Promise<string> {
	// Get home directory cross-platform
	const homeDir = process.env.USERPROFILE || process.env.HOME;
	console.error(`Home directory: ${homeDir}`);
	if (!homeDir) throw new Error('Unable to determine home directory');
	const enhancerDir = path.join(homeDir, '.mcp-enhancer-service');
	if (!fs.existsSync(enhancerDir)) {
		fs.mkdirSync(enhancerDir, { recursive: true });
	}
	const pdfFileName = '22365_3_Prompt_Engineering_v7.pdf';
	const pdfPath = path.join(enhancerDir, pdfFileName);
	if (!fs.existsSync(pdfPath)) {
		console.error(`PDF not found at ${pdfPath}, downloading...`);
		// Download PDF
		const fileUrl = 'https://www.innopreneur.io/wp-content/uploads/2025/04/22365_3_Prompt-Engineering_v7-1.pdf';
		await new Promise<void>((resolve, reject) => {
			const file = fs.createWriteStream(pdfPath);
			https.get(fileUrl, (response) => {
				if (response.statusCode !== 200) {
					reject(new Error(`Failed to download PDF: ${response.statusCode}`));
					return;
				}
				response.pipe(file);
				file.on('finish', () => {
					file.close();
					resolve();
				});
			}).on('error', (err) => {
				fs.unlinkSync(pdfPath);
				reject(err);
			});
		});
		console.error(`PDF downloaded to ${pdfPath}`);
	} else {
		console.error(`PDF already exists at ${pdfPath}`);
	}
	return pdfPath;
}