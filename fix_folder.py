import sys
import re

file_path = "src/components/ChatArea.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add Folder to the imports
import_old = """  Github,
  Mic
} from 'lucide-react';"""
import_new = """  Github,
  Mic,
  Folder
} from 'lucide-react';"""

content = content.replace(import_old, import_new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

import os
os.system("git add src/components/ChatArea.tsx")
os.system('git commit -m "fix: add missing Folder icon import in ChatArea"')
os.system("git push origin master")
print("Fixed Folder import in ChatArea.tsx and pushed")
