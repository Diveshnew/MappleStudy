// formattedDate utility converts a date string or object into a human-readable format
export const formattedDate = (date) => {
  // Create a Date instance from the input value
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};
