import React from 'react';

interface ProgressBarProps {
  progress: number; // A value between 0 and 100
  color?: string; // Tailwind CSS color class, e.g., 'bg-blue-500'
  height?: string; // Tailwind CSS height class, e.g., 'h-4'
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'bg-blue-500',
  height = 'h-4',
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full ${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
      <div
        className={`${color} ${height} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${clampedProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar; 