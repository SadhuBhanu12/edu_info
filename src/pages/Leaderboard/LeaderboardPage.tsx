import { useAuth } from '../../context/AuthContext';
import { LeaderboardAchievements } from '../../components/LeaderboardAchievements';
import './LeaderboardPage.css';

export default function LeaderboardPage() {
  const { user } = useAuth();

  return (
    <div className="leaderboard-page-wrapper">
      <LeaderboardAchievements userId={user?.id || 'anonymous'} />
    </div>
  );
}
