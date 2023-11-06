export interface WeatherCard {
  temperature: {
    celsius: {
      min: {
        value: number;
        variation?: number;
      };
      max: {
        value: number;
        variation?: number;
      };
    };
    fahrenheit: {
      min: {
        value: number;
        variation?: number;
      };
      max: {
        value: number;
        variation?: number;
      };
    };
  };
  terrestrialDate: string;
  solDate: number;
}

export interface WeatherData {
  weatherCards: WeatherCard[];
}

export interface WeatherResponse {
  status: boolean;
  data: WeatherData;
}
