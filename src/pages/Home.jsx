import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText';

const Home = () => {
  return (
    <div>
      {/* Section 1 */}
      <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between gap-8">
        {/* Become an Instructor Button */}
        <Link to={'/signup'}>
          <div className="group mt-16 p-1 mx-auto gap-2 rounded-full bg-[var(--color-richblack-800)] font-bold text-[var(--color-richblack-200)] transition-all duration-200 hover:scale-95 w-fit drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-[var(--color-richblack-900)]">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* Heading */}
        <div className="text-center text-4xl font-semibold mt-7">
          Fuel Big Dreams With
          <HighlightText text={'Coding Skills'} />
        </div>

        <div className="-mt-3 w-[90%] text-center text-lg font-bold text-[var(--color-richblack-300)] ">
          Our online courses allow you to learn at your own pace, from anywhere,
          and provide hands-on projects, quizzes, and personalized feedback to
          guide you every step of the way.
        </div>
      </div>
      {/* Section 2 */}

      {/* Section 3 */}

      {/* Footer */}
    </div>
  );
};

export default Home;
