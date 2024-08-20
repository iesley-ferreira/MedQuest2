import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store/store';

export interface Exam {
  examId: number;
  nome: string;
  ano: string;
  edital: string;
  descrição: string;
  processoSeletivo: number;
  questions: Question[];
}

export interface Alternative {
  id: number;
  description: string;
}

export interface Question {
  questionId: number;
  question: string;
  questionYear: string;
  scope: string;
  alternatives: Alternative[];
  rightAlternativeId: number;
  image?: string;
}

interface QuestionsState {
  questions: Question[];
  filteredQuestions: Question[];

  disableAlternatives: boolean;
}

const initialState: QuestionsState = {
  questions: [],
  filteredQuestions: [],
  disableAlternatives: false,
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    setFilteredQuestions: (state, action: PayloadAction<Question[]>) => {
      state.filteredQuestions = action.payload;
    },
    disableAlternatives: (state) => {
      state.disableAlternatives = true; // Desabilita alternativas
    },
    enableAlternatives: (state) => {
      state.disableAlternatives = false; // Habilita alternativas
    },
  },
});

export const {
  setQuestions,
  setFilteredQuestions,
  disableAlternatives,
  enableAlternatives,
} = questionsSlice.actions;

// Selector para acessar as questões do estado global
export const selectQuestions = (state: RootState) => state.questions.questions;

export const selectFilteredQuestions = (state: RootState) =>
  state.questions.filteredQuestions;

// Função para buscar e filtrar as questões
export const fetchQuestions =
  (subject: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await fetch('/public/Exams/GHC'); // Caminho para os arquivos JSON
      const exams = await response.json();

      const filteredQuestions: Question[] = exams.flatMap((exam: Exam) =>
        exam.questions.filter(
          (question: Question) => question.scope === subject
        )
      );

      dispatch(setQuestions(filteredQuestions));
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

export default questionsSlice.reducer;
