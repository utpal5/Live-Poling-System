import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setStudentName } from '../store/userSlice';
import { User } from 'lucide-react';

const StudentNameEntry: React.FC = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if student name is already stored in sessionStorage
    const savedName = sessionStorage.getItem('studentName');
    if (savedName) {
      dispatch(setStudentName(savedName));
    }
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      sessionStorage.setItem('studentName', name.trim());
      dispatch(setStudentName(name.trim()));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <User className="text-blue-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, Student!</h2>
          <p className="text-gray-600">Please enter your name to join the session</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your name..."
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Join Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentNameEntry;