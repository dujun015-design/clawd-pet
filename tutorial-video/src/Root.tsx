import { Composition } from 'remotion';
import { Intro } from './scenes/Intro';
import { Showcase } from './scenes/Showcase';
import { ChapterCard } from './scenes/ChapterCard';
import { Outro } from './scenes/Outro';
import { SkinDemo } from './scenes/SkinDemo';
import { CloneCard } from './scenes/CloneCard';
import { ConfigCard } from './scenes/ConfigCard';
import { PrepareCard } from './scenes/PrepareCard';
import { TutorialV2 } from './TutorialV2';
import { Poster } from './scenes/Poster';
import { TutorialVideo } from './TutorialVideo';

// 抖音/小红书 竖屏 9:16
const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;

export const Root: React.FC = () => {
  return (
    <>
      {/* ★ 整片合成 v2 —— 完整教程视频（2'30") */}
      <Composition
        id="TutorialV2"
        component={TutorialV2}
        durationInFrames={4500} // 150秒
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 旧整片合成（仅 26 秒动画骨架，保留） */}
      <Composition
        id="TutorialVideo"
        component={TutorialVideo}
        durationInFrames={780}
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

      {/* 展示段（10秒） */}
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

      {/* Ch1 准备工作卡（18秒）—— 替代 DeepSeek+Node 录屏 */}
      <Composition
        id="PrepareCard"
        component={PrepareCard}
        durationInFrames={FPS * 18}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Ch2 终端动画卡（15秒）—— 替代 git clone 录屏 */}
      <Composition
        id="CloneCard"
        component={CloneCard}
        durationInFrames={FPS * 15}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Ch3 终端动画卡（15秒）—— 替代配置 + 启动录屏 */}
      <Composition
        id="ConfigCard"
        component={ConfigCard}
        durationInFrames={FPS * 15}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* 小红书安装海报（单帧 1242×1656，3:4 竖图）*/}
      <Composition
        id="Poster"
        component={Poster}
        durationInFrames={1}
        fps={30}
        width={1242}
        height={1656}
      />

      {/* 皮肤系统演示（18秒）—— 抖音/小红书短视频 */}
      <Composition
        id="SkinDemo"
        component={SkinDemo}
        durationInFrames={FPS * 18}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
