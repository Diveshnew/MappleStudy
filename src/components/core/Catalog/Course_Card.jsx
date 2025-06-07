// Importing necessary React hooks and components
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Utility function to calculate average rating from reviews
import GetAvgRating from '../../../utils/avgRating';
// Component to display star icons based on rating
import RatingStars from '../../common/RatingStars';

// Functional component to render an individual course card
const Course_Card = ({ course, Height }) => {
  // State to store the calculated average review rating
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  // useEffect to calculate average rating whenever the course prop changes
  useEffect(() => {
    // Calculate average rating using the GetAvgRating utility
    const count = GetAvgRating(course.ratingAndReviews);
    // Update local state with the calculated average
    setAvgReviewCount(count);
  }, [course]);

  // JSX to render the course card UI
  return (
    <>
      {/* Navigate to the course details page on click */}
      <Link to={`/courses/${course._id}`}>
        <div className="">
          {/* Course thumbnail image */}
          <div className="rounded-lg">
            <img
              src={course?.thumbnail} // Source URL for the course thumbnail
              alt="course thumbnail" // Alt text for accessibility
              className={`${Height} w-full rounded-xl object-cover `} // Image styling
            />
          </div>

          {/* Course content section including title, instructor, rating, and price */}
          <div className="flex flex-col gap-2 px-1 py-3">
            {/* Display course title */}
            <p className="text-xl text-[var(--color-richblack-5)]">
              {course?.courseName}
            </p>

            {/* Display instructor name or fallback text if not available */}
            <p className="text-sm text-[var(--color-richblack-50)]">
              {course?.instructor
                ? `${course.instructor.firstName} ${course.instructor.lastName}`
                : 'Instructor TBD'}
            </p>

            {/* Rating section with average value, star icons, and number of ratings */}
            <div className="flex items-center gap-2">
              {/* Numeric average rating */}
              <span className="text-[var(--color-yellow-5)]">
                {avgReviewCount || 0}
              </span>
              {/* Star icons based on average rating */}
              <RatingStars Review_Count={avgReviewCount} />
              {/* Display total number of reviews */}
              <span className="text-[var(--color-richblack-400)]">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>

            {/* Display course price */}
            <p className="text-xl text-[var(--color-richblack-5)]">
              Rs. {course?.price}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

// Exporting the Course_Card component
export default Course_Card;
