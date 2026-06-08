#!/usr/bin/env python3
"""Build Golden Chibi state GIFs from generated 4-frame sprite sheets.

Expected input files:
  typing-sheet.png    -> typing.gif
  building-sheet.png  -> building.gif, debugger.gif
  jump-sheet.png      -> jump.gif, happy.gif
  sleeping-sheet.png  -> sleeping.gif
  tea-sheet.png       -> reading.gif, groove.gif
  cute-sheet.png      -> notification.gif, conducting.gif
  peek-sheet.png      -> peek.gif
  error-sheet.png     -> error.gif, alert.gif
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

import numpy as np
from PIL import Image


PROJECT_SKIN = Path("/Users/jun/desktop-pet/assets/skins/golden-chibi")
USER_SKIN = Path("/Users/jun/.clawd/skins/golden-chibi")
CANVAS = 300


def parse_hex_color(value: str) -> tuple[int, int, int]:
    value = value.strip().lstrip("#")
    if len(value) != 6:
        raise ValueError("key color must be like #ff00ff")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def remove_key(im: Image.Image, key: tuple[int, int, int], threshold: int) -> Image.Image:
    rgba = im.convert("RGBA")
    arr = np.array(rgba)
    rgb = arr[:, :, :3].astype(np.int32)
    key_arr = np.array(key, dtype=np.int32)
    dist = np.sqrt(((rgb - key_arr) ** 2).sum(axis=2))
    alpha = arr[:, :, 3]
    alpha[dist <= threshold] = 0
    # Soften the edge a touch to avoid a colored fringe.
    alpha[(dist > threshold) & (dist <= threshold + 18)] = np.minimum(
        alpha[(dist > threshold) & (dist <= threshold + 18)], 120
    )
    arr[:, :, 3] = alpha
    out = Image.fromarray(arr, "RGBA")
    bbox = out.getbbox()
    return out.crop(bbox) if bbox else out


def split_sheet(path: Path, frames: int, key: tuple[int, int, int], threshold: int) -> list[Image.Image]:
    sheet = Image.open(path).convert("RGBA")
    frame_w = sheet.width // frames
    result = []
    for i in range(frames):
        box = (i * frame_w, 0, (i + 1) * frame_w if i < frames - 1 else sheet.width, sheet.height)
        result.append(remove_key(sheet.crop(box), key, threshold))
    return result


def fit_frame(
    sprite: Image.Image,
    max_w: int = 252,
    max_h: int = 262,
    bottom_pad: int = 18,
    scale: float | None = None,
) -> Image.Image:
    sprite = sprite.convert("RGBA")
    bbox = sprite.getbbox()
    if bbox:
        sprite = sprite.crop(bbox)
    if scale is None:
        scale = min(max_w / sprite.width, max_h / sprite.height, 1.0)
    sprite = sprite.resize(
        (max(1, round(sprite.width * scale)), max(1, round(sprite.height * scale))),
        Image.Resampling.LANCZOS,
    )
    frame = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    frame.alpha_composite(sprite, ((CANVAS - sprite.width) // 2, CANVAS - bottom_pad - sprite.height))
    return frame


def quantize(frames: list[Image.Image]) -> list[Image.Image]:
    converted = []
    for frame in frames:
        alpha = frame.getchannel("A")
        matte = Image.new("RGBA", frame.size, (255, 255, 255, 0))
        matte.alpha_composite(frame)
        pal = matte.convert("P", palette=Image.Palette.ADAPTIVE, colors=255)
        pal.paste(255, alpha.point(lambda a: 255 if a <= 5 else 0))
        pal.info["transparency"] = 255
        converted.append(pal)
    return converted


def save_gif(targets: list[Path], frames: list[Image.Image], duration: list[int]) -> None:
    qframes = quantize(frames)
    for target in targets:
        target.parent.mkdir(parents=True, exist_ok=True)
        qframes[0].save(
            target,
            save_all=True,
            append_images=qframes[1:],
            loop=0,
            duration=duration,
            disposal=2,
            transparency=255,
            optimize=False,
        )


def build_state(
    input_dir: Path,
    sheet_name: str,
    output_names: list[str],
    duration: list[int],
    key: tuple[int, int, int],
    threshold: int,
    bottom_pad: int,
    max_w: int = 252,
    max_h: int = 262,
    frame_indices: list[int] | None = None,
) -> None:
    sheet = input_dir / sheet_name
    if not sheet.exists():
        print(f"skip missing {sheet}")
        return
    sprites = split_sheet(sheet, 4, key, threshold)
    if frame_indices:
        sprites = [sprites[i] for i in frame_indices]
    max_sprite_w = max(sprite.width for sprite in sprites)
    max_sprite_h = max(sprite.height for sprite in sprites)
    # Use one scale for the whole sheet so animation frames do not pop larger/smaller.
    stable_scale = min(max_w / max_sprite_w, max_h / max_sprite_h, 1.0)
    frames = [fit_frame(frame, max_w=max_w, max_h=max_h, bottom_pad=bottom_pad, scale=stable_scale) for frame in sprites]
    targets = []
    for name in output_names:
        targets.extend([PROJECT_SKIN / f"{name}.gif", USER_SKIN / f"{name}.gif"])
    save_gif(targets, frames, duration)
    print(f"built {', '.join(output_names)} from {sheet}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input_dir", type=Path)
    parser.add_argument("--key", default="#ff00ff", help="flat background color to remove")
    parser.add_argument("--threshold", type=int, default=34)
    args = parser.parse_args()

    key = parse_hex_color(args.key)
    build_state(args.input_dir, "typing-sheet.png", ["typing"], [150, 150, 170, 170], key, args.threshold, 18, frame_indices=[1, 2, 3, 2])
    build_state(args.input_dir, "building-sheet.png", ["building", "debugger"], [170, 170, 190, 190], key, args.threshold, 18, frame_indices=[1, 2, 3, 2])
    build_state(args.input_dir, "jump-sheet.png", ["jump", "happy"], [110, 100, 110, 180], key, args.threshold, 18)
    build_state(args.input_dir, "sleeping-sheet.png", ["sleeping"], [500, 500, 500, 650], key, args.threshold, 26, 286, 220)
    build_state(args.input_dir, "tea-sheet.png", ["reading", "groove"], [220, 220, 260, 260], key, args.threshold, 18)
    build_state(args.input_dir, "cute-sheet.png", ["notification", "conducting"], [180, 180, 220, 260], key, args.threshold, 18)
    build_state(args.input_dir, "peek-sheet.png", ["peek"], [220, 220, 260, 300], key, args.threshold, 14)
    build_state(args.input_dir, "error-sheet.png", ["error", "alert"], [180, 180, 220, 260], key, args.threshold, 18)

    if PROJECT_SKIN.exists():
        USER_SKIN.mkdir(parents=True, exist_ok=True)
        manifest = PROJECT_SKIN / "manifest.json"
        if manifest.exists():
            shutil.copy2(manifest, USER_SKIN / "manifest.json")


if __name__ == "__main__":
    main()
