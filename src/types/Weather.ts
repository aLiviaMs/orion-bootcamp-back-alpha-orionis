export interface WeatherCard {
  temperature: {
    celsius: {
      min: {
        value: number;
      };
      max: {
        value: number;
      };
    };
    fahrenheit: {
      min: {
        value: number;
      };
      max: {
        value: number;
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
