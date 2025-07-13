import React from "react";
import { Form } from "react-bootstrap";
import QuizForm from "./QuizForm";

const EditLessonForm = ({
  lesson,
  sectionIndex,
  lessonIndex,
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
  <div className="lesson-group mb-3 p-3 border rounded">
    <Form.Group className="course-input-group">
      <Form.Label>Lesson Title</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter lesson title"
        value={lesson.title}
        onChange={e => onLessonChange(sectionIndex, lessonIndex, 'title', e.target.value)}
        required
        disabled={isLoading}
      />
    </Form.Group>
    <Form.Group className="course-input-group">
      <Form.Label>Lesson Content</Form.Label>
      <Form.Control
        as="textarea"
        rows={2}
        placeholder="Enter lesson content"
        value={lesson.content}
        onChange={e => onLessonChange(sectionIndex, lessonIndex, 'content', e.target.value)}
        required
        disabled={isLoading}
      />
    </Form.Group>
    <Form.Group className="course-input-group">
      <Form.Label>Lesson Video (Upload new if needed)</Form.Label>
      {lesson.videoUrl && !lesson.videoUrl.startsWith("pending:") && (
        <p>Current Video: <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer">View</a></p>
      )}
      <Form.Control
        type="file"
        accept="video/mp4,video/mov"
        onChange={e => onVideoChange(sectionIndex, lessonIndex, e)}
        disabled={isLoading}
      />
    </Form.Group>
    <Form.Group className="course-input-group">
      <Form.Label>Lesson Thumbnail (Upload new if needed)</Form.Label>
      {lesson.thumbnailUrl && !lesson.thumbnailUrl.startsWith("pending:") && (
        <p>Current Thumbnail: <img src={lesson.thumbnailUrl} alt="Thumbnail" style={{ maxWidth: "100px" }} /></p>
      )}
      <Form.Control
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={e => onThumbnailChange(sectionIndex, lessonIndex, e)}
        disabled={isLoading}
      />
    </Form.Group>
    <QuizForm
      quiz={lesson.quiz}
      sectionIndex={sectionIndex}
      lessonIndex={lessonIndex}
      onLessonQuizTitleChange={onLessonQuizTitleChange}
      onLessonQuizQuestionTextChange={onLessonQuizQuestionTextChange}
      onLessonQuizQuestionTypeChange={onLessonQuizQuestionTypeChange}
      onLessonQuizQuestionOptionChange={onLessonQuizQuestionOptionChange}
      onLessonQuizQuestionCorrectAnswerChange={onLessonQuizQuestionCorrectAnswerChange}
      onAddLessonQuizQuestion={onAddLessonQuizQuestion}
      isLoading={isLoading}
    />
  </div>
);

export default EditLessonForm;
