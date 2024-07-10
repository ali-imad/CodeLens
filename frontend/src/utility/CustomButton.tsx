import React from 'react';

interface CustomButtonProps {
  onClick: () => void;
  text?: string;
  icon?: React.ReactNode;
  className?: string;
  bgColor?: string;
  borderColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  text = 'Button',
  icon,
  className = '',
  bgColor = 'bg-blue-600',
  borderColor = 'border-blue-600',
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full h-12 px-3 py-4 rounded-lg border-2 flex items-center space-x-2 ${bgColor} ${borderColor} ${className}`}
    >
      {icon && <span className='w-7 h-7 relative text-white'>{icon}</span>}
      <div className='justify-center items-center gap-2.5 flex'>
        <div className='text-white text-base font-medium font-roboto leading-none tracking-wide'>
          {text}
        </div>
      </div>
    </button>
  );
};

export default CustomButton;
