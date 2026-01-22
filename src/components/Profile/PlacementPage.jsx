import { useState, useEffect } from "react";
import { getPlacementJobs } from "../../Api/placement.api";
import { HiBriefcase, HiLocationMarker, HiCurrencyDollar, HiCalendar } from "react-icons/hi";

export default function PlacementPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getPlacementJobs();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = filter === "all" 
    ? jobs 
    : jobs.filter(job => job.type?.toLowerCase() === filter.toLowerCase());

  if (loading) {
    return (
      <div className="max-w-8xl mx-auto p-6 bg-[#eaf9ff] dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto p-6 bg-[#eaf9ff] dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Placement Opportunities</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Job opportunities and career placements for our learners
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/50 p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "all"
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setFilter("full-time")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "full-time"
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Full Time
          </button>
          <button
            onClick={() => setFilter("part-time")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "part-time"
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Part Time
          </button>
          <button
            onClick={() => setFilter("internship")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "internship"
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Internship
          </button>
        </div>

        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <HiBriefcase className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No job opportunities available</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-gray-900/70 transition-all bg-white dark:bg-gray-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{job.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <HiBriefcase />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiLocationMarker />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiCurrencyDollar />
                        {job.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiCalendar />
                        {job.postedDate}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job.type === "Full-time"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                        : job.type === "Part-time"
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400"
                        : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                    }`}>
                      {job.type}
                    </span>
                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Career Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Resume Review</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Get expert feedback on your resume</p>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
              Schedule Session →
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Mock Interviews</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Practice with industry experts</p>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
              Book Interview →
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Career Counseling</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Personalized career guidance</p>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
              Get Guidance →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}