import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/cdaxxlogo.png";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { HiOutlineShoppingCart } from "react-icons/hi";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Search:", search);
  };

  return (
    <header className="sticky top-0 z-50 w-full ">
      <div
        className={`transition-all duration-300 border-b border-black/20 ${
          scrolled ? "bg-[#eaf9ff]" : "bg-[#eaf9ff] shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-2 py- flex items-center gap-6">
          {/* LEFT */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="CDAXX" className="h-16 w-auto" />
          </Link>

          {/* CENTER */}
          <div className="hidden md:flex flex-1 items-center gap-6">
            <Link
              to="/explore-courses"
              className="text-gray-700 font-medium hover:text-black whitespace-nowrap"
            >
              Explore
            </Link>

            <form onSubmit={handleSearch} className="relative flex-1">
              <input
                type="text"
                placeholder="Search for anything"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-600"
              >
                Search
              </button>
            </form>

            <Link
              to="/plans-pricing"
              className="text-gray-700 font-medium hover:text-black whitespace-nowrap"
            >
              Plans & Pricing
            </Link>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/cart">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-300 text-sm font-medium hover:bg-gray-100"
              >
                <HiOutlineShoppingCart size={18} />
                Cart
              </motion.button>
            </Link>

            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full border border-blue-500 text-blue-500 font-medium hover:bg-blue-50"
              >
                Login
              </motion.button>
            </Link>

            <Link to="/signin">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="px-4 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600"
              >
                Sign up
              </motion.button>
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-4 border-t">
            <Link to="/explore-courses" onClick={() => setMenuOpen(false)}>
              Explore
            </Link>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-full border"
              />
            </form>

            <Link to="/plans-pricing" onClick={() => setMenuOpen(false)}>
              Plans & Pricing
            </Link>

            <Link to="/cart" onClick={() => setMenuOpen(false)}>
              Cart
            </Link>

            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>

            <Link
              to="/signin"
              className="block bg-blue-500 text-white text-center py-2 rounded-full"
              onClick={() => setMenuOpen(false)}
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
