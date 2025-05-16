import FoundingStory from '../assets/Images/FoundingStory.jpg';
import BannerImage1 from '../assets/Images/aboutus1.webp';
import BannerImage2 from '../assets/Images/aboutus2.jpg';
import BannerImage3 from '../assets/Images/aboutus3.jpg';
import Footer from '../components/common/Footer';
import ContactFormSection from '../components/core/AboutPage/ContactFormSection';
import LearningGrid from '../components/core/AboutPage/LearningGrid';
import Quote from '../components/core/AboutPage/Quote';
import StatsComponent from '../components/core/AboutPage/Stats';
import HighlightText from '../components/core/HomePage/HighlightText';

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[var(--color-richblack-700)]">
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-[var(--color-white)]">
          <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
            Driving Change in Online Education for a
            <HighlightText text={'Better Tomorrow'} />
            <p className="mx-auto mt-3 mb-10 text-center text-base font-medium text-[var(--color-richblack-300)] lg:w-[95%]">
              MappleStudy is redefining online education. We&rsquo;re not just
              teaching&mdash;we&rsquo;re shaping the future. With next-gen
              courses, breakthrough tech, and a thriving learning community,
              we&rsquo;re empowering learners to rise, lead, and innovate.
            </p>
          </header>
          <div className="sm:h-[70px] lg:h-[150px]"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[30%] grid grid-cols-3 gap-2 lg:gap-3 w-full max-w-6xl px-4">
            <img
              src={BannerImage1}
              alt="Banner 1"
              className="w-full h-auto object-cover rounded-md shadow-md"
            />
            <img
              src={BannerImage2}
              alt="Banner 2"
              className="w-full h-auto object-cover rounded-md shadow-md"
            />
            <img
              src={BannerImage3}
              alt="Banner 3"
              className="w-full h-auto object-cover rounded-md shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="border-b border-[var(--color-richblack-700)]">
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-[var(--color-richblack-500)]">
          <div className="h-[100px]"></div>
          <Quote />
        </div>
      </section>

      {/* Founding Story, Vision & Mission */}
      <section>
        <div className="w-full py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 flex flex-col lg:flex-row items-center gap-6 lg:gap-10 text-[var(--color-richblack-500)]">
            {/* Content */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent">
                Our Founding Story
              </h1>
              <p className="text-base font-medium text-[var(--color-richblack-300)]">
                Our e-learning platform was forged in the shadows of a broken
                system—by visionaries, technologists, and lifelong learners who
                refused to accept the limits of traditional education. What
                began as a spark of rebellion became a mission to reshape
                learning itself. In a world evolving faster than ever, we
                rose—not to adapt, but to lead. Through this platform,
                we&rsquo;re opening gates to accessible, flexible, and
                high-impact education—for those ready to level up.
              </p>
              <p className="text-base font-medium text-[var(--color-richblack-300)]">
                As seasoned warriors in the realm of education, we faced the
                harsh realities and weaknesses of the old system. We knew
                learning couldn&rsquo;t be trapped within four walls or bound by
                distance. So, we forged a new path—a platform designed to break
                those barriers and unleash the hidden power within every
                individual, no matter where they come from or who they are.
              </p>
            </div>

            {/* Image */}
            <div className="w-full lg:w-1/2">
              <img
                src={FoundingStory}
                alt="Founding Story"
                className="w-full h-auto rounded-md shadow-[0_0_20px_0] shadow-[#FC6767]"
              />
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-4 mt-16 flex flex-col lg:flex-row gap-6 lg:gap-10 text-[var(--color-richblack-500)]">
            {/* Vision */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent">
                Our Vision
              </h1>
              <p className="text-base font-medium text-[var(--color-richblack-300)]">
                Fueled by this vision, we embarked on a relentless quest to
                build an e-learning fortress unlike any other. Our team of
                relentless experts battled challenges day and night, crafting a
                powerful and seamless platform where advanced technology meets
                thrilling, immersive content—sparking a learning experience that
                evolves and adapts with every step forward.
              </p>
            </div>

            {/* Mission */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-4xl font-semibold text-transparent">
                Our Mission
              </h1>
              <p className="text-base font-medium text-[var(--color-richblack-300)]">
                Our mission is more than just delivering lessons—it’s about
                building a stronghold of warriors united by knowledge. A
                thriving community where learners connect, collaborate, and grow
                stronger together. We believe true power comes from sharing and
                battling ideas side by side, and we ignite this spirit through
                forums, live battles of wisdom, and alliances forged in
                networking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-[var(--color-richblack-700)] py-8">
        <div className="flex justify-center">
          <div className="w-3/4">
            <StatsComponent />
          </div>
        </div>
      </section>

      {/* Learning Grid & Contact */}
      <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-[var(--color-white)]">
        <LearningGrid />
        <ContactFormSection />
      </section>

      {/* Reviews & Footer */}
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-[var(--color-richblack-900)] text-[var(--color-white)]">
        <h1 className="text-center text-4xl font-semibold mt-8">
          Happy & Satisfied Learners!
        </h1>
      </div>

      <Footer />
    </div>
  );
};

export default About;
