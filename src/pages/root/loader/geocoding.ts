import { apiRoute } from "@/constants/routes";
import { useFetchData } from "@/utils";

interface GeocodingDataType {
  lat: number;
  lon: number;
  country: string;
  name: string;
}

interface GeocodingInputType {
  input: {
    city: string;
    country: string;
  };
}

export const useGeoLocation = () => {
  const [getGeocoding, options] = useFetchData<GeocodingDataType[]>();
  const getGeocodingData = async ({
    input: { city, country },
  }: GeocodingInputType): Promise<GeocodingDataType[]> => {
    const url = apiRoute.geocoding(city, country);
    const res = await getGeocoding(url);
    return res;
  };

  return [getGeocodingData, options] as const;
};
