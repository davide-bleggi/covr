// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { User } from '@prisma/client';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {email: string, id: number, name: string}
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
