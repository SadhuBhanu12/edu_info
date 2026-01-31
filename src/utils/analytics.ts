import type { UserProgress, AnalyticsData } from '../types';
import { topics } from '../data/topics';
import { striverSheet } from '../data/striverSheet';
import { getTopicProgress, getTopicDifficultyStats, getWeakTopics } from './storage';

export function calculateAnalytics(progress: UserProgress): AnalyticsData {
  // Topic mastery scores
  const topicMastery: Record<string, number> = {};
  topics.forEach(topic => {
    const stats = getTopicProgress(progress, topic.id);
    topicMastery[topic.id] = stats.percentage;
  });
  
  // Overall difficulty distribution
  let easyTotal = 0, mediumTotal = 0, hardTotal = 0;
  
  topics.forEach(topic => {
    const stats = getTopicDifficultyStats(progress, topic.id);
    easyTotal += stats.easy;
    mediumTotal += stats.medium;
    hardTotal += stats.hard;
  });
  
  // Weekly progress (last 7 days)
  const weeklyProgress = getWeeklyProgress(progress);
  
  // Weak topics
  const weakTopics = getWeakTopics(progress, 50);
  
  // Interview readiness (0-100)
  const interviewReadiness = calculateInterviewReadiness(progress);
  
  return {
    topicMastery,
    difficultyDistribution: {
      easy: easyTotal,
      medium: mediumTotal,
      hard: hardTotal
    },
    weeklyProgress,
    weakTopics,
    interviewReadiness
  };
}

function getWeeklyProgress(progress: UserProgress): { date: string; count: number }[] {
  const last7Days: { date: string; count: number }[] = [];
  const today = new Date();
  
  // Get all solved problems with dates
  const solvedByDate: Record<string, number> = {};
  
  Object.values(progress.topicsProgress).forEach(topicProgress => {
    Object.values(topicProgress.problemsProgress).forEach(problemProgress => {
      if (problemProgress.solvedDate) {
        const date = new Date(problemProgress.solvedDate).toISOString().split('T')[0];
        solvedByDate[date] = (solvedByDate[date] || 0) + 1;
      }
    });
  });
  
  // Fill last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    last7Days.push({
      date: dateStr,
      count: solvedByDate[dateStr] || 0
    });
  }
  
  return last7Days;
}

function calculateInterviewReadiness(progress: UserProgress): number {
  let score = 0;
  
  // Theory completion (30% weight)
  const topicsWithTheory = topics.filter(t => 
    progress.topicsProgress[t.id]?.theoryCompleted
  ).length;
  score += (topicsWithTheory / topics.length) * 30;
  
  // Problem solving (50% weight)
  const totalSolved = progress.totalSolved;
  const totalProblems = striverSheet.length;
  score += (totalSolved / totalProblems) * 50;
  
  // Difficulty balance (20% weight)
  let easyCount = 0, mediumCount = 0, hardCount = 0;
  Object.values(progress.topicsProgress).forEach(topicProgress => {
    Object.entries(topicProgress.problemsProgress).forEach(([problemId, problemProgress]) => {
      if (problemProgress.status === 'solved') {
        const problem = striverSheet.find(p => p.id === problemId);
        if (problem) {
          if (problem.difficulty === 'Easy') easyCount++;
          else if (problem.difficulty === 'Medium') mediumCount++;
          else hardCount++;
        }
      }
    });
  });
  
  // Ideal distribution: 30% easy, 50% medium, 20% hard
  const total = easyCount + mediumCount + hardCount;
  if (total > 0) {
    const easyRatio = easyCount / total;
    const mediumRatio = mediumCount / total;
    const hardRatio = hardCount / total;
    
    const idealEasy = 0.3, idealMedium = 0.5, idealHard = 0.2;
    
    const balance = 1 - (
      Math.abs(easyRatio - idealEasy) +
      Math.abs(mediumRatio - idealMedium) +
      Math.abs(hardRatio - idealHard)
    ) / 2;
    
    score += balance * 20;
  }
  
  return Math.min(100, Math.round(score));
}

export function getTopicInsights(progress: UserProgress, topicId: string) {
  const topicData = topics.find(t => t.id === topicId);
  if (!topicData) return null;
  
  const topicProgress = progress.topicsProgress[topicId];
  if (!topicProgress) return null;
  
  const problems = topicData.problemIds.map(id => ({
    problem: striverSheet.find(p => p.id === id)!,
    progress: topicProgress.problemsProgress[id]
  }));
  
  // Patterns used
  const patternsCount: Record<string, number> = {};
  problems.forEach(({ problem, progress: p }) => {
    if (p.status === 'solved') {
      problem.patterns.forEach(pattern => {
        patternsCount[pattern] = (patternsCount[pattern] || 0) + 1;
      });
    }
  });
  
  // Sort patterns by frequency
  const commonPatterns = Object.entries(patternsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pattern, count]) => ({ pattern, count }));
  
  // Difficulty exposure
  const diffStats = getTopicDifficultyStats(progress, topicId);
  const totalSolved = diffStats.easy + diffStats.medium + diffStats.hard;
  
  const difficultyExposure = {
    easy: totalSolved > 0 ? Math.round((diffStats.easy / totalSolved) * 100) : 0,
    medium: totalSolved > 0 ? Math.round((diffStats.medium / totalSolved) * 100) : 0,
    hard: totalSolved > 0 ? Math.round((diffStats.hard / totalSolved) * 100) : 0
  };
  
  // Weak areas (low confidence problems)
  const lowConfidenceProblems = problems
    .filter(({ progress: p }) => p.status === 'solved' && p.confidence > 0 && p.confidence < 3)
    .map(({ problem }) => problem.title);
  
  return {
    commonPatterns,
    difficultyExposure,
    lowConfidenceProblems,
    totalSolved,
    needsRevision: problems.filter(({ progress: p }) => p.status === 'revision').length
  };
}
