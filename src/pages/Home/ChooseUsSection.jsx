import React from 'react'
import "../../styles/ChooseUsSection.css";

function ChooseUsSection() {
  return (
    <section className="py-5">
  <div className="container">
    <div className="text-center mb-5 scroll-animation visible">
      <h2 className="fw-bold mb-3">Why Choose <span style={{color:"var(--mainColor)"}}>EduQuest</span>?</h2>
      <p className="lead text-muted mx-auto" style={{ maxWidth: 700 }}>
        We're dedicated to providing a personalized learning experience that
        helps you achieve your goals.
      </p>
    </div>
    <div className="row">
      <div className="col-md-6 col-lg-3 mb-4">
        <div className="feature-card-section scroll-animation visible">
          <div className="feature-icon-section">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={35}
              height={35}
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
          <h3 className="h5 fw-bold mb-3">Comprehensive Curriculum</h3>
          <p className="text-muted mb-0">
            Our courses are designed by industry experts to provide in-depth
            knowledge and practical skills.
          </p>
        </div>
      </div>
      <div className="col-md-6 col-lg-3 mb-4">
        <div className="feature-card-section scroll-animation visible">
          <div className="feature-icon-section">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={35}
              height={35}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1={18} y1={20} x2={18} y2={10} />
              <line x1={12} y1={20} x2={12} y2={4} />
              <line x1={6} y1={20} x2={6} y2={14} />
            </svg>
          </div>
          <h3 className="h5 fw-bold mb-3">Progress Tracking</h3>
          <p className="text-muted mb-0">
            Monitor your learning progress with detailed analytics and
            personalized insights.
          </p>
        </div>
      </div>
      <div className="col-md-6 col-lg-3 mb-4">
        <div className="feature-card-section scroll-animation visible">
          <div className="feature-icon-section">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={35}
              height={35}
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
          <h3 className="h5 fw-bold mb-3">Certificates</h3>
          <p className="text-muted mb-0">
            Earn recognized certificates upon course completion to boost your
            resume.
          </p>
        </div>
      </div>
      <div className="col-md-6 col-lg-3 mb-4">
        <div className="feature-card-section scroll-animation visible">
          <div className="feature-icon-section">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={35}
              height={35}
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
          <h3 className="h5 fw-bold mb-3">Community Support</h3>
          <p className="text-muted mb-0">
            Join a global community of learners for discussions, networking, and
            collaboration.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

  )
}

export default ChooseUsSection