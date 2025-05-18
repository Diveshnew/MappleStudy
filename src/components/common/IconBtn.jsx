// IconBtn component renders a customizable button with optional icon and styling props
export default function IconBtn({
  text, // Label text to display inside the button
  onclick, // Click handler function for button events
  children, // Optional icon or other React nodes to render alongside text
  disabled, // Boolean to disable the button
  outline = false, // Whether to use outlined style instead of filled
  customClasses, // Additional CSS classes passed from parent
  type,
}) {
  return (
    <button
      disabled={disabled} // Disable interaction when true
      onClick={onclick} // Bind click handler
      className={`flex items-center ${
        outline
          ? 'border border-[var(--color-yellow-50)] bg-transparent' // Outlined style classes
          : 'bg-[var(--color-yellow-50)]' // Filled style classes
      } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-[var(--color-richblack-900)] ${customClasses}`} // Shared styling and custom classes
      type={type} // Set button type attribute
    >
      {/* Render icon and text when children (icon) is provided */}
      {children ? (
        <>
          {/* Text span changes color when outlined */}
          <span className={`${outline && 'text-[var(--color-yellow-50)]'}`}>
            {text}
          </span>
          {children}
        </>
      ) : (
        // Render only text when no icon is provided
        text
      )}
    </button>
  );
}
