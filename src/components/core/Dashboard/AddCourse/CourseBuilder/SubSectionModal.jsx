import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { RxCross2 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';

// Import API service functions for creating and updating subsections
import {
  createSubSection,
  updateSubSection,
} from '../../../../../services/operations/courseDetailsAPI';
// Import Redux action to set course
import { setCourse } from '../../../../../slices/courseSlice';
// Import reusable icon button and file upload component
import IconBtn from '../../../../common/IconBtn';
import Upload from '../Upload';

export default function SubSectionModal({
  modalData,
  setModalData,
  add,
  view,
  edit,
  courseId,
  sectionId,
  token,
}) {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { course } = useSelector((state) => state.course);

  // Pre-fill form if in view or edit mode
  useEffect(() => {
    if (view || edit) {
      setValue('lectureTitle', modalData.title);
      setValue('lectureDesc', modalData.description);
      setValue('timeDuration', modalData.timeDuration || '');
      setValue('lectureVideo', modalData.videoUrl);
    }
  }, [view, edit, modalData, setValue]);

  // Check if the form data has been changed from the original
  const isFormUpdated = () => {
    const vals = getValues();
    return (
      vals.lectureTitle !== modalData.title ||
      vals.lectureDesc !== modalData.description ||
      vals.timeDuration !== modalData.timeDuration ||
      vals.lectureVideo !== modalData.videoUrl
    );
  };

  // Update Redux store with modified section data
  const syncSectionInStore = (updatedSection) => {
    // Normalize subsection key to 'subSection' regardless of original key
    const formatted = {
      ...updatedSection,
      subSection: updatedSection.subSections || updatedSection.subSection || [],
    };

    // Replace the modified section in course content
    const updatedContent = course.courseContent.map((sec) =>
      sec._id === formatted._id ? formatted : sec
    );
    dispatch(setCourse({ ...course, courseContent: updatedContent }));
  };

  // Handle saving an edited subsection
  const handleEditSubsection = async () => {
    const vals = getValues();
    const formData = new FormData();
    formData.append('sectionId', modalData.sectionId);
    formData.append('subSectionId', modalData._id);
    formData.append('title', vals.lectureTitle);
    formData.append('timeDuration', vals.timeDuration);
    formData.append('description', vals.lectureDesc);
    // Only upload video if it has changed
    if (vals.lectureVideo && vals.lectureVideo !== modalData.videoUrl) {
      formData.append('videoFile', vals.lectureVideo);
    }
    setLoading(true);
    const result = await updateSubSection(formData, token);
    if (result) {
      syncSectionInStore(result);
    } else {
      toast.error('Failed to update lecture');
    }
    setModalData(null);
    setLoading(false);
  };

  // Handle form submission for both add and edit
  const onSubmit = async (data) => {
    if (view) return; // Prevent submit in view-only mode
    if (edit) {
      if (!isFormUpdated()) toast.error('No changes made');
      else handleEditSubsection();
      return;
    }

    // Create new subsection
    const formData = new FormData();
    formData.append('sectionId', sectionId);
    formData.append('title', data.lectureTitle);
    formData.append('timeDuration', data.timeDuration);
    formData.append('description', data.lectureDesc);
    formData.append('videoFile', data.lectureVideo);
    setLoading(true);
    const result = await createSubSection(formData, token);
    if (result) {
      syncSectionInStore(result);
    } else {
      toast.error('Failed to add lecture');
    }
    setModalData(null);
    setLoading(false);
  };

  return (
    // Modal overlay
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center bg-opacity-40 backdrop-blur-sm">
      {/* Modal content container */}
      <div className="w-[95vw] sm:w-11/12 max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-[var(--color-richblack-800)] p-4 sm:p-6">
        {/* Modal header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--color-richblack-5)]">
            {view ? 'Viewing' : edit ? 'Editing' : 'Adding'} Lecture
          </h2>
          {/* Close button */}
          <button onClick={() => !loading && setModalData(null)}>
            <RxCross2 className="text-2xl text-[var(--color-richblack-5)]" />
          </button>
        </div>
        {/* Lecture form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          {/* Title field */}
          <div>
            <label className="block text-sm text-[var(--color-richblack-5)]">
              Title <sup className="text-[var(--color-pink-200)]">*</sup>
            </label>
            <input
              disabled={view || loading}
              {...register('lectureTitle', { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <p className="text-[var(--color-pink-200)] text-xs">Required</p>
            )}
          </div>
          {/* Description field */}
          <div>
            <label className="block text-sm text-[var(--color-richblack-5)]">
              Description <sup className="text-[var(--color-pink-200)]">*</sup>
            </label>
            <textarea
              disabled={view || loading}
              {...register('lectureDesc', { required: true })}
              className="form-style w-full min-h-[100px]"
            />
            {errors.lectureDesc && (
              <p className="text-[var(--color-pink-200)] text-xs">Required</p>
            )}
          </div>
          {/* Duration field */}
          <div>
            <label className="block text-sm text-[var(--color-richblack-5)]">
              Duration <sup className="text-[var(--color-pink-200)]">*</sup>
            </label>
            <input
              disabled={view || loading}
              {...register('timeDuration', { required: true })}
              placeholder="e.g., 10:00"
              className="form-style w-full"
            />
            {errors.timeDuration && (
              <p className="text-[var(--color-pink-200)] text-xs">Required</p>
            )}
          </div>
          {/* Submit button (hidden in view mode) */}
          {!view && (
            <div className="text-right">
              <IconBtn
                type="submit"
                disabled={loading}
                text={
                  loading ? 'Please wait...' : edit ? 'Save Changes' : 'Save'
                }
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
