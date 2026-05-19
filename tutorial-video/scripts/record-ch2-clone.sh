#!/bin/bash
# 录制 Chapter 02: 下载项目
# - 在一个干净目录里 git clone + npm install
#
# 用法: bash record-ch2-clone.sh
# ⚠ 会在 ~/Desktop/clawd-demo 目录下操作（已存在会被删除）

set -e
OUT="$(cd "$(dirname "$0")/.." && pwd)/recordings/ch2-clone.mov"
DEMO_DIR="$HOME/Desktop/clawd-demo"
DUR=90

echo "=========================================="
echo "  Chapter 02: 下载项目"
echo "=========================================="
echo "  时长: ~${DUR}s（npm install 会占大头）"
echo "  输出: $OUT"
echo "  演示目录: $DEMO_DIR（会被重建）"
echo ""
echo "  录制前请把终端窗口放大、字号调大、放在屏幕中央"
echo ""
read -n 1 -p "  准备好按任意键开始 → "
echo ""

# 清理旧目录
rm -rf "$DEMO_DIR"
mkdir -p "$DEMO_DIR"

# 把命令写进文件，等会用 Terminal 一行行运行
SCRIPT_FILE="/tmp/clawd-ch2-commands.sh"
cat > "$SCRIPT_FILE" <<EOF
cd "$DEMO_DIR"
clear
sleep 1
echo "\$ git clone https://github.com/dujun015-design/clawd-pet.git"
sleep 1
git clone https://github.com/dujun015-design/clawd-pet.git
sleep 1
echo ""
echo "\$ cd clawd-pet"
cd clawd-pet
sleep 1
echo ""
echo "\$ npm install"
sleep 1
npm install
echo ""
echo "✅ 安装完成！"
EOF
chmod +x "$SCRIPT_FILE"

echo ""
echo "  3..."; sleep 1
echo "  2..."; sleep 1
echo "  1..."; sleep 1
echo "  ● 录制中"

screencapture -v -V$DUR "$OUT" &
REC_PID=$!

# 用 Terminal 打开并自动跑脚本
osascript <<APPLESCRIPT
tell application "Terminal"
  activate
  do script "bash $SCRIPT_FILE"
end tell
APPLESCRIPT

wait $REC_PID 2>/dev/null || true

echo ""
echo "  ✅ 录制完成 → $OUT"
