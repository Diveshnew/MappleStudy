import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { sendOtp } from '../../../services/operations/authAPI';
import { setSignupData } from '../../../slices/authSlice';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import Tab from '../../common/Tab';

import { FaUser, FaLock } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

function SignupForm() {
  // Hooks for routing and redux dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Determine account type: student or instructor
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  // Form fields state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Toggle visibility of password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { firstName, lastName, email, password, confirmPassword } = formData;

  // Update state when inputs change
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate password strength
  const isPasswordValid = (pw) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /\d/.test(pw);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_]/.test(pw);
    return (
      pw.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial
    );
  };

  // Form submission handler
  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!isPasswordValid(password)) {
      toast.error(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
      );
      return;
    }

    // Prepare data for OTP step
    const signupData = { ...formData, accountType };
    dispatch(setSignupData(signupData));
    dispatch(sendOtp(formData.email, navigate));

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setAccountType(ACCOUNT_TYPE.STUDENT);
  };

  // Data for account type tabs
  const tabData = [
    { id: 1, tabName: 'Student', type: ACCOUNT_TYPE.STUDENT },
    { id: 2, tabName: 'Instructor', type: ACCOUNT_TYPE.INSTRUCTOR },
  ];

  return (
    <div>
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        {/* Name fields row */}
        <div className="flex gap-x-4">
          {/* First Name Input */}
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[var(--color-richblack-5)]">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <div className="relative">
              <FaUser
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-richblack-300)]"
                fontSize={20}
              />
              <input
                required
                name="firstName"
                value={firstName}
                onChange={handleOnChange}
                placeholder="Enter first name"
                className="w-full rounded-lg bg-[var(--color-richblack-800)] p-3 pl-10 text-[var(--color-richblack-5)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]"
              />
            </div>
          </label>

          {/* Last Name Input */}
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[var(--color-richblack-5)]">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <div className="relative">
              <FaUser
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-richblack-300)]"
                fontSize={20}
              />
              <input
                required
                name="lastName"
                value={lastName}
                onChange={handleOnChange}
                placeholder="Enter last name"
                className="w-full rounded-lg bg-[var(--color-richblack-800)] p-3 pl-10 text-[var(--color-richblack-5)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]"
              />
            </div>
          </label>
        </div>

        {/* Email Input */}
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[var(--color-richblack-5)]">
            Email Address <sup className="text-[var(--color-pink-200)]">*</sup>
          </p>
          <div className="relative">
            <SiGmail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-richblack-300)]"
              fontSize={20}
            />
            <input
              required
              name="email"
              value={email}
              onChange={handleOnChange}
              placeholder="Enter email address"
              className="w-full rounded-lg bg-[var(--color-richblack-800)] p-3 pl-10 text-[var(--color-richblack-5)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]"
            />
          </div>
        </label>

        {/* Password Fields */}
        <div className="flex gap-x-4">
          {/* Password Input */}
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[var(--color-richblack-5)]">
              Create Password{' '}
              <sup className="text-[var(--color-pink-200)]">*</sup>
            </p>
            <div className="relative">
              <FaLock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-richblack-300)]"
                fontSize={20}
              />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter Password"
                className="w-full rounded-lg bg-[var(--color-richblack-800)] p-3 pl-10 pr-10 text-[var(--color-richblack-5)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible
                    fontSize={24}
                    fill="var(--color-richblack-100)"
                  />
                ) : (
                  <AiOutlineEye
                    fontSize={24}
                    fill="var(--color-richblack-100)"
                  />
                )}
              </span>
            </div>
          </label>

          {/* Confirm Password Input */}
          <label className="w-full">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[var(--color-richblack-5)]">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <div className="relative">
              <FaLock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-richblack-300)]"
                fontSize={20}
              />
              <input
                required
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm Password"
                className="w-full rounded-lg bg-[var(--color-richblack-800)] p-3 pl-10 pr-10 text-[var(--color-richblack-5)] shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)]"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible
                    fontSize={24}
                    fill="var(--color-richblack-100)"
                  />
                ) : (
                  <AiOutlineEye
                    fontSize={24}
                    fill="var(--color-richblack-100)"
                  />
                )}
              </span>
            </div>
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-lg bg-[var(--color-yellow-50)] py-2 px-3 font-medium text-[var(--color-richblack-900)] hover:scale-95 transition"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
