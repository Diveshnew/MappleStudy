import { useSelector } from 'react-redux';

import RenderCartCourses from './RenderCartCourses';
import RenderTotalAmount from './RenderTotalAmount';

export default function Cart() {
  // Extract total price and total items in cart from Redux store
  const { total, totalItems } = useSelector((state) => state.cart);

  return (
    <>
      {/* Page Heading */}
      <h1 className="mb-14 text-3xl font-medium text-[var(--color-richblack-5)]">
        Cart
      </h1>

      {/* Display number of courses in the cart */}
      <p className="border-b border-b-[var(--color-richblack-400)] pb-2 font-semibold text-[var(--color-richblack-400)]">
        {totalItems} Courses in Cart
      </p>

      {/* If cart has items, show course list and total amount */}
      {total > 0 ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
          {/* List of courses in cart */}
          <RenderCartCourses />

          {/* Component to display total price and checkout options */}
          <RenderTotalAmount />
        </div>
      ) : (
        // Show message if cart is empty
        <p className="mt-14 text-center text-3xl text-[var(--color-richblack-100)]">
          Your cart is empty
        </p>
      )}
    </>
  );
}
