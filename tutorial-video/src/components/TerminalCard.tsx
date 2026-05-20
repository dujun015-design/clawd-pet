import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { theme } from '../theme';

// 一条终端命令/输出。
// kind:
//   'cmd'    — 用户输入，显示 $ 前缀，逐字符打字
//   'out'    — 终端输出，整段瞬间出现
//   'okline' — 绿色成功行
//   'spinner'— 出现 spinner + 等待 ms 后切到 ok
export type TerminalLine =
  | { kind: 'cmd'; text: string; delayFrames?: number }
  | { kind: 'out'; text: string; color?: string }
  | { kind: 'okline'; text: string }
  | { kind: 'spinner'; label: string; waitFrames: number; doneText: string };

// 整体计算：每行根据 kind 占用一段帧数，叠加 delayFrames
function computeTimeline(lines: TerminalLine[], typeSpeed = 2) {
  let cursor = 0;
  return lines.map((line) => {
    const start = cursor + ((line as any).delayFrames || 0);
    let duration = 6; // 默认渲染时间
    if (line.kind === 'cmd') {
      duration = line.text.length * typeSpeed + 8;
    } else if (line.kind === 'spinner') {
      duration = line.waitFrames + 6;
    } else {
      duration = 6;
    }
    cursor = start + duration;
    return { line, start, duration };
  });
}

export const TerminalCard: React.FC<{
  title?: string;
  lines: TerminalLine[];
  width?: number;
  height?: number;
}> = ({ title = '~/clawd-pet', lines, width = 960, height = 1320 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tl = computeTimeline(lines);

  const renderLine = (
    line: TerminalLine,
    start: number,
    duration: number,
    idx: number,
  ) => {
    const local = frame - start;
    if (local < 0) return null;

    if (line.kind === 'cmd') {
      const chars = Math.min(line.text.length, Math.floor(local / 2));
      const showCursor = chars < line.text.length && Math.floor(frame / 12) % 2 === 0;
      return (
        <div key={idx} style={{ display: 'flex', gap: 16 }}>
          <span style={{ color: '#27c93f' }}>$</span>
          <span style={{ color: '#f5f5f7' }}>
            {line.text.slice(0, chars)}
            {showCursor && <span style={{ color: '#e07b39' }}>▍</span>}
          </span>
        </div>
      );
    }
    if (line.kind === 'out') {
      return (
        <div
          key={idx}
          style={{
            color: line.color || '#a8a8ad',
            paddingLeft: 0,
            whiteSpace: 'pre-wrap',
          }}
        >
          {line.text}
        </div>
      );
    }
    if (line.kind === 'okline') {
      return (
        <div key={idx} style={{ color: '#27c93f', fontWeight: 600 }}>
          {line.text}
        </div>
      );
    }
    if (line.kind === 'spinner') {
      const done = local >= line.waitFrames;
      const spinFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
      const spin = spinFrames[Math.floor(frame / 3) % spinFrames.length];
      if (done) {
        return (
          <div key={idx} style={{ color: '#27c93f' }}>
            ✔ {line.doneText}
          </div>
        );
      }
      return (
        <div key={idx} style={{ color: theme.accent }}>
          {spin} {line.label}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        background: '#1c1c1e',
        borderRadius: 24,
        boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        fontFamily: theme.fontMono,
        margin: 'auto',
      }}
    >
      {/* 标题栏 */}
      <div
        style={{
          height: 60,
          background: '#2c2c2e',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 10,
          borderBottom: '1px solid #1a1a1c',
        }}
      >
        <div style={{ width: 16, height: 16, borderRadius: 8, background: '#ff5f57' }} />
        <div style={{ width: 16, height: 16, borderRadius: 8, background: '#febc2e' }} />
        <div style={{ width: 16, height: 16, borderRadius: 8, background: '#28c840' }} />
        <span
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            color: '#a8a8ad',
            fontSize: 24,
            fontFamily: theme.fontFamily,
          }}
        >
          {title}
        </span>
      </div>

      {/* 终端内容 */}
      <div
        style={{
          padding: '32px 40px',
          fontSize: 32,
          lineHeight: 1.6,
          color: '#f5f5f7',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {tl.map(({ line, start, duration }, idx) => renderLine(line, start, duration, idx))}
      </div>
    </div>
  );
};

// 包一层全屏背景 + 居中
export const TerminalScene: React.FC<{
  title?: string;
  lines: TerminalLine[];
  bgGradient?: [string, string];
}> = ({ title, lines, bgGradient = ['#fdf3ec', '#fafafa'] }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${bgGradient[0]}, ${bgGradient[1]})`,
        opacity: fadeIn,
        padding: '80px 60px',
      }}
    >
      <TerminalCard title={title} lines={lines} />
    </AbsoluteFill>
  );
};
