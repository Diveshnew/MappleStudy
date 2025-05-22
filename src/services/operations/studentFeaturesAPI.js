import { toast } from 'react-hot-toast';
import { studentEndpoints } from '../apis';
import { apiConnector } from '../apiconnector';
import rzpLogo from '../../assets/Logo/rzp_logo.png';
import { setPaymentLoading } from '../../slices/courseSlice';
import { resetCart } from '../../slices/cartSlice';

// Destructuring API endpoints
const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

// Utility function to dynamically load Razorpay SDK script
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

// Function to initiate course purchase flow
export async function buyCourse(
  token,
  courses,
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading('Loading...');
  try {
    // Load Razorpay SDK script
    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js'
    );

    // Show error if script fails to load
    if (!res) {
      toast.error('RazorPay SDK failed to load');
      return;
    }

    // Create payment order via backend
    const orderResponse = await apiConnector(
      'POST',
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    // Handle unsuccessful order creation
    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    console.log('PRINTING orderResponse', orderResponse);

    // Configuration options for Razorpay checkout
    const options = {
      key: process.env.RAZORPAY_KEY,
      currency: orderResponse.data.message.currency,
      amount: `${orderResponse.data.message.amount}`,
      order_id: orderResponse.data.message.id,
      name: 'MappleStudy',
      description: 'Thank You for Purchasing the Course',
      image: rzpLogo,
      prefill: {
        name: `${userDetails.firstName}`,
        email: userDetails.email,
      },
      handler: function (response) {
        // Send payment success email
        sendPaymentSuccessEmail(
          response,
          orderResponse.data.message.amount,
          token
        );
        // Verify payment and enroll user
        verifyPayment({ ...response, courses }, token, navigate, dispatch);
      },
    };

    // Open Razorpay checkout
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    // Handle payment failure case
    paymentObject.on('payment.failed', function (response) {
      toast.error('oops, payment failed');
      console.log(response.error);
    });
  } catch (error) {
    console.log('PAYMENT API ERROR.....', error);
    toast.error('Could not make Payment');
  }
  toast.dismiss(toastId);
}

// Function to send payment success confirmation email
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      'POST',
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log('PAYMENT SUCCESS EMAIL ERROR....', error);
  }
}

// Function to verify payment and enroll user to course
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading('Verifying Payment....');
  dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector('POST', COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

    // Handle failed payment verification
    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success('payment Successful, ypou are addded to the course');
    navigate('/dashboard/enrolled-courses');
    dispatch(resetCart()); // Clear cart after successful payment
  } catch (error) {
    console.log('PAYMENT VERIFY ERROR....', error);
    toast.error('Could not verify Payment');
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}
