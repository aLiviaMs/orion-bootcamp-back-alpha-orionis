export interface WeatherCard {
  temperature: {
    celsius: {
      min: {
        value: number;
        variation: Variation;
      };
      max: {
        value: number;
        variation: Variation;
      };
    };
    fahrenheit: {
      min: {
        value: number;
        variation: Variation;
      };
      max: {
        value: number;
        variation: Variation;
      };
    };
  };
  terrestrialDate: string;
  solDate: number;
}

export enum Variation {
  HIGHER = 'higher',
  LOWER = 'lower',
  NEUTRAL = 'neutral'
}

export interface WeatherData {
  weatherCards: WeatherCard[];
}

export interface WeatherResponse {
  status: boolean;
  data: WeatherData;
}
