import { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { 
  getAssessmentQuestions, 
  submitAssessment,
  canAttemptAssessment 
} from "../../Api/course.api";

export default function AssessmentModal({ 
  assessment, 
  onClose, 
  onComplete,
  userId,
  courseId 
}) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [canAttempt, setCanAttempt] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAssessment();
    
    // Timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessment?.id]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Check if user can attempt
      const attemptCheck = await canAttemptAssessment(assessment.id);
      setCanAttempt(attemptCheck);
      
      if (!attemptCheck) {
        setError("You need to complete all videos in this module before attempting the assessment.");
        setLoading(false);
        return;
      }

      // Load questions
      const data = await getAssessmentQuestions(assessment.id);
      
      if (data?.questions) {
        setQuestions(data.questions);
        
        // Initialize answers object
        const initialAnswers = {};
        data.questions.forEach(q => {
          initialAnswers[q.id] = "";
        });
        setAnswers(initialAnswers);
      } else {
        setError("Failed to load assessment questions.");
      }
    } catch (err) {
      console.error("Error loading assessment:", err);
      setError("Error loading assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleAutoSubmit = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      const response = await submitAssessment(assessment.id, answers);
      setResult(response);
      
      if (onComplete) {
        setTimeout(() => {
          onComplete(response);
        }, 3000);
      }
    } catch (err) {
      console.error("Error submitting assessment:", err);
      alert("Error submitting assessment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    // Check if all questions are answered
    const unanswered = questions.filter(q => !answers[q.id] || answers[q.id].trim() === "");
    if (unanswered.length > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    await handleAutoSubmit();
  };

  const getQuestionStatus = (index) => {
    const questionId = questions[index]?.id;
    if (!questionId) return "unanswered";
    return answers[questionId] ? "answered" : "unanswered";
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mb-4"></div>
            <p className="text-gray-700">Loading assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-lg w-full">
          <div className="p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-semibold">Assessment Not Available</h3>
            </div>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-lg w-full">
          <div className="p-8">
            <div className={`flex items-center justify-center mb-6 ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
              {result.passed ? (
                <CheckCircle size={48} className="text-green-500" />
              ) : (
                <AlertCircle size={48} className="text-red-500" />
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-center mb-4">
              {result.passed ? '🎉 Congratulations!' : 'Keep Practicing!'}
            </h3>
            
            <div className="text-center mb-6">
              <p className="text-lg mb-2">
                Score: <span className="font-bold">{result.obtainedMarks}/{result.totalMarks}</span>
              </p>
              <p className="text-3xl font-bold mb-2">
                {result.percentage?.toFixed(1)}%
              </p>
              <p className="text-gray-600">
                {result.passed 
                  ? 'You passed the assessment!' 
                  : 'You need 70% to pass. Review the material and try again.'}
              </p>
            </div>

            {result.questionResults && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Question-wise Results:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {result.questionResults.map((qResult, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded border ${qResult.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium">Q{index + 1}</span>
                        <span className={`text-sm px-2 py-1 rounded ${qResult.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {qResult.correct ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      {!qResult.correct && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Your answer: {qResult.userAnswer || 'Not answered'}</p>
                          <p>Correct answer: {qResult.correctAnswer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Return to Course
              </button>
              {!result.passed && (
                <button
                  onClick={() => {
                    setResult(null);
                    setCurrentQuestion(0);
                    setAnswers({});
                    loadAssessment();
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{assessment.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Module Assessment • Questions: {questions.length}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
              <Clock size={18} className="text-blue-600" />
              <span className="font-medium text-blue-700">{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
          </div>
        </div>

        {/* QUESTION NAVIGATION DOTS */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${index === currentQuestion 
                    ? 'bg-blue-600 text-white' 
                    : getQuestionStatus(index) === 'answered'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* QUESTION CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {questions[currentQuestion] && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-800">
                  Question {currentQuestion + 1}
                </h4>
                <span className="text-sm text-gray-500">
                  Marks: {questions[currentQuestion].marks}
                </span>
              </div>
              
              <p className="text-gray-700 mb-6 text-lg">
                {questions[currentQuestion].questionText}
              </p>

              {/* OPTIONS */}
              <div className="space-y-3">
                {questions[currentQuestion].options?.map((option, index) => {
                  const optionId = `${questions[currentQuestion].id}_${index}`;
                  const isSelected = answers[questions[currentQuestion].id] === option;
                  
                  return (
                    <label
                      key={index}
                      htmlFor={optionId}
                      className={`block p-4 border rounded-lg cursor-pointer transition-all
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id={optionId}
                          name={`question_${questions[currentQuestion].id}`}
                          value={option}
                          checked={isSelected}
                          onChange={(e) => handleAnswerChange(questions[currentQuestion].id, e.target.value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-700">{option}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors
                ${currentQuestion === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Previous
            </button>

            <div className="flex gap-3">
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2
                    ${submitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Assessment'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON FOR SMALL SCREENS */}
          <div className="mt-4 pt-4 border-t border-gray-200 md:hidden">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}