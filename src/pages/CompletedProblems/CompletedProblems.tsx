import { useState, useEffect } from 'react';
import { CheckCircle, Calendar, Clock, Star, TrendingUp, Filter, Search, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { striverSheetComplete } from '../../data/striverSheetComplete';
import './CompletedProblems.css';

interface CompletedSubmission {
  id: string;
  problem_id: string;
  problem_title: string;
  difficulty: string;
  topic_id: string;
  confidence: number;
  solved_at: string;
  attempts: number;
  time_spent: number;
}

export function CompletedProblems() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<CompletedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'confidence' | 'difficulty'>('recent');

  useEffect(() => {
    if (!user) return;

    const fetchCompletedProblems = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('problem_submissions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'solved')
          .not('solved_at', 'is', null)
          .order('solved_at', { ascending: false });

        if (error) {
          console.error('Error fetching completed problems:', error);
        } else {
          setSubmissions(data || []);
        }
      } catch (error) {
        console.error('Error in fetchCompletedProblems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedProblems();
  }, [user]);

  const filteredSubmissions = submissions
    .filter(sub => {
      const matchesSearch = sub.problem_title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || sub.difficulty === difficultyFilter;
      const matchesTopic = topicFilter === 'all' || sub.topic_id === topicFilter;
      return matchesSearch && matchesDifficulty && matchesTopic;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.solved_at).getTime() - new Date(a.solved_at).getTime();
      } else if (sortBy === 'confidence') {
        return b.confidence - a.confidence;
      } else {
        const difficultyOrder = { 'Hard': 3, 'Medium': 2, 'Easy': 1 };
        return (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0) - 
               (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0);
      }
    });

  const stats = {
    total: submissions.length,
    easy: submissions.filter(s => s.difficulty === 'Easy').length,
    medium: submissions.filter(s => s.difficulty === 'Medium').length,
    hard: submissions.filter(s => s.difficulty === 'Hard').length,
    avgConfidence: submissions.length > 0 
      ? (submissions.reduce((sum, s) => sum + s.confidence, 0) / submissions.length).toFixed(1)
      : '0',
    thisWeek: submissions.filter(s => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(s.solved_at) > weekAgo;
    }).length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="completed-problems-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="completed-problems-page">
      <header className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">
            <Award className="title-icon" />
            Completed Problems
          </h1>
          <p className="page-description">
            🎉 Your journey of solved problems with timestamps and achievements
          </p>
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <CheckCircle size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Solved</div>
          </div>
        </div>

        <div className="stat-card difficulty">
          <div className="stat-icon">
            <TrendingUp size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-breakdown">
              <span className="easy">{stats.easy} Easy</span>
              <span className="medium">{stats.medium} Med</span>
              <span className="hard">{stats.hard} Hard</span>
            </div>
            <div className="stat-label">By Difficulty</div>
          </div>
        </div>

        <div className="stat-card confidence">
          <div className="stat-icon">
            <Star size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.avgConfidence}/5</div>
            <div className="stat-label">Avg Confidence</div>
          </div>
        </div>

        <div className="stat-card weekly">
          <div className="stat-icon">
            <Calendar size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.thisWeek}</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search completed problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-group">
          <div className="filter-group">
            <Filter size={16} className="filter-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="filter-select"
            >
              <option value="recent">Most Recent</option>
              <option value="confidence">Highest Confidence</option>
              <option value="difficulty">Hardest First</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Topics</option>
              <option value="arrays-strings">📊 Arrays & Strings</option>
              <option value="linked-lists">🔗 Linked Lists</option>
              <option value="stacks-queues">📚 Stacks & Queues</option>
              <option value="trees-graphs">🌳 Trees & Graphs</option>
              <option value="dynamic-programming">⚡ Dynamic Programming</option>
              <option value="sorting-searching">🔍 Sorting & Searching</option>
            </select>
          </div>

          {(searchQuery || difficultyFilter !== 'all' || topicFilter !== 'all') && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setDifficultyFilter('all');
                setTopicFilter('all');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <div className="results-header">
          <span className="results-count">
            {filteredSubmissions.length} {filteredSubmissions.length === 1 ? 'problem' : 'problems'}
          </span>
        </div>

        {filteredSubmissions.length > 0 ? (
          <div className="submissions-list">
            {filteredSubmissions.map((submission) => {
              const problem = striverSheetComplete.find(p => p.id === submission.problem_id);
              
              return (
                <div key={submission.id} className="submission-card">
                  <div className="submission-header">
                    <div className="submission-info">
                      <h3 className="submission-title">{submission.problem_title}</h3>
                      <div className="submission-meta">
                        <span className={`difficulty-badge ${submission.difficulty.toLowerCase()}`}>
                          {submission.difficulty}
                        </span>
                        <span className="topic-badge">{submission.topic_id}</span>
                      </div>
                    </div>
                    <div className="submission-stats">
                      <div className="confidence-display">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            fill={star <= submission.confidence ? '#fbbf24' : 'none'}
                            className={star <= submission.confidence ? 'star-filled' : 'star-empty'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="submission-footer">
                    <div className="submission-time">
                      <Calendar size={14} />
                      <span>{formatDate(submission.solved_at)}</span>
                      <Clock size={14} />
                      <span>{formatTime(submission.solved_at)}</span>
                    </div>
                    {submission.attempts > 1 && (
                      <div className="attempts-badge">
                        {submission.attempts} attempts
                      </div>
                    )}
                    {problem && (
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="solve-again-btn"
                      >
                        Solve Again →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <CheckCircle size={64} className="empty-icon" />
            <h3 className="empty-title">
              {submissions.length === 0 ? 'No completed problems yet' : 'No problems found'}
            </h3>
            <p className="empty-description">
              {submissions.length === 0 
                ? 'Start solving problems to see your achievements here!'
                : 'Try adjusting your filters or search query'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
