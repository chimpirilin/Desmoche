export const transposeMatrix = <T>(matrix: T[][]) => {
    if(matrix.length === 0) {
        return []
    }
    return matrix[0].map((_ : T, i : number) => matrix.map(row => row[i]))
}