import React, { useState, useEffect } from 'react';
import './StatsSection.css';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

function StatsSection() {
  // States to hold the real counts from the API
  const [studentsCount, setStudentsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);

  // Hook to detect when the section is in view
  const { ref, inView } = useInView({
    triggerOnce: true, // Run only once when the section comes into view
    threshold: 0.3,    // Start when 30% of the section is visible
  });

  // Fetch data from the API endpoints
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students count
        const studentsResponse = await fetch('http://localhost:8080/api/v1/users/students/count');
        const studentsData = await studentsResponse.json();
        setStudentsCount(studentsData);

        // Fetch teachers count
        const teachersResponse = await fetch('http://localhost:8080/api/v1/users/teachers/count');
        const teachersData = await teachersResponse.json();
        setTeachersCount(teachersData);

        // Fetch courses count
        const coursesResponse = await fetch('http://localhost:8080/api/v1/courses/count');
        const coursesData = await coursesResponse.json();
        setCoursesCount(coursesData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once on mount

  return (
    <section className="stats-section" ref={ref}>
      <div className="container">
        {/* Updated title and paragraph to match the stats section */}
        <div className="text-center">
          <h2 className="fw-bold">Our <span style={{color:"var(--mainColor)"}}>EduQuest</span> Stats</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 700 }}>
            Discover the impact of our learning platform through these key numbers.
          </p>
        </div>
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="stats-card scroll-animation visible">
              <div className="stats-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={30}
                  height={30}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h2 className="fw-bold mb-2">
                {inView ? (
                  <CountUp end={coursesCount} duration={2} separator="," suffix="+" />
                ) : (
                  '0+'
                )}
              </h2>
              <p className="text-muted mb-0">Courses Available</p>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="stats-card scroll-animation visible">
              <div className="stats-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={30}
                  height={30}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx={9} cy={7} r={4} />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h2 className="fw-bold mb-2">
                {inView ? (
                  <CountUp end={studentsCount} duration={2} separator="," suffix="+" />
                ) : (
                  '0+'
                )}
              </h2>
              <p className="text-muted mb-0">Students Enrolled</p>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="stats-card scroll-animation visible">
              <div className="stats-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={30}
                  height={30}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx={12} cy={8} r={7} />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
              </div>
              <h2 className="fw-bold mb-2">
                {inView ? (
                  <CountUp end={teachersCount} duration={2} separator="," suffix="+" />
                ) : (
                  '0+'
                )}
              </h2>
              <p className="text-muted mb-0">Expert Instructors</p>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="stats-card scroll-animation visible">
              <div className="stats-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={30}
                  height={30}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x={2} y={3} width={20} height={14} rx={2} ry={2} />
                  <line x1={8} y1={21} x2={16} y2={21} />
                  <line x1={12} y1={17} x2={12} y2={21} />
                </svg>
              </div>
              <h2 className="fw-bold mb-2">
                {inView ? (
                  <CountUp end={99.8} duration={2} decimals={1} suffix="%" />
                ) : (
                  '0%'
                )}
              </h2>
              <p className="text-muted mb-0">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;