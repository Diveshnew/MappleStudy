// Importing React and Fragment for JSX structure
import React, { Fragment } from 'react';
// Importing check icon to show completed steps
import { FaCheck } from 'react-icons/fa';
// Importing Redux hook to get the current step from the global state
import { useSelector } from 'react-redux';

// Importing step-specific components
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm';
import CourseInformationForm from './CourseInformation/CourseInformationForm';
import PublishCourse from './PublishCourse';

export default function RenderSteps() {
  // Getting the current step from Redux store
  const { step } = useSelector((state) => state.course);

  // Defining the steps with id and title
  const steps = [
    { id: 1, title: 'Course Information' },
    { id: 2, title: 'Course Builder' },
    { id: 3, title: 'Publish' },
  ];

  return (
    <>
      {/* Step Indicators: shows step number or checkmark inside a circular button */}
      <div className="relative mb-2 flex w-full justify-center">
        {steps.map((item) => (
          <Fragment key={item.id}>
            {/* Step button with dynamic styles based on progress */}
            <div className="flex flex-col items-center">
              <button
                className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] ${
                  step === item.id
                    ? 'border-[var(--color-yellow-50)] bg-[var(--color-yellow-900)] text-[var(--color-yellow-50)]'
                    : 'border-[var(--color-richblack-700)] bg-[var(--color-richblack-800)] text-[var(--color-richblack-300)]'
                } ${
                  step > item.id
                    ? 'bg-[var(--color-yellow-50)] text-[var(--color-richblack-900)]'
                    : ''
                }`}
              >
                {/* Show checkmark for completed steps, else show step number */}
                {step > item.id ? (
                  <FaCheck className="font-bold text-[var(--color-richblack-900)]" />
                ) : (
                  item.id
                )}
              </button>
            </div>

            {/* Dashed connector line between steps */}
            {item.id !== steps.length && (
              <div
                className={`h-[calc(34px/2)] w-[33%] border-dashed border-b-2 ${
                  step > item.id
                    ? 'border-[var(--color-yellow-50)]'
                    : 'border-[var(--color-richblack-500)]'
                }`}
              />
            )}
          </Fragment>
        ))}
      </div>

      {/* Step Labels: shows title of each step below step indicator */}
      <div className="relative mb-16 flex w-full select-none justify-between">
        {steps.map((item) => (
          <Fragment key={item.id}>
            <div className="flex min-w-[130px] flex-col items-center gap-y-2">
              <p
                className={`text-sm ${
                  step >= item.id
                    ? 'text-[var(--color-richblack-5)]'
                    : 'text-[var(--color-richblack-500)]'
                }`}
              >
                {item.title}
              </p>
            </div>
          </Fragment>
        ))}
      </div>

      {/* Render specific component based on current step */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </>
  );
}
