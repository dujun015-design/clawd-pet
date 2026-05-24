#!/bin/bash
# 把 Shepardskin 的 CC0 像素 sprite zip 处理成 Clawd 多状态皮肤
# 每个 GIF 缩放到 110x110 透明画布（保持比例 + 居中 + 像素清晰）

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKINS_DIR="$ROOT/assets/skins"
SRC="/tmp/shepardskin-zips"

# 缩放 + 居中到 110x110，pixel-perfect
convert_gif() {
  local input="$1"
  local output="$2"
  ffmpeg -y -i "$input" -vf "\
scale='if(gt(iw,ih),100,-1)':'if(gt(iw,ih),-1,100)':flags=neighbor,\
pad=110:110:(110-iw)/2:(110-ih)/2:color=0x00000000,\
split[a][b];\
[a]palettegen=reserve_transparent=1[p];\
[b][p]paletteuse=alpha_threshold=128" \
    "$output" 2>/dev/null
}

# ── Chicken 🐔 ──
mkdir -p "$SKINS_DIR/chicken"
convert_gif "$SRC/chicken/chickenfrontstaticx4.gif" "$SKINS_DIR/chicken/idle.gif"
convert_gif "$SRC/chicken/chickenfrontwalkx4.gif"   "$SKINS_DIR/chicken/walk.gif"
convert_gif "$SRC/chicken/chickenfrontpeckx4.gif"   "$SKINS_DIR/chicken/typing.gif"
convert_gif "$SRC/chicken/chickenprofilepeckx4.gif" "$SKINS_DIR/chicken/reading.gif"
convert_gif "$SRC/chicken/chickenprofilestaticx4.gif" "$SKINS_DIR/chicken/thinking.gif"
convert_gif "$SRC/chicken/chickenfrontpeckx4.gif"   "$SKINS_DIR/chicken/building.gif"
convert_gif "$SRC/chicken/chickenbackstaticx4.gif"  "$SKINS_DIR/chicken/sleeping.gif"
cat > "$SKINS_DIR/chicken/manifest.json" <<EOF
{
  "name": "小鸡仔",
  "description": "CC0 像素小鸡，会啄食/走路/侧脸看你",
  "author": "Shepardskin",
  "license": "CC0",
  "source": "https://opengameart.org/content/chicken-sprites"
}
EOF
echo "✔ chicken"

# ── Kiwi 🥝 ──
mkdir -p "$SKINS_DIR/kiwi"
convert_gif "$SRC/kiwi/kiwifrontstaticx4.gif"   "$SKINS_DIR/kiwi/idle.gif"
convert_gif "$SRC/kiwi/kiwifrontwalkx4.gif"     "$SKINS_DIR/kiwi/walk.gif"
convert_gif "$SRC/kiwi/kiwiprofilewalkx4.gif"   "$SKINS_DIR/kiwi/typing.gif"
convert_gif "$SRC/kiwi/kiwiprofilestaticx4.gif" "$SKINS_DIR/kiwi/thinking.gif"
cat > "$SKINS_DIR/kiwi/manifest.json" <<EOF
{
  "name": "几维鸟",
  "description": "CC0 像素几维鸟，圆滚滚的小毛球",
  "author": "Shepardskin",
  "license": "CC0",
  "source": "https://opengameart.org/content/kiwi-sprites"
}
EOF
echo "✔ kiwi"

# ── Snake 🐍 ──
mkdir -p "$SKINS_DIR/snake"
convert_gif "$SRC/snake/snake1x3.gif"            "$SKINS_DIR/snake/idle.gif"
convert_gif "$SRC/snake/snake_walk_sidex3.gif"   "$SKINS_DIR/snake/walk.gif"
convert_gif "$SRC/snake/snake_walk_downx3.gif"   "$SKINS_DIR/snake/typing.gif"
convert_gif "$SRC/snake/snake_walk_upx3.gif"     "$SKINS_DIR/snake/happy.gif"
convert_gif "$SRC/snake/snakeblinkx3.gif"        "$SKINS_DIR/snake/sleeping.gif"
convert_gif "$SRC/snake/snake3x3.gif"            "$SKINS_DIR/snake/thinking.gif"
cat > "$SKINS_DIR/snake/manifest.json" <<EOF
{
  "name": "小蛇",
  "description": "CC0 像素小蛇，会爬会眨眼",
  "author": "Shepardskin",
  "license": "CC0",
  "source": "https://opengameart.org/content/snake-rpg-character"
}
EOF
echo "✔ snake"

# ── Dino 🦖 ──
mkdir -p "$SKINS_DIR/dino"
convert_gif "$SRC/dino/dino1x3.gif"             "$SKINS_DIR/dino/idle.gif"
convert_gif "$SRC/dino/dino_walk_sidex3.gif"    "$SKINS_DIR/dino/walk.gif"
convert_gif "$SRC/dino/dino_walk_downx3.gif"    "$SKINS_DIR/dino/typing.gif"
convert_gif "$SRC/dino/dino_walk_upx3.gif"      "$SKINS_DIR/dino/happy.gif"
convert_gif "$SRC/dino/dinoblinkx3.gif"         "$SKINS_DIR/dino/sleeping.gif"
convert_gif "$SRC/dino/dino3x3.gif"             "$SKINS_DIR/dino/thinking.gif"
cat > "$SKINS_DIR/dino/manifest.json" <<EOF
{
  "name": "小恐龙",
  "description": "CC0 像素小恐龙，桌上的史前萌物",
  "author": "Shepardskin",
  "license": "CC0",
  "source": "https://opengameart.org/content/dino-rpg-character"
}
EOF
echo "✔ dino"

# ── Dragon 🐉 ──
mkdir -p "$SKINS_DIR/dragon"
convert_gif "$SRC/Dragon/x2/GIF Animations/Dragon-anix2.gif"      "$SKINS_DIR/dragon/idle.gif"
convert_gif "$SRC/Dragon/x2/GIF Animations/Dragon-talk-anix2.gif" "$SKINS_DIR/dragon/typing.gif"
convert_gif "$SRC/Dragon/x2/GIF Animations/Dragon-tail-anix2.gif" "$SKINS_DIR/dragon/thinking.gif"
convert_gif "$SRC/Dragon/x2/GIF Animations/Dragon-anix2.gif"      "$SKINS_DIR/dragon/happy.gif"
cat > "$SKINS_DIR/dragon/manifest.json" <<EOF
{
  "name": "小龙",
  "description": "CC0 像素小龙，呼吸 + 摇尾巴 + 张嘴说话",
  "author": "Shepardskin",
  "license": "CC0",
  "source": "https://opengameart.org/content/dragon-character"
}
EOF
echo "✔ dragon"

# ── German Shepherd 🐕 ──
mkdir -p "$SKINS_DIR/shepherd"
convert_gif "$SRC/German Shepherd/x2/Shepherdwalk.gif" "$SKINS_DIR/shepherd/idle.gif"
convert_gif "$SRC/German Shepherd/x2/Shepherdwalk.gif" "$SKINS_DIR/shepherd/walk.gif"
convert_gif "$SRC/German Shepherd/x2/Shepherdrun.gif"  "$SKINS_DIR/shepherd/typing.gif"
convert_gif "$SRC/German Shepherd/x2/Shepherdrun.gif"  "$SKINS_DIR/shepherd/happy.gif"
convert_gif "$SRC/German Shepherd/x2/Shepherdbark.gif" "$SKINS_DIR/shepherd/annoyed.gif"
convert_gif "$SRC/German Shepherd/x2/Shepherdbark.gif" "$SKINS_DIR/shepherd/alert.gif"
cat > "$SKINS_DIR/shepherd/manifest.json" <<EOF
{
  "name": "德国牧羊犬",
  "description": "CC0 像素德牧，会走、跑、汪汪叫",
  "author": "Shepardskin",
  "license": "CC0",
  "source": "https://opengameart.org/content/german-shepherd-0"
}
EOF
echo "✔ shepherd"

echo ""
echo "✅ 完成，新增 6 个 Shepardskin 皮肤"
