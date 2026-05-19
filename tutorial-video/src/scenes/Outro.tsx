import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Clawd } from '../components/Clawd';
import { theme } from '../theme';

// 片尾：5秒
// 0-20帧：背景 + Clawd 出现
// 20-40帧："感谢观看" 弹入
// 40-80帧：GitHub 链接 / 提示
// 80-150帧：维持
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const clawdSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const clawdScale = interpolate(clawdSpring, [0, 1], [0.5, 1]);
  const clawdOpacity = interpolate(clawdSpring, [0, 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const titleSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 130 },
  });
  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const linkSpring = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const linkY = interpolate(linkSpring, [0, 1], [40, 0]);
  const linkOpacity = interpolate(linkSpring, [0, 1], [0, 1]);

  // 整体退场
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #fef6ee 0%, #fce6d4 100%)`,
        fontFamily: theme.fontFamily,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          opacity: clawdOpacity,
          transform: `scale(${clawdScale})`,
        }}
      >
        <Clawd state="jump" size={500} />
      </div>

      <div
        style={{
          marginTop: 50,
          fontSize: 90,
          fontWeight: 900,
          color: theme.text,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          letterSpacing: -2,
          textAlign: 'center',
        }}
      >
        感谢观看 <span style={{ color: theme.accent }}>✨</span>
      </div>

      <div
        style={{
          marginTop: 50,
          opacity: linkOpacity,
          transform: `translateY(${linkY}px)`,
          background: '#fff',
          border: `3px solid ${theme.accent}`,
          borderRadius: 24,
          padding: '28px 48px',
          fontSize: 44,
          fontWeight: 700,
          color: theme.text,
          fontFamily: theme.fontMono,
          boxShadow: '0 12px 32px rgba(224,123,57,0.2)',
        }}
      >
        github.com/dujun015-design/clawd-pet
      </div>

      <div
        style={{
          marginTop: 40,
          fontSize: 38,
          color: theme.textMuted,
          fontWeight: 500,
          opacity: linkOpacity,
          textAlign: 'center',
        }}
      >
        简介里有打包好的 .app 直接下载
      </div>
    </AbsoluteFill>
  );
};
