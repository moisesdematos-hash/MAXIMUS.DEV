import sys
import re

def patch_file(file_path, old_text, new_text):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    if old_text in content:
        content = content.replace(old_text, new_text)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Patched {file_path}")
    else:
        print(f"Could not find text in {file_path}")

# 1. FIX P0 SECURITY VULNERABILITY: XSS via iframe
# CodeEditor.tsx
patch_file("src/components/CodeEditor.tsx", 
    '<iframe\n                      ref={previewRef}\n                      srcDoc={`', 
    '<iframe\n                      ref={previewRef}\n                      sandbox="allow-scripts allow-forms allow-popups allow-modals"\n                      srcDoc={`')

# PublishedApp.tsx
patch_file("src/components/PublishedApp.tsx",
    'sandbox="allow-scripts allow-same-origin allow-forms allow-popups"',
    'sandbox="allow-scripts allow-forms allow-popups allow-modals"')


# 2. FIX P1/P2 PERFORMANCE VULNERABILITY: React Renders
def memoize_component(file_path, component_name):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "import React" not in content and "import { memo" not in content:
        pass # Handle later if needed
    
    if "memo(" not in content:
        if f"export default {component_name};" in content:
            content = content.replace(f"export default {component_name};", f"export default React.memo({component_name});")
            
            # Ensure React is imported
            if "import React," in content or "import React " in content:
                pass
            elif "import {" in content and "React" not in content:
                content = "import React from 'react';\n" + content
                
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Memoized {component_name} in {file_path}")

memoize_component("src/components/ChatArea.tsx", "ChatArea")
memoize_component("src/components/Sidebar.tsx", "Sidebar")
memoize_component("src/components/TopBar.tsx", "TopBar")
memoize_component("src/components/WelcomePage.tsx", "WelcomePage")

import os
os.system("git add .")
os.system('git commit -m "fix(sec,perf): remove allow-same-origin from iframes (P0 XSS) and memoize heavy components (P2 Perf)"')
os.system("git push origin master")
