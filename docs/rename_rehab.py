"""
One-shot script to rename JSON keys and update values for the
Rehabilitation → Reintegration change across all three translation files.

Idempotent: safe to re-run.
"""
import json
from pathlib import Path

ROOT = Path(r"C:\Users\RICHARD_TEMBO\Desktop\Projects\fciaz\messages")

# ---------------------------------------------------------------------------
# Per-language value map (used to translate values, not just keys)
# ---------------------------------------------------------------------------
VALUE_REPLACEMENTS = {
    "en.json": {
        "Rehabilitation": "Reintegration",
        "rehabilitation": "reintegration",
        # Tagline literal
        "Advocacy. Treatment. Rehabilitation.": "Advocacy. Treatment. Reintegration.",
        "stat1Label_Core_pillars_advocacy_treatment_rehabilitation":
            "Core pillars \u2014 Advocacy, Treatment, Reintegration",
    },
    "bem.json": {
        "Rehabilitation": "Reintegration",
        "rehabilitation": "reintegration",
        "Ukushimikwa": "Ukuyambitsa",  # Bemba: rehabilitation → reintegration
        "ukushimikwa": "ukuyambitsa",
        # Bemba tagline
        "Ukutetekela. Imisangano. Ukushimikwa.":
            "Ukutetekela. Imisangano. Ukuyambitsa.",
    },
    "nya.json": {
        "Rehabilitation": "Reintegration",
        "rehabilitation": "reintegration",
        "Kuchira": "Kuyambitsidwa",  # Nyanja: recovery → reintegration
        "kuchira": "kuyambitsidwa",
        # Nyanja tagline
        "Kuthandiza. Chithandizo. Kuchira.":
            "Kuthandiza. Chithandizo. Kuyambitsidwa.",
    },
}

# Map old keys → new keys. Apply to all three files.
KEY_RENAMES = {
    "rehabTitle": "integrationTitle",
    "rehabTagline": "integrationTagline",
    "rehabBody": "integrationBody",
    "rehabPoint1": "integrationPoint1",
    "rehabPoint2": "integrationPoint2",
    "rehabPoint3": "integrationPoint3",
    "rehabPoint4": "integrationPoint4",
    "pillarRehabTitle": "pillarIntegrationTitle",
    "pillarRehabDescription": "pillarIntegrationDescription",
}


def rename_keys_recursive(node):
    """Walk a JSON-loaded structure and rename keys per KEY_RENAMES."""
    if isinstance(node, dict):
        return {
            KEY_RENAMES.get(k, k): rename_keys_recursive(v)
            for k, v in node.items()
        }
    if isinstance(node, list):
        return [rename_keys_recursive(v) for v in node]
    return node


def update_values_recursive(node, replacements):
    """Walk a JSON-loaded structure and replace string values per replacements."""
    if isinstance(node, dict):
        return {k: update_values_recursive(v, replacements) for k, v in node.items()}
    if isinstance(node, list):
        return [update_values_recursive(v, replacements) for v in node]
    if isinstance(node, str):
        out = node
        for old, new in replacements.items():
            if old in out:
                out = out.replace(old, new)
        return out
    return node


for fname in ("en.json", "bem.json", "nya.json"):
    p = ROOT / fname
    if not p.exists():
        print(f"SKIP missing: {p}")
        continue

    data = json.loads(p.read_text(encoding="utf-8"))

    # 1. Rename keys
    data = rename_keys_recursive(data)

    # 2. Update values
    data = update_values_recursive(data, VALUE_REPLACEMENTS[fname])

    out = json.dumps(data, indent=2, ensure_ascii=False)
    p.write_text(out, encoding="utf-8")
    print(f"Updated: {p}  ({len(out):,} bytes)")
