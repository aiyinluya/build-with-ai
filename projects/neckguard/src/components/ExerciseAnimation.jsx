import React from 'react';

// 简单的 SVG 动画演示
export function TrapStretchAnimation() {
  return (
    <svg viewBox="0 0 200 300" className="w-full h-auto max-w-xs mx-auto">
      <defs>
        <style>{`
          @keyframes headTilt {
            0%, 100% { transform: rotate(0deg); transform-origin: 100px 80px; }
            50% { transform: rotate(-20deg); transform-origin: 100px 80px; }
          }
          .head { animation: headTilt 2s ease-in-out infinite; }
        `}</style>
      </defs>
      
      {/* Body */}
      <rect x="80" y="120" width="40" height="80" fill="#e2e8f0" rx="5" />
      
      {/* Shoulders */}
      <circle cx="60" cy="120" r="12" fill="#cbd5e1" />
      <circle cx="140" cy="120" r="12" fill="#cbd5e1" />
      
      {/* Head */}
      <circle cx="100" cy="80" r="25" fill="#f1f5f9" className="head" stroke="#cbd5e1" strokeWidth="2" />
      
      {/* Face */}
      <circle cx="95" cy="75" r="3" fill="#1e293b" />
      <circle cx="105" cy="75" r="3" fill="#1e293b" />
      <path d="M 95 85 Q 100 88 105 85" stroke="#1e293b" strokeWidth="1.5" fill="none" />
      
      {/* Left arm */}
      <line x1="80" y1="130" x2="40" y2="180" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
      
      {/* Right arm (behind) */}
      <line x1="120" y1="130" x2="160" y2="180" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
      
      {/* Text */}
      <text x="100" y="280" textAnchor="middle" fontSize="12" fill="#64748b">
        上斜方肌拉伸
      </text>
    </svg>
  );
}

export function ChinTuckAnimation() {
  return (
    <svg viewBox="0 0 200 300" className="w-full h-auto max-w-xs mx-auto">
      <defs>
        <style>{`
          @keyframes chinTuck {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(8px); }
          }
          .chin-head { animation: chinTuck 2s ease-in-out infinite; }
        `}</style>
      </defs>
      
      {/* Body */}
      <rect x="80" y="120" width="40" height="80" fill="#e2e8f0" rx="5" />
      
      {/* Shoulders */}
      <circle cx="60" cy="120" r="12" fill="#cbd5e1" />
      <circle cx="140" cy="120" r="12" fill="#cbd5e1" />
      
      {/* Head */}
      <circle cx="100" cy="80" r="25" fill="#f1f5f9" className="chin-head" stroke="#cbd5e1" strokeWidth="2" />
      
      {/* Face */}
      <circle cx="95" cy="75" r="3" fill="#1e293b" />
      <circle cx="105" cy="75" r="3" fill="#1e293b" />
      <path d="M 95 85 Q 100 88 105 85" stroke="#1e293b" strokeWidth="1.5" fill="none" />
      
      {/* Neck indicator */}
      <line x1="100" y1="105" x2="100" y2="120" stroke="#3b82f6" strokeWidth="3" opacity="0.6" />
      
      {/* Text */}
      <text x="100" y="280" textAnchor="middle" fontSize="12" fill="#64748b">
        收下巴运动
      </text>
    </svg>
  );
}

export function ScapularRetractionAnimation() {
  return (
    <svg viewBox="0 0 200 300" className="w-full h-auto max-w-xs mx-auto">
      <defs>
        <style>{`
          @keyframes shoulderRetract {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(-8px); }
          }
          .shoulder-left { animation: shoulderRetract 2s ease-in-out infinite; }
          .shoulder-right { animation: shoulderRetract 2s ease-in-out infinite; }
        `}</style>
      </defs>
      
      {/* Body */}
      <rect x="80" y="120" width="40" height="80" fill="#e2e8f0" rx="5" />
      
      {/* Shoulders */}
      <circle cx="60" cy="120" r="12" fill="#cbd5e1" className="shoulder-left" />
      <circle cx="140" cy="120" r="12" fill="#cbd5e1" className="shoulder-right" />
      
      {/* Head */}
      <circle cx="100" cy="80" r="25" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
      
      {/* Face */}
      <circle cx="95" cy="75" r="3" fill="#1e293b" />
      <circle cx="105" cy="75" r="3" fill="#1e293b" />
      <path d="M 95 85 Q 100 88 105 85" stroke="#1e293b" strokeWidth="1.5" fill="none" />
      
      {/* Arms */}
      <line x1="80" y1="130" x2="40" y2="180" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
      <line x1="120" y1="130" x2="160" y2="180" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
      
      {/* Scapula indicator */}
      <path d="M 70 140 L 130 140" stroke="#22c55e" strokeWidth="2" opacity="0.6" strokeDasharray="5,5" />
      
      {/* Text */}
      <text x="100" y="280" textAnchor="middle" fontSize="12" fill="#64748b">
        肩胛骨后缩
      </text>
    </svg>
  );
}

export function DiaphragmaticBreathingAnimation() {
  return (
    <svg viewBox="0 0 200 300" className="w-full h-auto max-w-xs mx-auto">
      <defs>
        <style>{`
          @keyframes breathe {
            0%, 100% { ry: 30px; }
            50% { ry: 45px; }
          }
          .belly { animation: breathe 2s ease-in-out infinite; }
        `}</style>
      </defs>
      
      {/* Body */}
      <rect x="80" y="120" width="40" height="80" fill="#e2e8f0" rx="5" />
      
      {/* Shoulders */}
      <circle cx="60" cy="120" r="12" fill="#cbd5e1" />
      <circle cx="140" cy="120" r="12" fill="#cbd5e1" />
      
      {/* Head */}
      <circle cx="100" cy="80" r="25" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
      
      {/* Face */}
      <circle cx="95" cy="75" r="3" fill="#1e293b" />
      <circle cx="105" cy="75" r="3" fill="#1e293b" />
      <path d="M 95 85 Q 100 88 105 85" stroke="#1e293b" strokeWidth="1.5" fill="none" />
      
      {/* Belly (breathing) */}
      <ellipse cx="100" cy="180" rx="35" ry="30" fill="#fbbf24" opacity="0.3" className="belly" />
      
      {/* Hand on belly */}
      <circle cx="100" cy="180" r="8" fill="#cbd5e1" />
      
      {/* Text */}
      <text x="100" y="280" textAnchor="middle" fontSize="12" fill="#64748b">
        腹式呼吸
      </text>
    </svg>
  );
}

export function WallAngelAnimation() {
  return (
    <svg viewBox="0 0 200 300" className="w-full h-auto max-w-xs mx-auto">
      <defs>
        <style>{`
          @keyframes armRaise {
            0%, 100% { transform: translateY(20px); }
            50% { transform: translateY(-20px); }
          }
          .arm-left { animation: armRaise 2s ease-in-out infinite; }
          .arm-right { animation: armRaise 2s ease-in-out infinite; }
        `}</style>
      </defs>
      
      {/* Wall */}
      <rect x="10" y="20" width="8" height="260" fill="#94a3b8" />
      
      {/* Body */}
      <rect x="80" y="120" width="40" height="80" fill="#e2e8f0" rx="5" />
      
      {/* Shoulders */}
      <circle cx="60" cy="120" r="12" fill="#cbd5e1" />
      <circle cx="140" cy="120" r="12" fill="#cbd5e1" />
      
      {/* Head */}
      <circle cx="100" cy="80" r="25" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
      
      {/* Face */}
      <circle cx="95" cy="75" r="3" fill="#1e293b" />
      <circle cx="105" cy="75" r="3" fill="#1e293b" />
      
      {/* Arms raised */}
      <line x1="80" y1="130" x2="30" y2="60" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" className="arm-left" />
      <line x1="120" y1="130" x2="170" y2="60" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" className="arm-right" />
      
      {/* Text */}
      <text x="100" y="280" textAnchor="middle" fontSize="12" fill="#64748b">
        墙面天使
      </text>
    </svg>
  );
}

export default function ExerciseAnimation({ exerciseId }) {
  const animations = {
    trap_stretch: <TrapStretchAnimation />,
    chin_tuck: <ChinTuckAnimation />,
    scapular_retraction: <ScapularRetractionAnimation />,
    diaphragmatic_breathing: <DiaphragmaticBreathingAnimation />,
    wall_angel: <WallAngelAnimation />,
  };

  return animations[exerciseId] || null;
}
