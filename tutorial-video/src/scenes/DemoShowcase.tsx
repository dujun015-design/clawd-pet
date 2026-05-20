import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from 'remotion';
import { Clawd } from '../components/Clawd';
import { Bubble } from '../components/Bubble';
import { theme } from '../theme';

// 效果演示：5 个场景 × ~5.4s = 27s
// 每个场景都是"切到 XX → Clawd 怎么反应"

type Scene = {
  app: string;
  bubble: string;
  state: 'typing' | 'groove' | 'conducting' | 'reading' | 'thinking';
  bg: [string, string];
  emoji?: string;
};

const SCENES: Scene[] = [
  { app: 'VS Code', bubble: '一起写代码！⌨️',   state: 'typing',     bg: ['#1e1e1e', '#2d2d2d'], emoji: '💻' },
  { app: 'Spotify', bubble: '听什么歌呢 🎵',     state: 'groove',     bg: ['#191414', '#1db954'], emoji: '🎵' },
  { app: 'WeChat',  bubble: '微信回复中 💌',     state: 'conducting', bg: ['#07c160', '#10b96e'], emoji: '💬' },
  { app: 'Notion',  bubble: '一起做笔记 📝',     state: 'reading',    bg: ['#191919', '#2f2f2f'], emoji: '📝' },
  { app: '深夜没动鼠标', bubble: '该睡觉啦 😴',   state: 'thinking',   bg: ['#1a1a2e', '#16213e'], emoji: '🌙' },
];

const PER = 162; // 5.4s @ 30fps

const OneScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 18, PER - 18, PER], [0, 1, 1, 0]);
  const slideX = interpolate(frame, [0, 30], [-50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${scene.bg[0]} 0%, ${scene.bg[1]} 100%)`,
        opacity,
        fontFamily: theme.fontFamily,
        padding: 80,
      }}
    >
      {/* 顶部：切到 XX */}
      <div
        style={{
          alignSelf: 'center',
          background: 'rgba(255,255,255,0.95)',
          color: theme.text,
          padding: '18px 40px',
          borderRadius: 999,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: -0.5,
          marginTop: 60,
          transform: `translateX(${slideX}px)`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        }}
      >
        切到 {scene.emoji} {scene.app}
      </div>

      {/* 中间 Clawd + 气泡 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 30,
        }}
      >
        <Bubble text={scene.bubble} delay={25} />
        <Clawd state={scene.state} size={500} />
      </div>

      {/* 底部说明 */}
      <div
        style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.85)',
          fontSize: 32,
          fontWeight: 500,
          marginBottom: 80,
        }}
      >
        自动识别前台 app，给你打气
      </div>
    </AbsoluteFill>
  );
};

export const DemoShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      {SCENES.map((scene, i) => (
        <Sequence key={i} from={i * PER} durationInFrames={PER}>
          <OneScene scene={scene} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
