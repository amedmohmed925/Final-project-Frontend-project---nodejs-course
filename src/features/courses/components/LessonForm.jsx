import React from "react";
import { Form } from "react-bootstrap";
import QuizForm from "./QuizForm";

const LessonForm = ({
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
  isLoading
}) => (
  <div className="lesson-group mb-3 p-3 border rounded">
    <Form.Group className="mb-2">
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
    <Form.Group className="mb-2">
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
    <Form.Group className="mb-2">
      <Form.Label>Lesson Video</Form.Label>
      <Form.Control
        type="file"
        accept="video/mp4,video/mov"
        onChange={e => onLessonChange(sectionIndex, lessonIndex, 'video', e)}
        disabled={isLoading}
      />
    </Form.Group>
    <Form.Group className="mb-2">
      <Form.Label>Lesson Thumbnail</Form.Label>
      <Form.Control
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={e => onLessonChange(sectionIndex, lessonIndex, 'thumbnail', e)}
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

export default LessonForm;
