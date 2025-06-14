// Import necessary hooks and utilities from React, Redux, and local files
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { MdNavigateNext } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from '../../../../../services/operations/courseDetailsAPI';
import { setCourse, setStep } from '../../../../../slices/courseSlice';
import { COURSE_STATUS } from '../../../../../utils/constants';
import IconBtn from '../../../../common/IconBtn';
import Upload from '../Upload';
import ChipInput from './ChipInput';
import RequirementsField from './RequirementField';

export default function CourseInformationForm() {
  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  // Get token from auth state and course data from course state
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse } = useSelector((state) => state.course);

  // Local states for loading status and fetched course categories
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  // useEffect to fetch categories and prefill form values in edit mode
  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const result = await fetchCourseCategories();
        // Attempt different patterns to retrieve categories from the API response
        const cats =
          result?.data?.allCategories ??
          result?.allCategories ??
          (Array.isArray(result) ? result : []);

        // Set categories only if the result is a valid array
        if (cats.length) {
          setCourseCategories(cats);
        }
      } catch (e) {
        console.error('Couldnot fetch categories', e);
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    // If form is in edit mode, prefill form fields with course data
    if (editCourse) {
      setValue('courseTitle', course.courseName);
      setValue('courseShortDesc', course.courseDescription);
      setValue('coursePrice', course.price);
      setValue('courseTags', course.tag);
      setValue('courseBenefits', course.whatYouWillLearn);
      setValue('courseCategory', course.category);
      setValue('courseRequirements', course.instructions);
      setValue('courseImage', course.thumbnail);
    }

    // Fetch categories when component mounts
    getCategories();

    // Dependency array is intentionally left empty to run only once
  }, []);

  // Function to check if any form values were changed
  const isFormUpdated = () => {
    const currentValues = getValues();

    // Compare each form field with its original value
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true;
    }
    return false;
  };

  // Form submission handler
  const onSubmit = async (data) => {
    // If in edit mode, update course only if changes are detected
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();

        // Append only changed fields to formData
        formData.append('courseId', course._id);
        if (currentValues.courseTitle !== course.courseName) {
          formData.append('courseName', data.courseTitle);
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append('courseDescription', data.courseShortDesc);
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append('price', data.coursePrice);
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append('tag', JSON.stringify(data.courseTags));
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append('whatYouWillLearn', data.courseBenefits);
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append('category', data.courseCategory);
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            'instructions',
            JSON.stringify(data.courseRequirements)
          );
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append('thumbnailImage', data.courseImage);
        }

        // Submit edited course details to server
        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);
        if (result) {
          dispatch(setStep(2));
          dispatch(setCourse(result));
        }
      } else {
        toast.error('No changes made to the form');
      }
      return;
    }

    // If not in edit mode, create new course with submitted data
    const formData = new FormData();
    formData.append('courseName', data.courseTitle);
    formData.append('courseDescription', data.courseShortDesc);
    formData.append('price', data.coursePrice);
    formData.append('tag', JSON.stringify(data.courseTags));
    formData.append('whatYouWillLearn', data.courseBenefits);
    formData.append('category', data.courseCategory);
    formData.append('status', COURSE_STATUS.DRAFT);
    formData.append('instructions', JSON.stringify(data.courseRequirements));
    formData.append('thumbnailImage', data.courseImage);
    setLoading(true);
    const result = await addCourseDetails(formData, token);
    if (result) {
      dispatch(setStep(2));
      dispatch(setCourse(result));
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-[var(--color-richblack-700)] bg-[var(--color-richblack-800)] p-6"
    >
      {/* Course Title Field */}
      <div className="flex flex-col space-y-2">
        <label
          className="text-sm text-[var(--color-richblack-5)]"
          htmlFor="courseTitle"
        >
          Course Title <sup className="text-[var(--color-pink-200)]">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register('courseTitle', { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-[var(--color-pink-200)]">
            Course title is required
          </span>
        )}
      </div>
      {/* Course Short Description Field */}
      <div className="flex flex-col space-y-2">
        <label
          className="text-sm text-[var(--color-richblack-5)]"
          htmlFor="courseShortDesc"
        >
          Course Short Description{' '}
          <sup className="text-[var(--color-pink-200)]">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register('courseShortDesc', { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-[var(--color-pink-200)]">
            Course Description is required
          </span>
        )}
      </div>
      {/* Course Price Field */}
      <div className="flex flex-col space-y-2">
        <label
          className="text-sm text-[var(--color-richblack-5)]"
          htmlFor="coursePrice"
        >
          Course Price <sup className="text-[var(--color-pink-200)]">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register('coursePrice', {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-[var(--color-richblack-400)]" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-[var(--color-pink-200)]">
            Course Price is required
          </span>
        )}
      </div>
      {/* Course Category Dropdown */}
      <div className="flex flex-col space-y-2">
        <label
          className="text-sm text-[var(--color-richblack-5)]"
          htmlFor="courseCategory"
        >
          Course Category <sup className="text-[var(--color-pink-200)]">*</sup>
        </label>
        <select
          {...register('courseCategory', { required: true })}
          defaultValue=""
          id="courseCategory"
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category, index) => (
              <option key={index} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-[var(--color-pink-200)]">
            Course Category is required
          </span>
        )}
      </div>
      {/* Course Tags Input */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
      {/* Course Thumbnail Upload */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />
      {/* Course Benefits Field */}
      <div className="flex flex-col space-y-2">
        <label
          className="text-sm text-[var(--color-richblack-5)]"
          htmlFor="courseBenefits"
        >
          Benefits of the course{' '}
          <sup className="text-[var(--color-pink-200)]">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register('courseBenefits', { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-[var(--color-pink-200)]">
            Benefits of the course is required
          </span>
        )}
      </div>
      {/* Course Requirements Field */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />
      {/* Submit & Navigation Buttons */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-[var(--color-richblack-300)] py-[8px] px-[20px] font-semibold text-[var(--color-richblack-900)]`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          type="submit"
          disabled={loading}
          text={!editCourse ? 'Next' : 'Save Changes'}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}
