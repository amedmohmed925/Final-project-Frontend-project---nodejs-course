import { useEffect, useState } from "react";
import { getCourseProgress, updateCourseProgress } from "../../api/courseProgressApi";

const CourseProgress = ({ courseId }) => {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getCourseProgress(courseId);
        // إذا كان هناك تقدم، استخدم data.progress، وإلا استخدم كائن افتراضي
        setProgress(data.progress || { completionPercentage: 0, sections: [] });
      } catch (err) {
        setError("Failed to load progress. Please try again.");
        console.error("Fetch Progress Error:", err);
      }
    };
    fetchProgress();
  }, [courseId]);

  const handleLessonComplete = async (sectionIndex, lessonIndex) => {
    try {
      const updatedProgress = await updateCourseProgress(courseId, {
        sectionIndex,
        lessonIndex,
        completed: true,
      });
      setProgress(updatedProgress.progress);
    } catch (err) {
      setError("Failed to update progress.");
      console.error("Update Progress Error:", err);
    }
  };

  if (error) return <div>{error}</div>;
  if (!progress) return <div>Loading...</div>;

  return (
    <div>
      <h3>Course Progress: {progress.completionPercentage.toFixed(2)}%</h3>
      {progress.sections.map((section, sIndex) => (
        <div key={sIndex}>
          <h4>Section {sIndex + 1}</h4>
          {section.lessons.map((lesson, lIndex) => (
            <div key={lIndex}>
              <p>Lesson {lIndex + 1}: {lesson.completed ? "Completed" : "Not Completed"}</p>
              {!lesson.completed && (
                <button onClick={() => handleLessonComplete(sIndex, lIndex)}>
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CourseProgress;