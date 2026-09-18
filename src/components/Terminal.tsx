import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2 } from 'lucide-react';

interface TerminalProps {
  onClose?: () => void;
  onInstallPackage?: (pkgName: string) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onClose, onInstallPackage }) => {
  const [history, setHistory] = useState<{ type: 'input' | 'output' | 'system'; text: string; color?: string }[]>([
    { type: 'system', text: 'MAXIMUS NEURAL TERMINAL v2.0.0', color: 'text-blue-400' },
    { type: 'system', text: 'Type "help" to see available commands.', color: 'text-gray-400' }
  ]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Add input to history
    setHistory(prev => [...prev, { type: 'input', text: `$ ${trimmedCmd}` }]);

    const args = trimmedCmd.split(' ');
    const command = args[0].toLowerCase();

    setTimeout(() => {
      let outputText = '';
      let color = 'text-gray-300';

      switch (command) {
        case 'help':
          outputText = `Available commands:\n  npm install <pkg>  - Installs a package to the virtual environment\n  clear              - Clears the terminal\n  maximus deploy     - Triggers the deployment protocol\n  node -v            - Shows current Node version\n  date               - Shows system date`;
          break;
        case 'clear':
          setHistory([]);
          return;
        case 'node':
          if (args[1] === '-v') outputText = 'v20.11.0 (Virtual Node)';
          else outputText = 'Usage: node -v';
          break;
        case 'npm':
          if (args[1] === 'install' || args[1] === 'i') {
            const pkg = args[2];
            if (pkg) {
              outputText = `+ ${pkg}@latest\nadded 1 package in 1.2s\n\n(Virtual Package loaded into Maximus Preview)`;
              color = 'text-green-400';
              if (onInstallPackage) onInstallPackage(pkg);
            } else {
              outputText = 'npm ERR! missing package name';
              color = 'text-red-400';
            }
          } else {
            outputText = 'Usage: npm install <package>';
          }
          break;
        case 'maximus':
          if (args[1] === 'deploy') {
            outputText = 'Initiating deploy sequence... \nPlease use the UI Launchpad for full deployment.';
            color = 'text-blue-400';
          } else {
            outputText = 'Unknown maximus command.';
          }
          break;
        case 'date':
          outputText = new Date().toString();
          break;
        default:
          outputText = `bash: ${command}: command not found`;
          color = 'text-red-400';
      }

      setHistory(prev => [...prev, { type: 'output', text: outputText, color }]);
    }, 400); // Simulate processing time
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className={`flex flex-col bg-[#1e1e1e] border-t border-gray-800 shadow-2xl transition-all duration-300 ${isExpanded ? 'h-96' : 'h-48'}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-800">
        <div className="flex items-center space-x-2 text-gray-400">
          <TerminalIcon className="w-4 h-4" />
          <span className="text-xs font-mono uppercase tracking-wider">Terminal</span>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 hover:text-white transition-colors">
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-red-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        className="flex-1 overflow-y-auto p-4 font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, idx) => (
          <div key={idx} className="mb-1">
            {entry.type === 'input' ? (
              <div className="text-blue-300 font-semibold">{entry.text}</div>
            ) : (
              <div className={`whitespace-pre-wrap ${entry.color || 'text-gray-300'}`}>{entry.text}</div>
            )}
          </div>
        ))}
        
        {/* Input Row */}
        <div className="flex items-center mt-2">
          <span className="text-blue-400 font-semibold mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-gray-100 shadow-none focus:ring-0 p-0"
            spellCheck={false}
            autoComplete="off"
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
