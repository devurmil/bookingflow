export const openRazorpay = ({ amount, serviceName, onSuccess }) => {
    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount * 100, // paise
        currency: "INR",

        name: import.meta.env.VITE_RAZORPAY_NAME || "BookingFlow",
        description: serviceName,
        image: "/logo.png",

        handler: function (response) {
            console.log("Payment Success:", response);
            onSuccess(response);
        },

        prefill: {
            name: "Test User",
            email: import.meta.env.VITE_RAZORPAY_EMAIL,
            contact: import.meta.env.VITE_RAZORPAY_MOBILE,
        },

        notes: {
            serviceName,
        },

        theme: {
            color: "#3b82f6",
        },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
};
