
import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import { Button } from './shared/Button';
import { Card } from './shared/Card';
import { TextArea } from './shared/Input';
import { Loader } from './shared/Loader';
import { TOOLS } from '../constants';
import { ToolType } from '../types';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A photorealistic image of a futuristic city skyline at dusk, with flying vehicles and neon lights.');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toolInfo = TOOLS[ToolType.IMAGE];

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setImages([]);
    try {
      const generatedImages = await generateImage(prompt);
      setImages(generatedImages);
    } catch (e) {
      setError('Failed to generate images. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

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
            id="image-prompt"
            label="Prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A surreal painting of a whale floating in a starry sky..."
            rows={3}
            disabled={isLoading}
          />
          <Button onClick={handleGenerate} isLoading={isLoading} disabled={isLoading || !prompt} className="w-full sm:w-auto">
            Generate Images
          </Button>
        </div>
      </Card>
      
      {error && <div className="text-red-500 bg-red-900/20 p-3 rounded-md">{error}</div>}

      {isLoading && <Loader text="Your vision is materializing..." />}
      
      {images.length > 0 && (
        <Card title="Generated Images">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Generated image ${index + 1}`}
                className="rounded-lg w-full h-full object-cover aspect-square transition-transform duration-300 hover:scale-105"
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageGenerator;
