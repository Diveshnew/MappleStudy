import HighlightText from '../HomePage/HighlightText';

/**
 * Quote component
 * Renders a stylized quote with highlighted and gradient text segments.
 */
const Quote = () => {
  return (
    // Container: centers content, sets width, typography, and padding
    <div className="mx-auto w-11/12 max-w-6xl text-center text-xl md:text-4xl font-semibold text-white py-10">
      {/* Static text part */}
      We&rsquo;re passionate about transforming how the world learns. Our
      innovative platform blends
      {/* HighlightText: renders inline highlighted text */}
      <HighlightText text={' cutting-edge technology, '} />
      {/* Gradient text for emphasis */}
      <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
        expert knowledge
      </span>
      , and a vibrant community to deliver an{' '}
      {/* Another gradient text segment */}
      <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
        unmatched online education experience.
      </span>
    </div>
  );
};

export default Quote;
