import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import axiosInstance from '../../courses/api/courseApi';

const Dashboard = () => {
  const [pendingCoursesCount, setPendingCoursesCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingCoursesCount = async () => {
      try {
        const response = await axiosInstance.get('/admin/stats/pending-courses-count');
        setPendingCoursesCount(response.data.pendingCourses);
      } catch (error) {
        console.error('Error fetching pending courses count:', error);
      }
    };

    fetchPendingCoursesCount();
  }, []);

  return (
    <div className="dashboard">
      <Row>
        <Col>
          <Card className="card" onClick={() => navigate('/admin/pending-courses')}>
            <Card.Body>
              <Card.Title>Pending Courses</Card.Title>
              <Card.Text>{pendingCoursesCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;