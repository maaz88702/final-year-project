import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("jwt") || null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("jwt");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;