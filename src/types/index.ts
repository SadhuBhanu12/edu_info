// Core Types for DSA Learning Platform

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ProblemStatus = 'unsolved' | 'solved' | 'revision';
export type Platform = 'LeetCode' | 'GeeksForGeeks' | 'CodeStudio' | 'InterviewBit';

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  platform: Platform;
  url: string;
  topicId: string;
  patterns: string[];
  companies?: string[];
}

export interface UserProblemProgress {
  problemId: string;
  status: ProblemStatus;
  notes: string;
  lastAttempted: string | null;
  solvedDate: string | null;
  confidence: number; // 1-5 rating
  attempts: number;
  timeSpent: number; // in minutes
  solution?: string; // User's solution code
  language?: 'javascript' | 'python' | 'java' | 'cpp' | 'typescript';
  runtime?: string;
  memory?: string;
}

// Interactive Learning Animation Types
export interface AnimationStep {
  id: string;
  description: string;
  microExplanation?: string; // Short, contextual text (e.g., "Comparing 5 and 3")
  code?: string;
  highlightedLine?: number; // Current line of code being executed
  highlightElements?: string[]; // Elements to highlight in visualization
  dimElements?: string[]; // Elements to dim (inactive parts)
  visualContent?: string; // SVG content for visual animation
  duration?: number; // Animation duration in milliseconds
  transitionType?: 'fade' | 'slide' | 'scale' | 'none';
  explanation?: string; // Detailed explanation for the step
  variables?: Record<string, any>; // Live variable values at this step
  activePointers?: string[]; // Active pointer/index names
  comparedElements?: number[]; // Indices being compared
  swappedElements?: number[]; // Indices being swapped
  voiceNarration?: string; // Text for voice narration
  aiExplanation?: string; // AI-generated detailed explanation
  complexity?: StepComplexity; // Complexity analysis for this step
}

export interface StepComplexity {
  operations: number; // Number of operations at this step
  comparisons: number; // Number of comparisons
  totalSoFar: number; // Cumulative operations
  notation?: string; // O(n), O(log n), etc.
}

export interface RealLifeAnalogy {
  id: string;
  title: string;
  description: string;
  visual: string; // Image URL or SVG
  mapping: {
    concept: string; // e.g., "Stack"
    realLife: string; // e.g., "Plates in canteen"
    explanation: string;
  }[];
  examples: string[];
}

export interface VisualLegend {
  color: string;
  label: string;
  meaning: string;
  icon?: string;
}

export interface CommonMistake {
  id: string;
  title: string;
  description: string;
  wrongCode?: string;
  correctCode?: string;
  wrongAnimation?: AnimationStep[];
  correctAnimation?: AnimationStep[];
  explanation: string;
  howToAvoid: string;
}

export interface InteractiveAnimationConfig {
  id: string;
  topicId: string;
  title: string;
  difficulty: Difficulty;
  
  // Core Learning Components
  realLifeAnalogy: RealLifeAnalogy;
  visualLegend: VisualLegend[];
  
  // Animation Data
  steps: AnimationStep[];
  sampleInput: any;
  sampleOutput: any;
  
  // Code Sync
  codeLanguages: {
    language: 'javascript' | 'python' | 'java' | 'cpp' | 'typescript';
    code: string;
    lineMapping: Record<number, string>; // Line number to step ID
  }[];
  
  // Learning Enhancements
  commonMistakes: CommonMistake[];
  keyRules: string[];
  whenToUse: string[];
  whenNotToUse: string[];
  interviewUseCases: string[];
  
  // Complexity Visualization
  complexityData: {
    notation: string;
    description: string;
    visualData: {
      inputSize: number[];
      operations: number[];
    };
    bestCase?: string;
    averageCase?: string;
    worstCase?: string;
  };
  
  // User Interaction
  allowCustomInput: boolean;
  testCases: {
    input: any;
    output: any;
    description: string;
    case: 'best' | 'average' | 'worst' | 'custom';
  }[];
  
  // Progressive Difficulty
  difficultyLevels: {
    beginner: boolean; // Visual only
    intermediate: boolean; // Code + visual
    advanced: boolean; // Optimization + edge cases
  };
  
  // Quiz/Validation
  predictNextStepQuiz?: {
    stepId: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export interface VideoResource {
  id: string;
  title: string;
  url: string;
  duration: string;
  platform: 'YouTube' | 'Vimeo' | 'Custom' | 'SelfHosted';
  thumbnail?: string;
  embedUrl?: string;
  quality?: '720p' | '1080p' | '4K';
  fileSize?: string;
  transcript?: string;
  timestamps?: VideoTimestamp[];
  category?: 'tutorial' | 'concept' | 'example' | 'walkthrough';
  difficulty?: Difficulty;
}

export interface VideoTimestamp {
  time: string; // "0:45"
  label: string; // "Step 2: Partition"
  description?: string;
}

export interface VisualDiagram {
  id: string;
  title: string;
  imageUrl?: string;
  svgContent?: string;
  description: string;
}

export interface TheorySection {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  complexity?: {
    time: string;
    space: string;
  };
  diagrams?: VisualDiagram[];
  animations?: AnimationStep[];
}

export interface LearningModule {
  conceptOverview: string;
  whyItMatters: string;
  coreExplanation: string;
  visualDiagrams: VisualDiagram[];
  animationSteps: AnimationStep[];
  embeddedVideos: VideoResource[];
  timeComplexity: string;
  spaceComplexity: string;
  commonMistakes: string[];
  bestPractices: string[];
  interviewTips?: string[];
  realWorldExamples?: RealWorldExample[];
  practiceProblems?: PracticeProblemReference[];
  quiz?: Quiz[];
  codeTemplates?: CodeTemplate[];
  resources: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'interactive' | 'documentation';
    difficulty?: Difficulty;
  }[];
}

export interface RealWorldExample {
  id: string;
  title: string;
  description: string;
  industry: string;
  useCase: string;
  companies?: string[];
}

export interface PracticeProblemReference {
  problemId: string;
  relevance: 'beginner' | 'intermediate' | 'advanced';
  mustSolve: boolean;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
}

export interface CodeTemplate {
  id: string;
  language: 'javascript' | 'python' | 'java' | 'cpp' | 'typescript';
  name: string;
  code: string;
  description: string;
  complexity?: {
    time: string;
    space: string;
  };
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  estimatedHours: number;
  prerequisites: string[];
  theory: {
    overview: string;
    sections: TheorySection[];
    interviewTips: string[];
    commonMistakes: string[];
  };
  learningModule?: LearningModule;
  problemIds: string[];
}

export interface UserTopicProgress {
  topicId: string;
  theoryCompleted: boolean;
  theoryCompletedDate: string | null;
  theoryTimeSpent: number; // minutes
  animationsWatched: string[]; // animation IDs
  videosWatched: string[]; // video IDs
  conceptReadinessScore: number; // 0-100
  problemsProgress: Record<string, UserProblemProgress>;
}

export interface UserProgress {
  todayStreak: number;
  lastActiveDate: string;
  totalSolved: number;
  topicsProgress: Record<string, UserTopicProgress>;
}

export interface AnalyticsData {
  topicMastery: Record<string, number>;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  weeklyProgress: {
    date: string;
    count: number;
  }[];
  weakTopics: string[];
  interviewReadiness: number;
}
// Code Editor & Execution Types
export interface CodeSubmission {
  id: string;
  problemId: string;
  userId: string;
  code: string;
  language: 'javascript' | 'python' | 'java' | 'cpp' | 'typescript';
  status: 'pending' | 'running' | 'accepted' | 'wrong_answer' | 'time_limit' | 'runtime_error' | 'compile_error';
  output?: string;
  error?: string;
  runtime?: number; // milliseconds
  memory?: number; // MB
  testCasesPassed?: number;
  totalTestCases?: number;
  submittedAt: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
}

export interface CodeExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  runtime: number;
  memory: number;
  testResults?: {
    testCase: TestCase;
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
  }[];
}

// Study Plan Types
export interface StudyPlan {
  id: string;
  userId: string;
  name: string;
  targetDate: string; // Interview date or goal
  weeklyHours: number;
  topics: StudyPlanTopic[];
  createdAt: string;
  progress: number; // 0-100
}

export interface StudyPlanTopic {
  topicId: string;
  priority: 'high' | 'medium' | 'low';
  targetProblemCount: number;
  completed: number;
  dueDate: string;
}

// Collaboration Types
export interface Discussion {
  id: string;
  problemId: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  replies: DiscussionReply[];
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionReply {
  id: string;
  userId: string;
  userName: string;
  content: string;
  upvotes: number;
  createdAt: string;
}

export interface CodeSnippetShare {
  id: string;
  problemId: string;
  userId: string;
  userName: string;
  language: string;
  code: string;
  explanation?: string;
  upvotes: number;
  tags: string[];
  createdAt: string;
}

// Gamification Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'problems' | 'difficulty' | 'speed' | 'topics' | 'special';
  requirement: number;
  unlockedAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate?: string;
}

export interface Leaderboard {
  userId: string;
  userName: string;
  avatar?: string;
  rank: number;
  points: number;
  problemsSolved: number;
  streak: number;
  easyCount?: number;
  mediumCount?: number;
  hardCount?: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'achievement' | 'reminder' | 'discussion' | 'update' | 'streak';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Performance Tracking Types
export interface PerformanceMetrics {
  topicId: string;
  averageTime: number; // minutes per problem
  accuracy: number; // percentage
  improvementRate: number; // percentage
  lastPracticed: string;
  strengths: string[];
  weaknesses: string[];
}

// Interview Prep Types
export interface MockInterview {
  id: string;
  userId: string;
  difficulty: Difficulty;
  topicIds: string[];
  problems: string[];
  duration: number; // minutes
  score: number;
  completedAt?: string;
  feedback?: InterviewFeedback;
}

export interface InterviewFeedback {
  overallScore: number;
  timeManagement: number;
  codeQuality: number;
  problemSolving: number;
  communication: number;
  strengths: string[];
  improvements: string[];
}

// Bookmark & Notes Types
export interface Bookmark {
  id: string;
  userId: string;
  problemId: string;
  tags: string[];
  notes: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  topicId?: string;
  problemId?: string;
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}