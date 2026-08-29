import { Link } from 'react-router-dom';

export default function SignupPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="logo">W</span>
          <h1>Create account</h1>
          <p>Start managing your work with Workly</p>
        </div>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            Name
            <input type="text" placeholder="Alex Chen" required />
          </label>
          <label>
            Email
            <input type="email" placeholder="you@company.com" required />
          </label>
          <label>
            Password
            <input type="password" placeholder="••••••••" required />
          </label>
          <Link to="/dashboard" className="primary-btn auth-submit">
            Create account
          </Link>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
