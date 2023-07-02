import { useState } from "react";

export const useFetchData = <T>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const fetchData = async (url: string) => {
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: "GET",
      });
      const data = await res.json();
      setData(data);
      setLoading(false);
      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return [fetchData, { loading, error, data }] as const;
};
