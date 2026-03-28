import dayjs from "dayjs";

export const formatDateTime = (
  dateInput: string | Date,
  format: string = "HH:mm DD/MM/YYYY"
): string => {
  let dateObj: dayjs.Dayjs;
  if (typeof dateInput === "string") {
    dateObj = dayjs(dateInput);
  } else {
    dateObj = dayjs(dateInput);
  }
  return dateObj.format(format);
};

export const formatDate = (
  dateInput: string | Date | null | undefined,
  format: string = "DD/MM/YYYY"
): string => {
  if (!dateInput) return "---";

  const dateObj = dayjs(dateInput);
  if (!dateObj.isValid()) return "Ngày không hợp lệ";

  return dateObj.format(format);
};

export const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Vừa xong";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
};
