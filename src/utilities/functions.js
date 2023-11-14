function convertDate(date) {
  console.log('huh');
  // Get the year, month, and day from the Date object
  const year = date.getFullYear();
  // The getMonth method returns 0 for January, 1 for February, and so on.
  // Add 1 to get the correct month number and pad it with a leading zero if necessary.
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  // Pad the day with a leading zero if necessary.
  const day = ('0' + date.getDate()).slice(-2);

  // Return the formatted string
  return `${year}-${month}-${day}`;
}

export { convertDate };