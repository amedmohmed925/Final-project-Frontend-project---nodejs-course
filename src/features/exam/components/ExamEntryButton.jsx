import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ExamEntryButton = ({ completion, onGoToExam }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (completion < 100) {
      setShowModal(true);
    } else {
      onGoToExam();
    }
  };

  return (
    <>
      <Button variant="warning" onClick={handleClick} style={{ fontWeight: 600, marginTop: 16 }}>
        Go to Final Exam
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Complete the Course First</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You must finish watching all course lessons before you can access the final exam.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ExamEntryButton;
