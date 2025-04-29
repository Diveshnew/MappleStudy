import React from 'react';
import { HiUsers } from 'react-icons/hi';
import { ImTree } from 'react-icons/im';

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  const isActive = currentCard === cardData?.heading;

  return (
    <div
      onClick={() => setCurrentCard(cardData?.heading)}
      className={`
        flex-shrink-0 w-full sm:w-[45%] lg:w-[30%] h-[300px] box-border cursor-pointer
        ${
          isActive
            ? 'bg-white shadow-[12px_12px_0_0] shadow-yellow-50'
            : 'bg-[var(--color-richblack-800)]'
        }
        text-[var(--color-richblack-25)] hover:shadow-xl hover:scale-[1.07]
        hover:border-[var(--color-brown-50)] transition-all ease-in-out
      `}
    >
      {/* Card content section */}
      <div className="h-[80%] p-6 flex flex-col gap-3 border-b-[2px] border-dashed border-[var(--color-richblack-400)]">
        {/* Heading */}
        <h3
          className={`
            text-[20px] font-semibold hover:font-extrabold
            ${isActive ? 'text-[var(--color-richblack-800)]' : ''}
          `}
        >
          {cardData?.heading}
        </h3>

        {/* Description */}
        <p
          className={`
            text-[var(--color-richblack-400)] transition-colors ease-linear
            ${isActive ? 'hover:text-black' : 'hover:text-white'}
          `}
        >
          {cardData?.description}
        </p>
      </div>

      {/* Footer with icons */}
      <div
        className={`
          px-6 py-3 font-medium flex justify-between transition-colors ease-linear
          ${
            isActive
              ? 'text-[var(--color-blue-300)] hover:text-[var(--color-blue-500)]'
              : 'text-richblack-300 hover:text-white'
          }
        `}
      >
        {/* User Level */}
        <div className="flex items-center gap-2 text-[16px]">
          <HiUsers />
          <span>{cardData?.level}</span>
        </div>

        {/* Lesson Number */}
        <div className="flex items-center gap-2 text-[16px]">
          <ImTree />
          <span>{cardData?.lessonNumber} Lesson</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
