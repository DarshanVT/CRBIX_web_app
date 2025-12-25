import hero1 from "../assets/hero/7.jpg";

export default function BuildProject() {
  return (
    <section className="py-16 px-4">
      {/* CENTERED BLOCK */}
      <div className="max-w-7xl mx-auto bg-[#2E3133] text-white rounded-2xl p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          
          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Build Job-Ready Skills for the Future
            </h1>

            <p className="text-gray-300 mb-6">
              Learn Java, AI, Cloud & more with real-world projects and mentorship.
            </p>

            <div className="flex gap-4">
              <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                Explore Courses
              </button>

              <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition">
                Talk to Expert
              </button>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          
          <img src={hero1} alt="hello" className="h-66 rounded-2xl bg-gradient-to-br shadow-[0_0_20px_#eaf9ff] " />
        </div>
      </div>
    </section>
  );
}
