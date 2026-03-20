@@ .. @@
 import React, { useState } from 'react';
 import WelcomePage from './components/WelcomePage';
 import Sidebar from './components/Sidebar';
 import ChatArea from './components/ChatArea';
 import CodeEditor from './components/CodeEditor';
 import TopBar from './components/TopBar';
+import ResizableLayout from './components/ResizableLayout';
 import { useProjects } from './contexts/ProjectContext';

 function App() {
   const { currentProject, clearAllProjects } = useProjects();
   const [sidebarExpanded, setSidebarExpanded] = useState(false);
   const [generatedCode, setGeneratedCode] = useState('');
   const [showWelcome, setShowWelcome] = useState(true);

   // Load current project code when project changes
   React.useEffect(() => {
     if (currentProject && currentProject.code) {
       setGeneratedCode(currentProject.code);
     }
   }, [currentProject]);

   const handleCodeGenerated = (code: string) => {
     setGeneratedCode(code);
   };

   const handleCodeChange = (code: string) => {
     setGeneratedCode(code);
   };

   const handleGetStarted = () => {
     setShowWelcome(false);
   };

   const handleBackToWelcome = () => {
     setShowWelcome(true);
     setGeneratedCode('');
   };

   if (showWelcome) {
     return (
       <WelcomePage onGetStarted={handleGetStarted} />
     );
   }

   return (
     <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
       {/* Top Bar */}
       <TopBar onBackToWelcome={handleBackToWelcome} />
       
       {/* Main Layout */}
-      <div className="flex-1 flex overflow-hidden pt-12">
-        {/* Sidebar */}
-        <Sidebar 
-          isExpanded={sidebarExpanded} 
-          onToggle={setSidebarExpanded} 
-        />
-        
-        {/* Main Content */}
-        <div className="flex-1 flex overflow-hidden">
-          {/* Chat Area */}
-          <div className={`transition-all duration-300 ${
-            sidebarExpanded ? 'w-[calc(50%-10rem)]' : 'w-1/2'
-          }`}>
-            <ChatArea onCodeGenerated={handleCodeGenerated} />
-          </div>
-          
-          {/* Code Editor */}
-          <div className={`transition-all duration-300 ${
-            sidebarExpanded ? 'w-[calc(50%+10rem)]' : 'w-1/2'
-          }`}>
-            <CodeEditor 
-              code={generatedCode} 
-              onCodeChange={handleCodeChange} 
-            />
-          </div>
-        </div>
-      </div>
+      <ResizableLayout className="flex-1 pt-12">
+        <Sidebar 
+          isExpanded={sidebarExpanded} 
+          onToggle={setSidebarExpanded} 
+        />
+        <ChatArea onCodeGenerated={handleCodeGenerated} />
+        <CodeEditor 
+          code={generatedCode} 
+          onCodeChange={handleCodeChange} 
+        />
+      </ResizableLayout>
     </div>
   );
 }