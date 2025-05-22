import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import IconBtn from '../../../common/IconBtn';
import { buyCourse } from '../../../../services/operations/studentFeaturesAPI';

export default function RenderTotalAmount() {
  // Get total amount and cart data from Redux store
  const { total, cart } = useSelector((state) => state.cart);
  // Get user authentication token from Redux
  const { token } = useSelector((state) => state.auth);
  // Get user profile data from Redux
  const { user } = useSelector((state) => state.profile);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handler function to initiate the course purchase
  const handleBuyCourse = () => {
    // Extract course IDs from the cart
    const courses = cart.map((course) => course._id);
    // Call the buyCourse API with necessary data
    buyCourse(token, courses, user, navigate, dispatch);
  };

  return (
    // Container box for displaying total and buy button
    <div className="min-w-[280px] rounded-md border-[1px] border-[var(--color-richblack-700)] bg-[var(--color-richblack-800)] p-6">
      {/* Label for total amount */}
      <p className="mb-1 text-sm font-medium text-[var(--color-richblack-300)]">
        Total:
      </p>
      {/* Display total price */}
      <p className="mb-6 text-3xl font-medium text-[var(--color-yellow-100)]">
        ₹ {total}
      </p>
      {/* Buy Now button with click handler */}
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  );
}
