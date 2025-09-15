// src/components/Dashboard.jsx
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // For custom animations

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="dashboard-container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100 fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">ASEAN Quiz App</a>
          <div className="d-flex">
            <button
              onClick={handleLogout}
              className="btn btn-outline-light"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <div className="container mt-5 pt-5">
        {/* Hero Section */}
        <div className="p-5 mb-4 bg-light rounded-3 shadow-sm text-center animate__animated animate__fadeInDown">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold text-primary">ASEAN và Việt Nam: Hợp tác vì sự phát triển chung</h1>
            <p className="col-md-8 fs-4 mx-auto text-muted">
              ASEAN là một tổ chức khu vực quan trọng, đóng vai trò kết nối các quốc gia Đông Nam Á. Kể từ khi gia nhập vào năm 1995, Việt Nam đã trở thành một thành viên tích cực, góp phần thúc đẩy sự đoàn kết và thịnh vượng của toàn khối.
            </p>
            <button
              onClick={() => navigate('/quiz')}
              className="btn btn-primary btn-lg mt-3 animate__animated animate__pulse animate__infinite"
            >
              Làm bài trắc nghiệm ngay!
            </button>
          </div>
        </div>

        {/* Section: Việt Nam và vai trò trong Cộng đồng ASEAN */}
        <div className="row align-items-md-stretch mb-4">
          <div className="col-md-6 mb-3">
            <div className="h-100 p-5 bg-light border rounded-3 shadow-sm animate__animated animate__fadeInLeft">
              <h2 className="text-secondary">Việt Nam và vai trò trong Cộng đồng ASEAN</h2>
              <p>
                Việt Nam không chỉ tham gia mà còn dẫn dắt nhiều sáng kiến quan trọng, đặc biệt là trong việc thu hẹp khoảng cách phát triển giữa các nước thành viên. Việc gia nhập ASEAN đã giúp Việt Nam mở rộng quan hệ quốc tế, hội nhập sâu rộng vào nền kinh tế khu vực và thế giới.
              </p>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="h-100 p-5 bg-light border rounded-3 shadow-sm animate__animated animate__fadeInRight">
              <h2 className="text-secondary">Cơ hội cho sinh viên trong kỷ nguyên hội nhập</h2>
              <p>
                Đối với sinh viên, đặc biệt là sinh viên Nông Lâm, mối liên kết với ASEAN mở ra nhiều cơ hội quý giá:
              </p>
              <ul className="list-unstyled">
                <li><i className="bi bi-book-fill text-info me-2"></i> <strong>Học thuật:</strong> Tham gia các chương trình trao đổi, tiếp cận các nền giáo dục tiên tiến.</li>
                <li><i className="bi bi-lightbulb-fill text-warning me-2"></i> <strong>Nghiên cứu:</strong> Tham gia các dự án nghiên cứu chung về nông nghiệp bền vững, bảo vệ môi trường, an ninh lương thực.</li>
                <li><i className="bi bi-briefcase-fill text-success me-2"></i> <strong>Phát triển nghề nghiệp:</strong> Mở rộng cơ hội thực tập và làm việc trong các tập đoàn, tổ chức quốc tế.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action / Footer Section */}
        <div className="p-4 bg-primary text-white rounded-3 shadow-sm text-center animate__animated animate__fadeInUp">
          <h3 className="mb-3">Sẵn sàng kiểm tra kiến thức của bạn về ASEAN?</h3>
          <button
            onClick={() => navigate('/quiz')}
            className="btn btn-light btn-lg animate__animated animate__pulse animate__infinite"
          >
            Bắt đầu làm bài trắc nghiệm
          </button>
        </div>

        {/* Logout button (if not in navbar) */}
        <div className="text-center mt-4 mb-5">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-lg"
          >
            Đăng xuất
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;