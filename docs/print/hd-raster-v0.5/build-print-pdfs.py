from __future__ import annotations

import json
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject
from reportlab.lib.pagesizes import portrait
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parent
OUTPUT_ROOT = ROOT / "print-master"
PDF_DIR = OUTPUT_ROOT / "pdf"
TMP_DIR = ROOT / "tmp" / "pdfs"

SPEC = json.loads((ROOT / "print-spec.json").read_text(encoding="utf-8"))
CARDS = json.loads((ROOT / "print-manifest.json").read_text(encoding="utf-8"))

PAGE_WIDTH = (SPEC["trimMm"]["width"] + SPEC["bleedMm"] * 2) * mm
PAGE_HEIGHT = (SPEC["trimMm"]["height"] + SPEC["bleedMm"] * 2) * mm
BLEED = SPEC["bleedMm"] * mm
SAFE = SPEC["safeMm"] * mm

BACK_FILES = {
    "race": OUTPUT_ROOT / "jpg" / "backs" / "verso-race.jpg",
    "tactic": OUTPUT_ROOT / "jpg" / "backs" / "verso-tactic.jpg",
    "decree": OUTPUT_ROOT / "jpg" / "backs" / "verso-decree.jpg",
}


def create_image_pdf(path: Path, images: list[Path], title: str) -> None:
    pdf = canvas.Canvas(
        str(path),
        pagesize=portrait((PAGE_WIDTH, PAGE_HEIGHT)),
        pageCompression=1,
    )
    pdf.setTitle(title)
    pdf.setAuthor("DemonLord")
    pdf.setSubject("Cartas Poker com sangria de 3 mm")
    pdf.setCreator("DemonLord Print Master")
    for image in images:
        pdf.drawImage(
            str(image),
            0,
            0,
            width=PAGE_WIDTH,
            height=PAGE_HEIGHT,
            preserveAspectRatio=False,
            mask=None,
        )
        pdf.showPage()
    pdf.save()


def apply_page_boxes(source: Path, destination: Path) -> None:
    reader = PdfReader(str(source))
    writer = PdfWriter()

    trim = RectangleObject(
        [BLEED, BLEED, PAGE_WIDTH - BLEED, PAGE_HEIGHT - BLEED]
    )
    safe = RectangleObject(
        [
            BLEED + SAFE,
            BLEED + SAFE,
            PAGE_WIDTH - BLEED - SAFE,
            PAGE_HEIGHT - BLEED - SAFE,
        ]
    )
    media = RectangleObject([0, 0, PAGE_WIDTH, PAGE_HEIGHT])

    for page in reader.pages:
        page.mediabox = media
        page.bleedbox = media
        page.cropbox = media
        page.trimbox = trim
        page.artbox = safe
        writer.add_page(page)

    metadata = reader.metadata or {}
    writer.add_metadata(
        {
            "/Title": metadata.get("/Title", "DemonLord Print Master"),
            "/Author": "DemonLord",
            "/Subject": "Poker 63,5 x 88,9 mm; sangria 3 mm",
            "/Creator": "DemonLord Print Master",
        }
    )
    with destination.open("wb") as stream:
        writer.write(stream)


def build_specification(path: Path) -> None:
    pdf = canvas.Canvas(str(path), pagesize=(210 * mm, 297 * mm))
    pdf.setTitle("DemonLord - Especificação gráfica")
    pdf.setAuthor("DemonLord")

    pdf.setFillColorRGB(0.08, 0.07, 0.06)
    pdf.rect(0, 0, 210 * mm, 297 * mm, fill=1, stroke=0)
    pdf.setFillColorRGB(0.95, 0.82, 0.45)
    pdf.setFont("Helvetica-Bold", 22)
    pdf.drawString(18 * mm, 272 * mm, "DEMONLORD - MESTRE GRÁFICO")

    lines = [
        ("Formato final", "Poker - 63,5 x 88,9 mm"),
        ("Sangria", "3 mm em todos os lados"),
        ("Pagina do PDF", "69,5 x 94,9 mm"),
        ("Área segura", "3 mm para dentro da linha de corte"),
        ("Raster mestre", "1642 x 2242 px a 600 dpi"),
        ("Cor", "sRGB IEC61966-2.1"),
        ("Frente e verso", "Mesma geometria e ordem correspondente"),
        ("Escala de impressão", "100% - não ajustar a página"),
    ]

    y = 247 * mm
    for label, value in lines:
        pdf.setFillColorRGB(0.72, 0.62, 0.39)
        pdf.setFont("Helvetica-Bold", 11)
        pdf.drawString(18 * mm, y, label.upper())
        pdf.setFillColorRGB(0.94, 0.91, 0.84)
        pdf.setFont("Helvetica", 11)
        pdf.drawString(72 * mm, y, value)
        y -= 12 * mm

    pdf.setFillColorRGB(0.94, 0.91, 0.84)
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(18 * mm, 132 * mm, "INSTRUÇÕES PARA A GRÁFICA")
    instructions = [
        "Usar TrimBox para o corte; BleedBox e MediaBox incluem a sangria.",
        "Não aplicar redimensionamento, margens automáticas ou ajuste à folha.",
        "Solicitar o perfil ICC da gráfica antes de qualquer conversão CMYK.",
        "A imposição e o espelhamento do verso ficam a cargo da gráfica.",
        "Realizar uma prova física antes de produzir o baralho completo.",
    ]
    y = 120 * mm
    pdf.setFont("Helvetica", 10.5)
    for index, instruction in enumerate(instructions, start=1):
        pdf.drawString(22 * mm, y, f"{index}. {instruction}")
        y -= 9 * mm

    pdf.setFillColorRGB(0.55, 0.49, 0.4)
    pdf.setFont("Helvetica", 9)
    pdf.drawString(
        18 * mm,
        24 * mm,
        "Mestres raster sem deformação; fundo prolongado até a sangria.",
    )
    pdf.save()


def main() -> None:
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)

    fronts = [
        OUTPUT_ROOT / "jpg" / "fronts" / f"{card['id'].lower()}-frente.jpg"
        for card in CARDS
    ]
    backs = [BACK_FILES[card["kind"]] for card in CARDS]

    front_tmp = TMP_DIR / "frentes-sem-boxes.pdf"
    back_tmp = TMP_DIR / "versos-sem-boxes.pdf"
    combined_tmp = TMP_DIR / "prova-duplex-sem-boxes.pdf"

    create_image_pdf(front_tmp, fronts, "DemonLord - Frentes")
    create_image_pdf(back_tmp, backs, "DemonLord - Versos")

    alternating = []
    for front, back in zip(fronts, backs, strict=True):
        alternating.extend([front, back])
    create_image_pdf(combined_tmp, alternating, "DemonLord - Prova duplex")

    apply_page_boxes(front_tmp, PDF_DIR / "DemonLord-frentes-print-master.pdf")
    apply_page_boxes(back_tmp, PDF_DIR / "DemonLord-versos-print-master.pdf")
    apply_page_boxes(combined_tmp, PDF_DIR / "DemonLord-prova-duplex.pdf")
    build_specification(PDF_DIR / "DemonLord-especificacao-grafica.pdf")

    print(
        f"PDFs gerados em {PDF_DIR}: "
        f"{len(fronts)} frentes, {len(backs)} versos e prova duplex."
    )


if __name__ == "__main__":
    main()
