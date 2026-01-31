import { Link } from 'react-router-dom';
import { topics } from '../data/topics';
import type { UserProgress } from '../types';
import { getTopicProgress, getTopicDifficultyStats } from '../utils/storage';

interface RoadmapProps {
  progress: UserProgress;
}

export function Roadmap({ progress }: RoadmapProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">DSA Learning Roadmap</h1>
        <p className="text-gray-600">
          Master Data Structures & Algorithms through a structured, interview-focused curriculum
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Progress</p>
              <p className="text-3xl font-bold text-blue-600">
                {Math.round((progress.totalSolved / topics.reduce((sum, t) => sum + t.problemIds.length, 0)) * 100)}%
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Problems Solved</p>
              <p className="text-3xl font-bold text-green-600">{progress.totalSolved}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-3xl font-bold text-orange-600">{progress.todayStreak}</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const stats = getTopicProgress(progress, topic.id);
          const diffStats = getTopicDifficultyStats(progress, topic.id);
          const isLocked = topic.prerequisites.some(prereqId => {
            const prereqStats = getTopicProgress(progress, prereqId);
            return prereqStats.percentage < 70; // Need 70% to unlock
          });

          return (
            <Link
              key={topic.id}
              to={`/topic/${topic.id}`}
              className={`group block ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'} transition-transform`}
              onClick={(e) => isLocked && e.preventDefault()}
            >
              <div
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-2 border-transparent hover:border-blue-400"
                style={{ borderColor: isLocked ? '#E5E7EB' : undefined }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{topic.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-gray-900">{topic.name}</h3>
                        {isLocked && <span className="text-xs bg-gray-200 px-2 py-1 rounded">🔒</span>}
                      </div>
                      <p className="text-xs text-gray-500">{topic.estimatedHours}h estimated</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{topic.description}</p>

                {/* Progress Ring */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16">
                    <svg className="transform -rotate-90 w-16 h-16">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#E5E7EB"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke={topic.color}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - stats.percentage / 100)}`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold">{stats.percentage}%</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{stats.solved}/{stats.total}</span>
                    </div>
                    {stats.theoryCompleted && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <span>✓</span>
                        <span>Theory completed</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Difficulty Distribution */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{
                          width: `${stats.total > 0 ? (diffStats.easy / stats.total) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-8 text-right">{diffStats.easy}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 transition-all duration-500"
                        style={{
                          width: `${stats.total > 0 ? (diffStats.medium / stats.total) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-8 text-right">{diffStats.medium}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all duration-500"
                        style={{
                          width: `${stats.total > 0 ? (diffStats.hard / stats.total) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-8 text-right">{diffStats.hard}</span>
                  </div>
                </div>

                {/* Order Badge */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Step {topic.order} of {topics.length}</span>
                    {!isLocked && (
                      <span className="text-blue-600 font-medium group-hover:underline">
                        Continue →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
