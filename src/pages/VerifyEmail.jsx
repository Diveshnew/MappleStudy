import { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import { Link, useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { RxCountdownTimer } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, signUp } from '../services/operations/authAPI';

// VerifyEmail component manages OTP verification and email resend flow
function VerifyEmail() {
  // OTP input value from user
  const [otp, setOtp] = useState('');
  // Cooldown timer (in seconds) before allowing OTP resend
  const [cooldown, setCooldown] = useState(30);

  // Access signup data and loading state from Redux store
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect to signup if signupData is missing
  useEffect(() => {
    if (!signupData) {
      navigate('/signup');
    }
  }, [signupData, navigate]);

  // Countdown effect for resend button
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Handle OTP verification and user signup
  const handleVerifyAndSignup = (e) => {
    e.preventDefault(); // Prevent default form submission
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    // Dispatch signUp action with user details and OTP
    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };

  // Handle resending OTP and reset cooldown
  const handleResend = () => {
    dispatch(sendOtp(signupData.email, navigate));
    setCooldown(30);
  };

  return (
    // Full-screen centered container
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
      {loading ? (
        // Loading spinner while awaiting response
        <div className="flex justify-center items-center h-32">
          <div className="w-10 h-10 border-4 border-[var(--color-yellow-50)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          {/* Header text */}
          <h1 className="text-[var(--color-richblack-5)] font-semibold text-[1.875rem] leading-[2.375rem]">
            Verify Email
          </h1>
          {/* Instructional text */}
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-[var(--color-richblack-100)]">
            A verification code has been sent to you. Enter the code below
          </p>

          {/* OTP input form */}
          <form onSubmit={handleVerifyAndSignup}>
            {/* OtpInput component with 6 inputs */}
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)',
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-[var(--color-richblack-800)] rounded-[0.5rem] text-[var(--color-richblack-5)] aspect-square text-center focus:outline-2 focus:outline-[var(--color-yellow-50)]"
                />
              )}
              containerStyle={{ justifyContent: 'space-between', gap: '0 6px' }}
            />
            {/* Submit button for OTP verification */}
            <button
              type="submit"
              className="w-full bg-[var(--color-yellow-50)] py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-[var(--color-richblack-900)]"
            >
              Verify Email
            </button>
          </form>

          {/* Footer with navigation and resend controls */}
          <div className="mt-6 flex items-center justify-between">
            {/* Link back to signup page */}
            <Link to="/signup">
              <p className="text-[var(--color-richblack-5)] flex items-center gap-x-2">
                <BiArrowBack /> Back To Signup
              </p>
            </Link>
            {/* Resend OTP button with countdown */}
            <button
              className="flex items-center text-[var(--color-blue-100)] gap-x-2 disabled:opacity-50"
              onClick={handleResend}
              disabled={cooldown > 0}
            >
              <RxCountdownTimer />
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend it'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export VerifyEmail component for routing
export default VerifyEmail;
