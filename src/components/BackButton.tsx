import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  label, 
  className = '',
  variant = 'ghost'
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  const displayLabel = label || t('nav.back');

  const baseClasses = "inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 group";
    const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
    outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:border-orange-400 dark:hover:border-gray-500",
    ghost: "text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-800"
  };

  return (
    <button
      onClick={handleBack}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >      <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
      <span className="transition-all duration-200">{displayLabel}</span>
    </button>
  );
};

export default BackButton;
