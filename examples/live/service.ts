import {
	HttpErrorResults,
	Ok,
	Result,
	Err,
	IHttpErrorKind,
} from '../../src/index'
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

export const serviceCreatePostAutoErrorKind = ((article: string) => {
	// Automatically deduce return error kinds
	// I don't like it Result is broken up into union components
	if (article.length < 10) {
		return Err('BadRequest', 'Article too small')
	}

	if (article.length > 100) {
		return HttpErrorResults.InternalServerError('Error storing in DB')
	}

	const post: Post = { article }

	return Ok(post)
}) satisfies (article: string) => Result<Post, IHttpErrorKind>
