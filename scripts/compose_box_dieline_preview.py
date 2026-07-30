#!/usr/bin/env python3
"""Compose the approved panel candidates on the 76-card tuck-box dieline."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
BOX = ROOT / "docs" / "assets" / "box"
PANELS = BOX / "panels"
OUTPUT = BOX / "demonlord-caixa-paineis-preview-v1.png"

PX_PER_MM = 10
PAGE_W_MM = 420
PAGE_H_MM = 297
ORIGIN_X_MM = 92
ORIGIN_Y_MM = 47
BLEED_PX = 71


def px(mm_value):
    return round(mm_value * PX_PER_MM)


def trim_panel(filename, width_mm, height_mm):
    image = Image.open(filename).convert("RGB")
    image = image.crop(
        (
            BLEED_PX,
            BLEED_PX,
            image.width - BLEED_PX,
            image.height - BLEED_PX,
        )
    )
    return image.resize(
        (px(width_mm), px(height_mm)),
        Image.Resampling.LANCZOS,
    )


def paste_panel(canvas, panel, local_x_mm, local_y_mm):
    canvas.paste(
        panel,
        (
            px(ORIGIN_X_MM + local_x_mm),
            px(ORIGIN_Y_MM + local_y_mm),
        ),
    )


def local_points(points):
    return [
        (
            px(ORIGIN_X_MM + point_x),
            px(ORIGIN_Y_MM + point_y),
        )
        for point_x, point_y in points
    ]


def main():
    canvas = Image.new(
        "RGB",
        (px(PAGE_W_MM), px(PAGE_H_MM)),
        "white",
    )
    draw = ImageDraw.Draw(canvas)

    back = trim_panel(PANELS / "verso-caixa-v1.png", 69, 94)
    side_primary = trim_panel(
        PANELS / "lateral-principal-caixa-v1.png",
        45,
        94,
    )
    front = trim_panel(
        BOX / "demonlord-box-cover-integrated-print-v2.png",
        69,
        94,
    )
    side_secondary = trim_panel(
        PANELS / "lateral-secundaria-caixa-v1.png",
        45,
        94,
    )
    top = trim_panel(PANELS / "tampa-caixa-v1.png", 69, 45)
    bottom = trim_panel(PANELS / "base-caixa-v1.png", 69, 45)

    paste_panel(canvas, back, 15, 62)
    paste_panel(canvas, side_primary, 84, 62)
    paste_panel(canvas, front, 129, 62)
    paste_panel(canvas, side_secondary, 198, 62)
    paste_panel(canvas, top, 15, 17)
    paste_panel(canvas, bottom, 129, 156)

    cut_lines = [
        [(15, 62), (0, 66), (0, 152), (15, 156)],
        [(15, 62), (15, 17), (22, 17), (22, 10)],
        [(77, 10), (77, 17), (84, 17), (84, 62)],
        [(84, 62), (84, 24), (92, 17), (121, 17), (129, 24), (129, 62)],
        [(198, 62), (198, 24), (206, 17), (235, 17), (243, 24), (243, 156)],
        [
            (15, 156),
            (15, 191),
            (26, 191),
            (26, 198),
            (73, 198),
            (73, 191),
            (84, 191),
            (84, 156),
        ],
        [(84, 156), (84, 189), (92, 196), (121, 196), (129, 189), (129, 156)],
        [(129, 156), (129, 201), (139, 192), (188, 192), (198, 201), (198, 156)],
        [(198, 156), (198, 189), (206, 196), (235, 196), (243, 189), (243, 156)],
    ]
    crease_lines = [
        [(15, 62), (15, 156)],
        [(84, 62), (84, 156)],
        [(129, 62), (129, 156)],
        [(198, 62), (198, 156)],
        [(15, 62), (129, 62)],
        [(198, 62), (243, 62)],
        [(15, 156), (243, 156)],
        [(22, 17), (77, 17)],
    ]

    for line in cut_lines:
        draw.line(local_points(line), fill="#302477", width=6, joint="curve")
    for line in crease_lines:
        points = local_points(line)
        start, end = points[0], points[-1]
        length = max(abs(end[0] - start[0]), abs(end[1] - start[1]))
        steps = max(1, length // 70)
        for index in range(steps):
            if index % 2:
                continue
            t0 = index / steps
            t1 = min(1, (index + 1) / steps)
            segment = [
                (
                    round(start[0] + (end[0] - start[0]) * t0),
                    round(start[1] + (end[1] - start[1]) * t0),
                ),
                (
                    round(start[0] + (end[0] - start[0]) * t1),
                    round(start[1] + (end[1] - start[1]) * t1),
                ),
            ]
            draw.line(segment, fill="#e33d3d", width=5)

    font_path = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
    title_font = ImageFont.truetype(font_path, 72)
    note_font = ImageFont.truetype(font_path, 32)
    draw.text((px(18), px(14)), "DemonLord — prévia dos painéis no gabarito", fill="#231f20", font=title_font)
    draw.text(
        (px(18), px(25)),
        "Linhas vermelhas = vincos · linhas azuis = corte · arte interna em escala proporcional",
        fill="#6e6962",
        font=note_font,
    )

    canvas.save(OUTPUT, dpi=(254, 254), optimize=True)
    print(OUTPUT)


if __name__ == "__main__":
    main()
