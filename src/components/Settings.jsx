import { useEffect, useState } from 'react';
import {
  SETTINGS_TABS,
  addTeamMember,
  loadProfile,
  loadTeam,
  removeTeamMember,
  saveProfile,
  saveTeam,
  syncSelfMember,
} from '../profile';
import { IconMail, IconUpload } from './Icons';

const Settings = ({ onClearAll, onProfileSaved }) => {
  const [tab, setTab] = useState('details');
  const [profile, setProfile] = useState(loadProfile);
  const [team, setTeam] = useState(loadTeam);
  const [draft, setDraft] = useState(loadProfile);
  const [newMember, setNewMember] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  function handleSave() {
    const nextProfile = saveProfile(draft);
    const nextTeam = saveTeam(syncSelfMember(team, nextProfile));
    setProfile(nextProfile);
    setTeam(nextTeam);
    setSaved(true);
    onProfileSaved?.();
    window.setTimeout(() => setSaved(false), 2000);
  }

  function handleCancel() {
    setDraft(profile);
    setTab('details');
  }

  function handleAddMember(event) {
    event.preventDefault();
    const next = addTeamMember(team, newMember);
    setTeam(next);
    saveTeam(next);
    setNewMember('');
  }

  function handleRemoveMember(id) {
    const next = removeTeamMember(team, id);
    setTeam(next);
    saveTeam(next);
  }

  const fullName = `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ''}`.trim();

  return (
    <div className="settings-page">
      <div className="settings-hero">
        <div className="settings-banner" aria-hidden="true" />
        <div className="settings-hero-body">
          <div className="settings-avatar" aria-hidden="true">
            {profile.avatarInitials}
          </div>
          <div className="settings-hero-text">
            <h1>Settings</h1>
            <p>{fullName || 'Your profile'}</p>
          </div>
          <div className="settings-hero-actions">
            <button type="button" className="ghost-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" className="primary-btn" onClick={handleSave}>
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <nav className="settings-tabs" aria-label="Settings sections">
        {SETTINGS_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? 'active' : undefined}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <section className="panel settings-content">
        {tab === 'details' && (
          <form className="settings-form" onSubmit={(event) => event.preventDefault()}>
            <div className="field-row">
              <label>
                First name
                <input
                  type="text"
                  value={draft.firstName}
                  onChange={(event) => setDraft({ ...draft, firstName: event.target.value })}
                />
              </label>
              <label>
                Last name
                <input
                  type="text"
                  value={draft.lastName}
                  onChange={(event) => setDraft({ ...draft, lastName: event.target.value })}
                />
              </label>
            </div>
            <label>
              Email
              <span className="input-icon-wrap">
                <IconMail />
                <input
                  type="email"
                  value={draft.email}
                  onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                  placeholder="you@example.com"
                />
              </span>
            </label>
            <label>
              Role
              <input
                type="text"
                value={draft.role}
                onChange={(event) => setDraft({ ...draft, role: event.target.value })}
              />
            </label>
            <label>
              Avatar initials
              <input
                type="text"
                maxLength={2}
                value={draft.avatarInitials}
                onChange={(event) =>
                  setDraft({ ...draft, avatarInitials: event.target.value.toUpperCase() })
                }
              />
            </label>
          </form>
        )}

        {tab === 'profile' && (
          <div className="settings-upload">
            <div className="upload-dropzone">
              <IconUpload />
              <p>
                <strong>Click to upload</strong> or drag and drop
              </p>
              <span>SVG, PNG, JPG or GIF (max. 800×400px)</span>
            </div>
            <p className="settings-note">
              Profile photos are stored locally in this demo. A real team app would upload to cloud
              storage.
            </p>
          </div>
        )}

        {tab === 'team' && (
          <div className="team-panel">
            <header className="team-panel-head">
              <div>
                <h2>Team members</h2>
                <p>Invite collaborators to boards and assign tasks like Trello.</p>
              </div>
            </header>
            <ul className="team-list">
              {team.map((member) => (
                <li key={member.id}>
                  <span className="team-avatar" style={{ background: `${member.color}22`, color: member.color }}>
                    {member.initials}
                  </span>
                  <div>
                    <strong>{member.name}</strong>
                    {member.isSelf && <span className="team-you">You</span>}
                  </div>
                  {!member.isSelf && (
                    <button
                      type="button"
                      className="ghost-btn small"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <form className="team-add" onSubmit={handleAddMember}>
              <input
                type="text"
                value={newMember}
                onChange={(event) => setNewMember(event.target.value)}
                placeholder="Add teammate name"
              />
              <button type="submit" className="primary-btn">
                Add member
              </button>
            </form>
            <p className="settings-note">
              Full collaboration needs accounts, shared boards, and real-time sync — see the Team
              tab roadmap in the README when you add a backend.
            </p>
          </div>
        )}

        {tab === 'password' && (
          <p className="settings-note">
            Password changes require user accounts and a secure backend. This local demo keeps data
            in your browser only.
          </p>
        )}

        {!['details', 'profile', 'team', 'password'].includes(tab) && (
          <p className="settings-note">
            {SETTINGS_TABS.find((item) => item.id === tab)?.label} settings are coming soon.
          </p>
        )}

        <div className="settings-danger">
          <h2>Data</h2>
          <p>Tasks are saved in this browser with localStorage.</p>
          <button type="button" className="danger-btn" onClick={onClearAll}>
            Clear all tasks
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
