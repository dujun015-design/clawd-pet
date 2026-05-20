#!/bin/bash
# 把 Remotion 动画 + Ch1 录屏 + 两张终端卡 拼成最终视频
#
# 输入:
#   ../out/animations.mp4         (Remotion 整片，26s 1080x1920)
#   ../out/clone-card.mp4         (Remotion 终端卡 ch2，15s)
#   ../out/config-card.mp4        (Remotion 终端卡 ch3，15s)
#   ../recordings/ch1-prepare.mov (40s, 横屏)
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
echo "  拼接最终视频 v2 (终端段全部动画化)"
echo "=========================================="

# 1. 全动画版：不再需要录屏，所有片段都是 Remotion

# 2. 切动画 4 段
#    新时间线: Intro 8s + Showcase 10s + Ch01 2s + Ch02 2s + Ch03 2s + Outro 8s = 32s
echo "  → 切分动画"
split_anim() {
  local start="$1"; local end="$2"; local out="$3"
  ffmpeg -y -ss "$start" -to "$end" -i "$OUT_DIR/animations.mp4" \
    -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -r ${FPS} -an "$out" 2>&1 | tail -2
}
split_anim 0  17 "$TMP/anim-A.mp4"   # Intro 5 + Showcase 10 + Ch01 2
split_anim 17 19 "$TMP/anim-B.mp4"   # Ch02 卡
split_anim 19 21 "$TMP/anim-C.mp4"   # Ch03 卡
split_anim 21 26 "$TMP/anim-D.mp4"   # Outro 5s

# 3. 终端卡转码统一参数（避免 concat 失败）
echo "  → 统一编码参数"
unify() {
  local input="$1"; local output="$2"
  ffmpeg -y -i "$input" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -r ${FPS} -an "$output" 2>&1 | tail -2
}
unify "$OUT_DIR/prepare-card.mp4" "$TMP/prepare.mp4"
unify "$OUT_DIR/clone-card.mp4"   "$TMP/clone.mp4"
unify "$OUT_DIR/config-card.mp4"  "$TMP/config.mp4"

# 4. 拼接: A → Prepare → B → Clone → C → Config → D
cat > "$TMP/concat.txt" <<EOF
file '$TMP/anim-A.mp4'
file '$TMP/prepare.mp4'
file '$TMP/anim-B.mp4'
file '$TMP/clone.mp4'
file '$TMP/anim-C.mp4'
file '$TMP/config.mp4'
file '$TMP/anim-D.mp4'
EOF

echo "  → 最终拼接"
ffmpeg -y -f concat -safe 0 -i "$TMP/concat.txt" -c copy "$OUT_DIR/final.mp4" 2>&1 | tail -3

rm -rf "$TMP"

echo ""
echo "  ✅ 完成 → $OUT_DIR/final.mp4"
du -sh "$OUT_DIR/final.mp4"
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUT_DIR/final.mp4" | awk '{printf "  时长: %.1f 秒\n", $1}'
