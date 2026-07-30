#!/usr/bin/env python3
"""Compose the DemonLord box cover from reusable raster layers."""

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "docs" / "assets"
BOX_DIR = ASSETS / "box"
BRAND_DIR = ASSETS / "branding"

ILLUSTRATION = BOX_DIR / "demonlord-box-cover-illustration-v1.png"
MASCOT = BRAND_DIR / "demonlord-fera-rosto-logo-v1.png"
BACK_BRAND = (
    ROOT
    / "docs"
    / "print"
    / "hd-raster-v0.5"
    / "components"
    / "backs"
    / "common"
    / "brand-demonlord.png"
)
FRAME = (
    ROOT
    / "docs"
    / "print"
    / "hd-raster-v0.5"
    / "components"
    / "backs"
    / "common"
    / "frame-universal.png"
)

WORDMARK = BRAND_DIR / "demonlord-wordmark-transparente-v1.png"
LOCKUP = BRAND_DIR / "demonlord-logo-lockup-v1.png"
FINAL = BOX_DIR / "demonlord-box-cover-final-v1.png"

PRINT_WIDTH = 1772
PRINT_HEIGHT = 2362
TRIM_INSET = 71


def connected_components(mask, minimum_size=80):
    """Keep substantial dark shapes and discard parchment speckles."""
    width, height = mask.size
    pixels = mask.load()
    visited = bytearray(width * height)
    result = Image.new("L", (width, height), 0)
    result_pixels = result.load()

    for y in range(height):
        for x in range(width):
            index = y * width + x
            if visited[index] or pixels[x, y] == 0:
                continue

            queue = deque([(x, y)])
            visited[index] = 1
            component = []

            while queue:
                current_x, current_y = queue.popleft()
                component.append((current_x, current_y))
                for next_y in range(max(0, current_y - 1), min(height, current_y + 2)):
                    for next_x in range(max(0, current_x - 1), min(width, current_x + 2)):
                        next_index = next_y * width + next_x
                        if visited[next_index] or pixels[next_x, next_y] == 0:
                            continue
                        visited[next_index] = 1
                        queue.append((next_x, next_y))

            touches_crop_edge = any(
                point_x < 5
                or point_y < 5
                or point_x >= width - 5
                or point_y >= height - 5
                for point_x, point_y in component
            )
            if len(component) >= minimum_size and not touches_crop_edge:
                for point_x, point_y in component:
                    result_pixels[point_x, point_y] = 255

    return result


def extract_wordmark():
    source = Image.open(BACK_BRAND).convert("RGB")
    crop = source.crop((28, 176, 875, 358))
    grayscale = crop.convert("L")
    binary = grayscale.point(lambda value: 255 if value < 92 else 0)
    mask = connected_components(binary, minimum_size=95)
    mask = mask.filter(ImageFilter.GaussianBlur(0.45))

    bbox = mask.getbbox()
    if bbox is None:
        raise RuntimeError("Could not extract the DemonLord wordmark.")

    padding = 18
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(mask.width, bbox[2] + padding)
    bottom = min(mask.height, bbox[3] + padding)
    mask = mask.crop((left, top, right, bottom))

    black_outline = mask.filter(ImageFilter.MaxFilter(17))
    gold_outline = mask.filter(ImageFilter.MaxFilter(9))

    wordmark = Image.new("RGBA", mask.size, (0, 0, 0, 0))
    black_layer = Image.new("RGBA", mask.size, (20, 14, 12, 255))
    gold_layer = Image.new("RGBA", mask.size, (205, 154, 54, 255))
    cream_layer = Image.new("RGBA", mask.size, (247, 220, 156, 255))
    wordmark.alpha_composite(Image.composite(black_layer, Image.new("RGBA", mask.size), black_outline))
    wordmark.alpha_composite(Image.composite(gold_layer, Image.new("RGBA", mask.size), gold_outline))
    wordmark.alpha_composite(Image.composite(cream_layer, Image.new("RGBA", mask.size), mask))
    wordmark.save(WORDMARK, optimize=True)
    return wordmark


def contain(image, box):
    scale = min(box[0] / image.width, box[1] / image.height)
    size = (round(image.width * scale), round(image.height * scale))
    return image.resize(size, Image.Resampling.LANCZOS)


def build_lockup(wordmark):
    mascot = Image.open(MASCOT).convert("RGBA")
    mascot = contain(mascot, (390, 430))
    wordmark = contain(wordmark, (1080, 210))

    canvas = Image.new("RGBA", (1450, 470), (0, 0, 0, 0))
    mascot_x = 15
    mascot_y = (canvas.height - mascot.height) // 2
    wordmark_x = 345
    wordmark_y = 178

    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_mask = Image.new("L", canvas.size, 0)
    shadow_mask.paste(mascot.getchannel("A"), (mascot_x + 8, mascot_y + 12))
    shadow_mask.paste(wordmark.getchannel("A"), (wordmark_x + 8, wordmark_y + 12))
    shadow_mask = shadow_mask.filter(ImageFilter.GaussianBlur(9))
    shadow.paste((0, 0, 0, 175), (0, 0, canvas.width, canvas.height), shadow_mask)
    canvas.alpha_composite(shadow)
    canvas.alpha_composite(mascot, (mascot_x, mascot_y))
    canvas.alpha_composite(wordmark, (wordmark_x, wordmark_y))
    canvas.save(LOCKUP, optimize=True)
    return canvas


def build_cover(lockup):
    illustration = Image.open(ILLUSTRATION).convert("RGB")
    cover = ImageOps.fit(
        illustration,
        (PRINT_WIDTH, PRINT_HEIGHT),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    ).convert("RGBA")

    # A soft dark veil keeps the upper mark legible without flattening the art.
    veil = Image.new("RGBA", cover.size, (0, 0, 0, 0))
    gradient = Image.new("L", cover.size, 0)
    gradient_pixels = gradient.load()
    fade_end = 760
    for y in range(fade_end):
        alpha = round(142 * (1 - y / fade_end) ** 1.45)
        for x in range(cover.width):
            gradient_pixels[x, y] = alpha
    veil.paste((18, 10, 21, 180), (0, 0, cover.width, cover.height), gradient)
    cover.alpha_composite(veil)

    lockup = contain(lockup, (1320, 455))
    lockup_x = (PRINT_WIDTH - lockup.width) // 2
    lockup_y = 150
    cover.alpha_composite(lockup, (lockup_x, lockup_y))

    frame = Image.open(FRAME).convert("RGBA")
    trim_height = PRINT_HEIGHT - TRIM_INSET * 2
    frame = contain(frame, (PRINT_WIDTH - TRIM_INSET * 2, trim_height))
    frame_x = (PRINT_WIDTH - frame.width) // 2
    frame_y = (PRINT_HEIGHT - frame.height) // 2
    cover.alpha_composite(frame, (frame_x, frame_y))

    cover.convert("RGB").save(FINAL, dpi=(600, 600), optimize=True)


def main():
    BOX_DIR.mkdir(parents=True, exist_ok=True)
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    wordmark = extract_wordmark()
    lockup = build_lockup(wordmark)
    build_cover(lockup)
    print(WORDMARK)
    print(LOCKUP)
    print(FINAL)


if __name__ == "__main__":
    main()
