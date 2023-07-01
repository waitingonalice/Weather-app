import { apiRoute } from "@/constants/routes";
import { useWeatherAppReducer } from "../state/reducer";
import { useFetchData } from "@/utils";

interface GeocodingDataType {
  lat: number;
  lon: number;
  country: string;
  state: string;
  code: string;
}

interface GeocodingInputType {
  input: {
    city?: string;
    country?: string;
  };
}

export const useGeoLocation = (
  records: ReturnType<typeof useWeatherAppReducer>["records"]
) => {
  const [getGeocoding, options] = useFetchData<GeocodingDataType[]>();

  const getGeocodingData = async ({
    input: { city, country },
  }: GeocodingInputType): Promise<GeocodingDataType[]> => {
    const url = apiRoute.geocoding(city ?? "", country ?? "");
    // caching layer to prevent unnecessary api calls
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      if (
        record.city.toLowerCase() === city?.toLowerCase() &&
        record.country.toLowerCase() === country?.toLowerCase()
      ) {
        return [
          {
            lat: record.location.latitude,
            lon: record.location.longitude,
            country: record.country,
            state: record.state,
            code: record.code,
          },
        ];
      }
    }
    const res = await getGeocoding(url);
    return res;
  };

  return [getGeocodingData, options] as const;
};
