import React, { createContext, useContext, useMemo, useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import type { UserProgress, UserProblemProgress, ProblemStatus } from '../types';
import { topics } from '../data/topics';
import { striverSheetComplete } from '../data/striverSheetComplete';

interface ProgressContextType {
  progress: UserProgress;
  isLoadingProgress: boolean;
  updateProblemStatus: (problemId: string, status: ProblemStatus) => void;
  updateProblemNotes: (problemId: string, notes: string) => void;
  updateProblemConfidence: (problemId: string, confidence: number) => void;
  markTheoryComplete: (topicId: string) => void;
  updateTheoryProgress: (topicId: string, updates: {
    timeSpent?: number;
    animationWatched?: string;
    videoWatched?: string;
    readinessScore?: number;
  }) => void;
  getTopicProgress: (topicId: string) => any;
  getProblemProgress: (problemId: string) => UserProblemProgress | null;
  getTopicStats: (topicId: string) => { solved: number; total: number; percentage: number };
  getTotalStats: () => { solved: number; total: number; easy: number; medium: number; hard: number };
  getStreak: () => number;
  resetProgress: () => void;
}

const defaultProgress: UserProgress = {
  todayStreak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalSolved: 0,
  topicsProgress: {},
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  // ENTERPRISE PATTERN: Pure React state - NO localStorage
  // Each user session gets fresh state from database only
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const { user } = useAuth();
  const syncQueueRef = useRef<Map<string, { status: ProblemStatus; progress: UserProblemProgress }>>(new Map());
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = React.useState(true);
  
  // Track current user ID to detect user changes
  const currentUserIdRef = useRef<string | null>(null);

  // Sync user_progress table (streak, theory progress, etc.)
  const syncUserProgress = useCallback(async (currentProgress: UserProgress) => {
    if (!user) {
      console.log('🔄 [DB Sync] Skipping sync - no user logged in');
      return;
    }

    try {
      console.log('🔄 [DB Sync] Syncing user progress to database...', {
        userId: user.id,
        totalSolved: currentProgress.totalSolved,
        streak: currentProgress.todayStreak,
        lastActive: currentProgress.lastActiveDate
      });

      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          total_solved: currentProgress.totalSolved,
          streak: currentProgress.todayStreak,
          last_active_date: currentProgress.lastActiveDate,
          topics_progress: currentProgress.topicsProgress,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select();

      if (error) {
        console.error('❌ [DB Sync] Error syncing user progress:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.log('✅ [DB Sync] User progress synced successfully:', {
          totalSolved: currentProgress.totalSolved,
          streak: currentProgress.todayStreak
        });
        console.log('✅ [DB Sync] Database confirmed:', data);
      }
    } catch (error) {
      console.error('❌ [DB Sync] Exception in syncUserProgress:', error);
    }
  }, [user]);

  // Batch sync to Supabase - processes all queued updates
  const processSyncQueue = useCallback(async () => {
    if (!user || syncQueueRef.current.size === 0) {
      console.log('🔄 [Sync] Skipping sync - no user or empty queue');
      return;
    }

    console.log(`🔄 [Sync] Processing ${syncQueueRef.current.size} problem updates...`);

    const updates = Array.from(syncQueueRef.current.entries()).map(([problemId, data]) => {
      const problem = striverSheetComplete.find(p => p.id === problemId);
      if (!problem) {
        console.warn(`⚠️ Problem ${problemId} not found in sheet`);
        return null;
      }

      return {
        user_id: user.id,
        problem_id: problemId,
        problem_title: problem.title,
        difficulty: problem.difficulty,
        topic_id: problem.topicId,
        status: data.status,
        confidence: data.progress.confidence || 3,
        notes: data.progress.notes || '',
        time_spent: data.progress.timeSpent || 0,
        attempts: data.progress.attempts || 1,
        solved_at: data.status === 'solved' ? (data.progress.solvedDate || new Date().toISOString()) : null,
        last_attempted: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }).filter(Boolean);

    if (updates.length === 0) {
      console.warn('⚠️ [Sync] No valid updates to sync');
      return;
    }

    console.log('📤 [Sync] Saving to database:', updates);

    try {
      const { data: result, error } = await supabase
        .from('problem_submissions')
        .upsert(updates, {
          onConflict: 'user_id,problem_id'
        })
        .select();

      if (error) {
        console.error('❌ [Sync] Database error:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.log('✅ [Sync] Successfully saved', updates.length, 'problems to database');
        console.log('✅ [Sync] Database confirmed:', result);
        syncQueueRef.current.clear();
      }
    } catch (error) {
      console.error('❌ [Sync] Exception during sync:', error);
    }
  }, [user]);

  // Queue a sync and schedule batch processing
  const queueSync = useCallback((problemId: string, status: ProblemStatus, problemProgress: UserProblemProgress) => {
    if (!user) {
      console.warn('⚠️ [Sync] Cannot queue sync - no user logged in');
      return;
    }

    console.log('📝 [Sync] Queued problem:', problemId, 'status:', status);
    syncQueueRef.current.set(problemId, { status, progress: problemProgress });

    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }

    // Reduced delay for faster sync (300ms instead of 1000ms)
    syncTimerRef.current = setTimeout(() => {
      processSyncQueue();
    }, 300);
  }, [user, processSyncQueue]);

  // Cleanup and immediate sync on unmount
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
      if (syncQueueRef.current.size > 0) {
        processSyncQueue();
      }
    };
  }, [processSyncQueue]);

  // Load user progress from Supabase on login
  useEffect(() => {
    // ENTERPRISE PATTERN: Detect user changes and clear state
    const newUserId = user?.id || null;
    const userChanged = currentUserIdRef.current !== null && currentUserIdRef.current !== newUserId;
    
    if (userChanged) {
      console.log('👤 [Session] User changed - clearing previous user data', {
        oldUser: currentUserIdRef.current,
        newUser: newUserId
      });
      // Reset to default state before loading new user's data
      setProgress(defaultProgress);
      syncQueueRef.current.clear();
    }
    
    currentUserIdRef.current = newUserId;
    
    if (!user) {
      // CRITICAL: Reset progress when user logs out to prevent data leakage
      console.log('🔄 [Session] User logged out - clearing progress data');
      setProgress(defaultProgress);
      setIsLoadingProgress(false);
      return;
    }

    console.log('🔐 [Session] User logged in, starting data load...', { 
      userId: user.id,
      email: user.email 
    });

    // TUF Standard: Never block the UI - load instantly, sync in background
    // Set loading to false immediately to prevent blocking
    const loadingTimeout = setTimeout(() => {
      setIsLoadingProgress(false);
    }, 500); // Maximum 500ms loading screen

    const loadProgressFromSupabase = async () => {
      try {
        console.log('📥 [DB Load] Starting to load progress from database...', { userId: user.id });
        // Don't block - load in background
        setIsLoadingProgress(true);
        
        // Immediately stop loading after 300ms (TUF: instant feel)
        setTimeout(() => setIsLoadingProgress(false), 300);

        // Load user_progress table (streak, theory progress, etc.)
        const { data: userProgressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        console.log('📥 [DB Load] User progress query result:', { 
          hasData: !!userProgressData, 
          totalSolved: userProgressData?.total_solved,
          streak: userProgressData?.streak,
          error: progressError?.message,
          errorCode: progressError?.code
        });

        // Load problem_submissions table
        const { data: submissions, error: submissionsError } = await supabase
          .from('problem_submissions')
          .select('*')
          .eq('user_id', user.id);

        console.log('📥 [DB Load] Problem submissions query result:', { 
          count: submissions?.length || 0,
          problems: submissions?.map(s => ({ id: s.problem_id, status: s.status })),
          error: submissionsError?.message 
        });

        // Clear timeout on successful load
        clearTimeout(loadingTimeout);

        if (progressError && progressError.code !== 'PGRST116') { // PGRST116 = no rows found
          console.error('❌ [DB Load] Error loading progress:', progressError);
          console.error('Error details:', {
            message: progressError.message,
            code: progressError.code,
            hint: progressError.hint,
            details: progressError.details
          });
          // Don't block the UI - allow app to continue with local storage
          setIsLoadingProgress(false);
          return;
        } else if (progressError?.code === 'PGRST116') {
          console.log('ℹ️ [DB Load] No existing progress data - will create on first problem solve');
        }

        if (submissionsError) {
          console.error('❌ [DB Load] Error loading submissions:', submissionsError);
          // Don't block the UI - continue anyway
          setIsLoadingProgress(false);
          return;
        }

        // Build progress object from database
        const newProgress: UserProgress = {
          todayStreak: userProgressData?.streak || 0,
          lastActiveDate: userProgressData?.last_active_date || new Date().toISOString().split('T')[0],
          totalSolved: userProgressData?.total_solved || 0,
          topicsProgress: userProgressData?.topics_progress || {}
        };

        // Merge problem submissions into topics progress
        if (submissions && submissions.length > 0) {
          submissions.forEach((sub: any) => {
            const topicId = sub.topic_id;
            if (!newProgress.topicsProgress[topicId]) {
              newProgress.topicsProgress[topicId] = {
                topicId,
                theoryCompleted: false,
                theoryCompletedDate: null,
                theoryTimeSpent: 0,
                animationsWatched: [],
                videosWatched: [],
                conceptReadinessScore: 0,
                problemsProgress: {}
              };
            }

            newProgress.topicsProgress[topicId].problemsProgress[sub.problem_id] = {
              problemId: sub.problem_id,
              status: sub.status,
              notes: sub.notes || '',
              lastAttempted: sub.last_attempted,
              solvedDate: sub.solved_at,
              confidence: sub.confidence || 3,
              attempts: sub.attempts || 0,
              timeSpent: sub.time_spent || 0
            };
          });

          // Recalculate total solved from actual submissions
          const actualSolved = submissions.filter((sub: any) => sub.status === 'solved').length;
          newProgress.totalSolved = actualSolved;
        }

        setProgress(newProgress);
        console.log('✅ [DB Load] Progress loaded successfully:', {
          totalSolved: newProgress.totalSolved,
          streak: newProgress.todayStreak,
          topicsCount: Object.keys(newProgress.topicsProgress).length,
          problemsCount: Object.values(newProgress.topicsProgress)
            .reduce((sum, topic) => sum + Object.keys(topic.problemsProgress || {}).length, 0)
        });
        console.log('✅ [DB Load] Full progress object:', newProgress);
        clearTimeout(loadingTimeout);
        setIsLoadingProgress(false);
      } catch (error) {
        console.error('❌ [DB Load] Exception in loadProgressFromSupabase:', error);
        clearTimeout(loadingTimeout);
        setIsLoadingProgress(false);
      }
    };

    loadProgressFromSupabase();
    
    // Cleanup timeout on unmount
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [user]); // FIXED: Removed setProgress from dependencies

  const updateStreak = useCallback((currentProgress: UserProgress): UserProgress => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = currentProgress.lastActiveDate;
    
    if (lastActive === today) {
      return currentProgress;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    let newStreak = currentProgress.todayStreak;
    if (lastActive === yesterdayStr) {
      newStreak += 1;
    } else if (lastActive !== today) {
      newStreak = 1;
    }
    
    return {
      ...currentProgress,
      todayStreak: newStreak,
      lastActiveDate: today,
    };
  }, []);

  const updateProblemStatus = useCallback((problemId: string, status: ProblemStatus) => {
    // OPTIMISTIC UPDATE: Update UI FIRST (instant response)
    setProgress((prev) => {
      const problem = striverSheetComplete.find(p => p.id === problemId);
      if (!problem) {
        return prev;
      }

      const topicProgress = prev.topicsProgress[problem.topicId] || {
        topicId: problem.topicId,
        theoryCompleted: false,
        theoryCompletedDate: null,
        problemsProgress: {},
      };

      const existingProblemProgress = topicProgress.problemsProgress[problemId];
      const wasSolved = existingProblemProgress?.status === 'solved';
      const isSolved = status === 'solved';

      // Don't update if status hasn't changed
      if (existingProblemProgress && existingProblemProgress.status === status) {
        return prev;
      }

      const newProblemProgress: UserProblemProgress = {
        problemId,
        status,
        notes: existingProblemProgress?.notes || '',
        lastAttempted: new Date().toISOString(),
        solvedDate: isSolved ? (existingProblemProgress?.solvedDate || new Date().toISOString()) : existingProblemProgress?.solvedDate || null,
        confidence: existingProblemProgress?.confidence || 3,
        attempts: (existingProblemProgress?.attempts || 0) + 1,
        timeSpent: existingProblemProgress?.timeSpent || 0,
      };

      const updatedProgress = {
        ...prev,
        totalSolved: prev.totalSolved + (isSolved && !wasSolved ? 1 : 0) - (!isSolved && wasSolved ? 1 : 0),
        topicsProgress: {
          ...prev.topicsProgress,
          [problem.topicId]: {
            ...topicProgress,
            problemsProgress: {
              ...topicProgress.problemsProgress,
              [problemId]: newProblemProgress,
            },
          },
        },
      };

      const updatedProgressWithStreak = updateStreak(updatedProgress);
      
      // Background sync (non-blocking) - happens AFTER UI update
      Promise.resolve().then(() => {
        console.log('💾 [Save] Triggering sync for problem:', problemId, 'status:', status);
        queueSync(problemId, status, newProblemProgress);
        syncUserProgress(updatedProgressWithStreak);
      }).catch((error) => {
        console.error('Background sync failed (will retry):', error);
        // UI remains updated - sync will retry later
      });

      return updatedProgressWithStreak;
    });
  }, [setProgress, updateStreak, queueSync, syncUserProgress]);

  const updateProblemNotes = useCallback((problemId: string, notes: string) => {
    setProgress((prev) => {
      const problem = striverSheetComplete.find(p => p.id === problemId);
      if (!problem) {
        return prev;
      }

      const topicProgress = prev.topicsProgress[problem.topicId] || {
        topicId: problem.topicId,
        theoryCompleted: false,
        theoryCompletedDate: null,
        problemsProgress: {},
      };

      const existingProblemProgress = topicProgress.problemsProgress[problemId] || {
        problemId,
        status: 'unsolved',
        notes: '',
        lastAttempted: new Date().toISOString(),
        solvedDate: null,
        confidence: 3,
        attempts: 0,
        timeSpent: 0,
      };

      const updatedProblemProgress = {
        ...existingProblemProgress,
        notes,
        lastAttempted: new Date().toISOString(),
      };

      // Queue sync to Supabase (batched)
      queueSync(problemId, existingProblemProgress.status, updatedProblemProgress);

      return {
        ...prev,
        topicsProgress: {
          ...prev.topicsProgress,
          [problem.topicId]: {
            ...topicProgress,
            problemsProgress: {
              ...topicProgress.problemsProgress,
              [problemId]: updatedProblemProgress,
            },
          },
        },
      };
    });
  }, [setProgress, queueSync]);

  const updateProblemConfidence = useCallback((problemId: string, confidence: number) => {
    setProgress((prev) => {
      const problem = striverSheetComplete.find(p => p.id === problemId);
      if (!problem) {
        console.warn('Problem not found for confidence update:', problemId);
        return prev;
      }

      const topicProgress = prev.topicsProgress[problem.topicId] || {
        topicId: problem.topicId,
        theoryCompleted: false,
        theoryCompletedDate: null,
        problemsProgress: {},
      };

      const existingProblemProgress = topicProgress.problemsProgress[problemId] || {
        problemId,
        status: 'unsolved',
        notes: '',
        lastAttempted: new Date().toISOString(),
        solvedDate: null,
        confidence: 3,
        attempts: 0,
        timeSpent: 0,
      };

      const updatedProblemProgress = {
        ...existingProblemProgress,
        confidence,
        lastAttempted: new Date().toISOString(),
      };

      // Queue sync to Supabase (batched)
      queueSync(problemId, existingProblemProgress.status, updatedProblemProgress);

      return {
        ...prev,
        topicsProgress: {
          ...prev.topicsProgress,
          [problem.topicId]: {
            ...topicProgress,
            problemsProgress: {
              ...topicProgress.problemsProgress,
              [problemId]: updatedProblemProgress,
            },
          },
        },
      };
    });
  }, [setProgress, queueSync]);

  const markTheoryComplete = useCallback((topicId: string) => {
    setProgress((prev) => {
      const topicProgress = prev.topicsProgress[topicId] || {
        topicId,
        theoryCompleted: false,
        theoryCompletedDate: null,
        theoryTimeSpent: 0,
        animationsWatched: [],
        videosWatched: [],
        conceptReadinessScore: 0,
        problemsProgress: {},
      };

      const updatedProgress = updateStreak({
        ...prev,
        topicsProgress: {
          ...prev.topicsProgress,
          [topicId]: {
            ...topicProgress,
            theoryCompleted: true,
            theoryCompletedDate: new Date().toISOString(),
            conceptReadinessScore: 100,
          },
        },
      });

      // Sync to Supabase
      syncUserProgress(updatedProgress);

      return updatedProgress;
    });
  }, [setProgress, updateStreak, syncUserProgress]);

  const updateTheoryProgress = useCallback((
    topicId: string, 
    updates: {
      timeSpent?: number;
      animationWatched?: string;
      videoWatched?: string;
      readinessScore?: number;
    }
  ) => {
    setProgress((prev) => {
      const topicProgress = prev.topicsProgress[topicId] || {
        topicId,
        theoryCompleted: false,
        theoryCompletedDate: null,
        theoryTimeSpent: 0,
        animationsWatched: [],
        videosWatched: [],
        conceptReadinessScore: 0,
        problemsProgress: {},
      };

      const updatedProgress = {
        ...prev,
        topicsProgress: {
          ...prev.topicsProgress,
          [topicId]: {
            ...topicProgress,
            theoryTimeSpent: updates.timeSpent !== undefined 
              ? topicProgress.theoryTimeSpent + updates.timeSpent 
              : topicProgress.theoryTimeSpent,
            animationsWatched: updates.animationWatched 
              ? [...new Set([...topicProgress.animationsWatched, updates.animationWatched])]
              : topicProgress.animationsWatched,
            videosWatched: updates.videoWatched 
              ? [...new Set([...topicProgress.videosWatched, updates.videoWatched])]
              : topicProgress.videosWatched,
            conceptReadinessScore: updates.readinessScore !== undefined 
              ? updates.readinessScore 
              : topicProgress.conceptReadinessScore,
          },
        },
      };

      // Sync to Supabase
      syncUserProgress(updatedProgress);

      return updatedProgress;
    });
  }, [setProgress, syncUserProgress]);

  const getTopicProgress = useCallback((topicId: string) => {
    return progress.topicsProgress[topicId] || {
      topicId,
      theoryCompleted: false,
      theoryCompletedDate: null,
      theoryTimeSpent: 0,
      animationsWatched: [],
      videosWatched: [],
      conceptReadinessScore: 0,
      problemsProgress: {},
    };
  }, [progress]);

  const getProblemProgress = useCallback((problemId: string): UserProblemProgress | null => {
    const problem = striverSheetComplete.find(p => p.id === problemId);
    if (!problem) return null;
    
    const topicProgress = progress.topicsProgress[problem.topicId];
    if (!topicProgress) return null;
    
    return topicProgress.problemsProgress[problemId] || null;
  }, [progress]);

  const getTopicStats = useCallback((topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return { solved: 0, total: 0, percentage: 0 };

    const topicProblems = striverSheetComplete.filter(p => p.topicId === topicId);
    const total = topicProblems.length;
    const topicProgress = progress.topicsProgress[topicId];
    
    let solved = 0;
    if (topicProgress) {
      solved = topicProblems.filter(p => 
        topicProgress.problemsProgress[p.id]?.status === 'solved'
      ).length;
    }

    return {
      solved,
      total,
      percentage: total > 0 ? Math.round((solved / total) * 100) : 0,
    };
  }, [progress]);

  const getTotalStats = useCallback(() => {
    const allProblems = striverSheetComplete;
    let solved = 0;
    let easy = 0;
    let medium = 0;
    let hard = 0;

    for (const problem of allProblems) {
      const problemProgress = getProblemProgress(problem.id);
      if (problemProgress?.status === 'solved') {
        solved++;
        if (problem.difficulty === 'Easy') easy++;
        else if (problem.difficulty === 'Medium') medium++;
        else hard++;
      }
    }

    return { solved, total: allProblems.length, easy, medium, hard };
  }, [getProblemProgress]);

  const getStreak = useCallback(() => {
    return progress.todayStreak;
  }, [progress.todayStreak]);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
  }, [setProgress]);

  const value = useMemo(() => ({
    progress,
    isLoadingProgress,
    updateProblemStatus,
    updateProblemNotes,
    updateProblemConfidence,
    markTheoryComplete,
    updateTheoryProgress,
    getTopicProgress,
    getProblemProgress,
    getTopicStats,
    getTotalStats,
    getStreak,
    resetProgress,
  }), [
    progress,
    isLoadingProgress,
    updateProblemStatus,
    updateProblemNotes,
    updateProblemConfidence,
    markTheoryComplete,
    updateTheoryProgress,
    getTopicProgress,
    getProblemProgress,
    getTopicStats,
    getTotalStats,
    getStreak,
    resetProgress,
  ]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
