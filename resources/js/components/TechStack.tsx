import React from 'react';

interface TechItem {
  name: string;
  icon: React.ReactNode;
}

export const TechStack: React.FC = () => {
  const row1: TechItem[] = [
    {
      name: 'React',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block' }} aria-hidden="true">
          <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#28D7E5" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#28D7E5" strokeWidth="1.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#28D7E5" strokeWidth="1.5" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="2" fill="#28D7E5" />
        </svg>
      ),
    },
    {
      name: 'React Native',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block' }} aria-hidden="true">
          <rect x="5" y="2" width="14" height="20" rx="3" stroke="#60A5FA" strokeWidth="1.8" />
          <ellipse cx="12" cy="11" rx="4.5" ry="1.8" stroke="#28D7E5" strokeWidth="1.2" />
          <ellipse cx="12" cy="11" rx="4.5" ry="1.8" stroke="#28D7E5" strokeWidth="1.2" transform="rotate(60 12 11)" />
          <ellipse cx="12" cy="11" rx="4.5" ry="1.8" stroke="#28D7E5" strokeWidth="1.2" transform="rotate(120 12 11)" />
          <circle cx="12" cy="11" r="1.2" fill="#28D7E5" />
          <circle cx="12" cy="18.5" r="1" fill="#60A5FA" />
        </svg>
      ),
    },
    {
      name: 'Node.js',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block' }} aria-hidden="true">
          <polygon points="12,2 21,7.2 21,16.8 12,22 3,16.8 3,7.2" stroke="#68A063" strokeWidth="1.8" fill="rgba(104, 160, 99, 0.25)" strokeLinejoin="round" />
          <path d="M8.5 15V9l7 4V8.5" stroke="#68A063" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      name: 'TypeScript',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block' }} aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#3178C6" />
          <path d="M4.5 8h6m-3 0v9M13 13.5c.5 1.5 1.8 2.2 3.2 2.2 1.8 0 2.8-.8 2.8-1.8 0-2.3-4.5-1.5-4.5-3.5 0-1.2 1-2 2.4-2 1.5 0 2.4.7 2.8 1.6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      name: 'JavaScript',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block' }} aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#F7DF1E" />
          <path d="M6 13c.4 1.4 1 1.8 2 1.8 1.3 0 1.6-.7 1.6-2V8M13.5 13.5c.5 1.1 1.4 1.8 2.8 1.8 1.6 0 2.4-.8 2.4-1.7 0-2.2-3.8-1.4-3.8-3.2 0-1.1.9-1.8 2.2-1.8 1.3 0 2.1.6 2.5 1.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      name: 'Python',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block' }} aria-hidden="true">
          <path d="M11.9 2c-4 0-3.7 1.7-3.7 1.7l.05 1.8h3.8v.6H6.5S2.6 5.6 2.6 9.7s3.4 3.9 3.4 3.9h1v-1.5s-.1-1.8 1.8-1.8h4.1s1.7 0 1.7-1.7V4.5S15 2 11.9 2zm-1.7 1.3c.4 0 .7.3.7.7s-.3.7-.7.7-.7-.3-.7-.7.3-.7.7-.7z" fill="#387EB8" />
          <path d="M12.1 22c4 0 3.7-1.7 3.7-1.7l-.05-1.8h-3.8v-.6h5.5s3.9.5 3.9-3.6-3.4-3.9-3.4-3.9h-1v1.5s-.1 1.8-1.8 1.8H11s-1.7 0-1.7 1.7v4.2s-.4 2.5 2.8 2.5zm1.7-1.3c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7z" fill="#FFE052" />
        </svg>
      ),
    },
    {
      name: 'n8n Automação',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block' }} aria-hidden="true">
          <circle cx="5" cy="12" r="3" fill="#FF6D5A" />
          <circle cx="12" cy="6" r="3" fill="#EA4B71" />
          <circle cx="12" cy="18" r="3" fill="#EA4B71" />
          <circle cx="19" cy="12" r="3" fill="#FF6D5A" />
          <path d="M8 12h8M12 9v6M7.2 9.8l3.6-2.6M7.2 14.2l3.6 2.6M16.8 9.8l-3.6-2.6M16.8 14.2l-3.6 2.6" stroke="#FF6D5A" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  const row2: TechItem[] = [
    {
      name: 'Inteligência Artificial',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block' }} aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="3" fill="rgba(167, 139, 250, 0.25)" />
          <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4M9 12h6M12 9v6" />
        </svg>
      ),
    },
    {
      name: 'APIs REST & GraphQL',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E10098" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block' }} aria-hidden="true">
          <polygon points="12,2 21,7.5 21,16.5 12,22 3,16.5 3,7.5" fill="rgba(225, 0, 152, 0.2)" />
          <circle cx="12" cy="2" r="1.8" fill="#E10098" />
          <circle cx="21" cy="7.5" r="1.8" fill="#E10098" />
          <circle cx="21" cy="16.5" r="1.8" fill="#E10098" />
          <circle cx="12" cy="22" r="1.8" fill="#E10098" />
          <circle cx="3" cy="16.5" r="1.8" fill="#E10098" />
          <circle cx="3" cy="7.5" r="1.8" fill="#E10098" />
          <polygon points="12,7 18,17 6,17" stroke="#E10098" strokeWidth="1.4" />
        </svg>
      ),
    },
    {
      name: 'PostgreSQL',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#336791" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block' }} aria-hidden="true">
          <path d="M12 3C7 3 3 7 3 12c0 3.2 1.8 6 4.5 7.4.3 1.2.9 2.6 2.2 3.1.5-.9.9-1.8 1.1-2.8 1.4.5 3 .8 4.7.8 5.8 0 7.5-3.6 7.5-8.5S18.5 3 12 3z" fill="rgba(51, 103, 145, 0.25)" />
          <circle cx="8" cy="9.5" r="1.5" fill="#336791" />
          <path d="M14 13c-1.5 1.5-3.5 1.5-5 0" />
        </svg>
      ),
    },
    {
      name: 'MySQL',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00758F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block' }} aria-hidden="true">
          <ellipse cx="12" cy="5" rx="8" ry="3" fill="rgba(0, 117, 143, 0.25)" />
          <path d="M20 12c0 1.66-3.58 3-8 3s-8-1.34-8-3" />
          <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          <path d="M10 10l2 2 3-3" stroke="#F29111" strokeWidth="2" />
        </svg>
      ),
    },
    {
      name: 'Docker',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#2496ED" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block' }} aria-hidden="true">
          <path d="M22.5 10.5c-.3-.2-1.5-.3-2.3.3-.2-.5-.6-1-1.2-1.3l-.6-.3-.3.5c-.5.8-.6 1.7-.3 2.5-.5.3-1.4.3-2.1.2H1v2c0 3.8 3.1 7 7 7 4.9 0 9-3.2 10.2-7.8 1.6-.2 3.3-1.1 4.3-2.6v-.5h0zm-17-2.5h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm-6-3h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" />
        </svg>
      ),
    },
    {
      name: 'Serviços em Nuvem',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#28D7E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block' }} aria-hidden="true">
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" fill="rgba(40, 215, 229, 0.2)" />
          <path d="M12 13v6m-2.5-2.5l2.5 2.5 2.5-2.5" />
        </svg>
      ),
    },
    {
      name: 'OpenAI / Claude APIs',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10A37F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block' }} aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" fill="rgba(16, 163, 127, 0.2)" />
          <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6" strokeWidth="1.5" opacity="0.7" />
          <circle cx="12" cy="12" r="4.5" fill="#10A37F" stroke="none" />
        </svg>
      ),
    },
  ];

  const renderItems = (items: typeof row1) =>
    [...items, ...items, ...items].map((tech, index) => (
      <div
        key={`${tech.name}-${index}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 22px',
          borderRadius: '14px',
          background: 'rgba(16, 21, 36, 0.85)',
          border: '1px solid rgba(41, 50, 71, 0.8)',
          fontSize: '14px',
          fontWeight: 600,
          color: '#F5F7FA',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '18px',
            height: '18px',
            minWidth: '18px',
            minHeight: '18px',
            flexShrink: 0,
          }}
        >
          {tech.icon}
        </span>
        <span>{tech.name}</span>
      </div>
    ));

  return (
    <section
      id="tecnologias"
      style={{
        padding: '90px 0',
        background: 'linear-gradient(180deg, #101524 0%, #080B14 100%)',
        overflow: 'hidden',
        borderTop: '1px solid rgba(41, 50, 71, 0.4)',
        borderBottom: '1px solid rgba(41, 50, 71, 0.4)',
      }}
    >
      <div className="container" style={{ marginBottom: '44px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '20px',
            background: 'rgba(40, 215, 229, 0.1)',
            border: '1px solid rgba(40, 215, 229, 0.3)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--accent-cyan)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '14px',
          }}
        >
          Tech Stack Moderna
        </div>

        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800 }}>
          Tecnologias que conectam nossas soluções
        </h2>
      </div>

      {/* Row 1 — Moving Left */}
      <div className="marquee-container" style={{ marginBottom: '20px' }}>
        <div className="marquee-track">{renderItems(row1)}</div>
      </div>

      {/* Row 2 — Moving Right */}
      <div className="marquee-container">
        <div className="marquee-track-reverse">{renderItems(row2)}</div>
      </div>
    </section>
  );
};
