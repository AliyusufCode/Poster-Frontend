import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchRemoveComment = createAsyncThunk(
  "/comments/fetchRemoveComment",
  async (id) => {
    axios.delete(`/comments/${id}`);
  }
);

export const fetchComments = createAsyncThunk(
  "/comments/fetchComments",
  async () => {
    const { data } = await axios.get("/comments");
    return data;
  }
);

const initialState = {
  comments: {
    items: [],
    status: "loading",
  },
};

export const commetnsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchComments.pending]: (state) => {
      state.comments.items = [];
      state.comments.status = "loading";
    },
    [fetchComments.fulfilled]: (state, actions) => {
      state.comments.items = actions.payload;
      state.comments.status = "loaded";
    },
    [fetchComments.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = "error";
    },
  },
});

export default commetnsSlice.reducer;
