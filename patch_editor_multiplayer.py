import sys
import re

file_path = "src/components/CodeEditor.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
import_old = """import { useProjects } from '../contexts/ProjectContext';"""
import_new = """import { useProjects } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { useMultiplayer } from '../hooks/useMultiplayer';"""
if import_old in content:
    content = content.replace(import_old, import_new)

# 2. Hooks injection
hooks_old = """const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);"""
hooks_new = """const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { currentProject } = useProjects();
  const { user } = useAuth();
  
  const { activeUsers, broadcastCodeChange } = useMultiplayer(
    currentProject?.id || null, 
    user, 
    code, 
    (newCode) => {
      // Quando recebemos código de outra pessoa, atualizamos a tela sem reenviar
      onCodeChange(newCode);
    }
  );"""
if hooks_old in content:
    content = content.replace(hooks_old, hooks_new)

# 3. Broadcasting on type
change_old = """  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onCodeChange(e.target.value);
    
    // Sync line numbers scroll
    if (editorRef.current && lineNumbersRef.current) {"""
change_new = """  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    onCodeChange(newCode);
    broadcastCodeChange(newCode); // Broadcast para os outros!
    
    // Sync line numbers scroll
    if (editorRef.current && lineNumbersRef.current) {"""
if change_old in content:
    content = content.replace(change_old, change_new)

# 4. Rendering the Avatars (Presence)
avatar_old = """          <div className="flex items-center space-x-2">
            {/* Viewport Toggle */}"""
avatar_new = """          <div className="flex items-center space-x-2">
            {/* Avatares Multiplayer */}
            {activeUsers.length > 0 && (
              <div className="flex items-center space-x-[-10px] mr-4 relative group" title={`${activeUsers.length} online`}>
                {activeUsers.slice(0, 3).map((u, i) => (
                  <div 
                    key={u.id} 
                    className={`w-8 h-8 rounded-full ${u.color} border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-lg z-${30-i}`}
                    title={u.name}
                  >
                    <span className="text-white text-xs font-bold">{u.name.charAt(0).toUpperCase()}</span>
                  </div>
                ))}
                {activeUsers.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center z-0">
                    <span className="text-gray-600 dark:text-gray-300 text-xs font-bold">+{activeUsers.length - 3}</span>
                  </div>
                )}
                
                {/* Ping Animation Indicator */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-900"></span>
                </span>
              </div>
            )}

            {/* Viewport Toggle */}"""
if avatar_old in content:
    content = content.replace(avatar_old, avatar_new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated CodeEditor.tsx with Multiplayer logic")
