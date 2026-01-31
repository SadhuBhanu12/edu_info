import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import { Brain, Code, TrendingUp, Target, LogOut, BookOpen, Video, CheckCircle2 } from 'lucide-react';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const { progress, getTotalStats } = useProgress();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  
  const stats = getTotalStats();
  const solvedCount = stats.solved;

  // Calculate total theory time from all topics
  let totalTheoryTime = 0;
  Object.values(progress.topicsProgress).forEach((topicProgress: any) => {
    if (topicProgress.timeSpent) {
      totalTheoryTime += topicProgress.timeSpent;
    }
  });

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setUserName(user.user_metadata.full_name);
    } else if (user?.email) {
      setUserName(user.email.split('@')[0]);
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const totalProblems = stats.total;
  const completionPercentage = Math.round((solvedCount / totalProblems) * 100);

  const theoryHours = Math.floor(totalTheoryTime / 3600);
  const theoryMinutes = Math.floor((totalTheoryTime % 3600) / 60);

  return (
    <div className="user-dashboard-page">
      {/* Header */}
      <header className="user-dashboard-header">
        <div className="header-content">
          <Link to="/" className="logo">
            <Brain className="logo-icon" />
            <span className="logo-text">EDUINFO</span>
          </Link>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{userName}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="user-dashboard-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1>Welcome back, {userName}! 👋</h1>
          <p>Continue your learning journey and track your progress</p>
        </section>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon problems">
              <CheckCircle2 size={32} />
            </div>
            <div className="stat-info">
              <h3>{solvedCount}</h3>
              <p>Problems Solved</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completion">
              <TrendingUp size={32} />
            </div>
            <div className="stat-info">
              <h3>{completionPercentage}%</h3>
              <p>Completion Rate</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon time">
              <BookOpen size={32} />
            </div>
            <div className="stat-info">
              <h3>{theoryHours}h {theoryMinutes}m</h3>
              <p>Theory Time</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon topics">
              <Target size={32} />
            </div>
            <div className="stat-info">
              <h3>8</h3>
              <p>Topics Available</p>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <section className="courses-section">
          <h2 className="section-title">My Courses</h2>
          
          <div className="course-card-large">
            <div className="course-status-badge">
              <span className="status-dot active"></span>
              Active Course
            </div>

            <div className="course-main">
              <div className="course-icon-large">
                <Code size={48} />
              </div>
              <div className="course-details">
                <h3>Data Structures & Algorithms</h3>
                <p className="course-description">
                  Master fundamental data structures and algorithms through structured learning modules, 
                  animated explanations, and curated practice problems.
                </p>
                <div className="course-features-list">
                  <div className="feature-tag">
                    <BookOpen size={16} />
                    <span>8 Core Topics</span>
                  </div>
                  <div className="feature-tag">
                    <Code size={16} />
                    <span>60+ Problems</span>
                  </div>
                  <div className="feature-tag">
                    <Video size={16} />
                    <span>Video Tutorials</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="course-progress">
              <div className="progress-header">
                <span>Course Progress</span>
                <span className="progress-percentage">{completionPercentage}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="progress-stats">
                <span>{solvedCount} of {totalProblems} problems completed</span>
              </div>
            </div>

            {/* Action Button */}
            <Link to="/course/topics" className="continue-btn">
              Continue Learning
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2 className="section-title">Quick Access</h2>
          <div className="actions-grid">
            <Link to="/course/topics" className="action-card">
              <div className="action-icon">
                <Code size={24} />
              </div>
              <h3>Practice Problems</h3>
              <p>Solve curated DSA problems</p>
            </Link>

            <Link to="/course/topics" className="action-card">
              <div className="action-icon">
                <BookOpen size={24} />
              </div>
              <h3>Learn Theory</h3>
              <p>Study with visual explanations</p>
            </Link>

            <Link to="/course/analytics" className="action-card">
              <div className="action-icon">
                <TrendingUp size={24} />
              </div>
              <h3>Track Progress</h3>
              <p>View your learning analytics</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
