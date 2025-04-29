import React, { useState } from 'react';
import { HomePageExplore } from '../../../data/homepage-explore';
import CourseCard from './CourseCard';
import HighlightText from './HighlightText';

const tabsName = [
  'Free',
  'New to coding',
  'Most popular',
  'Skills paths',
  'Career paths',
];

const ExploreMore = () => {
  // Track the active tab
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  // Store courses for the active tab
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  // Track which course card is selected
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  // Switch tabs and reset courses/card
  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.find((section) => section.tag === value);
    const newCourses = result.courses;
    setCourses(newCourses);
    setCurrentCard(newCourses[0].heading);
  };

  return (
    <div>
      {/* Hero section */}
      <div className="text-4xl font-semibold text-center my-10">
        <div className="container block">
          Unlock the <HighlightText className="inline" text="Power of Code" />
        </div>
        <p className="text-center text-[var(--color-richblack-300)] text-sm font-semibold mt-1">
          Learn to Build Anything You Can Imagine
        </p>
      </div>

      {/* Tabs (hidden on small screens) */}
      <div className="hidden lg:flex gap-5 -mt-5 mx-auto w-max bg-[var(--color-richblack-800)] text-[var(--color-richblack-200)] p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]">
        {tabsName.map((label) => (
          <div
            key={label}
            onClick={() => setMyCards(label)}
            className={`
              text-[16px] flex items-center gap-2 px-7 py-[7px] rounded-full transition-all duration-200 cursor-pointer
              ${
                currentTab === label
                  ? 'bg-[var(--color-richblack-900)] text-[var(--color-richblack-5)] font-medium'
                  : 'text-[var(--color-richblack-200)] hover:bg-white hover:text-[var(--color-richblack-900)] hover:drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]'
              }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Spacer for layout */}
      <div className="hidden lg:block lg:h-[200px]" />

      {/* Course cards */}
      <div className="lg:absolute flex flex-wrap justify-center gap-10 w-full lg:bottom-0 lg:left-[50%] lg:-translate-x-1/2 lg:translate-y-1/2 text-black mb-7 lg:mb-0 px-3 lg:px-0">
        {courses.map((course) => (
          <CourseCard
            key={course.heading} // use unique key
            cardData={course}
            currentCard={currentCard}
            setCurrentCard={setCurrentCard}
          />
        ))}
      </div>
    </div>
  );
};

export default ExploreMore;
