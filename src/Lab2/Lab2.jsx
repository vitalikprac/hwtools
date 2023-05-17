import * as S from './Lab2.module.css'
import React, { useState } from 'react'

import { data, data2 } from './data.js'
import { Button, InputNumber } from 'antd'
import {
  calcDeltaT, calcDx, calcJ0,
  calcKtxPressTDeltaQh, calcKtxPressTDeltaQMax,
  calcKtxTempTDeltaQh,
  calcKtxTempTDeltaQMax, calcKx,
  calcKxTa, calcMx, calcNMiddle, calcT0, calcTn,
  generateByValue, generateDeltaTArr, generateRandomIntArr,
} from './funcs.js'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'

const Lab2 = () => {
  const [inputs, setInputs] = useState(data)
  const [inputs2, setInputs2] = useState(data2)

  const handleInputChange = (id, value) => {
    const inputToUpdate = inputs.find(input => input.id === id)
    inputToUpdate.value = value
    setInputs(structuredClone(inputs))
  }

  const handleInputChange2 = (id, value) => {
    const inputToUpdate = inputs2.find(input => input.id === id)
    inputToUpdate.value = value
    setInputs2(structuredClone(inputs2))
  }

  const getInputId = (id) => {
    return inputs.find(input => input.id === id).value
  }

  const getInput2Id = (id) => {
    return inputs2.find(input => input.id === id).value
  }

  const setValues = () => {
    handleInputChange('qxmax', 3.4)
    handleInputChange('qh', 0.9)
  }

  const KxTemp = calcKxTa(getInputId('dtemp'), getInputId('qh'),
    getInputId('qxmax'))
  const T0Temp = getInputId('t0temp')

  const TDeltaT = generateByValue(getInputId('t0temp'), 5)
  const KtxTempTDeltaQh = calcKtxTempTDeltaQh(getInputId('dtemp'),
    getInputId('qxmax'), getInputId('qh'))
  const KtxTempTDeltaQMax = calcKtxTempTDeltaQMax(getInputId('dtemp'),
    getInputId('qh'), getInputId('qxmax'))

  const KxPress = calcKxTa(getInputId('dpress'), getInputId('qh'),
    getInputId('qxmax'))
  const T0Press = getInputId('t0press')

  const PDeltaP = generateByValue(getInputId('t0press'), 5, 50)
  const KtxPressTDeltaQh = calcKtxPressTDeltaQh(getInputId('dpress'),
    getInputId('qxmax'), getInputId('qh'))
  const KtxPressTDeltaQMax = calcKtxPressTDeltaQMax(getInputId('dpress'),
    getInputId('qh'), getInputId('qxmax'))

  // Part 2
  const l = getInput2Id('l')
  const v = getInput2Id('v')
  const N = getInput2Id('n')
  const tN = calcTn(l, v)
  const nMiddle = calcNMiddle(N, tN)
  const deltaT = calcDeltaT(nMiddle)
  const deltaTArr = generateDeltaTArr(deltaT)
  const arr = generateRandomIntArr(85, 110, 10)
  const Mx = calcMx(arr)
  const Dx = calcDx(arr, Mx, N)

  const DeltaQh = generateByValue(getInputId('qh'), 10)
  const DeltaQMax = generateByValue(getInputId('qxmax'), 10)
  const Kx = calcKx(DeltaQh, DeltaQMax, Dx)
  const J0 = calcJ0(Kx)
  const t0 = calcT0(J0, deltaT)

  const chartData = {
    labels: deltaTArr,
    datasets: [
      {
        label: 'Kx',
        data: Kx,
        fill: false,
        borderColor: 'rgb(75,192,192)',
      },
    ],
  }

  return (
    <div className={S.wrapper}>
      Вхідні параметри:
      <Button className={S.setHelp} type="primary" onClick={setValues}>Виставити
        для тиску</Button>
      <div className={S.inputWrapper}>
        {inputs.map(({ id, name, description, value, min, max, step }) => {
          return <div key={id} className={S.inputElement}>
            <div className={S.inputName}>{name}:</div>
            <InputNumber onChange={(value) => handleInputChange(id, value)}
                         step={step} min={min} max={max}
                         value={value}/>
          </div>
        })}
      </div>

      <div className={S.outputWrapper}>
        <b>1. Визначення періоду опитування датчиків з реалізації випадкових
          процесів за температурою і
          тиском</b><br/>
        а) При заданих QxMax, Qh - визначаємо величину Kx(Ta) <br/>
        Значення - <b>{KxTemp.toFixed(2)}</b>
        <br/> <br/>
        б) За графіком кореляційних функцій, визначемо значення періодів
        опитування Т0 датчиків температури і
        тиску <br/>
        Значення T0temp - <b>{T0Temp.toFixed(2)}</b><br/>
        Значення T0Press - <b>{T0Press.toFixed(2)}</b>
        <br/> <br/>
        <b>Датчик температури</b><br/>
        в) При постійному QxMax, Qh - визначаємо декілька значень T0 при
        значеннях Qh <br/>
        Температура Kx(T0)- <b>{KxTemp.toFixed(2)}</b> <br/>
        QxMax = const <br/>
        {TDeltaT.map((value, index) => {
          return <div key={index}>K(T - {index})
            = <b>{KtxTempTDeltaQh[index].toFixed(4)}</b>, T
            = <b>{TDeltaT[index].toFixed(2)}</b></div>
        })}
        <br/>
        г) Аналогічні розрахунки проводимо коли постійна величина Qh<br/>
        Qh = const <br/>
        {TDeltaT.map((value, index) => {
          return <div key={index}>K(T - {index})
            = <b>{KtxTempTDeltaQMax[index].toFixed(4)}</b>, T
            = <b>{TDeltaT[index].toFixed(2)}</b></div>
        })}
        <br/>

        <b>Датчик тиску</b><br/>
        в) При постійному QxMax, Qh - визначаємо декілька значень T0 при
        значеннях Qh <br/>
        Тиск Kx(T0)- <b>{KxPress.toFixed(2)}</b> <br/>
        QxMax = const <br/>
        {TDeltaT.map((value, index) => {
          return <div key={index}>K(T - {index})
            = <b>{KtxPressTDeltaQh[index].toFixed(4)}</b>, T
            = <b>{PDeltaP[index].toFixed(2)}</b></div>
        })}
        <br/>
        г) Аналогічні розрахунки проводимо коли постійна величина Qh <br/>
        Qh = const <br/>
        {TDeltaT.map((value, index) => {
          return <div key={index}>K(T - {index})
            = <b>{KtxPressTDeltaQMax[index].toFixed(4)}</b>, T
            = <b>{PDeltaP[index].toFixed(2)}</b></div>
        })}
        <br/>
        <b>2. Визначення періоду опитування датчиків за кривими реалізації
          випадкового процесу</b><br/>
        <div className={S.inputWrapper}>
          {inputs2.map(({ id, name, description, value, min, max, step }) => {
            return <div key={id} className={S.inputElement}>
              <div className={S.inputName}>{name}:</div>
              <InputNumber onChange={(value) => handleInputChange2(id, value)}
                           step={step} min={min}
                           max={max} value={value}/>
            </div>
          })}
        </div>
        а) Визначаємо крок дискретизації випадкового процесу

        Визначаємо час tN, протягом якого відбулося N перетинів <b>{tN.toFixed(
        2)}</b> <br/>
        Визначаємо середнє число нулів за одиницю часу
        (число перетинів випадкового процесу лінії математичного
        очікування) <b>{nMiddle.toFixed(2)}</b> <br/>
        Визначаємо шукане значення кроку дискретизації Δτ <b>{deltaT.toFixed(
        2)}</b><br/> <br/>
        б) Визначаємо статистичні характеристики випадкового процесу <br/>
        Mx (Математичне очікування) = <b>{Mx.toFixed(2)}</b> <br/>
        Dx (Дисперсія) = <b>{Dx.toFixed(2)}</b> <br/>
        Kx (Кореляційна функція) = <b>[{Kx.map(x => x.toFixed(2)).
        join(', ')}]</b> <br/> <br/>
        в) Визначаємо період опитування датчика <br/>
        t0 = <b>{t0.toFixed(2)} </b> <br/>
        (J0) = <b>{J0.toFixed(2)}</b> <br/>
      </div>

      {deltaTArr.length > 0 && Kx.length > 0 &&
        <Line data={chartData} options={null}/>
      }
    </div>
  )
}

export default Lab2