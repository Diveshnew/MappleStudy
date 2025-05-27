import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdNavigateNext } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import {
  createSection,
  updateSection,
} from '../../../../../services/operations/courseDetailsAPI';
import {
  setCourse,
  setEditCourse,
  setStep,
} from '../../../../../slices/courseSlice';
import IconBtn from '../../../../common/IconBtn';
import NestedView from './NestedView';

export default function CourseBuilderForm() {
  // Initializing react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Getting data from Redux store
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  // Local state for loading and tracking which section is being edited
  const [loading, setLoading] = useState(false);
  const [editSectionId, setEditSectionId] = useState(null);

  const dispatch = useDispatch();

  // Cancels editing mode and clears input field
  const cancelEdit = () => {
    setEditSectionId(null);
    setValue('sectionName', '');
  };

  // Handles clicking on an existing section to start editing it
  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionId === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionId(sectionId);
    setValue('sectionName', sectionName);
  };

  // Handles form submission for both creating and updating a section
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editSectionId) {
        // —— UPDATE EXISTING SECTION ——
        const updatedSec = await updateSection(
          {
            sectionName: data.sectionName,
            sectionId: editSectionId,
            courseId: course._id,
          },
          token
        );

        if (updatedSec && updatedSec._id) {
          // Replace only the updated section in course content
          cancelEdit();
          const updatedContent = (course.courseContent || []).map((sec) =>
            sec._id === updatedSec._id ? { ...sec, ...updatedSec } : sec
          );
          dispatch(setCourse({ ...course, courseContent: updatedContent }));
          toast.success('Section updated successfully');
        } else {
          toast.error('Failed to update section');
        }
      } else {
        // —— CREATE NEW SECTION ——
        // createSection returns the full, updated course object
        const updatedCourse = await createSection(
          { sectionName: data.sectionName, courseId: course._id },
          token
        );

        if (updatedCourse?.courseContent) {
          // Normalize each section's subSection array
          const formattedContent = updatedCourse.courseContent.map((sec) => ({
            ...sec,
            subSection: sec.subSections || sec.subSection || [],
          }));

          // Replace the entire course in Redux, with formatted content
          dispatch(
            setCourse({
              ...updatedCourse,
              courseContent: formattedContent,
            })
          );

          toast.success('Section created successfully');
          setValue('sectionName', '');
        } else {
          toast.error('Failed to create section');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handles navigation to the next step
  const goToNext = () => {
    // Require at least one section
    if (!course.courseContent || course.courseContent.length === 0) {
      toast.error('Please add at least one section');
      return;
    }
    // Each section must have at least one lecture
    if (
      course.courseContent.some((section) => !(section.subSection || []).length)
    ) {
      toast.error('Please add at least one lecture in each section');
      return;
    }
    dispatch(setStep(3));
  };

  // Goes back to previous step and re-enables editing mode
  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  return (
    <div className="space-y-8 rounded-md border-[1px] border-[var(--color-richblack-700)] bg-[var(--color-richblack-800)] p-6">
      {/* Heading */}
      <p className="text-2xl font-semibold text-[var(--color-richblack-5)]">
        Course Builder
      </p>

      {/* Form to create or edit a section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="sectionName"
            className="text-sm text-[var(--color-richblack-5)]"
          >
            Section Name <sup className="text-[var(--color-pink-200)]">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register('sectionName', { required: true })}
            className="form-style w-full"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-[var(--color-pink-200)]">
              Section name is required
            </span>
          )}
        </div>

        {/* Submit button + Cancel edit (only when editing) */}
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionId ? 'Edit Section Name' : 'Create Section'}
            outline
          >
            <IoAddCircleOutline
              size={20}
              className="text-[var(--color-yellow-50)]"
            />
          </IconBtn>
          {editSectionId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-[var(--color-richblack-300)] underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Render nested sections if available */}
      {course.courseContent && course.courseContent.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      {/* Navigation buttons */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-[var(--color-richblack-300)] py-2 px-5 font-semibold text-[var(--color-richblack-900)]"
        >
          Back
        </button>
        <IconBtn disabled={loading} text="Next" onClick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  );
}
