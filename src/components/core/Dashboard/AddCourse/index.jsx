// Importing the RenderSteps component which handles rendering different steps of the course creation process
import RenderSteps from './RenderSteps';

export default function AddCourse() {
  return (
    <>
      {/* Main container for the Add Course page */}
      <div className="flex w-full items-start gap-x-6">
        {/* Left Section: Main content area */}
        <div className="flex flex-1 flex-col">
          {/* Page heading */}
          <h1 className="mb-14 text-3xl font-medium text-[var(--color-richblack-5)]">
            Add Course
          </h1>

          {/* Rendering course creation steps */}
          <div className="flex-1">
            <RenderSteps />
          </div>
        </div>

        {/* Right Section: Course Upload Tips (visible only on extra large screens) */}
        <div className="sticky top-10 hidden max-w-[400px] flex-1 rounded-md border-[1px] border-[var(--color-richblack-700)] bg-[var(--color-richblack-800)] p-6 xl:block">
          {/* Tips Heading */}
          <p className="mb-8 text-lg text-[var(--color-richblack-5)]">
            ⚡ Course Upload Tips
          </p>

          {/* Tips List */}
          <ul className="ml-5 list-item list-disc space-y-4 text-xs text-[var(--color-richblack-5)]">
            <li>Set the Course Price option or make it free.</li>
            <li>Standard size for the course thumbnail is 1024x576.</li>
            <li>Video section controls the course overview video.</li>
            <li>Course Builder is where you create & organize a course.</li>
            <li>
              Add Topics in the Course Builder section to create lessons,
              quizzes, and assignments.
            </li>
            <li>
              Information from the Additional Data section shows up on the
              course single page.
            </li>
            <li>Make Announcements to notify any important</li>
            <li>Notes to all enrolled students at once.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
