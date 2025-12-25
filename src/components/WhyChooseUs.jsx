export default function WhyChooseUs() {
  return (
    <section className="py-16 px-4">
      {/* CENTERED BLOCK */}
      <div className="max-w-7xl mx-auto bg-[#2E3133] text-white rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {["Live Mentors", "Real Projects", "Career Support", "Certificates"].map(
            (item) => (
              <div
                key={item}
                className="bg-white/10 p-6 rounded-xl text-center  transition-all duration-300
  hover:scale-105
  hover:shadow-[0_0_20px_#eaf9ff]"
              >
                <h3 className="font-semibold">{item}</h3>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
