import { createSlice } from '@reduxjs/toolkit';

const chatslice = createSlice({
  name: 'chat',
  initialState: {
    selectedUser: null,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const { setSelectedUser } = chatslice.actions;
export default chatslice.reducer;
