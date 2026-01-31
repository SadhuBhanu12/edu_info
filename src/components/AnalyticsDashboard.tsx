import { Link } from 'react-router-dom';
import type { UserProgress } from '../types';
import { calculateAnalytics } from '../utils/analytics';
import { getRevisionProblems, getOverallProgress } from '../utils/storage';
import { topics } from '../data/topics';
import { striverSheet } from '../data/striverSheet';

interface AnalyticsDashboardProps {
  progress: UserProgress;
}

export function AnalyticsDashboard({ progress }: AnalyticsDashboardProps) {
  const analytics = calculateAnalytics(progress);
  const overallStats = getOverallProgress(progress);
  const revisionProblems = getRevisionProblems(progress);

  const totalDiff = analytics.difficultyDistribution.easy +
    analytics.difficultyDistribution.medium +
    analytics.difficultyDistribution.hard;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
        <p className="text-gray-600">Track your progress and identify areas for improvement</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Overall Progress</div>
          <div className="text-4xl font-bold mb-2">{overallStats.percentage}%</div>
          <div className="text-sm opacity-90">{overallStats.solvedProblems} / {overallStats.totalProblems} problems</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Interview Readiness</div>
          <div className="text-4xl font-bold mb-2">{analytics.interviewReadiness}%</div>
          <div className="text-sm opacity-90">
            {analytics.interviewReadiness >= 80 ? 'Excellent' :
             analytics.interviewReadiness >= 60 ? 'Good' :
             analytics.interviewReadiness >= 40 ? 'Fair' : 'Keep going!'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Theory Completed</div>
          <div className="text-4xl font-bold mb-2">{overallStats.theoryCompleted}</div>
          <div className="text-sm opacity-90">of {overallStats.totalTopics} topics</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Current Streak</div>
          <div className="text-4xl font-bold mb-2">{progress.todayStreak} 🔥</div>
          <div className="text-sm opacity-90">days active</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Difficulty Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-xl mb-6">Difficulty Distribution</h2>
          <div className="space-y-6">
            {[
              { label: 'Easy', count: analytics.difficultyDistribution.easy, color: 'green', ideal: 30 },
              { label: 'Medium', count: analytics.difficultyDistribution.medium, color: 'yellow', ideal: 50 },
              { label: 'Hard', count: analytics.difficultyDistribution.hard, color: 'red', ideal: 20 }
            ].map(({ label, count, color, ideal }) => {
              const percentage = totalDiff > 0 ? Math.round((count / totalDiff) * 100) : 0;
              const isBalanced = Math.abs(percentage - ideal) <= 10;

              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{label}</span>
                      {isBalanced && <span className="text-xs text-green-600">✓ Balanced</span>}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-bold">{count}</span> ({percentage}%)
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${color}-500 transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Ideal: {ideal}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalDiff === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>Start solving problems to see distribution</p>
            </div>
          )}
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-xl mb-6">Last 7 Days Activity</h2>
          <div className="flex items-end justify-between h-48 gap-2">
            {analytics.weeklyProgress.map((day, index) => {
              const maxCount = Math.max(...analytics.weeklyProgress.map(d => d.count), 1);
              const height = (day.count / maxCount) * 100;
              const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center mb-2" style={{ height: '180px' }}>
                    <div
                      className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600 relative group"
                      style={{ height: `${height}%`, minHeight: day.count > 0 ? '8px' : '0' }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.count} solved
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">{dayName}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Topic Mastery */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="font-bold text-xl mb-6">Topic Mastery</h2>
        <div className="space-y-4">
          {topics.map(topic => {
            const mastery = analytics.topicMastery[topic.id] || 0;
            const status = mastery >= 80 ? 'Excellent' :
                          mastery >= 60 ? 'Good' :
                          mastery >= 40 ? 'Fair' :
                          mastery > 0 ? 'Beginner' : 'Not started';

            const statusColor = mastery >= 80 ? 'text-green-600' :
                               mastery >= 60 ? 'text-blue-600' :
                               mastery >= 40 ? 'text-yellow-600' :
                               mastery > 0 ? 'text-orange-600' : 'text-gray-400';

            return (
              <Link
                key={topic.id}
                to={`/topic/${topic.id}`}
                className="block hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{topic.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{topic.name}</span>
                        <span className={`text-sm ${statusColor}`}>{status}</span>
                      </div>
                      <span className="text-sm font-bold">{mastery}%</span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${mastery}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Weak Topics & Revision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <div className="bg-red-50 rounded-lg border border-red-200 p-6">
          <h2 className="font-bold text-xl text-red-900 mb-4">⚠️ Needs Attention</h2>
          {analytics.weakTopics.length > 0 ? (
            <div className="space-y-3">
              {analytics.weakTopics.map(topicId => {
                const topic = topics.find(t => t.id === topicId);
                if (!topic) return null;

                return (
                  <Link
                    key={topicId}
                    to={`/topic/${topicId}`}
                    className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{topic.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{topic.name}</div>
                        <div className="text-sm text-red-600">
                          {analytics.topicMastery[topicId]}% completed - Practice more
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-red-800">Great! No weak topics identified 🎉</p>
          )}
        </div>

        {/* Revision Queue */}
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
          <h2 className="font-bold text-xl text-yellow-900 mb-4">📌 Revision Queue</h2>
          {revisionProblems.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-yellow-800 mb-3">
                {revisionProblems.length} {revisionProblems.length === 1 ? 'problem' : 'problems'} marked for revision
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {revisionProblems.slice(0, 10).map(problemId => {
                  const problem = striverSheet.find(p => p.id === problemId);
                  if (!problem) return null;

                  return (
                    <div
                      key={problemId}
                      className="p-3 bg-white rounded-lg border border-yellow-200"
                    >
                      <div className="font-medium text-gray-900 text-sm mb-1">{problem.title}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className={`px-2 py-0.5 rounded ${
                          problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {problem.difficulty}
                        </span>
                        <span>{problem.platform}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-yellow-800">No problems marked for revision</p>
          )}
        </div>
      </div>
    </div>
  );
}
