import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CertificatePage.css';
import NluLogo from '../assets/logo.png'; // Assuming NLU logo is used as watermark

const CertificatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userName, score, totalQuestions, quizDate } = location.state || {};

  if (!userName || score === undefined || !totalQuestions || !quizDate) {
    // Redirect to dashboard or show an error if data is missing
    return (
      <div className="certificate-container">
        <div className="certificate-card p-5">
          <h2 className="text-danger mb-4">Không tìm thấy thông tin chứng nhận.</h2>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-lg">
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(quizDate).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="certificate-container">
      <div className="certificate-card">
        <div className="certificate-content">
          <h1 className="certificate-title">GIẤY CHỨNG NHẬN</h1>
          <p className="certificate-subtitle">Đã hoàn thành xuất sắc</p>
          
          <p className="certificate-text">Chứng nhận rằng</p>
          <h2 className="certificate-recipient">{userName}</h2>
          <p className="certificate-text">Đã tham gia và hoàn thành</p>
          <h3 className="text-primary mb-3">Cuộc thi Trắc nghiệm ASEAN</h3>
          <p className="certificate-text">Với số điểm</p>
          <p className="certificate-score">{score} / {totalQuestions}</p>
          <p className="certificate-text">Vào ngày {formattedDate}</p>

          <div className="certificate-signature">
            <div className="signature-block">
              <p className="signature-role">Người tham gia</p>
              <p className="signature-name">{userName}</p>
            </div>
            <div className="signature-block">
              <p className="signature-role">Ban Tổ Chức</p>
              <p className="signature-name">Đơn vị tổ chức XYZ</p>
            </div>
          </div>

          <button onClick={() => window.print()} className="btn btn-info mt-5 me-3">
            <i className="bi bi-printer-fill me-2"></i> In Chứng Nhận
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary mt-5">
            <i className="bi bi-house-fill me-2"></i> Quay lại Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
