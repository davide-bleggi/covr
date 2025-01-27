import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { error, json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	try {
		const data = await request.formData();
		const file = data.get('file') as File;

		if (!file) {
			throw error(400, 'No file uploaded');
		}

		// Ensure the uploads directory exists (create it if necessary)
		const uploadDir = resolve('static/uploads');
		const filePath = resolve(uploadDir, file.name);

		// Save the file to the server
		const buffer = Buffer.from(await file.arrayBuffer());
		await writeFile(filePath, buffer);

		// Return the file path (publicly accessible if in "static/uploads")
		return json({ path: `/uploads/${file.name}` });
	} catch (err) {
		console.error(err);
		throw error(500, 'Failed to upload file');
	}
};
