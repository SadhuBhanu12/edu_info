import { useAuth } from '../../context/AuthContext';
import { AdvancedAnalytics } from '../../components/AdvancedAnalytics';
import './AdvancedAnalyticsPage.css';

export default function AdvancedAnalyticsPage() {
  const { user } = useAuth();

  return (
    <div className="advanced-analytics-page">
      <div className="page-header">
        <h1>📊 Advanced Analytics</h1>
        <p className="page-subtitle">
          Deep insights into your learning patterns, strengths, and areas for improvement
        </p>
      </div>

      <AdvancedAnalytics userId={user?.id || 'anonymous'} />
    </div>
  );
}
