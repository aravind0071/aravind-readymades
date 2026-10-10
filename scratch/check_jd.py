import re

with open(r'C:\Users\ADABALA SAI VAMSI\.gemini\antigravity-ide\brain\a0bc42ba-1e5e-4431-a743-32ad0083d5c3\.system_generated\steps\99\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

imgs = re.findall(r'https?://[^\s\"\'\<\>]+\.(?:jpg|jpeg|png|webp)', text)
found = []
for img in set(imgs):
    if not any(k in img.lower() for k in ['icon', 'logo', 'arrow', 'svg', 'thumb', 'button', 'badge', 'heart', 'star']):
        found.append(img)

print(f"Total images found: {len(found)}")
for img in found:
    print(img)
