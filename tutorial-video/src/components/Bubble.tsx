import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

type Props = {
  text: string;
  delay?: number; // 延迟出现，单位帧
};

// Clawd 风格的气泡 —— 复用 app 里的白底 + 橙边
export const Bubble: React.FC<Props> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.7, 1]);
  const translateY = interpolate(progress, [0, 1], [20, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        background: '#fff',
        border: `3px solid ${theme.accent}`,
        borderRadius: 20,
        padding: '18px 32px',
        fontSize: 42,
        fontWeight: 700,
        fontFamily: theme.fontFamily,
        color: theme.text,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        position: 'relative',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
      {/* 小尾巴 */}
      <div
        style={{
          position: 'absolute',
          bottom: -16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: `16px solid ${theme.accent}`,
        }}
      />
    </div>
  );
};
