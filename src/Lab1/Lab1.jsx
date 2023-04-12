import { Fragment, useEffect, useState } from 'react';
import { Button, Input, InputNumber, Switch, Table } from 'antd';
import S from './Lab1.module.css';
import {
  generateSensors,
  generateSensorsForAddressCalculation, sensorPerformAddressCalculation,
  sensorsPerformAddressCalculation,
  sensorsPerformCalculation,
} from './sensors.js';

const stripe = (value, number) => {
  if (typeof value === 'number') {
    return value.toFixed(number);
  }
  return value;
};


const Lab1 = () => {
  const [isAddressCalculation, setIsAddressCalculation] = useState(false);

  const [sensorCount, setSensorCount] = useState(10);
  const [sensorTime, setSensorTime] = useState(0.3);
  const [sensors, setSensors] = useState([]);
  const [performedSensors, setPerformedSensors] = useState([]);

  const [isCalculationRunning, setIsCalculationRunning] = useState(false);

  const [disabledSensorButtons, setDisabledSensorButtons] = useState([]);

  useEffect(() => {
    setSensors([]);
    if (isAddressCalculation) {
      setSensorCount(5);
    } else {
      setSensorCount(10);
    }
  }, [isAddressCalculation]);

  const generateSensorsData = () => {
    const data =
      isAddressCalculation ?
        generateSensorsForAddressCalculation(sensorCount) :
        generateSensors(sensorCount);
    setSensors(data);
  };

  const performCalculation = async () => {
    setIsCalculationRunning(true);
    setPerformedSensors([]);
    setDisabledSensorButtons([]);

    if (isAddressCalculation) {
      await sensorsPerformAddressCalculation(sensors, (performedSensor) => {
        setPerformedSensors(prev => [...prev, performedSensor]);
      });
    } else {
      await sensorsPerformCalculation(sensors, sensorTime, (performedSensor) => {
        setPerformedSensors(prev => [...prev, performedSensor]);
      });
    }
    setIsCalculationRunning(false);
  };

  const performCalculationSensor = async (number) => {
    setIsCalculationRunning(true);
    if (disabledSensorButtons.length === 0) {
      setPerformedSensors([]);
    }
    setDisabledSensorButtons(prev => [...prev, number]);
    await sensorPerformAddressCalculation(sensors[number - 1], (performedSensor) => {
      setPerformedSensors(prev => [...prev, performedSensor]);
    });
    setIsCalculationRunning(false);
  };

  const setSensorTimeMeasure = (value, index) => {
    const newSensors = [...sensors];
    newSensors[index - 1].timeMeasure = value;
    newSensors.sort((a, b) => a.key - b.key);
    setSensors(newSensors);
  };

  const setSensorPriority = (value, index) => {
    const newSensors = [...sensors];
    newSensors[index - 1].priority = value;
    newSensors.sort((a, b) => a.key - b.key);
    setSensors(newSensors);
  };

  const addressColumns = [
    {
      title: 'Період',
      dataIndex: 'timeMeasure',
      key: 'timeMeasure',
      render: (text, record) => (
        <InputNumber step={1} min={0} value={text} onChange={(value) => {
          setSensorTimeMeasure(value, record.key);
        }}/>
      ),
    },
    {
      title: 'Пріоритет',
      dataIndex: 'priority',
      key: 'priority',
      render: (text, record) => (
        <InputNumber step={1} min={0} value={text} onChange={(value) => {
          setSensorPriority(value, record.key);
        }}/>
      ),
    },
  ];

  const columns = [
    {
      title: 'Датчик',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Нижній ліміт',
      dataIndex: 'lowLimit',
      key: 'lowLimit',
      render: (text, record) => (
        <span>{stripe(text, 4)}</span>
      ),
    },
    {
      title: 'Верхній ліміт',
      dataIndex: 'highLimit',
      key: 'highLimit',
      render: (text, record) => (
        <span>{stripe(text, 4)}</span>
      ),
    },
    {
      title: 'Аварійний ліміт',
      dataIndex: 'emergencyLimit',
      key: 'emergencyLimit',
      render: (text, record) => (
        <span>{stripe(text, 4)}</span>
      ),
    },
    ...(isAddressCalculation ? addressColumns : []),
  ];

  return <div className={S.wrapper}>

    <div className={S.wrapperLeft}>
      <div className={S.typeCalculation}>
        <Switch checked={isAddressCalculation} onChange={(e) => {setIsAddressCalculation(e);}}/>
        {isAddressCalculation ?
          <span>Адресне опитування</span>
          :
          <span>Циклічне опитування</span>
        }
      </div>
      <div className={S.item}>
        <div>Кількість датчиків:</div>
        <Input
          type="number"
          className={S.input}
          value={sensorCount}
          onChange={(e) => setSensorCount(e.target.value)}>
        </Input>
      </div>
      {!isAddressCalculation &&
        <div className={S.item}>
          <div>Період опитування датчика:</div>
          <InputNumber
            className={S.input}
            step={0.1}
            value={sensorTime}
            onChange={(value) => setSensorTime(value)}>
          </InputNumber>
        </div>
      }

      <Button className={S.calculateButton} type="primary" onClick={generateSensorsData}>
        Згенерувати
      </Button>
      <Table className={S.table} dataSource={sensors} columns={columns}/>;
    </div>
    <div className={S.wrapperRight}>
      {isAddressCalculation ?
        <span>Адресне опитування датчиків:</span> :
        <span>Циклічне опитування датчиків:</span>
      }

      <Button loading={isCalculationRunning} className={S.calculateButton} onClick={performCalculation} type="primary">
        {isAddressCalculation ?
          'Виконати опитування всіх' : 'Виконати опитування'
        }
      </Button>
      {isAddressCalculation &&
        <>
          <div>
            Опитування датчика з номером:
          </div>
          <div className={S.addressButtons}>
            {new Array(sensors.length).fill(0).map((_, index) =>
              <Button disabled={
                disabledSensorButtons.includes(index + 1) ||
                isCalculationRunning
              } key={index} onClick={() => {
                performCalculationSensor(index + 1);
              }}>{index + 1}</Button>)}
          </div>
        </>
      }
      <div>
        {performedSensors.map((sensor, index) => {
          let sensorClass = '';
          if (sensor.isEmergency) {
            sensorClass = S.error;
          } else if (sensor.isWarning) {
            sensorClass = S.warning;
          }
          return <Fragment key={index}>
            {sensor.isEmergency &&
              <div className={S.error}>
                <b>ПОМИЛКА: Вихід за ліміт на {sensor.emergencyValue} значення </b>
              </div>
            }
            {
              sensor.isWarning &&
              <div className={S.warning}>
                <b>ПОПЕРЕДЖЕННЯ: Вихід за ліміт на {sensor.warningValue} </b>
              </div>
            }
            <div className={sensorClass}>
              {sensor.name} - {' '}
              <b>value({stripe(sensor.value, 4)})</b>,
              low({stripe(sensor.lowLimit, 4)}),
              high({stripe(sensor.highLimit, 4)}),
              emergency({stripe(sensor.emergencyLimit, 4)})
            </div>


          </Fragment>;
        })}
      </div>
    </div>
  </div>;
};

export default Lab1;