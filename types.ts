
export enum ToolType {
  IMAGE = 'IMAGE',
  CSV = 'CSV',
  RESUME = 'RESUME',
  VIDEO = 'VIDEO',
  CODE = 'CODE',
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary: string;
  experience: { title: string; company: string; dates: string; description: string }[];
  education: { degree: string; school: string; dates: string }[];
  skills: string;
}
