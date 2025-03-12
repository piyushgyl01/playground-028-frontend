import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create API instance with auth interceptor
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000"
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Create post thunk
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await api.post("/posts", postData);
      return response.data.post;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Get all posts thunk
export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/posts");
      return response.data.posts;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Update post thunk
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/posts/${id}`, postData);
      return response.data.post;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Delete post thunk
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearPostErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all posts
      .addCase(getAllPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch posts";
      })

      // Create post
      .addCase(createPost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to create post";
      })

      // Update post
      .addCase(updatePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to update post";
      })

      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to delete post";
      });
  },
});

// Export the API instance for other slices to use
export { api };

export const { clearPostErrors } = postsSlice.actions;
export default postsSlice.reducer;