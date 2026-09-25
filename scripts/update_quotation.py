"""Update the FCIAZ quotation to add recurring operational costs and maintenance tiers.

Adds a new Section 4 before the existing Timeline (now renumbered to 5),
and updates the hosting provider references from Vercel to Cloudflare Workers
since we migrated during deployment.
"""
from __future__ import annotations

from pathlib import Path

from docx import Document
from docx.oxml.ns import qn

DOC_PATH = Path(r"C:\Users\RICHARD_TEMBO\Desktop\Projects\fciaz\docs\Manova-Labs-Quotation-FCIAZ-Website-2026.docx")


def find_para_starting_with(doc: Document, prefix: str):
    for p in doc.paragraphs:
        if p.text.startswith(prefix):
            return p
    return None


def replace_in_para(p, old: str, new: str) -> None:
    full = "".join(r.text for r in p.runs)
    if old not in full:
        return
    new_text = full.replace(old, new)
    for run in p.runs:
        run.text = ""
    if p.runs:
        p.runs[0].text = new_text
    else:
        p.add_run(new_text)


def set_para_text(p, text: str) -> None:
    for run in p.runs:
        run.text = ""
    if p.runs:
        p.runs[0].text = text
    else:
        p.add_run(text)


def main() -> None:
    doc = Document(DOC_PATH)

    # --- 1. Update hosting references: Vercel -> Cloudflare Workers ---
    p = find_para_starting_with(doc, "This quotation is valid")
    if p:
        replace_in_para(p, "Vercel free tier", "Cloudflare Workers free tier")

    p = find_para_starting_with(doc, "Vercel-ready build configuration")
    if p:
        replace_in_para(
            p,
            "Vercel-ready build configuration (free tier)",
            "Cloudflare Workers build configuration (free tier)",
        )

    p = find_para_starting_with(doc, "Hosting (Vercel free tier)")
    if p:
        replace_in_para(p, "Vercel free tier", "Cloudflare Workers free tier")

    # --- 2. Update timeline to note build is complete ---
    p = find_para_starting_with(doc, "Most of the build is already complete")
    if p:
        set_para_text(
            p,
            "The website build was completed on 25 September 2026 and is live on Cloudflare Workers. "
            "This section is retained for reference: had acceptance preceded deployment, the remaining work "
            "(Bemba and Nyanja copy review, final Cloudflare configuration, and one review window) would have been "
            "finalised within two (2) weeks.",
        )

    # --- 3. Renumber existing sections so the new one becomes Section 4 ---
    renumber = {
        "4. Timeline": "5. Timeline",
        "5. Payment terms": "6. Payment terms",
        "6. Warranty and support": "7. Warranty and support",
        "7. Terms and conditions": "8. Terms and conditions",
        "8. Acceptance": "9. Acceptance",
    }
    for old, new in renumber.items():
        p = find_para_starting_with(doc, old)
        if p:
            set_para_text(p, new)

    # --- 4. Insert new Section 4 before the (now) "5. Timeline" ---
    target = find_para_starting_with(doc, "5. Timeline") or find_para_starting_with(doc, "4. Timeline")
    if target is None:
        raise RuntimeError("Could not locate the Timeline anchor paragraph")

    target.insert_para_before = None  # ensure we use the python-docx API
    ins = target.insert_paragraph_before

    ins("4. Recurring operational costs and maintenance", style="Normal")
    ins(
        "After the build is paid for and the warranty window closes, FCIAZ will own a fully functional trilingual website. "
        "To keep it secure, current and discoverable, FCIAZ should budget for two ongoing streams: "
        "(a) the third-party infrastructure that hosts the site, and (b) optional annual maintenance and content support from Manova Labs. "
        "Both are detailed below.",
        style="Normal",
    )

    # 4.1 Infrastructure costs (table goes here)
    ins("4.1 Annual infrastructure costs", style="Normal")
    ins(
        "The following services are billed directly by their providers, not by Manova Labs. "
        "All items below are within the free tier of their respective providers as of the date of this quotation. "
        "Manova Labs will flag any move to a paid tier and obtain FCIAZ written approval before costs are incurred.",
        style="Normal",
    )

    # Build the infrastructure table at the end of the doc, then move it into place.
    infra = doc.add_table(rows=1, cols=3)
    infra.style = "Light Grid Accent 1"
    hdr = infra.rows[0].cells
    hdr[0].text = "Service"
    hdr[1].text = "Provider"
    hdr[2].text = "Estimated annual cost (ZMW)"
    for row_data in [
        (
            "Domain name (.org.zm)",
            "ZAMICA (Zambia NIC)",
            "K300 (FCIAZ pays ZAMICA directly at annual renewal)",
        ),
        (
            "Hosting - Cloudflare Workers free tier (100,000 requests/day, sufficient for ~1M page views/month)",
            "Cloudflare",
            "K0",
        ),
        (
            "Headless CMS - Sanity free tier (3 users, 10,000 documents)",
            "Sanity",
            "K0",
        ),
        (
            "Database - Supabase free tier (500 MB storage, 50,000 monthly active users)",
            "Supabase",
            "K0",
        ),
        (
            "Transactional email - Resend free tier (3,000 emails/month, 100/day)",
            "Resend",
            "K0",
        ),
        (
            "SSL/TLS certificate",
            "Cloudflare",
            "K0 (included)",
        ),
        (
            "Estimated annual infrastructure total",
            "-",
            "K300 (domain only)",
        ),
    ]:
        row = infra.add_row().cells
        for i, val in enumerate(row_data):
            row[i].text = val

    # Move the new table to sit between the 4.1 intro paragraph and 4.2.
    tbl_element = infra._tbl
    tbl_element.getparent().remove(tbl_element)
    target._p.addprevious(tbl_element)

    # 4.2 Maintenance packages
    ins("4.2 Annual maintenance packages", style="Normal")
    ins(
        "FCIAZ may opt into one of three maintenance tiers, or operate the site independently once the warranty window closes. "
        "All tiers assume an active working relationship with the FCIAZ Publicity Secretary and one named technical contact.",
        style="Normal",
    )

    for heading, bullets in [
        (
            "Foundation - K1,500 per year",
            [
                "Quarterly dependency updates and security patches (Next.js, Sanity, Supabase, Resend, Cloudflare Workers).",
                "Annual domain and DNS renewal coordination (FCIAZ pays ZAMICA directly).",
                "Continuous uptime monitoring with monthly summary reports.",
                "Quarterly backup verification for the Supabase database and Sanity content.",
                "Bug-fix response within thirty (30) days of report.",
            ],
        ),
        (
            "Standard (recommended) - K4,500 per year",
            [
                "Everything in Foundation.",
                "Up to twelve (12) content updates per year via Sanity Studio: news, events, resources, stakeholder additions.",
                "One half-day Sanity Studio training session for an FCIAZ staff member, with handover documentation.",
                "Quarterly content and SEO review with recommendations.",
                "Bug-fix response within seven (7) days of report.",
            ],
        ),
        (
            "Priority - K9,000 per year",
            [
                "Everything in Standard.",
                "Up to two (2) content updates per month via Sanity Studio.",
                "Annual clinical-accuracy review of the Bemba and Nyanja translations, in coordination with FCIAZ health advisors.",
                "Critical-bug response within twenty-four (24) hours.",
                "Up to eight (8) hours of small-feature work per year (UI tweaks, copy adjustments, integration additions).",
                "Monthly analytics and engagement report delivered to the Publicity Secretary.",
            ],
        ),
    ]:
        ins(heading, style="Normal")
        for b in bullets:
            ins(b, style="List Bullet")

    # 4.3 One-time services
    ins("4.3 Optional one-time services", style="Normal")

    for heading, body in [
        (
            "Sanity Studio training (in-person at FCIAZ offices, or remote): K1,500 per session.",
            "Includes handover documentation and one follow-up call. Recommended once FCIAZ is ready to publish content directly.",
        ),
        (
            "Bemba and Nyanja clinical translation review by a professional linguist: K3,000 per full-site pass.",
            "Optional but strongly recommended before the public launch. The draft translations in the current build are AI-assisted and require verification by a Bemba and Nyanja speaker with healthcare familiarity.",
        ),
        (
            "Custom feature development: K2,500 per developer-day.",
            "Quoted against a written specification. Common future features include additional languages, advanced search, member login, donor dashboards, and WhatsApp Business API integration.",
        ),
        (
            "Content migration from PDF archives or legacy systems: K1,000 per ten (10) content items.",
            "Includes metadata tagging and image cleanup where applicable.",
        ),
    ]:
        ins(heading, style="Normal")
        ins(body, style="Normal")

    ins(
        "All one-time services are quoted upfront and billed on completion. "
        "Manova Labs will not commence work without written approval from the FCIAZ secretariat.",
        style="Normal",
    )
    ins(
        "Maintenance packages renew annually and may be cancelled with thirty (30) days written notice. "
        "Manova Labs will provide a transparent quarterly activity report on any active package.",
        style="Normal",
    )

    # --- 5. Cross-reference the new Section 4 from the warranty section ---
    p = find_para_starting_with(doc, "Thirty (30) days of post-launch bug-fix")
    if p:
        full = "".join(r.text for r in p.runs)
        new_text = full + " After this window, FCIAZ may continue with one of the annual maintenance packages described in Section 4, or operate the site independently."
        set_para_text(p, new_text)

    doc.save(DOC_PATH)
    print(f"Saved: {DOC_PATH}")


if __name__ == "__main__":
    main()
