import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { Intro } from './scenes/Intro';
import { Showcase } from './scenes/Showcase';
import { ChapterCard } from './scenes/ChapterCard';
import { Outro } from './scenes/Outro';
import { theme } from './theme';

// 整片合成 —— 教程视频骨架
// 这是给你「程序化动画」的部分：片头 + 展示 + 章节卡 + 片尾
// 中间的录屏内容你录完后用剪映/ffmpeg 插入对应章节卡之后即可
//
// 时间线（共约 25 秒程序化动画）：
//   0:00 - 0:05  Intro 片头 (5s)
//   0:05 - 0:15  Showcase 展示段 (10s)  ← 比钩子视频短
//   0:15 - 0:17  Chapter 01: 准备工作 (2s)
//   [此处插入录屏：申请 key、装 Node]
//   0:17 - 0:19  Chapter 02: 下载项目 (2s)
//   [此处插入录屏：git clone / npm install]
//   0:19 - 0:21  Chapter 03: 配置运行 (2s)
//   [此处插入录屏：写 config + npm start]
//   0:21 - 0:26  Outro 片尾 (5s)

export const TutorialVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Series>
        <Series.Sequence durationInFrames={150}>
          <Intro />
        </Series.Sequence>

        <Series.Sequence durationInFrames={300}>
          <Showcase />
        </Series.Sequence>

        <Series.Sequence durationInFrames={60}>
          <ChapterCard
            number="01"
            title="准备工作"
            subtitle="安装 Node.js + 申请 DeepSeek API Key"
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={60}>
          <ChapterCard
            number="02"
            title="下载项目"
            subtitle="git clone 然后 npm install"
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={60}>
          <ChapterCard
            number="03"
            title="配置运行"
            subtitle="写入 ~/.clawd-config.json"
          />
        </Series.Sequence>

        <Series.Sequence durationInFrames={150}>
          <Outro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
