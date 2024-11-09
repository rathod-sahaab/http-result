import { HttpErrors, Ok, Result } from 'http-result'
import { Post } from './contract'

export function serviceCreatePost(
	article: string,
): Result<Post, 'InternalServer' | 'BadRequest'> {
	if (article.length < 10) {
		return HttpErrors.BadRequest('Article too short')
	}

	if (article.length > 100) {
		return HttpErrors.InternalServer('Error storing in DB')
	}

	return Ok({ article })
}
