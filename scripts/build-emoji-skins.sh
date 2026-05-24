#!/bin/bash
# 从 Google Noto Emoji（CC-BY 4.0）拉动物 emoji 当 Clawd 皮肤
# 每个 skin 只放 idle.png + manifest，其余状态自动套 CSS 动画

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKINS_DIR="$ROOT/assets/skins"
NOTO_URL="https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512"

# 名字  | emoji | 中文名     | 描述
SKINS=(
  "cat|1f431|猫咪|橘黄小猫，最经典的桌宠"
  "dog|1f436|小狗|忠犬一只，永远开心"
  "fox|1f98a|狐狸|傲娇小狐狸"
  "rabbit|1f430|兔子|爱蹦跶的小白兔"
  "frog|1f438|青蛙|绿油油的吉祥物"
  "penguin|1f427|企鹅|永远在跳舞"
  "panda|1f43c|熊猫|国宝亲临你桌面"
  "chick|1f424|小鸡|刚出生的小毛球"
)

for entry in "${SKINS[@]}"; do
  IFS='|' read -r NAME CODE CN_NAME DESC <<< "$entry"
  DIR="$SKINS_DIR/$NAME"
  mkdir -p "$DIR"

  PNG="$DIR/idle.png"
  if [ ! -f "$PNG" ]; then
    echo "  → 下载 $NAME ($CN_NAME)..."
    curl -sS -o "$PNG" "$NOTO_URL/emoji_u$CODE.png"
  else
    echo "  ✔ $NAME (已存在)"
  fi

  cat > "$DIR/manifest.json" <<EOF
{
  "name": "$CN_NAME",
  "description": "$DESC",
  "author": "Google Noto Emoji",
  "license": "CC-BY 4.0",
  "source": "https://github.com/googlefonts/noto-emoji"
}
EOF
done

echo ""
echo "✅ 完成。新皮肤："
ls -1 "$SKINS_DIR" | grep -v clawd
