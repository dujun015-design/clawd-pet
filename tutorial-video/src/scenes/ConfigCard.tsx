import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from 'remotion';
import { TerminalCard, TerminalLine } from '../components/TerminalCard';
import { theme } from '../theme';

// 配置文件编辑（重点演示）— 25 秒
// 先终端写文件，然后画一个大卡片高亮 apiKey 那一行

const TerminalPhase: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const total = 360; // 12s
  const fadeOut = interpolate(frame, [total - 15, total], [1, 0], { extrapolateLeft: 'clamp' });

  const lines: TerminalLine[] = [
    { kind: 'out', text: '# 创建配置文件', color: '#a8a8ad' },
    { kind: 'cmd', text: 'nano ~/.clawd-config.json', delayFrames: 8 },
    { kind: 'out', text: '(在编辑器里写入下面的内容)', color: '#a8a8ad' },
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

// 高亮配置卡片：JSON + 注解
const ConfigShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const total = 390; // 13s
  const fadeOut = interpolate(frame, [total - 15, total], [1, 0], { extrapolateLeft: 'clamp' });

  // 每一行 JSON 逐渐出现
  const line1Op = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const line2Op = interpolate(frame, [55, 80], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const line3Op = interpolate(frame, [85, 110], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // 高亮 apiKey 那行
  const highlightOp = interpolate(frame, [140, 175], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const arrowOp = interpolate(frame, [175, 200], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #fdf3ec 0%, #fce6d4 100%)',
        padding: '80px 60px',
        alignItems: 'center',
        opacity: Math.min(fadeIn, fadeOut),
        fontFamily: theme.fontFamily,
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontWeight: 900,
          color: theme.text,
          textAlign: 'center',
          letterSpacing: -1,
          marginBottom: 30,
        }}
      >
        粘贴这段 <span style={{ color: theme.accent }}>JSON</span> 进去
      </div>

      {/* 配置卡片 */}
      <div
        style={{
          width: 960,
          background: '#1e1e1e',
          borderRadius: 20,
          padding: 50,
          boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
          fontFamily: theme.fontMono,
          fontSize: 44,
          color: '#d4d4d4',
          lineHeight: 1.7,
          position: 'relative',
        }}
      >
        <div>{'{'}</div>
        <div style={{ paddingLeft: 60, opacity: line1Op }}>
          <span style={{ color: '#9cdcfe' }}>"provider"</span>
          <span>: </span>
          <span style={{ color: '#ce9178' }}>"deepseek"</span>
          <span>,</span>
        </div>
        <div
          style={{
            paddingLeft: 60,
            opacity: line2Op,
            background: highlightOp > 0 ? `rgba(224,123,57,${0.18 * highlightOp})` : 'transparent',
            borderRadius: 6,
            marginLeft: -12,
            paddingRight: 12,
            marginRight: -12,
            transition: 'all 0.3s',
          }}
        >
          <span style={{ color: '#9cdcfe' }}>"apiKey"</span>
          <span>: </span>
          <span style={{ color: '#ce9178' }}>"sk-你的key粘这里"</span>
        </div>
        <div style={{ paddingLeft: 60, opacity: line3Op }}>
        </div>
        <div>{'}'}</div>

        {/* 箭头注解 */}
        <div
          style={{
            position: 'absolute',
            right: -40,
            top: 200,
            opacity: arrowOp,
            background: theme.accent,
            color: '#fff',
            padding: '20px 32px',
            borderRadius: 16,
            fontSize: 32,
            fontWeight: 800,
            boxShadow: '0 10px 30px rgba(224,123,57,0.5)',
            whiteSpace: 'nowrap',
            transform: 'translateX(100%)',
            fontFamily: theme.fontFamily,
          }}
        >
          ← 把你刚才复制的 key 粘这里
        </div>
      </div>

      <div
        style={{
          marginTop: 40,
          fontSize: 28,
          color: theme.textMuted,
          textAlign: 'center',
          fontWeight: 500,
        }}
      >
        保存 (Ctrl+O 回车，Ctrl+X 退出)
      </div>
    </AbsoluteFill>
  );
};

export const ConfigCard: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={360}>
        <TerminalPhase />
      </Sequence>
      <Sequence from={360} durationInFrames={390}>
        <ConfigShowcase />
      </Sequence>
    </AbsoluteFill>
  );
};
