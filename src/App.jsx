import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GithubProfile, GoogleProfile, Home } from "./components";
import { Provider } from "react-redux";
import store from "./store";
import Posts from "./posts/Posts";
import CreatePost from "./posts/CreatePost";
import EditPost from "./posts/EditPost";
import PrivateRoute from "./PrivateRoute";
import { useEffect } from "react";
import { getCurrentUser } from "./auth/authSlice";
import Auth from "./components/Auth"; // Using the Tailwind version
import Navbar from "./components/Navbar";

// Create AppContent component to use hooks inside RouterProvider
function AppContent() {
  // Attempt to restore user session when app loads
  useEffect(() => {
    store.dispatch(getCurrentUser());
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/posts",
          element: <Posts />,
        },
        {
          path: "/create",
          element: (
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          ),
        },
        {
          path: "/edit/:id",
          element: (
            <PrivateRoute>
              <EditPost />
            </PrivateRoute>
          ),
        },
      ],
    },
    // Auth routes outside of Navbar layout
    {
      path: "/auth",
      element: <Auth />,
    },
    // OAuth callback routes
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