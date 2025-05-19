import ContactUsForm from './ContactUsForm';

// Component rendering the styled contact form section
const ContactForm = () => {
  return (
    <div className="border border-[var(--color-richblack-600)] text-[var(--color-richblack-300)] rounded-xl p-7 lg:p-14 flex gap-3 flex-col">
      {/* Title encouraging users to share their ideas */}
      <h1 className="text-4xl leading-10 font-semibold text-[var(--color-richblack-5)]">
        Got an Idea? We&apos;ve got the skills. Let&apos;s team up !!
      </h1>
      {/* Subtitle prompting additional user input */}
      <p>Tell us more about yourself and what you&apos;re got in mind.</p>

      {/* Container for the actual contact form inputs */}
      <div className="mt-7">
        <ContactUsForm />{' '}
        {/* Renders form fields like name, email, message, and submit button */}
      </div>
    </div>
  );
};

export default ContactForm;
