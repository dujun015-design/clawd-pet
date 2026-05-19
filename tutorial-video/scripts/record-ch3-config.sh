#!/bin/bash
# 录制 Chapter 03: 配置运行
# - 用 echo 写一个示例配置（不含真实 key，避免出镜）
# - 演示 npm start 启动
#
# 用法: bash record-ch3-config.sh
# ⚠ 会临时改 ~/.clawd-config.json，录完会还原

set -e
OUT="$(cd "$(dirname "$0")/.." && pwd)/recordings/ch3-config.mov"
DEMO_DIR="$HOME/Desktop/clawd-demo/clawd-pet"
CONFIG="$HOME/.clawd-config.json"
BACKUP="$HOME/.clawd-config.json.bak"
DUR=45

echo "=========================================="
echo "  Chapter 03: 配置运行"
echo "=========================================="
echo "  时长: ~${DUR}s"
echo "  输出: $OUT"
echo ""
echo "  ⚠ 录制内会使用 'sk-演示key xxxx' 占位字符串"
echo "    你真实的 key 不会出镜（已自动备份还原）"
echo ""
if [ ! -d "$DEMO_DIR" ]; then
  echo "  ❌ 找不到 $DEMO_DIR"
  echo "  请先跑 record-ch2-clone.sh"
  exit 1
fi
echo ""
read -n 1 -p "  准备好按任意键开始 → "
echo ""

# 备份真实 config
[ -f "$CONFIG" ] && cp "$CONFIG" "$BACKUP"

SCRIPT_FILE="/tmp/clawd-ch3-commands.sh"
cat > "$SCRIPT_FILE" <<EOF
cd "$DEMO_DIR"
clear
sleep 1
echo "\$ # 创建配置文件"
sleep 1
echo "\$ cat > ~/.clawd-config.json <<JSON"
sleep 1
echo '{
  "provider": "deepseek",
  "apiKey": "sk-粘贴你自己的key"
}'
echo "JSON"
sleep 2

# 这里写入真实的（已备份），录屏上看到的是上面打印的占位
cat > "$CONFIG" <<INNER
$(cat "$BACKUP" 2>/dev/null || echo '{"provider":"deepseek","apiKey":"sk-PLACEHOLDER","model":"deepseek-chat"}')
INNER

sleep 1
echo ""
echo "\$ npm start"
sleep 1
npm start &
sleep 8
echo ""
echo "✅ Clawd 已经在桌面上啦！"
EOF
chmod +x "$SCRIPT_FILE"

echo ""
echo "  3..."; sleep 1
echo "  2..."; sleep 1
echo "  1..."; sleep 1
echo "  ● 录制中"

screencapture -v -V$DUR "$OUT" &
REC_PID=$!

osascript <<APPLESCRIPT
tell application "Terminal"
  activate
  do script "bash $SCRIPT_FILE"
end tell
APPLESCRIPT

wait $REC_PID 2>/dev/null || true

# 还原（其实上面 cat 已经写回真实内容了）
echo ""
echo "  ✅ 录制完成 → $OUT"
echo "  你的真实 config 已还原"

# 清理 Clawd 演示进程
pkill -f "electron.*clawd-pet" 2>/dev/null || true
