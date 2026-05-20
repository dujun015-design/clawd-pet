import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';
import { theme } from '../theme';

// "5 秒换桌宠" 演示视频
// 时间轴 (FPS=30, 总 18s):
//   0-2s    : 标题闪入 "5 秒换桌宠"
//   2-6s    : 桌面 + 默认 Clawd 螃蟹
//   6-12s   : 配置文件编辑动画 (打字机)
//   12-15s  : 重启 → Clawd 变成 mini
//   15-18s  : "换皮肤就这么简单" + CTA

const TitleCard: React.FC<{ from: number; durationFrames: number; text: string; subtitle?: string }> = ({
  from,
  durationFrames,
  text,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;
  if (local < 0 || local > durationFrames) return null;

  const opacity = interpolate(local, [0, 10, durationFrames - 10, durationFrames], [0, 1, 1, 0]);
  const scale = spring({ frame: local, fps, config: { damping: 12, stiffness: 100 } });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 130,
            fontWeight: 900,
            color: theme.text,
            fontFamily: theme.fontFamily,
            letterSpacing: -2,
            lineHeight: 1.1,
          }}
        >
          {text}
        </div>
        {subtitle && (
          <div
            style={{
              marginTop: 24,
              fontSize: 44,
              color: theme.accent,
              fontWeight: 600,
              fontFamily: theme.fontFamily,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const DesktopScene: React.FC<{
  from: number;
  durationFrames: number;
  gifSrc: string;
  label: string;
}> = ({ from, durationFrames, gifSrc, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;
  if (local < 0 || local > durationFrames) return null;

  const opacity = interpolate(local, [0, 8, durationFrames - 8, durationFrames], [0, 1, 1, 0]);
  const petBounce = Math.sin((local / fps) * 2) * 8;

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #4a90e2 0%, #7bb3f0 100%)',
        opacity,
      }}
    >
      {/* 模拟桌面 menubar */}
      <div
        style={{
          height: 50,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          color: 'white',
          fontSize: 22,
          fontFamily: theme.fontFamily,
          fontWeight: 500,
        }}
      >
        <span style={{ marginRight: 30 }}>🍎</span>
        <span style={{ marginRight: 24 }}>Finder</span>
        <span style={{ flex: 1 }} />
        <span>16:24</span>
      </div>

      {/* 桌宠 + 标签 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        <Img
          src={staticFile(gifSrc)}
          style={{
            width: 360,
            height: 360,
            transform: `translateY(${petBounce}px)`,
            imageRendering: 'pixelated',
          }}
        />
        <div
          style={{
            background: 'white',
            padding: '16px 32px',
            borderRadius: 24,
            fontSize: 40,
            fontWeight: 700,
            color: theme.text,
            fontFamily: theme.fontFamily,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          {label}
        </div>
      </div>

      {/* 底部 Dock 暗示 */}
      <div
        style={{
          height: 100,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          margin: '0 200px 30px',
          borderRadius: 24,
        }}
      />
    </AbsoluteFill>
  );
};

// 模拟代码编辑器，逐字符把 "clawd" 改成 "clawd-mini"
const ConfigEditor: React.FC<{ from: number; durationFrames: number }> = ({ from, durationFrames }) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  if (local < 0 || local > durationFrames) return null;

  const fadeIn = interpolate(local, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(local, [durationFrames - 12, durationFrames], [1, 0], { extrapolateLeft: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);

  // 打字机：从 frame 30 开始，逐字符打字
  const TYPE_START = 30;
  const FULL = '-mini';
  const elapsed = Math.max(0, local - TYPE_START);
  const charsTyped = Math.min(FULL.length, Math.floor(elapsed / 8));
  const typedText = FULL.slice(0, charsTyped);
  const showCursor = Math.floor(local / 8) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        background: '#1e1e1e',
        padding: 60,
        opacity,
        fontFamily: theme.fontMono,
      }}
    >
      {/* 编辑器标题栏 */}
      <div
        style={{
          background: '#2d2d2d',
          padding: '20px 24px',
          borderRadius: '12px 12px 0 0',
          color: '#888',
          fontSize: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: 7, background: '#ff5f57' }} />
        <div style={{ width: 14, height: 14, borderRadius: 7, background: '#febc2e' }} />
        <div style={{ width: 14, height: 14, borderRadius: 7, background: '#28c840' }} />
        <span style={{ marginLeft: 20 }}>~/.clawd-config.json</span>
      </div>

      {/* 代码区 */}
      <div
        style={{
          background: '#1e1e1e',
          padding: 50,
          borderRadius: '0 0 12px 12px',
          color: '#d4d4d4',
          fontSize: 44,
          lineHeight: 1.7,
          border: '1px solid #333',
        }}
      >
        <div>{'{'}</div>
        <div style={{ paddingLeft: 60 }}>
          <span style={{ color: '#9cdcfe' }}>"provider"</span>
          <span>: </span>
          <span style={{ color: '#ce9178' }}>"deepseek"</span>
          <span>,</span>
        </div>
        <div style={{ paddingLeft: 60 }}>
          <span style={{ color: '#9cdcfe' }}>"apiKey"</span>
          <span>: </span>
          <span style={{ color: '#ce9178' }}>"sk-•••••••••••••••"</span>
          <span>,</span>
        </div>
        <div style={{ paddingLeft: 60, background: charsTyped > 0 ? 'rgba(224,123,57,0.15)' : 'transparent', borderRadius: 6 }}>
          <span style={{ color: '#9cdcfe' }}>"skin"</span>
          <span>: </span>
          <span style={{ color: '#ce9178' }}>
            "clawd
            <span style={{ color: '#e07b39', fontWeight: 700 }}>{typedText}</span>
            {showCursor && local > TYPE_START && charsTyped < FULL.length && (
              <span style={{ color: '#e07b39' }}>|</span>
            )}
            "
          </span>
        </div>
        <div>{'}'}</div>
      </div>

      {/* 提示气泡 */}
      {local > TYPE_START + 50 && (
        <div
          style={{
            position: 'absolute',
            top: 420,
            right: 100,
            background: theme.accent,
            color: 'white',
            padding: '20px 32px',
            borderRadius: 16,
            fontSize: 36,
            fontWeight: 600,
            fontFamily: theme.fontFamily,
            boxShadow: '0 8px 24px rgba(224,123,57,0.4)',
            opacity: interpolate(local, [TYPE_START + 50, TYPE_START + 65], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          ← 改这一行
        </div>
      )}
    </AbsoluteFill>
  );
};

export const SkinDemo: React.FC = () => {
  // 时间轴 (frames @ 30fps)
  // 0-60     : 标题 "5 秒换桌宠"
  // 60-180   : 默认 Clawd 桌面
  // 180-360  : 配置编辑器
  // 360-450  : 新桌宠（mini）
  // 450-540  : 结尾标题

  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <TitleCard from={0} durationFrames={60} text="5 秒" subtitle="换一只桌宠" />
      <DesktopScene from={60} durationFrames={120} gifSrc="gif/clawd-idle.gif" label="默认 Clawd 🦀" />
      <ConfigEditor from={180} durationFrames={180} />
      <DesktopScene from={360} durationFrames={90} gifSrc="gif/mini-idle.gif" label="Mini Clawd ✨" />
      <TitleCard from={450} durationFrames={90} text="换皮肤" subtitle="就这么简单" />
    </AbsoluteFill>
  );
};
