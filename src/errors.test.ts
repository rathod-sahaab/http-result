import { expect, test, describe } from 'vitest'
import { HTTP_ERRORS } from './http.constants'
import { IHttpErrorKind } from './http.types'
import { HttpErrors, HttpErrorResults } from './functions'

describe('Usage tests', () => {
	describe('HttpErrors', () => {
		test('Should return correct result structure', () => {
			expect(HttpErrors.BadRequest('This is a bad request.')).toEqual({
				status: 400,
				kind: 'BadRequest',
				messages: ['This is a bad request.'],
			})
		})
		test('Should not be hard coded', () => {
			expect(HttpErrors.BadRequest('This is a not a bad request.')).not.toEqual(
				{
					status: 400,
					kind: 'BadRequest',
					messages: ['This is a bad request.'],
				},
			)
		})
	})
	describe('HttpErrorResults', () => {
		test('Should return correct result structure', () => {
			expect(HttpErrorResults.BadRequest('This is a bad request.')).toEqual([
				null,
				{
					status: 400,
					kind: 'BadRequest',
					messages: ['This is a bad request.'],
				},
			])
		})
		test('Should not be hard coded', () => {
			expect(
				HttpErrorResults.BadRequest('This is a not a bad request.'),
			).not.toEqual([
				null,
				{
					status: 400,
					kind: 'BadRequest',
					messages: ['This is a bad request.'],
				},
			])
		})
	})
})

describe('All function tests', () => {
	const messages = ['message1', 'message 2']
	test('HttpErrors', () => {
		for (const message in messages) {
			;(Object.keys(HTTP_ERRORS) as IHttpErrorKind[]).forEach(
				(httpError: IHttpErrorKind) => {
					expect(HttpErrors[httpError](message)).toStrictEqual({
						status: HTTP_ERRORS[httpError],
						kind: httpError,
						messages: [message],
					})
				},
			)
		}
	})
	test('HttpErrorResults', () => {
		for (const message in messages) {
			;(Object.keys(HTTP_ERRORS) as IHttpErrorKind[]).forEach(
				(httpError: IHttpErrorKind) => {
					expect(HttpErrorResults[httpError](message)).toStrictEqual([
						null,
						{
							status: HTTP_ERRORS[httpError],
							kind: httpError,
							messages: [message],
						},
					])
				},
			)
		}
	})
})
