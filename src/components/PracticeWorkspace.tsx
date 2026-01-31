import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { topics } from '../data/topics';
import { striverSheet } from '../data/striverSheet';
import type { UserProgress, ProblemStatus } from '../types';
import { updateProblemStatus, updateProblemConfidence } from '../utils/storage';
import { getTopicInsights } from '../utils/analytics';
import { ArrowLeft, ExternalLink, CheckCircle2, Circle, BookmarkPlus } from 'lucide-react';

interface PracticeWorkspaceProps {
  progress: UserProgress;
  onProgressUpdate: (progress: UserProgress) => void;
}

export function PracticeWorkspace({ progress, onProgressUpdate }: PracticeWorkspaceProps) {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topics.find(t => t.id === topicId);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  if (!topic || !topicId) {
    return <div>Topic not found</div>;
  }

  const topicProgress = progress.topicsProgress[topicId];
  const problems = topic.problemIds.map(id => ({
    problem: striverSheet.find(p => p.id === id)!,
    progress: topicProgress.problemsProgress[id]
  }));

  const selectedProblem = selectedProblemId
    ? problems.find(p => p.problem.id === selectedProblemId)
    : problems[0];

  const insights = getTopicInsights(progress, topicId);

  // Filter problems
  const filteredProblems = problems.filter(({ problem, progress: p }) => {
    if (filterDifficulty !== 'all' && problem.difficulty !== filterDifficulty) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  const handleStatusChange = (problemId: string, status: ProblemStatus) => {
    const newProgress = updateProblemStatus(progress, topicId, problemId, status);
    onProgressUpdate(newProgress);
  };

  const handleConfidenceChange = (problemId: string, confidence: number) => {
    const newProgress = updateProblemConfidence(progress, topicId, problemId, confidence);
    onProgressUpdate(newProgress);
  };

  const getStatusColor = (status: ProblemStatus) => {
    switch (status) {
      case 'solved': return 'text-green-600';
      case 'revision': return 'text-yellow-600';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to={`/topic/${topicId}`} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{topic.name} - Practice</h1>
              <p className="text-sm text-gray-600">
                {problems.filter(p => p.progress.status === 'solved').length} / {problems.length} solved
              </p>
            </div>
            <div className="text-3xl">{topic.icon}</div>
          </div>
        </div>
      </div>

      {/* Three Panel Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Problem Map - Left Panel */}
          <div className="col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit sticky top-6">
            <h2 className="font-bold text-lg mb-4">Problems</h2>

            {/* Filters */}
            <div className="space-y-3 mb-4">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
                <option value="revision">Revision</option>
              </select>
            </div>

            {/* Problem List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredProblems.map(({ problem, progress: p }) => (
                <button
                  key={problem.id}
                  onClick={() => setSelectedProblemId(problem.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedProblem?.problem.id === problem.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`mt-1 ${getStatusColor(p.status)}`}>
                      {p.status === 'solved' ? (
                        <CheckCircle2 size={18} />
                      ) : p.status === 'revision' ? (
                        <BookmarkPlus size={18} />
                      ) : (
                        <Circle size={18} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {problem.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Solve Zone - Center Panel */}
          <div className="col-span-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {selectedProblem && (
              <>
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedProblem.problem.title}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedProblem.problem.difficulty)}`}>
                      {selectedProblem.problem.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      📍 {selectedProblem.problem.platform}
                    </span>
                    {selectedProblem.problem.companies && selectedProblem.problem.companies.length > 0 && (
                      <span className="flex items-center gap-1">
                        🏢 {selectedProblem.problem.companies.slice(0, 3).join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mb-6">
                  <a
                    href={selectedProblem.problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span>Solve on {selectedProblem.problem.platform}</span>
                  </a>

                  <select
                    value={selectedProblem.progress.status}
                    onChange={(e) => handleStatusChange(selectedProblem.problem.id, e.target.value as ProblemStatus)}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium"
                  >
                    <option value="unsolved">⭕ Unsolved</option>
                    <option value="solved">✅ Solved</option>
                    <option value="revision">📌 Revision</option>
                  </select>
                </div>

                {/* Patterns */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Patterns & Techniques</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProblem.problem.patterns.map(pattern => (
                      <span key={pattern} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {pattern}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Confidence Rating */}
                {selectedProblem.progress.status === 'solved' && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Confidence Level</h3>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button
                          key={level}
                          onClick={() => handleConfidenceChange(selectedProblem.problem.id, level)}
                          className={`w-10 h-10 rounded-full border-2 font-bold transition-all ${
                            selectedProblem.progress.confidence >= level
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-400 border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      1 = Need practice | 5 = Fully confident
                    </p>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <h3 className="font-semibold mb-2">Personal Notes</h3>
                  <textarea
                    value={selectedProblem.progress.notes}
                    onChange={(e) => {
                      const newProgress = { ...progress };
                      newProgress.topicsProgress[topicId].problemsProgress[selectedProblem.problem.id].notes = e.target.value;
                      onProgressUpdate(newProgress);
                    }}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Write your approach, learnings, edge cases..."
                  />
                  {selectedProblem.progress.lastAttempted && (
                    <p className="text-xs text-gray-500 mt-2">
                      Last attempted: {new Date(selectedProblem.progress.lastAttempted).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Insights Panel - Right */}
          <div className="col-span-3 space-y-6">
            {insights && (
              <>
                {/* Common Patterns */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-bold mb-3">Common Patterns</h3>
                  <div className="space-y-2">
                    {insights.commonPatterns.length > 0 ? (
                      insights.commonPatterns.map(({ pattern, count }) => (
                        <div key={pattern} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{pattern}</span>
                          <span className="font-medium text-blue-600">{count}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Start solving to see patterns</p>
                    )}
                  </div>
                </div>

                {/* Difficulty Exposure */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="font-bold mb-3">Difficulty Balance</h3>
                  <div className="space-y-3">
                    {['easy', 'medium', 'hard'].map(diff => (
                      <div key={diff}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="capitalize text-gray-700">{diff}</span>
                          <span className="font-medium">{insights.difficultyExposure[diff as keyof typeof insights.difficultyExposure]}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              diff === 'easy' ? 'bg-green-500' :
                              diff === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{
                              width: `${insights.difficultyExposure[diff as keyof typeof insights.difficultyExposure]}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Needs Revision */}
                {insights.needsRevision > 0 && (
                  <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                    <h3 className="font-bold text-yellow-900 mb-2">⚠️ Needs Revision</h3>
                    <p className="text-sm text-yellow-800">
                      {insights.needsRevision} {insights.needsRevision === 1 ? 'problem' : 'problems'} marked for revision
                    </p>
                  </div>
                )}

                {/* Low Confidence */}
                {insights.lowConfidenceProblems.length > 0 && (
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <h3 className="font-bold text-blue-900 mb-2">💡 Practice More</h3>
                    <div className="space-y-1">
                      {insights.lowConfidenceProblems.slice(0, 3).map(title => (
                        <p key={title} className="text-sm text-blue-800 line-clamp-1">
                          • {title}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
