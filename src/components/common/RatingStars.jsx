// Importing necessary hooks and star icons from their respective libraries
import { useEffect, useState } from 'react';
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from 'react-icons/ti';

// Functional component to render star ratings based on the Review_Count
function RatingStars({ Review_Count, Star_Size }) {
  // Local state to manage the count of full, half, and empty stars
  const [starCount, SetStarCount] = useState({
    full: 0,
    half: 0,
    empty: 0,
  });

  // useEffect hook to calculate the star distribution whenever Review_Count changes
  useEffect(() => {
    // Calculate the number of full stars by flooring the review count
    const wholeStars = Math.floor(Review_Count) || 0;

    // Update starCount based on whether the review count is an integer or has a decimal part
    SetStarCount({
      full: wholeStars, // Number of full stars
      half: Number.isInteger(Review_Count) ? 0 : 1, // One half star if decimal part exists
      empty: Number.isInteger(Review_Count) ? 5 - wholeStars : 4 - wholeStars, // Remaining stars are empty
    });
  }, [Review_Count]); // Dependency array ensures this runs whenever Review_Count updates

  // Render the stars: full, half, and empty in a flex container with spacing and color
  return (
    <div className="flex gap-1 text-[var(--color-yellow-100)]">
      {[...new Array(starCount.full)].map((_, i) => {
        return <TiStarFullOutline key={i} size={Star_Size || 20} />; // Render full stars
      })}
      {[...new Array(starCount.half)].map((_, i) => {
        return <TiStarHalfOutline key={i} size={Star_Size || 20} />; // Render half star if any
      })}
      {[...new Array(starCount.empty)].map((_, i) => {
        return <TiStarOutline key={i} size={Star_Size || 20} />; // Render empty stars
      })}
    </div>
  );
}

// Exporting the component as default
export default RatingStars;
