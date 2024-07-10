import axios from 'axios';
import React, { useRef, ChangeEvent, useState } from 'react';
import Spinner from '../utility/Spinner';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProfileCardProps {
  userName: string | null;
  firstName: string | null;
  lastName: string | null;
  image1Url: string;
  image2Url: string;
  stats: {
    assigned: number;
    attempted: number;
    completed: number;
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  userName,
  firstName,
  lastName,
  image1Url,
  image2Url,
  stats,
}) => {
  const fileRefImage = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [isToastDisplayed, setisToastDisplayed] = useState(false);

  const [image, setImage] = useState(() => {
    const profileImage = localStorage.getItem('profileImage');
    return profileImage ? profileImage : image2Url;
  });

  const handleClick = () => {
    if (!isToastDisplayed && fileRefImage.current) {
      fileRefImage.current.click();
    }
  };

  const handleSelectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    if (loading || toast.isActive('uploadingImage')) {
      return;
    }
    const file = event.target.files?.[0];
    if (file && userName) {
      const formData = new FormData();
      formData.append('userName', userName);
      formData.append('image', file);

      try {
        setLoading(true);

        const response = await axios.post(
          `http://localhost:3000/users/${userName}/uploadImage`,
          formData,
        );
        if (response.status === 200) {
          const img = URL.createObjectURL(file);
          setImage(img);
          localStorage.setItem('profileImage', img);
          localStorage.setItem('imageChanged?', 'true');
          window.dispatchEvent(new Event('storage'));

          toast.success(response.data.message, {
            toastId: 'uploadingImage',
            onClose: () => {
              setisToastDisplayed(false);
            },
          });
          setisToastDisplayed(true);
          setLoading(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            toast.error(error.response.data.message, {
              toastId: 'uploadingImage',
              onClose: () => setLoading(false),
            });
          } else {
            toast.error('Network error. Please check your connection.', {
              toastId: 'uploadingImage',
              onClose: () => setLoading(false),
            });
          }
        } else {
          toast.error('Unexpected error. Please try again.', {
            toastId: 'uploadingImage',
            onClose: () => setLoading(false),
          });
        }
      }
    }
  };

  return (
    <div className='max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden'>
      <ToastContainer
        position='top-center'
        limit={1}
        transition={Zoom}
        autoClose={false}
      />
      <div className='relative'>
        <div className='h-40 overflow-hidden'>
          <img
            className='w-full object-cover object-top'
            src={image1Url}
            alt='Cover'
          />
        </div>
        <div className='absolute top-4 left-4 w-24 h-24 rounded-full border-4 border-white object-cover'></div>
        {loading ? (
          <div className='absolute top-1 left-4 w-24 h-24  flex items-center justify-center'>
            <Spinner />
          </div>
        ) : (
          <img
            className='absolute top-4 left-4 w-24 h-24 rounded-full border-4 border-white object-cover cursor-pointer'
            src={image}
            alt='Profile'
            onClick={handleClick}
          />
        )}

        <input
          type='file'
          onChange={handleSelectFile}
          style={{ display: 'none' }}
          ref={fileRefImage}
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
              className='w-5 h-5 fill-current text-blue-900 mr-1 cursor-pointer'
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
