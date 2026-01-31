import type { UserProgress, UserTopicProgress, UserProblemProgress, ProblemStatus } from '../types';
import { topics } from '../data/topics';
import { striverSheet } from '../data/striverSheet';

const STORAGE_KEY = 'dsa_platform_progress';

// Initialize default progress
export function getDefaultProgress(): UserProgress {
  const topicsProgress: Record<string, UserTopicProgress> = {};
  
  topics.forEach(topic => {
    const problemsProgress: Record<string, UserProblemProgress> = {};
    
    topic.problemIds.forEach(problemId => {
      problemsProgress[problemId] = {
        problemId,
        status: 'unsolved',
        notes: '',
        lastAttempted: null,
        solvedDate: null,
        confidence: 0,
        attempts: 0,
        timeSpent: 0
      };
    });
    
    topicsProgress[topic.id] = {
      topicId: topic.id,
      theoryCompleted: false,
      theoryCompletedDate: null,
      theoryTimeSpent: 0,
      animationsWatched: [],
      videosWatched: [],
      conceptReadinessScore: 0,
      problemsProgress
    };
  });
  
  return {
    todayStreak: 0,
    lastActiveDate: new Date().toISOString(),
    totalSolved: 0,
    topicsProgress
  };
}

// Load progress from localStorage
export function loadProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress = JSON.parse(stored);
      // Merge with default to handle new topics/problems
      const defaultProgress = getDefaultProgress();
      return {
        ...defaultProgress,
        ...progress,
        topicsProgress: {
          ...defaultProgress.topicsProgress,
          ...progress.topicsProgress
        }
      };
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  return getDefaultProgress();
}

// Save progress to localStorage
export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

// Update problem status
export function updateProblemStatus(
  progress: UserProgress,
  topicId: string,
  problemId: string,
  status: ProblemStatus,
  notes?: string
): UserProgress {
  const newProgress = { ...progress };
  const topicProgress = newProgress.topicsProgress[topicId];
  
  if (!topicProgress) return progress;
  
  const problemProgress = topicProgress.problemsProgress[problemId];
  const wasUnsolved = problemProgress.status === 'unsolved';
  
  topicProgress.problemsProgress[problemId] = {
    ...problemProgress,
    status,
    notes: notes !== undefined ? notes : problemProgress.notes,
    lastAttempted: new Date().toISOString(),
    solvedDate: status === 'solved' && wasUnsolved ? new Date().toISOString() : problemProgress.solvedDate
  };
  
  // Update total solved count
  if (status === 'solved' && wasUnsolved) {
    newProgress.totalSolved++;
  } else if (status !== 'solved' && problemProgress.status === 'solved') {
    newProgress.totalSolved = Math.max(0, newProgress.totalSolved - 1);
  }
  
  // Update streak
  updateStreak(newProgress);
  
  saveProgress(newProgress);
  return newProgress;
}

// Update problem confidence
export function updateProblemConfidence(
  progress: UserProgress,
  topicId: string,
  problemId: string,
  confidence: number
): UserProgress {
  const newProgress = { ...progress };
  const topicProgress = newProgress.topicsProgress[topicId];
  
  if (!topicProgress) return progress;
  
  topicProgress.problemsProgress[problemId] = {
    ...topicProgress.problemsProgress[problemId],
    confidence: Math.max(1, Math.min(5, confidence))
  };
  
  saveProgress(newProgress);
  return newProgress;
}

// Mark theory as completed
export function markTheoryCompleted(
  progress: UserProgress,
  topicId: string,
  completed: boolean
): UserProgress {
  const newProgress = { ...progress };
  const topicProgress = newProgress.topicsProgress[topicId];
  
  if (!topicProgress) return progress;
  
  topicProgress.theoryCompleted = completed;
  topicProgress.theoryCompletedDate = completed ? new Date().toISOString() : null;
  
  updateStreak(newProgress);
  saveProgress(newProgress);
  return newProgress;
}

// Update streak
function updateStreak(progress: UserProgress): void {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = new Date(progress.lastActiveDate).toISOString().split('T')[0];
  
  if (today === lastActive) {
    // Same day, no change
    return;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (lastActive === yesterdayStr) {
    // Consecutive day
    progress.todayStreak++;
  } else {
    // Streak broken
    progress.todayStreak = 1;
  }
  
  progress.lastActiveDate = new Date().toISOString();
}

// Calculate topic progress
export function getTopicProgress(progress: UserProgress, topicId: string) {
  const topicProgress = progress.topicsProgress[topicId];
  if (!topicProgress) return { solved: 0, total: 0, percentage: 0 };
  
  const problems = Object.values(topicProgress.problemsProgress);
  const solved = problems.filter(p => p.status === 'solved').length;
  const total = problems.length;
  
  return {
    solved,
    total,
    percentage: total > 0 ? Math.round((solved / total) * 100) : 0,
    theoryCompleted: topicProgress.theoryCompleted
  };
}

// Get difficulty distribution for a topic
export function getTopicDifficultyStats(progress: UserProgress, topicId: string) {
  const topicProgress = progress.topicsProgress[topicId];
  if (!topicProgress) return { easy: 0, medium: 0, hard: 0 };
  
  const topic = topics.find(t => t.id === topicId);
  if (!topic) return { easy: 0, medium: 0, hard: 0 };
  
  const stats = { easy: 0, medium: 0, hard: 0 };
  
  topic.problemIds.forEach(problemId => {
    const problem = striverSheet.find(p => p.id === problemId);
    const problemProgress = topicProgress.problemsProgress[problemId];
    
    if (problem && problemProgress && problemProgress.status === 'solved') {
      const key = problem.difficulty.toLowerCase() as keyof typeof stats;
      stats[key]++;
    }
  });
  
  return stats;
}

// Get problems for revision
export function getRevisionProblems(progress: UserProgress): string[] {
  const revisionIds: string[] = [];
  
  Object.values(progress.topicsProgress).forEach(topicProgress => {
    Object.values(topicProgress.problemsProgress).forEach(problemProgress => {
      if (problemProgress.status === 'revision') {
        revisionIds.push(problemProgress.problemId);
      }
    });
  });
  
  return revisionIds;
}

// Get weak topics (low completion percentage)
export function getWeakTopics(progress: UserProgress, threshold: number = 30): string[] {
  return topics
    .filter(topic => {
      const stats = getTopicProgress(progress, topic.id);
      return stats.percentage < threshold && stats.total > 0;
    })
    .map(topic => topic.id);
}

// Calculate overall progress
export function getOverallProgress(progress: UserProgress) {
  let totalProblems = 0;
  let solvedProblems = 0;
  let theoryCompleted = 0;
  
  topics.forEach(topic => {
    const stats = getTopicProgress(progress, topic.id);
    totalProblems += stats.total;
    solvedProblems += stats.solved;
    if (stats.theoryCompleted) theoryCompleted++;
  });
  
  return {
    totalProblems,
    solvedProblems,
    percentage: totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0,
    theoryCompleted,
    totalTopics: topics.length,
    theoryPercentage: Math.round((theoryCompleted / topics.length) * 100)
  };
}
