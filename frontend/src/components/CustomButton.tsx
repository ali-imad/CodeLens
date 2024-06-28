import React from 'react';

interface AddProblemButtonProps {
  onClick: () => void;
  text?: string;
  icon?: React.ReactNode;
}

const CustomButton: React.FC<AddProblemButtonProps> = ({
  onClick,
  text = 'Add Problem',
  icon,
}) => {
  return (
    <button
      onClick={onClick}
      className='w-full sm:w-60 md:w-72 lg:w-96 xl:w-[180px] h-12 px-3 py-4 bg-blue-600 rounded-lg border-2 border-blue-600 flex items-center space-x-2'
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
