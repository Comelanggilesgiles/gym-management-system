import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';

export default function Dashboard({ auth, onLogout }) {
  if (!auth) return null;
  return auth.role === 'admin' ? (
    <AdminDashboard auth={auth} onLogout={onLogout} />
  ) : (
    <ClientDashboard auth={auth} onLogout={onLogout} />
  );
}
