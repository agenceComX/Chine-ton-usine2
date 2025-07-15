import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface FileUploadButtonProps {
  id: string;
  label?: string;
  accept?: string;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  id,
  label,
  accept = "application/pdf,image/*",
  onChange,
  disabled = false,
  className = '',
}) => {
  const { t } = useLanguage();
  const [fileName, setFileName] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      onChange(file);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    } else {
      setFileName(null);
      onChange(null);
    }
  };
  
  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      const file = event.dataTransfer.files[0];
      if (file) {
        setFileName(file.name);
        onChange(file);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
      setIsDragging(false);
    }
  };
  
  return (
    <div className={`${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
        >
          {label}
        </label>
      )}        <div 
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 file-upload-hover-effect
          ${disabled ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 cursor-not-allowed' : ''}
          ${isDragging ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''}
          ${!disabled && !isDragging && isHovering ? 'border-orange-300 dark:border-orange-500 bg-orange-50 dark:bg-orange-900/20' : ''}
          ${!disabled && !isDragging && !isHovering ? 'border-gray-300 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20' : ''}
          ${isAnimating ? 'animate-bounce-in' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <input
          ref={inputRef}
          type="file"
          id={id}
          className="sr-only"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
        />
        
        <div className="space-y-2">
          <div className="flex justify-center">            <svg 
              className={`w-12 h-12 mb-2 transition-all duration-300
                ${isAnimating ? 'text-green-500 dark:text-green-400 animate-bounce-in' : ''}
                ${fileName && !isAnimating ? 'text-green-500 dark:text-green-400' : ''}
                ${!isAnimating && !fileName && (isDragging || isHovering) ? 'text-orange-500 dark:text-orange-400' : ''}
                ${!isAnimating && !fileName && !isDragging && !isHovering ? 'text-gray-400 dark:text-gray-500' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >              {fileName ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              )}
            </svg>
          </div>
            {fileName ? (
            <div className="space-y-2 animate-fade-in-scale">
              <div className="flex items-center justify-center">
                <svg className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div className="text-sm font-medium text-green-600 dark:text-green-400 max-w-full truncate">
                  {fileName}
                </div>
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                {t('fileUpload.title')} {t('common.optional')}
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('fileUpload.dragDrop')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('fileUpload.orClick')}
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {accept.split(',').map(type => (
                  <span key={type} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {t(`fileUpload.${type.replace('*', 'all').replace('/', '')}`)}
                  </span>
                ))}
              </div>
            </>
          )}
            {fileName && (
            <button 
              type="button" 
              className="mt-2 px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/40 hover:text-red-800 dark:hover:text-red-300 rounded-full transition-colors flex items-center justify-center mx-auto"
              onClick={(e) => {
                e.stopPropagation();
                setFileName(null);
                onChange(null);
                if (inputRef.current) {
                  inputRef.current.value = '';
                }
              }}
              disabled={disabled}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t('fileUpload.remove')}
            </button>
          )}
        </div>
        
        {/* Progress ring animation that appears when file is selected */}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-16 h-16 animate-spin-slow" viewBox="0 0 24 24">
              <circle 
                className="text-gray-300 dark:text-gray-600" 
                strokeWidth="2" 
                stroke="currentColor" 
                fill="none" 
                strokeDasharray="1, 200"
                strokeDashoffset="0" 
                cx="12" 
                cy="12" 
                r="10"
              />
              <circle 
                className="text-green-500 dark:text-green-400" 
                strokeWidth="2" 
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="none" 
                strokeDasharray="20, 200" 
                strokeDashoffset="0" 
                cx="12" 
                cy="12" 
                r="10"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadButton;
