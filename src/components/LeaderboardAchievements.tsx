import React, { useState, useEffect } from 'react';
import { Trophy, Medal, TrendingUp, Flame, Target, Award, Crown, Star, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { supabase } from '../lib/supabase';
import type { Leaderboard as LeaderboardType, Achievement, Badge } from '../types';
import './LeaderboardAchievements.css';

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

export const LeaderboardAchievements: React.FC<LeaderboardAchievementsProps> = () => {
  const { user } = useAuth();
  const { progress, getTotalStats, getStreak } = useProgress();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'achievements' | 'badges'>('leaderboard');
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'alltime'>('alltime');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardType[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats = getTotalStats();
  const streak = getStreak();

  // Fetch real leaderboard data from Supabase
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!user) {
        setLoading(false);
        setLeaderboardData([]);
        setAchievements([]);
        setBadges([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch leaderboard data from Supabase
        const { data: leaderboardUsers, error: leaderboardError } = await supabase
          .rpc('get_leaderboard', {
            time_filter: timeFilter
          });

        if (leaderboardError) {
          console.error('Leaderboard fetch error:', leaderboardError);
          // If RPC doesn't exist, fetch from problem_submissions
          const { data: submissions, error: submissionsError } = await supabase
            .from('problem_submissions')
            .select('user_id, status, difficulty, solved_at')
            .eq('status', 'solved')
            .order('solved_at', { ascending: false });

          if (submissionsError) {
            console.error('Submissions fetch error:', submissionsError);
            // Set empty leaderboard instead of throwing
            setLeaderboardData([]);
            setUserRank(0);
            setLoading(false);
            return;
          }

          // Process submissions to create leaderboard
          if (!submissions || submissions.length === 0) {
            setLeaderboardData([]);
            setUserRank(0);
            setLoading(false);
            return;
          }

          const userStats = new Map<string, { solved: number; easy: number; medium: number; hard: number; points: number }>();
          
          submissions.forEach((sub: any) => {
            if (!userStats.has(sub.user_id)) {
              userStats.set(sub.user_id, { solved: 0, easy: 0, medium: 0, hard: 0, points: 0 });
            }
            const stats = userStats.get(sub.user_id)!;
            stats.solved++;
            
            if (sub.difficulty === 'Easy') {
              stats.easy++;
              stats.points += 10;
            } else if (sub.difficulty === 'Medium') {
              stats.medium++;
              stats.points += 25;
            } else if (sub.difficulty === 'Hard') {
              stats.hard++;
              stats.points += 50;
            }
          });

          // Convert to leaderboard format
          const leaderboard: LeaderboardType[] = Array.from(userStats.entries())
            .map(([userId, stats], index) => ({
              userId,
              userName: userId === user.id ? 'You' : `User ${userId.substring(0, 8)}`,
              avatar: userId === user.id ? '😊' : '👤',
              rank: index + 1,
              points: stats.points,
              problemsSolved: stats.solved,
              streak: userId === user.id ? streak : 0
            }))
            .sort((a, b) => b.points - a.points)
            .map((item, index) => ({ ...item, rank: index + 1 }))
            .slice(0, 50); // Top 50

          setLeaderboardData(leaderboard);
          const currentUserRank = leaderboard.findIndex(u => u.userId === user.id) + 1;
          setUserRank(currentUserRank > 0 ? currentUserRank : leaderboard.length + 1);
        } else if (leaderboardUsers) {
          const formattedLeaderboard: LeaderboardType[] = leaderboardUsers.map((u: LeaderboardUser, index: number) => ({
            userId: u.user_id,
            userName: u.user_id === user.id ? 'You' : u.display_name || `User ${u.user_id.substring(0, 8)}`,
            avatar: u.user_id === user.id ? '😊' : '👤',
            rank: u.rank || index + 1,
            points: u.points,
            problemsSolved: u.total_solved,
            streak: u.user_id === user.id ? streak : u.streak
          }));

          setLeaderboardData(formattedLeaderboard);
          const currentUserRank = formattedLeaderboard.findIndex(u => u.userId === user.id) + 1;
          setUserRank(currentUserRank > 0 ? currentUserRank : formattedLeaderboard.length + 1);
        }

      } catch (err: any) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message || 'Failed to load leaderboard. Please try again.');
        setLeaderboardData([]);
        setUserRank(0);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [user, timeFilter, streak]);

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
              <button onClick={() => window.location.reload()} className="retry-btn">
                Retry
              </button>
            </div>
          )}

      {!loading && !error && activeTab === 'leaderboard' && (
        <div className="leaderboard-section">
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

          {leaderboardData.length === 0 ? (
            <div className="empty-state">
              <Trophy size={64} className="empty-icon" />
              <h3>No Leaderboard Data Yet</h3>
              <p>Start solving problems to appear on the leaderboard!</p>
            </div>
          ) : (
            <div className="leaderboard-list">
              {leaderboardData.map((userData) => (
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
                      <div className="user-name">{userData.userName}</div>
                      <div className="user-stats">
                        <span className="stat">
                          <Target size={14} />
                          {userData.problemsSolved} solved
                        </span>
                        {userData.streak > 0 && (
                          <span className="stat">
                            <Flame size={14} />
                            {userData.streak} day streak
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="points-section">
                    <div className="points">{userData.points.toLocaleString()}</div>
                    <div className="points-label">points</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {userRank > 5 && leaderboardData.length > 0 && (
            <div className="user-rank-card">
              <div className="rank-info">
                <span className="your-rank">Your Rank: #{userRank}</span>
                <span className="rank-change">
                  <TrendingUp size={16} />
                  Keep climbing!
                </span>
              </div>
              <p className="rank-message">
                Solve more problems to improve your ranking!
              </p>
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'achievements' && (
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
