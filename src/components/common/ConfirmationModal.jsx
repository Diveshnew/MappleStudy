// ConfirmationModal component displays a modal dialog for user confirmation
import IconBtn from './IconBtn'; // Custom button component with icon support

export default function ConfirmationModal({ modalData }) {
  // modalData contains text and handlers for buttons
  return (
    // Overlay covering the entire viewport, with backdrop blur and semi-transparent background
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-auto border-[var(--color-richblack-400)] bg-opacity-10 backdrop-blur-sm">
      {/* Modal container */}
      <div className="w-11/12 max-w-[350px] rounded-lg border border-[var(--color-richblack-400)] bg-[var(--color-richblack-800)] p-6">
        {/* Primary confirmation message */}
        <p className="text-2xl font-semibold text-[var(--color-richblack-5)]">
          {modalData?.text1}
        </p>
        {/* Secondary message or description */}
        <p className="mt-3 mb-5 leading-6 text-[var(--color-richblack-200)]">
          {modalData?.text2}
        </p>
        {/* Action buttons: arranged vertically on small screens, horizontally on medium+ */}
        <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4">
          {/* First button using IconBtn: customizable text and click handler */}
          <IconBtn
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />
          {/* Second button: plain styled button with handler */}
          <button
            className="cursor-pointer rounded-md bg-[var(--color-richblack-200)] py-2 px-4 font-semibold text-[var(--color-richblack-900)]"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  );
}
