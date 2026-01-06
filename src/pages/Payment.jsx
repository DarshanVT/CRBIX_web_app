import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, Lock } from "lucide-react";

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const selectedCourses = state?.courses || [];
  const totalAmount = state?.total || 0;

  if (selectedCourses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No courses selected.</p>
      </div>
    );
  }

  const handlePaymentSuccess = () => {
    // 👉 First purchased course
    const firstCourseId = selectedCourses[0].id;

    // later yaha backend payment verify hoga
    alert("Payment Successful 🎉");

    // 👉 Course Details Page redirect
    navigate(`/course/${firstCourseId}`, {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PAYMENT FORM */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CreditCard /> Payment Details
          </h2>

          <div className="space-y-4">
            <input className="w-full border px-4 py-3 rounded-lg" placeholder="Cardholder Name" />
            <input className="w-full border px-4 py-3 rounded-lg" placeholder="Card Number" />

            <div className="grid grid-cols-2 gap-4">
              <input className="border px-4 py-3 rounded-lg" placeholder="MM / YY" />
              <input className="border px-4 py-3 rounded-lg" placeholder="CVV" />
            </div>

            <button
              onClick={handlePaymentSuccess}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Lock size={18} /> Pay ₹{totalAmount}
            </button>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-xl p-6 shadow h-fit">
          <h3 className="font-semibold text-lg mb-4">Purchased Courses</h3>

          {selectedCourses.map((c) => (
            <div key={c.id} className="flex justify-between text-sm mb-2">
              <span className="line-clamp-1">{c.title}</span>
              <span>₹{c.price}</span>
            </div>
          ))}

          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
