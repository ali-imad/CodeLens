import React from 'react';
import ProfileCard from '../components/ProfileCard';

const ProfilePage: React.FC = () => {
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    image1Url:
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ',
    image2Url:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ',
    stats: {
      assigned: 10,
      attempted: 5,
      completed: 3,
    },
  };

  return (
    <div className='container mx-auto mt-8'>
      <ProfileCard
        firstName={user.firstName}
        lastName={user.lastName}
        image1Url={user.image1Url}
        image2Url={user.image2Url}
        stats={user.stats}
      />
    </div>
  );
};

export default ProfilePage;
