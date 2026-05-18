import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { theme } from '../theme';

type Props = {
  number: string; // "01" "02" "03"
  title: string;
  subtitle?: string;
};

// 章节卡：2 秒
// 0-15帧：编号大字弹入
// 15-30帧：标题滑入
// 30-50帧：维持
// 50-60帧：退出
export const ChapterCard: React.FC<Props> = ({ number, title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const numSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 200 },
  });
  const numScale = interpolate(numSpring, [0, 1], [0.3, 1]);
  const numOpacity = interpolate(numSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const titleSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const titleX = interpolate(titleSpring, [0, 1], [-80, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: theme.text,
        fontFamily: theme.fontFamily,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 90px',
        opacity: exitOpacity,
      }}
    >
      {/* 横条装饰 */}
      <div
        style={{
          width: interpolate(titleSpring, [0, 1], [0, 200]),
          height: 8,
          background: theme.accent,
          marginBottom: 40,
          borderRadius: 4,
        }}
      />

      {/* 编号 */}
      <div
        style={{
          fontSize: 280,
          fontWeight: 900,
          color: theme.accent,
          lineHeight: 0.85,
          letterSpacing: -10,
          opacity: numOpacity,
          transform: `scale(${numScale})`,
          transformOrigin: 'left center',
          fontFamily: theme.fontMono,
        }}
      >
        {number}
      </div>

      {/* 标题 */}
      <div
        style={{
          marginTop: 40,
          fontSize: 110,
          fontWeight: 900,
          color: theme.textInverse,
          opacity: titleOpacity,
          transform: `translateX(${titleX}px)`,
          letterSpacing: -2,
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>

      {/* 副标题 */}
      {subtitle && (
        <div
          style={{
            marginTop: 28,
            fontSize: 44,
            fontWeight: 500,
            color: '#a8a8b0',
            opacity: titleOpacity,
            transform: `translateX(${titleX}px)`,
            letterSpacing: -0.5,
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};
