// src/components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const formatTime = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        navigate('/'); // Redirect if not logged in
        return;
      }

      // Check if the current user is an admin from Firestore
      const adminDocRef = doc(db, 'admins', currentUser.uid);
      const adminDoc = await getDoc(adminDocRef);
      if (adminDoc.exists() && adminDoc.data().isAdmin) {
        setIsAdmin(true);
      } else {
        setError('Bạn không có quyền truy cập trang quản trị.');
        setLoading(false);
        // Optionally redirect non-admins
        // navigate('/dashboard');
        return;
      }

      try {
        // Fetch users
        const usersCollectionRef = collection(db, 'users');
        const usersSnapshot = await getDocs(query(usersCollectionRef, orderBy('displayName')));
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
        console.log('Fetched Users:', usersList); // <-- THÊM DÒNG NÀY

        // Fetch quiz results
        const quizResultsCollectionRef = collection(db, 'quizResults');
        const quizResultsSnapshot = await getDocs(query(quizResultsCollectionRef, orderBy('timestamp', 'desc')));
        const quizResultsList = quizResultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuizResults(quizResultsList);
        console.log('Fetched Quiz Results:', quizResultsList); // <-- THÊM DÒNG NÀY

        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Không thể tải dữ liệu quản trị. Vui lòng kiểm tra quyền.");
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light text-danger">
        <p>{error}</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light text-danger">
        <p>Bạn không có quyền truy cập trang quản trị.</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container container-fluid p-4">
      <h2 className="mb-4 text-center text-primary animate__animated animate__fadeInDown">Bảng điều khiển Quản trị Quiz</h2>

      <div className="card shadow-lg mb-5 animate__animated animate__fadeInUp">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Danh sách người dùng</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Tên hiển thị</th>
                  <th>Email</th>
                  <th>Điểm Quiz gần nhất</th>
                  <th>Thời gian Quiz gần nhất</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.displayName}</td>
                    <td>{user.email}</td>
                    <td>{user.lastQuizScore !== undefined ? user.lastQuizScore : 'N/A'}</td>
                    <td>{user.lastQuizTimestamp ? new Date(user.lastQuizTimestamp).toLocaleString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card shadow-lg animate__animated animate__fadeInUp animate__delay-1s">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">Tất cả kết quả Quiz</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Email</th>
                  <th>Điểm</th>
                  <th>Tổng câu hỏi</th>
                  <th>Thời gian nộp</th>
                  <th>Thời gian làm bài</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {quizResults.map(result => {
                  const user = users.find(u => u.uid === result.uid);
                  return (
                    <tr key={result.id}>
                      <td>{user ? user.displayName : result.uid}</td>
                      <td>{user ? user.email : 'N/A'}</td>
                      <td>{result.score}</td>
                      <td>{result.totalQuestions}</td>
                      <td>{new Date(result.timestamp).toLocaleString()}</td>
                      <td>{formatTime(result.durationSeconds)}</td>
                      <td>
                        <button className="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target={`#quizDetailModal-${result.id}`}>
                          Xem
                        </button>

                        {/* Modal for Quiz Details */}
                        <div className="modal fade" id={`quizDetailModal-${result.id}`} tabIndex="-1" aria-labelledby={`quizDetailModalLabel-${result.id}`} aria-hidden="true">
                          <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                              <div className="modal-header bg-light">
                                <h5 className="modal-title" id={`quizDetailModalLabel-${result.id}`}>Chi tiết Quiz của {user ? user.displayName : result.uid}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-body">
                                <p><strong>Điểm:</strong> {result.score} / {result.totalQuestions}</p>
                                <p><strong>Thời gian nộp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
                                <h6 className="mt-3">Câu trả lời:</h6>
                                <ul className="list-group">
                                  {result.answers.map((answer, idx) => (
                                    <li key={idx} className={`list-group-item ${answer.isCorrect ? 'list-group-item-success' : 'list-group-item-danger'}`}>
                                      <strong>Câu {idx + 1}:</strong> {answer.questionId} - Chọn: {answer.selectedAnswer || 'Không trả lời'} - Đúng: {answer.correctAnswer}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
