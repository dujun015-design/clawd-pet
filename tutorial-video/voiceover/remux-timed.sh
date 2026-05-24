#!/bin/bash
# 把每段 WAV 用 atempo 压缩到目标时长，再按时间轴 mix，最后 mux 进视频
# 这样不用重生成（保你的音色），只是节奏加快一点

set -e
VOICE_DIR="$(cd "$(dirname "$0")" && pwd)"

STARTS=(0  15 18 30 45 48 63 88 105 108 135)
IDS=(01-opening 02-chapter-prepare 03-nodejs 04-deepseek 05-chapter-run 06-clone 07-config 08-start 09-chapter-demo 10-demo 11-outro)
TARGETS=(15 3 12 15 3 15 25 17 3 27 15)  # 按索引对齐 IDS

mkdir -p "$VOICE_DIR/timed"

# 把 ratio 转成 atempo 链（atempo 单次只能 0.5-2.0，超过要链式）
atempo_chain() {
  local ratio="$1"
  # 用 awk 拆解
  awk -v r="$ratio" 'BEGIN {
    chain = ""
    while (r > 2.0) { chain = chain "atempo=2.0,"; r = r/2.0 }
    while (r < 0.5) { chain = chain "atempo=0.5,"; r = r/0.5 }
    chain = chain "atempo=" r
    print chain
  }'
}

echo "── 把每段压缩到目标时长 ──"
for i in "${!IDS[@]}"; do
  ID="${IDS[$i]}"
  TGT="${TARGETS[$i]}"
  ACTUAL=$(ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$VOICE_DIR/wavs/$ID.wav")
  TGT_USABLE=$(awk -v t="$TGT" 'BEGIN { print t - 0.2 }')
  RATIO=$(awk -v a="$ACTUAL" -v t="$TGT_USABLE" 'BEGIN { print a/t }')
  CHAIN=$(atempo_chain "$RATIO")
  printf "  %-25s  %.1fs → %ds  (×%.2f)\n" "$ID" "$ACTUAL" "$TGT" "$RATIO"
  ffmpeg -y -i "$VOICE_DIR/wavs/$ID.wav" -af "$CHAIN" "$VOICE_DIR/timed/$ID.wav" 2>/dev/null
done

echo ""
echo "── 拼接全长旁白 ──"
INPUTS=""
FILTER=""
for i in "${!IDS[@]}"; do
  ID="${IDS[$i]}"
  START_MS=$(( STARTS[$i] * 1000 ))
  INPUTS="$INPUTS -i $VOICE_DIR/timed/$ID.wav"
  FILTER="$FILTER [$i:a]adelay=${START_MS}|${START_MS}[a$i];"
done
MIX_INPUTS=""
for i in "${!IDS[@]}"; do
  MIX_INPUTS="$MIX_INPUTS [a$i]"
done
N="${#IDS[@]}"
FILTER="$FILTER ${MIX_INPUTS}amix=inputs=$N:duration=longest:normalize=0[mix]"

ffmpeg -y $INPUTS -filter_complex "$FILTER" -map "[mix]" \
  -t 150 -ac 2 -ar 44100 \
  "$VOICE_DIR/full-narration.wav" 2>&1 | tail -2

echo ""
echo "── mux 到视频 ──"
ffmpeg -y -i "$VOICE_DIR/../out/tutorial-v2.mp4" -i "$VOICE_DIR/full-narration.wav" \
  -map 0:v:0 -map 1:a:0 \
  -c:v copy -c:a aac -b:a 192k -ac 2 -ar 44100 -shortest \
  "$VOICE_DIR/../out/tutorial-v2-narrated.mp4" 2>&1 | tail -2

echo ""
echo "✅ → $VOICE_DIR/../out/tutorial-v2-narrated.mp4"
ffmpeg -i "$VOICE_DIR/../out/tutorial-v2-narrated.mp4" -af "volumedetect" -vn -f null /dev/null 2>&1 | grep -E "mean_volume|max_volume"
