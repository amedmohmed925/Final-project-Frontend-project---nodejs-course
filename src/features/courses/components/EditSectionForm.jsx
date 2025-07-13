import React from "react";
import { Form, Button } from "react-bootstrap";
import EditLessonForm from "./EditLessonForm";

const EditSectionForm = ({
  section,
  sectionIndex,
  onSectionTitleChange,
  onAddLesson,
  onLessonChange,
  onLessonQuizTitleChange,
  onLessonQuizQuestionTextChange,
  onLessonQuizQuestionTypeChange,
  onLessonQuizQuestionOptionChange,
  onLessonQuizQuestionCorrectAnswerChange,
  onAddLessonQuizQuestion,
  onVideoChange,
  onThumbnailChange,
  isLoading
}) => (
  <div className="section-group mb-4 p-3 border rounded">
    <Form.Group className="course-input-group">
      <Form.Label>Section Title</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter section title (e.g., HTML Basics)"
        value={section.title}
        onChange={e => onSectionTitleChange(sectionIndex, e.target.value)}
        required
        disabled={isLoading}
      />
    </Form.Group>
    {section.lessons.map((lesson, lessonIndex) => (
      <EditLessonForm
        key={lessonIndex}
        lesson={lesson}
        sectionIndex={sectionIndex}
        lessonIndex={lessonIndex}
        onLessonChange={onLessonChange}
        onLessonQuizTitleChange={onLessonQuizTitleChange}
        onLessonQuizQuestionTextChange={onLessonQuizQuestionTextChange}
        onLessonQuizQuestionTypeChange={onLessonQuizQuestionTypeChange}
        onLessonQuizQuestionOptionChange={onLessonQuizQuestionOptionChange}
        onLessonQuizQuestionCorrectAnswerChange={onLessonQuizQuestionCorrectAnswerChange}
        onAddLessonQuizQuestion={onAddLessonQuizQuestion}
        onVideoChange={onVideoChange}
        onThumbnailChange={onThumbnailChange}
        isLoading={isLoading}
      />
    ))}
    <Button
      variant="outline-primary"
      onClick={() => onAddLesson(sectionIndex)}
      className="mb-3"
      disabled={isLoading}
    >
      Add Lesson
    </Button>
  </div>
);

export default EditSectionForm;
