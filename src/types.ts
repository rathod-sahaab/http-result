import { IHttpErrorKind, IHttpErrorStatusSpecific } from './http.types'

export type ErrPayload<S extends IHttpErrorKind> = {
	status: IHttpErrorStatusSpecific<S>
	kind: S
	messages: string[]
}

export type Success<T> = [T, null]

export type ErrType<ErrorUnion extends IHttpErrorKind> = {
	[Member in ErrorUnion]: [null, ErrPayload<Member>]
}[ErrorUnion]

export type Result<T, ErrorUnion extends IHttpErrorKind> =
	| Success<T>
	| ErrType<ErrorUnion>
