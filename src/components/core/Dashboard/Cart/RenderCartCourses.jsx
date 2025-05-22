import { FaStar } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import ReactStars from 'react-rating-stars-component';
import { useDispatch, useSelector } from 'react-redux';

import { removeFromCart } from '../../../../slices/cartSlice';

export default function RenderCartCourses() {
  // Access cart data from Redux store
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-1 flex-col">
      {/* Loop through each course in the cart */}
      {cart.map((course, index) => (
        <div
          key={course._id}
          className={`flex w-full flex-wrap items-start justify-between gap-6 ${
            // Apply bottom border to all but the last item
            index !== cart.length - 1 &&
            'border-b border-b-[var(--color-richblack-400)] pb-6'
          } ${index !== 0 && 'mt-6'} `}
        >
          {/* Course thumbnail and details */}
          <div className="flex flex-1 flex-col gap-4 xl:flex-row">
            <img
              src={course?.thumbnail}
              alt={course?.courseName}
              className="h-[148px] w-[220px] rounded-lg object-cover"
            />
            <div className="flex flex-col space-y-1">
              {/* Course name */}
              <p className="text-lg font-medium text-[var(--color-richblack-5)]">
                {course?.courseName}
              </p>
              {/* Course category */}
              <p className="text-sm text-[var(--color-richblack-300)]">
                {course?.category?.name}
              </p>

              {/* Ratings section */}
              <div className="flex items-center gap-2">
                {/* Static rating value display */}
                <span className="text-[var(--color-yellow-5)]">4.5</span>

                {/* Star rating component (based on number of reviews) */}
                <ReactStars
                  count={5}
                  value={course?.ratingAndReviews?.length}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />

                {/* Display total number of ratings */}
                <span className="text-[var(--color-richblack-400)]">
                  {course?.ratingAndReviews?.length} Ratings
                </span>
              </div>
            </div>
          </div>

          {/* Right-side: Remove button and course price */}
          <div className="flex flex-col items-end space-y-2">
            {/* Button to remove course from cart */}
            <button
              onClick={() => dispatch(removeFromCart(course._id))}
              className="flex items-center gap-x-1 rounded-md border border-[var(--color-richblack-600)] bg-[var(--color-richblack-700)] py-3 px-[12px] text-[var(--color-pink-200)]"
            >
              <RiDeleteBin6Line />
              <span>Remove</span>
            </button>

            {/* Course price */}
            <p className="mb-6 text-3xl font-medium text-[var(--color-yellow-100)]">
              ₹ {course?.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
