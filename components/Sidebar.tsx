
import React from 'react';
import { ToolType } from '../types';
import { TOOLS } from '../constants';

interface SidebarProps {
  activeTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, onToolSelect }) => {
  return (
    <aside className="w-64 bg-secondary p-4 flex-shrink-0 hidden md:flex md:flex-col">
      <div className="flex items-center mb-8">
        <div className="bg-primary p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.423-1.423L13.25 18.5l1.188-.648a2.25 2.25 0 011.423-1.423L16.25 15.5l.648 1.188a2.25 2.25 0 011.423 1.423L19.5 18.5l-1.188.648a2.25 2.25 0 01-1.423 1.423z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold ml-3">Nexus AI</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        {(Object.keys(TOOLS) as ToolType[]).map((toolKey) => {
          const tool = TOOLS[toolKey];
          const isActive = activeTool === toolKey;
          return (
            <button
              key={toolKey}
              onClick={() => onToolSelect(toolKey)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-gray-700 hover:text-text-main'
              }`}
            >
              <span className="w-6 h-6 mr-3">{tool.icon}</span>
              <span>{tool.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
