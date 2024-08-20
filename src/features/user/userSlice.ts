import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

export interface UserState {
  name: string;
  score: number;
  subject: string | null;
}

const initialState: UserState = {
  name: '',
  score: 0,
  subject: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setSubject: (state, action: PayloadAction<string>) => {
      state.subject = action.payload;
    },
    incrementScore: (state, action: PayloadAction<number | undefined>) => {
      state.score += action.payload ?? 1; // Incrementa a pontuação pelo valor fornecido ou 1 como padrão
    },
    resetScore: (state) => {
      state.score = 0;
    },
  },
});

export const { setName, setSubject, incrementScore, resetScore } =
  userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
