import { HTTP_ERRORS, HTTP_SUCCESS } from './http.constants'

export type IHttpSuccessKind = keyof typeof HTTP_SUCCESS
export type IHttpSuccessStatus = (typeof HTTP_SUCCESS)[IHttpSuccessKind]
export type IHttpSuccessStatusSpecific<K extends IHttpSuccessKind> =
   (typeof HTTP_SUCCESS)[K]

export type IHttpErrorKind = keyof typeof HTTP_ERRORS
export type IHttpErrorStatus = (typeof HTTP_ERRORS)[IHttpErrorKind]
export type IHttpErrorStatusSpecific<K extends IHttpErrorKind> =
   (typeof HTTP_ERRORS)[K]

export type IHttpKind = IHttpSuccessKind | IHttpErrorKind
export type IHttpStatus = IHttpSuccessStatus | IHttpErrorStatus
export type IHttpStatusSpecific<K extends IHttpKind> =
   K extends IHttpSuccessKind
      ? IHttpSuccessStatusSpecific<K>
      : K extends IHttpErrorKind
      ? IHttpErrorStatusSpecific<K>
      : never
