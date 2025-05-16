import CTAButton from '../../../components/core/HomePage/Button';
import HighlightText from '../../../components/core/HomePage/HighlightText';

// Array of card data for rendering the learning grid
const LearningGridArray = [
  {
    order: -1, // special highlight card
    heading: 'World-Class Learning for',
    highlightText: 'Anyone, Anywhere',
    description:
      'MappleStudy partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.',
    BtnText: 'Learn More',
    BtnLink: '/',
  },
  {
    order: 1,
    heading: 'Curriculum Based on Industry Needs',
    description:
      'Save time and money! The MappleStudy curriculum is made to be easier to understand and in line with industry needs.',
  },
  {
    order: 2,
    heading: 'Our Learning Methods',
    description:
      'Our learning method combines flexible and practical approaches to ensure a comprehensive and engaging educational experience.',
  },
  {
    order: 3,
    heading: 'Certification',
    description:
      'MappleStudy provides industry-recognized certification to validate your new skills and enhance your career prospects.',
  },
  {
    order: 4,
    heading: `Rating "Auto-grading"`,
    description:
      'MappleStudy auto-grading feature provides instant, objective feedback to help learners assess their understanding and progress efficiently.',
  },
  {
    order: 5,
    heading: 'Ready to Work',
    description:
      'MappleStudy equips learners with job-ready skills, preparing them to excel in the workforce.',
  },
];

/**
 * LearningGrid component
 * Renders a responsive grid of learning feature cards based on LearningGridArray.
 */
const LearningGrid = () => {
  return (
    // Grid container: auto-centered, responsive columns, padding and margin
    <div className="grid mx-auto w-full max-w-screen-xl grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mb-12 p-4">
      {LearningGridArray.map((card, i) => {
        // Determine if current card is the highlighted feature
        const isHighlightCard = card.order < 0;
        // Alternate background based on order for zebra-striping
        const cardBgClass =
          card.order % 2 === 1
            ? 'bg-[var(--color-richblack-600)]'
            : card.order % 2 === 0
            ? 'bg-[var(--color-richblack-800)]'
            : 'bg-transparent';
        const cardHeightClass = 'h-[320px]'; // fixed card height
        const colSpanClass = i === 0 ? 'xl:col-span-2' : ''; // first card spans two columns on xl
        const colStartClass = card.order === 3 ? 'xl:col-start-2' : ''; // position third card

        return (
          <div
            key={i}
            className={`${colSpanClass} ${colStartClass} ${cardBgClass} ${cardHeightClass} p-4`}
          >
            {isHighlightCard ? (
              // Highlight card layout
              <div className="flex flex-col gap-3 pb-10 xl:pb-0 sm:pb-20">
                <div className="text-2xl sm:text-4xl font-semibold text-left">
                  {card.heading}
                  <HighlightText text={card.highlightText} />
                </div>
                <p className="text-[var(--color-richblack-300)] font-medium text-sm sm:text-base">
                  {card.description}
                </p>
                <div className="w-fit mt-2">
                  {/* CTA button for highlight card */}
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              // Standard card layout
              <div className="p-3 flex flex-col gap-4 sm:gap-8">
                <h1 className="text-[var(--color-richblack-5)] text-lg sm:text-xl text-center font-bold">
                  {card.heading}
                </h1>
                <p className="text-[var(--color-richblack-100)] font-medium text-sm sm:text-base px-2">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;
