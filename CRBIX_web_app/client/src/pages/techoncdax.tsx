import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/navbar";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect } from "react";

export default function TechOnCdax() {
      useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <Navbar />

            <section
                className="w-full min-h-[90vh] flex items-center px-10 md:px-20 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://s.udemycdn.com/teaching/billboard-desktop-v4.jpg')",
                }}
            >
                <motion.div
                    className="max-w-xl text-gray-900"
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h1 className="text-6xl font-bold leading-tight mb-6 drop-shadow-xl">
                        Come teach <br /> with us
                    </h1>

                    <p className="text-xl mb-10 drop-shadow-xl">
                        Become an instructor and change lives — including your own
                    </p>

                    <motion.button
                        className="bg-brand-dark px-8 py-4 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 transition shadow-lg"
                        whileHover={{ scale: 1.05 }}
                    >
                        Get started
                    </motion.button>
                </motion.div>
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
            <Footer />
        </>
    );
}
