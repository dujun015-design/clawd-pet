import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { Clawd } from '../components/Clawd';
import { Bubble } from '../components/Bubble';
import { theme } from '../theme';

// 展示段：10秒，3 个场景轮播
// 0-90帧 (3s)：写代码 → typing
// 90-180帧 (3s)：听歌 → groove
// 180-270帧 (3s)：聊天 → conducting
// 270-300帧 (1s)：收尾
type ShowcaseItem = {
  state: 'typing' | 'groove' | 'conducting';
  bubble: string;
  context: string;
};

const ITEMS: ShowcaseItem[] = [
  { state: 'typing', bubble: '一起写代码！⌨️', context: 'VS Code' },
  { state: 'groove', bubble: '听什么歌呢 🎵', context: 'Spotify' },
  { state: 'conducting', bubble: '微信回复中 💌', context: 'WeChat' },
];

const PER_SCENE = 90;

const SceneSlide: React.FC<{ item: ShowcaseItem }> = ({ item }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const exit = interpolate(frame, [PER_SCENE - 12, PER_SCENE], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const x = interpolate(enter, [0, 1], [-150, 0]);

  return (
    <AbsoluteFill
      style={{
        opacity: exit,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
        gap: 50,
      }}
    >
      {/* 上下文标签 */}
      <div
        style={{
          opacity: enter,
          background: theme.text,
          color: theme.textInverse,
          padding: '14px 36px',
          borderRadius: 999,
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: -0.3,
        }}
      >
        切到 {item.context} →
      </div>

      {/* Clawd + 气泡 */}
      <div
        style={{
          transform: `translateX(${x}px)`,
          opacity: enter,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 30,
        }}
      >
        <Bubble text={item.bubble} delay={20} />
        <Clawd state={item.state} size={460} />
      </div>
    </AbsoluteFill>
  );
};

export const Showcase: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        fontFamily: theme.fontFamily,
      }}
    >
      {ITEMS.map((item, i) => (
        <Sequence key={i} from={i * PER_SCENE} durationInFrames={PER_SCENE}>
          <SceneSlide item={item} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
