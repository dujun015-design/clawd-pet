import { TerminalScene, TerminalLine } from '../components/TerminalCard';

// Ch2 替代：git clone + npm install 全动画版（~15秒）
export const CloneCard: React.FC = () => {
  const lines: TerminalLine[] = [
    { kind: 'cmd', text: 'git clone https://github.com/dujun015-design/clawd-pet.git' },
    { kind: 'out', text: "Cloning into 'clawd-pet'..." },
    { kind: 'out', text: 'remote: Enumerating objects: 142, done.' },
    { kind: 'out', text: 'Receiving objects: 100% (142/142), 4.3 MiB | 5.2 MiB/s' },
    { kind: 'okline', text: '✔ 克隆完成' },
    { kind: 'cmd', text: 'cd clawd-pet', delayFrames: 12 },
    { kind: 'cmd', text: 'npm install', delayFrames: 10 },
    {
      kind: 'spinner',
      label: '正在安装依赖...',
      waitFrames: 60, // 2 秒 spinner
      doneText: '安装完成 (185 packages)',
    },
  ];

  return <TerminalScene title="终端" lines={lines} />;
};
