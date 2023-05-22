export const calculateTemperature = (outputSignal, yMax, resolution, T) =>{
  const acpMax = Math.pow(2, resolution)
  const knp = outputSignal / yMax;
  const y = (outputSignal / (acpMax * knp)) * T 
  return 3.01 + 13.75 * y - 0.03 * Math.pow(y, 2); 
}

export const calculatePressure = (P, outputSignal, resolution) => {
  const acpMax = Math.pow(2, resolution) 
  return (P/acpMax) * outputSignal;
}

export const calculateSpending = (t, p, p0, F, fMax, resolution) => {
  const acpMax = Math.pow(2, resolution)
  const pG = 1.2 - 0.013 * t + 0.72 * p + 0.000036 * Math.pow(t,2) + 0.0024 * Math.pow(p,2) - 0.0014 * t * p;
  const kp = Math.sqrt(pG/p0);
  return Math.sqrt(F / acpMax) * fMax * kp;
}