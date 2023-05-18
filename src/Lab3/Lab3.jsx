import * as S from './Lab3.module.css'
import React, { useState } from 'react'
import { data } from './data.js'
import { InputNumber } from 'antd'
import { calcKx, calcKxInterpolation, calcResult, getT } from './funcs.js'

const Lab3 = () => {
  const [inputs, setInputs] = useState(data)

  const handleInputChange = (id, value) => {
    const inputToUpdate = inputs.find(input => input.id === id)
    inputToUpdate.value = value
    setInputs(structuredClone(inputs))
  }

  const getInputId = (id) => {
    return inputs.find(input => input.id === id).value
  }

  const Mx = getInputId('mx')
  const Xti = getInputId('xti')
  const Dx = getInputId('dx')
  const t0 = getInputId('t0')
  const k = getInputId('k')
  const multiply = getInputId('multiply')
  const T = getT(t0, multiply)

  const Kx = calcKx(Dx, T, t0, k)
  const KxInterpolation = calcKxInterpolation(Dx, t0, T)

  const extrapolation = calcResult(Kx, Dx, Xti, Mx)
  const interpolation = calcResult(KxInterpolation, Dx, Xti, Mx)

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
            <div> {description}</div>
          </div>
        })}
      </div>
      <div className={S.resultWrapper}>
        T = {T.toFixed(4)}<br/>
        Kx екстраполяції = {Kx.toFixed(4)} <br/>
        Kx інтерполяції = {KxInterpolation.toFixed(4)} <br/>
        X екстраполяції: <b>{extrapolation.toFixed(4)}</b> <br/>
        X інтерполяції: <b>{interpolation.toFixed(4)}</b>
      </div>
    </div>
  )
}

export default Lab3