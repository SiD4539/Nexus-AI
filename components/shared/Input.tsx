
import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => (
  <div>
    {label && <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
    <input
      id={id}
      className="w-full bg-secondary border border-gray-600 rounded-md p-2 text-text-main focus:ring-2 focus:ring-primary focus:border-primary"
      {...props}
    />
  </div>
);

export const TextArea: React.FC<TextAreaProps> = ({ label, id, ...props }) => (
  <div>
    {label && <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
    <textarea
      id={id}
      className="w-full bg-secondary border border-gray-600 rounded-md p-2 text-text-main focus:ring-2 focus:ring-primary focus:border-primary"
      rows={4}
      {...props}
    />
  </div>
);
