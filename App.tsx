
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TOOLS, DEFAULT_TOOL } from './constants';
import { ToolType } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(DEFAULT_TOOL);

  const ActiveToolComponent = TOOLS[activeTool].component;

  return (
    <div className="flex h-screen bg-background font-sans text-text-main">
      <Sidebar activeTool={activeTool} onToolSelect={setActiveTool} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <ActiveToolComponent />
        </div>
      </main>
    </div>
  );
};

export default App;
