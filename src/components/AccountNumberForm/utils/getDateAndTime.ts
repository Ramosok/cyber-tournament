export const getDateAndTime = (): string => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const min = date.getMinutes();

  const arr = [day, month, year, hour, min];
  const newArr = arr.map((item) => (item < 10 ? `0${item}` : item));

  return `${newArr[0]}.${newArr[1]}.${newArr[2]} (${newArr[3]}:${newArr[4]})`;
};
