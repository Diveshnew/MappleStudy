// Import necessary hooks and libraries
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import ReactPlayer from 'react-player';

// Upload component definition
export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData ?? editData ?? ''
  );

  // Initialize Dropzone with default click handling
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { 'image/*': ['.jpeg', '.jpg', '.png'] }
      : { 'video/*': ['.mp4'] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => setPreviewSource(reader.result);
        setSelectedFile(file);
      }
    },
  });

  // Register and propagate selected file into react-hook-form
  useEffect(() => {
    register(name, { required: true });
  }, [register, name]);

  useEffect(() => {
    setValue(name, selectedFile);
  }, [selectedFile, setValue, name]);

  return (
    <div className="flex flex-col space-y-2">
      {/* Render title above upload area */}
      <label htmlFor={name} className="text-sm text-[var(--color-richblack-5)]">
        {label}{' '}
        {!viewData && <sup className="text-[var(--color-pink-200)]">*</sup>}
      </label>
      <div
        {...getRootProps()}
        className={`${
          isDragActive
            ? 'bg-[var(--color-richblack-600)]'
            : 'bg-[var(--color-richblack-700)]'
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-[var(--color-richblack-500)]`}
      >
        <input {...getInputProps()} />
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <ReactPlayer
                  url={previewSource}
                  controls
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
              </div>
            )}
            {!viewData && (
              <button
                type="button"
                onClick={(e) => {
                  // prevent triggering dropzone click
                  e.stopPropagation();
                  setPreviewSource('');
                  setSelectedFile(null);
                  setValue(name, null);
                }}
                className="mt-3 text-[var(--color-richblack-400)] underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          // Placeholder when no file is selected
          <div className="flex w-full flex-col items-center p-6">
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-[var(--color-yellow-50)]" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-[var(--color-richblack-200)]">
              Drag and drop an {!video ? 'image' : 'video'}, or click to{' '}
              <span className="font-semibold text-[var(--color-yellow-50)]">
                Browse
              </span>{' '}
              a file
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-[var(--color-richblack-200)]">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>

      {/* Display validation error if any */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-[var(--color-pink-200)]">
          {label} is required
        </span>
      )}
    </div>
  );
}
