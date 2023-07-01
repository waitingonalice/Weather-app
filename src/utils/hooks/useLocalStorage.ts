import { useState } from "react";

type LocalStorageType = string | null;

export function useLocalStorage(key: string) {
  const [state, setState] = useState<LocalStorageType>(
    typeof window !== "undefined" ? localStorage.getItem(key) : null
  );

  const setWithLocalStorage = (nextState: NonNullable<LocalStorageType>) => {
    localStorage.setItem(key, nextState);
    setState(nextState);
  };

  return [state, setWithLocalStorage] as const;
}
