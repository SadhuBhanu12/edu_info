import React, { useState, useEffect } from 'react';
import { Target, Calendar, TrendingUp, Clock, Award, Flame } from 'lucide-react';
import type { StudyPlan, StudyPlanTopic } from '../types';
import './StudyPlanManager.css';

interface StudyPlanManagerProps {
  userId: string;
  onPlanCreate?: (plan: StudyPlan) => void;
  onPlanUpdate?: (plan: StudyPlan) => void;
}

export const StudyPlanManager: React.FC<StudyPlanManagerProps> = ({
  userId,
  onPlanCreate
}) => {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [activePlan, setActivePlan] = useState<StudyPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetDate: '',
    weeklyHours: 10,
    topics: [] as StudyPlanTopic[]
  });

  const availableTopics = [
    { id: 'arrays', name: 'Arrays', recommended: 20 },
    { id: 'linked-lists', name: 'Linked Lists', recommended: 15 },
    { id: 'stacks-queues', name: 'Stacks & Queues', recommended: 12 },
    { id: 'trees', name: 'Binary Trees', recommended: 18 },
    { id: 'graphs', name: 'Graphs', recommended: 20 },
    { id: 'dp', name: 'Dynamic Programming', recommended: 25 },
    { id: 'greedy', name: 'Greedy Algorithms', recommended: 15 },
    { id: 'backtracking', name: 'Backtracking', recommended: 12 }
  ];

  useEffect(() => {
    // Load existing plans (replace with API call)
    const mockPlans: StudyPlan[] = [
      {
        id: '1',
        userId,
        name: 'FAANG Interview Prep - 3 Months',
        targetDate: '2026-04-11',
        weeklyHours: 15,
        topics: [
          { topicId: 'arrays', priority: 'high', targetProblemCount: 25, completed: 12, dueDate: '2026-02-11' },
          { topicId: 'linked-lists', priority: 'high', targetProblemCount: 18, completed: 5, dueDate: '2026-02-25' },
          { topicId: 'trees', priority: 'medium', targetProblemCount: 20, completed: 0, dueDate: '2026-03-15' }
        ],
        createdAt: '2026-01-05',
        progress: 35
      }
    ];
    setPlans(mockPlans);
    setActivePlan(mockPlans[0]);
  }, [userId]);

  const handleCreatePlan = () => {
    const newPlan: StudyPlan = {
      id: Date.now().toString(),
      userId,
      name: formData.name,
      targetDate: formData.targetDate,
      weeklyHours: formData.weeklyHours,
      topics: formData.topics,
      createdAt: new Date().toISOString(),
      progress: 0
    };

    setPlans([...plans, newPlan]);
    setActivePlan(newPlan);
    setIsCreating(false);
    
    if (onPlanCreate) {
      onPlanCreate(newPlan);
    }

    // Reset form
    setFormData({
      name: '',
      targetDate: '',
      weeklyHours: 10,
      topics: []
    });
  };

  const handleAddTopic = (topicId: string, _topicName: string, recommended: number) => {
    const newTopic: StudyPlanTopic = {
      topicId,
      priority: 'medium',
      targetProblemCount: recommended,
      completed: 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setFormData({
      ...formData,
      topics: [...formData.topics, newTopic]
    });
  };

  const handleRemoveTopic = (topicId: string) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter(t => t.topicId !== topicId)
    });
  };

  const calculateDaysRemaining = (targetDate: string): number => {
    const today = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateProblemsPerWeek = (plan: StudyPlan): number => {
    const totalProblems = plan.topics.reduce((sum, t) => sum + t.targetProblemCount, 0);
    const completedProblems = plan.topics.reduce((sum, t) => sum + t.completed, 0);
    const remainingProblems = totalProblems - completedProblems;
    const daysRemaining = calculateDaysRemaining(plan.targetDate);
    const weeksRemaining = Math.max(1, daysRemaining / 7);
    return Math.ceil(remainingProblems / weeksRemaining);
  };

  if (isCreating) {
    return (
      <div className="study-plan-creator">
        <div className="creator-header">
          <h2>Create Your Study Plan</h2>
          <p>Design a personalized roadmap to achieve your coding goals</p>
        </div>

        <div className="creator-form">
          <div className="form-group">
            <label htmlFor="plan-name">Plan Name</label>
            <input
              id="plan-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., FAANG Interview Prep, LeetCode 75, etc."
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="target-date">Target Date</label>
              <input
                id="target-date"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="weekly-hours">Hours Per Week</label>
              <input
                id="weekly-hours"
                type="number"
                value={formData.weeklyHours}
                onChange={(e) => setFormData({ ...formData, weeklyHours: parseInt(e.target.value) })}
                min={1}
                max={40}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Select Topics</label>
            <div className="topic-selector">
              {availableTopics
                .filter(t => !formData.topics.some(ft => ft.topicId === t.id))
                .map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => handleAddTopic(topic.id, topic.name, topic.recommended)}
                    className="topic-chip"
                  >
                    + {topic.name} ({topic.recommended})
                  </button>
                ))}
            </div>
          </div>

          {formData.topics.length > 0 && (
            <div className="selected-topics">
              <h3>Selected Topics ({formData.topics.length})</h3>
              {formData.topics.map(topic => {
                const topicInfo = availableTopics.find(t => t.id === topic.topicId);
                return (
                  <div key={topic.topicId} className="selected-topic">
                    <div className="topic-info">
                      <span className="topic-name">{topicInfo?.name}</span>
                      <span className="topic-count">{topic.targetProblemCount} problems</span>
                    </div>
                    <button
                      onClick={() => handleRemoveTopic(topic.topicId)}
                      className="remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="form-actions">
            <button onClick={() => setIsCreating(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleCreatePlan}
              disabled={!formData.name || !formData.targetDate || formData.topics.length === 0}
              className="btn btn-primary"
            >
              Create Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="study-plan-manager">
      <div className="manager-header">
        <div>
          <h2>My Study Plans</h2>
          <p>Track your progress and stay on target</p>
        </div>
        <button onClick={() => setIsCreating(true)} className="btn btn-primary">
          + New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="empty-state">
          <Target size={48} className="empty-icon" />
          <h3>No Study Plans Yet</h3>
          <p>Create your first study plan to start tracking your progress</p>
          <button onClick={() => setIsCreating(true)} className="btn btn-primary">
            Create Your First Plan
          </button>
        </div>
      ) : (
        <>
          <div className="plans-list">
            {plans.map(plan => (
              <button
                key={plan.id}
                onClick={() => setActivePlan(plan)}
                className={`plan-card ${activePlan?.id === plan.id ? 'active' : ''}`}
              >
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <span className="progress-badge">{plan.progress}%</span>
                </div>
                <div className="plan-meta">
                  <span className="meta-item">
                    <Calendar size={14} />
                    {calculateDaysRemaining(plan.targetDate)} days left
                  </span>
                  <span className="meta-item">
                    <Clock size={14} />
                    {plan.weeklyHours}h/week
                  </span>
                </div>
                <div className="plan-progress-bar">
                  <div
                    className="plan-progress-fill"
                    style={{ width: `${plan.progress}%` }}
                  />
                </div>
              </button>
            ))}
          </div>

          {activePlan && (
            <div className="plan-details">
              <div className="details-header">
                <h3>{activePlan.name}</h3>
                <div className="details-stats">
                  <div className="stat-card">
                    <Target className="stat-icon" />
                    <div>
                      <div className="stat-value">{calculateDaysRemaining(activePlan.targetDate)}</div>
                      <div className="stat-label">Days Remaining</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <TrendingUp className="stat-icon" />
                    <div>
                      <div className="stat-value">{calculateProblemsPerWeek(activePlan)}</div>
                      <div className="stat-label">Problems/Week</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <Flame className="stat-icon" />
                    <div>
                      <div className="stat-value">{activePlan.weeklyHours}h</div>
                      <div className="stat-label">Weekly Hours</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <Award className="stat-icon" />
                    <div>
                      <div className="stat-value">{activePlan.progress}%</div>
                      <div className="stat-label">Complete</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="topics-breakdown">
                <h4>Topics Breakdown</h4>
                {activePlan.topics.map(topic => {
                  const topicInfo = availableTopics.find(t => t.id === topic.topicId);
                  const progress = (topic.completed / topic.targetProblemCount) * 100;

                  return (
                    <div key={topic.topicId} className="topic-breakdown">
                      <div className="topic-breakdown-header">
                        <div className="topic-name-section">
                          <span className="topic-name">{topicInfo?.name}</span>
                          <span className={`priority-badge ${topic.priority}`}>
                            {topic.priority}
                          </span>
                        </div>
                        <div className="topic-progress-text">
                          {topic.completed}/{topic.targetProblemCount} problems
                        </div>
                      </div>
                      <div className="topic-progress-bar">
                        <div
                          className={`topic-progress-fill ${topic.priority}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="topic-due-date">
                        Due: {new Date(topic.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
