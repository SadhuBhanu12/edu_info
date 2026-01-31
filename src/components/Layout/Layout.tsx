import { Outlet } from 'react-router-dom';
import { ProfessionalHeader } from './ProfessionalHeader';
import { QuickAccessMenu } from './QuickAccessMenu';
import './Layout.css';

export function Layout() {
  return (
    <div className="layout">
      <ProfessionalHeader />
      <main className="main-content">
        <Outlet />
      </main>
      <QuickAccessMenu />
    </div>
  );
}
