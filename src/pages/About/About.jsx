import HeaderPages from '../../components/HeaderPages';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaRocket, 
  FaUsers, 
  FaHeart, 
  FaShieldAlt,
  FaArrowRight,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaPlay
} from 'react-icons/fa';

// Import the professional CSS file
import '../../styles/About.css'; 

function About() {
  // Professional team data
  const professionals = [
    { 
      fullName: 'Michael Chen', 
      position: 'Chief Executive Officer', 
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
      expertise: 'Strategic Leadership & EdTech Innovation',
      social: { linkedin: '#', twitter: '#' }
    },
    { 
      fullName: 'Elena Rodriguez', 
      position: 'Head of Product Design', 
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
      expertise: 'UX Strategy & User Research',
      social: { linkedin: '#', twitter: '#' }
    },
    { 
      fullName: 'David Kim', 
      position: 'Chief Technology Officer', 
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
      expertise: 'Full-Stack Architecture & AI Integration',
      social: { linkedin: '#', github: '#' }
    },
    { 
      fullName: 'Sophia Williams', 
      position: 'Learning Experience Director', 
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      expertise: 'Curriculum Development & Assessment',
      social: { linkedin: '#', twitter: '#' }
    }
  ];
  
  // Core principles data
  const principles = [
    { 
      icon: <FaRocket />, 
      heading: 'Innovation-Driven', 
      description: 'We leverage cutting-edge technology and pedagogical research to create transformative learning experiences.',
      accent: '#6366f1'
    },
    { 
      icon: <FaUsers />, 
      heading: 'Community-Centered', 
      description: 'Building inclusive learning communities where collaboration and peer support drive success.',
      accent: '#8b5cf6'
    },
    { 
      icon: <FaHeart />, 
      heading: 'Student-First', 
      description: 'Every decision is made with our learners\' success, growth, and well-being as the top priority.',
      accent: '#ec4899'
    },
    { 
      icon: <FaShieldAlt />, 
      heading: 'Excellence Assured', 
      description: 'Maintaining the highest standards of quality in content, delivery, and educational outcomes.',
      accent: '#10b981'
    }
  ];

  // Achievement metrics
  const achievements = [
    { metric: '125K+', description: 'Global Learners' },
    { metric: '2,400+', description: 'Expert Courses' },
    { metric: '98.5%', description: 'Satisfaction Rate' },
    { metric: '185+', description: 'Countries Reached' }
  ];

  return (
    <div className="professional-about">
      <HeaderPages title="About Us" />
      
      {/* Premium Hero Section */}
      <section className="premium-hero">
        <Container>
          <div className="hero-wrapper">
            <div className="hero-content">
              <span className="hero-badge">Transforming Education Since 2019</span>
              <h1 className="hero-heading">
                Empowering minds through 
                <span className="gradient-text"> innovative learning</span>
              </h1>
              <p className="hero-description">
                We're dedicated to democratizing high-quality education, making it accessible, 
                engaging, and effective for learners worldwide. Our platform combines expert 
                knowledge with cutting-edge technology to deliver exceptional learning experiences.
              </p>
              <div className="hero-actions">
                <Button as={Link} to="/courses" className="primary-action">
                  Explore Courses <FaArrowRight />
                </Button>
                <Button variant="outline" className="secondary-action">
                  <FaPlay /> Watch Story
                </Button>
              </div>
            </div>
            <div className="hero-visual">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop" 
                alt="Learning community"
                className="hero-image"
              />
              <div className="floating-stats">
                {achievements.map((item, index) => (
                  <div key={index} className={`stat-bubble stat-${index + 1}`}>
                    <div className="stat-number">{item.metric}</div>
                    <div className="stat-label">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission Statement */}
      <section className="mission-statement">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="statement-content">
                <h2 className="statement-title">Our Purpose</h2>
                <div className="statement-grid">
                  <div className="statement-block">
                    <h3>Mission</h3>
                    <p>
                      To bridge the skills gap by providing world-class, accessible education 
                      that prepares learners for the future of work and empowers them to achieve 
                      their full potential.
                    </p>
                  </div>
                  <div className="statement-block">
                    <h3>Vision</h3>
                    <p>
                      To become the global leader in online education, fostering a world where 
                      quality learning opportunities are available to everyone, everywhere, 
                      at any stage of life.
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Core Principles */}
      <section className="core-principles">
        <Container>
          <div className="section-header">
            <h2 className="section-heading">What Drives Us</h2>
            <p className="section-subtext">
              Our core principles guide every decision and shape every experience we create
            </p>
          </div>
          <Row>
            {principles.map((principle, index) => (
              <Col md={6} lg={3} key={index}>
                <div className="principle-card">
                  <div 
                    className="principle-icon" 
                    style={{ color: principle.accent }}
                  >
                    {principle.icon}
                  </div>
                  <h4 className="principle-title">{principle.heading}</h4>
                  <p className="principle-text">{principle.description}</p>
                  <div 
                    className="principle-accent" 
                    style={{ backgroundColor: principle.accent }}
                  ></div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Leadership Team */}
      <section className="leadership-showcase">
        <Container>
          <div className="section-header">
            <h2 className="section-heading">Leadership Team</h2>
            <p className="section-subtext">
              Meet the visionaries and experts dedicated to your learning success
            </p>
          </div>
          <Row>
            {professionals.map((person, index) => (
              <Col md={6} lg={3} key={index}>
                <div className="professional-profile">
                  <div className="profile-image-wrapper">
                    <img 
                      src={person.avatar} 
                      alt={person.fullName}
                      className="profile-image"
                    />
                    <div className="social-overlay">
                      {person.social.linkedin && (
                        <a href={person.social.linkedin} className="social-link">
                          <FaLinkedin />
                        </a>
                      )}
                      {person.social.twitter && (
                        <a href={person.social.twitter} className="social-link">
                          <FaTwitter />
                        </a>
                      )}
                      {person.social.github && (
                        <a href={person.social.github} className="social-link">
                          <FaGithub />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="profile-details">
                    <h5 className="profile-name">{person.fullName}</h5>
                    <p className="profile-role">{person.position}</p>
                    <p className="profile-expertise">{person.expertise}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Success Metrics */}
      <section className="success-metrics">
        <Container>
          <div className="metrics-content">
            <Row className="align-items-center">
              <Col lg={6}>
                <div className="metrics-info">
                  <h2 className="metrics-title">Proven Impact</h2>
                  <p className="metrics-description">
                    Our commitment to excellence is reflected in the success of our global 
                    learning community. These numbers represent real people achieving real results.
                  </p>
                  <div className="metrics-grid">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="metric-item">
                        <div className="metric-value">{achievement.metric}</div>
                        <div className="metric-description">{achievement.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div className="metrics-visual">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop" 
                    alt="Success analytics"
                    className="metrics-image"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="premium-cta">
        <Container>
          <div className="cta-content">
            <h2 className="cta-headline">Ready to Transform Your Future?</h2>
            <p className="cta-message">
              Join thousands of learners who have already started their journey to success. 
              Discover courses that will elevate your skills and accelerate your career.
            </p>
            <div className="cta-actions">
              <Button as={Link} to="/courses" className="cta-primary">
                Start Learning Today
              </Button>
              <Button as={Link} to="/contact" variant="outline" className="cta-secondary">
                Get in Touch
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default About;