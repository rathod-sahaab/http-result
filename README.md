# http-result

`http-result` is a Typescript library that provides type-safe error handling and result types inspired by patterns used in Rust and Go. It originally was designed to complement [**ts-rest**](https://ts-rest.com/) by offering a consistent and type-safe way to handle both successful responses and errors in API calls or service methods.

But it can be used for any backend TS application to represent internal error.

![build and tests status badge](https://github.com/rathod-sahaab/http-result/actions/workflows/build-test.yaml/badge.svg)

[npm/http-result](https://www.npmjs.com/package/http-result)
[jsr/http-result](https://jsr.io/@rathod-sahaab/http-result)

---

## Features

- **Type-safe error handling**: Guarantees correct error types through Typescript’s type system.
- **No surprises**: Errors are not thrown, but are returned as normal values enabling lot more ways to handle errors and not be surprised.
- **Result type pattern**: Emulates the result types from languages like Rust and Go, making error handling more predictable.
- **Easy integration with frameworks**:
  - [x] `ts-rest` library for RESTful service calls.
  - [ ] express
  - [ ] fastify
  - [ ] koa

---

## Installation

Install the `http-result` package via npm or yarn:

```bash
npm install http-result
```

Or with yarn:

```bash
yarn add http-result
```

---

## Basic Usage

The core idea of `http-result` is to handle method responses as a **Result** type, which can either be a successful result with data or an error. This avoids unhandled errors and allows for more precise control over how errors are processed.

### Example: `createOrg`

Here’s an example using `http-result` to handle errors in a method that creates an organization:

```typescript
import { HttpErrorResults, Ok, Result } from 'http-result'

class OrganisationService {
 async createOrg({
  userId,
  name,
 }: {
  userId: ID
  name: string
 }): Promise<Result<Organisation, 'InternalServer' | 'NotFound'>> {
  // Simulate error handling
  if (!userId) {
   return Err('BadRequest', 'Article too small')
   // return HttpErrorResults.NotFound('User does not exists')
  }

  if (!name) {
   return HttpErrorResults.InternalServer('User does not exists')
  }

  // Simulate successful organization creation
  const org = { id: '123', name }
  Ok(org)
 }
}

// caller function, API request handler in this case
import { tsRestError, TsRestResponse } from 'http-result/ts-rest'

const organisationService = new OrganisationService()

const [org, error] = await organisationService.createOrg({
 userId: '123',
 name: 'My Organization',
})

if (error.kind === 'NotFound') {
 // special handling
 return TsRestResponse.BadRequest('You made a mistake!')
}

if (error) {
 return tsRestError(error) // Return a structured error response
}

return TsRestResponse.Created(org) // Return a successful response
```

### Explanation

- The `createOrg` method returns a `Result` type with two possible outcomes:
  - **Success**: The result contains the created organization data (`Organisation`).
  - **Error**: The result contains an error, which can be either `'InternalServer'` or `'NotFound'`.

Format response according to frameworks:

- If an error occurs, it is handled and passed to `tsRestError()` for a structured error response.
- If successful, the organization data is passed to `TsRestResponse.Created()` to return a successful response. Status code is mostly manual.

### Result Type

The result is returned as an object with the following structure:

```typescript
export type Result<
 T,
 ErrorUnion extends 'NotFound' | 'InternalServer' | '...',
> = Success<T> | ErrType<ErrorUnion>
```

### ErrorPayload

Error returned by the service has following structure.

```typescript
export type ErrPayload<S extends IHttpErrorKind> = {
 status: IHttpErrorStatusSpecific<S>
 kind: S
 messages: string[]
}
```

Where:

- `T` is the type of the successful data (e.g., `Organisation`).
- `E` is the type of the error (e.g., `'InternalServer' | 'NotFound'`).

---

## Handling Errors with `ts-rest`

`http-result` works seamlessly with **ts-rest** to provide a structured and type-safe error response in API calls. In the case of an error, you can pass the error message to `tsRestError()` to create a proper response.

```typescript
import { TsRestResponse, tsRestError } from 'http-result'

async function getUserInfo(userId: ID) {
 const [user, error] = await getUserFromDatabase(userId)

 if (error) {
  return tsRestError(error) // format into ts-rest error
 }

 return TsRestResponse.Created(user) // format into ts-rest response
}
```

In the above example:

- If there is an error (e.g., "User not found"), it’s passed to `tsRestError()`, ensuring the response is correctly structured and type-safe.
- If the user is found, `TsRestResponse.Ok()` returns the successful result.

---

## API

- **`Result<T, E>`**: Represents the result of an operation, where:
  - `T` is the type of the successful result (data).
  - `E` is the type of the error.
- **`TsRestResponse.(functions)<T>(data: T)`**: Returns a successful response with the data of type `T`, for ts-rest
- **`tsRestError<E>(error: E)`**: Creates a structured error response with the given error, for ts-rest

---

## Typescript Support

`http-result` leverages Typescript’s powerful type system to provide full type safety for both success and error scenarios. This ensures you catch any mismatches or unexpected behavior at compile time.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Feel free to open issues or submit pull requests for improvements, bug fixes, or new features!
