import { toDDMMYYYYTime } from "@/utils/formatting";
import { useWeatherAppReducer } from "../state/reducer";
import { Text } from "@/components";

interface WeatherCardProps {
  weatherReducer: ReturnType<typeof useWeatherAppReducer>;
  error: string | null;
  children: React.ReactNode;
}

export const WeatherCard = ({
  weatherReducer,
  error,
  children,
}: WeatherCardProps) => {
  const { data } = weatherReducer;
  return (
    <section className="border-white-50 border rounded-[24px] w-full bg-white-20 p-4 sm:p-8 relative mt-32">
      <img
        src={data?.weather === "Clear" ? "sun.png" : "cloud.png"}
        className="absolute sm:-top-24 -top-16 sm:max-w-[300px] max-w-[157px] sm:right-0 right-5"
      />
      <Text type="subhead">Today&apos;s Weather</Text>
      {error ? (
        <Text className="mt-3" type="subheadBold">
          Unable to retrieve data. Please try again later.
        </Text>
      ) : (
        <div>
          <Text type="h1" className="text-primary">
            {data?.currentTemp ?? "-"}°
          </Text>

          <Text type="subhead" className="sm:mb-0 -mb-7">
            H: {data?.highTemp ?? "-"}° L: {data?.lowTemp ?? "-"}°
          </Text>
          <div className="flex justify-between mt-2 flex-col-reverse gap-y-1 sm:flex-row">
            <div className="grid grid-cols-2">
              <Text type="subheadBold" className="text-slate">
                {data?.city && data?.code ? `${data.city}, ${data.code}` : "-"}
              </Text>

              <Text type="subhead" className="text-slate text-right ml-2">
                {data?.currentTimestamp
                  ? toDDMMYYYYTime(data.currentTimestamp)
                  : "-"}
              </Text>
            </div>

            <Text type="subhead" className="text-slate text-right">
              Humidity: {data?.humidity ?? "-"}%
            </Text>

            <Text type="subhead" className="text-slate text-right">
              {data?.weather ?? "-"}
            </Text>
          </div>
        </div>
      )}
      {children}
    </section>
  );
};
