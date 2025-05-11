import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { SiGmail } from 'react-icons/si';
import { FaLock } from 'react-icons/fa';
import { login } from '../../../services/operations/authAPI';

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      {/* Email input field with Gmail icon */}
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[var(--color-richblack-5)]">
          Email Address <sup className="text-[var(--color-pink-200)]">*</sup>
        </p>
        <div className="flex items-center gap-2 rounded-[0.5rem] bg-[var(--color-richblack-800)] px-3 py-[10px] shadow-inner">
          <SiGmail className="text-[20px] text-gray-400" />
          <input
            required
            type="text"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            className="w-full bg-transparent text-[var(--color-richblack-5)] outline-none"
          />
        </div>
      </label>

      {/* Password input field with Lock icon and Eye toggle */}
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[var(--color-richblack-5)]">
          Password <sup className="text-[var(--color-pink-200)]">*</sup>
        </p>
        <div className="relative flex items-center gap-2 rounded-[0.5rem] bg-[var(--color-richblack-800)] px-3 py-[10px] shadow-inner">
          <FaLock className="text-[18px] text-gray-400" />
          <input
            required
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={handleOnChange}
            placeholder="Enter Password"
            className="w-full bg-transparent text-[var(--color-richblack-5)] outline-none pr-8"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible fontSize={22} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={22} fill="#AFB2BF" />
            )}
          </span>
        </div>
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-[var(--color-blue-100)]">
            Forgot Password
          </p>
        </Link>
      </label>

      {/* Submit button */}
      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-[var(--color-yellow-50)] py-[8px] px-[12px] font-medium text-[var(--color-richblack-900)]"
      >
        Sign In
      </button>
    </form>
  );
}

export default LoginForm;
