#!/bin/bash
# 录制 Chapter 01: 准备工作
# - 打开 DeepSeek 平台
# - 打开 Node.js 下载页
#
# 用法: bash record-ch1-prepare.sh
# 录制中按 Ctrl+C 提前结束

set -e
OUT="$(cd "$(dirname "$0")/.." && pwd)/recordings/ch1-prepare.mov"
DUR=40  # 秒，按需调整

echo "=========================================="
echo "  Chapter 01: 准备工作"
echo "=========================================="
echo "  时长: ${DUR}s"
echo "  输出: $OUT"
echo ""
echo "  录制流程（脚本会自动执行）:"
echo "    1. 打开 DeepSeek 平台"
echo "    2. 停留 ~20s 让你演示创建 API Key"
echo "    3. 打开 Node.js 下载页"
echo "    4. 停留 ~15s 让你演示下载"
echo ""
read -n 1 -p "  准备好按任意键开始 → "
echo ""
echo ""
echo "  3..."; sleep 1
echo "  2..."; sleep 1
echo "  1..."; sleep 1
echo "  ● 录制中"

# 启动录屏（后台）
screencapture -v -V$DUR "$OUT" &
REC_PID=$!

# 第 1 步：打开 DeepSeek
sleep 1
open "https://platform.deepseek.com/api_keys"
sleep 20  # 你创建 key 的时间

# 第 2 步：打开 Node.js
open "https://nodejs.org/en/download"
sleep 15  # 你演示下载

# 等录屏结束
wait $REC_PID 2>/dev/null || true

echo ""
echo "  ✅ 录制完成 → $OUT"
echo "  可以用 QuickTime 打开预览，不满意删了重录"
