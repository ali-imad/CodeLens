import axios from 'axios';
import React, { useRef, ChangeEvent, useState, useEffect } from 'react';
import Spinner from '../utility/Spinner';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProfileCardProps {
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  instructorName?: string | null;
  image1Url: string;
  image2Url: string;
  showStatsIcons: boolean;
  numberAssigned?: number;
  numberAttempted?: number;
  numberCompleted?: number;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  username,
  firstName,
  lastName,
  email,
  instructorName,
  image1Url,
  image2Url,
  showStatsIcons: showStats,
  numberAssigned,
  numberAttempted,
  numberCompleted,
}) => {
  const fileRefImage = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [isToastDisplayed, setisToastDisplayed] = useState(false);

  const role = localStorage.getItem('role');
  const currentUser = localStorage.getItem('username');

  const [image, setImage] = useState(() => {
    if (role === 'Student') {
      return localStorage.getItem('profileImage') || image2Url;
    }
    return image2Url;
  });

  useEffect(() => {
    const fetchImage = async () => {
      if (role !== 'Student') {
        try {
          const response = await axios.get(
            `http://localhost:3000/users/${username}/fetchImage`,
            { responseType: 'blob' },
          );
          if (response.status === 200) {
            const img = URL.createObjectURL(response.data);
            setImage(img);
          }
        } catch (err) {
          console.error('Error fetching image:', err);
        }
      }
    };
    fetchImage();
  }, [username]);

  const handleClick = () => {
    if (!isToastDisplayed && fileRefImage.current && currentUser === username) {
      fileRefImage.current.click();
    }
  };

  const handleSelectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    if (loading || toast.isActive('uploadingImage')) {
      return;
    }
    const file = event.target.files?.[0];
    if (file && username) {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('image', file);

      try {
        setLoading(true);

        const response = await axios.post(
          `http://localhost:3000/users/${username}/uploadImage`,
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

      <div className='flex flex-col p-3 w-full h-full'>
        <h2 className='text-xl font-semibold text-gray-800'>
          {firstName} {lastName}
        </h2>
        <h2 className='text-l font-semibold text-gray-500'>{username}</h2>
        <h2 className='text-l font-semibold text-gray-500'>{email}</h2>
        {instructorName && instructorName.trim() !== '' && (
          <h2 className='text-l font-semibold text-gray-500'>
            Student of <span className='text-gray-700'>{instructorName}</span>
          </h2>
        )}
        {showStats && (
          <div className='flex justify-center mt-4 mb-0'>
            <div className='flex items-center mx-2' title='Completed problems'>
              <svg
                className='w-6 h-6 fill-current text-blue-900 mr-1'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z' />
              </svg>
              <span className='text-sm text-gray-700'>{numberCompleted}</span>
            </div>

            <div className='flex items-center mx-2' title='Assigned problems'>
              <svg
                className='w-6 h-6 fill-current text-blue-900 mr-1'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 490 490'
              >
                <path d='M469.762,154c-12.5-12.5-42.4-29.8-78-12.6V67.6c0-11.4-9.4-20.8-20.8-20.8h-72.8v-26c0-11.4-9.4-20.8-20.8-20.8h-161.3 c-11.4,0-20.8,9.4-20.8,20.8v26h-73.8c-11.4,0-20.8,9.4-20.8,20.8v401.6c0,11.4,9.4,20.8,20.8,20.8h349.5 c11.4,0,20.8-8.3,20.8-19.8V328.3l78-78.6C495.862,223.7,495.862,180,469.762,154z M135.863,41.6h120.7v52h-120.7V41.6z  M350.163,449.4h-307.9v-361h53.1v25c0,11.4,9.4,20.8,20.8,20.8h161.3c10.4,0,19.8-9.4,20.8-20.8v-25h52c0,0,0.1,88.3,0.2,89.2 l-110.6,110.6c-8.3,8.3-14.6,17.7-17.7,29.1l-27,86.3c-5.6,23.4,17.8,29.1,26,25l86.3-27c10.4-3.1,20.8-9.4,29.1-17.7l13.5-13.6 v79.1H350.163z M441.762,220.6l-134.2,134.2c-3.1,4.2-7.3,7.3-12.5,8.3l-48.9,15.6l14.6-48.9c2.1-5.2,5.2-10.4,8.3-13.5 l135.2-134.2c16.1-15.7,33.3-5.2,37.5,0C452.163,192.5,452.163,210.1,441.762,220.6z' />
              </svg>
              <span className='text-sm text-gray-700'>{numberAssigned}</span>
            </div>

            <div className='flex items-center mx-2' title='Attempted problems'>
              <svg
                className='w-7 h-7 fill-current text-blue-900 mr-1'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
              >
                <path d='M11.7,2c-0.1,0-0.1,0-0.2,0c0,0,0,0-0.1,0v0c-0.2,0-0.3,0-0.5,0l0.2,2c0.4,0,0.9,0,1.3,0c4,0.3,7.3,3.5,7.5,7.6 c0.2,4.4-3.2,8.2-7.6,8.4c0,0-0.1,0-0.2,0c-0.3,0-0.7,0-1,0L11,22c0.4,0,0.8,0,1.3,0c0.1,0,0.3,0,0.4,0v0c5.4-0.4,9.5-5,9.3-10.4 c-0.2-5.1-4.3-9.1-9.3-9.5v0c0,0,0,0,0,0c-0.2,0-0.3,0-0.5,0C12,2,11.9,2,11.7,2z M8.2,2.7C7.7,3,7.2,3.2,6.7,3.5l1.1,1.7 C8.1,5,8.5,4.8,8.9,4.6L8.2,2.7z M4.5,5.4c-0.4,0.4-0.7,0.9-1,1.3l1.7,1C5.4,7.4,5.7,7.1,6,6.7L4.5,5.4z M15.4,8.4l-4.6,5.2 l-2.7-2.1L7,13.2l4.2,3.2l5.8-6.6L15.4,8.4z M2.4,9c-0.2,0.5-0.3,1.1-0.3,1.6l2,0.3c0.1-0.4,0.1-0.9,0.3-1.3L2.4,9z M4.1,13l-2,0.2 c0,0.1,0,0.2,0,0.3c0.1,0.4,0.2,0.9,0.3,1.3l1.9-0.6c-0.1-0.3-0.2-0.7-0.2-1.1L4.1,13z M5.2,16.2l-1.7,1.1c0.3,0.5,0.6,0.9,1,1.3 L6,17.3C5.7,16.9,5.4,16.6,5.2,16.2z M7.8,18.8l-1.1,1.7c0.5,0.3,1,0.5,1.5,0.8l0.8-1.8C8.5,19.2,8.1,19,7.8,18.8z' />
              </svg>

              <span className='text-sm text-gray-700'>{numberAttempted}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
