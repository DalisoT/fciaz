"""
Generate the Manova Labs quotation for the FCIAZ public website.

Outputs:
  C:\\Users\\RICHARD_TEMBO\\Desktop\\Projects\\fciaz\\docs\\Manova-Labs-Quotation-FCIAZ-Website-2026.docx
"""

from pathlib import Path
from datetime import date
from docx import Document
from docx.shared import Pt, Cm, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn, nsmap
from docx.oxml import OxmlElement


OUT_PATH = Path(
    r"C:\Users\RICHARD_TEMBO\Desktop\Projects\fciaz\docs\Manova-Labs-Quotation-FCIAZ-Website-2026.docx"
)

# ---------------------------------------------------------------------------
# Palette
# ---------------------------------------------------------------------------
PRIMARY = RGBColor(0x0F, 0x4C, 0x5C)   # brand-800 teal
ACCENT = RGBColor(0xBE, 0x34, 0x55)    # rose-600
TEXT = RGBColor(0x1F, 0x29, 0x37)      # slate-900
MUTED = RGBColor(0x64, 0x74, 0x8B)     # slate-500
LIGHT_BG = "F0F7F9"                    # brand-50
ACCENT_BG = "FDF2F4"                   # rose-50


# ---------------------------------------------------------------------------
# Low-level helpers
# ---------------------------------------------------------------------------
def set_cell_shading(cell, hex_color: str) -> None:
    """Fill a table cell with a hex background color."""
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tc_pr.append(shd)


def set_cell_borders(cell, color="CBD5E1", size="4") -> None:
    """Apply consistent borders to a cell."""
    tc_pr = cell._tc.get_or_add_tcPr()
    borders = OxmlElement("w:tcBorders")
    for edge in ("top", "left", "bottom", "right"):
        b = OxmlElement(f"w:{edge}")
        b.set(qn("w:val"), "single")
        b.set(qn("w:sz"), size)
        b.set(qn("w:color"), color)
        borders.append(b)
    tc_pr.append(borders)


def remove_cell_borders(cell) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    borders = OxmlElement("w:tcBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        b = OxmlElement(f"w:{edge}")
        b.set(qn("w:val"), "nil")
        borders.append(b)
    tc_pr.append(borders)


def add_run(paragraph, text, *, bold=False, italic=False, size=11,
            color=None, font="Calibri") -> None:
    run = paragraph.add_run(text)
    run.bold = bold
    run.italic = italic
    run.font.size = Pt(size)
    run.font.name = font
    rpr = run._element.get_or_add_rPr()
    rfonts = OxmlElement("w:rFonts")
    for attr in ("w:ascii", "w:hAnsi", "w:cs"):
        rfonts.set(qn(attr), font)
    rpr.append(rfonts)
    if color is not None:
        run.font.color.rgb = color


def write_paragraph(doc_or_cell, text="", *, style=None, size=11, bold=False,
                    color=None, align=None, space_before=0, space_after=4,
                    italic=False, line_spacing=1.25, font="Calibri"):
    p = doc_or_cell.add_paragraph(style=style)
    pf = p.paragraph_format
    pf.space_before = Pt(space_before)
    pf.space_after = Pt(space_after)
    pf.line_spacing = line_spacing
    if align is not None:
        p.alignment = align
    if text:
        add_run(p, text, bold=bold, italic=italic, size=size, color=color, font=font)
    return p


# ---------------------------------------------------------------------------
# Document setup
# ---------------------------------------------------------------------------
doc = Document()

# Page geometry (A4)
section = doc.sections[0]
section.page_height = Cm(29.7)
section.page_width = Cm(21.0)
section.left_margin = Cm(2.0)
section.right_margin = Cm(2.0)
section.top_margin = Cm(2.0)
section.bottom_margin = Cm(2.0)

# Body default font
style_normal = doc.styles["Normal"]
style_normal.font.name = "Calibri"
style_normal.font.size = Pt(11)
style_normal.font.color.rgb = TEXT

# ---------------------------------------------------------------------------
# Letterhead
# ---------------------------------------------------------------------------
hdr_table = doc.add_table(rows=1, cols=2)
hdr_table.autofit = False
hdr_table.columns[0].width = Cm(10.5)
hdr_table.columns[1].width = Cm(7.5)

left_cell, right_cell = hdr_table.rows[0].cells
left_cell.width = Cm(10.5)
right_cell.width = Cm(7.5)
remove_cell_borders(left_cell)
remove_cell_borders(right_cell)

# Left: Manova Labs wordmark
write_paragraph(left_cell, "")
mark = write_paragraph(left_cell, "", space_before=0, space_after=0)
add_run(mark, "● MANOVA", size=22, bold=True, color=PRIMARY)
add_run(mark, " LABS", size=22, bold=True, color=ACCENT)
write_paragraph(left_cell, "Software · Web · Civic Tech", size=10,
                color=MUTED, space_before=0, space_after=8, italic=True)
write_paragraph(left_cell, "Lusaka, Zambia", size=9, color=MUTED)
write_paragraph(left_cell, "info@manovalabs.co  ·  manovalabs.co",
                size=9, color=MUTED, space_after=0)

# Right: Quotation metadata
write_paragraph(right_cell, "")
p = write_paragraph(right_cell, "", align=WD_ALIGN_PARAGRAPH.RIGHT,
                    space_before=0, space_after=2)
add_run(p, "QUOTATION", size=22, bold=True, color=ACCENT)

meta_lines = [
    ("Quote no.", "ML-2026-0001"),
    ("Date", date.today().isoformat()),
    ("Valid until", (date.replace(date.today(), 2026, 12, 31) if False else date.fromisoformat("2026-12-31")).isoformat()),
    ("Currency", "ZMW (K)"),
]
for label, value in meta_lines:
    p = write_paragraph(right_cell, "", align=WD_ALIGN_PARAGRAPH.RIGHT,
                        space_before=0, space_after=0)
    add_run(p, f"{label}: ", size=10, color=MUTED)
    add_run(p, value, size=10, bold=True, color=TEXT)

# Divider
sep = write_paragraph(doc, "", space_before=4, space_after=4)
sep_pf = sep.paragraph_format
p_pr = sep._p.get_or_add_pPr()
p_bdr = OxmlElement("w:pBdr")
bottom = OxmlElement("w:bottom")
bottom.set(qn("w:val"), "single")
bottom.set(qn("w:sz"), "8")
bottom.set(qn("w:color"), "0F4C5C")
p_bdr.append(bottom)
p_pr.append(p_bdr)

# ---------------------------------------------------------------------------
# Bill-to block
# ---------------------------------------------------------------------------
bill = doc.add_table(rows=1, cols=2)
bill.autofit = False
bill.columns[0].width = Cm(11.5)
bill.columns[1].width = Cm(6.5)
left, right = bill.rows[0].cells
left.width = Cm(11.5)
right.width = Cm(6.5)
remove_cell_borders(left)
remove_cell_borders(right)

write_paragraph(left, "Bill to", size=9, bold=True, color=MUTED,
                space_before=2, space_after=2)
write_paragraph(left, "The Fistula and Childbirth Injuries",
                size=11, bold=True, color=TEXT, space_before=0, space_after=0)
write_paragraph(left, "Association of Zambia (FCIAZ)",
                size=11, bold=True, color=TEXT, space_before=0, space_after=2)
write_paragraph(left, "Office of the Publicity Secretary",
                size=10, color=MUTED, space_after=0)
write_paragraph(left, "Attn: Dr. Lucas Tembo, Publicity Secretary",
                size=10, color=MUTED, space_after=0)
write_paragraph(left, "info@fciaz.org.zm",
                size=10, color=MUTED, space_after=8)

write_paragraph(right, "Subject", size=9, bold=True, color=MUTED,
                align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=2, space_after=2)
p = write_paragraph(right, "", align=WD_ALIGN_PARAGRAPH.RIGHT,
                    space_before=0, space_after=2)
add_run(p, "Multilingual public website for FCIAZ",
        size=11, bold=True, color=TEXT)

# ---------------------------------------------------------------------------
# Salutation + Introduction
# ---------------------------------------------------------------------------
write_paragraph(doc, "Dear Dr. Kasanda and the FCIAZ Executive Committee,",
                size=11, space_before=8, space_after=6)

write_paragraph(
    doc,
    "Thank you for the opportunity to submit this quotation for the design and "
    "build of the FCIAZ public website. The scope covers a production-ready, "
    "trilingual (English · Icibemba · Chinyanja) website that supports the "
    "Association's Advocacy, Treatment and Rehabilitation mandate — including a "
    "donations page for bank and mobile-money channels, a self-hosted "
    "newsletter, enquiry and volunteer signup forms, and a stakeholder "
    "directory suitable for donor and government engagement.",
    size=11, space_after=6,
)
write_paragraph(
    doc,
    "This quotation is valid for thirty (30) days from the date of issue. "
    "Prices are quoted in Zambian Kwacha (ZMW). Hosting (Vercel free tier), "
    "the Supabase free tier, the official FCIAZ domain name, and any paid "
    "third-party service fees that FCIAZ elects to use are billed separately "
    "at cost by FCIAZ.",
    size=11, italic=True, color=MUTED, space_after=10,
)
write_paragraph(
    doc,
    "Pricing note: Manova Labs is providing this engagement at a "
    "founder-friendly rate in support of FCIAZ's mission. The total of "
    "K7,000 reflects the developer's discretionary contribution; comparable "
    "commercial website builds in Zambia are typically priced in the "
    "K180,000–K250,000 range. The reduction is applied uniformly across "
    "line items rather than as a separate discount line, so the pricing below "
    "reflects the actual effort on each component.",
    size=10.5, italic=True, color=MUTED, space_after=12,
)

# ---------------------------------------------------------------------------
# Section 1 — Project understanding
# ---------------------------------------------------------------------------
write_paragraph(doc, "1. Project understanding", size=14, bold=True,
                color=PRIMARY, space_before=6, space_after=6)
write_paragraph(
    doc,
    "FCIAZ is a newly constituted Zambian association addressing obstetric "
    "fistula and related childbirth injuries through Advocacy, Treatment and "
    "Rehabilitation. As Publicity Secretary, you require a credible, "
    "accessible web presence that:",
    size=11, space_after=4,
)
for bullet in [
    "introduces FCIAZ to the Zambian public, donors, professional bodies and the "
    "Ministry of Health;",
    "operates in the three working languages of Zambia — English, Icibemba and "
    "Chinyanja;",
    "channels donations through official bank and mobile-money options (MTN MoMo, "
    "Airtel Money, Zamtel Money);",
    "supports recruitment of volunteers and partner organisations;",
    "demonstrates professional governance in support of the Fistula Foundation "
    "grant application and PACRA registration.",
]:
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(2)
    add_run(p, bullet, size=11, color=TEXT)

# ---------------------------------------------------------------------------
# Section 2 — Scope of work / deliverables
# ---------------------------------------------------------------------------
write_paragraph(doc, "2. Scope of work and deliverables", size=14,
                bold=True, color=PRIMARY, space_before=12, space_after=6)

for h, items in [
    ("Information architecture and design", [
        "Information architecture for 11 page templates",
        "Responsive layout (mobile, tablet, desktop) following accessibility "
        "guidelines (WCAG 2.1 AA)",
        "Brand colour palette (deep teal · warm rose · gold) and typography system",
        "Logo lock-up and OG share image (placeholder; replaced when final "
        "artwork is delivered)",
    ]),
    ("Frontend build — eleven pages, three locales each", [
        "Home, About, What We Do, Stakeholders, Get Involved, Donate, Resources, "
        "News, Contact, Volunteer, plus a localised 404 page",
        "Sticky accessible header, language switcher (EN/BEM/NYA), mobile menu",
        "Footer with newsletter signup, quick links, social and contact details",
    ]),
    ("Donations page", [
        "Bank transfer section with bank, account, branch and SWIFT fields",
        "Three mobile-money providers — MTN MoMo, Airtel Money, Zamtel Money — "
        "each with its own 5-step send-money instructions and provider-specific "
        "icons",
        "Pending-bank-detail notice (auto-shown until the FCIAZ bank account is "
        "open)",
        "Other-ways-to-give section (in-kind, legacy, corporate)",
    ]),
    ("Forms and backend integrations", [
        "Self-hosted newsletter (Supabase) with duplicate detection and "
        "re-subscribe handling",
        "Contact form (writes to Supabase and emails the secretariat via Resend)",
        "Volunteer application form (writes to Supabase, notifies secretariat, "
        "acknowledges applicant)",
        "Server-side Zod validation; graceful failure when Supabase/Resend are "
        "not configured",
    ]),
    ("Multilingual support", [
        "next-intl locale routing under /en, /bem, /nya",
        "Draft translation files in all three languages (Bemba and Nyanja "
        "drafts to be verified by FCIAZ)",
        "Per-locale metadata and OpenGraph for SEO",
    ]),
    ("Stakeholder engagement", [
        "Stakeholders page grouped by Government, Professional bodies, "
        "Development partners, Academic, Media, Community",
        "Floating WhatsApp button linking to wa.me/<number>",
        "Social profiles in footer (Facebook, X, LinkedIn, Instagram, YouTube)",
    ]),
    ("SEO, accessibility and performance", [
        "Per-page metadata, OG image, robots.txt, semantic HTML",
        "Skip-to-content link, focus styles, accessible form labels",
        "Static pre-rendering of all 33 routes (11 × 3 locales)",
        "Search-engine-friendly slugs and language alternates",
    ]),
    ("Deployment and documentation", [
        "Vercel-ready build configuration (free tier)",
        "Setup documentation in .env.example covering Supabase, Resend, "
        "WhatsApp, bank and mobile-money details",
        "README with deployment, customisation and known-follow-ups section",
        "Supabase schema.sql with RLS policies for newsletter, volunteer and "
        "contact tables",
        "30-day post-launch support window for bug fixes and minor copy edits",
    ]),
]:
    write_paragraph(doc, h, size=12, bold=True, color=PRIMARY,
                    space_before=8, space_after=2)
    for item in items:
        p = doc.add_paragraph(style="List Bullet")
        p.paragraph_format.space_after = Pt(2)
        add_run(p, item, size=10.5, color=TEXT)

# ---------------------------------------------------------------------------
# Section 3 — Pricing
# ---------------------------------------------------------------------------
write_paragraph(doc, "3. Pricing", size=14, bold=True, color=PRIMARY,
                space_before=12, space_after=6)

# Itemized pricing table
items = [
    ("Discovery, architecture and responsive design",
     "Requirements workshop, sitemap, page specifications, component design, "
     "brand palette, accessibility baseline",
     "1,200"),
    ("Frontend build (11 pages, 3 locales, responsive)",
     "All public pages, header, footer, language switcher, mobile menu, "
     "sticky accessible navigation",
     "3,200"),
    ("Donations page — bank + MTN MoMo + Airtel Money + Zamtel Money",
     "Manual donations layout, per-provider step-by-step instructions, "
     "pending-bank-detail notice",
     "500"),
    ("Forms and backend (newsletter, contact, volunteer)",
     "Self-hosted Supabase storage, Resend transactional email, server actions "
     "with Zod validation, WhatsApp floating button",
     "800"),
    ("SEO, accessibility, performance, deployment",
     "Per-locale metadata, OG image, robots.txt, semantic HTML, static "
     "pre-rendering of 33 routes, Vercel setup",
     "800"),
    ("Documentation, handoff, and 30-day post-launch support",
     "README, .env.example, Supabase schema, hand-off notes, plus 30 days of "
     "bug fixes and minor copy edits after launch",
     "500"),
]

pricing = doc.add_table(rows=1 + len(items) + 2, cols=3)
pricing.alignment = WD_TABLE_ALIGNMENT.LEFT
pricing.autofit = False
pricing.columns[0].width = Cm(7.5)
pricing.columns[1].width = Cm(6.5)
pricing.columns[2].width = Cm(3.5)

# Header row
hr = pricing.rows[0]
hr.cells[0].width = Cm(7.5)
hr.cells[1].width = Cm(6.5)
hr.cells[2].width = Cm(3.5)
for i, label in enumerate(["Item", "Description", "Amount (K)"]):
    cell = hr.cells[i]
    set_cell_shading(cell, "0F4C5C")
    set_cell_borders(cell, color="0F4C5C", size="4")
    cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(4)
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT if i == 2 else WD_ALIGN_PARAGRAPH.LEFT
    add_run(p, label, size=10, bold=True, color=RGBColor(0xFF, 0xFF, 0xFF))

# Item rows
for r, (title, desc, amount) in enumerate(items, start=1):
    row = pricing.rows[r]
    row.cells[0].width = Cm(7.5)
    row.cells[1].width = Cm(6.5)
    row.cells[2].width = Cm(3.5)
    for cell in row.cells:
        set_cell_borders(cell, color="CBD5E1", size="4")
        cell.vertical_alignment = WD_ALIGN_VERTICAL.TOP

    p = row.cells[0].paragraphs[0]
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    add_run(p, title, size=10, bold=True, color=TEXT)

    p = row.cells[1].paragraphs[0]
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    add_run(p, desc, size=10, color=MUTED)

    p = row.cells[2].paragraphs[0]
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    add_run(p, amount, size=10, color=TEXT)

# Subtotal row
sub_idx = 1 + len(items)
sub_row = pricing.rows[sub_idx]
sub_row.cells[0].width = Cm(7.5)
sub_row.cells[1].width = Cm(6.5)
sub_row.cells[2].width = Cm(3.5)
for cell in sub_row.cells:
    set_cell_shading(cell, LIGHT_BG)
    set_cell_borders(cell, color="0F4C5C", size="4")
p = sub_row.cells[0].merge(sub_row.cells[1]).paragraphs[0]
p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
p.paragraph_format.space_before = Pt(3)
p.paragraph_format.space_after = Pt(3)
add_run(p, "Subtotal", size=10, bold=True, color=PRIMARY)
p = sub_row.cells[2].paragraphs[0]
p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
p.paragraph_format.space_before = Pt(3)
p.paragraph_format.space_after = Pt(3)
add_run(p, "7,000", size=10, bold=True, color=PRIMARY)

# Total row
total_row = pricing.rows[sub_idx + 1]
total_row.cells[0].width = Cm(7.5)
total_row.cells[1].width = Cm(6.5)
total_row.cells[2].width = Cm(3.5)
for cell in total_row.cells:
    set_cell_shading(cell, "0F4C5C")
    set_cell_borders(cell, color="0F4C5C", size="4")
p = total_row.cells[0].merge(total_row.cells[1]).paragraphs[0]
p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
p.paragraph_format.space_before = Pt(4)
p.paragraph_format.space_after = Pt(4)
add_run(p, "TOTAL", size=12, bold=True, color=RGBColor(0xFF, 0xFF, 0xFF))
p = total_row.cells[2].paragraphs[0]
p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
p.paragraph_format.space_before = Pt(4)
p.paragraph_format.space_after = Pt(4)
add_run(p, "K 7,000", size=12, bold=True, color=RGBColor(0xFF, 0xFF, 0xFF))

# Pricing total-in-words note
write_paragraph(doc, "", size=10, space_before=2, space_after=0)
note = write_paragraph(
    doc,
    "Total: seven thousand Zambian Kwacha (K7,000). This fee covers the "
    "developer's time and effort only and excludes VAT, hosting, and third-party "
    "service costs, which FCIAZ will cover separately.",
    size=10, italic=True, color=MUTED, space_before=6, space_after=8,
)

# ---------------------------------------------------------------------------
# Section 4 — Timeline
# ---------------------------------------------------------------------------
write_paragraph(doc, "4. Timeline", size=14, bold=True, color=PRIMARY,
                space_before=10, space_after=6)
write_paragraph(
    doc,
    "Most of the build is already complete. Following acceptance and the "
    "deposit, the remaining work (Supabase and Resend provisioning, Bemba and "
    "Nyanja copy review by FCIAZ, production deployment, and a one-round "
    "review window) can be finalised within two (2) weeks.",
    size=11, space_after=6,
)
timeline = doc.add_table(rows=3, cols=2)
timeline.autofit = False
timeline.columns[0].width = Cm(3.5)
timeline.columns[1].width = Cm(14.0)
rows = [
    ("Week 1", "FCIAZ reviews Bemba and Nyanja drafts; Supabase and Resend "
     "accounts are provisioned; donation details (bank and mobile money) are "
     "finalised for the /donate page"),
    ("Week 2", "Production deployment, final review window, and live launch"),
]
for i, (wk, body) in enumerate(rows):
    row = timeline.rows[i]
    row.cells[0].width = Cm(3.5)
    row.cells[1].width = Cm(14.0)
    set_cell_shading(row.cells[0], LIGHT_BG)
    set_cell_borders(row.cells[0], color="CBD5E1", size="4")
    set_cell_borders(row.cells[1], color="CBD5E1", size="4")
    p = row.cells[0].paragraphs[0]
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    add_run(p, wk, size=10, bold=True, color=PRIMARY)
    p = row.cells[1].paragraphs[0]
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    add_run(p, body, size=10, color=TEXT)

# ---------------------------------------------------------------------------
# Section 5 — Payment terms
# ---------------------------------------------------------------------------
write_paragraph(doc, "5. Payment terms", size=14, bold=True, color=PRIMARY,
                space_before=10, space_after=6)

payment_table = doc.add_table(rows=3, cols=3)
payment_table.autofit = False
payment_table.columns[0].width = Cm(4.0)
payment_table.columns[1].width = Cm(4.5)
payment_table.columns[2].width = Cm(9.0)
# header
hr = payment_table.rows[0]
hr.cells[0].width = Cm(4.0); hr.cells[1].width = Cm(4.5); hr.cells[2].width = Cm(9.0)
for i, label in enumerate(["Stage", "Amount (K)", "Trigger"]):
    cell = hr.cells[i]
    set_cell_shading(cell, "0F4C5C")
    set_cell_borders(cell, color="0F4C5C", size="4")
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    add_run(p, label, size=10, bold=True, color=RGBColor(0xFF, 0xFF, 0xFF))

payment_rows = [
    ("1 · On signing", "3,500", "On countersignature of this quotation"),
    ("2 · On launch", "3,500", "On production launch and acceptance of handoff"),
]
for i, (stage, amount, trigger) in enumerate(payment_rows, start=1):
    row = payment_table.rows[i]
    row.cells[0].width = Cm(3.5); row.cells[1].width = Cm(6.5); row.cells[2].width = Cm(7.5)
    for cell in row.cells:
        set_cell_borders(cell, color="CBD5E1", size="4")
    p = row.cells[0].paragraphs[0]
    p.paragraph_format.space_before = Pt(3); p.paragraph_format.space_after = Pt(3)
    add_run(p, stage, size=10, bold=True, color=TEXT)
    p = row.cells[1].paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p.paragraph_format.space_before = Pt(3); p.paragraph_format.space_after = Pt(3)
    add_run(p, amount, size=10, color=TEXT)
    p = row.cells[2].paragraphs[0]
    p.paragraph_format.space_before = Pt(3); p.paragraph_format.space_after = Pt(3)
    add_run(p, trigger, size=10, color=MUTED)

write_paragraph(
    doc,
    "All invoices are payable within seven (7) days of issue. Bank details "
    "will be provided on the invoice header. Late payments accrue interest at "
    "1.5% per month or part thereof.",
    size=10, italic=True, color=MUTED, space_before=6, space_after=6,
)

# ---------------------------------------------------------------------------
# Section 6 — Warranty
# ---------------------------------------------------------------------------
write_paragraph(doc, "6. Warranty and support", size=14, bold=True,
                color=PRIMARY, space_before=8, space_after=4)
for b in [
    "Thirty (30) days of post-launch bug-fix and minor copy-edit support at no "
    "additional cost.",
    "Bemba and Nyanja copy drafts are provided in good faith and are flagged "
    "for verification by FCIAZ before public launch. Translation review by a "
    "Bemba and Nyanja speaker is the responsibility of FCIAZ.",
    "Hosting (Vercel free tier), the Supabase free tier, Resend (if email is "
    "configured), and the official FCIAZ domain name are the responsibility of "
    "FCIAZ. Manova Labs will assist with initial setup at no additional cost.",
    "Out-of-scope feature requests after launch are quoted separately by "
    "mutual agreement.",
]:
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(2)
    add_run(p, b, size=10.5, color=TEXT)

# ---------------------------------------------------------------------------
# Section 7 — Terms
# ---------------------------------------------------------------------------
write_paragraph(doc, "7. Terms and conditions", size=14, bold=True,
                color=PRIMARY, space_before=8, space_after=4)
for b in [
    "All intellectual property created during the engagement transfers to "
    "FCIAZ upon receipt of full payment.",
    "Manova Labs may reference this engagement in case studies and portfolio "
    "materials, subject to FCIAZ's prior approval.",
    "Either party may terminate this engagement with seven (7) days written "
    "notice. Work completed to date is invoiced pro-rata.",
    "Confidentiality: any unpublished information shared by FCIAZ is treated "
    "as confidential and not disclosed without written consent.",
    "Governing law: the laws of the Republic of Zambia.",
]:
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(2)
    add_run(p, b, size=10.5, color=TEXT)

# ---------------------------------------------------------------------------
# Acceptance block
# ---------------------------------------------------------------------------
write_paragraph(doc, "8. Acceptance", size=14, bold=True, color=PRIMARY,
                space_before=12, space_after=4)
write_paragraph(
    doc,
    "FCIAZ's acceptance of this quotation may be signified by countersignature "
    "below, by signed letter on FCIAZ letterhead, or by payment of the deposit. "
    "Once accepted, the schedule above becomes a binding statement of work.",
    size=10.5, color=TEXT, space_after=10,
)

acc = doc.add_table(rows=1, cols=2)
acc.autofit = False
acc.columns[0].width = Cm(8.5)
acc.columns[1].width = Cm(8.5)
left, right = acc.rows[0].cells
left.width = Cm(8.5); right.width = Cm(8.5)
remove_cell_borders(left); remove_cell_borders(right)

# Left — Manova Labs
write_paragraph(left, "For and on behalf of Manova Labs",
                size=10, bold=True, color=PRIMARY, space_before=4, space_after=10)
write_paragraph(left, "Dr. Lucas Tembo", size=11, bold=True, color=TEXT,
                space_after=0)
write_paragraph(left, "Director, Manova Labs", size=10, color=MUTED,
                space_after=10)
write_paragraph(left, "Signature: ___________________________",
                size=10, color=TEXT, space_before=12, space_after=4)
write_paragraph(left, "Date: _______________________________",
                size=10, color=TEXT, space_after=2)

# Right — FCIAZ
write_paragraph(right, "For and on behalf of FCIAZ",
                size=10, bold=True, color=ACCENT, space_before=4, space_after=10)
write_paragraph(right, "Dr. Goshon Kasanda", size=11, bold=True, color=TEXT,
                space_after=0)
write_paragraph(right, "Chairperson, FCIAZ", size=10, color=MUTED,
                space_after=10)
write_paragraph(right, "Signature: ___________________________",
                size=10, color=TEXT, space_before=12, space_after=4)
write_paragraph(right, "Date: _______________________________",
                size=10, color=TEXT, space_after=2)

# Closing
write_paragraph(doc, "", size=10, space_before=10, space_after=2)
write_paragraph(
    doc,
    "We look forward to working with FCIAZ on this important step in the "
    "association's public presence.",
    size=10.5, color=TEXT, space_before=4, space_after=4,
)
p = write_paragraph(
    doc, "Warm regards,",
    size=10.5, color=TEXT, space_before=4, space_after=10,
)
write_paragraph(doc, "Dr. Lucas Tembo", size=11, bold=True, color=PRIMARY,
                space_after=0)
write_paragraph(doc, "Director, Manova Labs", size=10, color=MUTED,
                space_after=0)
write_paragraph(doc, "info@manovalabs.co", size=10, color=MUTED,
                space_after=0)

# ---------------------------------------------------------------------------
# Save
# ---------------------------------------------------------------------------
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
doc.save(OUT_PATH)

print(f"Wrote {OUT_PATH}")
print(f"Size: {OUT_PATH.stat().st_size} bytes")
