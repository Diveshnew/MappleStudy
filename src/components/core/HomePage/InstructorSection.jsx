import React from 'react';
import CTAButton from '../../../components/core/HomePage/Button';
import { FaArrowRight } from 'react-icons/fa';
import Instructor from '../../../assets/Images/Instructor.webp';
import HighlightText from './HighlightText';

const InstructorSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-16">
      {/* Image */}
      <div className="flex-1">
        <img
          src={Instructor}
          alt="Instructor teaching"
          className="w-full h-auto object-cover shadow-white shadow-[-10px_-10px_0_0]"
        />
      </div>

      {/* Text block */}
      <div className="flex-1 flex flex-col gap-6 justify-center px-4 lg:px-0">
        <h1 className="text-4xl font-semibold">
          Become an <HighlightText text="Instructor" />
        </h1>
        <p className="text-base font-medium text-justify text-richblack-300 lg:max-w-md">
          Instructors from around the world teach millions of students on
          MappleStudy. We provide the tools and skills to teach what you love.
        </p>
        <div className="self-start">
          <CTAButton active={true} linkto={'/signup'}>
            <div className="flex items-center gap-3">
              Start Teaching Today <FaArrowRight />
            </div>
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
