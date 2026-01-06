import CourseCard from "./CourseCard";
// import java from "../assets/hero/java.png";
// import python from "../assets/hero/python.jpg";
// import AI_ML from "../assets/hero/AI_ML.jpg";
// import Flutter from "../assets/hero/flutter.png";
// import sql from "../assets/hero/sql.png";
// import powerBI from "../assets/hero/powerBI.jpg";
// import net from "../assets/hero/c#.png";
// import UI_UX from "../assets/hero/UI_UX.jpg";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { getCoursesForUser, getPublicCourses } from "../Api/course.api";


// const courses = [
//   {
//     id:1,
//     title: "Java Development",
//     author: "CDax Professional's",
//     rating: "4.6",
//     reviews: "9,420",
//     price: "299",
//     originalPrice: "1999",
//     badge: "Bestseller",
//     image: java,
//   },
//   {
//     id:2,
//     title: "Python Development",
//     author: "CDax Professional's",
//     rating: "4.5",
//     reviews: "5,843",
//     price: "299",
//     originalPrice: "1599",
//     badge: "Bestseller",
//     image: python,
//   },
//   {
//     id:3,
//     title: "Complete AI and ML course ",
//     author: "CDax Professional's",
//     rating: "4.8",
//     reviews: "3,207",
//     price: "499",
//     originalPrice: "3999",
//     badge: "Premium",
//     image: AI_ML,
//   },
//   {
//     id:4,
//     title: "Flutter Android Development",
//     author: "CDax Professional's",
//     rating: "4.3",
//     reviews: "1,982",
//     price: "299",
//     originalPrice: "1499",
//     badge: "Bestseller",
//     image: Flutter,
//   },
//   {
//     id:5,
//     title: "C# and .Net Development",
//     author: "CDax Professional's",
//     rating: "4.7",
//     reviews: "4,354",
//     price: "299",
//     originalPrice: "999",
//     badge: "Bestseller",
//     image: net,
//   },
//   {
//     id:6,
//     title: "UI/UX Development",
//     author: "CDax Professional's",
//     rating: "4.5",
//     reviews: "2,633",
//     price: "299",
//     originalPrice: "1999",
//     badge: "Bestseller",
//     image: UI_UX,
//   },
//   {
//     id:7,
//     title: "SQL ",
//     author: "CDax Professional's",
//     rating: "4.3",
//     reviews: "2,649",
//     price: "299",
//     originalPrice: "1999",
//     badge: "Bestseller",
//     image: sql,
//   },
//   {
//     id:8,
//     title: "Power BI",
//     author: "CDax Professional's",
//     rating: "4.6",
//     reviews: "4,377",
//     price: "299",
//     originalPrice: "799",
//     badge: "Bestseller",
//     image: powerBI,
//   },


//   //  AUTO GENERATED (id bhi auto)
//   ...Array(8).fill(null).map((_, i) => ({
//     id: i + 5,
//     title: `AI Course ${i + 5}`,
//     author: "Udemy Instructor",
//     rating: "4.6",
//     reviews: "1,200",
//     price: "449",
//     originalPrice: "1999",
//     badge: i % 2 === 0 ? "Bestseller" : "",
//     image:
//       "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?q=80&w=800",
//   })),
// ];


export default function CourseGridSection() {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = isAuthenticated
        ? await getCoursesForUser(user.id)
        : await getPublicCourses();

      // 🔥 MAP BACKEND DATA → UI DATA
      const mapped = data.map((c) => ({
        ...c,
        image:
          c.thumbnailUrl ||
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800",
        price: 299,              // temporary / static
        originalPrice: 1999,     // temporary
        rating: 4.6,
        reviews: "2,500",
        badge: c.purchased ? "Enrolled" : "Bestseller",
      }));

      setCourses(mapped);
    };

    load();
  }, [isAuthenticated, user?.id]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-3">
        Skills to transform your career and life
      </h2>
      <p className="text-gray-600 mb-10">
        From critical skills to technical topics, explore top courses.
      </p>

      {/* GRID 4 x 3 */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {courses.slice(0, 8).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div> */}

 <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-12">
        {courses.map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            index={index}
          />
        ))}
      </div>
      {/* Footer Link */}
      <p className="text-purple-700 font-semibold text-sm mt-10 cursor-pointer">
        Show all Artificial Intelligence (AI) courses →
      </p>
    </section>
  );
}
