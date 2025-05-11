import React from 'react';
import { useSelector } from 'react-redux';

import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

function Template({ title, description1, description2, image, formType }) {
  // Get loading status from Redux to show spinner
  const { loading } = useSelector((state) => state.auth);

  return (
    // Center content vertically and horizontally with padding-top
    <div className="grid place-items-center pt-10">
      {loading ? (
        // Show a spinner while loading
        <div className="spinner"></div>
      ) : (
        // Main container: responsive flex layout
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse items-center justify-center gap-y-12 py-12 md:flex-row md:gap-x-16">
          {/* Left column: heading, descriptions, and form */}
          <div className="w-full max-w-[450px]">
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-[var(--color-richblack-5)]">
              {title}
            </h1>
            <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
              <span className="text-[var(--color-richblack-100)]">
                {description1}
              </span>{' '}
              <span className="font-edu-sa font-bold italic text-[var(--color-blue-100)]">
                {description2}
              </span>
            </p>
            {/* Render signup or login form based on formType prop */}
            {formType === 'signup' ? <SignupForm /> : <LoginForm />}
          </div>

          {/* Right column: creative styled image without background frame */}
          <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
            <div className="overflow-hidden rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-transform duration-500 ease-in-out">
              <img
                src={image}
                alt="Students"
                className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500 ease-in-out"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Template;
