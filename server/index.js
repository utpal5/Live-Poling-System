import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
let currentPoll = null;
let pollHistory = [];
let students = new Map();
let pollResults = new Map();
let chatMessages = [];

// Utility functions
const generatePollId = () => uuidv4();

const resetPollResults = () => {
  pollResults.clear();
  students.forEach((student, socketId) => {
    students.set(socketId, { ...student, hasAnswered: false, answer: null });
  });
};

const calculateResults = () => {
  const results = {};
  if (!currentPoll) return results;

  currentPoll.options.forEach(option => {
    results[option] = 0;
  });

  pollResults.forEach(answer => {
    if (results.hasOwnProperty(answer)) {
      results[answer]++;
    }
  });

  return results;
};

const checkAllStudentsAnswered = () => {
  const totalStudents = students.size;
  const answeredStudents = Array.from(students.values()).filter(s => s.hasAnswered).length;
  return totalStudents > 0 && answeredStudents === totalStudents;
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Teacher joins
  socket.on('join-teacher', () => {
    socket.join('teachers');
    socket.emit('current-poll', currentPoll);
    socket.emit('poll-results', calculateResults());
    socket.emit('students-list', Array.from(students.values()));
    socket.emit('chat-history', chatMessages);
    console.log('Teacher joined');
  });

  // Student joins
  socket.on('join-student', (studentName) => {
    const student = {
      id: socket.id,
      name: studentName,
      hasAnswered: false,
      answer: null,
      joinedAt: new Date()
    };
    
    students.set(socket.id, student);
    socket.join('students');
    
    // Send current poll to student
    socket.emit('current-poll', currentPoll);
    socket.emit('chat-history', chatMessages);
    
    // Notify teachers about new student
    io.to('teachers').emit('students-list', Array.from(students.values()));
    
    console.log('Student joined:', studentName);
  });

  // Create new poll
  socket.on('create-poll', (pollData) => {
    if (currentPoll && !checkAllStudentsAnswered()) {
      socket.emit('error', 'Cannot create new poll while current poll is active');
      return;
    }

    currentPoll = {
      id: generatePollId(),
      question: pollData.question,
      options: pollData.options,
      timeLimit: pollData.timeLimit || 60,
      createdAt: new Date(),
      isActive: true
    };

    resetPollResults();
    
    // Broadcast new poll to all users
    io.emit('new-poll', currentPoll);
    
    console.log('New poll created:', currentPoll.question);
  });

  // Submit answer
  socket.on('submit-answer', (answer) => {
    if (!currentPoll || !currentPoll.isActive) {
      socket.emit('error', 'No active poll');
      return;
    }

    const student = students.get(socket.id);
    if (!student) {
      socket.emit('error', 'Student not found');
      return;
    }

    if (student.hasAnswered) {
      socket.emit('error', 'Already answered this poll');
      return;
    }

    // Update student status
    student.hasAnswered = true;
    student.answer = answer;
    students.set(socket.id, student);

    // Store the answer
    pollResults.set(socket.id, answer);

    // Send updated results to everyone
    const results = calculateResults();
    io.emit('poll-results', results);
    io.to('teachers').emit('students-list', Array.from(students.values()));

    // Check if all students have answered
    if (checkAllStudentsAnswered()) {
      currentPoll.isActive = false;
      pollHistory.push({
        ...currentPoll,
        results: results,
        completedAt: new Date()
      });
      io.emit('poll-completed');
    }

    console.log('Answer submitted:', student.name, answer);
  });

  // End poll manually
  socket.on('end-poll', () => {
    if (currentPoll) {
      currentPoll.isActive = false;
      const results = calculateResults();
      pollHistory.push({
        ...currentPoll,
        results: results,
        completedAt: new Date()
      });
      io.emit('poll-completed');
      io.emit('poll-results', results);
    }
  });

  // Get poll history
  socket.on('get-poll-history', () => {
    socket.emit('poll-history', pollHistory);
  });

  // Chat message
  socket.on('send-message', (messageData) => {
    const message = {
      id: uuidv4(),
      ...messageData,
      timestamp: new Date()
    };
    chatMessages.push(message);
    io.emit('new-message', message);
  });

  // Kick student
  socket.on('kick-student', (studentId) => {
    const studentSocket = io.sockets.sockets.get(studentId);
    if (studentSocket) {
      studentSocket.emit('kicked');
      studentSocket.disconnect();
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (students.has(socket.id)) {
      const student = students.get(socket.id);
      students.delete(socket.id);
      pollResults.delete(socket.id);
      
      // Notify teachers about student leaving
      io.to('teachers').emit('students-list', Array.from(students.values()));
      
      console.log('Student disconnected:', student.name);
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});