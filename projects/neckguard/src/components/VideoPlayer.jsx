import React from 'react';

export default function VideoPlayer({ bilibiliId, title }) {
  if (!bilibiliId) return null;

  return (
    <div className="mb-4">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`//player.bilibili.com/player.html?bvid=${bilibiliId}&page=1&high_quality=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="text-xs text-slate-400 mt-2 text-center">
        📺 视频演示 · 点击全屏查看
      </p>
    </div>
  );
}
