import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllPosts, deletePost } from "./postSlice";
import { Link, useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus, FiMoreVertical, FiFileText } from "react-icons/fi";

export default function Posts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, status } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const toggleMenu = (postId, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === postId ? null : postId);
  };

  const handleEdit = (postId) => {
    navigate(`/edit/${postId}`);
    setActiveMenu(null);
  };

  const handleDelete = (postId) => {
    setIsDeleting(true);
    setDeleteId(postId);
    
    dispatch(deletePost(postId))
      .unwrap()
      .then(() => {
        // Success - post deleted
        setIsDeleting(false);
        setDeleteId(null);
      })
      .catch((err) => {
        console.error("Failed to delete post:", err);
        setIsDeleting(false);
        setDeleteId(null);
      });
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenu) setActiveMenu(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeMenu]);

  if (status === "loading" && posts.length === 0) {
    return (
      <div className="flex justify-center my-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-center mb-3">Explore Posts</h2>
        <p className="text-gray-500 text-center mb-4">Discover the latest thoughts and ideas from our community</p>
        <hr className="w-1/2 mx-auto border-gray-200" />
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow" key={post._id}>
              {post.image ? (
                <div 
                  className="h-48 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${post.image})` }}
                ></div>
              ) : (
                <div className="h-48 bg-gray-100 flex justify-center items-center">
                  <FiFileText className="text-4xl text-gray-400" />
                </div>
              )}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-lg">{post.title}</h5>
                  {user && (user._id === post.author || user._id === post.author?._id) && (
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                        onClick={(e) => toggleMenu(post._id, e)}
                      >
                        <FiMoreVertical />
                      </button>
                      {activeMenu === post._id && (
                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10">
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => handleEdit(post._id)}
                          >
                            <FiEdit2 className="mr-2" />Edit
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                            onClick={() => handleDelete(post._id)}
                            disabled={isDeleting && deleteId === post._id}
                          >
                            {isDeleting && deleteId === post._id ? (
                              <>
                                <div className="w-4 h-4 mr-2 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <FiTrash2 className="mr-2" />Delete
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-4">
                  {post.content.length > 120
                    ? `${post.content.substring(0, 120)}...`
                    : post.content}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-blue-600">
                    By: {post?.author?.username ? `@${post?.author?.username}` : "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mb-4">
            <FiFileText className="text-6xl text-gray-400 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No posts found</h3>
          <p className="text-gray-500 mb-6">Be the first to share your thoughts with the community!</p>
          <Link to="/create" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
            Create Post
          </Link>
        </div>
      )}

      {user && (
        <div className="fixed bottom-6 right-6">
          <Link to="/create" className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors">
            <FiPlus className="text-xl" />
          </Link>
        </div>
      )}
    </div>
  );
}