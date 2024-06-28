import React from 'react';

interface ProfileCardProps {
  firstName: string;
  lastName: string;
  image1Url: string;
  image2Url: string;
  stats: {
    assigned: number;
    attempted: number;
    completed: number;
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  firstName,
  lastName,
  image1Url,
  image2Url,
  stats,
}) => {
  return (
    <div className='max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden'>
      <div className='relative'>
        <div className='h-40 overflow-hidden'>
          <img
            className='w-full object-cover object-top'
            src={image1Url}
            alt='Cover'
          />
        </div>
        <div className='absolute top-0 left-0 right-0 bottom-0 bg-black opacity-30'></div>
        <img
          className='absolute top-4 left-4 w-24 h-24 rounded-full border-4 border-white object-cover'
          src={image2Url}
          alt='Profile'
        />
      </div>
      <div className='p-4 text-center'>
        <h2 className='text-xl font-semibold text-gray-800'>{firstName}</h2>
        <h2 className='text-xl font-semibold text-gray-800'>{lastName}</h2>
        <div className='flex justify-center mt-2'>
          <div className='flex items-center mx-2'>
            <svg
              className='w-5 h-5 fill-current text-blue-900 mr-1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z' />
            </svg>
            <span className='text-sm text-gray-700'>{stats.assigned}</span>
          </div>
          <div className='flex items-center mx-2'>
            <svg
              className='w-5 h-5 fill-current text-blue-900 mr-1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z' />
            </svg>
            <span className='text-sm text-gray-700'>{stats.attempted}</span>
          </div>
          <div className='flex items-center mx-2'>
            <svg
              className='w-5 h-5 fill-current text-blue-900 mr-1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z' />
            </svg>
            <span className='text-sm text-gray-700'>{stats.completed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
