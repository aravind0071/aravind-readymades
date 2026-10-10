import re

filepath = r"C:\Users\ADABALA SAI VAMSI\.gemini\antigravity-ide\brain\a0bc42ba-1e5e-4431-a743-32ad0083d5c3\.system_generated\steps\79\content.md"
with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

urls = re.findall(r'https?://[a-zA-Z0-9\.\-_/]+googleusercontent\.com/p/[a-zA-Z0-9\-_]+', text)
print("lh5/p urls:", len(urls))
for u in set(urls):
    print(u)

all_lh = re.findall(r'https?://lh[0-9]\.googleusercontent\.com/[^\s\"\'\<\>]+', text)
print("all lh urls:", len(all_lh))
for u in set(all_lh)[:20]:
    print(u)
