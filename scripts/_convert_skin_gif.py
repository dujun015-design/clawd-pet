#!/usr/bin/env python3
"""
把源 GIF 缩放到 110x110 透明画布。Pillow 会自动正确处理 GIF palette transparency。
用法: python3 _convert_skin_gif.py <input.gif> <output.gif> [target_size]
"""
import sys
from PIL import Image, ImageSequence

def remove_bg_color(rgba):
    """如果 GIF 用纯色 sentinel 当背景（Shepardskin 喜欢用 magenta），把它换成透明。
    采样四角像素，如果四角颜色一致且不透明，认为它是背景色。"""
    w, h = rgba.size
    px = rgba.load()
    corners = [px[0, 0], px[w-1, 0], px[0, h-1], px[w-1, h-1]]
    # 看四角是否同一颜色（容差 10）
    r0, g0, b0, a0 = corners[0]
    if a0 == 0:
        return rgba  # 已经是透明背景
    same = all(abs(c[0]-r0) < 10 and abs(c[1]-g0) < 10 and abs(c[2]-b0) < 10 for c in corners)
    if not same:
        return rgba  # 四角不一致，不动
    # 把这个颜色范围内的像素全部设透明
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if abs(r-r0) < 12 and abs(g-g0) < 12 and abs(b-b0) < 12:
                px[x, y] = (0, 0, 0, 0)
    return rgba

def convert(src, dst, target=110, content_max=100):
    img = Image.open(src)
    frames_out = []
    durations = []

    for frame in ImageSequence.Iterator(img):
        rgba = frame.convert("RGBA")
        rgba = remove_bg_color(rgba)
        w, h = rgba.size
        # 按最长边缩放到 content_max
        ratio = content_max / max(w, h)
        new_w = max(1, round(w * ratio))
        new_h = max(1, round(h * ratio))
        scaled = rgba.resize((new_w, new_h), Image.NEAREST)
        # 居中 pad 到 target x target 透明
        canvas = Image.new("RGBA", (target, target), (0, 0, 0, 0))
        canvas.paste(scaled, ((target - new_w) // 2, (target - new_h) // 2), scaled)
        frames_out.append(canvas)
        durations.append(frame.info.get("duration", 100))

    # 转回 P 模式（GIF 标准），保留透明
    palette_frames = []
    for f in frames_out:
        # Pillow GIF 透明：先转 P 模式，alpha 0 标记为 transparent index
        p = f.convert("RGBA")
        # 创建带 transparent 的 P 调色板
        bbox = p.getbbox()
        # 转 P 模式时显式处理 alpha
        # Pillow 8+ 的写法：直接 save 时传 transparency
        palette_frames.append(p)

    first = palette_frames[0]
    rest = palette_frames[1:]

    if rest:
        first.save(
            dst,
            save_all=True,
            append_images=rest,
            duration=durations,
            loop=0,
            disposal=2,           # restore to background = 透明
            optimize=False,
        )
    else:
        first.save(dst, optimize=False)

if __name__ == "__main__":
    src = sys.argv[1]
    dst = sys.argv[2]
    target = int(sys.argv[3]) if len(sys.argv) > 3 else 110
    convert(src, dst, target=target)
    print(f"  → {dst}")
