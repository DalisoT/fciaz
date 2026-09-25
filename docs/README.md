# docs/

Reference documents and scripts for the FCIAZ website engagement.

## Files

- `Manova-Labs-Quotation-FCIAZ-Website-2026.docx` — the editable quotation. Open in Word, update the names, dates, addresses, banking details and translation notes as needed.
- `build_quotation.py` — python-docx script that generated the quotation. Re-run after editing line-item totals (around lines 290–360).
- `verify_quotation.py` — print-summary helper that reads the DOCX back and prints each table.

## Editing prices

1. Open the DOCX in Word.
2. Adjust the **amounts** in the pricing table (Section 3) and the **trigger amounts** in the payment schedule (Section 5) to whatever the engagement actually needs.
3. If the **total** changes, also update the "Total: two hundred and thirty-six thousand Zambian Kwacha (K236,000)" sentence just below the pricing table.

## Regenerating from script

If you'd rather edit the source:

```bash
python docs/build_quotation.py
```

Requires `python-docx` (already installed in this environment).

## Converting to PDF

```powershell
# Word: File → Save As → PDF
# or via headless LibreOffice if installed:
soffice --headless --convert-to pdf docs/Manova-Labs-Quotation-FCIAZ-Website-2026.docx
```
