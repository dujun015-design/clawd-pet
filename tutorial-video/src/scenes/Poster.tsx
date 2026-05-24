import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { theme } from '../theme';

// 单帧海报：小红书 3:4 (1242×1656)
// 一图全说明安装步骤

const Step: React.FC<{
  n: string;
  title: string;
  children: React.ReactNode;
  accent?: string;
}> = ({ n, title, children, accent = theme.accent }) => (
  <div
    style={{
      background: '#fff',
      borderRadius: 20,
      padding: '20px 24px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
      display: 'flex',
      gap: 20,
      alignItems: 'flex-start',
    }}
  >
    <div
      style={{
        flexShrink: 0,
        width: 60,
        height: 60,
        borderRadius: 15,
        background: accent,
        color: '#fff',
        fontSize: 38,
        fontWeight: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.fontMono,
      }}
    >
      {n}
    </div>
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: 32,
          fontWeight: 900,
          color: theme.text,
          letterSpacing: -0.5,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 22, lineHeight: 1.5, color: '#4a4a4f', fontWeight: 500 }}>
        {children}
      </div>
    </div>
  </div>
);

export const Poster: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #fff5ed 0%, #fce6d4 60%, #fbd7b3 100%)',
        fontFamily: theme.fontFamily,
        padding: '40px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* 头部：标题 + Clawd */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 6px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: theme.accent,
              letterSpacing: -0.5,
              marginBottom: 4,
            }}
          >
            AI 桌宠 · 一图安装
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 900,
              color: theme.text,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            Clawd 🦀
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 24,
              color: '#5a5a5f',
              fontWeight: 500,
            }}
          >
            Mac · Windows · 全平台支持
          </div>
        </div>
        <Img
          src={staticFile('gif/clawd-happy.gif')}
          style={{
            width: 200,
            height: 200,
            imageRendering: 'pixelated',
          }}
        />
      </div>

      {/* 五大步骤 */}
      <Step n="1" title="下载">
        GitHub 搜「<b>dujun015-design/clawd-pet</b>」<br />
        点 <b>Releases</b> → Mac 选 .zip / Win 选 .zip
      </Step>

      <Step n="2" title="第一次打开" accent="#d94560">
        🍎 Mac：右键 → 打开 → 仍要打开<br />
        🪟 Win：更多信息 → 仍要运行<br />
        <span style={{ color: '#d94560', fontWeight: 700 }}>⚠ Win 别只拖 exe，整个文件夹要保持</span>
      </Step>

      <Step n="3" title="申请 API Key（必做）">
        去 <b>platform.deepseek.com</b><br />
        注册 → 充 1 块钱 → 创建 Key<br />
        <span style={{ color: '#888' }}>1 块钱够聊几千次，超划算</span>
      </Step>

      <Step n="4" title="写配置文件" accent="#2563eb">
        <div
          style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            padding: 14,
            borderRadius: 10,
            fontFamily: theme.fontMono,
            fontSize: 20,
            marginTop: 4,
            lineHeight: 1.45,
          }}
        >
          <span style={{ color: '#9cdcfe' }}>{'{'}</span><br />
          &nbsp;&nbsp;<span style={{ color: '#9cdcfe' }}>"provider"</span>: <span style={{ color: '#ce9178' }}>"deepseek"</span>,<br />
          &nbsp;&nbsp;<span style={{ color: '#9cdcfe' }}>"apiKey"</span>: <span style={{ color: '#ce9178' }}>"sk-粘你的key"</span><br />
          <span style={{ color: '#9cdcfe' }}>{'}'}</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 20 }}>
          保存到 <b>~/.clawd-config.json</b>
        </div>
      </Step>

      <Step n="5" title="启动 + 玩法" accent="#16a34a">
        双击 App → 右下角出现螃蟹 🦀<br />
        <b>左键</b>聊天 · <b>右键</b>菜单 · <b>拖拽</b>移动<br />
        切 VS Code 它打字 · 切 Spotify 它跳舞
      </Step>

      {/* 底部：CTA */}
      <div
        style={{
          marginTop: 4,
          background: theme.text,
          borderRadius: 20,
          padding: '20px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 2,
            }}
          >
            源码 / 教程 / 换皮肤
          </div>
          <div
            style={{
              color: theme.accent,
              fontSize: 19,
              fontWeight: 600,
              fontFamily: theme.fontMono,
            }}
          >
            github.com/dujun015-design/clawd-pet
          </div>
        </div>
        <div
          style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: 600,
            textAlign: 'right',
            opacity: 0.9,
          }}
        >
          关注我<br />
          <span style={{ fontSize: 16, opacity: 0.75 }}>下期教自己画桌宠</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
