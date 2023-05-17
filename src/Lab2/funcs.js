export const calcKxTa = (Dx, Qh, Qx) =>
  (2 * Dx + Math.pow(Qh, 2) - Math.pow(Qx, 2)) / 2;

export const generateByValue = (value, size = 5, delimiter = 10) => {
  const arr = new Array(size).fill(0);
  for (let i = 0; i < arr.length; i++) {
    if (i % 2 === 0) {
      arr[i] = value + i / delimiter;
    } else {
      arr[i] = value - i / delimiter;
    }
  }
  arr.sort();

  return arr;
};

export const calcKtxTempTDeltaQh = (DTemp, QMax, Qh) => {
  const values = generateByValue(Qh, 5);
  return values.map((x) => calcKxTa(DTemp, x, QMax));
};

export const calcKtxTempTDeltaQMax = (DTemp, Qh, QMax) => {
  const values = generateByValue(QMax, 5);
  return values.map((x) => calcKxTa(DTemp, Qh, x));
};

export const calcKtxPressTDeltaQh = (DPress, QMax, Qh) => {
  const values = generateByValue(Qh, 5);
  return values.map((x) => calcKxTa(DPress, x, QMax));
};

export const calcKtxPressTDeltaQMax = (DPress, Qh, QMax) => {
  const values = generateByValue(QMax, 5);
  return values.map((x) => calcKxTa(DPress, Qh, x));
};


// Part 2

export const calcTn = (l, v) => l / v;

export const calcNMiddle = (N, tN) => N / tN;

export const calcDeltaT = (nMiddle) => 0.15 / nMiddle;

export const generateRandomIntArr = (min, max, size = 13) => {
  const arr = new Array(size).fill(0);
  return arr.map(() => Math.floor(Math.random() * (max - min + 1)) + min);
};

export const generateDeltaTArr = (deltaT, size = 13) => {
  const arr = new Array(size).fill(0);
  let value = deltaT;
  for (let i = 0; i < arr.length; i++) {
    arr[i] = value;
    value += deltaT;
  }
  return arr;
};

const calcArrSum = (arr) => arr.reduce((sum, x) => sum + x);

export const calcMx = (arr) => calcArrSum(arr) / arr.length;

export const calcDx = (arr, Mx, N) => {
  return arr.reduce((sum, x) => sum + Math.pow(x - Mx, 2)) / (N - 1);
};

export const calcKx = (DeltaQh, DeltaQMax, Dx) => {
  const Kx = new Array(DeltaQh.length).fill(0);
  for (let i = 0; i < DeltaQh.length; i++) {
    Kx[i] = calcKxTa(Dx, DeltaQh[i], DeltaQMax[i]);
  }
  
  
  return Kx;
  // return DeltaQh.map((x, i) => {
  //   return calcKxTa(Dx, x, DeltaQMax[i]);
  // });
};

export const calcJ0 = (Kx) => {
  return Kx.reduce((sum, x) => sum + x) / Kx.length;
};

export const calcT0 = (J0, DeltaT) => J0 * DeltaT;