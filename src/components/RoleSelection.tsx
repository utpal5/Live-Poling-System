import React from 'react';
import { useDispatch } from 'react-redux';
import { setRole } from '../store/userSlice';
import { GraduationCap, Users } from 'lucide-react';

const RoleSelection: React.FC = () => {
  const dispatch = useDispatch();

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    dispatch(setRole(role));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Live Polling System</h1>
          <p className="text-gray-600">Choose your role to get started</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect('teacher')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-3"
          >
            <GraduationCap size={24} />
            <span>Join as Teacher</span>
          </button>
          
          <button
            onClick={() => handleRoleSelect('student')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-3"
          >
            <Users size={24} />
            <span>Join as Student</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;