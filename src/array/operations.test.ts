import { describe, expect, test } from 'vitest'
import { transposeMatrix } from './operations'

describe('tranpose matrix', () => {
    describe('given an empty matrix', () => {
        const matrix : any[] = []
        test('it should not throw', ()=> {
            expect(() => transposeMatrix(matrix)).not.toThrowError()
        })

        test('it should return []', ()=> {
            const expected : any = []
            const transposed = transposeMatrix(matrix)
            expect(transposed).toEqual(expected)
        })
    })

    describe('given a non-empty matrix', () => {
        const matrix = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]
        test('it should transpose it', () => {
            const transposed = transposeMatrix(matrix)
            const expected = [
                [1, 4, 7],
                [2, 5, 8],
                [3, 6, 9]
            ]
            expect(transposed).toEqual(expected)
        })
        
    })
})