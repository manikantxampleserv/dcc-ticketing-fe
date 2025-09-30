import React from 'react';

interface LoaderProps {
  size?: number; // size of the dots in px
  color?: string; // Tailwind color class e.g., "bg-blue-500"
  text?: string; // optional loading text
}

const Loader: React.FC<LoaderProps> = ({ size = 2, color = 'bg-blue-500', text = 'Loading...' }) => {
  const dotStyle = `w-${size} h-${size} ${color} rounded-full animate-bounce`;

  return (
    <div className="flex flex-col justify-center items-center h-[40vh]">
      <div className="flex space-x-2">
        <span className={`${dotStyle} delay-0`}></span>
        <span className={`${dotStyle} delay-150`}></span>
        <span className={`${dotStyle} delay-300`}></span>
      </div>
      {text && <p className="mt-4 text-gray-700 font-medium">{text}</p>}
    </div>
  );
};

export default Loader;
