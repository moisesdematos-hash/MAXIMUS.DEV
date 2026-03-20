import React, { useState, useRef, useCallback } from 'react';
import { GripVertical, GripHorizontal, Maximize2, Minimize2 } from 'lucide-react';

interface ResizableLayoutProps {
  children: React.ReactNode[];
  className?: string;
}

const ResizableLayout: React.FC<ResizableLayoutProps> = ({ children, className = '' }) => {
  const [sidebarWidth, setSidebarWidth] = useState(320); // Largura inicial da sidebar
  const [chatWidth, setChatWidth] = useState(50); // Porcentagem do espaço restante
  const [isResizing, setIsResizing] = useState<'sidebar' | 'chat' | null>(null);
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);
  const [chatHeight, setChatHeight] = useState(50); // Para layout vertical
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarResizerRef = useRef<HTMLDivElement>(null);
  const chatResizerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((type: 'sidebar' | 'chat') => {
    setIsResizing(type);
    document.body.style.cursor = type === 'sidebar' ? 'col-resize' : isVerticalLayout ? 'row-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
  }, [isVerticalLayout]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    if (isResizing === 'sidebar') {
      const newWidth = Math.max(200, Math.min(500, e.clientX - containerRect.left));
      setSidebarWidth(newWidth);
    } else if (isResizing === 'chat') {
      if (isVerticalLayout) {
        const availableHeight = containerRect.height;
        const newHeight = Math.max(20, Math.min(80, ((e.clientY - containerRect.top) / availableHeight) * 100));
        setChatHeight(newHeight);
      } else {
        const availableWidth = containerRect.width - sidebarWidth;
        const chatAreaWidth = e.clientX - containerRect.left - sidebarWidth;
        const newChatWidth = Math.max(20, Math.min(80, (chatAreaWidth / availableWidth) * 100));
        setChatWidth(newChatWidth);
      }
    }
  }, [isResizing, sidebarWidth, isVerticalLayout]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const toggleLayout = () => {
    setIsVerticalLayout(!isVerticalLayout);
  };

  const resetLayout = () => {
    setSidebarWidth(320);
    setChatWidth(50);
    setChatHeight(50);
    setIsVerticalLayout(false);
  };

  const [sidebar, chatArea, codeEditor] = children;

  return (
    <div ref={containerRef} className={`flex overflow-hidden ${className}`}>
      {/* Sidebar */}
      <div 
        style={{ width: `${sidebarWidth}px` }}
        className="flex-shrink-0 relative"
      >
        {sidebar}
      </div>

      {/* Sidebar Resizer */}
      <div
        ref={sidebarResizerRef}
        onMouseDown={() => handleMouseDown('sidebar')}
        className="w-1 bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize transition-colors relative group"
      >
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-blue-500 text-white p-1 rounded shadow-lg">
            <GripVertical className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Layout Toggle Button */}
        <div className="absolute top-2 right-2 z-10 flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-1">
          <button
            onClick={toggleLayout}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title={isVerticalLayout ? 'Layout Horizontal' : 'Layout Vertical'}
          >
            {isVerticalLayout ? (
              <GripVertical className="w-4 h-4" />
            ) : (
              <GripHorizontal className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={resetLayout}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Resetar Layout"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {isVerticalLayout ? (
          /* Layout Vertical */
          <div className="flex flex-col w-full">
            {/* Chat Area */}
            <div 
              style={{ height: `${chatHeight}%` }}
              className="flex-shrink-0 overflow-hidden"
            >
              {chatArea}
            </div>

            {/* Vertical Resizer */}
            <div
              ref={chatResizerRef}
              onMouseDown={() => handleMouseDown('chat')}
              className="h-1 bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-row-resize transition-colors relative group"
            >
              <div className="absolute inset-x-0 -top-1 -bottom-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-blue-500 text-white p-1 rounded shadow-lg">
                  <GripHorizontal className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div 
              style={{ height: `${100 - chatHeight}%` }}
              className="flex-1 overflow-hidden"
            >
              {codeEditor}
            </div>
          </div>
        ) : (
          /* Layout Horizontal */
          <div className="flex w-full">
            {/* Chat Area */}
            <div 
              style={{ width: `${chatWidth}%` }}
              className="flex-shrink-0 overflow-hidden"
            >
              {chatArea}
            </div>

            {/* Horizontal Resizer */}
            <div
              ref={chatResizerRef}
              onMouseDown={() => handleMouseDown('chat')}
              className="w-1 bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-400 cursor-col-resize transition-colors relative group"
            >
              <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-blue-500 text-white p-1 rounded shadow-lg">
                  <GripVertical className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div 
              style={{ width: `${100 - chatWidth}%` }}
              className="flex-1 overflow-hidden"
            >
              {codeEditor}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResizableLayout;