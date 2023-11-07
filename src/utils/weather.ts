/**
 * Converte a temperatura de Celsius para Fahrenheit
 * @param temperature_celsius A temperatura em Celsius
 * @returns A temperatura em Fahrenheit
 */
export const convertCelsiusToFahrenheit = (
  temperature_celsius: number
): number => {
  const temperature_fahrenheit: number = (temperature_celsius * 9) / 5 + 32;
  return temperature_fahrenheit;
};

/**
 * Calcula a diferença de temperatura do dia atual com o dia anterior
 * @param current_temperature A temperatura atual (°C ou °F)
 * @param past_temperature A temperatura anterior (°C ou °F)
 * @returns A diferença de temperatura na unidade que foi tratada
 */
export const calculateTemperatureVariation = (
  current_temperature: number,
  past_temperature: number
): number => {
  return current_temperature - past_temperature;
};
