import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../Login/AuthContext";
import { getDashboardCourses } from "../../Api/course.api";

const ProfileContext = createContext();

const DUMMY_STREAKS = [
  true,
  true,
  false,
  true,
  true,
  true,
  false,
  true,
  false,
  true,
  true,
  false,
  true,
  true,
];

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState(null);
  const [streaks, setStreaks] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const capitalize = (str = "") =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  

const fetchProfile = async () => {
  if (!isAuthenticated || !user) return;

  setLoading(true);

  const userId = user.id || user._id;

  setProfile({
    id: userId,
    name: `${capitalize(user.firstName)} ${capitalize(user.lastName)}`,
    email: user.email,
    phone: user.phoneNumber || "",
    subscribed: false,
  });

  // 🔥 DIRECT SET
  const courses = await getDashboardCourses(userId);
  console.log("DASHBOARD COURSES 👉", courses);
  const enrolled = courses.filter(c => c.isSubscribed === true);
setEnrolledCourses(enrolled);

  setStreaks(DUMMY_STREAKS);
  setLoading(false);
};



  const clearProfile = () => {
    setProfile(null);
    setStreaks([]);
    setEnrolledCourses([]);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  
  return (
    <ProfileContext.Provider
      value={{
        profile,
        streaks,
        enrolledCourses,
        loading,
        fetchProfile,
        clearProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
