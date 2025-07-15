import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  name,
  id,
  className = '',
}) => {
  const checkboxId = id || name || Math.random().toString(36).substring(2, 9);
  
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={checkboxId}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label htmlFor={checkboxId} className="ml-2 block text-sm text-gray-700 dark:text-white">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;