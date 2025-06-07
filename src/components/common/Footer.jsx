// Import necessary libraries, components, and assets
import React from 'react';
import { FaGoogle, FaLinkedin, FaXTwitter } from 'react-icons/fa6'; // Social media icons
import { Link } from 'react-router-dom'; // For client-side routing
import '../../App.css'; // Import custom styles
import Logo from '../../assets/Logo/Logo-Full-Light.png'; // Company logo
import { FooterLink2 } from '../../data/footer-links'; // Custom footer links data

// Static arrays for different footer sections
const BottomFooter = ['Privacy Policy', 'Cookie Policy', 'Terms'];
const Resources = [
  'Articles',
  'Blog',
  'Chart Sheet',
  'Code challenges',
  'Docs',
  'Projects',
  'Videos',
  'Workspaces',
];
const Plans = ['Paid memberships', 'For students', 'Business solutions'];
const Community = [
  { name: 'Forums', link: 'forums' },
  { name: 'Chapters', link: 'chapters' },
  { name: 'Events', link: 'events' },
  {
    name: 'Contribute',
    link: 'https://github.com/Diveshnew/MappleStudy',
    external: true, // Indicates external link
  },
];

const Footer = () => {
  return (
    <div className="bg-[var(--color-richblack-800)]">
      {/* Main container for footer */}
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between w-full max-w-[var(--maxwidth-maxContent)] px-4 mx-auto py-14 text-[var(--color-richblack-400)] leading-6">
        {/* Top section with company info, resources, plans, community, and footer links */}
        <div className="w-full flex flex-col lg:flex-row pb-5 border-b border-[var(--color-richblack-700)]">
          {/* Left half - Company information and social media */}
          <div className="w-full lg:w-[50%] flex flex-wrap lg:flex-row justify-between lg:border-r lg:border-[var(--color-richblack-700)] pl-3 lg:pr-5 gap-3">
            {/* Company Info */}
            <div className="w-full lg:w-[30%] mb-7 lg:pl-0">
              <img src={Logo} alt="Company Logo" className="object-contain" />
              <h1 className="text-[var(--color-richblack-50)] font-semibold text-[16px] mt-4">
                Company
              </h1>

              {/* Company links: About, Careers, Affiliates */}
              <div className="flex flex-col gap-2 mt-2">
                {['About', 'Careers', 'Affiliates'].map((ele, i) => (
                  <div
                    key={i}
                    className="text-[14px] cursor-pointer hover:text-[var(--color-richblack-50)] transition-all duration-200"
                  >
                    <Link to={`/${ele.toLowerCase()}`}>{ele}</Link>
                  </div>
                ))}
              </div>

              {/* Social media icons */}
              <div className="flex gap-3 mt-4 text-lg">
                {[
                  {
                    icon: <FaGoogle />,
                    link: 'https://portfolio-site-divesh.netlify.app/',
                  },
                  {
                    icon: <FaXTwitter />,
                    link: 'https://twitter.com/DiveshDhek',
                  },
                  {
                    icon: <FaLinkedin />,
                    link: 'https://www.linkedin.com/in/diveshdhek1/',
                  },
                ].map(({ icon, link }, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon transition duration-300 hover:opacity-75 hover:bg-white"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Resources Section */}
            <div className="w-full lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-[var(--color-richblack-50)] font-semibold text-[16px]">
                Resources
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                {Resources.map((ele, index) => (
                  <div
                    key={index}
                    className="text-[14px] cursor-pointer hover:text-[var(--color-richblack-50)] transition-all duration-200"
                  >
                    <Link to={`/${ele.split(' ').join('-').toLowerCase()}`}>
                      {ele}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Support link */}
              <h1 className="text-[var(--color-richblack-50)] font-semibold text-[16px] mt-7">
                Support
              </h1>
              <div className="text-[14px] cursor-pointer hover:text-[var(--color-richblack-50)] transition-all duration-200 mt-2">
                <Link to="/help-center">Help Center</Link>
              </div>
            </div>

            {/* Plans and Community Section */}
            <div className="w-full lg:w-[30%] mb-7 lg:pl-0">
              <h1 className="text-[var(--color-richblack-50)] font-semibold text-[16px]">
                Plans
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                {Plans.map((ele, index) => (
                  <div
                    key={index}
                    className="text-[14px] cursor-pointer hover:text-[var(--color-richblack-50)] transition-all duration-200"
                  >
                    <Link to={`/${ele.split(' ').join('-').toLowerCase()}`}>
                      {ele}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Community Links */}
              <h1 className="text-[var(--color-richblack-50)] font-semibold text-[16px] mt-7">
                Community
              </h1>
              <div className="flex flex-col gap-2 mt-2">
                {Community.map((ele, index) => (
                  <div
                    key={index}
                    className="text-[14px] cursor-pointer hover:text-[var(--color-richblack-50)] transition-all duration-200"
                  >
                    {ele.external ? (
                      <a
                        href={ele.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {ele.name}
                      </a>
                    ) : (
                      <Link to={ele.link}>{ele.name}</Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right half - Dynamically rendering additional footer links from FooterLink2 */}
          <div className="w-full lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
            {FooterLink2.map((ele, i) => (
              <div key={i} className="w-full lg:w-[30%] mb-7 lg:pl-0">
                <h1 className="text-[var(--color-richblack-50)] font-semibold text-[16px]">
                  {ele.title}
                </h1>
                <div className="flex flex-col gap-2 mt-2">
                  {ele.links.map((link, index) => (
                    <div
                      key={index}
                      className="text-[14px] cursor-pointer hover:text-[var(--color-richblack-50)] transition-all duration-200"
                    >
                      <Link to={link.link}>{link.title}</Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom section - Privacy policy, Cookie policy, Terms, and Copyright */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-[var(--maxwidth-maxContent)] px-4 mx-auto pb-14 text-sm text-[var(--color-richblack-400)]">
        <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
          {/* Policies links */}
          <div className="flex flex-row flex-wrap">
            {BottomFooter.map((ele, i) => (
              <div
                key={i}
                className={`${
                  BottomFooter.length - 1 === i
                    ? ''
                    : 'border-r border-[var(--color-richblack-700)] cursor-pointer hover:text-[var(--color-richblack-50)] transition-all duration-200'
                } px-3`}
              >
                <Link to={`/${ele.split(' ').join('-').toLocaleLowerCase()}`}>
                  {ele}
                </Link>
              </div>
            ))}
          </div>

          {/* Copyright information */}
          <div className="text-center mt-4 lg:mt-0">
            Made with HardWork © {new Date().getFullYear()} MappleStudy
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
