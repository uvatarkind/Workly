# Workly

Focused task-management workspace — enough structure for individuals and teams to manage projects, without the complexity of a full workspace suite.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Auth pages are static for now — use **Sign in** to jump into the app.

## What's built (frontend MVP)

- **Dashboard** — today's tasks, upcoming, project progress, activity feed
- **Workspaces** — Personal + Team contexts with overview, projects, tasks, members
- **Projects** — Overview, Board, List, and Calendar views
- **Tasks** — slide-out detail panel with status, priority, assignee, subtasks, comments
- **Calendar** — month view of tasks by due date
- **Notifications** — lightweight notification center
- **Search** — global search (⌘K / Ctrl+K)
- **Create** — quick-create Task, Project, or Workspace
- **Settings** — account & preferences (demo data reset)

### Workspace invites (frontend demo)

- **Invite people:** Team workspace → **Members** → enter email → **Send Invite**
- **See invites:** Dashboard banner, **Notifications** (Accept / Decline)
- **Sidebar:** Only workspaces you belong to appear under **Workspaces**
- **Test as another user:** Settings → **Demo** tab → switch to Sarah, Mike, etc.

Demo includes a pending invite for Alex to join **Design Team** (from Sarah).

Data persists in `localStorage` for now. Backend comes next.

## Structure

```
Dashboard → Workspaces → Projects → Tasks → Calendar
```

Core objects: User, Workspace, Project, Task, Comment, Notification, Member
