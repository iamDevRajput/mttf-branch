import re, os
from pathlib import Path

SRC = Path(__file__).parent / "src"
FONT = "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');"

REPLACEMENTS = [
    (r"@import url\('https://fonts\.googleapis\.com/css2\?family=[^']+'\);", FONT),
    ("'DM Sans'", "'Plus Jakarta Sans'"),
    ('"DM Sans"', '"Plus Jakarta Sans"'),
    ("'Cormorant Garamond'", "'Plus Jakarta Sans'"),
    ('"Cormorant Garamond"', '"Plus Jakarta Sans"'),
    ("'Playfair Display'", "'Plus Jakarta Sans'"),
    ('"Playfair Display"', '"Plus Jakarta Sans"'),
    ("'Jost'", "'Plus Jakarta Sans'"),
    ('"Jost"', '"Plus Jakarta Sans"'),
    ("#C9A84C", "#2563eb"), ("#c9a84c", "#2563eb"),
    ("#E8C96A", "#60a5fa"), ("#E8C97A", "#60a5fa"),
    ("#B8965A", "#1d4ed8"), ("#B8960C", "#1d4ed8"),
    ("#F7F3EA", "#f8fafc"), ("#FBF6EC", "#f8fafc"),
    ("#FAF8F3", "#f8fafc"), ("#F2EDE4", "#f1f5f9"),
    ("#F7F5F0", "#f8fafc"), ("#F5EDD6", "#f8fafc"),
    ("#FDFAF4", "#ffffff"), ("#FAF7F2", "#f8fafc"),
    ("#FAF8F2", "#ffffff"), ("#FDFBF8", "#ffffff"),
    ("#FEFCF7", "#ffffff"), ("#EDE5CC", "#f1f5f9"),
    ("#E4D5A8", "#e2e8f0"), ("#E8E0CC", "#e2e8f0"),
    ("#E8E4DC", "#e2e8f0"), ("#1C1208", "#0f172a"),
    ("#1C1A17", "#0f172a"), ("#1A120A", "#0f172a"),
    ("#1C150A", "#0f172a"), ("#1A1614", "#0f172a"),
    ("#6B6560", "#64748b"), ("#8B7048", "#475569"),
    ("#7A6040", "#475569"), ("#8B8580", "#64748b"),
    ("#B0A898", "#94a3b8"), ("#8B6914", "#2563eb"),
    ("#5C7A2E", "#1d4ed8"), ("#9B4A1A", "#2563eb"),
    ("#6B3D8A", "#3b82f6"), ("#1A6B4A", "#1d4ed8"),
    ("rgba(201,168,76", "rgba(37, 99, 235"),
    ("rgba(139,109,56", "rgba(37, 99, 235"),
    ("rgba(139,112,72", "rgba(100, 116, 139"),
    ("--gold:", "--mttf-primary:"),
    ("--gold-light:", "--mttf-primary-light:"),
    ("--gold-pale:", "--mttf-primary-pale:"),
    ("--cream:", "--mttf-bg-alt:"),
    ("--beige:", "--mttf-border-light:"),
    ("--accent-yellow:", "--mttf-primary:"),
    ("--accent-yellow-light:", "--mttf-primary-light:"),
    ("--warm-white:", "--mttf-bg:"),
    ("--text-dark:", "--mttf-text:"),
    ("var(--gold)", "var(--mttf-primary)"),
    ("var(--gold-light)", "var(--mttf-primary-light)"),
    ("var(--gold-pale)", "var(--mttf-primary-pale)"),
    ("var(--cream)", "var(--mttf-bg-alt)"),
    ("var(--beige)", "var(--mttf-border-light)"),
    ("var(--warm-white)", "var(--mttf-bg)"),
    ("var(--text-dark)", "var(--mttf-text)"),
    ("var(--accent-yellow)", "var(--mttf-primary)"),
    ("var(--accent-yellow-light)", "var(--mttf-primary-light)"),
]

updated = []
for path in SRC.rglob("*.jsx"):
    text = path.read_text(encoding="utf-8")
    orig = text
    text = re.sub(REPLACEMENTS[0][0], REPLACEMENTS[0][1], text)
    for old, new in REPLACEMENTS[1:]:
        text = text.replace(old, new)
    if text != orig:
        path.write_text(text, encoding="utf-8")
        updated.append(str(path.relative_to(SRC.parent)))

css = SRC / "index.css"
text = css.read_text(encoding="utf-8")
orig = text
for old, new in REPLACEMENTS[1:]:
    text = text.replace(old, new)
if text != orig:
    css.write_text(text, encoding="utf-8")
    updated.append("src/index.css")

print(f"Updated {len(updated)} files:")
for f in sorted(updated):
    print(f"  {f}")
