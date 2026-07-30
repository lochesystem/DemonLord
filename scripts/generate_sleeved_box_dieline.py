#!/usr/bin/env python3
"""Generate the DemonLord 76-card tuck-box and removable spacer dielines."""

from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib.pagesizes import A3, landscape
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PDF = ROOT / "output" / "pdf" / "demonlord-caixa-76-cartas-sleeves-dieline.pdf"
OUTPUT_SVG = ROOT / "docs" / "print" / "caixa-hd-sleeves"

MM = 72 / 25.4
PAGE_W_MM, PAGE_H_MM = 420, 297

COLORS = {
    "cut": "#302477",
    "crease": "#e33d3d",
    "bleed": "#54b948",
    "safe": "#c3932e",
    "guide": "#98938b",
    "ink": "#231f20",
    "muted": "#6e6962",
}


def mm(value):
    return value * MM


def pdf_point(origin_x, origin_y, x, y):
    return mm(origin_x + x), mm(PAGE_H_MM - origin_y - y)


def draw_pdf_polyline(pdf, origin_x, origin_y, points, color, width=0.45, dash=None):
    path = pdf.beginPath()
    first_x, first_y = pdf_point(origin_x, origin_y, *points[0])
    path.moveTo(first_x, first_y)
    for x, y in points[1:]:
        px, py = pdf_point(origin_x, origin_y, x, y)
        path.lineTo(px, py)
    pdf.setStrokeColor(color)
    pdf.setLineWidth(mm(width))
    pdf.setDash(*(dash or []))
    pdf.drawPath(path, stroke=1, fill=0)
    pdf.setDash()


def draw_pdf_bezier(pdf, origin_x, origin_y, commands, color, width=0.45, dash=None):
    path = pdf.beginPath()
    for command in commands:
        if command[0] == "M":
            path.moveTo(*pdf_point(origin_x, origin_y, command[1], command[2]))
        elif command[0] == "L":
            path.lineTo(*pdf_point(origin_x, origin_y, command[1], command[2]))
        elif command[0] == "C":
            c1 = pdf_point(origin_x, origin_y, command[1], command[2])
            c2 = pdf_point(origin_x, origin_y, command[3], command[4])
            end = pdf_point(origin_x, origin_y, command[5], command[6])
            path.curveTo(*c1, *c2, *end)
    pdf.setStrokeColor(color)
    pdf.setLineWidth(mm(width))
    pdf.setDash(*(dash or []))
    pdf.drawPath(path, stroke=1, fill=0)
    pdf.setDash()


def draw_pdf_rect(pdf, origin_x, origin_y, x, y, width, height, color, line=0.4, dash=None):
    left, bottom = pdf_point(origin_x, origin_y, x, y + height)
    pdf.setStrokeColor(color)
    pdf.setLineWidth(mm(line))
    pdf.setDash(*(dash or []))
    pdf.rect(left, bottom, mm(width), mm(height), stroke=1, fill=0)
    pdf.setDash()


def draw_pdf_text(pdf, x, y, text, size=9, color=COLORS["ink"], bold=False):
    pdf.setFillColor(color)
    pdf.setFont("Helvetica-Bold" if bold else "Helvetica", size)
    pdf.drawString(mm(x), mm(PAGE_H_MM - y), text)


def svg_polyline(points, cls):
    value = " ".join(f"{x},{y}" for x, y in points)
    return f'<polyline class="{cls}" points="{value}"/>'


def svg_path(commands, cls):
    data = " ".join(" ".join(map(str, command)) for command in commands)
    return f'<path class="{cls}" d="{data}"/>'


def svg_rect(x, y, width, height, cls):
    return f'<rect class="{cls}" x="{x}" y="{y}" width="{width}" height="{height}"/>'


def svg_text(x, y, text, cls="label", anchor="start"):
    return (
        f'<text class="{cls}" x="{x}" y="{y}" text-anchor="{anchor}">'
        f"{escape(text)}</text>"
    )


def main_box_geometry():
    cut_lines = [
        [(15, 62), (0, 66), (0, 152), (15, 156)],
        [(15, 62), (15, 17), (22, 17), (22, 10)],
        [(77, 10), (77, 17), (84, 17), (84, 62)],
        [(84, 62), (84, 24), (92, 17), (121, 17), (129, 24), (129, 62)],
        [(198, 62), (198, 24), (206, 17), (235, 17), (243, 24), (243, 156)],
        [(15, 156), (15, 191), (26, 191), (26, 198), (73, 198), (73, 191), (84, 191), (84, 156)],
        [(84, 156), (84, 189), (92, 196), (121, 196), (129, 189), (129, 156)],
        [(129, 156), (129, 201), (139, 192), (188, 192), (198, 201), (198, 156)],
        [(198, 156), (198, 189), (206, 196), (235, 196), (243, 189), (243, 156)],
    ]
    cut_beziers = [
        [
            ("M", 22, 10),
            ("C", 22, 3, 27, 0, 34, 0),
            ("L", 65, 0),
            ("C", 72, 0, 77, 3, 77, 10),
        ],
        [
            ("M", 129, 62),
            ("L", 156, 62),
            ("C", 156, 73, 171, 73, 171, 62),
            ("L", 198, 62),
        ],
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
    safe_rects = [
        (19, 66, 61, 86),
        (133, 66, 61, 86),
    ]
    labels = [
        (7.5, 109, "COLA", -90),
        (49.5, 111, "VERSO", 0),
        (106.5, 111, "LATERAL", 0),
        (163.5, 111, "FRENTE", 0),
        (220.5, 111, "LATERAL", 0),
        (49.5, 42, "TAMPA", 0),
        (49.5, 10, "ABA DE ENCAIXE", 0),
    ]
    return cut_lines, cut_beziers, crease_lines, safe_rects, labels


def spacer_geometry():
    cut_lines = [
        [(12, 0), (0, 5), (0, 87), (12, 92)],
        [(12, 0), (182, 0), (182, 92), (12, 92)],
    ]
    crease_lines = [
        [(12, 0), (12, 92)],
        [(79, 0), (79, 92)],
        [(97, 0), (97, 92)],
        [(164, 0), (164, 92)],
    ]
    labels = [
        (6, 48, "COLA", -90),
        (45.5, 48, "67 mm", 0),
        (88, 48, "18", 0),
        (130.5, 48, "67 mm", 0),
        (173, 48, "18", 0),
    ]
    return cut_lines, crease_lines, labels


def page_header(pdf, title, subtitle, page_number):
    draw_pdf_text(pdf, 18, 18, title, size=18, bold=True)
    draw_pdf_text(pdf, 18, 27, subtitle, size=9, color=COLORS["muted"])
    draw_pdf_text(pdf, 385, 18, f"{page_number}/2", size=9, color=COLORS["muted"])


def legend_pdf(pdf, x, y):
    entries = [
        ("Corte", COLORS["cut"], None),
        ("Vinco", COLORS["crease"], [4, 2]),
        ("Sangria 3 mm", COLORS["bleed"], [2, 2]),
        ("Área segura", COLORS["safe"], [3, 2]),
    ]
    for index, (label, color, dash) in enumerate(entries):
        yy = y + index * 8
        pdf.setStrokeColor(color)
        pdf.setLineWidth(mm(0.7))
        pdf.setDash(*(dash or []))
        pdf.line(mm(x), mm(PAGE_H_MM - yy), mm(x + 16), mm(PAGE_H_MM - yy))
        pdf.setDash()
        draw_pdf_text(pdf, x + 20, yy + 1, label, size=8)


def draw_main_pdf(pdf):
    page_header(
        pdf,
        "DemonLord - Tuck box para 76 cartas",
        "Capacidade: cartas Poker 63,5 x 88,9 mm em sleeves simples premium 66 x 91 mm",
        1,
    )
    origin_x, origin_y = 92, 47
    cut_lines, cut_beziers, crease_lines, safe_rects, labels = main_box_geometry()
    draw_pdf_rect(pdf, origin_x, origin_y, -3, -3, 249, 207, COLORS["bleed"], 0.45, [2, 2])
    for line in cut_lines:
        draw_pdf_polyline(pdf, origin_x, origin_y, line, COLORS["cut"], 0.55)
    for path in cut_beziers:
        draw_pdf_bezier(pdf, origin_x, origin_y, path, COLORS["cut"], 0.55)
    for line in crease_lines:
        draw_pdf_polyline(pdf, origin_x, origin_y, line, COLORS["crease"], 0.45, [4, 2])
    for rect in safe_rects:
        draw_pdf_rect(pdf, origin_x, origin_y, *rect, COLORS["safe"], 0.35, [3, 2])

    for x, y, label, _rotation in labels:
        draw_pdf_text(
            pdf,
            origin_x + x - len(label) * 0.9,
            origin_y + y,
            label,
            size=6.5,
            color=COLORS["guide"],
            bold=True,
        )

    draw_pdf_text(pdf, 18, 54, "DIMENSÕES INTERNAS", size=8, color=COLORS["muted"], bold=True)
    draw_pdf_text(pdf, 18, 64, "69 x 45 x 94 mm", size=13, bold=True)
    draw_pdf_text(pdf, 18, 76, "Cartão da caixa", size=8, color=COLORS["muted"])
    draw_pdf_text(pdf, 18, 84, "350 g / ~0,5 mm", size=9, bold=True)
    draw_pdf_text(pdf, 18, 98, "Folga para sleeves", size=8, color=COLORS["muted"])
    draw_pdf_text(pdf, 18, 106, "3 mm largura", size=9, bold=True)
    draw_pdf_text(pdf, 18, 114, "3 mm altura", size=9, bold=True)
    draw_pdf_text(pdf, 18, 128, "Profundidade útil", size=8, color=COLORS["muted"])
    draw_pdf_text(pdf, 18, 136, "45 mm", size=9, bold=True)
    legend_pdf(pdf, 18, 164)

    draw_pdf_text(pdf, 18, 218, "INSTRUÇÕES", size=8, color=COLORS["muted"], bold=True)
    instructions = [
        "1. Arte deve ultrapassar a linha de corte em 3 mm.",
        "2. Não posicionar textos fora das áreas seguras.",
        "3. Aplicar cola somente na aba marcada e no fechamento inferior.",
        "4. Confirmar tolerâncias e sentido das fibras com a gráfica.",
    ]
    for index, instruction in enumerate(instructions):
        draw_pdf_text(pdf, 18, 228 + index * 8, instruction, size=7.5)

    draw_pdf_text(
        pdf,
        92,
        270,
        "Gabarito vetorial em escala 1:1 - não redimensionar na impressão",
        size=7.5,
        color=COLORS["muted"],
    )
    draw_pdf_text(
        pdf,
        92,
        279,
        "Protótipo técnico: validar faca, compensação de dobra e fechamento com a gráfica antes da produção.",
        size=7.5,
        color=COLORS["muted"],
    )


def draw_spacer_pdf(pdf):
    page_header(
        pdf,
        "DemonLord - Espaçador removível",
        "Use dentro da caixa quando o baralho estiver sem sleeves",
        2,
    )
    origin_x, origin_y = 115, 80
    cut_lines, crease_lines, labels = spacer_geometry()
    draw_pdf_rect(pdf, origin_x, origin_y, -3, -3, 188, 98, COLORS["bleed"], 0.45, [2, 2])
    for line in cut_lines:
        draw_pdf_polyline(pdf, origin_x, origin_y, line, COLORS["cut"], 0.55)
    for line in crease_lines:
        draw_pdf_polyline(pdf, origin_x, origin_y, line, COLORS["crease"], 0.45, [4, 2])
    for x, y, label, _rotation in labels:
        draw_pdf_text(
            pdf,
            origin_x + x - len(label) * 0.9,
            origin_y + y,
            label,
            size=7,
            color=COLORS["guide"],
            bold=True,
        )

    draw_pdf_text(pdf, 18, 61, "PEÇA MONTADA", size=8, color=COLORS["muted"], bold=True)
    draw_pdf_text(pdf, 18, 72, "67 x 18 x 92 mm", size=13, bold=True)
    draw_pdf_text(pdf, 18, 88, "Função", size=8, color=COLORS["muted"])
    draw_pdf_text(pdf, 18, 97, "Preencher a folga", size=9, bold=True)
    draw_pdf_text(pdf, 18, 106, "do baralho sem sleeves", size=9, bold=True)
    legend_pdf(pdf, 18, 132)

    draw_pdf_text(pdf, 115, 191, "MONTAGEM", size=8, color=COLORS["muted"], bold=True)
    spacer_instructions = [
        "1. Corte no contorno azul.",
        "2. Vinque as quatro linhas vermelhas.",
        "3. Forme um tubo retangular e cole a aba de 12 mm por dentro.",
        "4. Posicione o tubo atrás das cartas sem sleeves.",
    ]
    for index, instruction in enumerate(spacer_instructions):
        draw_pdf_text(pdf, 115, 202 + index * 9, instruction, size=8)

    draw_pdf_text(
        pdf,
        115,
        252,
        "O espaçador é intencionalmente 2 mm menor que a caixa em largura e altura.",
        size=8,
        color=COLORS["muted"],
    )
    draw_pdf_text(
        pdf,
        115,
        262,
        "Pode ser produzido no mesmo cartão de 350 g ou em cartão kraft equivalente.",
        size=8,
        color=COLORS["muted"],
    )


def svg_document(title, subtitle, body, notes):
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="420mm" height="297mm" viewBox="0 0 420 297">
  <title>{escape(title)}</title>
  <desc>{escape(subtitle)}</desc>
  <style>
    .cut {{ fill: none; stroke: {COLORS['cut']}; stroke-width: .55; vector-effect: non-scaling-stroke; }}
    .crease {{ fill: none; stroke: {COLORS['crease']}; stroke-width: .45; stroke-dasharray: 4 2; vector-effect: non-scaling-stroke; }}
    .bleed {{ fill: none; stroke: {COLORS['bleed']}; stroke-width: .45; stroke-dasharray: 2 2; vector-effect: non-scaling-stroke; }}
    .safe {{ fill: none; stroke: {COLORS['safe']}; stroke-width: .35; stroke-dasharray: 3 2; vector-effect: non-scaling-stroke; }}
    .title {{ font: 700 7px Arial, sans-serif; fill: {COLORS['ink']}; }}
    .subtitle {{ font: 3.2px Arial, sans-serif; fill: {COLORS['muted']}; }}
    .label {{ font: 700 2.5px Arial, sans-serif; fill: {COLORS['guide']}; }}
    .note {{ font: 3px Arial, sans-serif; fill: {COLORS['ink']}; }}
  </style>
  <rect width="420" height="297" fill="white"/>
  <text class="title" x="18" y="18">{escape(title)}</text>
  <text class="subtitle" x="18" y="27">{escape(subtitle)}</text>
  {body}
  {notes}
</svg>
"""


def write_main_svg():
    origin_x, origin_y = 92, 47
    cut_lines, cut_beziers, crease_lines, safe_rects, labels = main_box_geometry()
    items = [
        f'<g id="dieline" transform="translate({origin_x} {origin_y})">',
        svg_rect(-3, -3, 249, 207, "bleed"),
    ]
    items.extend(svg_polyline(line, "cut") for line in cut_lines)
    items.extend(svg_path(path, "cut") for path in cut_beziers)
    items.extend(svg_polyline(line, "crease") for line in crease_lines)
    items.extend(svg_rect(*rect, "safe") for rect in safe_rects)
    items.extend(svg_text(x, y, label, "label", "middle") for x, y, label, _ in labels)
    items.append("</g>")
    notes = """
      <text class="note" x="18" y="58">INTERNO: 69 x 45 x 94 mm</text>
      <text class="note" x="18" y="68">CAPACIDADE: 76 cartas em sleeves 66 x 91 mm</text>
      <text class="note" x="18" y="78">MATERIAL: cartão 350 g / aproximadamente 0,5 mm</text>
      <text class="note" x="92" y="275">Escala 1:1. Validar faca e compensações com a gráfica antes da produção.</text>
    """
    return svg_document(
        "DemonLord - Tuck box para 76 cartas",
        "Dieline vetorial 1:1 com sleeves simples premium",
        "\n".join(items),
        notes,
    )


def write_spacer_svg():
    origin_x, origin_y = 115, 80
    cut_lines, crease_lines, labels = spacer_geometry()
    items = [
        f'<g id="spacer" transform="translate({origin_x} {origin_y})">',
        svg_rect(-3, -3, 188, 98, "bleed"),
    ]
    items.extend(svg_polyline(line, "cut") for line in cut_lines)
    items.extend(svg_polyline(line, "crease") for line in crease_lines)
    items.extend(svg_text(x, y, label, "label", "middle") for x, y, label, _ in labels)
    items.append("</g>")
    notes = """
      <text class="note" x="18" y="58">MONTADO: 67 x 18 x 92 mm</text>
      <text class="note" x="18" y="68">USO: preencher a folga do baralho sem sleeves</text>
      <text class="note" x="115" y="195">Dobre nas linhas vermelhas e cole a aba de 12 mm por dentro.</text>
    """
    return svg_document(
        "DemonLord - Espaçador removível",
        "Dieline vetorial 1:1 para uso sem sleeves",
        "\n".join(items),
        notes,
    )


def main():
    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_SVG.mkdir(parents=True, exist_ok=True)

    pdf = canvas.Canvas(str(OUTPUT_PDF), pagesize=landscape(A3), pageCompression=1)
    pdf.setTitle("DemonLord - Caixa para 76 cartas com sleeves")
    pdf.setAuthor("DemonLord")
    draw_main_pdf(pdf)
    pdf.showPage()
    draw_spacer_pdf(pdf)
    pdf.showPage()
    pdf.save()

    (OUTPUT_SVG / "dieline-caixa-76-cartas-sleeves.svg").write_text(
        write_main_svg(), encoding="utf-8"
    )
    (OUTPUT_SVG / "dieline-espacador-sem-sleeves.svg").write_text(
        write_spacer_svg(), encoding="utf-8"
    )

    print(OUTPUT_PDF)
    print(OUTPUT_SVG / "dieline-caixa-76-cartas-sleeves.svg")
    print(OUTPUT_SVG / "dieline-espacador-sem-sleeves.svg")


if __name__ == "__main__":
    main()
