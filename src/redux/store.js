import { configureStore } from "@reduxjs/toolkit";
import postsRedusers from "./slices/PostSlice";
import authRedusers from "./slices/AuthSlice";
import commentsReducer from "./slices/CommentSlice";

const store = configureStore({
  reducer: {
    posts: postsRedusers,
    auth: authRedusers,
    comments: commentsReducer,
  },
});

export default store;
