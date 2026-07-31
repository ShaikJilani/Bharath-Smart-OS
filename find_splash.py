import os

with open('./src/App.tsx', 'r', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'showSplash' in line or 'splash' in line:
        print(f"{idx+1}: {line.strip()}")
