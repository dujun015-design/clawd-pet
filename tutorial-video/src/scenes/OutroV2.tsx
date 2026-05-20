import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import { Clawd } from '../components/Clawd';
import { theme } from '../theme';

// 片尾 15 秒
// 0-3s    : "搞定！" Clawd 跳 + 标题
// 3-9s    : 两个 CTA 卡片 (简介 .app / GitHub)
// 9-13s   : "感谢观看" + 关注引导
// 13-15s  : 淡出

export const OutroV2: React.FC = () => {
  const frame = useCurrentFrame();
  const total = 450;

  const fadeOut = interpolate(frame, [total - 18, total], [1, 0], {
    extrapolateLeft: 'clamp',
  });

  // Clawd 弹入
  const clawdY = interpolate(frame, [0, 50], [80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const clawdOp = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 标题
  const titleY = interpolate(frame, [30, 70], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleOp = interpolate(frame, [30, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // CTA 卡片
  const card1Op = interpolate(frame, [90, 130], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const card1Y = interpolate(frame, [90, 130], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const card2Op = interpolate(frame, [150, 190], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const card2Y = interpolate(frame, [150, 190], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 关注引导
  const ctaOp = interpolate(frame, [260, 300], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #fef6ee 0%, #fce6d4 100%)',
        fontFamily: theme.fontFamily,
        padding: 80,
        opacity: fadeOut,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 30,
      }}
    >
      {/* Clawd */}
      <div
        style={{
          marginTop: 80,
          transform: `translateY(${clawdY}px)`,
          opacity: clawdOp,
        }}
      >
        <Clawd state="jump" size={400} />
      </div>

      {/* 标题 */}
      <div
        style={{
          marginTop: 20,
          fontSize: 90,
          fontWeight: 900,
          color: theme.text,
          letterSpacing: -2,
          textAlign: 'center',
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
        }}
      >
        搞定！<span style={{ color: theme.accent }}>✨</span>
      </div>

      {/* CTA 1：简介下载 .app */}
      <div
        style={{
          marginTop: 60,
          opacity: card1Op,
          transform: `translateY(${card1Y}px)`,
          background: '#fff',
          borderLeft: `8px solid ${theme.accent}`,
          borderRadius: 16,
          padding: '24px 36px',
          fontSize: 36,
          fontWeight: 700,
          color: theme.text,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          width: 880,
        }}
      >
        <div style={{ color: theme.accent, fontSize: 24, fontWeight: 600, marginBottom: 4 }}>
          ① 嫌麻烦？
        </div>
        简介里有打包好的 .app 直接下载 📦
      </div>

      {/* CTA 2: GitHub */}
      <div
        style={{
          opacity: card2Op,
          transform: `translateY(${card2Y}px)`,
          background: '#fff',
          borderLeft: '8px solid #1c1c1e',
          borderRadius: 16,
          padding: '24px 36px',
          fontSize: 36,
          fontWeight: 700,
          color: theme.text,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          width: 880,
        }}
      >
        <div style={{ color: theme.textMuted, fontSize: 24, fontWeight: 600, marginBottom: 4 }}>
          ② 想看源码 / 自己改？
        </div>
        <span style={{ fontFamily: theme.fontMono, fontSize: 32 }}>
          github.com/dujun015-design/clawd-pet
        </span>
      </div>

      {/* 底部 CTA */}
      <div
        style={{
          marginTop: 'auto',
          textAlign: 'center',
          opacity: ctaOp,
          marginBottom: 60,
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 800, color: theme.text }}>
          有用就点个赞👍 关注我
        </div>
        <div style={{ marginTop: 14, fontSize: 30, color: theme.textMuted, fontWeight: 500 }}>
          下期教你做自己的桌宠皮肤 🎨
        </div>
      </div>
    </AbsoluteFill>
  );
};
