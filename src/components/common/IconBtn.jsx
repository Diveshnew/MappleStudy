// IconBtn component renders a customizable button with optional icon and styling props
export default function IconBtn({
  text, // Label text to display inside the button
  onClick, // Click handler function for button events
  children, // Optional icon or other React nodes to render alongside text
  disabled, // Boolean to disable the button
  outline = false, // Whether to use outlined style instead of filled
  customClasses = '', // Additional CSS classes passed from parent
  type = 'button', // Default button type
}) {
  return (
    <button
      disabled={disabled} // Disable interaction when true
      onClick={onClick} // Bind click handler
      type={type} // Set button type attribute
      className={`flex items-center justify-center gap-x-2 rounded-md py-2 px-5 font-semibold ${
        outline
          ? 'border border-[var(--color-yellow-50)] bg-transparent text-[var(--color-yellow-50)]'
          : 'bg-[var(--color-yellow-50)] text-[var(--color-richblack-900)]'
      } ${customClasses}`} // Combined styling and custom classes
    >
      {/* Render icon and text when children (icon) is provided */}
      {children ? (
        <>
          <span>{text}</span>
          {children}
        </>
      ) : (
        // Render only text when no icon is provided
        <span>{text}</span>
      )}
    </button>
  );
}
