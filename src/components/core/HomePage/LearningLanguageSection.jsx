import React from 'react';
import Compare_with_others from '../../../assets/Images/Compare_with_others.svg';
import Know_your_progress from '../../../assets/Images/Know_your_progress.png';
import Plan_your_lessons from '../../../assets/Images/Plan_your_lessons.svg';
import CTAButton from '../../../components/core/HomePage/Button';
import HighlightText from './HighlightText';

const LearningLanguageSection = () => {
  return (
    <div>
      <div className="text-4xl font-semibold text-center my-10">
        The ultimate toolkit for
        <HighlightText text={'learning any language'} />
        <div className="text-center text-[var(--color-richblack-700)] font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
          Learning 10+ coding languages is easy with hands-on exercises,
          progress tracking, and a schedule you control.
        </div>
        <div className="flex flex-row items-center justify-center mt-8">
          <img
            src={Know_your_progress}
            alt="Know Your Progress"
            className="object-contain -mr-32 "
          />
          <img
            src={Compare_with_others}
            alt="Compare with others"
            className="object-contain lg:-mb-10 lg:-mt-0 -mt-12"
          />
          <img
            src={Plan_your_lessons}
            alt="Plan your lessons"
            className="object-contain lg:-ml-36 lg:-mt-5 -mt-16"
          />
        </div>
      </div>

      <div className="w-fit mx-auto lg:mb-20 mb-8 -mt-5">
        <CTAButton active={true} linkto={'/signup'}>
          <div className="">Learn More</div>
        </CTAButton>
      </div>
    </div>
  );
};

export default LearningLanguageSection;
