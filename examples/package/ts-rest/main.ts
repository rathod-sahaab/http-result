import Fastify from 'fastify'
import { initServer } from '@ts-rest/fastify'
import { contract } from './contract'
import { tsRestError, TsRestResponse } from 'http-result/ts-rest'
import { serviceCreatePost } from './service'

const app = Fastify()

const s = initServer()

const router = s.router(contract, {
	getPost: async ({ params: { id } }) => {
		const post = { article: `Hello There ${id}` }

		return TsRestResponse.OK(post)
	},
	createPost: async ({ body }) => {
		const [post, createPostError] = await serviceCreatePost(body.content)

		// if (!createPostError) {
		if (post) {
			return TsRestResponse.Created(post)
		}

		switch (createPostError.kind) {
			case 'InternalServerError':
				return TsRestResponse.BadRequest('My bad but your bad')
			default:
				return tsRestError(createPostError)
		}
	},
})

app.register(s.plugin(router))

const start = async () => {
	try {
		await app.listen({ port: 3000 })
	} catch (err) {
		app.log.error(err)
		process.exit(1)
	}
}

start()
