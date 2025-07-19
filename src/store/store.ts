import { configureStore } from '@reduxjs/toolkit';
import pollReducer from './pollSlice';
import userReducer from './userSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    poll: pollReducer,
    user: userReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;