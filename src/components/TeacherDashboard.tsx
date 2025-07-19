import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { socketService } from '../services/socket';
import { setCurrentPoll, updateResults, setPollHistory } from '../store/pollSlice';
import { setStudents } from '../store/userSlice';
import { addMessage, setMessages } from '../store/chatSlice';
import CreatePoll from './CreatePoll';
import PollResults from './PollResults';
import StudentsList from './StudentsList';
import ChatBox from './ChatBox';
import PollHistory from './PollHistory';
import { Plus, BarChart3, Users, MessageCircle, History, Settings } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create');
  const { currentPoll, results } = useSelector((state: RootState) => state.poll);
  const { students } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = socketService.connect();
    
    socket.emit('join-teacher');

    socket.on('current-poll', (poll) => {
      dispatch(setCurrentPoll(poll));
    });

    socket.on('poll-results', (pollResults) => {
      dispatch(updateResults(pollResults));
    });

    socket.on('students-list', (studentsList) => {
      dispatch(setStudents(studentsList));
    });

    socket.on('new-message', (message) => {
      dispatch(addMessage(message));
    });

    socket.on('chat-history', (messages) => {
      dispatch(setMessages(messages));
    });

    socket.on('poll-history', (history) => {
      dispatch(setPollHistory(history));
    });

    return () => {
      socket.off('current-poll');
      socket.off('poll-results');
      socket.off('students-list');
      socket.off('new-message');
      socket.off('chat-history');
      socket.off('poll-history');
    };
  }, [dispatch]);

  const handleEndPoll = () => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('end-poll');
    }
  };

  const tabs = [
    { id: 'create', label: 'Create Poll', icon: Plus },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600">Manage polls and interact with students</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {students.length} Students Online
              </div>
              {currentPoll && currentPoll.isActive && (
                <button
                  onClick={handleEndPoll}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  End Poll
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm">
              {activeTab === 'create' && <CreatePoll />}
              {activeTab === 'results' && <PollResults />}
              {activeTab === 'students' && <StudentsList />}
              {activeTab === 'history' && <PollHistory />}
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

export default TeacherDashboard;