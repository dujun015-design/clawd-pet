import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from 'remotion';
import { BrowserMockup, ArrowAnnotation } from '../components/BrowserMockup';
import { theme } from '../theme';

// 准备工作：Node.js (12s) + DeepSeek (15s) = 27s
// 不含章节卡，章节卡由 TutorialV2 单独插入

const FadeWrap: React.FC<{
  children: React.ReactNode;
  fadeInEnd?: number;
  fadeOutStart?: number;
  total: number;
}> = ({ children, fadeInEnd = 15, fadeOutStart, total }) => {
  const frame = useCurrentFrame();
  const fOutStart = fadeOutStart ?? total - 15;
  const opacity = Math.min(
    interpolate(frame, [0, fadeInEnd], [0, 1], { extrapolateRight: 'clamp' }),
    interpolate(frame, [fOutStart, total], [1, 0], { extrapolateLeft: 'clamp' })
  );
  return <div style={{ opacity, width: '100%', height: '100%' }}>{children}</div>;
};

// 子场景 1：DeepSeek 平台（15秒）
const DeepSeekScene: React.FC = () => {
  const frame = useCurrentFrame();
  const total = 450; // 15s @ 30fps
  const arrowOp = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <FadeWrap total={total}>
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, #fef6ee 0%, #fdf3ec 100%)',
          padding: '80px 60px',
          alignItems: 'center',
          gap: 30,
        }}
      >
        {/* 顶部标题 */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: theme.text,
            fontFamily: theme.fontFamily,
            textAlign: 'center',
            letterSpacing: -1,
          }}
        >
          <span style={{ color: theme.accent }}>1️⃣</span> 申请 API Key
        </div>

        {/* 浏览器 mockup */}
        <div style={{ position: 'relative' }}>
          <BrowserMockup
            url="platform.deepseek.com/api_keys"
            width={960}
            height={1280}
          >
            <div style={{ display: 'flex', height: '100%' }}>
              {/* 左侧导航 */}
              <div
                style={{
                  width: 240,
                  background: '#f9f9fb',
                  padding: '24px 16px',
                  borderRight: '1px solid #ececec',
                  fontFamily: theme.fontFamily,
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 30, color: '#1e3a8a' }}>
                  DeepSeek
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 22 }}>
                  <div style={{ color: '#888', padding: '10px 14px' }}>概览</div>
                  <div
                    style={{
                      color: theme.text,
                      padding: '10px 14px',
                      background: theme.accentSoft,
                      borderRadius: 8,
                      fontWeight: 700,
                      borderLeft: `4px solid ${theme.accent}`,
                    }}
                  >
                    API Keys
                  </div>
                  <div style={{ color: '#888', padding: '10px 14px' }}>账单</div>
                  <div style={{ color: '#888', padding: '10px 14px' }}>文档</div>
                </div>
              </div>

              {/* 右侧主内容 */}
              <div style={{ flex: 1, padding: 30, fontFamily: theme.fontFamily }}>
                <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 20 }}>API Keys</div>
                <div style={{ fontSize: 18, color: '#666', marginBottom: 24 }}>
                  管理你的 API 访问令牌
                </div>
                <div
                  style={{
                    background: '#2563eb',
                    color: '#fff',
                    padding: '14px 24px',
                    borderRadius: 10,
                    fontSize: 22,
                    fontWeight: 700,
                    display: 'inline-block',
                    boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                  }}
                >
                  + 创建 API Key
                </div>
                <div style={{ marginTop: 40 }}>
                  <div
                    style={{
                      border: '1px dashed #d0d0d3',
                      borderRadius: 12,
                      padding: 40,
                      textAlign: 'center',
                      color: '#999',
                      fontSize: 20,
                    }}
                  >
                    暂无 API Key
                  </div>
                </div>
              </div>
            </div>
          </BrowserMockup>

          {/* 大箭头：放在 "暂无 API Key" 下方位置，箭头指向上方的蓝色按钮 */}
          <ArrowAnnotation
            x={300}
            y={420}
            text="点这里创建 Key"
            arrow="↑"
            arrowPosition="before"
            size="xl"
            opacity={arrowOp}
          />
        </div>

        <div
          style={{
            fontSize: 32,
            color: theme.textMuted,
            fontFamily: theme.fontFamily,
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          创建后<span style={{ color: theme.accent, fontWeight: 700 }}>复制好 key</span>，待会要用
        </div>
      </AbsoluteFill>
    </FadeWrap>
  );
};

// 子场景 2：Node.js 下载（12秒）
const NodeJsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const total = 360; // 12s @ 30fps
  const arrowOp = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <FadeWrap total={total}>
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)',
          padding: '80px 60px',
          alignItems: 'center',
          gap: 30,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: theme.text,
            fontFamily: theme.fontFamily,
            textAlign: 'center',
            letterSpacing: -1,
          }}
        >
          <span style={{ color: '#22c55e' }}>2️⃣</span> 装 Node.js
        </div>

        <div style={{ position: 'relative' }}>
          <BrowserMockup url="nodejs.org/download" width={960} height={1280}>
            <div style={{ padding: 50, fontFamily: theme.fontFamily }}>
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  color: '#1e3a1e',
                  textAlign: 'center',
                  marginBottom: 16,
                  lineHeight: 1.1,
                }}
              >
                Node.js®
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: '#666',
                  textAlign: 'center',
                  marginBottom: 40,
                }}
              >
                JavaScript 运行环境
              </div>

              {/* 两个下载按钮 */}
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 30 }}>
                <div
                  style={{
                    background: '#22c55e',
                    color: '#fff',
                    padding: '24px 40px',
                    borderRadius: 14,
                    fontSize: 28,
                    fontWeight: 700,
                    textAlign: 'center',
                    boxShadow: '0 6px 24px rgba(34,197,94,0.35)',
                  }}
                >
                  下载 LTS<br />
                  <span style={{ fontSize: 18, fontWeight: 500, opacity: 0.9 }}>
                    推荐 · 稳定版
                  </span>
                </div>
                <div
                  style={{
                    background: '#fff',
                    color: '#666',
                    border: '2px solid #d4d4d4',
                    padding: '24px 40px',
                    borderRadius: 14,
                    fontSize: 28,
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  下载 Current<br />
                  <span style={{ fontSize: 18, fontWeight: 500 }}>最新功能</span>
                </div>
              </div>

              <div
                style={{
                  marginTop: 40,
                  background: '#f9fafb',
                  borderRadius: 12,
                  padding: 24,
                  fontSize: 18,
                  color: '#555',
                  textAlign: 'center',
                  border: '1px solid #e5e7eb',
                }}
              >
                适配 Windows / macOS / Linux
              </div>
            </div>
          </BrowserMockup>

          {/* 大箭头：放在 "适配..." 信息盒下面，指向左上方的 LTS 按钮 */}
          <ArrowAnnotation
            x={170}
            y={530}
            text="下载左边这个！"
            arrow="↖"
            arrowPosition="before"
            size="xl"
            opacity={arrowOp}
          />
        </div>

        <div
          style={{
            fontSize: 32,
            color: theme.textMuted,
            fontFamily: theme.fontFamily,
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          下载后<span style={{ color: '#22c55e', fontWeight: 700 }}>一路下一步</span>就行
        </div>
      </AbsoluteFill>
    </FadeWrap>
  );
};

// 新版顺序：先 Node.js (12s)，再 DeepSeek (15s)
export const PrepareCard: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={360}>
        <NodeJsScene />
      </Sequence>
      <Sequence from={360} durationInFrames={450}>
        <DeepSeekScene />
      </Sequence>
    </AbsoluteFill>
  );
};

// 单独导出，方便在 TutorialV2 里独立用
export { NodeJsScene, DeepSeekScene };
