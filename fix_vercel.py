import sys
import os

file_path = "vercel.json"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('"rewriteConfigs"', '"rewrites"')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

os.system("git add vercel.json")
os.system('git commit -m "fix: correct vercel.json rewrites property"')
os.system("git push origin master")
print("vercel.json fixed and pushed")
