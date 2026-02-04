import React, { useState, useEffect } from 'react';
import { Trophy, Medal, TrendingUp, Flame, Target, Award, Crown, Star, Loader2, Users, Zap, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { supabase } from '../lib/supabase';
import type { Leaderboard as LeaderboardType, Achievement, Badge } from '../types';
import './LeaderboardAchievements.css';
import './LeaderboardProfessional.css';

interface LeaderboardAchievementsProps {
  userId?: string;
}

interface LeaderboardUser {
  user_id: string;
  display_name: string;
  total_solved: number;
  easy_count: number;
  medium_count: number;
  hard_count: number;
  points: number;
  streak: number;
  rank: number;
}

interface UserRankInfo {
  rank: number;
  total_users: number;
  points: number;
  total_solved: number;
}

export const LeaderboardAchievements: React.FC<LeaderboardAchievementsProps> = () => {
  const { user } = useAuth();
  const { progress, getTotalStats, getStreak } = useProgress();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'achievements' | 'badges'>('leaderboard');
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'alltime'>('alltime');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardType[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userRankInfo, setUserRankInfo] = useState<UserRankInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);

  const stats = getTotalStats();
  const streak = getStreak();

  // Fetch real leaderboard data from Supabase
  useEffect(() => {
    fetchLeaderboardData();
  }, [user, timeFilter]);

  // Real-time subscription for automatic updates
  useEffect(() => {
    if (!user) return;

    // Subscribe to problem_submissions changes
    const channel = supabase
      .channel('leaderboard-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'problem_submissions',
          filter: `status=eq.solved` // Only listen to solved problems
        },
        (payload) => {
          console.log('Real-time update detected:', payload);
          // Show update indicator
          setShowUpdateIndicator(true);
          // Refresh leaderboard when any user solves a problem
          fetchLeaderboardData();
          // Hide indicator after 3 seconds
          setTimeout(() => setShowUpdateIndicator(false), 3000);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, timeFilter]);

  const fetchLeaderboardData = async () => {
    if (!user) {
      setLoading(false);
      setLeaderboardData([]);
      setUserRankInfo(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch leaderboard data using the get_leaderboard function
      const { data: leaderboardUsers, error: leaderboardError } = await supabase
        .rpc('get_leaderboard', {
          time_filter: timeFilter
        });

      if (leaderboardError) {
        console.error('Leaderboard RPC error:', leaderboardError);
        // Fallback: Calculate from problem_submissions directly
        await fetchLeaderboardFallback();
        return;
      }

      if (leaderboardUsers && leaderboardUsers.length > 0) {
        console.log('📊 Leaderboard users:', leaderboardUsers);
        
        // Format leaderboard data with proper difficulty breakdown
        const formattedLeaderboard: LeaderboardType[] = leaderboardUsers.map((u: LeaderboardUser) => {
          const easyCount = Number(u.easy_count) || 0;
          const mediumCount = Number(u.medium_count) || 0;
          const hardCount = Number(u.hard_count) || 0;
          const totalSolved = Number(u.total_solved) || 0;
          
          console.log(`User ${u.display_name || u.user_id.substring(0, 8)}: E=${easyCount} M=${mediumCount} H=${hardCount} Total=${totalSolved}`);
          
          return {
            userId: u.user_id,
            userName: u.user_id === user.id ? 'You' : (u.display_name || `User ${u.user_id.substring(0, 8)}`),
            avatar: getAvatarForUser(u.user_id === user.id, u.display_name),
            rank: Number(u.rank),
            points: Number(u.points),
            problemsSolved: totalSolved,
            streak: u.user_id === user.id ? streak : Number(u.streak || 0),
            easyCount: easyCount,
            mediumCount: mediumCount,
            hardCount: hardCount
          };
        });

        setLeaderboardData(formattedLeaderboard);

        // Fetch user rank info
        await fetchUserRankInfo();
      } else {
        setLeaderboardData([]);
        setUserRankInfo(null);
      }

    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message || 'Failed to load leaderboard. Please try again.');
      setLeaderboardData([]);
      setUserRankInfo(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastUpdated(new Date());
    }
  };

  // Fallback method if RPC function doesn't exist
  const fetchLeaderboardFallback = async () => {
    try {
      const { data: submissions, error: submissionsError } = await supabase
        .from('problem_submissions')
        .select('user_id, status, difficulty, solved_at, problem_id')
        .eq('status', 'solved')
        .order('solved_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      if (!submissions || submissions.length === 0) {
        setLeaderboardData([]);
        setUserRankInfo(null);
        return;
      }

      // Calculate user stats
      const userStatsMap = new Map<string, {
        solved: Set<string>;
        easy: number;
        medium: number;
        hard: number;
        points: number;
      }>();

      submissions.forEach((sub: any) => {
        if (!userStatsMap.has(sub.user_id)) {
          userStatsMap.set(sub.user_id, {
            solved: new Set(),
            easy: 0,
            medium: 0,
            hard: 0,
            points: 0
          });
        }

        const userStat = userStatsMap.get(sub.user_id)!;
        
        // Only count unique problems
        if (!userStat.solved.has(sub.problem_id)) {
          userStat.solved.add(sub.problem_id);
          
          if (sub.difficulty === 'Easy') {
            userStat.easy++;
            userStat.points += 10;
          } else if (sub.difficulty === 'Medium') {
            userStat.medium++;
            userStat.points += 25;
          } else if (sub.difficulty === 'Hard') {
            userStat.hard++;
            userStat.points += 50;
          }
        }
      });

      // Convert to leaderboard format
      const leaderboard: LeaderboardType[] = Array.from(userStatsMap.entries())
        .map(([userId, stat]) => ({
          userId,
          userName: userId === user?.id ? 'You' : `User ${userId.substring(0, 8)}`,
          avatar: userId === user?.id ? '😊' : '👤',
          rank: 0,
          points: stat.points,
          problemsSolved: stat.solved.size,
          streak: userId === user?.id ? streak : 0,
          easyCount: stat.easy,
          mediumCount: stat.medium,
          hardCount: stat.hard
        }))
        .sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          return b.problemsSolved - a.problemsSolved;
        })
        .map((item, index) => ({ ...item, rank: index + 1 }));

      setLeaderboardData(leaderboard);

      // Set user rank info
      if (user) {
        const userEntry = leaderboard.find(u => u.userId === user.id);
        if (userEntry) {
          setUserRankInfo({
            rank: userEntry.rank,
            total_users: leaderboard.length,
            points: userEntry.points,
            total_solved: userEntry.problemsSolved
          });
        }
      }
    } catch (err) {
      console.error('Fallback leaderboard error:', err);
      setLeaderboardData([]);
      setUserRankInfo(null);
    }
  };

  // Fetch user rank information
  const fetchUserRankInfo = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_user_rank', {
          p_user_id: user.id
        });

      if (error) {
        console.error('User rank fetch error:', error);
        return;
      }

      if (data && data.length > 0) {
        setUserRankInfo({
          rank: Number(data[0].rank),
          total_users: Number(data[0].total_users),
          points: Number(data[0].points),
          total_solved: Number(data[0].total_solved)
        });
      }
    } catch (err) {
      console.error('Error fetching user rank:', err);
    }
  };

  // Helper function to get avatar
  const getAvatarForUser = (isCurrentUser: boolean, displayName?: string): string => {
    if (isCurrentUser) return '😊';
    if (!displayName) return '👤';
    
    // Generate avatar based on first letter of display name
    const firstLetter = displayName.charAt(0).toUpperCase();
    const emojiMap: { [key: string]: string } = {
      'A': '🅰️', 'B': '🅱️', 'C': '©️', 'D': '🌟', 'E': '🔷', 'F': '🔥',
      'G': '💚', 'H': '🏠', 'I': '🎯', 'J': '🎪', 'K': '👑', 'L': '💙',
      'M': '🎵', 'N': '🌙', 'O': '⭕', 'P': '💜', 'Q': '👸', 'R': '🚀',
      'S': '⭐', 'T': '🎭', 'U': '☂️', 'V': '✌️', 'W': '🌊', 'X': '❌',
      'Y': '💛', 'Z': '⚡'
    };
    
    return emojiMap[firstLetter] || '👤';
  };

  // Refresh leaderboard
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboardData();
  };

  // Format time ago
  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Filter leaderboard by search query
  const filteredLeaderboard = leaderboardData.filter(user => 
    user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredLeaderboard.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredLeaderboard.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Scroll current user into view
  const scrollToCurrentUser = () => {
    const userIndex = filteredLeaderboard.findIndex(u => u.userId === user?.id);
    if (userIndex !== -1) {
      const userPage = Math.floor(userIndex / itemsPerPage) + 1;
      setCurrentPage(userPage);
      setTimeout(() => {
        const userElement = document.querySelector('.leaderboard-item.current-user');
        userElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  // Calculate real achievements based on user progress
  useEffect(() => {
    if (!user || !stats) {
      setAchievements([]);
      return;
    }

    try {
      const calculatedAchievements: Achievement[] = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Solve your first problem',
        icon: '🎯',
        category: 'problems',
        requirement: 1,
        unlockedAt: stats.solved >= 1 ? new Date().toISOString() : undefined
      },
      {
        id: '2',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        category: 'streak',
        requirement: 7,
        unlockedAt: streak >= 7 ? new Date().toISOString() : undefined
      },
      {
        id: '3',
        name: 'Problem Solver',
        description: 'Solve 10 problems',
        icon: '⚡',
        category: 'problems',
        requirement: 10,
        unlockedAt: stats.solved >= 10 ? new Date().toISOString() : undefined
      },
      {
        id: '4',
        name: 'Half Century',
        description: 'Solve 50 problems',
        icon: '🌟',
        category: 'problems',
        requirement: 50,
        unlockedAt: stats.solved >= 50 ? new Date().toISOString() : undefined
      },
      {
        id: '5',
        name: 'Century Club',
        description: 'Solve 100 problems',
        icon: '💯',
        category: 'problems',
        requirement: 100,
        unlockedAt: stats.solved >= 100 ? new Date().toISOString() : undefined
      },
      {
        id: '6',
        name: 'Easy Master',
        description: 'Solve 25 Easy problems',
        icon: '🎓',
        category: 'difficulty',
        requirement: 25,
        unlockedAt: stats.easy >= 25 ? new Date().toISOString() : undefined
      },
      {
        id: '7',
        name: 'Medium Maven',
        description: 'Solve 25 Medium problems',
        icon: '🚀',
        category: 'difficulty',
        requirement: 25,
        unlockedAt: stats.medium >= 25 ? new Date().toISOString() : undefined
      },
      {
        id: '8',
        name: 'Hard Hitter',
        description: 'Solve 10 Hard problems',
        icon: '💪',
        category: 'difficulty',
        requirement: 10,
        unlockedAt: stats.hard >= 10 ? new Date().toISOString() : undefined
      },
      {
        id: '9',
        name: 'Topic Explorer',
        description: 'Start 5 different topics',
        icon: '🗺️',
        category: 'topics',
        requirement: 5,
        unlockedAt: Object.keys(progress.topicsProgress).length >= 5 ? new Date().toISOString() : undefined
      },
      {
        id: '10',
        name: 'Dedicated Learner',
        description: 'Maintain a 30-day streak',
        icon: '🏆',
        category: 'streak',
        requirement: 30,
        unlockedAt: streak >= 30 ? new Date().toISOString() : undefined
      }
    ];

    setAchievements(calculatedAchievements);

    // Calculate badges based on topics completed
    const calculatedBadges: Badge[] = [
      {
        id: '1',
        name: 'Array Expert',
        description: 'Mastered array problems',
        icon: '📊',
        rarity: 'common',
        earnedDate: stats.solved >= 20 ? new Date().toISOString() : undefined
      },
      {
        id: '2',
        name: 'String Specialist',
        description: 'Expert in string manipulation',
        icon: '📝',
        rarity: 'common',
        earnedDate: stats.solved >= 30 ? new Date().toISOString() : undefined
      },
      {
        id: '3',
        name: 'Tree Climber',
        description: 'Mastered tree problems',
        icon: '🌳',
        rarity: 'rare',
        earnedDate: stats.medium >= 15 ? new Date().toISOString() : undefined
      },
      {
        id: '4',
        name: 'Graph Navigator',
        description: 'Expert in graph algorithms',
        icon: '🕸️',
        rarity: 'epic',
        earnedDate: stats.hard >= 5 ? new Date().toISOString() : undefined
      },
      {
        id: '5',
        name: 'DP Master',
        description: 'Dynamic programming expert',
        icon: '⚙️',
        rarity: 'legendary',
        earnedDate: stats.hard >= 15 ? new Date().toISOString() : undefined
      },
      {
        id: '6',
        name: 'Consistency Champion',
        description: 'Solved problems every day for a week',
        icon: '🎯',
        rarity: 'rare',
        earnedDate: streak >= 7 ? new Date().toISOString() : undefined
      }
    ];

    setBadges(calculatedBadges);
    } catch (error) {
      console.error('Error calculating achievements/badges:', error);
      setAchievements([]);
      setBadges([]);
    }
  }, [user, stats, streak, progress.topicsProgress]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={24} className="rank-icon gold" />;
    if (rank === 2) return <Medal size={24} className="rank-icon silver" />;
    if (rank === 3) return <Medal size={24} className="rank-icon bronze" />;
    return <span className="rank-number">#{rank}</span>;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#94a3b8';
      case 'rare': return '#3b82f6';
      case 'epic': return '#a855f7';
      case 'legendary': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="leaderboard-achievements">
      <div className="header-section">
        <h1>🏆 Compete & Achieve</h1>
        <p>Track your progress, climb the ranks, and unlock achievements</p>
        <div className="realtime-badge">
          <Zap size={14} />
          <span>Live Updates</span>
        </div>
      </div>

      {!user && (
        <div className="empty-state">
          <Trophy size={64} className="empty-icon" />
          <h3>Login Required</h3>
          <p>Please log in to view the leaderboard and track your achievements.</p>
        </div>
      )}

      {user && (
        <>
          {/* User Stats Overview */}
          {userRankInfo && (
            <div className="user-stats-overview">
              <div className="stat-card">
                <div className="stat-icon">
                  <Trophy size={24} className="trophy-icon" />
                </div>
                <div className="stat-content">
                  <div className="stat-value">#{userRankInfo.rank}</div>
                  <div className="stat-label">Your Rank</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Zap size={24} className="points-icon" />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{userRankInfo.points.toLocaleString()}</div>
                  <div className="stat-label">Points</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Target size={24} className="solved-icon" />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{userRankInfo.total_solved}</div>
                  <div className="stat-label">Solved</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} className="users-icon" />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{userRankInfo.total_users}</div>
                  <div className="stat-label">Total Users</div>
                </div>
              </div>
            </div>
          )}

          <div className="tabs-container">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
            >
              <Trophy size={20} />
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
            >
              <Award size={20} />
              Achievements
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`tab ${activeTab === 'badges' ? 'active' : ''}`}
            >
              <Star size={20} />
              Badges
            </button>
          </div>

          {loading && (
            <div className="loading-container">
              <Loader2 size={48} className="spinner" />
              <p>Loading {activeTab}...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button onClick={handleRefresh} className="retry-btn">
                Retry
              </button>
            </div>
          )}

      {!loading && !error && activeTab === 'leaderboard' && (
        <div className="leaderboard-section">
          {/* Real-time Update Indicator */}
          {showUpdateIndicator && (
            <div className="realtime-update-indicator">
              <Zap size={16} className="pulse-icon" />
              <span>Leaderboard updated in real-time!</span>
            </div>
          )}
          
          <div className="leaderboard-stats-bar">
            <div className="total-users-info">
              <Users size={20} />
              <span className="user-count">
                {filteredLeaderboard.length} {filteredLeaderboard.length === 1 ? 'User' : 'Users'}
              </span>
              {searchQuery && (
                <span className="search-result-count">
                  (filtered from {leaderboardData.length})
                </span>
              )}
              <span className="last-updated" title={lastUpdated.toLocaleString()}>
                • Updated {formatTimeAgo(lastUpdated)}
              </span>
            </div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {user && (
                <button onClick={scrollToCurrentUser} className="find-me-btn" title="Find me on leaderboard">
                  Find Me
                </button>
              )}
            </div>
          </div>
          <div className="leaderboard-header">
            <div className="filters">
              <button
                onClick={() => setTimeFilter('daily')}
                className={`filter-btn ${timeFilter === 'daily' ? 'active' : ''}`}
              >
                Daily
              </button>
              <button
                onClick={() => setTimeFilter('weekly')}
                className={`filter-btn ${timeFilter === 'weekly' ? 'active' : ''}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeFilter('monthly')}
                className={`filter-btn ${timeFilter === 'monthly' ? 'active' : ''}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeFilter('alltime')}
                className={`filter-btn ${timeFilter === 'alltime' ? 'active' : ''}`}
              >
                All Time
              </button>
            </div>
            <button 
              onClick={handleRefresh} 
              className="refresh-btn"
              disabled={refreshing}
            >
              {refreshing ? <Loader2 size={16} className="spinner" /> : <TrendingUp size={16} />}
              Refresh
            </button>
          </div>

          {leaderboardData.length === 0 ? (
            <div className="empty-state">
              <Trophy size={64} className="empty-icon" />
              <h3>No Leaderboard Data Yet</h3>
              <p>Start solving problems to appear on the leaderboard!</p>
            </div>
          ) : (
            <>
              <div className="leaderboard-table-header">
                <div className="header-rank">Rank</div>
                <div className="header-user">User</div>
                <div className="header-problems">Problems</div>
                <div className="header-breakdown">Difficulty</div>
                <div className="header-streak">Streak</div>
                <div className="header-points">Points</div>
              </div>
              <div className="leaderboard-list">
                {paginatedData.map((userData) => (
                  <div
                    key={userData.userId}
                    className={`leaderboard-item ${userData.userId === user?.id ? 'current-user' : ''} ${userData.rank <= 3 ? 'top-three' : ''}`}
                  >
                    <div className="rank-section">
                      {getRankIcon(userData.rank)}
                    </div>

                    <div className="user-info">
                      <div className="avatar">{userData.avatar}</div>
                      <div className="user-details">
                        <div className="user-name">
                          {userData.userName}
                          {userData.userId === user?.id && <span className="you-badge">YOU</span>}
                        </div>
                      </div>
                    </div>

                    <div className="problems-section">
                      <div className="problems-count">{userData.problemsSolved}</div>
                      <div className="problems-label">solved</div>
                    </div>

                    <div className="difficulty-breakdown">
                      <span className="difficulty-stat easy">
                        <span className="diff-count">{userData.easyCount ?? 0}</span>
                        <span className="diff-label">E</span>
                      </span>
                      <span className="difficulty-stat medium">
                        <span className="diff-count">{userData.mediumCount ?? 0}</span>
                        <span className="diff-label">M</span>
                      </span>
                      <span className="difficulty-stat hard">
                        <span className="diff-count">{userData.hardCount ?? 0}</span>
                        <span className="diff-label">H</span>
                      </span>
                    </div>

                    <div className="streak-section">
                      {userData.streak > 0 ? (
                        <>
                          <Flame size={16} className="streak-icon" />
                          <span className="streak-count">{userData.streak} days</span>
                        </>
                      ) : (
                        <span className="no-streak">-</span>
                      )}
                    </div>

                    <div className="points-section">
                      <div className="points">{userData.points.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-controls">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <div className="page-info">
                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                    <span className="showing-range">
                      (Showing {startIndex + 1}-{Math.min(endIndex, filteredLeaderboard.length)} of {filteredLeaderboard.length})
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Last
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!loading && !error && activeTab === 'achievements' && (
        <div className="achievements-section">
          <div className="achievements-stats">
            <div className="stat-card">
              <Award size={32} className="stat-icon" />
              <div>
                <div className="stat-value">
                  {achievements.filter(a => a.unlockedAt).length}/{achievements.length}
                </div>
                <div className="stat-label">Unlocked</div>
              </div>
            </div>
            <div className="stat-card">
              <Target size={32} className="stat-icon" />
              <div>
                <div className="stat-value">{stats.solved}</div>
                <div className="stat-label">Problems Solved</div>
              </div>
            </div>
            <div className="stat-card">
              <Flame size={32} className="stat-icon" />
              <div>
                <div className="stat-value">{streak}</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>
          </div>

          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`achievement-card ${achievement.unlockedAt ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-content">
                  <h3 className="achievement-name">{achievement.name}</h3>
                  <p className="achievement-description">{achievement.description}</p>
                  {achievement.unlockedAt ? (
                    <div className="achievement-date">
                      ✅ Unlocked!
                    </div>
                  ) : (
                    <div className="achievement-progress">
                      🔒 Keep going to unlock!
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && activeTab === 'badges' && (
        <div className="badges-section">
          <div className="badges-stats">
            <div className="stat-card">
              <Star size={32} className="stat-icon" />
              <div>
                <div className="stat-value">
                  {badges.filter(b => b.earnedDate).length}/{badges.length}
                </div>
                <div className="stat-label">Earned</div>
              </div>
            </div>
            <div className="stat-card">
              <Trophy size={32} className="stat-icon" />
              <div>
                <div className="stat-value">
                  {badges.filter(b => b.earnedDate && b.rarity === 'legendary').length}
                </div>
                <div className="stat-label">Legendary</div>
              </div>
            </div>
          </div>

          <div className="badges-grid">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`badge-card ${badge.earnedDate ? 'earned' : 'locked'}`}
                style={{ borderColor: badge.earnedDate ? getRarityColor(badge.rarity) : undefined }}
              >
                <div
                  className="badge-icon"
                  style={{ background: badge.earnedDate ? `linear-gradient(135deg, ${getRarityColor(badge.rarity)}40, ${getRarityColor(badge.rarity)}20)` : undefined }}
                >
                  {badge.icon}
                </div>
                <div className="badge-content">
                  <div className="badge-header">
                    <h3 className="badge-name">{badge.name}</h3>
                    <span className={`badge-rarity ${badge.rarity}`}>
                      {badge.rarity}
                    </span>
                  </div>
                  <p className="badge-description">{badge.description}</p>
                  {badge.earnedDate ? (
                    <div className="badge-date">
                      ✅ Earned
                    </div>
                  ) : (
                    <div className="badge-locked">
                      🔒 Not earned yet
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
