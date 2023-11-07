/* eslint-disable @typescript-eslint/no-explicit-any */
import { SolData, SolTemperatureData } from '../types/ApiResponse';
import { WeatherCard, WeatherData } from '../types/Weather';

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

/**
 * Formata de forma assíncrona os dados que vem da API da NASA.
 * @param {SolData[]} response - Os dados que vem da API da NASA.
 * @returns {Promise<WeatherData>} - Uma promessa que se resolve em dados meteorológicos formatados como WeatherData,
 * que contém um array de objetos WeatherCard. Cada objeto WeatherCard fornece as leituras de
 * temperatura em Celsius e Fahrenheit, juntamente com a data terrestre e o sol (dia solar marciano).
 * Cada temperatura é arredondada para uma casa decimal em Fahrenheit.
 */
export const formatWeatherData = async (
  response: SolData
): Promise<WeatherData> => {
  const weatherCards: WeatherCard[] = response.map(
    (data: SolTemperatureData) => ({
      temperature: {
        celsius: {
          min: {
            value: data.minTemp
          },
          max: {
            value: data.maxTemp
          }
        },
        fahrenheit: {
          min: {
            value: parseFloat(
              convertCelsiusToFahrenheit(data.minTemp).toFixed(1)
            )
          },
          max: {
            value: parseFloat(
              convertCelsiusToFahrenheit(data.maxTemp).toFixed(1)
            )
          }
        }
      },
      terrestrialDate: data.date,
      solDate: parseInt(data.sol, 10)
    })
  );

  return { weatherCards };
};
