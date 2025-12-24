import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Navbar from "@/components/ui/navbar";
import { useLocation } from "wouter";
import AnimatedWave from "@/components/ui/AnimatedWave";
import Tilt from "react-parallax-tilt";
import Footer from "@/components/ui/Footer";
import { useState } from "react";
import AuthModal from "@/components/ui/AuthModal";
import CourseSection from "@/component/CourseSection";


export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false);

  const handleCourseClick = (id: number) => {
    const user = localStorage.getItem("user");
    if (!user) {
      setAuthOpen(true); 
    } else {
      setLocation(`/course/${id}`);
    }
  };
  const courses = [
    {
      id: 1,
      title: "Flutter Development Course",
      author: "A. A. Bakshi",
      rating: 4.8,
      reviews: "3,587",
      price: "₹299",
      oldPrice: "₹499",
      image:
        "https://images.unsplash.com/photo-1617042375876-a13e36732a04?w=500&q=80",
      tag: "Bestseller",
    },
    {
      id: 2,
      title: "The Complete 2026 Web Development",
      author: "A. A. Bakshi",
      rating: 4.9,
      reviews: "12,400",
      price: "₹299",
      oldPrice: "₹499",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80",
      tag: "Bestseller",
    },
    {
      id: 3,
      title: "Machine Learning A-Z™: AI, Python & R",
      author: "A. A. Bakshi",
      rating: 4.5,
      reviews: "8,900",
      price: "₹299",
      oldPrice: "₹499",
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&q=80",
      tag: "New",
    },
    {
      id: 4,
      title: "React - The Complete Guide 2024",
      author: "Maximilian Schwarzmüller",
      rating: 4.7,
      reviews: "5,200",
      price: "₹299",
      oldPrice: "₹499",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=80",
      tag: "New",
    },
  ];

  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen font-serif text-brand-text relative">
      {/* FLOATING GLOWS */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-purple-500/30 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="fixed bottom-10 right-10 w-72 h-72 bg-blue-500/20 blur-[140px] rounded-full animate-pulse-slow"></div>

      <Navbar />


      {/* HERO SECTION */}
      <section className="relative w-full h-[105vh] overflow-hidden">
        {/* BG Gradient */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-gradient-to-br 
      from-[#6A11FF]/80 
      via-[#4B8BFF]/80 
      to-[#1E3A8A]/80
      blur-[150px]"
          ></div>
        </div>

        <AnimatedWave />

        {/* TEXT INSIDE THE WAVES AREA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-10 
             w-full max-w-xl text-center px-6 z-20"
        >
          <h2 className="text-2xl font-bold text-black  mb-">
            You haven’t enrolled in any courses yet
          </h2>

          <p className="text-gray-700 max-w-sm mx-auto mb-4">
            Start learning new skills today. Browse our top-rated courses curated just for you.
          </p>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-brand-dark text-white px-6 py-3 rounded-md font-bold shadow-md mb-14"
          >
            Browse Courses
          </motion.button>
        </motion.div>



        <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center px-10 relative">

          {/* LEFT SIDE FLOATING CARD */}
          <motion.div
            className="space-y-4 mb-70"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >

            <motion.h1
              className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Learn Without
              <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 bg-clip-text text-transparent block">
                Limits
              </span>
            </motion.h1>

            <motion.p
              className="text-0xl text-gray-600 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              Master in-demand skills with expert-led courses. From coding to design, advance your career with hands-on learning.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <motion.button
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Learning Today
              </motion.button>
              <motion.button
                className="border-2 border-purple-600 text-purple-600 px-4 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Courses
              </motion.button>
            </motion.div>
          </motion.div>

          {/*  RIGHT SIDE IMAGE (NEW ADDED) */}
          <motion.div
            className="hidden md:flex justify-center items-center"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: false }}
            whileHover={{ scale: 1.03 }}
          >
            <motion.img
              src="/assets/herosection.webp" 
              alt="Hero Illustration"
              className="w-[70%] drop-shadow-2xl rounded-xl mb-70"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

        </div>

      </section>
      <CourseSection />
      
      {/* Categories Section */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-xl font-bold font-serif text-brand-text mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >Top Categories</motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Design",
              "Development",
              "Marketing",
              "IT and Software",
              "Personal Development",
              "Business",
              "Photography",
              "Music",
            ].map((cat, index) => (
              <motion.div
                key={cat}
                className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer font-medium text-brand-text text-center hover:scale-105"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -2 }}
              >
                {cat}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RECOMMENDED COURSES */}
      <section className="py-12 container mx-auto px-6">
        <motion.h3
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2"
        >
          Recommended for you
        </motion.h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false }}
            >
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03}>
                <div
                  className="group flex flex-col h-full cursor-pointer bg-white p-3 rounded-xl shadow-md hover:shadow-2xl transition-shadow"
                  onClick={() => handleCourseClick(course.id)}
                >
                  <div className="relative overflow-hidden rounded-lg mb-3 shadow-sm">
                    <img
                      src={course.image}
                      alt=""
                      className="w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h4 className="font-bold text-brand-text line-clamp-2 mb-1">
                      {course.title}
                    </h4>

                    <p className="text-xs text-gray-500 mb-1">
                      {course.author}
                    </p>

                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-bold text-sm text-brand-dark">
                        {course.rating}
                      </span>

                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i <= Math.round(course.rating)
                              ? "fill-current"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>

                      <span className="text-xs text-gray-400">
                        ({course.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-auto">
                      <span className="font-bold text-lg text-gray-900">
                        {course.price}
                      </span>
                      <span className="line-through text-sm text-gray-400">
                        {course.oldPrice}
                      </span>
                    </div>

                    {course.tag && (
                      <span className="mt-2 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-sm uppercase">
                        {course.tag}
                      </span>
                    )}
                  </div>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </section>
       {/* AUTH MODAL */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <motion.p
            className="text-center text-gray-500 mb-8 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Trusted by learners at top companies worldwide
          </motion.p>
          <motion.div
            className="flex justify-center items-center gap-8 md:gap-12 opacity-60"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.img
              src="https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png"
              alt="Google"
              className="h-8 grayscale"
              loading="lazy"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, filter: "grayscale(0%)" }}
            />
            <motion.img
              src="https://logos-world.net/wp-content/uploads/2020/04/Microsoft-Logo.png"
              alt="Microsoft"
              className="h-8 grayscale"
              loading="lazy"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, filter: "grayscale(0%)" }}
            />
            <motion.img
              src="https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png"
              alt="Amazon"
              className="h-8 grayscale"
              loading="lazy"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, filter: "grayscale(0%)" }}
            />
            <motion.img
              src="https://logos-world.net/wp-content/uploads/2021/02/Meta-Logo.png"
              alt="Meta"
              className="h-8 grayscale"
              loading="lazy"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, filter: "grayscale(0%)" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >Why Choose CDaX?</motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >Experience learning like never before with our comprehensive platform designed for your success</motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📚",
                title: "Expert-Led Courses",
                description: "Learn from industry professionals with real-world experience and proven track records."
              },
              {
                icon: "🎯",
                title: "Hands-On Projects",
                description: "Build real projects that showcase your skills and add value to your professional portfolio."
              },
              {
                icon: "🏆",
                title: "Career Support",
                description: "Get job placement assistance, resume reviews, and interview preparation from our career experts."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -3 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >Student Success Stories</motion.h2>
            <motion.p
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >See how our students transformed their careers</motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Software Developer at Google",
                image: "https://randomuser.me/api/portraits/women/5.jpg",
                quote: "CDaX helped me transition from marketing to tech. The projects were challenging and the support was incredible!"
              },
              {
                name: "Michael Chen",
                role: "Data Scientist at Microsoft",
                image: "https://randomuser.me/api/portraits/men/6.jpg",
                quote: "The hands-on approach and real-world projects gave me the confidence to land my dream job in data science."
              },
              {
                name: "Emily Davis",
                role: "UX Designer at Amazon",
                image: "https://randomuser.me/api/portraits/women/7.jpg",
                quote: "From complete beginner to professional designer in 6 months. The mentorship made all the difference."
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-6 rounded-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="flex items-center mb-4">
                  <img src={story.image} alt={story.name} className="w-12 h-12 rounded-full mr-4" loading="lazy" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{story.name}</h4>
                    <p className="text-sm text-gray-600">{story.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{story.quote}"</p>
                <div className="flex mt-3 text-yellow-400">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CONTACT SECTION */}
      <motion.section
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: false }}
        className="py-16 bg-white border-t border-gray-200"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-brand-text mb-4">
                Contact Us
              </h2>

              <p className="text-gray-600 leading-relaxed max-w-md">
                Have questions or need support? Our team is always here to help.
              </p>

              <div className="mt-8 text-gray-700 space-y-2">
                <p className="font-semibold">CDaX Learning Pvt Ltd</p>
                <p>+91 987xxxxxxx</p>
                <p>info@crbix.in</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl shadow-sm border w-full">
              <form className="grid grid-cols-1 gap-6">
                <input
                  type="text"
                  placeholder="Name"
                  className="p-3 border rounded-md focus:ring-2 focus:ring-brand-dark"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="p-3 border rounded-md focus:ring-2 focus:ring-brand-dark"
                />
                <textarea
                  rows={4}
                  placeholder="Message"
                  className="p-3 border rounded-md focus:ring-2 focus:ring-brand-dark"
                ></textarea>

                <button className="bg-brand-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.section>
      {/* FOOTER ADDED HERE */}
      <Footer />
    </div>
  );
}
