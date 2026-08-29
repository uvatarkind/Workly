import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTheme, setTheme as applyTheme } from '../utils/theme';
import { IconMail, IconUpload } from '../components/Icons';

const TABS = ['My details', 'Profile', 'Password', 'Team', 'Preferences', 'Demo'];

function MyDetailsForm({ currentUser, updateProfile }) {
  const parts = currentUser.name.split(' ');
  const [firstName, setFirstName] = useState(parts[0] ?? '');
  const [lastName, setLastName] = useState(parts.slice(1).join(' ') ?? '');
  const [email, setEmail] = useState(currentUser.email);
  const [role, setRole] = useState('Product Designer');
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    updateProfile({ name: `${firstName} ${lastName}`.trim(), email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="panel settings-content">
      <form id="settings-details-form" className="settings-form" onSubmit={handleSave}>
        <div className="field-row">
          <label>
            First name
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </label>
          <label>
            Last name
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </label>
        </div>
        <label>
          Email
          <div className="input-icon-wrap">
            <IconMail />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </label>
        <label>
          Profile photo
          <div className="upload-dropzone">
            <IconUpload />
            <strong>Click to upload</strong>
            <span>or drag and drop</span>
            <span className="settings-note">SVG, PNG, JPG or GIF (max. 800×400px)</span>
          </div>
        </label>
        <label>
          Role
          <input value={role} onChange={(e) => setRole(e.target.value)} />
        </label>
      </form>
      {saved && <p className="settings-note">Profile saved.</p>}
    </section>
  );
}

export default function SettingsPage() {
  const { currentUser, state, updateProfile, clearAllData, switchUser } = useApp();
  const [tab, setTab] = useState('My details');
  const [theme, setTheme] = useState(getTheme);

  function handleThemeChange(value) {
    setTheme(value);
    applyTheme(value);
  }

  return (
    <div className="page settings-page mockup-settings">
      <section className="settings-hero">
        <div className="settings-banner" />
        <div className="settings-hero-body">
          <span className="settings-avatar">{currentUser.initials}</span>
          <div className="settings-hero-text">
            <h1>Settings</h1>
            <p>{currentUser.email}</p>
          </div>
          <div className="settings-hero-actions">
            <button type="button" className="ghost-btn">Cancel</button>
            <button type="submit" form="settings-details-form" className="primary-btn">
              Save
            </button>
          </div>
        </div>
      </section>

      <div className="settings-tabs mockup-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={tab === t ? 'active' : undefined}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'My details' && (
        <MyDetailsForm
          key={currentUser.id}
          currentUser={currentUser}
          updateProfile={updateProfile}
        />
      )}

      {tab === 'Profile' && (
        <section className="panel settings-content">
          <p className="settings-note">Public profile settings coming soon.</p>
        </section>
      )}

      {tab === 'Password' && (
        <section className="panel settings-content">
          <form className="settings-form">
            <label>Current password<input type="password" /></label>
            <label>New password<input type="password" /></label>
            <label>Confirm password<input type="password" /></label>
            <button type="button" className="primary-btn">Update password</button>
          </form>
        </section>
      )}

      {tab === 'Team' && (
        <section className="panel settings-content">
          <p className="settings-note">Manage team members from each workspace&apos;s Members page.</p>
        </section>
      )}

      {tab === 'Preferences' && (
        <section className="panel settings-content">
          <form className="settings-form">
            <label>
              Theme
              <select value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label>
              Default task view
              <select defaultValue="board">
                <option value="board">Board</option>
                <option value="list">List</option>
                <option value="calendar">Calendar</option>
              </select>
            </label>
          </form>
        </section>
      )}

      {tab === 'Demo' && (
        <section className="panel settings-content">
          <p className="settings-note">Switch users to test workspace invites.</p>
          <ul className="demo-user-list">
            {state.users.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  className={`demo-user-btn${user.id === currentUser.id ? ' active' : ''}`}
                  onClick={() => switchUser(user.id)}
                >
                  <span className="member-avatar">{user.initials}</span>
                  <span>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </span>
                  {user.id === currentUser.id && <span className="demo-current">Current</span>}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="panel settings-danger">
        <h2>Reset demo data</h2>
        <p>Restore the app to its initial demo state. This cannot be undone.</p>
        <button type="button" className="danger-btn" onClick={clearAllData}>Reset all data</button>
      </section>
    </div>
  );
}
