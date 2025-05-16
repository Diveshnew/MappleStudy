import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import CountryCode from '../../data/countrycode.json';
import { apiConnector } from '../../services/apiconnector';
import { contactusEndpoint } from '../../services/apis';

/**
 * ContactUsForm component
 * Renders a contact form with validation and submits data to API
 */
const ContactUsForm = () => {
  // Loading state for form submission
  const [loading, setLoading] = useState(false);

  // Initialize react-hook-form methods
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  /**
   * Handles form submission: sends data to contact API
   * @param {Object} data - form values
   */
  const submitContactForm = async (data) => {
    try {
      setLoading(true);
      await apiConnector('POST', contactusEndpoint.CONTACT_US_API, data);
      setLoading(false);
    } catch (error) {
      console.error('ERROR MESSAGE - ', error.message);
      setLoading(false);
    }
  };

  // Reset form fields after successful submission
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: '',
        firstname: '',
        lastname: '',
        message: '',
        phoneNo: '',
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    // Form wrapper with top margin and column layout
    <form
      className="flex flex-col gap-7"
      onSubmit={handleSubmit(submitContactForm)}
      style={{ marginTop: '30px' }}
    >
      {/* Name fields: first and last */}
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstname" className="lable-style">
            First Name
          </label>
          {/* First name input with required validation */}
          <input
            type="text"
            id="firstname"
            placeholder="Enter first name"
            className="form-style"
            {...register('firstname', { required: true })}
          />
          {errors.firstname && (
            <span className="-mt-1 text-[12px] text-[var(--color-yellow-100)]">
              Please enter your name.
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastname" className="lable-style">
            Last Name
          </label>
          {/* Last name input (optional) */}
          <input
            type="text"
            id="lastname"
            placeholder="Enter last name"
            className="form-style"
            {...register('lastname')}
          />
        </div>
      </div>

      {/* Email field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="lable-style">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter email address"
          className="form-style"
          {...register('email', { required: true })}
        />
        {errors.email && (
          <span className="-mt-1 text-[12px] text-[var(--color-yellow-100)]">
            Please enter your Email address.
          </span>
        )}
      </div>

      {/* Phone number with country code selector */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="lable-style">
          Phone Number
        </label>

        <div className="flex gap-5">
          <div className="flex w-[81px] flex-col gap-2">
            {/* Country code dropdown */}
            <select
              id="countrycode"
              className="form-style"
              {...register('countrycode', { required: true })}
            >
              {CountryCode.map((ele, i) => (
                <option key={i} value={ele.code}>
                  {ele.code} — {ele.country}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            {/* Phone number input with length validation */}
            <input
              type="tel"
              id="phonenumber"
              placeholder="12345 67890"
              className="form-style"
              {...register('phoneNo', {
                required: {
                  value: true,
                  message: 'Please enter your Phone Number.',
                },
                maxLength: { value: 10, message: 'Invalid Phone Number' },
                minLength: { value: 10, message: 'Invalid Phone Number' },
              })}
            />
          </div>
        </div>
        {errors.phoneNo && (
          <span className="-mt-1 text-[12px] text-[var(--color-yellow-100)]">
            {errors.phoneNo.message}
          </span>
        )}
      </div>

      {/* Message textarea */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="lable-style">
          Message
        </label>
        <textarea
          id="message"
          cols={30}
          rows={7}
          placeholder="Enter your message here"
          className="form-style"
          {...register('message', { required: true })}
        />
        {errors.message && (
          <span className="-mt-1 text-[12px] text-[var(--color-yellow-100)]">
            Please enter your Message.
          </span>
        )}
      </div>

      {/* Submit button: disabled while loading */}
      <button
        disabled={loading}
        type="submit"
        className={`
          rounded-md
          bg-[var(--color-yellow-50)]
          px-6 py-3
          text-center text-[13px] font-bold
          text-[var(--color-black)]
          shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]
          ${
            !loading &&
            'transition-all duration-200 hover:scale-95 hover:shadow-none'
          }
          disabled:bg-[var(--color-richblack-500)]
          sm:text-[16px]
        `}
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactUsForm;
