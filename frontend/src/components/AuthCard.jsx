import { Link } from 'react-router-dom';

export default function AuthCard({ title, subtitle, footer, children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="brand">CareDesk</span>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
        <p className="muted small">{footer.text} <Link to={footer.to}>{footer.link}</Link></p>
      </div>
    </div>
  );
}
