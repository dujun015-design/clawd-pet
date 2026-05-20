import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
} from 'remotion';
import { Clawd } from '../components/Clawd';
import { Bubble } from '../components/Bubble';
import { theme } from '../theme';

// ① 开场展示 - 15秒
// 0-4s   : 大字标题"上次很多人问怎么做 / 今天出教程"
// 4-9s   : Clawd 趴在桌面 + 切到 VS Code → typing
// 9-15s  : 点开聊天 → 一句回复

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, 100, 120], [0, 1, 1, 0]);
  const y1 = interpolate(frame, [0, 30], [40, 0], { extrapolateRight: 'clamp' });
  const y2 = interpolate(frame, [25, 55], [40, 0], { extrapolateRight: 'clamp' });
  const op2 = interpolate(frame, [25, 55], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #fef6ee 0%, #fdf3ec 100%)',
        fontFamily: theme.fontFamily,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
        opacity,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 900,
          color: theme.text,
          letterSpacing: -2,
          lineHeight: 1.15,
          transform: `translateY(${y1}px)`,
        }}
      >
        上次很多人问怎么做
      </div>
      <div
        style={{
          marginTop: 32,
          fontSize: 96,
          fontWeight: 900,
          color: theme.accent,
          letterSpacing: -2,
          lineHeight: 1.15,
          opacity: op2,
          transform: `translateY(${y2}px)`,
        }}
      >
        今天出教程
      </div>
      <div
        style={{
          marginTop: 60,
          fontSize: 110,
          opacity: op2,
          transform: `translateY(${y2}px)`,
        }}
      >
        👇
      </div>
    </AbsoluteFill>
  );
};

// 桌面 + Clawd 趴角 + 切 VS Code
const DesktopDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 135, 150], [0, 1, 1, 0]);

  // 60 帧前：idle，之后切换为 typing 状态
  const isTyping = frame > 60;
  const bannerOp = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #4a90e2 0%, #7bb3f0 100%)',
        opacity,
      }}
    >
      {/* 顶部 menubar */}
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
        <span style={{ marginRight: 24, fontWeight: 600 }}>
          {isTyping ? 'Code' : 'Finder'}
        </span>
        <span style={{ flex: 1 }} />
        <span>16:24</span>
      </div>

      {/* 标语 */}
      <div
        style={{
          marginTop: 80,
          textAlign: 'center',
          color: 'white',
          fontFamily: theme.fontFamily,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {isTyping ? '切到 VS Code' : 'Clawd 趴在桌面'}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 36,
            opacity: 0.9,
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {isTyping ? '它会自动开始打字 ⌨️' : '看你在干嘛'}
        </div>
      </div>

      {/* Clawd + 气泡 */}
      <div
        style={{
          position: 'absolute',
          bottom: 240,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {isTyping && (
          <div style={{ opacity: bannerOp }}>
            <Bubble text="一起写代码！⌨️" delay={0} />
          </div>
        )}
        <Clawd state={isTyping ? 'typing' : 'idle'} size={320} />
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

// 点开聊天 → 回复
const ChatPeek: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 165, 180], [0, 1, 1, 0]);

  // 用户消息渐入
  const userOp = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' });
  // AI 回复打字机
  const aiText = '试试切到 Spotify，它会跳舞 💃';
  const charsShown = Math.floor(
    interpolate(frame - 50, [0, 90], [0, aiText.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const cursorBlink = Math.floor(frame / 10) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        background: theme.bg,
        fontFamily: theme.fontFamily,
        opacity,
        padding: '80px 60px',
      }}
    >
      {/* 顶部标题 */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 900,
          color: theme.text,
          textAlign: 'center',
          letterSpacing: -1,
        }}
      >
        点一下还能<span style={{ color: theme.accent }}>聊天</span> 💬
      </div>

      {/* 模拟聊天窗口 */}
      <div
        style={{
          marginTop: 60,
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          maxWidth: 880,
          margin: '60px auto 0',
        }}
      >
        {/* 标题栏 */}
        <div
          style={{
            height: 70,
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: 10,
            borderBottom: '1px solid #ececec',
            background: '#fafafa',
          }}
        >
          <div style={{ width: 16, height: 16, borderRadius: 8, background: '#ff5f57' }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, background: '#febc2e' }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, background: '#28c840' }} />
          <span
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              fontSize: 22,
              fontWeight: 700,
              color: theme.text,
            }}
          >
            Clawd · deepseek-chat
          </span>
        </div>

        {/* 消息区 */}
        <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* 用户 */}
          <div
            style={{
              alignSelf: 'flex-end',
              background: '#1c1c1e',
              color: '#fff',
              padding: '18px 24px',
              borderRadius: 22,
              borderBottomRightRadius: 6,
              fontSize: 32,
              maxWidth: '70%',
              opacity: userOp,
            }}
          >
            你好！
          </div>

          {/* AI 回复 */}
          <div
            style={{
              alignSelf: 'flex-start',
              background: '#f4f4f5',
              color: theme.text,
              padding: '18px 24px',
              borderRadius: 22,
              borderBottomLeftRadius: 6,
              fontSize: 32,
              maxWidth: '85%',
              minHeight: 60,
              opacity: charsShown > 0 ? 1 : 0,
            }}
          >
            {aiText.slice(0, charsShown)}
            {charsShown < aiText.length && (
              <span
                style={{
                  opacity: cursorBlink ? 1 : 0,
                  color: theme.accent,
                  marginLeft: 2,
                }}
              >
                ▍
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 50,
          textAlign: 'center',
          fontSize: 30,
          color: theme.textMuted,
          fontWeight: 500,
        }}
      >
        支持 9 种大模型 · 流式 Markdown 渲染
      </div>
    </AbsoluteFill>
  );
};

export const Opening: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Sequence from={0} durationInFrames={120}>
        <TitleCard />
      </Sequence>
      <Sequence from={120} durationInFrames={150}>
        <DesktopDemo />
      </Sequence>
      <Sequence from={270} durationInFrames={180}>
        <ChatPeek />
      </Sequence>
    </AbsoluteFill>
  );
};
