import api from "./api";

export const getPlacementJobs = async () => {
  try {
    const response = await api.get("/placements");
    return response.data;
  } catch (error) {
    console.error("Error fetching placements:", error);
    return [
      {
        id: 1,
        title: "Frontend Developer",
        company: "Tech Corp",
        location: "Remote",
        salary: "$80,000 - $120,000",
        type: "Full-time",
        postedDate: "2024-01-10",
        description: "Looking for React developer with 2+ years experience",
      },
      {
        id: 2,
        title: "Backend Developer",
        company: "Software Inc",
        location: "New York, NY",
        salary: "$90,000 - $130,000",
        type: "Full-time",
        postedDate: "2024-01-12",
        description: "Java Spring Boot developer needed",
      },
    ];
  }
};