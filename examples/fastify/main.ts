import Fastify from 'fastify'
import { initServer } from '@ts-rest/fastify'
import { contract } from './contract'
import { TsRestResponse } from 'http-result/ts-rest'

const app = Fastify()

const s = initServer()

const router = s.router(contract, {
	getPost: async ({ params: { id } }) => {
		const post = { article: `Hello There ${id}` }

		return TsRestResponse.Ok(post)
	},
	createPost: async ({ body }) => {
		const post = { article: 'Hello There' }

		console.log(body)

		return TsRestResponse.Created(post)
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
