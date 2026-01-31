import { useAuth } from '../../context/AuthContext';
import { StudyPlanManager } from '../../components/StudyPlanManager';
import './StudyPlansPage.css';

export default function StudyPlansPage() {
  const { user } = useAuth();

  return (
    <div className="study-plans-page">
      <div className="page-header">
        <h1>📚 Study Plans</h1>
        <p className="page-subtitle">
          Create custom study plans, track your progress, and stay on target for your interview goals
        </p>
      </div>

      <StudyPlanManager userId={user?.id || 'anonymous'} />
    </div>
  );
}
