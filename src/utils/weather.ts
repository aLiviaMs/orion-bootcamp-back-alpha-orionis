/* eslint-disable @typescript-eslint/no-explicit-any */
import { SolData } from '../types/ApiResponse';
import { WeatherCard, WeatherData, Variation } from '../types/Weather';

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
  if (response.length < 2) {
    throw new Error('Não há dados suficientes para calcular a variação.');
  }

  const celsiusMaxVariation = calculateTemperatureVariation(
    response[1].maxTemp,
    response[0].maxTemp
  );
  const celsiusMinVariation = calculateTemperatureVariation(
    response[1].minTemp,
    response[0].minTemp
  );

  const maxVariation: Variation = getVariation(celsiusMaxVariation);
  const minVariation: Variation = getVariation(celsiusMinVariation);

  const weatherCards: WeatherCard[] = response.map((data, index) => {
    const fahrenheitMinVariation: Variation =
      index === 0
        ? getVariation(
            parseFloat(convertCelsiusToFahrenheit(data.minTemp).toFixed(1)) -
              parseFloat(
                convertCelsiusToFahrenheit(response[0].minTemp).toFixed(1)
              )
          )
        : Variation.NEUTRAL;
    const fahrenheitMaxVariation: Variation =
      index === 0
        ? getVariation(
            parseFloat(convertCelsiusToFahrenheit(data.maxTemp).toFixed(1)) -
              parseFloat(
                convertCelsiusToFahrenheit(response[0].maxTemp).toFixed(1)
              )
          )
        : Variation.NEUTRAL;

    return {
      temperature: {
        celsius: {
          min: {
            value: data.minTemp,
            variation: index === 0 ? minVariation : Variation.NEUTRAL
          },
          max: {
            value: data.maxTemp,
            variation: index === 0 ? maxVariation : Variation.NEUTRAL
          }
        },
        fahrenheit: {
          min: {
            value: parseFloat(
              convertCelsiusToFahrenheit(data.minTemp).toFixed(1)
            ),
            variation: fahrenheitMinVariation
          },
          max: {
            value: parseFloat(
              convertCelsiusToFahrenheit(data.maxTemp).toFixed(1)
            ),
            variation: fahrenheitMaxVariation
          }
        }
      },
      terrestrialDate: convertDateToISOString(data.date),
      solDate: parseInt(data.sol, 10)
    };
  });

  return { weatherCards };
};

/**
 * Determina a direção da variação de acordo com um dado valor.
 *
 * @param {number} value - A diferença entre as duas medidas de temperatura.
 * @returns {Variation} - A direção da variação de acordo com um dos valores ('Higher', 'Lower', ou 'Neutral').
 */
const getVariation = (value: number): Variation => {
  if (value > 0) return Variation.HIGHER;
  else if (value < 0) return Variation.LOWER;
  else return Variation.NEUTRAL;
};

/**
 * Converte uma string de data no formato 'YYYY-MM-DD' para uma string no formato ISO 8601.
 *
 * @param {string} dateString - A data a ser convertida.
 * @returns {string} A string no formato ISO 8601 representando a data.
 */
const convertDateToISOString = (dateString: string): string => {
  const date = new Date(dateString);

  const isoString = date.toISOString();

  return isoString;
};
