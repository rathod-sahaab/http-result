import { HTTP_ERRORS } from './http.constants'
import { IHttpErrorKind } from './http.types'
import { ErrPayload, ErrType, Result, Success } from './types'

export function Ok<T>(value: T): Success<T> {
   return [value, null]
}
export function Err<E extends IHttpErrorKind>(err: ErrPayload<E>): ErrType<E> {
   return [null, err]
}

const errorFactory = <K extends IHttpErrorKind, A extends IHttpErrorKind>(
   kind: K,
): ((message: string, baseError: ErrPayload<A>) => ErrPayload<K>) => {
   return (message: string, baseError?: ErrPayload<A>) => ({
      status: HTTP_ERRORS[kind],
      kind: kind,
      messages: baseError ? [...baseError.messages, message] : [message],
   })
}

const errorResultFactory = <
   T,
   E extends IHttpErrorKind,
   A extends IHttpErrorKind,
>(
   errorMaker: (message: string, baseError?: ErrPayload<A>) => ErrPayload<E>,
): ((message: string, baseError?: ErrPayload<A>) => Result<T, E>) => {
   return (message: string, baseError?: ErrPayload<A>) => [
      null,
      errorMaker(message, baseError),
   ]
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

export const HttpErrors: IHttpErrorFnsMap = (
   Object.keys(HTTP_ERRORS) as IHttpErrorKind[]
).reduce<Partial<IHttpErrorFnsMap>>((acc, curr) => {
   return {
      ...acc,
      [curr]: errorFactory(curr),
   }
}, {}) as IHttpErrorFnsMap

export const HttpErrorResults: IHttpErrorResultFnsMap = (
   Object.keys(HTTP_ERRORS) as IHttpErrorKind[]
).reduce<Partial<IHttpErrorResultFnsMap>>((acc, curr) => {
   return {
      ...acc,
      [curr]: errorResultFactory(HttpErrors[curr]),
   }
}, {}) as IHttpErrorResultFnsMap
