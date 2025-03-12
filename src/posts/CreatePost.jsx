// posts/CreatePost.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, clearPostErrors } from "./postSlice";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiAlertCircle } from "react-icons/fi";

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: ""
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.posts);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Clear post errors when component mounts
  useEffect(() => {
    dispatch(clearPostErrors());
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError(null);
    
    if (validateForm()) {
      dispatch(createPost(formData))
        .unwrap()
        .then(() => {
          // Success - navigate to posts list
          navigate("/posts");
        })
        .catch((err) => {
          console.error("Failed to create post:", err);
          setApiError(err.message || "Failed to create post. Please try again.");
          
          // If unauthorized, redirect to login
          if (err.message === "Access denied. No token provided" || err.message === "Invalid token") {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("userId");
            setTimeout(() => {
              navigate("/auth", { state: { from: "/create" } });
            }, 1500);
          }
        });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-3xl font-bold mb-6">Create New Post</h2>
      
      {(error || apiError) && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p>{error || apiError}</p>
              {(apiError === "Access denied. No token provided" || apiError === "Invalid token") && (
                <p className="mt-1 text-sm">Redirecting to login page...</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Give your post a title"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            Image URL (optional)
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
          <p className="mt-2 text-xs text-gray-500">
            Add a URL to an image that represents your post
          </p>
          
          {formData.image && (
            <div className="mt-3">
              <p className="block text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="relative h-40 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows="6"
            value={formData.content}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.content ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Write your post content here..."
          ></textarea>
          {errors.content && (
            <p className="mt-2 text-sm text-red-600">{errors.content}</p>
          )}
        </div>
        
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate("/posts")}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <FiUpload className="mr-2" />
                Publish Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}