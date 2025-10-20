
import React, { useState, useCallback } from 'react';
import { generateCode } from '../services/geminiService';
import { Button } from './shared/Button';
import { Card } from './shared/Card';
import { TextArea } from './shared/Input';
import { Loader } from './shared/Loader';
import { TOOLS } from '../constants';
import { ToolType } from '../types';

const LANGUAGES = ['JavaScript', 'Python', 'TypeScript', 'Java', 'Go', 'HTML', 'CSS'];

const CodeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A React component for a button with a loading state.');
  const [language, setLanguage] = useState<string>('TypeScript');
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toolInfo = TOOLS[ToolType.CODE];

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setCode('');
    try {
      const generatedCode = await generateCode(prompt, language);
      setCode(generatedCode);
    } catch (e) {
      setError('Failed to generate code. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, language]);

  const handleCopy = useCallback(() => {
    if (code) {
      navigator.clipboard.writeText(code);
      // You could add a toast notification here for better UX
    }
  }, [code]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <span className="text-primary">{toolInfo.icon}</span>
        <div>
          <h1 className="text-2xl font-bold">{toolInfo.name}</h1>
          <p className="text-text-secondary">{toolInfo.description}</p>
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          <TextArea
            id="code-prompt"
            label="Code Description"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A python function to reverse a string..."
            rows={3}
            disabled={isLoading}
          />
          <div>
            <label htmlFor="language-select" className="block text-sm font-medium text-text-secondary mb-1">Language</label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isLoading}
              className="w-full sm:w-1/2 bg-secondary border border-gray-600 rounded-md p-2 text-text-main focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
          <Button onClick={handleGenerate} isLoading={isLoading} disabled={isLoading || !prompt} className="w-full sm:w-auto">
            Generate Code
          </Button>
        </div>
      </Card>
      
      {error && <div className="text-red-500 bg-red-900/20 p-3 rounded-md">{error}</div>}

      {isLoading && <Loader text="Writing your code..." />}
      
      {code && (
        <Card title={`Generated ${language} Snippet`}>
          <div className="relative">
            <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm max-h-96">
              <code>{code}</code>
            </pre>
            <Button onClick={handleCopy} variant="secondary" className="absolute top-2 right-2 px-2 py-1 text-xs">
              Copy
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CodeGenerator;
