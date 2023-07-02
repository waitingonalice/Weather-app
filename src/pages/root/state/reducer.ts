import { useReducer } from "react";
import { InitialStateType, initialState } from "./state";
import { useLocalStorage } from "@/utils";

enum ActionType {
  SET_INPUT = "SET_INPUT",
  SET_CURRENT_WEATHER = "SET_CURRENT_WEATHER",
  ADD_RECORD = "ADD_RECORD",
  DELETE_RECORD = "DELETE_RECORD",
  SET_RECORDS = "SET_RECORDS",
  CLEAR_INPUT = "CLEAR_INPUT",
  SET_ALERT = "SET_ALERT",
}

interface InputType {
  key: keyof InitialStateType["fields"];
  value: string;
}

interface useActionType {
  type: ActionType;
  payload?: unknown;
  setLocalStorageRecords?: (arg: string) => void;
}

type SingleRecordType = InitialStateType["records"][number];

const reducer = (
  state: InitialStateType,
  action: useActionType
): InitialStateType => {
  const { payload, setLocalStorageRecords } = action;
  switch (action.type) {
    case ActionType.SET_INPUT: {
      const { key, value } = payload as InputType;
      const updateFields = { ...state.fields };
      updateFields[key] = value;
      return { ...state, fields: updateFields };
    }

    case ActionType.ADD_RECORD: {
      const response = payload as SingleRecordType;
      const updateRecords = [...state.records];
      updateRecords.unshift(response);
      const maintainNumberOfRecords = updateRecords.slice(0, 20);

      if (setLocalStorageRecords)
        setLocalStorageRecords(JSON.stringify(maintainNumberOfRecords));
      return { ...state, records: maintainNumberOfRecords };
    }

    case ActionType.DELETE_RECORD: {
      const response = payload as SingleRecordType["timestamp"];
      const updateRecords = [...state.records];
      const index = updateRecords.findIndex(
        (record) => record.timestamp === response
      );
      if (index !== -1) updateRecords.splice(index, 1);
      if (setLocalStorageRecords)
        setLocalStorageRecords(JSON.stringify(updateRecords));

      return { ...state, records: updateRecords };
    }

    case ActionType.SET_RECORDS: {
      const records = payload as InitialStateType["records"];
      return { ...state, records };
    }

    case ActionType.SET_CURRENT_WEATHER: {
      const response = payload as NonNullable<InitialStateType["data"]>;
      return {
        ...state,
        data: {
          ...response,
          currentTemp: Math.trunc(response.currentTemp),
          lowTemp: Math.trunc(response.lowTemp),
          highTemp: Math.trunc(response.highTemp),
        },
      };
    }

    case ActionType.SET_ALERT: {
      const alert = payload as InitialStateType["alert"];
      return { ...state, alert };
    }

    case ActionType.CLEAR_INPUT:
      return { ...state, fields: { city: "", country: "" } };

    default:
      return state;
  }
};

export const useWeatherAppReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [, setLocalStorageRecords] = useLocalStorage("records");

  return {
    setInput: (payload: InputType) =>
      dispatch({ type: ActionType.SET_INPUT, payload }),

    setRecords: (payload: InitialStateType["records"]) =>
      dispatch({ type: ActionType.SET_RECORDS, payload }),

    addRecord: (payload: SingleRecordType) =>
      dispatch({
        type: ActionType.ADD_RECORD,
        payload,
        setLocalStorageRecords,
      }),

    deleteRecord: (payload: SingleRecordType["timestamp"]) =>
      dispatch({
        type: ActionType.DELETE_RECORD,
        payload,
        setLocalStorageRecords,
      }),

    setCurrentWeather: (payload: InitialStateType["data"]) =>
      dispatch({ type: ActionType.SET_CURRENT_WEATHER, payload }),

    clearInput: () =>
      dispatch({
        type: ActionType.CLEAR_INPUT,
      }),

    setAlert: (payload: InitialStateType["alert"]) =>
      dispatch({ type: ActionType.SET_ALERT, payload }),

    input: state.fields,

    data: state.data,

    records: state.records,

    alert: state.alert,
  };
};
