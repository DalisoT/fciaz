"""Verify the regenerated quotation content."""
from docx import Document

d = Document(r"C:\Users\RICHARD_TEMBO\Desktop\Projects\fciaz\docs\Manova-Labs-Quotation-FCIAZ-Website-2026.docx")

print("=== Payment table (table[4]) ===")
for row in d.tables[4].rows:
    cells = [c.text.strip()[:65] for c in row.cells]
    while len(cells) < 3:
        cells.append("")
    print(f"  | {cells[0]:<14} | {cells[1]:<10} | {cells[2]}")

print("\n=== Timeline (table[3]) ===")
for row in d.tables[3].rows:
    cells = [c.text.strip()[:80] for c in row.cells]
    while len(cells) < 2:
        cells.append("")
    print(f"  | {cells[0]:<10} | {cells[1]}")

print("\n=== Pricing note + intro (paragraphs 5-12) ===")
for i, p in enumerate(d.paragraphs[4:13]):
    if p.text.strip():
        print(f"  [{i+4}] {p.text[:130]}")
