const randomMinMax = (min, max) => {
  return Math.random() * (max - min) + min;
}

const randomIntMinMax = (min, max) =>{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const shuffle = (arr)=>{
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}



export const generateSensors = (count) => {
  return new Array(parseInt(count,10)).fill(0).map((_, i) => ({
    key: i + 1,
    name: `Сенсор ${i + 1}`,
    lowLimit: randomMinMax(20, 40),
    highLimit: randomMinMax(60, 80),
    emergencyLimit: randomMinMax(2, 5),
  }));
};

export const generateSensorsForAddressCalculation = (count) => {
  const priorityNumbers = shuffle(new Array(parseInt(count,10)).fill(0).map((_, i) => i + 1));
  return generateSensors(count).map((sensor) => ({
    ...sensor,
    timeMeasure: randomIntMinMax(1, 5),
    priority: priorityNumbers[sensor.key - 1],
  }));
}

const performSensor = (sensor) => {
  const RANDOM_MIN_MAX = 5;
  const { lowLimit, highLimit, emergencyLimit } = sensor;
  const value = randomMinMax(lowLimit-RANDOM_MIN_MAX, highLimit + RANDOM_MIN_MAX);
  
  const isEmergency = value >= highLimit + emergencyLimit || value <= lowLimit - emergencyLimit;
  let emergencyValue = null;
  if (isEmergency) {
    emergencyValue = 
      value >= highLimit + emergencyLimit ? 
      value - highLimit: lowLimit - value
  }
  const isWarning = (value >= highLimit || value <= lowLimit) && !isEmergency;
  let warningValue = null;
  if (isWarning) {
    warningValue = value >= highLimit ? value - highLimit : lowLimit - value;
  }
  return {
    ...sensor,
    value,
    dateTime: new Date(),
    isEmergency,
    emergencyValue,
    isWarning,
    warningValue,
    
  }
}

export const sensorsPerformCalculation = async (sensors, time, onPerformSensor) =>{
  for (const sensor of sensors) {
    await timeout(time * 1000);
    const performedSensor = performSensor(sensor); 
    onPerformSensor(performedSensor);
  }
}

export const sensorsPerformAddressCalculation = async (sensors, onPerformSensor) => {
  const sortedSensors = [...sensors]
  sortedSensors.sort((a, b) => a.priority - b.priority);
  for (const sensor of sortedSensors) {
    await timeout(sensor.timeMeasure * 1000)
    const performedSensor = performSensor(sensor);
    onPerformSensor(performedSensor);
  }
}

export const sensorPerformAddressCalculation = async (sensor, onPerformSensor) => {
  await timeout(sensor.timeMeasure * 1000)
  const performedSensor = performSensor(sensor);
  onPerformSensor(performedSensor);
}