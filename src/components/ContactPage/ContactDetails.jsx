import * as Icon1 from 'react-icons/bi';
import * as Icon3 from 'react-icons/hi2';
import * as Icon2 from 'react-icons/io5';

// Array defining each contact method's data and behavior
const contactDetails = [
  {
    icon: 'HiChatBubbleLeftRight',
    heading: 'Chat with us',
    description: 'Our friendly team is here to help.',
    details: 'info@mapplestudy.com',
    linkType: 'email',
  },
  {
    icon: 'BiWorld',
    heading: 'Visit us',
    description: 'Come and say hello at our office HQ.',
    details: 'FAI BerSarai, RK Puram sector-1, Delhi',
    linkType: null,
  },
  {
    icon: 'IoCall',
    heading: 'Call us',
    description: 'Mon - Fri From 8am to 5pm',
    details: '+123 456 7869',
    linkType: 'phone',
  },
];

// Functional component to display all contact methods
const ContactDetails = () => {
  return (
    <div className="flex flex-col gap-6 p-[34px] rounded-xl bg-[var(--color-richblack-800)] lg:p-6">
      {/* Iterate over each contact detail entry */}
      {contactDetails.map((ele, i) => {
        // Dynamically select the correct icon from available imports
        let Icon = Icon1[ele.icon] || Icon2[ele.icon] || Icon3[ele.icon];
        let detailElement;

        // Render the contact detail as a link or plain text based on linkType
        if (ele.linkType === 'email') {
          detailElement = (
            <a
              href={`mailto:${ele.details}`} // Opens default mail client
              className="font-semibold text-[var(--color-richblack-200)]"
            >
              {ele.details}
            </a>
          );
        } else if (ele.linkType === 'phone') {
          detailElement = (
            <a
              href={`tel:${ele.details}`} // Initiates phone call on supported devices
              className="font-semibold text-[var(--color-richblack-200)]"
            >
              {ele.details}
            </a>
          );
        } else {
          detailElement = <p className="font-semibold">{ele.details}</p>; // Plain text fallback
        }

        return (
          <div
            className="flex flex-col gap-[2px] p-3 text-sm text-[var(--color-richblack-200)]"
            key={i} // Use index as key for list rendering
          >
            {/* Icon and heading row */}
            <div className="flex flex-row items-center gap-3">
              <Icon size={25} /> {/* Render the chosen icon */}
              <h1 className="text-lg font-semibold text-[var(--color-richblack-5)]">
                {ele?.heading}
              </h1>
            </div>
            {/* Description text below heading */}
            <p className="font-medium">{ele?.description}</p>
            {/* Render the link or text element */}
            {detailElement}
          </div>
        );
      })}
    </div>
  );
};

export default ContactDetails;
