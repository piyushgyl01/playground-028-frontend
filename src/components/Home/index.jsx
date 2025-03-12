import { useState, useEffect } from 'react';

export const Home = () => {
  return (
    <div className='bg-neutral-900 text-neutral-200 min-h-screen flex flex-col items-center justify-center'>
      <h1 className='text-2xl mb-8'>Welcome to Social App</h1>
      <UserAuth />
    </div>
  );
};

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        // If token is invalid, clear local storage
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/auth/${endpoint}`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
          credentials: 'include'
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userId', data.user._id);
        setUserData(data.user);
        setSuccess('Login successful!');
      } else {
        setSuccess('Registration successful! You can now login.');
        setIsLogin(true);
        // Reset form fields except username for easier login after registration
        setFormData({
          ...formData,
          password: '',
          name: ''
        });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      setUserData(null);
    }
  };

  // Authenticate via OAuth
  const authenticateViaOAuth = (method) => {
    window.location.href = `${import.meta.env.VITE_SERVER_BASE_URL}/auth/${method}`;
  };

  // Check if user is logged in based on userData or local storage
  const isLoggedIn = userData || (localStorage.getItem('token') && localStorage.getItem('username'));

  return (
    <div className="bg-neutral-900 text-neutral-200 rounded-lg shadow-lg max-w-md mx-auto p-6 w-full">
      {isLoggedIn ? (
        <div className="flex flex-col items-center">
          <p className="mb-2">Logged in as: <span className="font-bold">{userData?.username || localStorage.getItem('username')}</span></p>
          {userData?.name && <p className="mb-4">Name: <span className="font-bold">{userData.name}</span></p>}
          {userData?.provider && <p className="mb-4">Login method: <span className="font-bold capitalize">{userData.provider}</span></p>}
          
          <button
            onClick={handleLogout}
            className="w-full rounded-md px-6 py-4 bg-red-600 text-white font-medium transition-colors hover:bg-red-700"
          >
            Logout
          </button>
          <button
            onClick={() => window.location.href = '/posts'}
            className="w-full mt-4 rounded-md px-6 py-4 bg-neutral-700 text-neutral-200 font-medium transition-colors hover:bg-neutral-600"
          >
            View Posts
          </button>
          <button
            onClick={() => window.location.href = '/create-post'}
            className="w-full mt-4 rounded-md px-6 py-4 bg-blue-600 text-white font-medium transition-colors hover:bg-blue-700"
          >
            Create New Post
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-6">
            <div className="bg-neutral-800 inline-flex rounded-lg p-1">
              <button
                className={`px-4 py-2 rounded-md ${
                  isLogin ? 'bg-neutral-700 text-white' : 'text-neutral-400'
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  !isLogin ? 'bg-neutral-700 text-white' : 'text-neutral-400'
                }`}
                onClick={() => {
                  setIsLogin(false);
                  setFormData({ username: '', password: '', name: '' });
                }}
              >
                Register
              </button>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-6 text-center">
            {isLogin ? 'Login to Your Account' : 'Create a New Account'}
          </h2>

          {error && (
            <div className="bg-red-900/50 text-red-200 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/50 text-green-200 p-3 rounded-md mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-neutral-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
                required
              />
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-neutral-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md px-6 py-4 bg-blue-600 text-white font-medium transition-colors hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p>- OR -</p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <button
              onClick={() => authenticateViaOAuth('github')}
              className="w-full rounded-md px-6 py-4 bg-neutral-800 text-neutral-200 flex items-center justify-center gap-3 transition-colors hover:bg-neutral-700"
            >
              <svg
                stroke="#eee"
                fill="#eee"
                strokeWidth="0"
                viewBox="0 0 496 512"
                height="1.2em"
                width="1.2em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
              </svg>
              Login with GitHub
            </button>
            
            <button
              onClick={() => authenticateViaOAuth('google')}
              className="w-full rounded-md px-6 py-4 text-neutral-900 bg-neutral-200 flex items-center justify-center gap-3 transition-colors hover:bg-neutral-300"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 488 512"
                height="1.2em" 
                width="1.2em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Login with Google
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserAuth;