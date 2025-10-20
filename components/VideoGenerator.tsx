import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateVideo, pollVideoStatus } from '../services/geminiService';
import { Button } from './shared/Button';
import { Card } from './shared/Card';
import { Input, TextArea } from './shared/Input';
import { Loader } from './shared/Loader';
import { fileToBase64 } from '../utils/fileUtils';
import { TOOLS } from '../constants';
import { ToolType } from '../types';

// Fix: Define a named interface for `window.aistudio` to resolve declaration conflicts.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

const POLLING_INTERVAL = 10000; // 10 seconds
const POLLING_MESSAGES = [
  "Initializing generation process...",
  "Warming up the creative engines...",
  "Storyboarding your vision...",
  "Rendering high-resolution frames (this may take a moment)...",
  "Assembling video sequence...",
  "Adding final touches and effects...",
  "Almost there, preparing your video for viewing..."
];

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A majestic dragon flying through a stormy sky.');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pollingMessage, setPollingMessage] = useState<string>('');
  const [isKeySelected, setIsKeySelected] = useState<boolean>(false);
  const [isCheckingKey, setIsCheckingKey] = useState<boolean>(true);

  const pollIntervalRef = useRef<number | null>(null);
  const toolInfo = TOOLS[ToolType.VIDEO];

  const checkApiKey = useCallback(async () => {
    setIsCheckingKey(true);
    if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setIsKeySelected(hasKey);
    } else {
      // Fallback for environments where the aistudio object might not be available
      setIsKeySelected(false);
      setError("API selection feature is not available. Please ensure you're in the correct environment.");
    }
    setIsCheckingKey(false);
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      // Optimistically assume key selection is successful to avoid race conditions
      setIsKeySelected(true);
    }
  };

  const cleanupPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return cleanupPolling;
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    cleanupPolling();
    
    let messageIndex = 0;
    setPollingMessage(POLLING_MESSAGES[messageIndex]);
    const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % POLLING_MESSAGES.length;
        setPollingMessage(POLLING_MESSAGES[messageIndex]);
    }, 5000);

    try {
      let imagePayload: { data: string; mimeType: string } | undefined;
      if (imageFile) {
        const base64Data = await fileToBase64(imageFile);
        imagePayload = { data: base64Data, mimeType: imageFile.type };
      }

      let operation = await generateVideo(prompt, imagePayload);

      pollIntervalRef.current = window.setInterval(async () => {
        try {
          operation = await pollVideoStatus(operation);
          if (operation.done) {
            cleanupPolling();
            clearInterval(messageInterval);
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
              const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
              const blob = await response.blob();
              const objectUrl = URL.createObjectURL(blob);
              setVideoUrl(objectUrl);
            } else {
              throw new Error("Video generation finished, but no URI was found.");
            }
            setIsLoading(false);
          }
        } catch (pollError: any) {
            cleanupPolling();
            clearInterval(messageInterval);
            setIsLoading(false);
            if(pollError.message?.includes("Requested entity was not found")) {
                setError("API Key is invalid. Please select a valid key.");
                setIsKeySelected(false);
            } else {
                setError(`An error occurred while polling: ${pollError.message}`);
            }
        }
      }, POLLING_INTERVAL);

    } catch (e: any) {
      clearInterval(messageInterval);
      setIsLoading(false);
      if(e.message?.includes("Requested entity was not found")) {
        setError("API Key is invalid. Please select a valid key.");
        setIsKeySelected(false);
      } else {
        setError(`Failed to start video generation: ${e.message}`);
      }
      console.error(e);
    }
  }, [prompt, imageFile]);
  
  if (isCheckingKey) {
    return <Loader text="Checking API Key status..." />;
  }
  
  if (!isKeySelected) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Card className="max-w-md">
          <h2 className="text-xl font-bold mb-2">API Key Required for Video Generation</h2>
          <p className="text-text-secondary mb-4">
            The Veo video model requires you to select an API key. This action may incur charges on your Google Cloud project.
            Please see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">billing documentation</a> for more details.
          </p>
          <Button onClick={handleSelectKey}>Select API Key</Button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </Card>
      </div>
    );
  }

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
            id="video-prompt"
            label="Prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., An astronaut riding a horse on Mars"
            rows={3}
            disabled={isLoading}
          />
          <Input
            id="image-upload"
            label="Starting Image (Optional)"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
            disabled={isLoading}
          />
          <Button onClick={handleGenerate} isLoading={isLoading} disabled={isLoading || !prompt} className="w-full sm:w-auto">
            Generate Video
          </Button>
        </div>
      </Card>
      
      {error && <div className="text-red-500 bg-red-900/20 p-3 rounded-md">{error}</div>}

      {isLoading && <Loader text={pollingMessage} />}
      
      {videoUrl && (
        <Card title="Generated Video">
          <video controls src={videoUrl} className="w-full rounded-lg" />
        </Card>
      )}
    </div>
  );
};

export default VideoGenerator;