import { useWeatherAppReducer } from "../state/reducer";
import { Text, Button } from "@/components";
import { InitialStateType } from "../state/state";

interface HistoryRecordCardProps {
  weatherReducer: ReturnType<typeof useWeatherAppReducer>;
  loadCurrentWeather: (lat: number, long: number) => Promise<void>;
  loading: boolean;
}

interface SingleRecordProps {
  record: InitialStateType["records"][number];
  handleDelete: (timestamp: number) => void;
  handleSearch: (lat: number, long: number) => void;
  loading: boolean;
}

const SingleRecord = ({
  record,
  handleDelete,
  handleSearch,
  loading,
}: SingleRecordProps) => {
  return (
    <div className="flex justify-between bg-white-40 p-4 h-fit items-center rounded-[16px]">
      <div className="flex max-w-[50%]">
        {record.city && (
          <Text type="body" className="line-clamp-1">
            {record.city},
          </Text>
        )}
        &nbsp;
        <Text type="body">{record.code}</Text>
      </div>
      <div className="flex gap-x-4">
        <Button
          disabled={loading}
          type="secondarySearch"
          onClick={() =>
            handleSearch(record.location.latitude, record.location.longitude)
          }
        />
        <Button
          disabled={loading}
          type="secondaryDelete"
          onClick={() => handleDelete(record.timestamp)}
        />
      </div>
    </div>
  );
};

export const HistoryRecordCard = ({
  weatherReducer,
  loadCurrentWeather,
  loading,
}: HistoryRecordCardProps) => {
  const { records } = weatherReducer;
  const handleDeleteRecord = (timestamp: number) =>
    weatherReducer.deleteRecord(timestamp);

  const handleSearch = (lat: number, long: number) =>
    loadCurrentWeather(lat, long);

  return (
    <div className="border-0 rounded-[24px] bg-white-20 p-6 mt-6  ">
      <Text type="subhead" className="mb-6">
        Search History
      </Text>
      {records.length < 1 ? (
        <Text type="subheadBold" className="text-center mt-5">
          There are no records to show at the moment.
        </Text>
      ) : (
        <div className="flex flex-col gap-y-6 max-h-[650px] overflow-y-auto overflow-hidden">
          {records.map((item) => (
            <SingleRecord
              key={item.timestamp}
              record={item}
              handleDelete={(timestamp) => handleDeleteRecord(timestamp)}
              handleSearch={(lat, long) => handleSearch(lat, long)}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
};
