// Importing core Swiper styles for various features like autoplay, navigation, etc.
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Importing specific Swiper modules to be used in the slider
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules';
// Importing Swiper and SwiperSlide components to create the slider
import { Swiper, SwiperSlide } from 'swiper/react';

// Importing the CourseCard component to display individual course details
import CourseCard from './Course_Card';

// Functional component to display a horizontal course slider using Swiper
const CourseSlider = ({ Courses = [] }) => {
  return (
    <>
      {/* Check if Courses array has any data */}
      {Courses.length > 0 ? (
        // Swiper component that renders the slider with specified settings
        <Swiper
          slidesPerView={1} // Show 1 slide by default
          spaceBetween={25} // Space between slides
          loop={true} // Enable infinite loop mode
          modules={[FreeMode, Pagination, Autoplay, Navigation]} // Enable various Swiper modules
          autoplay={{ delay: 2500, disableOnInteraction: false }} // Auto slide every 2.5 seconds
          navigation // Show navigation arrows
          pagination={{ clickable: true }} // Enable clickable pagination dots
          freeMode={true} // Enable free scroll mode
          breakpoints={{
            // Responsive settings: show 3 slides on screens >= 1024px
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem]" // Max height of the slider
        >
          {/* Map over Courses array to render each course inside a SwiperSlide */}
          {Courses.map((course, i) => (
            <SwiperSlide key={i}>
              {/* Render the CourseCard component with course data */}
              <CourseCard course={course} Height="h-[250px]" />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        // If no courses are available, show fallback message
        <p className="text-xl text-[var(--color-richblack-5)]">
          No Course Found
        </p>
      )}
    </>
  );
};

// Exporting the CourseSlider component for use in other parts of the application
export default CourseSlider;
