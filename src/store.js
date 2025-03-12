import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import postsReducer from './posts/postSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;