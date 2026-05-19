#!/bin/bash
# 把 Remotion 动画 + 三段录屏拼成最终视频
#
# 输入:
#   ../out/animations.mp4         (Remotion 输出, 26s, 1080x1920)
#   ../recordings/ch1-prepare.mov (40s, 2940x1912 横屏)
#   ../recordings/ch2-clone.mov   (~70s, 2940x1912)
#   ../recordings/ch3-config.mov  (~45s, 2940x1912)
#
# 输出: ../out/final.mp4

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/out"
REC_DIR="$ROOT/recordings"
TMP="$OUT_DIR/tmp"
mkdir -p "$TMP"

W=1080; H=1920; FPS=30

echo "=========================================="
echo "  拼接最终视频 (9:16 抖音/小红书格式)"
echo "=========================================="

# 1. 把横屏录屏转成 9:16 (背景模糊 + 居中前景)
#    模仿抖音/小红书常见 "vertical tutorial" 风格
convert_to_portrait() {
  local input="$1"
  local output="$2"
  echo "  → 转换 $(basename "$input")"
  ffmpeg -y -i "$input" -filter_complex "
    [0:v]split=2[bg][fg];
    [bg]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},gblur=sigma=25,eq=brightness=-0.15[bg2];
    [fg]scale=${W}:-1:flags=lanczos[fg2];
    [bg2][fg2]overlay=(W-w)/2:(H-h)/2,fps=${FPS}
  " -an -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p "$output" 2>&1 | tail -3
}

convert_to_portrait "$REC_DIR/ch1-prepare.mov" "$TMP/ch1.mp4"
convert_to_portrait "$REC_DIR/ch2-clone.mov"   "$TMP/ch2.mp4"
convert_to_portrait "$REC_DIR/ch3-config.mov"  "$TMP/ch3.mp4"

# 2. 把 Remotion 动画按时间点切成 4 段
#    时间线: 0-17s | 17-19s | 19-21s | 21-26s
echo "  → 切分动画"
split_anim() {
  local start="$1"; local end="$2"; local out="$3"
  ffmpeg -y -ss "$start" -to "$end" -i "$OUT_DIR/animations.mp4" \
    -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -r ${FPS} -an "$out" 2>&1 | tail -2
}
split_anim 0  17 "$TMP/anim-A.mp4"   # Intro + Showcase + Ch01
split_anim 17 19 "$TMP/anim-B.mp4"   # Ch02 卡
split_anim 19 21 "$TMP/anim-C.mp4"   # Ch03 卡
split_anim 21 26 "$TMP/anim-D.mp4"   # Outro

# 3. 拼接顺序: A → ch1 → B → ch2 → C → ch3 → D
cat > "$TMP/concat.txt" <<EOF
file '$TMP/anim-A.mp4'
file '$TMP/ch1.mp4'
file '$TMP/anim-B.mp4'
file '$TMP/ch2.mp4'
file '$TMP/anim-C.mp4'
file '$TMP/ch3.mp4'
file '$TMP/anim-D.mp4'
EOF

echo "  → 最终拼接"
ffmpeg -y -f concat -safe 0 -i "$TMP/concat.txt" -c copy "$OUT_DIR/final.mp4" 2>&1 | tail -3

# 清理
rm -rf "$TMP"

echo ""
echo "  ✅ 完成 → $OUT_DIR/final.mp4"
du -sh "$OUT_DIR/final.mp4"
