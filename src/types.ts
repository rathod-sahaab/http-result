/**
 * @module contains core types for error handling including the star or the show Result
 */

import { IHttpErrorKind, IHttpErrorStatusSpecific } from './http.types'

/**
 * Error description type
 */
export type ErrPayload<S extends IHttpErrorKind> = {
	status: IHttpErrorStatusSpecific<S>
	kind: S
	messages: string[]
}

/**
 * Result sub-union type, contains data
 */
export type Success<T> = [T, null]

/**
 * Result sub-union type, contains error payload
 */
export type ErrType<ErrorUnion extends IHttpErrorKind> = {
	[Member in ErrorUnion]: [null, ErrPayload<Member>]
}[ErrorUnion]

/**
 * Result type would either be Success or Error, inspired by Rust
 */
export type Result<T, ErrorUnion extends IHttpErrorKind> =
	| Success<T>
	| ErrType<ErrorUnion>
