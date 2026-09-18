import sys

file_path = "src/App.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove import
content = content.replace("import ErrorBoundary from './components/ErrorBoundary';\n", "")
content = content.replace("import ErrorBoundary from './components/ErrorBoundary';", "")

# Remove <ErrorBoundary> tags but keep what's inside
content = content.replace("<ErrorBoundary>", "")
content = content.replace("</ErrorBoundary>", "")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Removed ErrorBoundary from App.tsx")
