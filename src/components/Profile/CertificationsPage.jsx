// src/pages/CertificationsPage.jsx - FIXED VERSION
import { useState, useEffect } from "react";
import { getUserCertificates } from "../../Api/certificates.api";
import { HiDownload, HiShare, HiCheckCircle, HiStar, HiAcademicCap } from "react-icons/hi";

export default function CertificationsPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("John Smith");

  useEffect(() => {
    fetchCertificates();
    // Fetch user name from localStorage or profile
    const storedName = localStorage.getItem('user_name') || "John Smith";
    setUserName(storedName);
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await getUserCertificates();
      setCertificates(data);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (certificateId) => {
    // Generate and download certificate as PDF (frontend-only)
    alert(`Downloading certificate ${certificateId}`);
    // In a real implementation, you would generate a PDF here
  };

  const handleShare = (certificateId) => {
    // Share certificate functionality
    const shareUrl = `${window.location.origin}/certificate/${certificateId}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Certificate link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="max-w-8xl mx-auto p-6 bg-[#eaf9ff] min-h-screen">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto p-6 bg-[#eaf9ff] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Certifications</h1>
        <p className="text-gray-600 mt-2">
          Your earned certificates from completed courses
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <HiAcademicCap className="text-4xl text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No Certificates Yet
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Complete a course to 100% to earn your first certificate. 
            Your certificates will appear here automatically once you finish a course.
          </p>
          <button 
            onClick={() => window.location.href = "/my-courses"}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View My Courses
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-700">
              <span className="font-semibold">{certificates.length}</span> certificate(s) earned
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiCheckCircle className="text-green-500" />
              <span>All courses completed to 100%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Certificate Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{cert.courseTitle}</h3>
                      <p className="text-blue-200 text-sm">Course Completion Certificate</p>
                    </div>
                    <HiCheckCircle className="text-2xl text-green-300" />
                  </div>
                </div>

                {/* Certificate Body */}
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-full mb-4">
                      <HiStar className="text-3xl text-yellow-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-600 mb-2">CONGRATULATIONS!</h2>
                    <p className="text-gray-600 mb-4">This certificate is awarded to</p>
                    
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-gray-800 py-2 px-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg inline-block">
                        {userName}
                      </div>
                    </div>

                    <p className="text-gray-600">for successfully completing</p>
                    <div className="mt-2">
                      <div className="text-xl font-bold text-blue-600">{cert.courseTitle}</div>
                      <p className="text-gray-500 text-sm mt-1">Instructor: {cert.instructor}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <div>
                        <p className="font-medium">Certificate ID</p>
                        <p className="font-mono">{cert.certificateId}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Date Issued</p>
                        <p>{new Date(cert.issueDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(cert.certificateId)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <HiDownload />
                        Download
                      </button>
                      <button
                        onClick={() => handleShare(cert.certificateId)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <HiShare />
                        Share
                      </button>
                    </div>
                  </div>
                </div>

                {/* Certificate Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Progress: <span className="font-bold text-green-600">100%</span>
                    </span>
                    <span className="text-xs text-gray-500">
                      Valid ✓
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}