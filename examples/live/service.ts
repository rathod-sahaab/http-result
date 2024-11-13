import { HttpErrorResults, Ok, Result, Err } from '../../src/index'
import { Post } from './contract'

export function serviceCreatePost(
	article: string,
): Result<Post, 'InternalServerError' | 'BadRequest'> {
	if (article.length < 10) {
		return Err('BadRequest', 'Article too small')
	}

	if (article.length > 100) {
		return HttpErrorResults.InternalServerError('Error storing in DB')
	}

	return Ok({ article })
}
