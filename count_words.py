#!/usr/bin/env python3
import re
from pathlib import Path
from bs4 import BeautifulSoup

def count_words(html_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Count words (Spanish text)
    words = re.findall(r'\b[\w\u00C0-\u017F]+\b', text)
    return len(words)

# Check all clase files
clases_dir = Path('clases')
results = []

for i in range(1, 17):
    file_path = clases_dir / f'clase{i}.html'
    if file_path.exists():
        word_count = count_words(file_path)
        results.append((i, word_count))
        print(f"Clase {i}: {word_count} palabras")

print("\n--- Resumen ---")
total = sum(count for _, count in results)
print(f"Total de palabras: {total}")
print(f"Promedio por clase: {total/16:.0f}")
print(f"\nClases con menos de 4000 palabras:")
for num, count in results:
    if count < 4000:
        print(f"  Clase {num}: {count} palabras (faltan {4000-count})")
