import { useWeatherAppReducer } from "../state/reducer";
import { Text, Button } from "@/components";
import { InitialStateType } from "../state/state";
import { toDDMMYYYYTime } from "@/utils";
import { CurrentWeatherDataType } from "../loader/currentWeather";

interface HistoryRecordCardProps {
  weatherReducer: ReturnType<typeof useWeatherAppReducer>;
  loadCurrentWeather: (
    lat: number,
    long: number
  ) => Promise<CurrentWeatherDataType>;
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
      <div className="flex justify-between flex-wrap w-full gap-y-1">
        <div className="flex">
          {record.city && <Text type="body">{record.city},&nbsp;</Text>}
          <Text type="body">{record.code}</Text>
        </div>
        <Text type="body">{toDDMMYYYYTime(record.timestamp)}</Text>
      </div>
      <div className="flex gap-x-4 ml-4">
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
    <div className="border-0 rounded-[24px] bg-white-20 p-4 sm:p-6 mt-6">
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
