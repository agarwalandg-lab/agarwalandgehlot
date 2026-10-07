import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out after 2 seconds, then unmount after the 0.6 s transition
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
    const hideTimer = setTimeout(() => setVisible(false), 2600);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-label="Loading"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'hsl(40 30% 96%)',
        transition: 'opacity 0.6s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
    >
      {/* Logo */}
      <img
        src="/logos/ag-logo.png"
        alt="Agarwal & Angehlot"
        style={{
          width: 'clamp(120px, 20vw, 180px)',
          marginBottom: '2.5rem',
          animation: 'ag-pulse 1.8s ease-in-out infinite',
        }}
      />

      {/* Animated bar */}
      <div
        style={{
          width: 'clamp(160px, 28vw, 260px)',
          height: '2px',
          borderRadius: '9999px',
          background: 'hsl(38 20% 83%)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)',
            borderRadius: '9999px',
            animation: 'ag-bar 2s cubic-bezier(0.4,0,0.2,1) forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes ag-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(0.97); }
        }
        @keyframes ag-bar {
          0%   { width: 0%; }
          60%  { width: 80%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
