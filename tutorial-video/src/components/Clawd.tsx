import React from 'react';
import { staticFile } from 'remotion';

type Props = {
  state?:
    | 'idle'
    | 'happy'
    | 'typing'
    | 'thinking'
    | 'reading'
    | 'jump'
    | 'peek'
    | 'sleeping'
    | 'groove'
    | 'conducting';
  size?: number;
};

const GIF_MAP: Record<string, string> = {
  idle: 'clawd-idle.gif',
  happy: 'clawd-happy.gif',
  typing: 'clawd-typing.gif',
  thinking: 'clawd-thinking.gif',
  reading: 'clawd-idle-reading.gif',
  jump: 'clawd-react-double-jump.gif',
  peek: 'clawd-mini-peek.gif',
  sleeping: 'clawd-sleeping.gif',
  groove: 'clawd-headphones-groove.gif',
  conducting: 'clawd-conducting.gif',
};

export const Clawd: React.FC<Props> = ({ state = 'idle', size = 360 }) => {
  const gif = GIF_MAP[state] ?? GIF_MAP.idle;
  return (
    <img
      src={staticFile(`gif/${gif}`)}
      width={size}
      height={size}
      style={{
        imageRendering: 'pixelated',
        objectFit: 'contain',
      }}
    />
  );
};
