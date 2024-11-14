# Why API?

This doc explains why API is the way it is, so when things change we can update the API for good and not take it as God's word.

## Result as array of `[data, error]`

Requirements for this API were:

1. Errors should not be ignore-able, i.e. must be handled explicitly.
2. Low mental bandwidth requirements, should fade away in the background.
3. Errors must have http status code.

Rust uses [enums](https://doc.rust-lang.org/rust-by-example/custom_types/enum.html) to implement result type, and you have to unpack that handle error and then proceed with your code.

```rust
// Result<f64, String>
match divide(10.0, 0.0) {
    Ok(result) => println!("Result: {}", result),
    Err(e) => println!("Error: {}", e),
}
```

Go on the other hand is skip-able on a type level, linters might catch this but code's good.

```go
result, err := divide(10, 2)
fmt.Println("Result:", result)
```

So the rust way is superior in this aspect. But, Typescript lacks **pattern matching** feature that would elegantly enable this form so here comes the solutions.

### Approaches

#### Tagged Unions/Discriminated Unions

```typescript
type Result<T, S extends HttpStatus> =
 | { error: false; data: T }
 | {
   error: true
   kind: S // 'BadRequest' | 'NotFound' | 'InternalServerError'
   message: string
   }
```

Usage:

```typescript
const result = await someServiceFunction(arg)

if (result.error) {
 // handle error
}

// handle success

console.log(result.data)
```

But developer now has to worry about this result type and, it doesn't fade away
in the background need to write boilerplate code. Violate requirement (2).

#### Tuples

Tuples are like arrays but of fixed lengths

```typescript
type Result<T, S extends HttpStatus> = [T, null] | [null | ErrPayload<S>]
```

This gives us our current API

```typescript
const [data, error] = await someServiceFunction(name)

if (error) {
 // handle error
}

console.log(data)
```

As soon as we de-structure the `data, error` everything is normal code.

### Helper Functions

Both of the above are easy to accept as a return value but hell to return from a function, for that we have some helper functions. Just like in `rust`

```typescript
return Ok(data)

return Err('BadRequest', 'This is a message')
return HttpErrorResults.BadRequest('This is a message')
```

There are two error returning helper functions. Depending on your editor/IDE
one might have better experience than other.

### Formatter

The core `Error` can then be converted into different frameworks' response
format using other set of helper functions.
They are separate from core code as you'd generally be using only one of them in your app.

- [x] `http-result/ts-rest`
- [ ] `http-result/express`
- [ ] `http-result/koa`

```typescript
import { tsRestError, TsRestResponse } from 'http-result/ts-rest'

return TsRestResponse.Created(org) // Return a successful response

return TsRestResponse.BadRequest('You made a mistake!')
return tsRestError(error) // Return a structured error response, automatically
```
