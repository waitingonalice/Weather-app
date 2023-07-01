export interface LocationType {
  longitude: number;
  latitude: number;
}

export interface InitialStateType {
  // input fields
  fields: {
    city: string;
    country: string;
  };
  // store response from current weather api to be displayed to client, this will be polled and updated
  data: {
    currentTimestamp: number;
    highTemp: number;
    lowTemp: number;
    currentTemp: number;
    weather: string;
    humidity: number;
    currentLocation: LocationType;
    code: string;
    city: string;
  } | null;
  // This is used for storing of records and will be used as a cache layer
  records: {
    city: string;
    country: string;
    code: string;
    state: string;
    timestamp: number;
    location: LocationType;
  }[];
}

export const initialState: InitialStateType = {
  fields: {
    city: "",
    country: "",
  },
  records: [],
  data: null,
};
