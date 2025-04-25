import React from 'react';
// Importing assets for the timeline image and logos
import TimeLineImage from '../../../assets/Images/TimelineImage.jpg';
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg';
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg';
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg';
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg';

// Static data array representing each timeline entry
const TimeLine = [
  {
    Logo: Logo1,
    Heading: 'Leadership',
    Description: 'Fully committed to the success company',
  },
  {
    Logo: Logo2,
    Heading: 'Responsibility',
    Description: 'Students will always be our top priority',
  },
  {
    Logo: Logo3,
    Heading: 'Flexibility',
    Description: 'The ability to switch is an important skills',
  },
  {
    Logo: Logo4,
    Heading: 'Solve the problem',
    Description: 'Code your way to a solution',
  },
];

// TimelineSection component: displays the timeline entries alongside an image overlay
const TimelineSection = () => {
  return (
    <div>
      {/* Container: flex layout switches from column on mobile to row on large screens */}
      <div className="flex flex-col lg:flex-row gap-20 mb-20 items-center">
        {/* Left side: renders each timeline entry */}
        <div className="lg:w-[45%] flex flex-col gap-14 lg:gap-3">
          {TimeLine.map((element, i) => {
            return (
              <div className="flex flex-col lg:gap-3" key={i}>
                {/* Entry: logo + text */}
                <div className="flex gap-6" key={i}>
                  {/* Logo container: circular white background with shadow */}
                  <div className="w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]">
                    <img src={element.Logo} alt={`${element.Heading} icon`} />
                  </div>
                  {/* Text container: heading and description */}
                  <div>
                    <h2 className="font-semibold text-[18px]">
                      {element.Heading}
                    </h2>
                    <p className="text-base">{element.Description}</p>
                  </div>
                </div>

                {/* Connector: dotted vertical line between entries (hidden after last) */}
                <div
                  className={`hidden ${
                    TimeLine.length - 1 === i ? 'hidden' : 'lg:block'
                  }  h-14 border-dotted border-r border-[var(--color-richblack-100)] bg-[var(--color-richblack-400/0)] w-[26px]`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Right side: image with an overlay showing stats */}
        <div className="relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]">
          {/* Overlay: positioned absolute, centered at bottom on large screens */}
          <div className="absolute lg:left-[50%] lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[50%] bg-[var(--color-caribbeangreen-700)] flex lg:flex-row flex-col text-white uppercase py-5 gap-4 lg:gap-0 lg:py-10">
            {/* Section 1: Years of experience */}
            <div className="flex gap-5 items-center lg:border-r border-[var(--color-caribbeangreen-300)] px-7 lg:px-14">
              <h1 className="text-3xl font-bold w-[75px]">10</h1>
              <h1 className="text-[var(--color-caribbeangreen-300)] text-sm w-[75px]">
                Years of experience
              </h1>
            </div>

            {/* Section 2: Types of courses */}
            <div className="flex gap-5 items-center lg:px-14 px-7">
              <h1 className="text-3xl font-bold w-[75px]">250</h1>
              <h1 className="text-[var(--color-caribbeangreen-300)] text-sm w-[75px]">
                Types of courses
              </h1>
            </div>
          </div>

          {/* Main timeline image */}
          <img
            src={TimeLineImage}
            alt="Timeline visual"
            className="shadow-white shadow-[20px_20px_0px_0px] object-cover h-[400px] lg:h-fit"
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
