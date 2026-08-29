import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { addFolder, loadFiles, saveFiles, storagePercent } from '../files';
import { IconFolder, IconMore, IconPlus, IconUpload } from '../components/Icons';

const fileTypeLabel = {
  doc: 'DOC',
  image: 'IMG',
  design: 'FIG',
  pdf: 'PDF',
};

export default function FilesPage() {
  const { getUser } = useApp();
  const [data, setData] = useState(loadFiles);

  function persist(next) {
    setData(next);
    saveFiles(next);
  }

  function handleNewFolder() {
    const name = window.prompt('Folder name');
    if (!name) return;
    persist(addFolder(data, name));
  }

  const percent = storagePercent(data.storage);

  return (
    <div className="page files-page">
      <header className="files-head">
        <div>
          <h1>Files</h1>
          <p>Organize project assets and shared documents</p>
        </div>
        <div className="files-actions">
          <button type="button" className="primary-btn" onClick={handleNewFolder}>
            <IconPlus />
            Create New Folder
          </button>
          <button type="button" className="ghost-btn">
            <IconUpload />
            Upload
          </button>
        </div>
      </header>

      <div className="files-layout">
        <div className="files-main">
          <section className="panel">
            <header className="panel-head">
              <h2>All Files</h2>
            </header>
            <div className="folder-grid">
              {data.folders.map((folder) => (
                <article key={folder.id} className="folder-card">
                  <div className="folder-card-top">
                    <span className={`folder-icon tone-${folder.color}`}>
                      <IconFolder />
                    </span>
                    <div className="folder-members">
                      {folder.memberIds.slice(0, 2).map((id) => {
                        const member = getUser(id);
                        if (!member) return null;
                        return (
                          <span key={id} className="member-avatar small" title={member.name}>
                            {member.initials}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <h3>{folder.name}</h3>
                  <p>{folder.count} files</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <header className="panel-head split">
              <h2>Recent File</h2>
              <button type="button" className="link-btn">View All</button>
            </header>
            <div className="table-wrap">
              <table className="files-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Last Modified</th>
                    <th>Members</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {data.recent.map((file) => (
                    <tr key={file.id}>
                      <td>
                        <span className={`file-type type-${file.type}`}>
                          {fileTypeLabel[file.type] || 'FILE'}
                        </span>
                        {file.name}
                      </td>
                      <td>{file.size}</td>
                      <td>{file.modified}</td>
                      <td>
                        <div className="table-members">
                          {file.memberIds.map((id) => {
                            const member = getUser(id);
                            if (!member) return null;
                            return (
                              <span key={id} className="member-avatar tiny" title={member.name}>
                                {member.initials}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td>
                        <button type="button" className="icon-btn" aria-label="More options">
                          <IconMore />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="files-rail">
          <section className="panel storage-card">
            <h2>Available Storage</h2>
            <div className="storage-ring" style={{ '--pct': percent }}>
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="48" className="ring-bg" />
                <circle cx="60" cy="60" r="48" className="ring-fill" />
              </svg>
              <div className="storage-ring-label">
                <strong>{percent}%</strong>
                <span>{data.storage.usedGb}GB / {data.storage.totalGb}GB</span>
              </div>
            </div>
            <ul className="storage-breakdown">
              {data.storage.breakdown.map((item) => (
                <li key={item.id}>
                  <span>{item.label}</span>
                  <div className="storage-bar">
                    <span style={{ width: `${item.value}%`, background: item.color }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel activity-card">
            <h2>Activity Chart</h2>
            <div className="activity-bars" aria-hidden="true">
              {[42, 68, 55, 80, 62, 74, 58].map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <ul className="activity-legend">
              <li><span className="dot media" /> Media</li>
              <li><span className="dot photos" /> Photos</li>
              <li><span className="dot docs" /> Docs</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
