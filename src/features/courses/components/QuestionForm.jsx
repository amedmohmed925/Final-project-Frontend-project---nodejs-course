import React from "react";
import { Form } from "react-bootstrap";

const QuestionForm = ({
  question,
  sectionIndex,
  lessonIndex,
  qIdx,
  onLessonQuizQuestionTextChange,
  onLessonQuizQuestionTypeChange,
  onLessonQuizQuestionOptionChange,
  onLessonQuizQuestionCorrectAnswerChange,
  isLoading
}) => (
  <div className="mb-2 p-2 border rounded">
    <Form.Select
      value={question.type}
      onChange={e => onLessonQuizQuestionTypeChange(sectionIndex, lessonIndex, qIdx, e.target.value)}
      disabled={isLoading}
    >
      <option value="multiple_choice">Multiple Choice</option>
      <option value="true_false">True / False</option>
    </Form.Select>
    <Form.Control
      type="text"
      placeholder="Enter question text (e.g., What is the HTML start tag?)"
      value={question.text}
      onChange={e => onLessonQuizQuestionTextChange(sectionIndex, lessonIndex, qIdx, e.target.value)}
      disabled={isLoading}
    />
    {question.type === 'multiple_choice' &&
      question.options.map((opt, optIdx) => (
        <Form.Control
          key={optIdx}
          type="text"
          placeholder={`Option ${optIdx + 1}`}
          value={opt}
          onChange={e => onLessonQuizQuestionOptionChange(sectionIndex, lessonIndex, qIdx, optIdx, e.target.value)}
          disabled={isLoading}
        />
      ))}
    <Form.Control
      type="text"
      placeholder={question.type === 'multiple_choice' ? "Enter the correct option exactly as above" : "Enter 'True' or 'False'"}
      value={question.correctAnswer}
      onChange={e => onLessonQuizQuestionCorrectAnswerChange(sectionIndex, lessonIndex, qIdx, e.target.value)}
      disabled={isLoading}
    />
  </div>
);

export default QuestionForm;
