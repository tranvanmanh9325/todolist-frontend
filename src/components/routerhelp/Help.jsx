import React, { useState } from 'react';
import BookmarkBar from './BookmarkBar';
import Footer from './Footer';
import './Help.css';

const Help = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form ở đây
    console.log('Form submitted:', contactForm);
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const faqData = [
    {
      question: "Làm thế nào để tạo task mới?",
      answer: "Bạn có thể tạo task mới bằng cách nhấn vào nút '+' ở góc dưới bên phải hoặc sử dụng phím tắt Ctrl+N.",
      icon: "/resource-icon.svg"
    },
    {
      question: "Có thể sắp xếp task theo độ ưu tiên không?",
      answer: "Có, bạn có thể đặt độ ưu tiên cho từng task: Cao, Trung bình, Thấp. Hệ thống sẽ tự động sắp xếp theo độ ưu tiên.",
      icon: "/resource-icon.svg"
    },
    {
      question: "Làm sao để đồng bộ dữ liệu giữa các thiết bị?",
      answer: "Dữ liệu của bạn được lưu trữ trên cloud và tự động đồng bộ khi bạn đăng nhập trên bất kỳ thiết bị nào.",
      icon: "/resource-icon.svg"
    },
    {
      question: "Có thể xuất danh sách task không?",
      answer: "Hiện tại tính năng này đang được phát triển. Bạn có thể liên hệ với chúng tôi để được hỗ trợ xuất dữ liệu.",
      icon: "/resource-icon.svg"
    }
  ];

  const quickLinks = [
    { title: "Hướng dẫn sử dụng", icon: "/resource-icon.svg", link: "#" },
    { title: "Video tutorial", icon: "/youtube-icon.svg", link: "#" },
    { title: "API Documentation", icon: "/resource-icon.svg", link: "#" },
    { title: "Community Forum", icon: "/facebook-icon.svg", link: "#" },
    { title: "Bug Report", icon: "/github-icon.svg", link: "#" },
    { title: "Feature Request", icon: "/resource-icon.svg", link: "#" }
  ];

  const socialLinks = [
    { 
      title: "Gmail", 
      icon: "/gmail-icon.svg", 
      link: "https://mail.google.com/mail/?view=cm&fs=1&to=tranvanmanh9032005@gmail.com&su=Liên%20hệ%20từ%20website%20To-Do%20List&body=Chào%20Mạnh,%20tôi%20muốn%20trao%20đổi%20với%20bạn...",
      description: "Liên hệ trực tiếp qua email",
      color: "#EA4335"
    },
    { 
      title: "GitHub", 
      icon: "/github-icon.svg", 
      link: "https://github.com/tranvanmanh9325/todolist-frontend",
      description: "Xem source code dự án",
      color: "#333333"
    },
    { 
      title: "Interactive Image", 
      icon: "/image-icon.svg", 
      link: "https://github.com/tranvanmanh9325/interactive-image",
      description: "Dự án hình ảnh tương tác",
      color: "#4285F4"
    },
    { 
      title: "LinkedIn", 
      icon: "/linkedin-icon.svg", 
      link: "https://linkedin.com/in/tranvanmanh9325",
      description: "Kết nối chuyên nghiệp",
      color: "#0077B5"
    },
    { 
      title: "Facebook", 
      icon: "/facebook-icon.svg", 
      link: "https://facebook.com/tranvanmanh9325",
      description: "Theo dõi trên Facebook",
      color: "#1877F2"
    },
    { 
      title: "YouTube", 
      icon: "/youtube-icon.svg", 
      link: "https://youtube.com/@tranvanmanh9325",
      description: "Xem video và tutorials",
      color: "#FF0000"
    },
    { 
      title: "TikTok", 
      icon: "/tiktok-icon.svg", 
      link: "https://tiktok.com/@tranvanmanh9325",
      description: "Xem video ngắn và content",
      color: "#000000"
    }
  ];

  return (
    <div className="help-content">
      {/* Header Section */}
      <div className="help-header">
        <div className="help-hero">
          <h1 className="help-main-title">
            <span className="gradient-text">Help & Support</span>
          </h1>
          <p className="help-subtitle">
            Tìm kiếm câu trả lời, liên hệ hỗ trợ hoặc khám phá các tính năng mới
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="help-nav">
        <div className="help-nav-container">
          <button 
            className={`nav-tab ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            <span className="tab-icon">
              <img src="/resource-icon.svg" alt="FAQ" />
            </span>
            FAQ
          </button>
          <button 
            className={`nav-tab ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <span className="tab-icon">
              <img src="/gmail-icon.svg" alt="Contact" />
            </span>
            Liên hệ
          </button>
          <button 
            className={`nav-tab ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            <span className="tab-icon">
              <img src="/resource-icon.svg" alt="Resources" />
            </span>
            Tài nguyên
          </button>
          <button 
            className={`nav-tab ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            <span className="tab-icon">
              <img src="/facebook-icon.svg" alt="Social" />
            </span>
            Mạng xã hội
          </button>
          <button 
            className={`nav-tab ${activeTab === 'quick' ? 'active' : ''}`}
            onClick={() => setActiveTab('quick')}
          >
            <span className="tab-icon">
              <img src="/resource-icon.svg" alt="Quick" />
            </span>
            Liên hệ nhanh
          </button>
          <button 
            className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <span className="tab-icon">
              <img src="/resource-icon.svg" alt="About" />
            </span>
            Giới thiệu
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="help-main">
        <div className="help-container">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Câu hỏi thường gặp</h2>
                <p>Tìm câu trả lời cho những thắc mắc phổ biến</p>
              </div>
              <div className="faq-grid">
                {faqData.map((faq, index) => (
                  <div key={index} className="faq-card">
                    <div className="faq-icon">
                      <img src={faq.icon} alt="FAQ" />
                    </div>
                    <div className="faq-question">
                      <h3>{faq.question}</h3>
                    </div>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Liên hệ với chúng tôi</h2>
                <p>Gửi tin nhắn và chúng tôi sẽ phản hồi trong vòng 24h</p>
              </div>
              <div className="contact-grid">
                <div className="contact-form-container">
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Họ và tên</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập họ và tên của bạn"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Chủ đề</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="Tiêu đề tin nhắn"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Nội dung</label>
                      <textarea
                        id="message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleInputChange}
                        required
                        rows="5"
                        placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                      />
                    </div>
                    <button type="submit" className="submit-btn">
                      <span>Gửi tin nhắn</span>
                      <span className="btn-icon">→</span>
                    </button>
                  </form>
                </div>
                <div className="contact-info">
                  <div className="info-card">
                    <div className="info-icon">
                      <img src="/gmail-icon.svg" alt="Email" />
                    </div>
                    <h3>Email</h3>
                    <p>tranvanmanh9032005@gmail.com</p>
                  </div>
                  <div className="info-card">
                    <div className="info-icon">
                      <img src="/resource-icon.svg" alt="Address" />
                    </div>
                    <h3>Địa chỉ</h3>
                    <p>Hà Nội, Việt Nam</p>
                  </div>
                  <div className="info-card">
                    <div className="info-icon">
                      <img src="/resource-icon.svg" alt="Response Time" />
                    </div>
                    <h3>Thời gian phản hồi</h3>
                    <p>Trong vòng 24 giờ</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Tài nguyên hữu ích</h2>
                <p>Khám phá các công cụ và tài liệu hỗ trợ</p>
              </div>
              <div className="resources-grid">
                {quickLinks.map((link, index) => (
                  <div key={index} className="resource-card">
                    <div className="resource-icon">
                      <img src={link.icon} alt={link.title} />
                    </div>
                    <h3>{link.title}</h3>
                    <p>Khám phá thêm về {link.title.toLowerCase()}</p>
                    <button className="resource-btn">Truy cập</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Mạng xã hội</h2>
                <p>Kết nối và theo dõi tôi trên các nền tảng</p>
              </div>
              <div className="social-grid">
                {socialLinks.map((social, index) => (
                  <div key={index} className="social-card" onClick={() => window.open(social.link, '_blank')}>
                    <div className="social-icon">
                      <img src={social.icon} alt={social.title} />
                    </div>
                    <h3>{social.title}</h3>
                    <p>{social.description}</p>
                    <button className="social-btn">
                      <span>Truy cập</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Contact Tab */}
          {activeTab === 'quick' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Liên hệ nhanh</h2>
                <p>Các cách liên hệ trực tiếp và thông tin bổ sung</p>
              </div>
              <div className="quick-contact-grid">
                <div className="quick-card">
                  <div className="quick-icon">
                    <img src="/resource-icon.svg" alt="Phone" />
                  </div>
                  <h3>Điện thoại</h3>
                  <p>+84 123 456 789</p>
                  <button className="quick-btn" onClick={() => window.open('tel:+84123456789')}>
                    Gọi ngay
                  </button>
                </div>
                
                <div className="quick-card">
                  <div className="quick-icon">
                    <img src="/gmail-icon.svg" alt="Email" />
                  </div>
                  <h3>Email nhanh</h3>
                  <p>tranvanmanh9032005@gmail.com</p>
                  <button className="quick-btn" onClick={() => window.open('mailto:tranvanmanh9032005@gmail.com?subject=Liên hệ từ TodoList App')}>
                    Gửi email
                  </button>
                </div>
                
                <div className="quick-card">
                  <div className="quick-icon">
                    <img src="/resource-icon.svg" alt="Address" />
                  </div>
                  <h3>Địa chỉ</h3>
                  <p>Hà Nội, Việt Nam</p>
                  <button className="quick-btn" onClick={() => window.open('https://maps.google.com/?q=Hanoi,Vietnam')}>
                    Xem bản đồ
                  </button>
                </div>
                
                <div className="quick-card">
                  <div className="quick-icon">
                    <img src="/resource-icon.svg" alt="Working Hours" />
                  </div>
                  <h3>Giờ làm việc</h3>
                  <p>Thứ 2 - Thứ 6: 9:00 - 18:00</p>
                  <p>Thứ 7: 9:00 - 12:00</p>
                </div>
                
                <div className="quick-card">
                  <div className="quick-icon">
                    <img src="/facebook-icon.svg" alt="Chat" />
                  </div>
                  <h3>Chat trực tiếp</h3>
                  <p>Phản hồi trong vòng 5 phút</p>
                  <button className="quick-btn" onClick={() => window.open('https://m.me/tranvanmanh9325')}>
                    Chat Facebook
                  </button>
                </div>
                
                <div className="quick-card">
                  <div className="quick-icon">
                    <img src="/resource-icon.svg" alt="CV" />
                  </div>
                  <h3>CV/Resume</h3>
                  <p>Tải xuống CV của tôi</p>
                  <button className="quick-btn" onClick={() => window.open('https://drive.google.com/file/d/your-cv-link')}>
                    Tải CV
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Về ứng dụng</h2>
                <p>Thông tin về dự án và người phát triển</p>
              </div>
              <div className="about-content">
                <div className="about-card">
                  <div className="about-icon">
                    <img src="/resource-icon.svg" alt="App" />
                  </div>
                  <h3>TodoList App</h3>
                  <p>Ứng dụng quản lý công việc hiện đại, được phát triển với React và Spring Boot. 
                     Giúp bạn tổ chức công việc một cách hiệu quả và khoa học.</p>
                </div>
                <div className="about-card">
                  <div className="about-icon">
                    <img src="/github-icon.svg" alt="Developer" />
                  </div>
                  <h3>Người phát triển</h3>
                  <p><strong>Trần Văn Mạnh</strong><br/>
                     Backend Developer<br/>
                     Email: tranvanmanh9032005@gmail.com<br/>
                     GitHub: @tranvanmanh9325</p>
                </div>
                <div className="about-card">
                  <div className="about-icon">
                    <img src="/resource-icon.svg" alt="Tech Stack" />
                  </div>
                  <h3>Công nghệ sử dụng</h3>
                  <div className="tech-stack">
                    <span className="tech-tag">React</span>
                    <span className="tech-tag">Spring Boot</span>
                    <span className="tech-tag">PostgreSQL</span>
                    <span className="tech-tag">JWT</span>
                    <span className="tech-tag">Docker</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bookmark-fullwidth">
        <Footer />
      </div>
    </div>
  );
};

export default Help;