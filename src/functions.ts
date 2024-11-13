/**
 * @module Function to parse and pack into type goodies, makes life easier and code simpler.
 */

import { HTTP_ERRORS } from './http.constants'
import { IHttpErrorKind } from './http.types'
import { ErrPayload, ErrType, Result, Success } from './types'

/**
 * Helper function to easily create result success type from object
 *
 * ```ts
 * return Ok({value: 5})
 * ```
 */
export function Ok<T>(value: T): Success<T> {
	return [value, null]
}

/**
 * Helper function to easily create result error type from object
 *
 * ```ts
 * return Err('BadRequest', 'Article Too long.')
 * ```
 */
export function Err<T extends any, E extends IHttpErrorKind>(
	kind: E,
	message: string,
): Result<T, E> {
	return [
		null,
		{
			status: HTTP_ERRORS[kind],
			kind,
			messages: [message],
		},
	] as Result<T, E>
}

const errorFactory = <K extends IHttpErrorKind, A extends IHttpErrorKind>(
	kind: K,
): ((message: string, baseError: ErrPayload<A>) => ErrPayload<K>) => {
	return (message: string, baseError?: ErrPayload<A>) =>
		({
			status: HTTP_ERRORS[kind],
			kind: kind,
			messages: baseError ? [...baseError.messages, message] : [message],
		}) as ErrPayload<K>
}

const errorResultFactory = <
	T,
	E extends IHttpErrorKind,
	A extends IHttpErrorKind,
>(
	errorMaker: (message: string, baseError?: ErrPayload<A>) => ErrPayload<E>,
): ((message: string, baseError?: ErrPayload<A>) => Result<T, E>) => {
	return (message: string, baseError?: ErrPayload<A>): Result<T, E> => {
		return [null, errorMaker(message, baseError)] as Result<T, E>
	}
}

type IHttpErrorFnsMap = {
	[K in IHttpErrorKind]: <A extends IHttpErrorKind>(
		message: string,
		baseError?: ErrPayload<A>,
	) => ErrPayload<K>
}

type IHttpErrorResultFnsMap = {
	[K in IHttpErrorKind]: <T, A extends IHttpErrorKind>(
		message: string,
		baseError?: ErrPayload<A>,
	) => Result<T, K>
}

/**
 * Object containing formatter functions to get ErrPayload
 *
 * Each function has:
 * @param message Message describing error
 * @param baseError? Optional: Underlying error that made you create a new error, for something like a stack trace
 */
export const HttpErrors: IHttpErrorFnsMap = (
	Object.keys(HTTP_ERRORS) as IHttpErrorKind[]
).reduce<Partial<IHttpErrorFnsMap>>((acc, curr) => {
	return {
		...acc,
		[curr]: errorFactory(curr),
	}
}, {}) as IHttpErrorFnsMap

/**
 * Same as HttpErrors but for creating result type directly
 * Object containing formatter functions to get Result
 *
 * Each function has:
 * @param message Message describing error
 * @param baseError? Optional: Underlying error that made you create a new error, for something like a stack trace
 */
export const HttpErrorResults: IHttpErrorResultFnsMap = (
	Object.keys(HTTP_ERRORS) as IHttpErrorKind[]
).reduce<Partial<IHttpErrorResultFnsMap>>((acc, curr) => {
	return {
		...acc,
		[curr]: errorResultFactory(HttpErrors[curr]),
	}
}, {}) as IHttpErrorResultFnsMap
