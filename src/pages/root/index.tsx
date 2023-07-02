import { Input, Button, Alert } from "@/components";
import { useEffect } from "react";
import { useWeatherAppReducer } from "./state/reducer";
import { WeatherCard } from "./components/WeatherCard";
import { useLocalStorage } from "@/utils";
import { useCurrentWeather } from "./loader/currentWeather";
import { pollFreshData } from "./utils/regularPoll";
import { HistoryRecordCard } from "./components/HistoryRecordCard";
import { useGeoLocation } from "./loader/geocoding";

const Root = () => {
  const weatherReducer = useWeatherAppReducer();
  const [getCurrentWeather, currentWeatherOptions] = useCurrentWeather();
  const [getGeoLocation, geoLocationOptions] = useGeoLocation();
  const [localStorageRecords] = useLocalStorage("records");

  const loadCurrentWeather = async (lat: number, long: number) => {
    const response = await getCurrentWeather({
      input: {
        latitude: lat,
        longitude: long,
      },
    });
    if (!response) throw new Error("No results found.");
    weatherReducer.setCurrentWeather({
      currentLocation: {
        latitude: lat,
        longitude: long,
      },
      currentTimestamp: response.dt,
      highTemp: response.main.temp_max,
      lowTemp: response.main.temp_min,
      currentTemp: response.main.temp,
      weather: response.weather[0].main,
      humidity: response.main.humidity,
      city: response.name,
      code: response.sys.country,
    });
  };

  useEffect(() => {
    // On mount, set current data location to user's location, if permission is denided, set to default location
    const onAppMount = () => {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) =>
          !currentWeatherOptions.data &&
          (await loadCurrentWeather(coords.latitude, coords.longitude)),
        async (error) => {
          // Default location is Singapore
          const defaultLocation = {
            latitude: 1.2899175,
            longitude: 103.8519072,
          };
          console.warn(`${error.message}. Default location set to Singapore.`);
          !currentWeatherOptions.data &&
            (await loadCurrentWeather(
              defaultLocation.latitude,
              defaultLocation.longitude
            ));
        }
      );
      if (localStorageRecords)
        weatherReducer.setRecords(JSON.parse(localStorageRecords));
    };
    onAppMount();
  }, []);

  useEffect(() => {
    if (!weatherReducer.data) return;
    // Poll for fresh data every 10 minutes for one hour if the location does not change within the timer. This checks for inactivity.
    const { currentLocation } = weatherReducer.data;
    pollFreshData(() =>
      loadCurrentWeather(currentLocation.latitude, currentLocation.longitude)
    );
  }, [weatherReducer.data?.currentLocation]);

  const handleOnSubmit = async () => {
    if (!weatherReducer.input.city && !weatherReducer.input.country) return;
    try {
      const response = await getGeoLocation({
        input: {
          city: weatherReducer.input.city,
          country: weatherReducer.input.country,
        },
      });

      if ("cod" in response || response.length < 1 || geoLocationOptions.error)
        throw new Error("No results found.");

      weatherReducer.addRecord({
        code: response[0].country,
        location: {
          latitude: response[0].lat,
          longitude: response[0].lon,
        },
        city: response[0].name,
        timestamp: new Date().getTime(),
      });

      await loadCurrentWeather(response[0].lat, response[0].lon);
      weatherReducer.setAlert({ show: false, title: "" });
    } catch (err) {
      process.env.NODE_ENV === "development" && console.error(err);
      if (err instanceof Error) {
        weatherReducer.setAlert({ show: true, title: err.message });
      }
    }
  };

  const handleOnDelete = () => weatherReducer.clearInput();

  return (
    <div className="flex flex-col items-center w-[700px]">
      <div className="flex sm:flex-row flex-col sm:gap-x-4 gap-y-4 justify-between w-full">
        <Input
          value={weatherReducer.input.city}
          label="City"
          onChange={(e) =>
            weatherReducer.setInput({
              key: "city",
              value: e.currentTarget.value,
            })
          }
          className="sm:w-1/2 w-full"
        />
        <Input
          value={weatherReducer.input.country}
          label="Country Code"
          onChange={(e) =>
            weatherReducer.setInput({
              key: "country",
              value: e.currentTarget.value.toUpperCase(),
            })
          }
          className="sm:w-1/2 w-full"
        />
        <div className="flex gap-x-4 justify-end">
          <Button
            type="primarySearch"
            onClick={() => handleOnSubmit()}
            disabled={
              currentWeatherOptions.loading || geoLocationOptions.loading
            }
          />
          <Button
            type="primaryDelete"
            onClick={() => handleOnDelete()}
            disabled={
              currentWeatherOptions.loading || geoLocationOptions.loading
            }
          />
        </div>
      </div>
      <Alert
        {...weatherReducer.alert}
        className="mt-4"
        onClose={() =>
          weatherReducer.setAlert({
            show: false,
            title: "",
          })
        }
      />
      <WeatherCard
        weatherReducer={weatherReducer}
        error={currentWeatherOptions.error}
      >
        <HistoryRecordCard
          weatherReducer={weatherReducer}
          loadCurrentWeather={loadCurrentWeather}
          loading={currentWeatherOptions.loading}
        />
      </WeatherCard>
    </div>
  );
};

export default Root;
