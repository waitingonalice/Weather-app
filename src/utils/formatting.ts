import dayjs from "dayjs";

export const toDDMMYYYYTime = (timestamp: number) =>
  dayjs.unix(timestamp).format("DD-MM-YYYY hh:mm a");
