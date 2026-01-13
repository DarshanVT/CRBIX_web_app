// src/pages/PlacementPage.jsx
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
      <div className="max-w-6xl mx-auto p-6 bg-[#eaf9ff] min-h-screen">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto p-6 bg-[#eaf9ff] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Placement Opportunities</h1>
        <p className="text-gray-600 mt-2">
          Job opportunities and career placements for our learners
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setFilter("full-time")}
            className={`px-4 py-2 rounded-lg ${
              filter === "full-time"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Full Time
          </button>
          <button
            onClick={() => setFilter("part-time")}
            className={`px-4 py-2 rounded-lg ${
              filter === "part-time"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Part Time
          </button>
          <button
            onClick={() => setFilter("internship")}
            className={`px-4 py-2 rounded-lg ${
              filter === "internship"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Internship
          </button>
        </div>

        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <HiBriefcase className="text-5xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No job opportunities available</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                        ? "bg-blue-100 text-blue-800"
                        : job.type === "Part-time"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {job.type}
                    </span>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Career Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">Resume Review</h3>
            <p className="text-gray-600 mb-4">Get expert feedback on your resume</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Schedule Session →
            </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">Mock Interviews</h3>
            <p className="text-gray-600 mb-4">Practice with industry experts</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Book Interview →
            </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">Career Counseling</h3>
            <p className="text-gray-600 mb-4">Personalized career guidance</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Get Guidance →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}