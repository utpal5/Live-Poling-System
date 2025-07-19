import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  senderName: string;
  senderRole: 'teacher' | 'student';
  message: string;
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  isOpen: boolean;
}

const initialState: ChatState = {
  messages: [],
  isOpen: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    setChatOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { addMessage, setMessages, toggleChat, setChatOpen } = chatSlice.actions;
export default chatSlice.reducer;