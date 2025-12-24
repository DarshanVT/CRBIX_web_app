import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/navbar";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function CdaxBusinessDemo() {
     useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <Navbar />

            <section className="w-full px-10 md:px-20 py-24 flex flex-col md:flex-row justify-between gap-20">

                {/* LEFT CONTENT */}
                <motion.div
                    className="md:w-1/2"
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <motion.h1
                        className="text-5xl font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Get your demo
                    </motion.h1>

                    <motion.p
                        className="text-gray-700 text-lg mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        Tell us your needs and we’ll start on a custom plan to drive results.
                    </motion.p>

                    <div className="flex flex-col gap-4 text-lg text-gray-700 mb-12">

                        {[
                            "Train your entire workforce with over 30,000+ courses in 16 languages",
                            "Prep employees for over 200 industry-recognized certification exams",
                            "Develop highly skilled tech teams in real-world practice environments",
                            "Identify skill gaps and track learning progress with benchmarks",
                            "Integrate with your existing learning management system"
                        ].map((text, idx) => (
                            <motion.div
                                key={idx}
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-green-600 text-xl">✔</span>
                                {text}
                            </motion.div>
                        ))}

                    </div>

                    {/* TRUST SECTION */}
                    <motion.section
                        className="py-10 bg-white border rounded-xl shadow-md"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <motion.p
                            className="text-center text-gray-500 mb-6 text-sm"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            Trusted by learners at top companies worldwide
                        </motion.p>

                        <motion.div
                            className="flex justify-center items-center gap-6 md:gap-10 opacity-60"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 0.6, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >

                            {[
                                "https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png",
                                "https://logos-world.net/wp-content/uploads/2020/04/Microsoft-Logo.png",
                                "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png",
                                "https://logos-world.net/wp-content/uploads/2021/02/Meta-Logo.png"
                            ].map((src, i) => (
                                <motion.img
                                    key={i}
                                    src={src}
                                    className="h-7 grayscale"
                                    loading="lazy"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.12, filter: "grayscale(0%)" }}
                                    transition={{ duration: 0.4, delay: i * 0.15 }}
                                />
                            ))}

                        </motion.div>
                    </motion.section>

                </motion.div>

                {/* RIGHT FORM */}
                <motion.div
                    className="md:w-1/2 bg-white shadow-xl p-10 rounded-2xl border"
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <motion.form
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >

                        <motion.input
                            className="border p-3 rounded-lg"
                            placeholder="First Name *"
                            whileFocus={{ scale: 1.02 }}
                        />

                        <motion.input
                            className="border p-3 rounded-lg"
                            placeholder="Last Name *"
                            whileFocus={{ scale: 1.02 }}
                        />

                        <motion.input
                            className="border p-3 rounded-lg md:col-span-2"
                            placeholder="Work Email *"
                            whileFocus={{ scale: 1.02 }}
                        />

                        <motion.input
                            className="border p-3 rounded-lg md:col-span-2"
                            placeholder="Phone Number *"
                            whileFocus={{ scale: 1.02 }}
                        />

                        <select className="border p-3 rounded-lg md:col-span-2" aria-label="location">
                            <option>Where are you located? *</option>
                        </select>

                        <input
                            className="border p-3 rounded-lg md:col-span-2"
                            placeholder="Company Name *"
                        />

                        <select className="border p-3 rounded-lg" aria-label="Company Size">
                            <option>Company Size *</option>
                        </select>

                        <select className="border p-3 rounded-lg" aria-label="People to train">
                            <option>Number of people to train *</option>
                        </select>

                        <select className="border p-3 rounded-lg" aria-label="Job Title">
                            <option>Job Title *</option>
                        </select>

                        <select className="border p-3 rounded-lg" aria-label="Job Level">
                            <option>Job Level *</option>
                        </select>

                        <textarea
                            className="border p-3 rounded-lg md:col-span-2"
                            placeholder="What are your organization’s training needs?"
                            rows={4}
                        />

                        <motion.button
                            className="md:col-span-2 bg-black text-white py-3 rounded-lg text-lg hover:bg-gray-900 transition"
                            whileHover={{ scale: 1.05 }}
                        >
                            Submit Form
                        </motion.button>

                    </motion.form>
                </motion.div>

            </section>

            <Footer />
        </>
    );
}
