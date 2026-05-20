#!/bin/bash
# 把 Remotion 用的 GIF 裁切成紧贴角色的尺寸
# 通用 bbox: x=50-243, y=103-275（200多 frames 实测）
# 取 220x220 (从 x=40,y=80 起)，保留少量边距

set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)/public/gif"
echo "处理目录: $DIR"

# crop=w:h:x:y
CROP="crop=220:220:40:80"

for f in "$DIR"/clawd-*.gif "$DIR"/mini-idle.gif; do
  [ -f "$f" ] || continue
  base=$(basename "$f")
  echo "  → $base"
  # GIF 裁切需要保留调色板：split + palettegen
  tmp="${f}.tmp.gif"
  ffmpeg -y -i "$f" -vf "${CROP},split [a][b];[a] palettegen [p];[b][p] paletteuse" "$tmp" 2>/dev/null
  mv "$tmp" "$f"
done

echo "✅ 完成"
