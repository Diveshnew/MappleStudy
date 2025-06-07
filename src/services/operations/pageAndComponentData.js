// Importing the toast utility from react-hot-toast to show loading and error notifications
import { toast } from 'react-hot-toast';
// Custom API helper for making HTTP requests
import { apiConnector } from '../apiconnector';
// Object containing endpoint URLs related to the catalog
import { catalogData } from '../apis';

// Asynchronous function to fetch catalog page data for a given category
export const getCatalogPageData = async (categoryId) => {
  // Display a non-blocking “Loading…” notification and store its ID to dismiss later
  const toastId = toast.loading('Loading...');
  // Placeholder for the API response we’ll ultimately return
  let result = {};

  try {
    // Make a POST request to the catalog-page-data endpoint with the selected category ID
    const response = await apiConnector(
      'POST',
      catalogData.CATALOGPAGEDATA_API,
      { categoryId: categoryId }
    );
    // Extract server data from the response object
    result = response.data;
    // Ensure we always have an explicit success flag for downstream checks
    if (typeof result.success === 'undefined') {
      result.success = true;
    }
  } catch (error) {
    // Log the error for debugging
    console.log('CATALOG PAGE DATA API ERROR....', error);
    // Show a toast with the error message to inform the user
    toast.error(error.message);
    // If the server returned data in the error response, use it; otherwise fall back to an empty object
    result = error.response?.data || {};
    // Explicitly mark the operation as failed
    result.success = false;
  } finally {
    // Dismiss the loading toast whether the request succeeded or failed
    toast.dismiss(toastId);
  }

  // Return either the successful response or the error object with a success flag
  return result;
};
