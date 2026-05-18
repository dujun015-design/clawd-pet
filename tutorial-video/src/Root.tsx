import { Composition } from 'remotion';
import { Intro } from './scenes/Intro';
import { Showcase } from './scenes/Showcase';
import { ChapterCard } from './scenes/ChapterCard';
import { Outro } from './scenes/Outro';
import { TutorialVideo } from './TutorialVideo';

// 抖音/小红书 竖屏 9:16
const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;

export const Root: React.FC = () => {
  return (
    <>
      {/* 整片合成 —— 用于一次导出完整教程 */}
      <Composition
        id="TutorialVideo"
        component={TutorialVideo}
        durationInFrames={780} // 26秒：5+10+2+2+2+5
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 单独的片头（5秒） */}
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={FPS * 5}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 展示段（10秒，占位） */}
      <Composition
        id="Showcase"
        component={Showcase}
        durationInFrames={FPS * 10}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 章节卡（2秒） —— 可复用做「第一步」「第二步」 */}
      <Composition
        id="ChapterCard"
        component={ChapterCard}
        durationInFrames={FPS * 2}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          number: '01',
          title: '准备工作',
          subtitle: '安装 Node.js + 申请 API Key',
        }}
      />

      {/* 片尾（5秒） */}
      <Composition
        id="Outro"
        component={Outro}
        durationInFrames={FPS * 5}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
