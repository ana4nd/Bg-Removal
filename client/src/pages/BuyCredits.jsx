import React from "react";
import { assets, plans } from "../assets/assets";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";

const BuyCredits = () => {
  const { backendUrl, loadCreditsData } = useContext(AppContext);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const initPay = async (order) => {
    if (!window.Razorpay) {
      toast.error("Razorpay not loaded");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credit Purchase",
      description: "Buying credits",
      order_id: order.id, // very important!
      handler: async (response) => {
        console.log("Payment success:", response);
        toast.success("Payment completed!");

        // Optional: verify payment & update user credits
        try {
          const token = await getToken();
          const verify = await axios.post(
            `${backendUrl}/api/user/verify-razor`,
            response,
            { headers: { token } }
          );

          if (verify.data.success) {
            toast.success("Credits added successfully!");
            await loadCreditsData();
          } else {
            toast.error("Payment verification failed");
          }
        } catch (err) {
          toast.error("Error verifying payment");
        }
      },
      prefill: {
        name: "Anand",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#6366f1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentRazorpay = async (planId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/pay-razor`,
        { planId },
        { headers: { token } }
      );

      console.log("Order created:", data.order);

      if (data.success) {
        console.log("data from backend:", data);
        initPay(data.order);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-[75vh] text-center pt-14 mb-10">
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our Plans
      </button>

      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-bold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent mb-6 sm:mb-10">
        Choose the plan that's right for you
      </h1>

      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-700 hover:scale-105 transition-all duration-500"
            key={index}
          >
            <img width={40} src={assets.logo_icon} alt="" />
            <p className="mt-3 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">${item.price}</span>/
              {item.credits} credits
            </p>
            <button
              onClick={() => paymentRazorpay(item.id)}
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52"
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyCredits;
