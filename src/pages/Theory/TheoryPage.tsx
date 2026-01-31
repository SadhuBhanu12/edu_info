import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, BookOpen, Video, Image, Code, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { topics } from '../../data/topics';
import { learningModules } from '../../data/learningModules';
import { useProgress } from '../../context/ProgressContext';
import './TheoryPage.css';

export default function TheoryPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { markTheoryComplete, getTopicProgress } = useProgress();
  
  const [activeTab, setActiveTab] = useState<'theory' | 'animations' | 'videos'>('theory');
  const [currentAnimationStep, setCurrentAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [timeSpent, setTimeSpent] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const topic = topics.find(t => t.id === topicId);
  const learningModule = topicId ? learningModules[topicId] : undefined;
  const progress = topicId ? getTopicProgress(topicId) : undefined;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Track every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isPlaying && learningModule) {
      const interval = setInterval(() => {
        setCurrentAnimationStep(prev => {
          if (prev >= learningModule.animationSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / playbackSpeed);

      return () => clearInterval(interval);
    }
  }, [isPlaying, playbackSpeed, learningModule]);

  if (!topic || !learningModule) {
    return (
      <div className="theory-page-error">
        <h2>Theory module not found</h2>
        <button onClick={() => navigate('/course/topics')}>Back to Topics</button>
      </div>
    );
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleMarkComplete = () => {
    if (topicId) {
      markTheoryComplete(topicId);
      navigate(`/course/topics/${topicId}`);
    }
  };

  const currentAnimation = learningModule.animationSteps[currentAnimationStep];

  return (
    <div className="theory-page">
      {/* Header */}
      <div className="theory-header">
        <button className="back-btn" onClick={() => navigate(`/course/topics/${topicId}`)}>
          <ArrowLeft size={20} />
          Back to Topic
        </button>
        <div className="theory-header-content">
          <h1>{topic.name} - Theory & Animations</h1>
          <div className="theory-meta">
            <span className="time-badge">
              <Clock size={16} />
              {timeSpent} min spent
            </span>
            {progress?.theoryCompleted && (
              <span className="completed-badge">
                <CheckCircle2 size={16} />
                Completed
              </span>
            )}
          </div>
        </div>
        {!progress?.theoryCompleted && (
          <button className="mark-complete-btn" onClick={handleMarkComplete}>
            <CheckCircle2 size={20} />
            Mark Complete
          </button>
        )}
      </div>

      {/* Main Layout */}
      <div className="theory-layout">
        {/* Left Sidebar - Navigation */}
        <aside className="theory-sidebar">
          <nav className="theory-nav">
            <h3>📚 Content</h3>
            <button 
              className={expandedSections.has('overview') ? 'active' : ''}
              onClick={() => toggleSection('overview')}
            >
              <BookOpen size={16} />
              Concept Overview
            </button>
            <button 
              className={expandedSections.has('why') ? 'active' : ''}
              onClick={() => toggleSection('why')}
            >
              <BookOpen size={16} />
              Why It Matters
            </button>
            <button 
              className={expandedSections.has('core') ? 'active' : ''}
              onClick={() => toggleSection('core')}
            >
              <BookOpen size={16} />
              Core Explanation
            </button>
            <button 
              className={expandedSections.has('diagrams') ? 'active' : ''}
              onClick={() => toggleSection('diagrams')}
            >
              <Image size={16} />
              Visual Diagrams
            </button>
            <button 
              className={expandedSections.has('complexity') ? 'active' : ''}
              onClick={() => toggleSection('complexity')}
            >
              <Code size={16} />
              Time & Space Complexity
            </button>
            <button 
              className={expandedSections.has('mistakes') ? 'active' : ''}
              onClick={() => toggleSection('mistakes')}
            >
              <BookOpen size={16} />
              Common Mistakes
            </button>
            <button 
              className={expandedSections.has('resources') ? 'active' : ''}
              onClick={() => toggleSection('resources')}
            >
              <BookOpen size={16} />
              Learning Resources
            </button>
          </nav>
        </aside>

        {/* Center Panel - Theory Content */}
        <main className="theory-content">
          <div className="theory-tabs">
            <button 
              className={activeTab === 'theory' ? 'active' : ''}
              onClick={() => setActiveTab('theory')}
            >
              <BookOpen size={18} />
              Theory
            </button>
            <button 
              className={activeTab === 'animations' ? 'active' : ''}
              onClick={() => setActiveTab('animations')}
            >
              <Play size={18} />
              Animations
            </button>
            <button 
              className={activeTab === 'videos' ? 'active' : ''}
              onClick={() => setActiveTab('videos')}
            >
              <Video size={18} />
              Videos
            </button>
          </div>

          {activeTab === 'theory' && (
            <div className="theory-text">
              {expandedSections.has('overview') && (
                <section className="theory-section">
                  <h2>📘 Concept Overview</h2>
                  <p>{learningModule.conceptOverview}</p>
                </section>
              )}

              {expandedSections.has('why') && (
                <section className="theory-section">
                  <h2>🎯 Why This Topic Matters</h2>
                  <div dangerouslySetInnerHTML={{ __html: learningModule.whyItMatters.replace(/\n/g, '<br/>') }} />
                </section>
              )}

              {expandedSections.has('core') && (
                <section className="theory-section">
                  <h2>💡 Core Explanation</h2>
                  <div dangerouslySetInnerHTML={{ __html: learningModule.coreExplanation.replace(/\n/g, '<br/>') }} />
                </section>
              )}

              {expandedSections.has('diagrams') && (
                <section className="theory-section">
                  <h2>📊 Visual Diagrams</h2>
                  <div className="diagrams-grid">
                    {learningModule.visualDiagrams.map(diagram => (
                      <div key={diagram.id} className="diagram-card">
                        <h3>{diagram.title}</h3>
                        <p>{diagram.description}</p>
                        {diagram.svgContent ? (
                          <div dangerouslySetInnerHTML={{ __html: diagram.svgContent }} />
                        ) : diagram.imageUrl && (
                          <img src={diagram.imageUrl} alt={diagram.title} />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {expandedSections.has('complexity') && (
                <section className="theory-section">
                  <h2>⏱️ Time & Space Complexity</h2>
                  <div className="complexity-box">
                    <div>
                      <h4>Time Complexity</h4>
                      <div dangerouslySetInnerHTML={{ __html: learningModule.timeComplexity.replace(/\n/g, '<br/>') }} />
                    </div>
                    <div>
                      <h4>Space Complexity</h4>
                      <div dangerouslySetInnerHTML={{ __html: learningModule.spaceComplexity.replace(/\n/g, '<br/>') }} />
                    </div>
                  </div>
                </section>
              )}

              {expandedSections.has('mistakes') && (
                <section className="theory-section">
                  <h2>⚠️ Common Mistakes</h2>
                  <ul className="mistakes-list">
                    {learningModule.commonMistakes.map((mistake, idx) => (
                      <li key={idx}>{mistake}</li>
                    ))}
                  </ul>
                  <h3>✅ Best Practices</h3>
                  <ul className="practices-list">
                    {learningModule.bestPractices.map((practice, idx) => (
                      <li key={idx}>{practice}</li>
                    ))}
                  </ul>
                </section>
              )}

              {expandedSections.has('resources') && (
                <section className="theory-section">
                  <h2>📚 Learning Resources</h2>
                  <div className="resources-grid">
                    {learningModule.resources.map((resource, idx) => (
                      <a 
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`resource-card ${resource.type}`}
                      >
                        <span className="resource-type">{resource.type}</span>
                        <h4>{resource.title}</h4>
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'animations' && (
            <div className="animations-panel">
              <div className="animation-display">
                <div className="animation-step-info">
                  <h3>Step {currentAnimationStep + 1} of {learningModule.animationSteps.length}</h3>
                  <p>{currentAnimation.description}</p>
                </div>
                {currentAnimation.code && (
                  <pre className="code-block">
                    <code>{currentAnimation.code}</code>
                  </pre>
                )}
              </div>

              <div className="animation-controls">
                <button onClick={() => setCurrentAnimationStep(Math.max(0, currentAnimationStep - 1))}>
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={() => setCurrentAnimationStep(0)}>
                  <RotateCcw size={20} />
                </button>
                <button onClick={() => setCurrentAnimationStep(Math.min(learningModule.animationSteps.length - 1, currentAnimationStep + 1))}>
                  <ChevronRight size={20} />
                </button>
                <select 
                  value={playbackSpeed} 
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="speed-control"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="videos-panel">
              {learningModule.embeddedVideos.map(video => (
                <div key={video.id} className="video-card">
                  <h3>{video.title}</h3>
                  <p className="video-duration">{video.duration}</p>
                  <div className="video-container">
                    <iframe
                      src={video.url}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Right Panel - Quick Reference */}
        <aside className="theory-right-panel">
          <div className="quick-reference">
            <h3>🚀 Quick Reference</h3>
            <div className="ref-box">
              <h4>Topic Stats</h4>
              <p>Problems: {topic.problemIds.length}</p>
              <p>Est. Time: {topic.estimatedHours}h</p>
              <p>Difficulty Mix</p>
            </div>
            <div className="ref-box">
              <h4>Your Progress</h4>
              <p>Theory: {progress?.theoryCompleted ? '✅ Done' : '⏳ In Progress'}</p>
              <p>Time Spent: {timeSpent} min</p>
              <p>Readiness: {progress?.conceptReadinessScore || 0}%</p>
            </div>
            <button 
              className="practice-btn"
              onClick={() => navigate(`/course/topics/${topicId}`)}
            >
              Start Practice →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
