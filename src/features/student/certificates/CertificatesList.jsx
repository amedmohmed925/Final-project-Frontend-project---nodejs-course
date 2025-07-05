import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCertificates } from "./certificatesSlice";
import { Spinner, Card, Button } from "react-bootstrap";
import { FaDownload, FaCertificate } from "react-icons/fa";

const CertificatesList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.certificates);

  useEffect(() => {
    dispatch(getCertificates());
  }, [dispatch]);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4"><FaCertificate className="me-2 text-primary" />My Certificates</h2>
      {items.length === 0 ? (
        <div className="text-center">No certificates yet.</div>
      ) : (
        <div className="row g-3">
          {items.map((cert) => (
            <div className="col-md-6 col-lg-4" key={cert._id}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{cert.courseId?.title || "Course"}</Card.Title>
                  <Card.Text>
                    Issued At: {new Date(cert.issuedAt).toLocaleDateString()}
                  </Card.Text>
                <Button
  variant="outline-primary"
  href={`http://localhost:8080${cert.fileUrl}`}
  target="_blank"
>
  <FaDownload className="me-1" /> Download Certificate
</Button>
                  
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesList;
