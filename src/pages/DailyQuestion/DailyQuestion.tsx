import { useEffect, useState } from 'react';
import { Calendar, Trophy, Clock, Users, TrendingUp, ExternalLink, CheckCircle2, PlayCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import { supabase } from '../../lib/supabase';
import { striverSheetComplete } from '../../data/striverSheetComplete';
import type { Problem } from '../../types';
import './DailyQuestion.css';

interface DailyQuestionData {
  id: string;
  problem_id: string;
  problem_title: string;
  difficulty: string;
  topic_id: string;
  url: string;
  patterns: string[];
  date: string;
  user_solved: boolean;
  solved_at: string | null;
}

interface DailyQuestionStats {
  total_attempts: number;
  total_solved: number;
  solve_percentage: number;
}

export default function DailyQuestion() {
  const { user } = useAuth();
  const { updateProblemStatus } = useProgress();
  const [dailyQuestion, setDailyQuestion] = useState<DailyQuestionData | null>(null);
  const [stats, setStats] = useState<DailyQuestionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [solving, setSolving] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [problemDetails, setProblemDetails] = useState<Problem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDailyQuestion();
    
    // Real-time subscription for daily question changes
    const channel = supabase
      .channel('daily-question-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_questions'
        },
        (payload) => {
          console.log('📅 Daily question updated:', payload);
          fetchDailyQuestion();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_question_submissions'
        },
        (payload) => {
          console.log('📊 Submission updated:', payload);
          if (dailyQuestion) {
            fetchDailyQuestionStats();
          }
        }
      )
      .subscribe();

    // Check for new day every minute and auto-generate new question
    const dateCheckInterval = setInterval(() => {
      const currentDate = new Date().toDateString();
      const questionDate = dailyQuestion ? new Date(dailyQuestion.date).toDateString() : null;
      
      if (questionDate && currentDate !== questionDate) {
        console.log('🌅 New day detected! Generating new daily question...');
        fetchDailyQuestion();
      }
    }, 60000); // Check every minute

    return () => {
      supabase.removeChannel(channel);
      clearInterval(dateCheckInterval);
    };
  }, [user]);

  useEffect(() => {
    if (dailyQuestion) {
      fetchDailyQuestionStats();
      // Find full problem details
      const problem = striverSheetComplete.find(p => p.id === dailyQuestion.problem_id);
      setProblemDetails(problem || null);
    }
  }, [dailyQuestion]);

  // Auto-generate daily question if none exists for today
  const generateDailyQuestion = async () => {
    try {
      console.log('🎲 Generating daily question for today...');
      
      // Generate a new random question
      const randomProblem = striverSheetComplete[
        Math.floor(Math.random() * striverSheetComplete.length)
      ];

      console.log('🎲 Selected problem:', randomProblem.title);

      // Use the generate_daily_question function
      const { data, error } = await supabase
        .rpc('generate_daily_question', {
          p_problem_id: randomProblem.id,
          p_problem_title: randomProblem.title,
          p_difficulty: randomProblem.difficulty,
          p_topic_id: randomProblem.topicId,
          p_url: randomProblem.url,
          p_patterns: randomProblem.patterns || []
        });

      if (error) {
        console.error('❌ Error generating daily question:', error);
        throw error;
      }

      console.log('✅ Daily question generated:', data);
      return data;
    } catch (error) {
      console.error('❌ Exception in generateDailyQuestion:', error);
      return null;
    }
  };

  const fetchDailyQuestion = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📅 Fetching daily question...');
      console.log('📅 User logged in:', !!user);

      // First try to get today's daily question
      const { data, error } = await supabase
        .rpc('get_daily_question');

      if (error) {
        console.error('❌ Error fetching daily question:', error);
        console.error('❌ Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        setError(`Database error: ${error.message}. Check console for details.`);
        setLoading(false);
        return;
      }

      console.log('📅 Daily question data:', data);

      if (!data || data.length === 0) {
        console.log('📅 No question found for today, generating...');
        // Generate a new daily question
        const newQuestion = await generateDailyQuestion();
        
        if (newQuestion && newQuestion.success) {
          console.log('✅ Question generated, fetching again...');
          // Wait a moment for the database to commit
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Fetch again after generation
          const { data: retryData, error: retryError } = await supabase
            .rpc('get_daily_question');
          
          if (!retryError && retryData && retryData.length > 0) {
            console.log('✅ Successfully fetched generated question:', retryData[0]);
            setDailyQuestion(retryData[0]);
          } else {
            console.error('❌ Failed to fetch after generation:', retryError);
            setError('Generated question but failed to fetch it. Try refreshing.');
          }
        } else {
          console.error('❌ Failed to generate daily question:', newQuestion);
          setError('Failed to generate daily question. Check console for details.');
        }
      } else {
        console.log('✅ Daily question loaded:', data[0]);
        setDailyQuestion(data[0]);
      }
    } catch (error: any) {
      console.error('❌ Exception in fetchDailyQuestion:', error);
      setError(`Error: ${error.message || 'Unknown error'}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyQuestionStats = async () => {
    if (!dailyQuestion) return;

    try {
      const { data, error } = await supabase
        .rpc('get_daily_question_stats', {
          p_daily_question_id: dailyQuestion.id
        });

      if (error) throw error;

      if (data && data.length > 0) {
        setStats({
          total_attempts: Number(data[0].total_attempts),
          total_solved: Number(data[0].total_solved),
          solve_percentage: Number(data[0].solve_percentage)
        });
      }
    } catch (error) {
      console.error('Error fetching daily question stats:', error);
    }
  };

  const handleMarkAsSolved = async () => {
    if (!user || !dailyQuestion) return;

    try {
      setSolving(true);

      // Submit to daily_question_submissions
      const { error } = await supabase
        .rpc('submit_daily_question', {
          p_daily_question_id: dailyQuestion.id,
          p_problem_id: dailyQuestion.problem_id,
          p_status: 'solved',
          p_time_spent: 0
        });

      if (error) throw error;

      // Also mark in regular problem_submissions for tracking
      if (problemDetails) {
        updateProblemStatus(problemDetails.id, 'solved');
      }

      // Update local state
      setDailyQuestion({ ...dailyQuestion, user_solved: true, solved_at: new Date().toISOString() });
      setShowCongrats(true);
      
      // Refresh stats
      await fetchDailyQuestionStats();

      // Hide congrats after 3 seconds
      setTimeout(() => setShowCongrats(false), 3000);
    } catch (error) {
      console.error('Error marking daily question as solved:', error);
      alert('Failed to mark as solved. Please try again.');
    } finally {
      setSolving(false);
    }
  };

  const getDifficultyBadgeClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'badge-easy';
      case 'Medium': return 'badge-medium';
      case 'Hard': return 'badge-hard';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="daily-question-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading today's challenge...</p>
        </div>
      </div>
    );
  }

  if (!dailyQuestion) {
    return (
      <div className="daily-question-page">
        <div className="empty-state">
          <Calendar size={64} />
          <h2>No Daily Question Available</h2>
          <p>There was an issue loading today's question.</p>
          {error && (
            <div className="error-box">
              <p className="error-message">{error}</p>
              <details style={{ marginTop: '1rem', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#6366f1' }}>Debug Information</summary>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  <p><strong>User:</strong> {user ? '✅ Logged in' : '❌ Not logged in'}</p>
                  <p><strong>What to check:</strong></p>
                  <ol style={{ paddingLeft: '1.5rem' }}>
                    <li>Open browser console (F12) and look for errors</li>
                    <li>Verify database schema is installed (check Supabase)</li>
                    <li>Run this in Supabase SQL Editor: <code>SELECT * FROM get_daily_question();</code></li>
                  </ol>
                </div>
              </details>
            </div>
          )}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={fetchDailyQuestion} className="btn btn-primary">
              Try Again
            </button>
            <button 
              onClick={async () => {
                console.log('🎲 Manual generation triggered');
                await generateDailyQuestion();
                await fetchDailyQuestion();
              }} 
              className="btn btn-success"
            >
              Generate Question Manually
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="daily-question-page">
      {showCongrats && (
        <div className="congrats-banner">
          <CheckCircle2 size={24} />
          <span>🎉 Congratulations! You solved today's challenge!</span>
        </div>
      )}

      <div className="daily-question-container">
        {/* Header */}
        <div className="daily-header">
          <div className="header-content">
            <div className="header-icon">
              <Calendar size={32} />
            </div>
            <div className="header-text">
              <h1>Problem of the Day</h1>
              <p className="subtitle">
                {new Date(dailyQuestion.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          {dailyQuestion.user_solved && (
            <div className="solved-badge">
              <CheckCircle2 size={20} />
              <span>Solved</span>
            </div>
          )}
        </div>

        {/* Problem Card */}
        <div className="problem-card">
          <div className="problem-header">
            <h2 className="problem-title">{dailyQuestion.problem_title}</h2>
            <span className={`difficulty-badge ${getDifficultyBadgeClass(dailyQuestion.difficulty)}`}>
              {dailyQuestion.difficulty}
            </span>
          </div>

          <div className="problem-meta">
            <div className="meta-item">
              <span className="meta-label">Topic:</span>
              <span className="meta-value">{dailyQuestion.topic_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
            {dailyQuestion.patterns && dailyQuestion.patterns.length > 0 && (
              <div className="meta-item">
                <span className="meta-label">Patterns:</span>
                <div className="patterns-list">
                  {dailyQuestion.patterns.map((pattern, idx) => (
                    <span key={idx} className="pattern-tag">{pattern}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="problem-actions">
            <a 
              href={dailyQuestion.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <PlayCircle size={20} />
              Solve on LeetCode
              <ExternalLink size={16} />
            </a>
            
            {user && !dailyQuestion.user_solved && (
              <button 
                onClick={handleMarkAsSolved}
                disabled={solving}
                className="btn btn-success"
              >
                <CheckCircle2 size={20} />
                {solving ? 'Marking...' : 'Mark as Solved'}
              </button>
            )}
          </div>

          {dailyQuestion.user_solved && dailyQuestion.solved_at && (
            <div className="solved-info">
              <Clock size={16} />
              <span>
                Solved on {new Date(dailyQuestion.solved_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="stats-section">
            <h3>Community Stats</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.total_attempts}</div>
                  <div className="stat-label">Total Attempts</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Trophy size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.total_solved}</div>
                  <div className="stat-label">Solved</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.solve_percentage.toFixed(1)}%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="tips-section">
          <h3>💡 Tips for Success</h3>
          <ul className="tips-list">
            <li>Read the problem carefully and understand all constraints</li>
            <li>Think about edge cases before you start coding</li>
            <li>Start with a brute force approach, then optimize</li>
            <li>Test your solution with multiple test cases</li>
            <li>Come back tomorrow for a new challenge!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
