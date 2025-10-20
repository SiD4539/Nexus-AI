import React from 'react';
import { ToolType } from './types';
import CodeGenerator from './components/CodeGenerator';
import CsvGenerator from './components/CsvGenerator';
import ImageGenerator from './components/ImageGenerator';
import ResumeBuilder from './components/ResumeBuilder';
import VideoGenerator from './components/VideoGenerator';

// A simple Icon component for embedded SVGs
const Icon = ({ path, className = 'w-6 h-6' }: { path: string; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

// Fix: Used React.ReactNode instead of JSX.Element to avoid namespace error.
export const TOOLS: Record<ToolType, { name: string; description: string; icon: React.ReactNode; component: React.FC }> = {
  [ToolType.IMAGE]: {
    name: 'Image Generator',
    description: 'Create stunning visuals from text descriptions.',
    icon: <Icon path="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z" />,
    component: ImageGenerator,
  },
  [ToolType.VIDEO]: {
    name: 'Video Creator',
    description: 'Bring your ideas to life with text-to-video and image-to-video generation.',
    icon: <Icon path="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />,
    component: VideoGenerator,
  },
  [ToolType.RESUME]: {
    name: 'Resume Builder',
    description: 'Craft a professional resume and export it as a PDF.',
    icon: <Icon path="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3.75A2.25 2.25 0 0018 1.5H6A2.25 2.25 0 003.75 3zM12 7.5h6m-6 3h6m-6 3h6m-9-6h.008v.008H3v-.008zM3 10.5h.008v.008H3v-.008zM3 13.5h.008v.008H3v-.008z" />,
    component: ResumeBuilder,
  },
  [ToolType.CSV]: {
    name: 'CSV Data Generator',
    description: 'Generate structured CSV data for any purpose.',
    icon: <Icon path="M3 13.5v-3h3v3H3zm4.5 0v-3h3v3h-3zm4.5 0v-3h3v3h-3zM3 9v-3h3v3H3zm4.5 0v-3h3v3h-3zm4.5 0v-3h3v3h-3zM3 4.5v-3h3v3H3zm4.5 0v-3h3v3h-3zm4.5 0v-3h3v3h-3zM16.5 4.5v15h3v-15h-3z" />,
    component: CsvGenerator,
  },
  [ToolType.CODE]: {
    name: 'Code Assistant',
    description: 'Generate code snippets in various programming languages.',
    icon: <Icon path="M6.75 7.5l3 2.25-3 2.25M11.25 7.5v4.5M16.5 7.5l-3 2.25 3 2.25M3 13.5a11.25 11.25 0 0118 0v2.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15.75V13.5z" />,
    component: CodeGenerator,
  },
};

export const DEFAULT_TOOL = ToolType.IMAGE;