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
      <div className="grid">
        {instructors.map((instructor) => (
          <div
            key={instructor._id}
            className="card"
            onClick={() => navigate(`/instructor/${instructor._id}`)} // Make the card clickable
          >
            <div className="image-container">
              <img
                src={
                  instructor.profileImage ||
                  "https://courssat.com/assets/images/home/avatar.png"
                }
                alt={instructor.firstName}
                className="image"
              />
            </div>
            <h2 className="name">
              {instructor.firstName} {instructor.lastName}
              <FaMedal className="medal-icon" />
            </h2>
            <h3 className="major">
              {instructor.major !== "Not specified"
                ? instructor.major
                : "Major not specified"}
            </h3>
            <p className="bio">
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
