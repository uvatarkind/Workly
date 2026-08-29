import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="logo">W</span>
          <h1>Workly</h1>
          <p>Focused work management</p>
        </div>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            Email
            <input type="email" placeholder="you@company.com" required />
          </label>
          <label>
            Password
            <input type="password" placeholder="••••••••" required />
          </label>
          <Link to="/dashboard" className="primary-btn auth-submit">
            Sign in
          </Link>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
