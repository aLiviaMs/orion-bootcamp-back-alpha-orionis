export interface MarsWeatherApiResponse {
  soles?: MarsSolData[];
}

export interface MarsSolData {
  sol: string;
  terrestrial_date: string;
  min_temp: string;
  max_temp: string;
}

interface SolTemperatureData {
  sol: string;
  date: string;
  minTemp: number;
  maxTemp: number;
}

export type SolData = SolTemperatureData[];
