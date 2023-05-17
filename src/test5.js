const F = 1536
const P = 3072
const T = 3328
const resolution = 12
const fMax = 500
const outputSignalMax = 10
const p0 = 2.94
const yMax = 16.39 // при 400°С

const acpMax = Math.pow(2, resolution) // acpMax = 2^N - 1 ≃ 2^N (5.10)
const knp = outputSignalMax / yMax // yMax = outputSignalMax / knp 
const y =(outputSignalMax / (acpMax * knp)) * T // (5.14)
const temperature = calcTemp(y) //розрахунок температури
const pressure = (P/acpMax) * outputSignalMax //розрахунок тиску (5.23)
const pG = calcDens(temperature, pressure) // розрахунок густини 
const kp = Math.sqrt(pG/p0) // розрахунок поправочного коефіцієнту
const f = calcF(kp) // розрахунок витрати

function calcTemp(y) {
    return 3.01 + 13.75 * y - 0.03 * Math.pow(y, 2) // (5.14)
}

function calcDens(t,p) {
    return 1.2 - 0.013 * t + 0.72 * p + 0.000036 * Math.pow(t,2) + 0.0024 * Math.pow(p,2) - 0.0014 * t * p // (5.22)
}

function calcF(kp) {
    return Math.sqrt(F / acpMax) * fMax *kp // (5.19)
}

console.log('Проміжні значення');
console.log(`Knp = ${knp}`);
console.log(`pG = ${pG}`);
console.log(`Поправочний коефіцієнт = ${kp}`);

console.log('\nШукані значення');
console.log(`Температура = ${temperature}`);
console.log(`Тиск = ${pressure}`);
console.log(`Витрати = ${f}`);