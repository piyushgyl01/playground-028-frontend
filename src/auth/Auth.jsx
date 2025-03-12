import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser, loginUser, registerUser, clearError } from "./authSlice";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [isLogin, setIsLogin] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const dispatch = useDispatch();
  const { status, error, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the user is already authenticated
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    // If user is authenticated, navigate to home
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Handle successful registration - switch to login form and show message
    if (status === "succeeded" && !isLogin && !isAuthenticated) {
      setRegistrationSuccess(true);
      setIsLogin(true); // Switch to login form
      // Reset the form
      setUserData({
        name: "",
        username: userData.username, // Keep the username for convenience
        email: "",
        password: "",
      });
    }
  }, [status, isLogin, isAuthenticated, userData.username]);

  // Clear error when switching between login/register
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [isLogin, dispatch, error]);

  const handleChange = (e) => {
    setUserData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRegistrationSuccess(false);
    
    if (isLogin) {
      // For login, we only need username and password
      const { username, password } = userData;
      dispatch(loginUser({ username, password }));
    } else {
      dispatch(registerUser(userData));
    }
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="text-center mb-4">
            <div className="btn-group" role="group" aria-label="Login/Register">
              <input
                type="radio"
                className="btn-check"
                name="authType"
                id="login"
                autoComplete="off"
                checked={isLogin}
                onChange={() => setIsLogin(true)}
              />
              <label className="btn btn-outline-primary" htmlFor="login">
                Login
              </label>

              <input
                type="radio"
                className="btn-check"
                name="authType"
                id="register"
                autoComplete="off"
                checked={!isLogin}
                onChange={() => setIsLogin(false)}
              />
              <label className="btn btn-outline-primary" htmlFor="register">
                Register
              </label>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          {registrationSuccess && (
            <div className="alert alert-success" role="alert">
              Registration successful! Please login with your credentials.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={userData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={userData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            <div className="mb-4">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={userData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={userData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="text-center">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={status === "loading"}
              >
                {status === "loading"
                  ? "Loading..."
                  : isLogin
                  ? "Login"
                  : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}