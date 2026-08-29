const svg = (children) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const IconGrid = () =>
  svg(
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.2" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" />
      <rect x="14" y="14" width="7" height="7" rx="1.2" />
    </>,
  );

export const IconList = () =>
  svg(
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3 6h.01M3 12h.01M3 18h.01" />
    </>,
  );

export const IconCheckCircle = () =>
  svg(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.2 2.2 4.8-5" />
    </>,
  );

export const IconSettings = () =>
  svg(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>,
  );

export const IconSearch = () =>
  svg(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>,
  );

export const IconMenu = () =>
  svg(
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>,
  );

export const IconTrash = () =>
  svg(
    <>
      <path d="M4 7h16M10 11v6M14 11v6M9 7V5h6v2m-8 0 1 14h8l1-14" />
    </>,
  );

export const IconLayers = () =>
  svg(
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>,
  );

export const IconCircle = () =>
  svg(<circle cx="12" cy="12" r="7" />);

export const IconCheck = () =>
  svg(
    <>
      <path d="M20 6 9 17l-5-5" />
    </>,
  );

export const IconClock = () =>
  svg(
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 1.5" />
    </>,
  );

export const IconPlus = () =>
  svg(
    <>
      <path d="M12 5v14M5 12h14" />
    </>,
  );

export const IconBell = () =>
  svg(
    <>
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M9 17a3 3 0 0 0 6 0" />
    </>,
  );

export const IconFolder = () =>
  svg(
    <>
      <path d="M4 7h6l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
    </>,
  );

export const IconUpload = () =>
  svg(
    <>
      <path d="M12 16V8m0 0 4 4m-4-4-4 4" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </>,
  );

export const IconMore = () =>
  svg(
    <>
      <circle cx="12" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </>,
  );

export const IconMail = () =>
  svg(
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="m3 8 9 6 9-6" />
    </>,
  );

export const IconCalendar = () =>
  svg(
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>,
  );

export const IconChevronLeft = () =>
  svg(<path d="m15 6-6 6 6 6" />);

export const IconChevronRight = () =>
  svg(<path d="m9 6 6 6-6 6" />);
