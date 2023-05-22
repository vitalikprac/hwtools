import { lusolve, matrix, re } from 'mathjs'

export const calcCoefficientL = (q1, q2, q3, q4) => {
  return q1 + q2 + q3 - q4
}

export const calcACoefficients = (l, q1, q2, q3, q4) => ({
  a1: l / q1 > 0 ? 1 : -1,
  a2: l / q2 > 0 ? 1 : -1,
  a3: l / q3 > 0 ? 1 : -1,
  a4: l / q4 > 0 ? 1 : -1,
})

export const calcDeltaQ = (aCoefficients, q1, q2, q3, q4) => {
  return [
    q1 * aCoefficients.a1,
    q2 * aCoefficients.a2,
    q3 * aCoefficients.a3,
    q4 * aCoefficients.a4,
  ]
}

export const calcPCoefficients = (sigma1, sigma2, sigma3, sigma4) => {
  const sigma1_squared = Math.pow(sigma1, 2)
  const sigma2_squared = Math.pow(sigma2, 2)
  const sigma3_squared = Math.pow(sigma3, 2)
  const sigma4_squared = Math.pow(sigma4, 2)
  const k = 1 / (
    (1 / sigma1_squared) +
    (1 / sigma2_squared) +
    (1 / sigma3_squared) +
    (1 / sigma4_squared)
  )
  const p1 = k / sigma1_squared
  const p2 = k / sigma2_squared
  const p3 = k / sigma3_squared
  const p4 = k / sigma4_squared
  return {
    k,
    p1,
    p2,
    p3,
    p4,
  }
}

export const solveSystem = (pCoefficients, deltaQ, coefficientL) => {
  const { p1, p2, p3, p4 } = pCoefficients
  const A = [
    [2 * p1 * deltaQ[0], 0, 0, 0, 1],
    [0, 2 * p2 * deltaQ[1], 0, 0, 1],
    [0, 0, 2 * p3 * deltaQ[2], 0, 1],
    [0, 0, 0, 2 * p4 * deltaQ[3], 1],
    [deltaQ[0], deltaQ[1], deltaQ[2], -deltaQ[3], 0],
  ]
  const B = [0, 0, 0, 0, coefficientL]

  const matrixA = matrix(A)
  const matrixB = matrix(B)
  const resultMatrix = lusolve(matrixA, matrixB)
  return resultMatrix.toArray().flat().slice(1)
}

export const calcRefactoredValues = (q1, q2, q3, q4, xs) => {
  return [
    q1 - xs[0],
    q2 - xs[1],
    q3 - xs[2],
    q4 + xs[3],
  ]
}