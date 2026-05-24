#!/bin/bash
# 用 F5-TTS 把 script.json 里每一段生成 WAV
# 然后按时间轴拼成完整旁白音轨，最后 mux 进视频

set -e

VOICE_DIR="$(cd "$(dirname "$0")" && pwd)"
OUT_DIR="$VOICE_DIR/wavs"
F5_CLI="/Users/jun/try/.venv-tts/bin/f5-tts_infer-cli"
REF_AUDIO="/Users/jun/try/public/audio/ref.m4a"

mkdir -p "$OUT_DIR"

# 1. 每段生成 WAV（已有的跳过，省时间）
echo "=========================================="
echo "  1/3 生成每段 TTS"
echo "=========================================="
jq -r '.segments[] | "\(.id)|\(.text)"' "$VOICE_DIR/script.json" | while IFS='|' read -r ID TEXT; do
  WAV="$OUT_DIR/$ID.wav"
  if [ -f "$WAV" ]; then
    echo "  ✔ $ID (已存在，跳过)"
    continue
  fi
  echo "  → 生成 $ID..."
  "$F5_CLI" \
    -r "$REF_AUDIO" \
    -t "$TEXT" \
    -o "$OUT_DIR" \
    -w "$ID.wav" \
    --remove_silence \
    --device mps \
    2>&1 | tail -3
done

echo ""
echo "=========================================="
echo "  2/3 按时间轴对齐 + 拼接全长旁白"
echo "=========================================="

# 时间轴：每段开始 (秒)
# 跟 TutorialV2.tsx 的 Series.Sequence 一一对应
declare -a STARTS=(0 15 18 30 45 48 63 88 105 108 135)
declare -a IDS=(01-opening 02-chapter-prepare 03-nodejs 04-deepseek 05-chapter-run 06-clone 07-config 08-start 09-chapter-demo 10-demo 11-outro)
TOTAL=150

# 用 ffmpeg adelay 把每段插到对应位置，再 amix
INPUTS=""
FILTER=""
for i in "${!IDS[@]}"; do
  ID="${IDS[$i]}"
  START_MS=$(( STARTS[$i] * 1000 ))
  INPUTS="$INPUTS -i $OUT_DIR/$ID.wav"
  FILTER="$FILTER [$i:a]adelay=${START_MS}|${START_MS},apad[a$i];"
done

# 拼 amix
MIX_INPUTS=""
for i in "${!IDS[@]}"; do
  MIX_INPUTS="$MIX_INPUTS [a$i]"
done
N="${#IDS[@]}"
FILTER="$FILTER ${MIX_INPUTS}amix=inputs=$N:duration=longest:normalize=0[mix]"

echo "  → 合成全长旁白音轨"
ffmpeg -y $INPUTS -filter_complex "$FILTER" -map "[mix]" \
  -t $TOTAL -ac 2 -ar 44100 \
  "$VOICE_DIR/full-narration.wav" 2>&1 | tail -3

echo ""
echo "=========================================="
echo "  3/3 mux 旁白到视频"
echo "=========================================="

VIDEO_IN="$VOICE_DIR/../out/tutorial-v2.mp4"
VIDEO_OUT="$VOICE_DIR/../out/tutorial-v2-narrated.mp4"

ffmpeg -y -i "$VIDEO_IN" -i "$VOICE_DIR/full-narration.wav" \
  -map 0:v:0 -map 1:a:0 \
  -c:v copy -c:a aac -b:a 192k -ac 2 -ar 44100 -shortest \
  "$VIDEO_OUT" 2>&1 | tail -3

echo ""
echo "  ✅ 完成 → $VIDEO_OUT"
du -sh "$VIDEO_OUT"
