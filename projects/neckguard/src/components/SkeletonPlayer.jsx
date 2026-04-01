import React, { useState, useEffect, useRef } from 'react';
import { skeletonAnimations } from '../data/skeletonAnimations';

const BONES = [
  ['head', 'neck'],
  ['neck', 'lShoulder'],
  ['neck', 'rShoulder'],
  ['lShoulder', 'lElbow'],
  ['lElbow', 'lWrist'],
  ['rShoulder', 'rElbow'],
  ['rElbow', 'rWrist'],
  ['neck', 'spine'],
  ['spine', 'hip'],
  ['hip', 'lHip'],
  ['hip', 'rHip'],
  ['lHip', 'lKnee'],
  ['lKnee', 'lFoot'],
  ['rHip', 'rKnee'],
  ['rKnee', 'rFoot'],
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpPoints(from, to, t) {
  const result = {};
  for (const key in from) {
    result[key] = [
      lerp(from[key][0], to[key][0], t),
      lerp(from[key][1], to[key][1], t),
    ];
  }
  return result;
}

export default function SkeletonPlayer({ exerciseId }) {
  const anim = skeletonAnimations[exerciseId];
  const [frameIndex, setFrameIndex] = useState(0);
  const [subFrame, setSubFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  // 动画开始时自动播放
  useEffect(() => {
    if (anim) setPlaying(true);
  }, [anim]);

  // 动画循环
  useEffect(() => {
    if (!anim || !playing) {
      lastTimeRef.current = null;
      return;
    }

    const tick = (now) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;
      const fps = anim.fps / speed;

      setSubFrame(prev => {
        const next = prev + (delta / fps);
        if (next >= 1) {
          setFrameIndex(fi => {
            const nextFi = fi + 1;
            if (nextFi >= anim.frames.length) {
              if (anim.loop) return 0;
              setPlaying(false);
              return fi;
            }
            return nextFi;
          });
          return 0;
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
  }, [anim, playing, speed]);

  // 没有动画
  if (!anim) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">💪</div>
        <p className="text-sm text-slate-500 dark:text-slate-400">该动作暂无动画演示</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">请参考下方步骤说明进行练习</p>
      </div>
    );
  }

  const currentFrame = anim.frames[frameIndex];
  const nextFrame = anim.frames[(frameIndex + 1) % anim.frames.length];
  const pts = lerpPoints(currentFrame.points, nextFrame.points, subFrame);
  const highlighted = new Set(anim.highlightParts || []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <div>
          <span className="text-sm font-semibold text-slate-800 dark:text-white">{anim.name}</span>
          <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">动作演示</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="text-xs border border-slate-200 dark:border-slate-600 rounded px-1 py-0.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
          </select>
          <button
            onClick={() => setPlaying(p => !p)}
            className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 flex items-center justify-center text-sm hover:bg-green-200 dark:hover:bg-green-900 transition-colors"
          >
            {playing ? '⏸' : '▶'}
          </button>
        </div>
      </div>

      {/* SVG */}
      <div className="flex justify-center bg-slate-50 dark:bg-slate-900/50 py-4">
        <svg width="200" height="340" viewBox="0 0 200 340">
          {/* 骨骼连线 */}
          {BONES.map(([a, b], i) => {
            const pa = pts[a];
            const pb = pts[b];
            if (!pa || !pb) return null;
            const isHL = highlighted.has(a) || highlighted.has(b);
            return (
              <line key={i} x1={pa[0]} y1={pa[1]} x2={pb[0]} y2={pb[1]}
                stroke={isHL ? anim.highlightColor : '#94a3b8'}
                strokeWidth={isHL ? 3 : 2}
                strokeLinecap="round"
              />
            );
          })}

          {/* 关节点 */}
          {Object.entries(pts).map(([key, [x, y]]) => {
            const isHL = highlighted.has(key);
            if (key === 'head') {
              return <circle key={key} cx={x} cy={y} r={14} fill="white"
                stroke={isHL ? anim.highlightColor : '#64748b'} strokeWidth={isHL ? 3 : 2} />;
            }
            return <circle key={key} cx={x} cy={y} r={isHL ? 5 : 3.5}
              fill={isHL ? anim.highlightColor : '#64748b'} />;
          })}

          {/* 箭头 */}
          <defs>
            <marker id="ah-red" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill="#ef4444" />
            </marker>
            <marker id="ah-green" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill="#22c55e" />
            </marker>
            <marker id="ah-blue" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill="#3b82f6" />
            </marker>
            <marker id="ah-purple" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill="#8b5cf6" />
            </marker>
            <marker id="ah-amber" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <polygon points="0 0,8 3,0 6" fill="#f59e0b" />
            </marker>
          </defs>

          {currentFrame.arrows && currentFrame.arrows.map((arrow, i) => {
            const mid = arrow.id ||
              (arrow.color === '#22c55e' ? 'green' :
               arrow.color === '#3b82f6' ? 'blue' :
               arrow.color === '#8b5cf6' ? 'purple' :
               arrow.color === '#f59e0b' ? 'amber' : 'red');
            return (
              <g key={i}>
                <line x1={arrow.from[0]} y1={arrow.from[1]} x2={arrow.to[0]} y2={arrow.to[1]}
                  stroke={arrow.color} strokeWidth="2" strokeDasharray="4,3"
                  markerEnd={`url(#ah-${mid})`} />
                {arrow.label && (
                  <text x={arrow.to[0] + 4} y={arrow.to[1] + 4} fontSize="10"
                    fill={arrow.color} fontWeight="600">{arrow.label}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 帧说明 */}
      <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{currentFrame.label}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{frameIndex + 1}/{anim.frames.length}</span>
        </div>
        <div className="flex gap-1">
          {anim.frames.map((_, i) => (
            <button key={i} onClick={() => { setFrameIndex(i); setSubFrame(0); }}
              className={`flex-1 h-1.5 rounded-full transition-colors ${i === frameIndex ? 'bg-green-500' : i < frameIndex ? 'bg-green-200 dark:bg-green-800' : 'bg-slate-200 dark:bg-slate-600'}`}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{anim.description}</p>
      </div>
    </div>
  );
}
