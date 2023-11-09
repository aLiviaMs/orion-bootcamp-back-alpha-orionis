import {
  MarsSolData,
  MarsWeatherApiResponse,
  SolData
} from '../types/ApiResponse';
import axios from 'axios';
/**
 * Asynchronously retrieves weather data from the provided URL and processes it to return the first 14 Martian solar days (Sols) of temperature data.
 *
 * @param {string} url - The endpoint URL from where the Martian weather data will be fetched.
 * @returns {Promise<SolData>} A promise that resolves to an array of SolData objects, each containing information about a single Martian solar day (Sol).
 * SolData includes the Sol number, the terrestrial date, and the minimum and maximum temperatures of that day.
 * @throws Throws an error with the HTTP status code if the response from the fetch call is not 'ok'.
 * @example
 * // Usage example
 * getWeather('https://api.marsweather.app/v1/latest/').then(data => {
 *   console.log(data);
 * });
 */
export const getWeatherHandler = async (url: string): Promise<SolData> => {
  const response = await axios.get<MarsWeatherApiResponse>(url);

  const data: MarsWeatherApiResponse = response.data;

  const first14Soles: MarsSolData[] = data.soles.slice(0, 14);

  const sols: SolData = first14Soles.map((sol) => ({
    sol: sol.sol,
    date: sol.terrestrial_date,
    minTemp: parseInt(sol.min_temp),
    maxTemp: parseInt(sol.max_temp)
  }));
  return sols;
};
