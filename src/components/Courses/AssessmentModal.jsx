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
  courseId, 
  moduleId
}) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [canAttempt, setCanAttempt] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAssessment();
    
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

  // ✅ WORKING: Transform questions
  const transformQuestions = (backendQuestions) => {
    if (!backendQuestions || !Array.isArray(backendQuestions)) return [];
    
    console.log('🔄 Transforming questions...');
    
    return backendQuestions.map((q, index) => {
      // Create options array
      const optionsArray = [];
      if (q.optionA) optionsArray.push(q.optionA);
      if (q.optionB) optionsArray.push(q.optionB);
      if (q.optionC) optionsArray.push(q.optionC);
      if (q.optionD) optionsArray.push(q.optionD);
      
      // Get correct answer letter (A, B, C, D)
      const correctAnswerLetter = (q.correctAnswer || 'B').toUpperCase();
      
      console.log(`Q${index + 1}: Correct answer = "${correctAnswerLetter}"`);
      
      return {
        id: q.id,
        questionText: q.questionText,
        marks: q.marks || 2,
        options: optionsArray,
        correctAnswerLetter: correctAnswerLetter
      };
    });
  };

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log('🎯 Loading assessment...');
      
      const attemptCheck = await canAttemptAssessment(assessment.id, userId);
      setCanAttempt(attemptCheck);
      
      if (!attemptCheck) {
        setError("Complete all videos before attempting assessment.");
        setLoading(false);
        return;
      }

      const data = await getAssessmentQuestions(assessment.id, userId);
      
      if (data?.questions && Array.isArray(data.questions)) {
        const transformedQuestions = transformQuestions(data.questions);
        
        if (transformedQuestions.length > 0) {
          setQuestions(transformedQuestions);
          
          // Initialize empty answers
          const initialAnswers = {};
          transformedQuestions.forEach(q => {
            initialAnswers[q.id] = "";
          });
          setAnswers(initialAnswers);
          
          console.log(`✅ Loaded ${transformedQuestions.length} questions`);
        } else {
          setError("No questions found.");
        }
      } else {
        setError("Failed to load questions.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Error loading assessment.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ✅ WORKING: Store LETTER (A, B, C, D) when user selects option
  const handleAnswerChange = (questionId, optionText) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    // Find which option index this is (0=A, 1=B, 2=C, 3=D)
    const optionIndex = question.options.findIndex(opt => opt === optionText);
    if (optionIndex === -1) return;
    
    // Convert to letter
    const letter = ["A", "B", "C", "D"][optionIndex];
    
    console.log(`📝 Selected: Q${questionId} → Option ${letter}`);
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: letter
    }));
  };

  // ✅ WORKING: Submit LETTERS (A, B, C, D) to backend
  const handleAutoSubmit = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      console.log('📤 Submitting assessment...');
      console.log('Answers (letters):', answers);
      
      // ✅ CRITICAL: Send letters as they are (A, B, C, D)
      // Backend expects: {1: "B", 2: "B", 3: "A", ...}
      const response = await submitAssessment(assessment.id, userId, answers);
      setResult(response);
      
      console.log('✅ Result:', response);
      
      if (onComplete) {
                setTimeout(() => {
          onComplete({
            ...response,
            moduleId: moduleId // Include moduleId in completion data
          });
        }, 3000);
      }
    } catch (err) {
      console.error("❌ Submission error:", err);
      alert("Error submitting assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    const unanswered = questions.filter(q => !answers[q.id] || answers[q.id].trim() === "");
    if (unanswered.length > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`
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

  // ✅ WORKING: Check if option is selected
  const isOptionSelected = (questionId, optionText) => {
    const answerLetter = answers[questionId];
    const question = questions.find(q => q.id === questionId);
    
    if (!answerLetter || !question) return false;
    
    // Convert letter to option index
    const letterIndex = {A: 0, B: 1, C: 2, D: 3}[answerLetter.toUpperCase()];
    if (letterIndex === undefined) return false;
    
    // Compare option text
    return question.options[letterIndex] === optionText;
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
              {result.passed ? <CheckCircle size={48} className="text-green-500" /> : <AlertCircle size={48} className="text-red-500" />}
            </div>
            
            <h3 className="text-2xl font-bold text-center mb-4">
              {result.passed ? '🎉 Congratulations!' : 'Keep Practicing!'}
            </h3>
            
            <div className="text-center mb-6">
              <p className="text-lg mb-2">
                Score: <span className="font-bold">{result.obtainedMarks}/{result.totalMarks}</span>
              </p>
              <p className="text-3xl font-bold mb-2">{result.percentage?.toFixed(1)}%</p>
              <p className="text-gray-600">
                {result.passed ? 'You passed!' : 'You need 70% to pass.'}
              </p>
            </div>

            {result.questionResults && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Question Results:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {result.questionResults.map((qResult, index) => (
                    <div key={index} className={`p-3 rounded border ${qResult.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
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
              <button onClick={onClose} className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Return to Course
              </button>
              {!result.passed && (
                <button onClick={() => { setResult(null); setCurrentQuestion(0); setAnswers({}); loadAssessment(); }}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium">
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
            <p className="text-sm text-gray-600 mt-1">Module Assessment • Questions: {questions.length}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
              <Clock size={18} className="text-blue-600" />
              <span className="font-medium text-blue-700">{formatTime(timeLeft)}</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
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
              <button key={index} onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${index === currentQuestion ? 'bg-blue-600 text-white' 
                    : getQuestionStatus(index) === 'answered' ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'}`}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* QUESTION CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {questions[currentQuestion] && (() => {
            const question = questions[currentQuestion];
            const options = question.options || [];
            
            return (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold text-gray-800">Question {currentQuestion + 1}</h4>
                  <span className="text-sm text-gray-500">Marks: {question.marks || 2}</span>
                </div>
                
                <p className="text-gray-700 mb-6 text-lg">{question.questionText}</p>

                {/* OPTIONS */}
                <div className="space-y-3">
                  {options.length > 0 ? options.map((option, index) => {
                    const optionId = `${question.id}_${index}`;
                    const isSelected = isOptionSelected(question.id, option);
                    const letter = ["A", "B", "C", "D"][index];
                    const isCorrectLetter = letter === question.correctAnswerLetter;
                    
                    return (
                      <label key={index} htmlFor={optionId}
                        className={`block p-4 border rounded-lg cursor-pointer transition-all
                          ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" id={optionId} name={`question_${question.id}`}
                            value={option} checked={isSelected}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="h-4 w-4 text-blue-600" />
                          <span className="text-gray-700">
                            <span className="font-medium mr-2">{letter}.</span> {option}
                          </span>
                          {isCorrectLetter && (
                            <span className="text-xs text-green-600 ml-auto">(Correct)</span>
                          )}
                        </div>
                      </label>
                    );
                  }) : (
                    <div className="text-center p-4 text-red-500 border border-red-200 rounded-lg">
                      No options available.
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between">
            <button onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors
                ${currentQuestion === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              Previous
            </button>

            <div className="flex gap-3">
              {currentQuestion < questions.length - 1 ? (
                <button onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Next Question
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2
                    ${submitting ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                  {submitting ? (<><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> Submitting...</>) : 'Submit Assessment'}
                </button>
              )}
            </div>
          </div>

          {/* TEST BUTTON (TEMPORARY - REMOVE AFTER TESTING) */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button onClick={() => {
              // Force select "B" for all questions
              const forcedAnswers = {};
              questions.forEach(q => {
                forcedAnswers[q.id] = "B";
              });
              setAnswers(forcedAnswers);
              alert("Forced all answers as 'B'. Now click Submit.");
            }} className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition mb-2">
              🧪 TEST: Force All Answers as "B"
            </button>
            
            <button onClick={handleSubmit} disabled={submitting}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}