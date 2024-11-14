import { HttpErrorResults, Ok, Result, Err } from 'http-result'
import { Post } from './contract'
import { createIndex } from './sub-service'

export async function serviceCreatePost(
	article: string,
): Promise<Result<Post, 'InternalServerError' | 'BadRequest'>> {
	if (article.length < 10) {
		return Err('BadRequest', 'Article too small')
	}

	if (article.length > 100) {
		return HttpErrorResults.InternalServerError('Error storing in DB')
	}

	const [index, indexError] = await createIndex(article)

	if (indexError) {
		return HttpErrorResults.InternalServerError(
			'Index Creation failed',
			indexError,
		)
	}

	console.log(index)

	return Ok({ article })
}
