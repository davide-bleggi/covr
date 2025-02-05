import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';
import { error } from '@sveltejs/kit';

export async function GET({ params }) {
	const filename = params.filename;

	// Sanitize the filename to prevent directory traversal
	const sanitizedFilename = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, '');

	// Construct the full file path - adjust this path to match your setup
	const filepath = path.join(process.cwd(), 'static', 'uploads', sanitizedFilename);

	try {
		// Check if file exists and get its stats
		const stats = await stat(filepath);

		if (!stats.isFile()) {
			throw error(404, 'Not found');
		}

		// Determine MIME type based on file extension
		const ext = path.extname(filepath).toLowerCase();
		const mimeTypes = {
			'.jpg': 'image/jpeg',
			'.jpeg': 'image/jpeg',
			'.png': 'image/png',
			'.gif': 'image/gif',
			'.webp': 'image/webp'
			// Add more mime types as needed
		};

		const stream = createReadStream(filepath);

		return new Response(stream, {
			headers: {
				'Content-Type': mimeTypes[ext] || 'application/octet-stream',
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Pragma': 'no-cache',
				'Expires': '0'
			}
		});
	} catch (err) {
		throw error(404, 'File not found');
	}
}
