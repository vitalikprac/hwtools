const randomMinMax = (min, max) => {
  return Math.random() * (max - min) + min;
}

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    await timeout(time);
    const performedSensor = performSensor(sensor); 
    onPerformSensor(performedSensor);
  }
}

