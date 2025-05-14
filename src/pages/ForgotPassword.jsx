import { useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getPasswordResetToken } from '../services/operations/authAPI';

function ForgotPassword() {
  // Local state to hold the email input value
  const [email, setEmail] = useState('');
  // Track whether the reset email has been sent
  const [emailSent, setEmailSent] = useState(false);

  // Redux dispatch function to dispatch actions
  const dispatch = useDispatch();
  // Extract loading state from the auth slice of the Redux store
  const { loading } = useSelector((state) => state.auth);

  // Handler for form submission
  const handleOnSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Dispatch the getPasswordResetToken action, passing the email and a callback
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        // Show a spinner while the request is loading
        <div className="w-12 h-12 border-4 border-t-yellow-50 border-[var(--color-richblack-400)] rounded-full animate-spin"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          {/* Title changes based on whether email has been sent */}
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-[var(--color-richblack-5)]">
            {!emailSent ? 'Reset your password' : 'Check email'}
          </h1>

          {/* Description text changes after email is sent */}
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-[var(--color-richblack-100)]">
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password. If you don't have access to your email we can try account recovery"
              : `We have sent the reset email to ${email}`}
          </p>

          {/* Form for entering email and submitting request */}
          <form onSubmit={handleOnSubmit}>
            {!emailSent && (
              <label className="w-full mb-4 flex flex-col">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[var(--color-richblack-5)] font-medium">
                  Email Address{' '}
                  <sup className="text-[var(--color-pink-200)]">*</sup>
                </p>
                {/* Email input field bound to email state */}
                <input
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full rounded-lg bg-[var(--color-richblack-700)] p-3 text-[16px] leading-[24px] text-[var(--color-richblack-5)] shadow-[0_1px_0_0] shadow-white/50 placeholder:text-[var(--color-richblack-400)] focus:outline-none"
                />
              </label>
            )}

            {/* Submit or Resend Email button depending on emailSent state */}
            <button
              type="submit"
              className="mt-2 w-full rounded-[8px] bg-[var(--color-yellow-50)] py-[12px] px-[12px] font-medium text-[var(--color-richblack-900)]"
            >
              {!emailSent ? 'Submit' : 'Resend Email'}
            </button>
          </form>

          {/* Link to navigate back to login page */}
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

export default ForgotPassword;
