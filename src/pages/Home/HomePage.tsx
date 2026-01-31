import { Link } from 'react-router-dom';
import { BookOpen, Video, GraduationCap, TrendingUp, Target, Code, Award, Users, Clock } from 'lucide-react';
import { ScrollToTop } from '../../components/ScrollToTop';
import { ProgressBar } from '../../components/ProgressBar';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <ProgressBar />
      {/* Professional Header */}
      <header className="home-header">
        <div className="home-header-container">
          <Link to="/" className="home-logo">
            <div className="home-logo-icon">
              <GraduationCap size={24} strokeWidth={2.5} />
            </div>
            <div className="home-logo-content">
              <span className="home-logo-title">DSA Tracker</span>
              <span className="home-logo-subtitle">Master Data Structures</span>
            </div>
          </Link>
          <nav className="home-nav">
            <a href="#home" className="home-nav-link">Home</a>
            <a href="#features" className="home-nav-link">Features</a>
            <a href="#courses" className="home-nav-link">Courses</a>
            <a href="#about" className="home-nav-link">About</a>
          </nav>
          <div className="home-actions">
            <Link to="/login" className="home-btn-login">Sign In</Link>
            <Link to="/signup" className="home-btn-signup">
              Get Started
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">EDUINFO</h1>
          <p className="hero-tagline">
            Your Complete Learning Platform for Technical Mastery
          </p>
          <p className="hero-description">
            Master in-demand technical skills through structured courses, interactive animations, 
            and real-world practice. Start with our comprehensive Data Structures & Algorithms course.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn-primary">
              Start Learning Free
            </Link>
            <a href="#courses" className="btn-secondary">
              Browse Courses
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <Award size={20} />
              <span>1,680+ Problems</span>
            </div>
            <div className="stat-item">
              <Users size={20} />
              <span>Interactive Learning</span>
            </div>
            <div className="stat-item">
              <Clock size={20} />
              <span>Learn at Your Pace</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <Code size={32} />
            <span>DSA Mastery</span>
          </div>
          <div className="floating-card card-2">
            <Target size={32} />
            <span>Track Progress</span>
          </div>
          <div className="floating-card card-3">
            <GraduationCap size={32} />
            <span>Learn Smart</span>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="highlights-section">
        <h2 className="section-title">Why Choose EDUINFO?</h2>
        <div className="highlights-grid">
          <div className="highlight-card">
            <div className="highlight-icon">
              <BookOpen size={40} />
            </div>
            <h3>Structured Learning Paths</h3>
            <p>Follow expertly designed curricula that guide you from fundamentals to advanced concepts.</p>
          </div>
          
          <div className="highlight-card">
            <div className="highlight-icon">
              <Video size={40} />
            </div>
            <h3>Interactive Animations</h3>
            <p>Visualize complex concepts through interactive animations and step-by-step explanations.</p>
          </div>
          
          <div className="highlight-card">
            <div className="highlight-icon">
              <Code size={40} />
            </div>
            <h3>Real-World Practice</h3>
            <p>Solve 1,680+ curated problems from LeetCode and GeeksforGeeks with detailed solutions.</p>
          </div>
          
          <div className="highlight-card">
            <div className="highlight-icon">
              <TrendingUp size={40} />
            </div>
            <h3>Progress Analytics</h3>
            <p>Track your learning journey with comprehensive analytics and personalized insights.</p>
          </div>
          
          <div className="highlight-card">
            <div className="highlight-icon">
              <Target size={40} />
            </div>
            <h3>Interview Ready</h3>
            <p>Prepare effectively for technical interviews with industry-standard problem sets.</p>
          </div>
          
          <div className="highlight-card">
            <div className="highlight-icon">
              <Award size={40} />
            </div>
            <h3>Achievement System</h3>
            <p>Stay motivated with streaks, badges, and milestones as you progress through courses.</p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="courses-section">
        <h2 className="section-title">Available Courses</h2>
        <p className="section-subtitle">Start your learning journey with our flagship course, more coming soon!</p>
        
        <div className="course-card available">
          <div className="course-badge">Available Now</div>
          <div className="course-header">
            <div className="course-icon">
              <Code size={48} />
            </div>
            <div className="course-info">
              <h3>Data Structures & Algorithms</h3>
              <p className="course-subtitle">Complete DSA Mastery with Theory & Practice</p>
            </div>
          </div>
          <div className="course-features">
            <div className="feature-item">
              <span className="feature-number">8</span>
              <span className="feature-label">Core Topics</span>
            </div>
            <div className="feature-item">
              <span className="feature-number">60+</span>
              <span className="feature-label">Sub-topics</span>
            </div>
            <div className="feature-item">
              <span className="feature-number">1,680+</span>
              <span className="feature-label">Problems</span>
            </div>
          </div>
          <p className="course-description">
            Master fundamental data structures and algorithms through structured learning modules, 
            interactive animations, curated practice problems from LeetCode & GeeksforGeeks, and comprehensive analytics.
          </p>
          <Link to="/signup" className="course-btn">
            Start Learning Free
          </Link>
        </div>

        <div className="coming-soon-note">
          <GraduationCap size={24} />
          <p><strong>More courses coming soon!</strong> System Design, Web Development, Machine Learning, and more...</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-content">
          <h2 className="section-title">About EDUINFO</h2>
          <p className="about-text">
            EDUINFO is a modern learning platform designed to make technical education structured, 
            engaging, and effective. We combine theoretical knowledge with practical application, 
            interactive visualizations, and comprehensive progress tracking — providing learners with 
            everything they need to excel in their technical career.
          </p>
          <p className="about-text">
            Our mission is to democratize quality technical education by offering expertly crafted courses, 
            interactive learning tools, and personalized progress analytics — all in one secure, 
            user-friendly platform. Starting with Data Structures & Algorithms, we're expanding to cover 
            essential topics across software engineering and computer science.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>EDUINFO</h4>
            <p>Complete Learning Platform</p>
            <p>Master Technical Skills</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#courses">Courses</a>
            <a href="#about">About</a>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#terms">Terms & Conditions</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>support@eduinfo.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 EDUINFO. All rights reserved.</p>
        </div>
      </footer>
      <ScrollToTop />
    </div>
  );
};

export default HomePage;
