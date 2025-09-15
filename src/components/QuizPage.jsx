// src/components/QuizPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import questionsData from '../../data.json'; // Import the JSON data
import './QuizPage.css'; // For custom animations

const QuizPage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDurationSeconds, setQuizDurationSeconds] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [quizStartTime, setQuizStartTime] = useState(null);
  const timerRef = useRef(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // State to store screen width

  const questions = questionsData.questions;

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    console.log('Current screen width:', screenWidth); // Log screen width

    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
        setQuizStartTime(Date.now()); // Record start time when user is authenticated and page loads
      } else {
        navigate('/'); // Redirect to login if not authenticated
      }
    });

    // Timer logic
    if (!showResults && !loading) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            handleSubmitQuiz(); // Auto-submit when time runs out
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up event listener
      unsubscribeAuth();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [navigate, showResults, loading, screenWidth]); // Add screenWidth to dependency array

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOptionChange = (questionId, option) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitQuiz = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Temporarily commented out for debugging showResults state
    // const quizEndTime = Date.now();
    // const durationMs = quizEndTime - quizStartTime;
    // const durationSeconds = Math.floor(durationMs / 1000);

    // let correctAnswersCount = 0;
    // const quizResults = [];

    // questions.forEach(q => {
    //   const isCorrect = selectedAnswers[q.id] === q.answer;
    //   if (isCorrect) {
    //     correctAnswersCount++;
    //   }
    //   quizResults.push({
    //     questionId: q.id,
    //     selectedAnswer: selectedAnswers[q.id] || null,
    //     correctAnswer: q.answer,
    //     isCorrect: isCorrect
    //   });
    // });

    // setScore(correctAnswersCount);
    // setQuizDurationSeconds(durationSeconds); // Set duration in state
    setShowResults(true);
    console.log('setShowResults(true) called for debugging.');

    // if (user) {
    //   try {
    //     const userQuizDocRef = doc(db, 'quizResults', user.uid);
    //     await setDoc(userQuizDocRef, {
    //       uid: user.uid,
    //       timestamp: new Date().toISOString(),
    //       score: correctAnswersCount,
    //       totalQuestions: questions.length,
    //       durationSeconds: durationSeconds,
    //       answers: quizResults
    //     }, { merge: true });

    //     const userRef = doc(db, "users", user.uid);
    //     await setDoc(userRef, {
    //       lastQuizScore: correctAnswersCount,
    //       lastQuizTimestamp: new Date().toISOString(),
    //     }, { merge: true });
    //     console.log('Quiz results saved to Firestore!');
    //   } catch (error) {
    //     console.error('Error saving quiz results:', error);
    //   }
    // }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-exam-container container-fluid">
      <div className="row">
        {/* Main Content */}
        <div className="col-12 col-md-8 col-lg-9 main-content">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0 text-secondary">Bài thi</h4>
            <div className="timer fs-4 text-danger animate__animated animate__flash animate__infinite">
              Thời gian: {formatTime(timeLeft)}
            </div>
          </div>

          {/* Horizontal Question List for Mobile (hidden on desktop) */}
          <div className="mb-3 horizontal-question-list-container d-md-none">
            <h6 className="text-center mb-2 text-secondary">Danh sách câu hỏi</h6>
            <div className="d-flex flex-nowrap overflow-auto pb-2">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  className={`btn btn-sm m-1 flex-shrink-0 ${index === currentQuestionIndex ? 'btn-primary' : (selectedAnswers[q.id] ? 'btn-success' : 'btn-outline-secondary')}`}
                  onClick={() => goToQuestion(index)}
                  disabled={showResults}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {!showResults ? (
            <div className="card p-4 shadow-lg animate__animated animate__fadeInUp">
              <h5 className="mb-3 text-dark">
                Câu hỏi {currentQuestionIndex + 1} / {questions.length}
              </h5>
              <p className="fs-5 mb-4 lh-base text-dark">
                {currentQuestion.question}
              </p>
              <div className="mb-4">
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                  <div key={key} className="form-check mb-2 p-3 border rounded animate__animated animate__fadeInLeft"
                    onClick={() => handleOptionChange(currentQuestion.id, key)} style={{ cursor: 'pointer' }}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={currentQuestion.id}
                      id={`${currentQuestion.id}-${key}`}
                      value={key}
                      checked={selectedAnswers[currentQuestion.id] === key}
                      onChange={() => handleOptionChange(currentQuestion.id, key)}
                    />
                    <label className="form-check-label text-dark" htmlFor={`${currentQuestion.id}-${key}`}>
                      {key}. {value}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center animate__animated animate__zoomIn">
              <h2 className="text-success mb-4">Kết quả bài thi của bạn</h2>
              <p className="fs-4 mb-2 text-dark">
                Bạn đã trả lời đúng {score} trên tổng số {questions.length} câu hỏi.
              </p>
              <p className="fs-5 mb-4 text-dark">
                Thời gian làm bài: {formatTime(quizDurationSeconds)}
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary btn-lg animate__animated animate__pulse animate__infinite me-3"
              >
                Quay lại Dashboard
              </button>
              <button
                onClick={() => navigate('/certificate', {
                  state: {
                    userName: user.displayName || user.email,
                    score: score,
                    totalQuestions: questions.length,
                    quizDate: new Date().toISOString(),
                  }
                })}
                className="btn btn-success btn-lg animate__animated animate__pulse animate__infinite"
              >
                Xem Giấy Chứng Nhận
              </button>
            </div>
          )}

          {/* Desktop Navigation Buttons (hidden on mobile) */}
          {!showResults && (
            <div className="d-none d-md-flex justify-content-between mt-4 p-3 bg-light rounded shadow-sm">
              <button
                onClick={() => goToQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                className="btn btn-secondary btn-lg"
              >
                <i className="bi bi-arrow-left me-2"></i> Câu trước
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="btn btn-danger btn-lg mx-3 animate__animated animate__pulse animate__infinite"
                disabled={showResults}
              >
                Nộp bài
              </button>
              <button
                onClick={() => goToQuestion(currentQuestionIndex + 1)}
                disabled={currentQuestionIndex === questions.length - 1}
                className="btn btn-primary btn-lg"
              >
                Câu tiếp theo <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          )}

          {/* Sticky Footer for Mobile Navigation and Submit (hidden on desktop) */}
          {!showResults && (
            <div className="mobile-quiz-footer fixed-bottom bg-light p-3 shadow-lg d-flex justify-content-around align-items-center d-md-none">
              <button
                onClick={() => goToQuestion(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                className="btn btn-secondary flex-grow-1 mx-1"
              >
                Câu trước
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="btn btn-danger flex-grow-1 mx-1 animate__animated animate__pulse animate__infinite"
                disabled={showResults}
              >
                Nộp bài
              </button>
              <button
                onClick={() => goToQuestion(currentQuestionIndex + 1)}
                disabled={currentQuestionIndex === questions.length - 1}
                className="btn btn-primary flex-grow-1 mx-1"
              >
                Câu tiếp theo
              </button>
            </div>
          )}
        </div>

        {/* Desktop Question Navigation Sidebar (hidden on mobile) */}
        <div className="col-md-4 col-lg-3 d-none d-md-block desktop-question-sidebar">
          <h6 className="text-center mb-3 text-secondary">Danh sách câu hỏi</h6>
          <div className="d-flex flex-wrap justify-content-start">
            {questions.map((q, index) => (
              <button
                key={q.id}
                className={`btn btn-sm m-1 ${index === currentQuestionIndex ? 'btn-primary' : (selectedAnswers[q.id] ? 'btn-success' : 'btn-outline-secondary')}`}
                onClick={() => goToQuestion(index)}
                disabled={showResults}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;