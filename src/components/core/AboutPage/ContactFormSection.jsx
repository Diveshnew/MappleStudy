import ContactUsForm from '../../ContactPage/ContactUsForm';

/**
 * ContactFormSection component
 * Renders the heading, description, and ContactUsForm inside a centered container.
 */
const ContactFormSection = () => {
  return (
    // Wrapper div for section layout and centering
    <div className="mx-auto form">
      {/* Section title */}
      <h1 className="text-center text-4xl font-semibold">Get in Touch</h1>
      {/* Section subtitle */}
      <p className="text-center text-[var(--color-richblack-300)] mt-3">
        We&apos;d love to hear from you. Please fill out this form.
      </p>
      {/* Contact form component */}
      <ContactUsForm />
    </div>
  );
};

export default ContactFormSection;
