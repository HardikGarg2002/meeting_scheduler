export const generateTimeOptions = (minuteIncrement = 15) => {
  const timeOptions = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += minuteIncrement) {
      // const formattedHour = (hour % 12 || 12).toString().padStart(2, "0");
      const formattedHour = (hour % 12 || 12).toString();
      const formattedMinute = minute.toString().padStart(2, "0");
      const ampm = hour < 12 ? "AM" : "PM";
      const time_12_hours = `${formattedHour}:${formattedMinute} ${ampm}`;
      const time_24_hours = `${hour}:${formattedMinute}`;
      // const isDisabled =
      //   hour < currentHour ||
      //   (hour === currentHour && minute < currentMinute + 15);
      timeOptions.push(
        <option key={time_12_hours} value={time_24_hours} disabled={false}>
          {time_12_hours}
        </option>
      );
    }
  }

  return timeOptions;
};
