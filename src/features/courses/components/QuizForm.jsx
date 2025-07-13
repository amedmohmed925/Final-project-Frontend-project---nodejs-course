import React from "react";
import { Form, Button } from "react-bootstrap";
import QuestionForm from "./QuestionForm";

const QuizForm = ({
  quiz,
  sectionIndex,
  lessonIndex,
  onLessonQuizTitleChange,
  onLessonQuizQuestionTextChange,
  onLessonQuizQuestionTypeChange,
  onLessonQuizQuestionOptionChange,
  onLessonQuizQuestionCorrectAnswerChange,
  onAddLessonQuizQuestion,
  isLoading
}) => (
  <div className="mb-2 p-2 border rounded">
    <Form.Group className="mb-2">
      <Form.Label>Quiz Title</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter quiz title (e.g., HTML Basics Quiz)"
        value={quiz?.title || ''}
        onChange={e => onLessonQuizTitleChange(sectionIndex, lessonIndex, e.target.value)}
        disabled={isLoading}
      />
    </Form.Group>
    {quiz?.questions?.map((q, qIdx) => (
      <QuestionForm
        key={qIdx}
        question={q}
        sectionIndex={sectionIndex}
        lessonIndex={lessonIndex}
        qIdx={qIdx}
        onLessonQuizQuestionTextChange={onLessonQuizQuestionTextChange}
        onLessonQuizQuestionTypeChange={onLessonQuizQuestionTypeChange}
        onLessonQuizQuestionOptionChange={onLessonQuizQuestionOptionChange}
        onLessonQuizQuestionCorrectAnswerChange={onLessonQuizQuestionCorrectAnswerChange}
        isLoading={isLoading}
      />
    ))}
    <Button
      variant="outline-success"
      size="sm"
      onClick={() => onAddLessonQuizQuestion(sectionIndex, lessonIndex)}
      disabled={isLoading}
    >
      Add Question
    </Button>
  </div>
);

export default QuizForm;
