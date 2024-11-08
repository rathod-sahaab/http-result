# http-result

`http-result` is a Typescript library that provides type-safe error handling and result types inspired by patterns used in Rust and Go. It is designed to complement **ts-rest** by offering a consistent and type-safe way to handle both successful responses and errors in API calls or service methods.

---

## Features

- **Type-safe error handling**: Guarantees correct error types through Typescript’s type system.
- **Result type pattern**: Emulates the result types from languages like Rust and Go, making error handling more predictable.
- **Full integration with `ts-rest`**: Easy integration with the `ts-rest` library for RESTful service calls.

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
import { Result } from 'http-result'

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
   return HttpErrorResults.NotFound('User does not exists')
  }

  if (!name) {
   return HttpErrorResults.InternalServer('User does not exists')
  }

  // Simulate successful organization creation
  const org = { id: '123', name }
  Ok(org)
 }
}

// caller function, api request handler in this case
const organisationService = new OrganisationService()

const [org, error] = await organisationService.createOrg({
 userId: '123',
 name: 'My Organization',
})

if (error) {
 return tsRestError(error) // Return a structured error response
}

return TsRestResponse.Created(org) // Return a successful response
```

### Explanation

- The `createOrg` method returns a `Result` type with two possible outcomes:
  - **Success**: The result contains the created organization data (`Organisation`).
  - **Error**: The result contains an error, which can be either `'InternalServer'` or `'NotFound'`.
- If an error occurs, it is handled and passed to `tsRestError()` for a structured error response.
- If successful, the organization data is passed to `TsRestResponse.Ok()` to return a successful response.

### Result Type

The result is returned as an object with the following structure:

```typescript
export type Result<
 T,
 ErrorUnion extends 'NotFound' | 'InternalServer' | '...',
> = Success<T> | ErrType<ErrorUnion>
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
  return tsRestError('User not found')
 }

 return TsRestResponse.Ok(user)
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
