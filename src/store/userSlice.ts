import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Student {
  id: string;
  name: string;
  hasAnswered: boolean;
  answer: string | null;
  joinedAt: string;
}

interface UserState {
  role: 'teacher' | 'student' | null;
  studentName: string;
  students: Student[];
}

const initialState: UserState = {
  role: null,
  studentName: '',
  students: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<'teacher' | 'student'>) => {
      state.role = action.payload;
    },
    setStudentName: (state, action: PayloadAction<string>) => {
      state.studentName = action.payload;
    },
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
    },
  },
});

export const { setRole, setStudentName, setStudents } = userSlice.actions;
export default userSlice.reducer;