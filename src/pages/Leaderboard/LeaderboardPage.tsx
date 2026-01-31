import { useAuth } from '../../context/AuthContext';
import { LeaderboardAchievements } from '../../components/LeaderboardAchievements';
import './LeaderboardPage.css';

export default function LeaderboardPage() {
  const { user } = useAuth();

  return (
    <div className="leaderboard-page">
      <div className="page-header">
        <h1>🏆 Leaderboard & Achievements</h1>
        <p className="page-subtitle">
          Compete with peers, earn badges, and celebrate your coding journey
        </p>
      </div>

      <LeaderboardAchievements userId={user?.id || 'anonymous'} />
    </div>
  );
}
