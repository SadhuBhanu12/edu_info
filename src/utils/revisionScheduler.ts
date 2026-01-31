// Smart Revision System with Spaced Repetition
// Implements: 1 day → 3 days → 7 days → 14 days → 30 days

export interface RevisionSchedule {
  problemId: string;
  lastSolved: string;
  nextRevisionDate: string;
  revisionLevel: number; // 0-4 (0=first solve, 4=mastered)
  attempts: number;
  confidence: number;
}

const REVISION_INTERVALS = [1, 3, 7, 14, 30]; // days

export function calculateNextRevision(
  lastSolvedDate: string,
  revisionLevel: number,
  confidence: number
): string {
  const lastSolved = new Date(lastSolvedDate);
  const intervalDays = REVISION_INTERVALS[Math.min(revisionLevel, 4)];
  
  // Adjust interval based on confidence
  // Low confidence (1-2): Faster revision
  // High confidence (4-5): Can wait longer
  const confidenceMultiplier = confidence <= 2 ? 0.7 : confidence >= 4 ? 1.3 : 1;
  const adjustedDays = Math.floor(intervalDays * confidenceMultiplier);
  
  const nextDate = new Date(lastSolved);
  nextDate.setDate(nextDate.getDate() + adjustedDays);
  
  return nextDate.toISOString();
}

export function isDueForRevision(nextRevisionDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(nextRevisionDate);
  dueDate.setHours(0, 0, 0, 0);
  
  return dueDate <= today;
}

export function getRevisionPriority(
  nextRevisionDate: string,
  confidence: number,
  _attempts: number
): 'urgent' | 'high' | 'medium' | 'low' {
  const today = new Date();
  const dueDate = new Date(nextRevisionDate);
  const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Urgent: Overdue + low confidence
  if (daysOverdue > 0 && confidence <= 2) return 'urgent';
  
  // High: Overdue or due today with medium confidence
  if (daysOverdue >= 0 && confidence <= 3) return 'high';
  
  // Medium: Due soon (within 2 days)
  if (daysOverdue >= -2) return 'medium';
  
  return 'low';
}

export function getWeakProblemsByTopic(
  problemsProgress: Record<string, any>,
  _topicId: string
): string[] {
  return Object.entries(problemsProgress)
    .filter(([_, progress]) => {
      const p = progress as any;
      // Weak = low confidence OR multiple attempts OR needs revision
      return (
        (p.confidence && p.confidence <= 2) ||
        (p.attempts && p.attempts > 3) ||
        (p.status === 'revision')
      );
    })
    .map(([problemId]) => problemId);
}

export function calculateTopicStrength(
  solvedProblems: number,
  totalProblems: number,
  averageConfidence: number,
  averageAttempts: number
): number {
  // Score out of 100
  const completionScore = (solvedProblems / totalProblems) * 40; // 40%
  const confidenceScore = (averageConfidence / 5) * 40; // 40%
  const efficiencyScore = Math.max(0, (1 - averageAttempts / 5)) * 20; // 20%
  
  return Math.round(completionScore + confidenceScore + efficiencyScore);
}
