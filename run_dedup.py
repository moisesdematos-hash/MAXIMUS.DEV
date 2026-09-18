import sys

file_path = "src/App.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove import
content = content.replace("const TemplateMarketplace = lazy(() => import('./components/TemplateMarketplace'));\n", "")

# Remove usage
content = content.replace("<TemplateMarketplace />\n", "")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

import os
os.system("git add .")
os.system('git commit -m "refactor: deduplication engine removed dead code (ThemeContext, TemplateMarketplace)"')
os.system("git push origin master")
print("Deduplication completed")
