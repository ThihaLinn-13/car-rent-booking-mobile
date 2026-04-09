export const getLocalISOBoundary = (
  year: number,
  month: number,
  isEnd: boolean,
) => {
  const date = isEnd
    ? new Date(year, month, 0, 23, 59, 59, 999)
    : new Date(year, month - 1, 1, 0, 0, 0, 0);

  const pad = (num: number) => num.toString().padStart(2, "0");

  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
};
