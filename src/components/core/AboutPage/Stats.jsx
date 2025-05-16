import { useEffect, useRef } from 'react';
import useIntersectionObserver from './useIntersectionObserver'; // Custom hook for visibility detection

// Animates a numeric count-up effect on a given element
const countUp = (element, start, end, duration, finalDisplay) => {
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime; // Initialize start time
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const currentNumber = Math.floor(progress * (end - start) + start);

    // Update element text with formatted number
    element.textContent = currentNumber.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(animation);
    } else {
      // On completion, display the final text (e.g., "10K")
      element.textContent = finalDisplay;
    }
  };

  requestAnimationFrame(animation);
};

// Parse shorthand count strings: "10K" => 10000, otherwise numeric string
const parseCountValue = (count) =>
  count.endsWith('K') ? parseFloat(count) * 1000 : parseFloat(count);

// Determine display string: preserve "K" suffix if present, else localized number
const getFinalDisplay = (count) =>
  count.endsWith('K') ? count : parseFloat(count).toLocaleString();

const StatsComponent = () => {
  // Statistics data array: count strings and labels
  const stats = [
    { count: '10K', label: 'Active Students' },
    { count: '10', label: 'Mentors' },
    { count: '20', label: 'Courses' },
    { count: '50', label: 'Awards' },
  ];

  // Refs to span elements that display each count
  const elementsRef = useRef([]);
  // Hook returns visibility flag and a ref callback to attach observer
  const [isIntersecting, setElement] = useIntersectionObserver({
    threshold: 0.5, // Trigger when 50% of component is visible
  });

  // Run count-up animation when component scrolls into view
  useEffect(() => {
    if (isIntersecting) {
      elementsRef.current.forEach((element, index) => {
        const endValue = parseCountValue(stats[index].count);
        countUp(
          element,
          0,
          endValue,
          2000, // animation duration in ms
          getFinalDisplay(stats[index].count)
        );
      });
    }
  }, [isIntersecting]);

  return (
    // Wrapper: background and padding, observed for intersection
    <div className="bg-[var(--color-richblack-700)] py-4" ref={setElement}>
      <div className="w-11/12 max-w-maxContent mx-auto text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-center">
          {stats.map((data, index) => (
            <div key={index} className="flex flex-col items-center py-0.5">
              <div className="flex items-baseline gap-0.5">
                {/* Number element to animate; ref stores DOM node */}
                <h1
                  ref={(el) => (elementsRef.current[index] = el)}
                  className="text-[30px] font-bold text-[var(--color-richblack-5)]"
                >
                  {parseCountValue(data.count).toLocaleString()}
                </h1>
                {/* Static plus sign next to number */}
                <span className="text-[30px] font-bold text-[var(--color-richblack-5)]">
                  +
                </span>
              </div>
              {/* Label below the count */}
              <h2 className="mt-0 font-semibold text-[16px] text-[var(--color-richblack-500)]">
                {data.label}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsComponent;
