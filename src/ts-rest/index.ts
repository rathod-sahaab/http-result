import {
	HTTP,
	HTTP_ERRORS,
	HTTP_SUCCESS,
	IHttpKind,
	IHttpSuccessKind,
	IHttpErrorKind,
	IHttpErrorStatusSpecific,
	IHttpSuccessStatus,
	IHttpErrorStatus,
	IHttpSuccessStatusSpecific,
	ErrPayload,
} from '../index'

export type ITsRestSuccess<T, S extends IHttpSuccessStatus> = {
	status: S
	body: T
}

export type ITsRestError<S extends IHttpErrorStatus> = {
	status: S
	body: {
		message: string
		messages: string[]
	}
}

/**
 * Format http-result error type into a valid ts-rest response
 */
export function tsRestError<E extends IHttpErrorKind>(
	err: ErrPayload<E>,
): ITsRestError<IHttpErrorStatusSpecific<E>> {
	return {
		status: err.status,
		body: {
			message: err.messages[err.messages.length - 1],
			messages: err.messages,
		},
	}
}

// makes the function that throws the makes the success
function tsRestSuccessResponseFactory<T, E extends IHttpSuccessStatus>(
	status: E,
): (body: T) => ITsRestSuccess<T, E> {
	return (body: T) => ({
		status,
		body,
	})
}
// makes the function that throws the makes the error
function tsRestErrorMakerFactory<E extends IHttpErrorStatus>(
	status: E,
): (message: string) => ITsRestError<E> {
	return (message: string) => ({
		status,
		body: {
			message,
			messages: [message],
		},
	})
}

type ITsRestResponseFnsMap = {
	[K in IHttpKind]: K extends IHttpSuccessKind
		? <T>(body: T) => ITsRestSuccess<T, IHttpSuccessStatusSpecific<K>>
		: K extends IHttpErrorKind
			? (message: string) => ITsRestError<IHttpErrorStatusSpecific<K>>
			: never
}

/**
 * Format ouput into ts-rest reponse, define status code with function name.
 * Error functions expect a message string, success response functions can
 * anything.
 */
export const TsRestResponse: ITsRestResponseFnsMap = (
	Object.keys(HTTP) as IHttpKind[]
).reduce<Partial<ITsRestResponseFnsMap>>((acc, curr) => {
	return {
		...acc,
		[curr]:
			curr in HTTP_SUCCESS
				? tsRestSuccessResponseFactory(HTTP_SUCCESS[curr as IHttpSuccessKind])
				: tsRestErrorMakerFactory(HTTP_ERRORS[curr as IHttpErrorKind]),
	}
}, {}) as ITsRestResponseFnsMap
