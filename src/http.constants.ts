export const HTTP_SUCCESS = {
   Ok: 200,
   Created: 201,
} as const

export const HTTP_ERRORS = {
   /* 400 */
   BadRequest: 400,
   Unauthorized: 401,
   Forbidden: 403,
   NotFound: 404,

   /* 500 */
   InternalServer: 500,
   NotImplemnted: 501,
} as const

export const HTTP = {
   ...HTTP_SUCCESS,
   ...HTTP_ERRORS,
}
