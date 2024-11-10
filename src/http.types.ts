/**
 * @module
 * File Contains HTTP types, too specific to put in general types
 */
import { HTTP_ERRORS, HTTP_SUCCESS } from './http.constants'

/**
 * Success kinds union
 */
export type IHttpSuccessKind = keyof typeof HTTP_SUCCESS
/**
 * Success status codes union
 */
export type IHttpSuccessStatus = (typeof HTTP_SUCCESS)[IHttpSuccessKind]
/**
 * Success kind-status map type
 */
export type IHttpSuccessStatusSpecific<K extends IHttpSuccessKind> =
	(typeof HTTP_SUCCESS)[K]

/**
 * Error kinds union
 */
export type IHttpErrorKind = keyof typeof HTTP_ERRORS
/**
 * Error status codes union
 */
export type IHttpErrorStatus = (typeof HTTP_ERRORS)[IHttpErrorKind]
/**
 * Error kind-status map type
 */
export type IHttpErrorStatusSpecific<K extends IHttpErrorKind> =
	(typeof HTTP_ERRORS)[K]

/**
 * All https status kinds union
 */
export type IHttpKind = IHttpSuccessKind | IHttpErrorKind
/**
 * All status codes union
 */
export type IHttpStatus = IHttpSuccessStatus | IHttpErrorStatus
/**
 * All kind-status union
 */
export type IHttpStatusSpecific<K extends IHttpKind> =
	K extends IHttpSuccessKind
		? IHttpSuccessStatusSpecific<K>
		: K extends IHttpErrorKind
			? IHttpErrorStatusSpecific<K>
			: never
