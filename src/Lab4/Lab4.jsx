import * as S from './Lab4.module.css'
import React, { useState } from 'react'
import { InputNumber } from 'antd'
import { data } from './data.js'
import {
  calcACoefficients,
  calcCoefficientL,
  calcDeltaQ,
  calcPCoefficients, calcRefactoredValues, solveSystem,
} from './funcs.js'

const Lab4 = () => {
  const [inputs, setInputs] = useState(data)

  const handleInputChange = (id, value) => {
    const inputToUpdate = inputs.find(input => input.id === id)
    inputToUpdate.value = value
    setInputs(structuredClone(inputs))
  }

  const getInputId = (id) => {
    return inputs.find(input => input.id === id).value
  }

  const l =  getInputId('l')
  const x1 = getInputId('x1')
  const x2 = getInputId('x2')
  const x3 = getInputId('x3')
  const x4 = getInputId('x4')
  const sigma1 = getInputId('sigma1')
  const sigma2 = getInputId('sigma2')
  const sigma3 = getInputId('sigma3')
  const sigma4 = getInputId('sigma4')
  const deltaX = [getInputId('delta_x'), getInputId('delta_x'), getInputId('delta_x'), getInputId('delta_x4')]
  const coefficientL = calcCoefficientL(x1,x2,x3,x4)

  
  const isCorrect = Math.abs(coefficientL) < l;
  
  const aCoefficients = calcACoefficients(l,x1,x2,x3,x4)
  const deltaQ = calcDeltaQ(aCoefficients, x1, x2, x3, x4);
  const pCoefficients = calcPCoefficients(sigma1, sigma2, sigma3, sigma4);
  const solvedSystem = solveSystem(pCoefficients, deltaQ, coefficientL);

  
  const refactoredValues = calcRefactoredValues(x1, x2, x3, x4, solvedSystem);
  const sumRefactored = refactoredValues.reduce((acc, value) => acc + value, 0);
  return (
    <div className={S.wrapper}>
      Вхідні параметри:
      <div className={S.inputWrapper}>
        {inputs.map(({ id, name, description, value, min, max, step }) => {
          return <div key={id} className={S.inputElement}>
            <div className={S.inputName}>{name}:</div>
            <InputNumber onChange={(value) => handleInputChange(id, value)}
                         step={step} min={min} max={max}
                         value={value}/>
            <div>{description}</div>
          </div>
        })}
      </div>
      <div className={S.resultWrapper}>
        1. Визначаємо похибку l виконання рівняння зв'язку між виміряними параметрами: <br/>
        l: <b>{coefficientL.toFixed(4)}</b><br/> <br/>
        2. Перевіряємо виконання умови: <br/>l {">"} l* <br/>
        {l} {">"} {coefficientL.toFixed(4)} <br/>
        {isCorrect ?
          <div>Все добре</div>:
          <div>
            Отже, серед результатів вимірювання x̃i є не достовірні. <br/>
            3. Запишемо лінеаризовану математичну модель процесу, для якої знайдемо числові значення коефіцієнтів <br/>
            A1 = <b>{aCoefficients.a1.toFixed(4)}</b> <br/>
            A2 = <b>{aCoefficients.a2.toFixed(4)}</b><br/>
            A3 = <b>{aCoefficients.a3.toFixed(4)}</b><br/>
            A4 = <b>{aCoefficients.a4.toFixed(4)}</b><br/>
            4. Запишемо систему рівнянь для чого розрахуємо спочатку вагові коефіцієнти р: <br/>
            K = <b>{pCoefficients.k.toFixed(4)}</b><br/>
            P1 = <b>{pCoefficients.p1.toFixed(4)}</b><br/>
            P2 = <b>{pCoefficients.p2.toFixed(4)}</b><br/>
            P3 = <b>{pCoefficients.p3.toFixed(4)}</b><br/>
            P4 = <b>{pCoefficients.p4.toFixed(4)}</b><br/>
            5. Результат рішення системи рівнянь: <br/>
            deltaQ1 = <b>{solvedSystem[0].toFixed(4)}</b><br/>
            deltaQ2 = <b>{solvedSystem[1].toFixed(4)}</b><br/>
            deltaQ3 = <b>{solvedSystem[2].toFixed(4)}</b><br/>
            deltaQ4 = <b>{solvedSystem[3].toFixed(4)}</b><br/>
            6. Перевіряємо виконання умови |Δ𝑥i| ≤ xi*.
            {solvedSystem.map((value, index)=>{
              return <div key={index}>
                {Math.abs(value) > deltaX[index] ? 
                <div>x{index+1}: Умова не виконується для значення <b>{value}</b></div>:
                <div>x{index+1}: Умова виконується для значення <b>{value}</b></div>
                }
              </div>
            })}
            <br/>
            7. За формулою (4.17) розраховуємо скориговані оцінки значень вимірюваних величин:<br/> 
            Q1 = <b>{refactoredValues[0].toFixed(4)}</b><br/>
            Q2 = <b>{refactoredValues[1].toFixed(4)}</b><br/>
            Q3 = <b>{refactoredValues[2].toFixed(4)}</b><br/>
            Q4 = <b>{refactoredValues[3].toFixed(4)}</b><br/>
            8. З урахуванням скоригованих значень перевіримо знову виконання умови:
            <b>
            {sumRefactored <= l ?
              <div>Умова не виконується</div>:
              <div>Умова виконується</div>
            }
            </b>
            <br/>
          </div>
        }
      </div>
    </div>
  )
}

export default Lab4