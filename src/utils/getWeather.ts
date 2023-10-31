import fetch from 'node-fetch';
import {
  MarsSolData,
  MarsWeatherApiResponse,
  SolData
} from '../types/ApiResponse';

/**
 * Recupera de forma assíncrona os dados meteorológicos do URL fornecido e os processa para retornar os primeiros 14 dias solares marcianos (Sols) de dados de temperatura.
 *
 * @param {string} url - O endpoint URL de onde os dados meteorológicos de Marte serão obtidos.
 * @returns {Promise<SolData>} Uma promessa que se resolve em um array de objetos SolData, cada um contendo informações sobre um único dia solar marciano (Sol).
 * O SolData inclui o número do Sol, a data terrestre e as temperaturas mínima e máxima desse dia.
 * @throws Lança um erro com o código de status HTTP se a resposta da chamada fetch não for 'ok'.
 * @example
 * // Exemplo de uso
 * getWeather('https://api.marsweather.app/v1/latest/').then(data => {
 *   console.log(data);
 * });
 */
export const getWeather = async (url: string): Promise<SolData> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }
    const data: MarsWeatherApiResponse = await response.json();

    const first14Soles: MarsSolData[] = data.soles.slice(0, 14);

    const sols: SolData = first14Soles.map((sol) => ({
      sol: sol.sol,
      date: sol.terrestrial_date,
      minTemp: parseInt(sol.min_temp),
      maxTemp: parseInt(sol.max_temp)
    }));
    return sols;
  } catch (error) {
    console.error('Erro ao buscar os dados meteorológicos:', error);
    return [];
  }
};
