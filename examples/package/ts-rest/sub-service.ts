import { Result, HttpErrorResults, Ok } from 'http-result'

// if expecting, expect true, need help what to do here
export async function createIndex(
	_article: string,
): Promise<Result<true, 'URITooLong'>> {
	if (Math.random() > 0.5) {
		HttpErrorResults.URITooLong('Too long url for article')
	}

	return Ok(true)
}
