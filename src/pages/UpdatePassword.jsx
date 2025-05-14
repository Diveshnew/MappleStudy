import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { BiArrowBack } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { resetPassword } from '../services/operations/authAPI';

// UpdatePassword component enables users to set a new password after a reset request
function UpdatePassword() {
  // React Router hook for navigation after successful password reset
  const navigate = useNavigate();
  // Redux dispatch to trigger actions
  const dispatch = useDispatch();
  // Hook to access current location, used to extract reset token from URL
  const location = useLocation();
  // Get loading state from auth reducer for conditional UI
  const { loading } = useSelector((state) => state.auth);

  // Local form state for password and confirmation inputs
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  // State toggles to show or hide password text
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Destructure formData for easy access
  const { password, confirmPassword } = formData;

  // Handle input changes for both password fields
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission to reset password
  const handleOnSubmit = (e) => {
    e.preventDefault(); // Prevent default form behavior
    // Extract token from URL path (last segment after /)
    const token = location.pathname.split('/').at(-1);
    // Dispatch resetPassword action with credentials and navigation callback
    dispatch(resetPassword(password, confirmPassword, token, navigate));
  };

  return (
    // Full-screen centered grid container
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        // Show spinner when loading state is true
        <div className="w-10 h-10 border-4 border-[var(--color-yellow-50)] border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          {/* Title prompting user to choose a new password */}
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-[var(--color-richblack-5)]">
            Choose new password
          </h1>

          {/* Instructional text guiding the user */}
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-[var(--color-richblack-100)]">
            Almost done. Enter your new password and you're all set.
          </p>

          {/* Password reset form */}
          <form onSubmit={handleOnSubmit}>
            {/* New password field with toggle visibility */}
            <label className="relative">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[var(--color-richblack-5)]">
                New Password{' '}
                <sup className="text-[var(--color-pink-200)]">*</sup>
              </p>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter Password"
                className="rounded-lg bg-[var(--color-richblack-700)] p-3 text-[16px] leading-[24px] text-[var(--color-richblack-5)] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[var(--color-richblack-400)] focus:outline-none w-full !pr-10"
              />
              {/* Eye icon toggles password visibility */}
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>

            {/* Confirm password field with toggle visibility */}
            <label className="relative mt-3 block">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[var(--color-richblack-5)]">
                Confirm New Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm Password"
                className="rounded-lg bg-[var(--color-richblack-700)] p-3 text-[16px] leading-[24px] text-[var(--color-richblack-5)] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[var(--color-richblack-400)] focus:outline-none w-full !pr-10"
              />
              {/* Eye icon toggles confirm password visibility */}
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>

            {/* Submit button to trigger password reset */}
            <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-[var(--color-richblack-900)]"
            >
              Reset Password
            </button>
          </form>

          {/* Link to navigate back to login if user changes their mind */}
          <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-[var(--color-richblack-5)]">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Export UpdatePassword component for use in routing
export default UpdatePassword;
