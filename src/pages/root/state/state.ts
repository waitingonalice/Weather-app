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
  // store response from current weather api to be displayed to client
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
  // This is used for storing of records
  records: {
    code: string;
    city?: string;
    timestamp: number;
    location: LocationType;
  }[];
  alert: {
    title: string;
    show: boolean;
  };
}

export const initialState: InitialStateType = {
  fields: {
    city: "",
    country: "",
  },
  records: [],
  data: null,
  alert: {
    title: "",
    show: false,
  },
};
