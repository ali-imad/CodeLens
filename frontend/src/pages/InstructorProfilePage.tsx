import ProfileCard from '../components/ProfileCard';

const ProfilePage: React.FC = () => {
  const user = {
    username: localStorage.getItem('username'),
    firstName: localStorage.getItem('firstName'),
    lastName: localStorage.getItem('lastName'),
    email: localStorage.getItem('email'),
    image1Url:
      'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ',
    image2Url: 'http://localhost:3000/avatar.jpg',
    role: localStorage.getItem('role'),
  };

  return (
    <div>
      <div className='container mx-auto mt-8 profile-card'>
        <ProfileCard
          username={user.username}
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
          showStatsIcons={false}
          image1Url={user.image1Url}
          image2Url={user.image2Url}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
