const isSameDate = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Compare year, month, and day
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export default isSameDate;
