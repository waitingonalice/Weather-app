import { Text, Input, Button } from "@/components";
import { useEffect, useState } from "react";
import { useWeatherAppReducer } from "./state/reducer";
import { WeatherCard } from "./components/WeatherCard";
import { useOnPageLeave, useLocalStorage } from "@/utils";
import { useCurrentWeather } from "./loader/currentWeather";
import { pollFreshData } from "./utils/regularPoll";
import { HistoryRecordCard } from "./components/HistoryRecordCard";
import { useGeoLocation } from "./loader/geocoding";

const Root = () => {
  const weatherReducer = useWeatherAppReducer();
  const [getCurrentWeather, currentWeatherOptions] = useCurrentWeather();
  const [getGeoLocation, geoLocationOptions] = useGeoLocation(
    weatherReducer.records
  );
  const [localStorageRecords, setLocalStorageRecords] =
    useLocalStorage("records");
  const parseLocalStorage = JSON.parse(localStorageRecords ?? "");

  useOnPageLeave(() =>
    setLocalStorageRecords(JSON.stringify(weatherReducer.records))
  );

  const loadData = async (lat: number, long: number) => {
    const response = await getCurrentWeather({
      input: {
        latitude: lat,
        longitude: long,
      },
    });
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
          (await loadData(coords.latitude, coords.longitude)),
        async (error) => {
          // Default location is Singapore
          const defaultLocation = {
            latitude: 1.2899175,
            longitude: 103.8519072,
          };
          console.warn(`${error.message}. Default location set to Singapore.`);
          !currentWeatherOptions.data &&
            (await loadData(
              defaultLocation.latitude,
              defaultLocation.longitude
            ));
        }
      );

      if (parseLocalStorage && parseLocalStorage.length > 0) {
        weatherReducer.setRecords(parseLocalStorage);
      }
    };
    onAppMount();
  }, []);

  useEffect(() => {
    if (!weatherReducer.data) return;
    // Poll for fresh data every 10 minutes for one hour if the location does not change within the timer. This checks for inactivity.
    const { currentLocation } = weatherReducer.data;
    pollFreshData(() =>
      // loadData(currentLocation.latitude, currentLocation.longitude)
      console.log("mock poll")
    );
  }, [weatherReducer.data?.currentLocation]);

  const handleOnSubmit = async () => {
    const response = await getGeoLocation({
      input: {
        city: weatherReducer.input.city,
        country: weatherReducer.input.country,
      },
    });
    weatherReducer.addRecord({
      city: weatherReducer.input.city,
      country: weatherReducer.input.country,
      code: response[0].country,
      location: {
        latitude: response[0].lat,
        longitude: response[0].lon,
      },
      state: response[0].state,
      timestamp: new Date().getTime(),
    });
  };
  const handleOnDelete = () => {
    console.log("submitted");
  };

  // console.log(geoLocationOptions.data);
  // console.log(weatherReducer.records);

  return (
    <div className="flex flex-col items-center w-[700px] justify-between">
      <div className="flex sm:flex-row flex-col sm:gap-x-4 gap-y-4 justify-between w-full mb-32">
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
          label="Country"
          onChange={(e) =>
            weatherReducer.setInput({
              key: "country",
              value: e.currentTarget.value,
            })
          }
          className="sm:w-1/2 w-full"
        />
        <div className="flex gap-x-4 justify-end">
          <Button type="primarySearch" onClick={() => handleOnSubmit()} />
          <Button type="primaryDelete" onClick={() => handleOnDelete()} />
        </div>
      </div>

      <WeatherCard
        weatherReducer={weatherReducer}
        error={currentWeatherOptions.error}
      >
        <HistoryRecordCard weatherReducer={weatherReducer} />
      </WeatherCard>
    </div>
  );
};

export default Root;
