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

// 片头：5秒
// 0-20帧：渐变背景出现
// 15-35帧：Clawd 从下方弹入
// 35-60帧：主标题滑入
// 60-90帧：副标题打字机
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 背景出现
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // Clawd 弹入
  const clawdSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 11, stiffness: 160 },
  });
  const clawdY = interpolate(clawdSpring, [0, 1], [200, 0]);
  const clawdOpacity = interpolate(clawdSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const clawdScale = interpolate(clawdSpring, [0, 1], [0.5, 1]);

  // 主标题
  const titleSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  // 副标题打字机
  const subtitle = '从零开始 · 完整教程';
  const charsShown = Math.floor(
    interpolate(frame - 60, [0, 30], [0, subtitle.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // 退出（最后 10 帧淡出）
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #fef6ee 0%, #fdf3ec 50%, #fce6d4 100%)`,
        opacity: bgOpacity * exitOpacity,
        fontFamily: theme.fontFamily,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* Clawd 角色 */}
      <div
        style={{
          opacity: clawdOpacity,
          transform: `translateY(${clawdY}px) scale(${clawdScale})`,
          marginBottom: 60,
        }}
      >
        <Clawd state="happy" size={520} />
      </div>

      {/* 主标题 */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 110,
          fontWeight: 900,
          color: theme.text,
          letterSpacing: -2,
          textAlign: 'center',
          lineHeight: 1.1,
        }}
      >
        AI 桌宠 <span style={{ color: theme.accent }}>Clawd</span>
      </div>

      {/* 副标题 —— 打字机 */}
      <div
        style={{
          marginTop: 30,
          fontSize: 52,
          color: theme.textMuted,
          fontWeight: 600,
          letterSpacing: -0.5,
          minHeight: 70,
        }}
      >
        {subtitle.slice(0, charsShown)}
        {charsShown < subtitle.length && charsShown > 0 && (
          <span
            style={{
              display: 'inline-block',
              width: 4,
              height: 50,
              background: theme.accent,
              verticalAlign: 'middle',
              marginLeft: 6,
              animation: 'blink 0.7s infinite',
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
