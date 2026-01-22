import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, Lock } from "lucide-react";
import { purchaseCourse } from "../Api/course.api";
import { useAuth } from "../components/Login/AuthContext";

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user, isAuthenticated, openLogin } = useAuth();

  const selectedCourses = state?.courses || [];
  const totalAmount = state?.total || 0;

  if (!isAuthenticated) {
    openLogin();
    return null;
  }

  if (selectedCourses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">No courses selected.</p>
      </div>
    );
  }

  /* ---------------- PAYMENT SUCCESS ---------------- */

  const handlePaymentSuccess = async () => {
    try {
      for (const course of selectedCourses) {
        const res = await purchaseCourse(user.id, course.id);

        if (!res.success && res.message !== "Purchase successful") {
          throw new Error(res.message || "Purchase failed");
        }
      }

      alert("Payment Successful 🎉");

      navigate(`/course/${selectedCourses[0].id}`, { replace: true });
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PAYMENT FORM */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow dark:shadow-gray-900/50">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
            <CreditCard className="text-gray-700 dark:text-gray-300" /> Payment Details
          </h2>

          <div className="space-y-4">
            <input
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Cardholder Name"
            />
            <input
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Card Number"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                className="border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="MM / YY"
              />
              <input
                className="border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="CVV"
              />
            </div>

            <button
              onClick={handlePaymentSuccess}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Lock size={18} /> Pay ₹{totalAmount}
            </button>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow dark:shadow-gray-900/50 h-fit">
          <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Purchased Courses</h3>

          {selectedCourses.map((c) => (
            <div key={c.id} className="flex justify-between text-sm mb-2 text-gray-700 dark:text-gray-300">
              <span className="line-clamp-1">{c.title}</span>
              <span>₹{c.price}</span>
            </div>
          ))}

          <div className="border-t border-gray-300 dark:border-gray-700 mt-4 pt-4 flex justify-between font-bold text-gray-800 dark:text-white">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}