import { configureStore } from '@reduxjs/toolkit';
import questionsReducer from '../features/questions/questionSlice';
import userReducer from '../features/user/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    questions: questionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
