import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GithubProfile, GoogleProfile, Home } from "./components";
import { Provider } from "react-redux";
import store from "./store";
import Posts from "./posts/Posts";
import PrivateRoute from "./PrivateRoute";
import { useEffect } from "react";
import { getCurrentUser } from "./auth/authSlice";
import Auth from "./components/Auth"; // You'll need to create this component for login/register

// Create AppContent component to use hooks inside RouterProvider
function AppContent() {
  // Attempt to restore user session when app loads
  useEffect(() => {
    store.dispatch(getCurrentUser());
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/profile",
      element: (
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      ),
    },
    {
      path: "/v1/profile/github",
      element: <GithubProfile />,
    },
    {
      path: "/v2/profile/github",
      element: <GithubProfile />,
    },
    {
      path: "/v1/profile/google",
      element: <GoogleProfile />,
    },
    {
      path: "/v2/profile/google",
      element: <GoogleProfile />,
    },
    {
      path: "/posts",
      element: (
        <PrivateRoute>
          <Posts />
        </PrivateRoute>
      ),
    },
    {
      path: "/create",
      element: (
        <PrivateRoute>
          <div>Create Post Page</div> {/* You'll need to implement this */}
        </PrivateRoute>
      ),
    },
    {
      path: "/edit/:id",
      element: (
        <PrivateRoute>
          <div>Edit Post Page</div> {/* You'll need to implement this */}
        </PrivateRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;