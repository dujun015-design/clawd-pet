import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from 'remotion';
import { Clawd } from '../components/Clawd';
import { Bubble } from '../components/Bubble';
import { TerminalCard, TerminalLine } from '../components/TerminalCard';
import { theme } from '../theme';

// 启动卡：先终端跑 npm start，再桌面显示 Clawd 出现
// 总长 17 秒 = 终端 7s + 桌面 10s

const TerminalPhase: React.FC = () => {
  const frame = useCurrentFrame();
  const total = 210; // 7s
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [total - 15, total], [1, 0], { extrapolateLeft: 'clamp' });

  const lines: TerminalLine[] = [
    { kind: 'out', text: '# 启动桌宠！', color: '#a8a8ad' },
    { kind: 'cmd', text: 'npm start', delayFrames: 6 },
    {
      kind: 'spinner',
      label: 'Clawd 启动中...',
      waitFrames: 60,
      doneText: '已启动 ✨',
    },
  ];

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #fdf3ec 0%, #fafafa 100%)',
        padding: '80px 60px',
        opacity: Math.min(fadeIn, fadeOut),
      }}
    >
      <TerminalCard title="终端" lines={lines} height={1200} />
    </AbsoluteFill>
  );
};

// 桌面 + Clawd 慢慢从右下角弹出
const DesktopAppearPhase: React.FC = () => {
  const frame = useCurrentFrame();
  const total = 300; // 10s
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [total - 15, total], [1, 0], { extrapolateLeft: 'clamp' });

  // Clawd 从右下角弹入
  const clawdY = interpolate(frame, [15, 60], [80, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const clawdOpacity = interpolate(frame, [15, 50], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // 气泡延迟出来
  const bubbleOp = interpolate(frame, [70, 110], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // 顶部 banner
  const bannerOp = interpolate(frame, [25, 60], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #4a90e2 0%, #7bb3f0 100%)',
        opacity: Math.min(fadeIn, fadeOut),
      }}
    >
      {/* menubar */}
      <div
        style={{
          height: 50,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          color: 'white',
          fontSize: 22,
          fontFamily: theme.fontFamily,
        }}
      >
        <span style={{ marginRight: 30 }}>🍎</span>
        <span style={{ fontWeight: 600 }}>Finder</span>
        <span style={{ flex: 1 }} />
        <span>16:24</span>
      </div>

      {/* 顶部 banner */}
      <div
        style={{
          marginTop: 80,
          textAlign: 'center',
          color: 'white',
          fontFamily: theme.fontFamily,
          opacity: bannerOp,
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 900, textShadow: '0 4px 14px rgba(0,0,0,0.3)', letterSpacing: -1 }}>
          看，它出现啦！
        </div>
        <div style={{ marginTop: 12, fontSize: 32, opacity: 0.92, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          趴在桌面右下角 🦀
        </div>
      </div>

      {/* Clawd 在右下角，带气泡 */}
      <div
        style={{
          position: 'absolute',
          bottom: 240,
          right: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          transform: `translateY(${clawdY}px)`,
          opacity: clawdOpacity,
        }}
      >
        <div style={{ opacity: bubbleOp }}>
          <Bubble text="你好呀！👋" delay={0} />
        </div>
        <Clawd state="happy" size={280} />
      </div>

      {/* Dock 暗示 */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 200,
          right: 200,
          height: 100,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
        }}
      />
    </AbsoluteFill>
  );
};

export const RunStartCard: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={210}>
        <TerminalPhase />
      </Sequence>
      <Sequence from={210} durationInFrames={300}>
        <DesktopAppearPhase />
      </Sequence>
    </AbsoluteFill>
  );
};
