// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    selectedUser: null,
    status: 'offline',
  },
  reducers: {
    setuser(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.status = 'online';
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.selectedUser = null;
      state.status = 'offline';
    },
    updateStatus(state, action) {
      state.status = action.payload;
    },
    updateUserImage(state, action) {
      if (state.user) {
        state.user.imageurl = action.payload;
      }
    },
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
  },
});

export const { setuser, logout, updateStatus, updateUserImage, setSelectedUser } = authSlice.actions;
export default authSlice.reducer;
