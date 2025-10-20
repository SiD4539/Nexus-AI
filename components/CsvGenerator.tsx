
import React, { useState, useCallback } from 'react';
import { generateCsv } from '../services/geminiService';
import { downloadFile } from '../utils/fileUtils';
import { Button } from './shared/Button';
import { Card } from './shared/Card';
import { TextArea } from './shared/Input';
import { Loader } from './shared/Loader';
import { TOOLS } from '../constants';
import { ToolType } from '../types';

const CsvGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A list of 10 sci-fi movie titles with their director and release year.');
  const [csvData, setCsvData] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toolInfo = TOOLS[ToolType.CSV];

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setCsvData('');
    try {
      const data = await generateCsv(prompt);
      setCsvData(data);
    } catch (e) {
      setError('Failed to generate CSV data. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const handleDownload = useCallback(() => {
    if (csvData) {
      downloadFile(csvData, 'generated_data.csv', 'text/csv;charset=utf-8;');
    }
  }, [csvData]);

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
            id="csv-prompt"
            label="Data Description"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Top 5 largest cities in the world by population..."
            rows={3}
            disabled={isLoading}
          />
          <Button onClick={handleGenerate} isLoading={isLoading} disabled={isLoading || !prompt} className="w-full sm:w-auto">
            Generate Data
          </Button>
        </div>
      </Card>
      
      {error && <div className="text-red-500 bg-red-900/20 p-3 rounded-md">{error}</div>}

      {isLoading && <Loader text="Structuring your data..." />}
      
      {csvData && (
        <Card title="Generated CSV Data">
          <div className="space-y-4">
            <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm max-h-60">
              <code>{csvData}</code>
            </pre>
            <Button onClick={handleDownload} variant="secondary">Download CSV</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CsvGenerator;
