import * as S from './Lab5.module.css'
import React, { useState } from 'react'
import { InputNumber } from 'antd'
import { data } from './data.js'
import {
  calculatePressure,
  calculateSpending,
  calculateTemperature,
} from './funcs.js'

const Lab5 = () => {
  const [inputs, setInputs] = useState(data)

  const handleInputChange = (id, value) => {
    const inputToUpdate = inputs.find(input => input.id === id)
    inputToUpdate.value = value
    setInputs(structuredClone(inputs))
  }

  const getInputId = (id) => {
    return inputs.find(input => input.id === id).value
  }

  const outputSignal =  getInputId('outputSignal');
  const yMax = getInputId('yMax');
  const resolution = getInputId('resolution');
  const T = getInputId('t');
  const p0 = getInputId('p0');
  const F = getInputId('f');
  const fMax = getInputId('fMax');
  const P = getInputId('p');
  
  const temperature = calculateTemperature(outputSignal, yMax, resolution, T)
  const pressure = calculatePressure(P, outputSignal, resolution)
  
  const spending = calculateSpending(temperature, pressure, p0, F, fMax, resolution)
  
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

        1. За даними, наведеними в таблицях 5.2-5.11, розрахуємо дійсне значення вимірюваних величин (тиск, температура і витрата) <br/>
        Температура: <b>{temperature.toFixed(4)}</b> <br/>
        Тиск: <b>{pressure.toFixed(4)}</b> <br/>
        
        Витрата: <b>{spending.toFixed(4)}</b>
      </div>
    </div>
  )
}

export default Lab5