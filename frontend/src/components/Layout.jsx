import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="shell">
      <header className="topbar">
        <span className="brand">CareDesk</span>
        <nav>
          <NavLink to="/patients">Patients</NavLink>
          <NavLink to="/doctors">Doctors</NavLink>
          <NavLink to="/mappings">Assignments</NavLink>
        </nav>
        <div className="who">
          <span className="muted">{user.name}</span>
          <button className="ghost" onClick={logout}>Log out</button>
        </div>
      </header>
      <main><Outlet /></main>
    </div>
  );
}
