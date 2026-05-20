import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { Opening } from './scenes/Opening';
import { ChapterCard } from './scenes/ChapterCard';
import { NodeJsScene, DeepSeekScene } from './scenes/PrepareCard';
import { CloneCard } from './scenes/CloneCard';
import { ConfigCard } from './scenes/ConfigCard';
import { RunStartCard } from './scenes/RunStartCard';
import { DemoShowcase } from './scenes/DemoShowcase';
import { OutroV2 } from './scenes/OutroV2';
import { theme } from './theme';

// ────────────────────────────────────────────────────────────────────────
// 完整教程 v2 — 用户最终版结构
//
// ① 开场展示       Opening              15s     450f
// ── 章节卡 01 准备工作                  3s      90f
// ② 准备：Node.js  NodeJsScene          12s    360f
// ② 准备：DeepSeek DeepSeekScene        15s    450f
// ── 章节卡 02 下载 & 运行               3s      90f
// ③ git clone      CloneCard            15s    450f
// ③ 写配置         ConfigCard           25s    750f
// ③ npm start      RunStartCard         17s    510f
// ── 章节卡 03 效果演示                  3s      90f
// ④ 演示           DemoShowcase         27s    810f
// ⑤ 片尾           OutroV2              15s    450f
//
// 总长 = 4500 帧 = 150 秒 = 2 分 30 秒
// ────────────────────────────────────────────────────────────────────────

export const TutorialV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Series>
        {/* ① 开场 */}
        <Series.Sequence durationInFrames={450}>
          <Opening />
        </Series.Sequence>

        {/* 章节 01 */}
        <Series.Sequence durationInFrames={90}>
          <ChapterCard number="01" title="准备工作" subtitle="装 Node.js + 申请 API Key" />
        </Series.Sequence>

        {/* ② 准备 - Node.js */}
        <Series.Sequence durationInFrames={360}>
          <NodeJsScene />
        </Series.Sequence>

        {/* ② 准备 - DeepSeek */}
        <Series.Sequence durationInFrames={450}>
          <DeepSeekScene />
        </Series.Sequence>

        {/* 章节 02 */}
        <Series.Sequence durationInFrames={90}>
          <ChapterCard number="02" title="下载 & 运行" subtitle="git clone → npm install → 配置 → 启动" />
        </Series.Sequence>

        {/* ③ 下载 & 安装 */}
        <Series.Sequence durationInFrames={450}>
          <CloneCard />
        </Series.Sequence>

        {/* ③ 写配置（25s 重点） */}
        <Series.Sequence durationInFrames={750}>
          <ConfigCard />
        </Series.Sequence>

        {/* ③ 启动 */}
        <Series.Sequence durationInFrames={510}>
          <RunStartCard />
        </Series.Sequence>

        {/* 章节 03 */}
        <Series.Sequence durationInFrames={90}>
          <ChapterCard number="03" title="效果演示" subtitle="切 app 看反应" />
        </Series.Sequence>

        {/* ④ 演示 */}
        <Series.Sequence durationInFrames={810}>
          <DemoShowcase />
        </Series.Sequence>

        {/* ⑤ 片尾 */}
        <Series.Sequence durationInFrames={450}>
          <OutroV2 />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
