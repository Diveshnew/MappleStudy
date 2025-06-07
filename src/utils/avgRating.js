// Exporting a default function named GetAvgRating which calculates the average rating from an array of rating objects
export default function GetAvgRating(ratingArr) {
  // If the rating array is empty or undefined, return 0 as the average
  if (ratingArr?.length === 0) return 0;

  // Reduce the array to get the sum of all ratings
  const totalReviewCount = ratingArr?.reduce((acc, curr) => {
    acc += curr.rating; // Add current rating to accumulator
    return acc; // Return updated accumulator
  }, 0); // Initial value of accumulator is 0

  // Define a multiplier for rounding to 1 decimal place
  const multiplier = Math.pow(10, 1);

  // Calculate average rating and round it to 1 decimal place
  const avgReviewCount =
    Math.round((totalReviewCount / ratingArr?.length) * multiplier) /
    multiplier;

  // Return the rounded average rating
  return avgReviewCount;
}
