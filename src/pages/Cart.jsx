import { motion } from "framer-motion";
import { Star, Trash2 } from "lucide-react";
import { useCart } from "../components/CartContext";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const navigate = useNavigate();

  const selectedTotal = cart
    .filter((c) => selectedCourses.includes(c.id))
    .reduce((sum, c) => sum + Number(c.price), 0);

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price),
    0
  );

  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") setCheckoutOpen(false);
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>

      {cart.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center shadow">
          <p className="text-gray-500 text-lg">Your cart is empty 🛒</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 flex gap-4 shadow"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-40 h-28 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h2 className="font-semibold line-clamp-2">{course.title}</h2>
                  <p className="text-sm text-gray-500">{course.author}</p>

                  <div className="flex items-center gap-1 text-sm mt-1">
                    <span className="text-yellow-600 font-semibold">
                      {course.rating}
                    </span>
                    <Star size={14} fill="#fbbf24" stroke="none" />
                    <span className="text-gray-400">({course.reviews})</span>
                  </div>

                  {course.badge && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                      {course.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-between items-end">
                  <p className="font-bold">₹{course.price}</p>
                  <button
                    onClick={() => removeFromCart(course.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl p-6 shadow h-fit">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Total Courses</span>
              <span>{cart.length}</span>
            </div>

            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total Price</span>
              <span>₹{totalPrice}</span>
            </div>

            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {checkoutOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => {
              setCheckoutOpen(false);
              setSelectedCourses([]);
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="bg-white w-[90%] max-w-lg rounded-xl p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Select Courses to Buy</h2>

                <button
                  onClick={() => {
                    setCheckoutOpen(false);
                    setSelectedCourses([]);
                  }}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {cart.map((course) => {
                  const checked = selectedCourses.includes(course.id);

                  return (
                    <div
                      key={course.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                        checked ? "border-blue-500 bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        setSelectedCourses((prev) =>
                          checked
                            ? prev.filter((id) => id !== course.id)
                            : [...prev, course.id]
                        );
                      }}
                    >
                      <div>
                        <p className="font-semibold text-sm">{course.title}</p>
                        <p className="text-xs text-gray-500">₹{course.price}</p>
                      </div>

                      {checked && (
                        <span className="text-blue-600 font-bold">✔</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 mb-2 flex justify-between items-center bg-gray-100 px-4 py-3 rounded-lg">
                <span className="text-sm font-medium text-gray-600">
                  Selected Courses Amount
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{selectedTotal}
                </span>
              </div>
              <button
                disabled={selectedCourses.length === 0}
                onClick={() => {
                  const coursesToPay = cart.filter((c) =>
                    selectedCourses.includes(c.id)
                  );

                  navigate("/payment", {
                    state: {
                      courses: coursesToPay,
                      total: selectedTotal,
                    },
                  });
                }}
                className={`mt-5 w-full py-3 rounded-lg font-semibold text-white ${
                  selectedCourses.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
