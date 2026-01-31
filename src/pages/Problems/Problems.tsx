import { useState } from 'react';
import { Target, Search, Filter, BookOpen } from 'lucide-react';
import { ProblemCard } from '../../components/Cards';
import { striverSheetComplete } from '../../data/striverSheetComplete';
import { useProgress } from '../../context/ProgressContext';
import type { Difficulty, ProblemStatus, Platform } from '../../types';
import './Problems.css';

export function Problems() {
  const { getProblemProgress } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ProblemStatus | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');

  // Use complete Striver sheet with 1680 questions
  const allProblems = striverSheetComplete;

  const filteredProblems = allProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.patterns.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'all' || problem.difficulty === difficultyFilter;
    const matchesPlatform = platformFilter === 'all' || problem.platform === platformFilter;
    const matchesTopic = topicFilter === 'all' || problem.topicId === topicFilter;
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      const progress = getProblemProgress(problem.id);
      matchesStatus = progress?.status === statusFilter || (!progress && statusFilter === 'unsolved');
    }

    return matchesSearch && matchesDifficulty && matchesStatus && matchesPlatform && matchesTopic;
  });

  const getFilterCounts = () => {
    const counts = {
      all: allProblems.length,
      unsolved: 0,
      solved: 0,
      revision: 0,
    };

    allProblems.forEach(problem => {
      const progress = getProblemProgress(problem.id);
      const status = progress?.status || 'unsolved';
      counts[status]++;
    });

    return counts;
  };

  const counts = getFilterCounts();

  return (
    <div className="problems-page">
      <header className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">
            <BookOpen className="title-icon" />
            Striver DSA Sheet - Complete
          </h1>
          <p className="page-description">
            🔥 All 1,680 Questions with Direct LeetCode Links | Updated: January 11, 2026
          </p>
        </div>
        <div className="stats-badges">
          <span className="stat-badge total">
            📚 {allProblems.length} Total Problems
          </span>
          <span className="stat-badge solved">
            ✅ {counts.solved} Solved
          </span>
          <span className="stat-badge progress">
            📊 {((counts.solved / allProblems.length) * 100).toFixed(1)}% Complete
          </span>
        </div>
      </header>

      <div className="filters-section">
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search problems by name or pattern..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-group">
          <div className="filter-group">
            <Filter size={16} className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProblemStatus | 'all')}
              className="filter-select"
            >
              <option value="all">All Status ({counts.all})</option>
              <option value="unsolved">Unsolved ({counts.unsolved})</option>
              <option value="solved">Solved ({counts.solved})</option>
              <option value="revision">Revision ({counts.revision})</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | 'all')}
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
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as Platform | 'all')}
              className="filter-select"
            >
              <option value="all">All Platforms</option>
              <option value="LeetCode">🔶 LeetCode</option>
              <option value="GeeksForGeeks">🟢 GeeksForGeeks</option>
              <option value="CodeStudio">CodeStudio</option>
              <option value="InterviewBit">InterviewBit</option>
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
        </div>
      </div>

      <div className="problems-results">
        <div className="results-header">
          <span className="results-count">
            {filteredProblems.length} {filteredProblems.length === 1 ? 'problem' : 'problems'}
          </span>
          {(searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all' || platformFilter !== 'all' || topicFilter !== 'all') && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setDifficultyFilter('all');
                setPlatformFilter('all');
                setTopicFilter('all');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredProblems.length > 0 ? (
          <div className="problems-list">
            {filteredProblems.map(problem => (
              <ProblemCard key={problem.id} problem={problem} showTopic />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Target size={48} className="empty-icon" />
            <h3 className="empty-title">No problems found</h3>
            <p className="empty-description">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
