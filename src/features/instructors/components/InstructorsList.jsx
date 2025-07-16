import React, { useEffect, useState } from "react";
import { getVerifiedTeachers } from "../api/instructorsApi";
import "../styles/InstructorsList.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { FaMedal } from "react-icons/fa"; // Import medal icon
import HeaderPages from "../../../shared/components/HeaderPages";

const InstructorsList = () => {
  const [instructors, setInstructors] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await getVerifiedTeachers();
        setInstructors(data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    fetchInstructors();
  }, []);

  return (
    <>
          <HeaderPages title={"Instructors"} />

    <div className="instructors-list" style={{minHeight: "100vh"}}>
      <div className="instructors-list-grid">
        {instructors.map((instructor) => (
          <div
            key={instructor._id}
            className="instructors-list-card"
            onClick={() => navigate(`/instructor/${instructor._id}`)}
          >
            <div className="instructors-list-image-container">
              <img
                src={
                  instructor.profileImage ||
                  "https://courssat.com/assets/images/home/avatar.png"
                }
                alt={instructor.firstName}
                className="instructors-list-image"
              />
            </div>
            <h2 className="instructors-list-name">
              {instructor.firstName} {instructor.lastName}
              <FaMedal className="instructors-list-medal-icon" />
            </h2>
            <h3 className="instructors-list-major">
              {instructor.major !== "Not specified"
                ? instructor.major
                : "Major not specified"}
            </h3>
            <p className="instructors-list-bio">
              {instructor.bio && instructor.bio !== "Not provided"
                ? instructor.bio
                : "This instructor has not provided a bio."}
            </p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default InstructorsList;
