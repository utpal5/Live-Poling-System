import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { socketService } from '../services/socket';
import { Users, UserX, CheckCircle, Clock } from 'lucide-react';

const StudentsList: React.FC = () => {
  const { students } = useSelector((state: RootState) => state.user);

  const handleKickStudent = (studentId: string) => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('kick-student', studentId);
    }
  };

  const formatJoinTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Students</h2>
          <p className="text-gray-600">Manage students in your session</p>
        </div>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          {students.length} Online
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Users className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Students Yet</h3>
          <p className="text-gray-600">Students will appear here when they join the session</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{student.name}</h3>
                    <p className="text-sm text-gray-500">
                      Joined at {formatJoinTime(student.joinedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Answer Status */}
                  <div className="flex items-center space-x-1">
                    {student.hasAnswered ? (
                      <>
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="text-sm text-green-600 font-medium">Answered</span>
                      </>
                    ) : (
                      <>
                        <Clock className="text-orange-600" size={16} />
                        <span className="text-sm text-orange-600 font-medium">Thinking...</span>
                      </>
                    )}
                  </div>

                  {/* Kick Button */}
                  <button
                    onClick={() => handleKickStudent(student.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Remove student"
                  >
                    <UserX size={16} />
                  </button>
                </div>
              </div>

              {/* Show answer if available */}
              {student.hasAnswered && student.answer && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <span className="text-sm text-gray-600">Answer: </span>
                    <span className="text-sm font-medium text-gray-800">{student.answer}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentsList;