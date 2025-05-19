import Footer from '../components/common/Footer';
import ContactDetails from '../components/ContactPage/ContactDetails';
import ContactForm from '../components/ContactPage/ContactForm';

// Main Contact page functional component
const Contact = () => {
  return (
    <div>
      {/* Container for details and form, responsive layout using Tailwind classes */}
      <div
        className="
          mx-auto mt-20 flex
          w-full max-w-maxContent
          flex-col items-center gap-6 px-4 text-white
          sm:w-11/12 sm:px-0
          lg:flex-row lg:justify-center lg:items-start lg:gap-x-8
        "
      >
        {/* Contact Details section */}
        <div className="w-full sm:w-[85%] lg:w-[30%]">
          <ContactDetails />{' '}
          {/* Renders icons and details for chat, visit, call */}
        </div>

        {/* Contact Form section */}
        <div className="w-full sm:w-[90%] lg:w-[50%]">
          <ContactForm /> {/* Renders input fields and submit button */}
        </div>
      </div>

      {/* Section highlighting satisfied learners */}
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-[var(--color-richblack-900)] text-white">
        <h1 className="text-center text-4xl font-semibold mt-8">
          Happy & Satisfied Learners!
        </h1>
      </div>

      {/* Footer displayed at the bottom of the page */}
      <Footer />
    </div>
  );
};

export default Contact;
