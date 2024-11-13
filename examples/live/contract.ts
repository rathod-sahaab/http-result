import { initContract } from '@ts-rest/core'
import { z } from 'zod'

export type Post = {
	article: string
}

const c = initContract()
export const contract = c.router({
	createPost: {
		method: 'POST',
		path: '/posts',
		//     ^ Note! This is the full path on the server, not just the sub-path of a route
		responses: {
			201: c.type<Post>(),
		},
		body: z.object({
			title: z.string(),
			content: z.string(),
			published: z.boolean().optional(),
			description: z.string().optional(),
		}),
		summary: 'Create a post',
		metadata: { role: 'user' } as const,
	},
	getPost: {
		method: 'GET',
		path: '/posts/:id',
		responses: {
			200: c.type<Post>(),
		},
		headers: z.object({
			pagination: z.string().optional(),
		}),
		query: z.object({
			id: z.string(),
		}),
		summary: 'Get all posts',
		metadata: { role: 'guest' } as const,
	},
})
