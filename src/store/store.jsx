import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authslice';
import chatReducer from './chatslice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

export default store;
