import dayjs from "dayjs";

const formatDate = (str: string) => {
  if (!str) {
    return "";
  }
  return dayjs(str).format("YYYY-MM-DD");
};

const truncateString = (str: string) => {
  if (str.length <= 20) {
    return str;
  } else {
    return str.slice(0, 20) + "...";
  }
};

const formatNull = (value: any) => {
  return value === "NULL" ? "-" : value;
};

export { formatDate, truncateString, formatNull };
