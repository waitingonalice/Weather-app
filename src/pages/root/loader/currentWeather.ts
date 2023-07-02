import { useFetchData } from "@/utils";
import { apiRoute } from "@/constants/routes";

export interface CurrentWeatherDataType {
  weather: {
    main: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  dt: number;
  coord: {
    lon: number;
    lat: number;
  };
  sys: {
    country: string;
  };
  name: string;
}

interface CurrentWeatherInputType {
  input: { longitude: number; latitude: number };
}

export const useCurrentWeather = () => {
  const [fetchCurrentWeather, options] = useFetchData<CurrentWeatherDataType>();

  const getCurrentWeather = async ({
    input: { longitude, latitude },
  }: CurrentWeatherInputType): Promise<CurrentWeatherDataType> => {
    const url = apiRoute.currentWeather(latitude, longitude);
    const res = await fetchCurrentWeather(url);
    return res;
  };

  return [getCurrentWeather, options] as const;
};
