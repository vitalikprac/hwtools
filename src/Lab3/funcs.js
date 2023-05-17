export const getT = (t0, multiply) =>
  multiply * t0

export const calcKx = (Dx, t, t0, k) =>
  Dx * (1 - Math.pow(t / t0, k))

export const calcKxInterpolation = (Dx, t0, T) =>
  Dx * (Math.exp(-t0 / T))

export const calcResult = (Kx, Dx, Xti, Mx) =>
  (Kx / Dx) * (Xti - Mx) + Mx


 