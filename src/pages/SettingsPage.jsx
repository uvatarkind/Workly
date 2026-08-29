import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTheme, setTheme as applyTheme } from '../utils/theme';
import { getDemoPassword, setDemoPassword } from '../utils/demoPassword';
import TeamPanel from '../components/TeamPanel';
import { IconMail, IconUpload } from '../components/Icons';

const TABS = ['My details', 'Profile', 'Password', 'Team', 'Preferences', 'Demo'];

const TAB_FORMS = {
  'My details': 'settings-details-form',
  Profile: 'settings-profile-form',
  Password: 'settings-password-form',
};

function MyDetailsForm({ currentUser, updateProfile, onSaved }) {
  const parts = currentUser.name.split(' ');
  const [firstName, setFirstName] = useState(parts[0] ?? '');
  const [lastName, setLastName] = useState(parts.slice(1).join(' ') ?? '');
  const [email, setEmail] = useState(currentUser.email);
  const [role, setRole] = useState(currentUser.jobTitle ?? 'Product Designer');

  function handleSave(e) {
    e.preventDefault();
    updateProfile({
      name: `${firstName} ${lastName}`.trim(),
      email,
      jobTitle: role,
    });
    onSaved?.();
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
    </section>
  );
}

function ProfileForm({ currentUser, updateProfile, onSaved }) {
  const [bio, setBio] = useState(currentUser.bio ?? '');
  const [location, setLocation] = useState(currentUser.location ?? '');
  const [website, setWebsite] = useState(currentUser.website ?? '');

  function handleSave(e) {
    e.preventDefault();
    updateProfile({ bio, location, website });
    onSaved?.();
  }

  return (
    <section className="panel settings-content">
      <p className="settings-note">This information appears on your public profile.</p>
      <form id="settings-profile-form" className="settings-form" onSubmit={handleSave}>
        <label>
          Bio
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell your team a little about yourself…"
          />
        </label>
        <label>
          Location
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="San Francisco, CA"
          />
        </label>
        <label>
          Website
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://"
          />
        </label>
      </form>
    </section>
  );
}

function PasswordForm({ currentUser, onSaved }) {
  const hasPassword = Boolean(getDemoPassword(currentUser.id));
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleSave(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (hasPassword && current !== getDemoPassword(currentUser.id)) {
      setError('Current password is incorrect.');
      return;
    }
    if (next.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      setError('New passwords do not match.');
      return;
    }

    setDemoPassword(currentUser.id, next);
    setCurrent('');
    setNext('');
    setConfirm('');
    setSuccess('Password updated (demo only — stored locally).');
    onSaved?.();
  }

  return (
    <section className="panel settings-content">
      <p className="settings-note">Demo mode: passwords are saved in your browser only.</p>
      <form id="settings-password-form" className="settings-form" onSubmit={handleSave}>
        {hasPassword && (
          <label>
            Current password
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoComplete="current-password"
            />
          </label>
        )}
        <label>
          New password
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password"
            minLength={8}
          />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        {error && <p className="invite-feedback error">{error}</p>}
        {success && <p className="invite-feedback success">{success}</p>}
      </form>
    </section>
  );
}

export default function SettingsPage() {
  const { currentUser, state, updateProfile, clearAllData, switchUser, myWorkspaces } = useApp();
  const [tab, setTab] = useState('My details');
  const [theme, setTheme] = useState(getTheme);
  const [defaultView, setDefaultView] = useState(() => localStorage.getItem('workly.defaultView') ?? 'board');
  const [resetToken, setResetToken] = useState(0);
  const [savedFlash, setSavedFlash] = useState(false);

  const teamWorkspaces = myWorkspaces.filter((w) => w.type === 'team');
  const activeFormId = TAB_FORMS[tab];

  function flashSaved() {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }

  function handleCancel() {
    setResetToken((t) => t + 1);
    setTheme(getTheme());
    setDefaultView(localStorage.getItem('workly.defaultView') ?? 'board');
  }

  function handleThemeChange(value) {
    setTheme(value);
    applyTheme(value);
    localStorage.setItem('workly.theme', value);
  }

  function handlePreferencesSave(e) {
    e.preventDefault();
    localStorage.setItem('workly.defaultView', defaultView);
    flashSaved();
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
            <button type="button" className="ghost-btn" onClick={handleCancel}>
              Cancel
            </button>
            {activeFormId ? (
              <button type="submit" form={activeFormId} className="primary-btn">
                {savedFlash ? 'Saved!' : 'Save'}
              </button>
            ) : tab === 'Preferences' ? (
              <button type="submit" form="settings-preferences-form" className="primary-btn">
                {savedFlash ? 'Saved!' : 'Save'}
              </button>
            ) : null}
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
          key={`details-${currentUser.id}-${resetToken}`}
          currentUser={currentUser}
          updateProfile={updateProfile}
          onSaved={flashSaved}
        />
      )}

      {tab === 'Profile' && (
        <ProfileForm
          key={`profile-${currentUser.id}-${resetToken}`}
          currentUser={currentUser}
          updateProfile={updateProfile}
          onSaved={flashSaved}
        />
      )}

      {tab === 'Password' && (
        <PasswordForm
          key={`password-${currentUser.id}-${resetToken}`}
          currentUser={currentUser}
          onSaved={flashSaved}
        />
      )}

      {tab === 'Team' && (
        <section className="panel settings-content">
          {teamWorkspaces.length === 0 ? (
            <p className="settings-note">You are not in any team workspaces yet.</p>
          ) : (
            teamWorkspaces.map((ws) => (
              <div key={ws.id} className="settings-team-block">
                <TeamPanel workspaceId={ws.id} />
              </div>
            ))
          )}
        </section>
      )}

      {tab === 'Preferences' && (
        <section className="panel settings-content">
          <form id="settings-preferences-form" className="settings-form" onSubmit={handlePreferencesSave}>
            <label>
              Theme
              <select value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label>
              Default task view
              <select value={defaultView} onChange={(e) => setDefaultView(e.target.value)}>
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
