import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Code2, CheckCircle2, Lightbulb, AlertTriangle, Clock, Play } from 'lucide-react';
import { topics, problems } from '../../data/topics';
import { useProgress } from '../../context/ProgressContext';
import { ProblemCard } from '../../components/Cards';
import * as Icons from 'lucide-react';
import './TopicDetail.css';

export function TopicDetail() {
  const { topicId } = useParams<{ topicId: string }>();
  const { progress, markTheoryComplete, getTopicStats } = useProgress();
  const [activeTab, setActiveTab] = useState<'theory' | 'problems'>('theory');

  const topic = topics.find(t => t.id === topicId);
  
  if (!topic) {
    return <Navigate to="/course/topics" replace />;
  }

  const topicProblems = problems.filter(p => p.topicId === topic.id);
  const topicProgress = progress.topicsProgress[topic.id];
  const theoryCompleted = topicProgress?.theoryCompleted ?? false;
  const stats = getTopicStats(topic.id);

  const IconComponent = (Icons as any)[topic.icon] || Icons.BookOpen;

  const handleMarkTheoryComplete = () => {
    markTheoryComplete(topic.id);
  };

  return (
    <div className="topic-detail">
      <Link to="/course/topics" className="back-link">
        <ArrowLeft size={18} />
        <span>Back to Topics</span>
      </Link>

      <header className="topic-header" style={{ '--topic-color': topic.color } as React.CSSProperties}>
        <div className="topic-header-icon" style={{ background: `${topic.color}20`, color: topic.color }}>
          <IconComponent size={32} />
        </div>
        <div className="topic-header-content">
          <h1 className="topic-header-title">{topic.name}</h1>
          <p className="topic-header-description">{topic.description}</p>
          <div className="topic-header-meta">
            <span className="meta-item">
              <Clock size={16} />
              {topic.estimatedHours}h estimated
            </span>
            <span className="meta-item">
              <Code2 size={16} />
              {stats.solved} / {stats.total} problems solved
            </span>
            {theoryCompleted && (
              <span className="meta-badge">
                <CheckCircle2 size={16} />
                Theory Completed
              </span>
            )}
          </div>
        </div>
        <div className="topic-progress-circle">
          <svg viewBox="0 0 100 100" className="progress-svg">
            <circle className="progress-circle-bg" cx="50" cy="50" r="40" />
            <circle
              className="progress-circle-fill"
              cx="50"
              cy="50"
              r="40"
              style={{
                strokeDasharray: `${stats.percentage * 2.513} 251.3`,
                stroke: topic.color
              }}
            />
          </svg>
          <div className="progress-text">
            <span className="progress-value">{stats.percentage}%</span>
          </div>
        </div>
      </header>

      <div className="topic-tabs">
        <Link to={`/course/topics/${topicId}/theory`} className="tab-button learn-theory-btn">
          <BookOpen size={18} />
          📘 Learn Theory
        </Link>
        <Link to={`/course/topics/${topicId}/animation`} className="tab-button visual-animation-btn">
          <Play size={18} />
          🎬 Visual Animation
        </Link>
        <button
          className={`tab-button ${activeTab === 'theory' ? 'active' : ''}`}
          onClick={() => setActiveTab('theory')}
        >
          <BookOpen size={18} />
          Quick Theory
        </button>
        <button
          className={`tab-button ${activeTab === 'problems' ? 'active' : ''}`}
          onClick={() => setActiveTab('problems')}
        >
          <Code2 size={18} />
          🧩 Practice ({topicProblems.length})
        </button>
      </div>

      <div className="topic-content">
        {activeTab === 'theory' ? (
          <div className="theory-section">
            <div className="theory-overview">
              <h2 className="content-heading">
                <BookOpen className="heading-icon" />
                Overview
              </h2>
              <p className="theory-text">{topic.theory.overview}</p>
            </div>

            {topic.theory.sections.map((section) => (
              <div key={section.id} className="theory-section-card">
                <h3 className="section-title">{section.title}</h3>
                <p className="section-content">{section.content}</p>
                {section.codeExample && (
                  <div className="code-example">
                    <div className="code-header">
                      <Code2 size={14} />
                      <span>Code Example</span>
                    </div>
                    <pre className="code-block">
                      <code>{section.codeExample}</code>
                    </pre>
                  </div>
                )}
                {section.complexity && (
                  <div className="complexity-info">
                    <div className="complexity-item">
                      <span className="complexity-label">Time:</span>
                      <code className="complexity-value">{section.complexity.time}</code>
                    </div>
                    <div className="complexity-item">
                      <span className="complexity-label">Space:</span>
                      <code className="complexity-value">{section.complexity.space}</code>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="theory-tips">
              <div className="tips-card">
                <h3 className="tips-heading">
                  <Lightbulb className="tips-icon" />
                  Interview Tips
                </h3>
                <ul className="tips-list">
                  {topic.theory.interviewTips.map((tip, index) => (
                    <li key={index} className="tip-item">{tip}</li>
                  ))}
                </ul>
              </div>
              <div className="tips-card mistakes">
                <h3 className="tips-heading">
                  <AlertTriangle className="tips-icon" />
                  Common Mistakes
                </h3>
                <ul className="tips-list">
                  {topic.theory.commonMistakes.map((mistake, index) => (
                    <li key={index} className="tip-item">{mistake}</li>
                  ))}
                </ul>
              </div>
            </div>

            {!theoryCompleted && (
              <button className="complete-theory-btn" onClick={handleMarkTheoryComplete}>
                <CheckCircle2 size={20} />
                Mark Theory as Complete
              </button>
            )}
          </div>
        ) : (
          <div className="problems-section">
            <div className="problems-header">
              <h2 className="content-heading">
                <Code2 className="heading-icon" />
                Practice Problems
              </h2>
              <p className="problems-description">
                Solve these problems to master {topic.name}
              </p>
            </div>
            <div className="problems-list">
              {topicProblems.map(problem => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
