import { HttpErrorResults, Ok, Result } from 'http-result'
import { Post } from './contract'

export function serviceCreatePost(
	article: string,
): Result<Post, 'InternalServer' | 'BadRequest'> {
	if (article.length < 10) {
		return HttpErrorResults.BadRequest('Article too short')
	}

	if (article.length > 100) {
		return HttpErrorResults.InternalServer('Error storing in DB')
	}

	return Ok({ article })
}
