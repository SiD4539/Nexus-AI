import React, { useState, useCallback } from 'react';
import { generateResume } from '../services/geminiService';
import { Button } from './shared/Button';
import { Card } from './shared/Card';
import { Input, TextArea } from './shared/Input';
import { Loader } from './shared/Loader';
import { ResumeData, ToolType } from '../types';
import { TOOLS } from '../constants';

// Fix: Add type declaration for window.jspdf to handle global library.
declare global {
  interface Window {
    jspdf: any;
  }
}

const { jsPDF } = window.jspdf;

const initialResumeData: ResumeData = {
  fullName: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '123-456-7890',
  linkedin: 'linkedin.com/in/janedoe',
  github: 'github.com/janedoe',
  summary: 'A passionate software engineer with 5 years of experience in building scalable web applications.',
  experience: [
    { title: 'Senior Software Engineer', company: 'Tech Corp', dates: '2020 - Present', description: '- Led the development of a major feature, improving user engagement by 20%.\n- Mentored junior developers and conducted code reviews.' },
  ],
  education: [
    { degree: 'B.S. in Computer Science', school: 'State University', dates: '2012 - 2016' },
  ],
  skills: 'React, TypeScript, Node.js, Python, AWS, SQL',
};

const ResumeBuilder: React.FC = () => {
  const [formData, setFormData] = useState<ResumeData>(initialResumeData);
  const [generatedResume, setGeneratedResume] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toolInfo = TOOLS[ToolType.RESUME];

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resumeMarkdown = await generateResume(formData);
      setGeneratedResume(resumeMarkdown);
    } catch (e) {
      setError('Failed to generate resume. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const handleExportPdf = useCallback(() => {
    if (!generatedResume) return;
    const doc = new jsPDF();
    doc.text(generatedResume, 10, 10);
    doc.save(`${formData.fullName.replace(' ', '_')}_Resume.pdf`);
  }, [generatedResume, formData.fullName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center space-x-4">
        <span className="text-primary">{toolInfo.icon}</span>
        <div>
          <h1 className="text-2xl font-bold">{toolInfo.name}</h1>
          <p className="text-text-secondary">{toolInfo.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Your Information" className="max-h-[75vh] overflow-y-auto">
          <form className="space-y-4">
            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            <Input label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleInputChange} />
            <Input label="GitHub" name="github" value={formData.github} onChange={handleInputChange} />
            <TextArea label="Summary" name="summary" value={formData.summary} onChange={handleInputChange} rows={4} />
            <TextArea label="Skills" name="skills" value={formData.skills} onChange={handleInputChange} placeholder="Comma-separated skills"/>
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <Button onClick={handleGenerate} isLoading={isLoading} disabled={isLoading} className="w-full">
              Generate Resume
            </Button>
            {generatedResume && (
              <Button onClick={handleExportPdf} variant="secondary" className="w-full mt-4">
                Export to PDF
              </Button>
            )}
            {error && <div className="text-red-500 mt-4">{error}</div>}
          </Card>
          
          {isLoading && <Loader text="Crafting your professional story..." />}

          {generatedResume && (
            <Card title="Generated Resume Preview" className="max-h-[60vh] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm">{generatedResume}</pre>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;