import { useEffect, useRef, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import { updateDisplayPicture } from '../../../../services/operations/SettingsAPI';
import IconBtn from '../../../common/IconBtn';

export default function ChangeProfilePicture() {
  // Accessing authentication token from Redux store
  const { token } = useSelector((state) => state.auth);

  // Accessing current user data from Redux store
  const { user } = useSelector((state) => state.profile);

  // Used to dispatch Redux actions
  const dispatch = useDispatch();

  // Local state to handle image upload and preview
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

  // Ref for hidden file input
  const fileInputRef = useRef(null);

  // Trigger file input click on 'Select' button click
  const handleClick = () => {
    fileInputRef.current.click();
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setImageFile(file); // Save file to state
      previewFile(file); // Generate preview
    }
  };

  // Preview the selected file as a base64-encoded image
  const previewFile = (file) => {
    const reader = new FileReader(); // Create new file reader
    reader.readAsDataURL(file); // Read file as Data URL
    reader.onloadend = () => {
      setPreviewSource(reader.result); // Set preview source on load
    };
  };

  // Upload the selected file to the server
  const handleFileUpload = () => {
    try {
      console.log('uploading...');
      setLoading(true); // Show loading state
      const formData = new FormData();
      formData.append('displayPicture', imageFile); // Append file to FormData

      // Dispatch action to update profile picture
      dispatch(updateDisplayPicture(token, formData)).then(() => {
        setLoading(false); // Reset loading state after upload
      });
    } catch (error) {
      console.log('ERROR MESSAGE - ', error.message); // Log error
    }
  };

  // Re-generate preview when image file is updated
  useEffect(() => {
    if (imageFile) {
      previewFile(imageFile);
    }
  }, [imageFile]);

  return (
    <>
      {/* Profile picture change container */}
      <div className="flex items-center justify-between rounded-md border-[1px] border-[var(--color-richblack-700)] bg-[var(--color-richblack-800)] p-8 px-12 text-[var(--color-richblack-5)]">
        <div className="flex items-center gap-x-4">
          {/* Display current or preview profile picture */}
          <img
            src={previewSource || user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="space-y-2">
            <p>Change Profile Picture</p>
            <div className="flex flex-row gap-3">
              {/* Hidden input for file selection */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/gif, image/jpeg"
              />
              {/* Button to open file selector */}
              <button
                onClick={handleClick}
                disabled={loading}
                className="cursor-pointer rounded-md bg-[var(--color-richblack-700)] py-2 px-5 font-semibold text-[var(--color-richblack-50)]"
              >
                Select
              </button>
              {/* Upload button with loading state */}
              <IconBtn
                text={loading ? 'Uploading...' : 'Upload'}
                onclick={handleFileUpload}
              >
                {!loading && (
                  <FiUpload className="text-lg text-[var(--color-richblack-900)]" />
                )}
              </IconBtn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
