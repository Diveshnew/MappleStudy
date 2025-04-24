import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Banner from '../assets/Images/banner.mp4';
import CTAButton from '../components/core/HomePage/Button';
import HighlightText from '../components/core/HomePage/HighlightText';
import CodeBlocks from '../components/core/HomePage/CodeBlocks';

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

        {/* CTA Buttons */}
        <div className="flex flex-row gap-7 mt-8">
          <CTAButton active={true} linkto={'/signup'}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={'/login'}>
            Book a Demo
          </CTAButton>
        </div>

        {/* Video */}
        <div className="mx-3 my-7 overflow-hidden rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-richblack-700">
          <video className="w-full h-auto rounded-xl" muted loop autoPlay>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* Code Section 1 */}
        <div>
          <CodeBlocks
            position={'lg:flex-row'}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Unlock your
                <HighlightText text={'coding power '} />
                with expert-led courses
              </div>
            }
            subheading={
              'Learn from industry experts with years of coding experience, passionate about guiding you every step of the way'
            }
            ctabtn1={{
              btnText: 'Try it Yourself',
              link: '/signup',
              active: true,
            }}
            ctabtn2={{
              btnText: 'Learn More',
              link: '/signup',
              active: false,
            }}
            codeColor={'text-[var(--color-yellow-25)]'}
            codeblock={`!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>

        {/* Code Section 2 */}
        <div>
          <CodeBlocks
            position={'lg:flex-row-reverse'}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Jump into
                <HighlightText text={'coding instantly'} />
              </div>
            }
            subheading={
              'Try it out for yourself. With our interactive learning setup, you’ll be writing real code from the very first lesson.'
            }
            ctabtn1={{
              btnText: 'Continue Lesson',
              link: '/signup',
              active: true,
            }}
            ctabtn2={{
              btnText: 'Learn More',
              link: '/signup',
              active: false,
            }}
            codeColor={'text-white'}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>
      </div>
      {/* Section 2 */}

      {/* Section 3 */}

      {/* Footer */}
    </div>
  );
};

export default Home;
