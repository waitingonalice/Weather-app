import { useReducer } from "react";
import { InitialStateType, LocationType, initialState } from "./state";

enum ActionType {
  SET_INPUT = "SET_INPUT",
  SET_RESPONSE = "SET_RESPONSE",
  ADD_RECORD = "ADD_RECORD",
  DELETE_RECORD = "DELETE_RECORD",
  SET_RECORDS = "SET_RECORDS",
}

interface InputType {
  key: keyof InitialStateType["fields"];
  value: string;
}

interface useActionType {
  type: ActionType;
  payload?: unknown;
}

type SingleRecordType = InitialStateType["records"][number];

const reducer = (
  state: InitialStateType,
  action: useActionType
): InitialStateType => {
  const { payload } = action;
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
      return { ...state, records: updateRecords };
    }

    case ActionType.SET_RECORDS: {
      return { ...state };
    }

    case ActionType.SET_RESPONSE: {
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

    default:
      return state;
  }
};

export const useWeatherAppReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    setInput: (payload: InputType) =>
      dispatch({ type: ActionType.SET_INPUT, payload }),

    setRecords: (payload: InitialStateType["records"]) =>
      dispatch({ type: ActionType.SET_RECORDS, payload }),

    addRecord: (payload: SingleRecordType) =>
      dispatch({ type: ActionType.ADD_RECORD, payload }),

    setCurrentWeather: (payload: InitialStateType["data"]) =>
      dispatch({ type: ActionType.SET_RESPONSE, payload }),

    input: state.fields,

    data: state.data,
    /** Removes duplicate entries and keeps the first 50 entries */
    records: [
      ...new Map(
        state.records.map((item) => [item.state && item.code, item])
      ).values(),
    ].slice(0, 50),
  };
};
