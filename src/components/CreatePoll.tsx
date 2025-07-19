import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { socketService } from '../services/socket';
import { Plus, Trash2, Clock } from 'lucide-react';

const CreatePoll: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);
  const [isCreating, setIsCreating] = useState(false);
  const { currentPoll } = useSelector((state: RootState) => state.poll);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    const validOptions = options.filter(opt => opt.trim()).map(opt => opt.trim());
    if (validOptions.length < 2) return;

    setIsCreating(true);
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('create-poll', {
        question: question.trim(),
        options: validOptions,
        timeLimit
      });
    }

    // Reset form
    setQuestion('');
    setOptions(['', '']);
    setTimeLimit(60);
    setIsCreating(false);
  };

  const canCreatePoll = !currentPoll || !currentPoll.isActive;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Poll</h2>
        <p className="text-gray-600">Ask a question and let students respond in real-time</p>
      </div>

      {!canCreatePoll && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Clock className="text-orange-600 mr-2" size={20} />
            <span className="text-orange-800 font-medium">
              A poll is currently active. Wait for all students to answer or end the current poll to create a new one.
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question Input */}
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
            Question *
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="What would you like to ask your students?"
            rows={3}
            required
            disabled={!canCreatePoll}
          />
        </div>

        {/* Time Limit */}
        <div>
          <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-2">
            Time Limit (seconds)
          </label>
          <select
            id="timeLimit"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            disabled={!canCreatePoll}
          >
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={180}>3 minutes</option>
            <option value={300}>5 minutes</option>
          </select>
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Answer Options * (minimum 2)
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder={`Option ${index + 1}`}
                    disabled={!canCreatePoll}
                  />
                </div>
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={!canCreatePoll}
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="mt-3 flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
              disabled={!canCreatePoll}
            >
              <Plus size={20} />
              <span>Add Option</span>
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!canCreatePoll || isCreating || !question.trim() || options.filter(opt => opt.trim()).length < 2}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {isCreating ? 'Creating Poll...' : 'Ask Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePoll;