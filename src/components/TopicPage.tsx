import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { topics } from '../data/topics';
import type { UserProgress } from '../types';
import { markTheoryCompleted, getTopicProgress } from '../utils/storage';
import { ArrowLeft, BookOpen, Code2, BarChart3 } from 'lucide-react';

interface TopicPageProps {
  progress: UserProgress;
  onProgressUpdate: (progress: UserProgress) => void;
}

type TabType = 'theory' | 'practice' | 'analytics';

export function TopicPage({ progress, onProgressUpdate }: TopicPageProps) {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('theory');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const topic = topics.find(t => t.id === topicId);

  if (!topic || !topicId) {
    return <div>Topic not found</div>;
  }

  const stats = getTopicProgress(progress, topicId);
  const isTheoryCompleted = progress.topicsProgress[topicId]?.theoryCompleted || false;

  const handleCompleteTheory = () => {
    const newProgress = markTheoryCompleted(progress, topicId, !isTheoryCompleted);
    onProgressUpdate(newProgress);
  };

  const tabs = [
    { id: 'theory' as TabType, label: 'Learn', icon: BookOpen },
    { id: 'practice' as TabType, label: 'Practice', icon: Code2 },
    { id: 'analytics' as TabType, label: 'Analyze', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{topic.icon}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{topic.name}</h1>
                  <p className="text-gray-600">{topic.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium">{stats.solved} / {stats.total} problems solved</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gray-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'theory' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Overview */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{topic.theory.overview}</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="px-4 py-2 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">Estimated Time:</span>
                  <span className="ml-2 font-bold text-blue-600">{topic.estimatedHours} hours</span>
                </div>
                {topic.prerequisites.length > 0 && (
                  <div className="px-4 py-2 bg-purple-50 rounded-lg">
                    <span className="text-sm text-gray-600">Prerequisites:</span>
                    <span className="ml-2 font-bold text-purple-600">
                      {topic.prerequisites.map(id => topics.find(t => t.id === id)?.name).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Theory Sections */}
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-bold mb-6">Core Concepts</h2>
              {topic.theory.sections.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex items-center justify-between"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    <span className="text-gray-400">
                      {expandedSection === section.id ? '−' : '+'}
                    </span>
                  </button>
                  {expandedSection === section.id && (
                    <div className="p-6 bg-white">
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed mb-4">
                          {section.content}
                        </div>
                        {section.codeExample && (
                          <div className="mt-4">
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Code Example</h4>
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{section.codeExample}</code>
                            </pre>
                          </div>
                        )}
                        {section.complexity && (
                          <div className="mt-4 flex gap-4">
                            <div className="px-3 py-2 bg-green-50 rounded-lg text-sm">
                              <span className="text-gray-600">Time:</span>
                              <span className="ml-2 font-mono font-bold text-green-700">
                                {section.complexity.time}
                              </span>
                            </div>
                            <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm">
                              <span className="text-gray-600">Space:</span>
                              <span className="ml-2 font-mono font-bold text-blue-700">
                                {section.complexity.space}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Interview Tips */}
            <div className="p-8 bg-blue-50 border-t border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-blue-900">💡 Interview Tips</h2>
              <ul className="space-y-2">
                {topic.theory.interviewTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes */}
            <div className="p-8 bg-red-50 border-t border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-red-900">⚠️ Common Mistakes</h2>
              <ul className="space-y-2">
                {topic.theory.commonMistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-red-600 mt-1">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Complete Theory Button */}
            <div className="p-8 border-t border-gray-200 flex items-center justify-between">
              <div>
                {isTheoryCompleted && (
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="text-2xl">✓</span>
                    <span className="font-medium">Theory completed!</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleCompleteTheory}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isTheoryCompleted
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isTheoryCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🧩</div>
              <h2 className="text-2xl font-bold mb-4">Ready to Practice?</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Enter the practice workspace to solve {stats.total} carefully selected problems
                from the Striver DSA Sheet.
              </p>
              <button
                onClick={() => navigate(`/topic/${topicId}/practice`)}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Enter Practice Workspace →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-1">Completion</div>
                <div className="text-3xl font-bold text-blue-600">{stats.percentage}%</div>
                <div className="text-sm text-gray-500 mt-1">{stats.solved} / {stats.total} problems</div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-1">Theory Status</div>
                <div className="text-3xl font-bold text-green-600">
                  {isTheoryCompleted ? '✓' : '○'}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {isTheoryCompleted ? 'Completed' : 'Not started'}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-sm text-gray-600 mb-1">Mastery</div>
                <div className="text-3xl font-bold text-purple-600">
                  {isTheoryCompleted && stats.percentage >= 80 ? 'High' : stats.percentage >= 50 ? 'Medium' : 'Low'}
                </div>
                <div className="text-sm text-gray-500 mt-1">Based on progress</div>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-4">Difficulty Distribution</h3>
              <div className="space-y-4">
                {['Easy', 'Medium', 'Hard'].map(difficulty => {
                  const diffProblems = topic.problemIds.filter(id => {
                    const prob = require('../data/striverSheet').striverSheet.find((p: any) => p.id === id);
                    return prob?.difficulty === difficulty;
                  });
                  const solved = diffProblems.filter(id =>
                    progress.topicsProgress[topicId]?.problemsProgress[id]?.status === 'solved'
                  ).length;

                  const color = difficulty === 'Easy' ? 'green' : difficulty === 'Medium' ? 'yellow' : 'red';

                  return (
                    <div key={difficulty}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{difficulty}</span>
                        <span className="text-sm text-gray-600">{solved} / {diffProblems.length}</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${color}-500 transition-all duration-500`}
                          style={{ width: `${diffProblems.length > 0 ? (solved / diffProblems.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
