import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { authServerAxios, githubApiAxios, googleApiAxios } from '../../lib/axios.lib';
import { useLocation, useNavigate } from 'react-router-dom';

export const GithubProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const githubAccessToken = Cookies.get('access_token') || '';

  useEffect(() => {
    (async () => {
      try {
        if (githubAccessToken && location.pathname.includes('v1')) {
          const response = await githubApiAxios.get('/user', {
            headers: {
              Authorization: `Bearer ${githubAccessToken}`,
            },
          });

          setUserData(() => response.data);
          setLoading(false);
          
          // After a short delay, redirect to posts page
          setTimeout(() => {
            navigate('/posts');
          }, 2500);
          
        } else if (location.pathname.includes('v2')) {
          try {
            const response = await authServerAxios.get('/user/profile/github');
            setUserData(() => response.data.user);
            setLoading(false);
            
            // After a short delay, redirect to posts page
            setTimeout(() => {
              navigate('/posts');
            }, 2500);
            
          } catch (error) {
            if (error.status === 403 || error.status === 500) {
              window.location.href = '/auth';
            }
          }
        } else {
          window.location.href = '/auth';
        }
      } catch (error) {
        console.error("Error fetching GitHub profile:", error);
        navigate('/auth');
      }
    })();
  }, [githubAccessToken, location.pathname, navigate]);

  return (
    <div className='w-full min-h-screen flex flex-col items-center p-12 gap-4 text-neutral-200 bg-neutral-900'>
      {loading ? (
        <div className="text-3xl">Loading your Github profile....</div>
      ) : userData ? (
        <>
          <div className='flex flex-col md:flex-row gap-6'>
            <img
              src={userData?.avatar_url}
              alt={userData?.name || 'user avatar'}
              className='rounded-full w-[120px] h-[120px]'
            />
            <div className='flex flex-col justify-center'>
              <p className='text-xl font-bold mb-4'>
                {userData?.name || userData?.login}
                <a
                  target='_blank'
                  href={userData?.html_url}
                  className='font-light ml-4 text-sm text-neutral-100 bg-neutral-600/50 px-4 rounded-md py-2'
                >
                  Visit profile
                </a>
              </p>
              <p className='mt-[-1.2rem] max-w-[350px] text-sm text-neutral-400'>
                {userData?.login}
              </p>
              <p className='mt-2 max-w-[350px]'>{userData?.bio}</p>
            </div>
          </div>
          <div className='mt-8 text-center'>
            <p className="text-lg">Authentication successful!</p>
            <p className="text-sm mt-2">Redirecting to posts page...</p>
          </div>
        </>
      ) : (
        <div className="text-3xl">Unable to load your profile. Redirecting...</div>
      )}
    </div>
  );
};

export const GoogleProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleAccessToken = Cookies.get('access_token') || '';
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        if (googleAccessToken && location.pathname.includes('v1')) {
          // Retrieve user info
          const userResponse = await googleApiAxios.get('/userinfo', {
            headers: {
              Authorization: `Bearer ${googleAccessToken}`,
            },
          });

          setUserData(() => userResponse.data);
          setLoading(false);
          
          // After a short delay, redirect to posts page
          setTimeout(() => {
            navigate('/posts');
          }, 2500);
          
        } else if (location.pathname.includes('v2')) {
          try {
            const response = await authServerAxios.get('/user/profile/google');
            setUserData(() => response.data.user);
            setLoading(false);
            
            // After a short delay, redirect to posts page
            setTimeout(() => {
              navigate('/posts');
            }, 2500);
            
          } catch (error) {
            if (error.status === 403 || error.status === 500) {
              window.location.href = '/auth';
            }
          }
        } else {
          window.location.href = '/auth';
        }
      } catch (error) {
        console.error("Error fetching Google profile:", error);
        navigate('/auth');
      }
    })();
  }, [googleAccessToken, location.pathname, navigate]);

  return (
    <div className='w-full min-h-screen flex flex-col items-center p-12 gap-4 text-neutral-200 bg-neutral-900'>
      {loading ? (
        <div className="text-3xl">Loading your Google profile....</div>
      ) : userData ? (
        <>
          <div className='mt-4 flex flex-col gap-6 items-center'>
            <div className='bg-neutral-700 h-max w-max p-6 rounded-full'>
              <svg
                className='fill-neutral-900 stroke-neutral-900'
                strokeWidth='0'
                viewBox='0 0 488 512'
                height='6rem'
                width='6rem'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'></path>
              </svg>
            </div>
            <div className='flex flex-col justify-center'>
              <p className='text-xl mb-4 text-center'>
                Hello {userData?.name || userData?.email} you&apos;ve
                <br /> logged in with <span className='italic text-neutral-400'>{userData?.email}</span>
              </p>
              <div className='mt-8 text-center'>
                <p className="text-lg">Authentication successful!</p>
                <p className="text-sm mt-2">Redirecting to posts page...</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-3xl">Unable to load your profile. Redirecting...</div>
      )}
    </div>
  );
};