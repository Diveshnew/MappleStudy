import backgroundImage from '../assets/Images/404.jpg';
import CTAButton from '../components/core/HomePage/Button';

const Error = () => {
  return (
    <div className="relative min-h-screen w-full text-white flex justify-center items-center">
      {/* Responsive Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Semi-transparent overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Content wrapper */}
      <div className="relative z-20 p-5 rounded-lg md:p-20 w-11/12 md:w-auto text-center">
        <p className="text-white text-2xl md:text-4xl my-2">
          Oops! It looks like you're lost.
        </p>
        <div className="mt-8 flex justify-center gap-7">
          <CTAButton active={true} linkto={'/'}>
            Go to Homepage
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default Error;
