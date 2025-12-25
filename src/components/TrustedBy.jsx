import { motion } from "framer-motion";

export default function TrustedBy() {
  return (
    <section className=" pt-10 pb-10   border-gray-100">
      <div className="container mx-auto px-4">

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
          className="flex justify-center items-center gap-10 md:gap-14 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {[
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
              alt: "Google",
            },
            {
              src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/500px-Microsoft_logo.svg.png",
              alt: "Microsoft",
            },
            {
              src: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png",
              alt: "Amazon",
            },
            {
              src: "https://pngimg.com/d/meta_PNG5.png",
              alt: "Meta",
            },
          ].map((logo, i) => (
            <motion.img
              key={i}
              src={logo.src}
              alt={logo.alt}
              className="h-7 md:h-8"
              loading="lazy"
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.08 }}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}
