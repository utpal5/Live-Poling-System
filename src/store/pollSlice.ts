import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Poll {
  id: string;
  question: string;
  options: string[];
  timeLimit: number;
  createdAt: string;
  isActive: boolean;
}

interface PollResults {
  [option: string]: number;
}

interface PollState {
  currentPoll: Poll | null;
  results: PollResults;
  timeRemaining: number;
  hasAnswered: boolean;
  userAnswer: string | null;
  pollHistory: Poll[];
}

const initialState: PollState = {
  currentPoll: null,
  results: {},
  timeRemaining: 0,
  hasAnswered: false,
  userAnswer: null,
  pollHistory: [],
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setCurrentPoll: (state, action: PayloadAction<Poll | null>) => {
      state.currentPoll = action.payload;
      if (action.payload) {
        state.timeRemaining = action.payload.timeLimit;
        state.hasAnswered = false;
        state.userAnswer = null;
      }
    },
    updateResults: (state, action: PayloadAction<PollResults>) => {
      state.results = action.payload;
    },
    decrementTime: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },
    setUserAnswer: (state, action: PayloadAction<string>) => {
      state.hasAnswered = true;
      state.userAnswer = action.payload;
    },
    setPollHistory: (state, action: PayloadAction<Poll[]>) => {
      state.pollHistory = action.payload;
    },
    resetTimer: (state) => {
      state.timeRemaining = state.currentPoll?.timeLimit || 0;
    },
  },
});

export const { 
  setCurrentPoll, 
  updateResults, 
  decrementTime, 
  setUserAnswer, 
  setPollHistory,
  resetTimer 
} = pollSlice.actions;

export default pollSlice.reducer;