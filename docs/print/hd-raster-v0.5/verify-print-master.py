from __future__ import annotations

import json
from pathlib import Path

from PIL import Image
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parent
OUTPUT_ROOT = ROOT / "print-master"
SPEC = json.loads((ROOT / "print-spec.json").read_text(encoding="utf-8"))
CARDS = json.loads((ROOT / "print-manifest.json").read_text(encoding="utf-8"))

EXPECTED_SIZE = (SPEC["canvasPx"]["width"], SPEC["canvasPx"]["height"])
EXPECTED_DPI = SPEC["dpi"]
EXPECTED_PAGE_PT = (
    (SPEC["trimMm"]["width"] + SPEC["bleedMm"] * 2) / 25.4 * 72,
    (SPEC["trimMm"]["height"] + SPEC["bleedMm"] * 2) / 25.4 * 72,
)
EXPECTED_TRIM_PT = (
    SPEC["trimMm"]["width"] / 25.4 * 72,
    SPEC["trimMm"]["height"] / 25.4 * 72,
)


def close(actual: float, expected: float, tolerance: float = 0.02) -> bool:
    return abs(actual - expected) <= tolerance


def verify_image(path: Path) -> None:
    with Image.open(path) as image:
        if image.size != EXPECTED_SIZE:
            raise AssertionError(f"{path.name}: tamanho {image.size}, esperado {EXPECTED_SIZE}")
        dpi = image.info.get("dpi", (0, 0))
        if not all(close(float(value), EXPECTED_DPI, 0.5) for value in dpi):
            raise AssertionError(f"{path.name}: DPI {dpi}, esperado {EXPECTED_DPI}")
        if image.mode not in {"RGB", "CMYK"}:
            raise AssertionError(f"{path.name}: modo {image.mode}; transparência não permitida")


def box_size(box) -> tuple[float, float]:
    return float(box.right - box.left), float(box.top - box.bottom)


def verify_pdf(path: Path, expected_pages: int) -> None:
    reader = PdfReader(str(path))
    if len(reader.pages) != expected_pages:
        raise AssertionError(
            f"{path.name}: {len(reader.pages)} páginas, esperado {expected_pages}"
        )
    for number, page in enumerate(reader.pages, start=1):
        page_size = box_size(page.mediabox)
        trim_size = box_size(page.trimbox)
        if not all(
            close(actual, expected)
            for actual, expected in zip(page_size, EXPECTED_PAGE_PT, strict=True)
        ):
            raise AssertionError(f"{path.name} p.{number}: MediaBox {page_size}")
        if not all(
            close(actual, expected)
            for actual, expected in zip(trim_size, EXPECTED_TRIM_PT, strict=True)
        ):
            raise AssertionError(f"{path.name} p.{number}: TrimBox {trim_size}")
        if list(page.bleedbox) != list(page.mediabox):
            raise AssertionError(f"{path.name} p.{number}: BleedBox divergente")


def main() -> None:
    front_images = [
        OUTPUT_ROOT / "png" / "fronts" / f"{card['id'].lower()}-frente.png"
        for card in CARDS
    ]
    back_images = sorted((OUTPUT_ROOT / "png" / "backs").glob("*.png"))

    for image in [*front_images, *back_images]:
        verify_image(image)

    verify_pdf(
        OUTPUT_ROOT / "pdf" / "DemonLord-frentes-print-master.pdf",
        len(CARDS),
    )
    verify_pdf(
        OUTPUT_ROOT / "pdf" / "DemonLord-versos-print-master.pdf",
        len(CARDS),
    )
    verify_pdf(
        OUTPUT_ROOT / "pdf" / "DemonLord-prova-duplex.pdf",
        len(CARDS) * 2,
    )

    print(
        "Print master válido: "
        f"{len(front_images)} frentes, {len(back_images)} versos, "
        f"{EXPECTED_SIZE[0]} x {EXPECTED_SIZE[1]} px a {EXPECTED_DPI} dpi."
    )


if __name__ == "__main__":
    main()
