import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { socketService } from '../services/socket';
import { setCurrentPoll, updateResults, decrementTime, setUserAnswer, resetTimer } from '../store/pollSlice';
import { addMessage, setMessages } from '../store/chatSlice';
import PollQuestion from './PollQuestion';
import PollResults from './PollResults';
import ChatBox from './ChatBox';
import { Clock, Users } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { currentPoll, timeRemaining, hasAnswered } = useSelector((state: RootState) => state.poll);
  const { studentName } = useSelector((state: RootState) => state.user);
  const [isKicked, setIsKicked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = socketService.connect();
    
    socket.emit('join-student', studentName);

    socket.on('current-poll', (poll) => {
      dispatch(setCurrentPoll(poll));
      if (poll) {
        dispatch(resetTimer());
      }
    });

    socket.on('new-poll', (poll) => {
      dispatch(setCurrentPoll(poll));
      dispatch(resetTimer());
    });

    socket.on('poll-results', (pollResults) => {
      dispatch(updateResults(pollResults));
    });

    socket.on('poll-completed', () => {
      // Poll completed, show results
    });

    socket.on('new-message', (message) => {
      dispatch(addMessage(message));
    });

    socket.on('chat-history', (messages) => {
      dispatch(setMessages(messages));
    });

    socket.on('kicked', () => {
      setIsKicked(true);
    });

    return () => {
      socket.off('current-poll');
      socket.off('new-poll');
      socket.off('poll-results');
      socket.off('poll-completed');
      socket.off('new-message');
      socket.off('chat-history');
      socket.off('kicked');
    };
  }, [dispatch, studentName]);

  // Timer effect
  useEffect(() => {
    if (currentPoll && currentPoll.isActive && timeRemaining > 0 && !hasAnswered) {
      const timer = setInterval(() => {
        dispatch(decrementTime());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentPoll, timeRemaining, hasAnswered, dispatch]);

  const handleAnswerSubmit = (answer: string) => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('submit-answer', answer);
      dispatch(setUserAnswer(answer));
    }
  };

  if (isKicked) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="text-red-600 mb-4">
            <Users size={48} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Removed from Session</h2>
          <p className="text-gray-600">You have been removed from the polling session by the teacher.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600">Welcome, {studentName}!</p>
            </div>
            {currentPoll && currentPoll.isActive && timeRemaining > 0 && !hasAnswered && (
              <div className="flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                <Clock size={16} />
                <span className="font-medium">{timeRemaining}s remaining</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              {currentPoll ? (
                <>
                  {currentPoll.isActive && !hasAnswered && timeRemaining > 0 ? (
                    <PollQuestion 
                      poll={currentPoll}
                      onAnswerSubmit={handleAnswerSubmit}
                      timeRemaining={timeRemaining}
                    />
                  ) : (
                    <PollResults showTitle={true} />
                  )}
                </>
              ) : (
                <div className="p-12 text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Waiting for the teacher to ask questions...
                  </h3>
                  <p className="text-gray-600">
                    The teacher will start a poll soon. Stay tuned!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="w-80">
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;