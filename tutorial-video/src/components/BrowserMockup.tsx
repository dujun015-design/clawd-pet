import React from 'react';
import { theme } from '../theme';

// 模拟浏览器窗口（Safari/Chrome 风）
export const BrowserMockup: React.FC<{
  url: string;
  title?: string;
  width?: number;
  height?: number;
  children: React.ReactNode;
}> = ({ url, title, width = 960, height = 1080, children }) => {
  return (
    <div
      style={{
        width,
        height,
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        fontFamily: theme.fontFamily,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 浏览器标题栏 */}
      <div
        style={{
          height: 60,
          background: '#f1f1f3',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: 10,
          borderBottom: '1px solid #e0e0e3',
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: 7, background: '#ff5f57' }} />
        <div style={{ width: 14, height: 14, borderRadius: 7, background: '#febc2e' }} />
        <div style={{ width: 14, height: 14, borderRadius: 7, background: '#28c840' }} />
        <div
          style={{
            marginLeft: 30,
            flex: 1,
            background: '#fff',
            border: '1px solid #d0d0d3',
            borderRadius: 8,
            padding: '8px 16px',
            color: '#555',
            fontSize: 22,
            fontFamily: theme.fontMono,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: '#28c840' }}>🔒</span>
          {url}
        </div>
      </div>

      {/* 网页 tab 标题（可选） */}
      {title && (
        <div
          style={{
            padding: '12px 24px',
            fontSize: 20,
            color: theme.textMuted,
            borderBottom: '1px solid #f0f0f3',
          }}
        >
          {title}
        </div>
      )}

      {/* 网页内容 */}
      <div style={{ flex: 1, overflow: 'hidden', background: '#fff' }}>{children}</div>
    </div>
  );
};

// 大箭头注释 —— arrow 直接传字符，更直观
// 推荐用：'↑' '↓' '←' '→' '↗' '↖' '↘' '↙'
export const ArrowAnnotation: React.FC<{
  x: number;
  y: number;
  text: string;
  arrow?: string;
  arrowPosition?: 'before' | 'after'; // 箭头在文字前还是后
  opacity?: number;
  size?: 'md' | 'lg' | 'xl';
}> = ({ x, y, text, arrow = '↑', arrowPosition = 'before', opacity = 1, size = 'lg' }) => {
  const dims = {
    md: { fontSize: 28, arrowSize: 40, padding: '12px 22px' },
    lg: { fontSize: 36, arrowSize: 56, padding: '18px 30px' },
    xl: { fontSize: 44, arrowSize: 72, padding: '22px 36px' },
  }[size];

  const arrowEl = (
    <span style={{ fontSize: dims.arrowSize, lineHeight: 1, fontWeight: 900 }}>{arrow}</span>
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: theme.accent,
        color: '#fff',
        padding: dims.padding,
        borderRadius: 18,
        fontSize: dims.fontSize,
        fontWeight: 800,
        fontFamily: theme.fontFamily,
        boxShadow: '0 10px 32px rgba(224,123,57,0.55)',
        whiteSpace: 'nowrap',
      }}
    >
      {arrowPosition === 'before' && arrowEl}
      {text}
      {arrowPosition === 'after' && arrowEl}
    </div>
  );
};
