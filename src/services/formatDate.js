// Function to format a date string into a readable format
export const formatDate = (dateString) => {
  // Define options for displaying the date (e.g., "May 27, 2025")
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  // Create a new Date object from the input string
  const date = new Date(dateString);

  // Format the date using the specified locale and options
  const formattedDate = date.toLocaleDateString('en-US', options);

  // Get the hour and minutes from the date object
  const hour = date.getHours();
  const minutes = date.getMinutes();

  // Determine if the time is AM or PM
  const period = hour >= 12 ? 'PM' : 'AM';

  // Format the time in 12-hour format with zero-padded minutes
  const formattedTime = `${hour % 12}:${minutes
    .toString()
    .padStart(2, '0')} ${period}`;

  // Return the full formatted string in "Month Day, Year | hh:mm AM/PM" format
  return `${formattedDate} | ${formattedTime}`;
};
