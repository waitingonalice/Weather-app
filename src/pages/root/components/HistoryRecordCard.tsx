import { useWeatherAppReducer } from "../state/reducer";
import { Text } from "@/components";

interface HistoryRecordCardProps {
  weatherReducer: ReturnType<typeof useWeatherAppReducer>;
}

export const HistoryRecordCard = ({
  weatherReducer,
}: HistoryRecordCardProps) => {
  const { records } = weatherReducer;
  return (
    <div className="border-0 rounded-[24px] bg-white-20 p-6 mt-5 overflow-y-auto flex-1">
      <Text type="subhead">Search History</Text>
      {records.length < 1 ? (
        <Text type="subheadBold" className="text-center mt-5">
          There are no records to show at the moment.
        </Text>
      ) : (
        records.map((item) => {
          return <></>;
        })
      )}
    </div>
  );
};
