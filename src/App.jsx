import { Fragment, useState } from 'react';
import { Button, Input, Table } from 'antd';
import S from './App.module.css';
import { generateSensors, sensorsPerformCalculation } from './sensors.js';


const stripe = (value, number) => {
  if (typeof value === 'number') {
    return value.toFixed(number);
  }
  return value;
};

function App() {
  const [sensorCount, setSensorCount] = useState(10);
  const [sensorTime, setSensorTime] = useState(300);
  const [sensors, setSensors] = useState([]);
  const [performedSensors, setPerformedSensors] = useState([]);

  const [isCalculationRunning, setIsCalculationRunning] = useState(false);

  const generateSensorsData = () => {
    setSensors(generateSensors(sensorCount, sensorTime));
  };

  const performCalculation = async () => {
    setIsCalculationRunning(true);
    setPerformedSensors([]);
    await sensorsPerformCalculation(sensors, sensorTime, (performedSensor) => {
      setPerformedSensors(prev => [...prev, performedSensor]);
    });
    setIsCalculationRunning(false);
  };


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
  ];

  return <div className={S.wrapper}>
    <div className={S.wrapperLeft}>
      <div className={S.item}>
        <div>Кількість датчиків:</div>
        <Input
          type="number"
          className={S.input}
          value={sensorCount}
          onChange={(e) => setSensorCount(e.target.value)}>
        </Input>
      </div>
      <div className={S.item}>
        <div>Період опитування датчика:</div>
        <Input
          type="number"
          className={S.input}
          value={sensorTime}
          onChange={(e) => setSensorTime(e.target.value)}>
        </Input>
      </div>

      <Button className={S.calculateButton} type="primary" onClick={generateSensorsData}>
        Згенерувати
      </Button>
      <Table className={S.table} dataSource={sensors} columns={columns}/>;
    </div>
    <div className={S.wrapperRight}>
      <span>Циклічне опитування датчиків:</span>
      <Button loading={isCalculationRunning} className={S.calculateButton} onClick={performCalculation} type="primary">Виконати
        опитування</Button>
      {/*<Button onClick={()=>setIsCalculationRunning(false)}>Зупинити</Button>*/}
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
                <b>ПОМИЛКА: Вихід за рамки на {sensor.emergencyValue} значення </b>
              </div>
            }
            {
              sensor.isWarning &&
              <div className={S.warning}>
                <b>ПОПЕРЕДЖЕННЯ: Вихід за рамки на {sensor.warningValue} </b>
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
}

export default App;
