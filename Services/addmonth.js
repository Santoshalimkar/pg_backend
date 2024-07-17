function addMonth(dateString, monthNumber) {
    // Parse the date string
    const [day, month, year] = dateString.split('/').map(Number);
  
    // Create a Date object
    const date = new Date(year, month - 1, day);
  
    // Add the specified number of months
    date.setMonth(date.getMonth() + monthNumber);
  
    // Adjust for cases where adding a month changes the year
    const newDay = date.getDate();
    const newMonth = date.getMonth() + 1;
    const newYear = date.getFullYear();
  
    // Return the new date as a string in the same format
    return `${newDay}/${newMonth}/${newYear}`;
  }
  
  module.exports = addMonth;
  