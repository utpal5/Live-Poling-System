import React, { useState } from 'react';
import { Clock, CheckCircle } from 'lucide-react';

interface Poll {
  id: string;
  question: string;
  options: string[];
  timeLimit: number;
  isActive: boolean;
}

interface PollQuestionProps {
  poll: Poll;
  onAnswerSubmit: (answer: string) => void;
  timeRemaining: number;
}

const PollQuestion: React.FC<PollQuestionProps> = ({ poll, onAnswerSubmit, timeRemaining }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption && !isSubmitting) {
      setIsSubmitting(true);
      onAnswerSubmit(selectedOption);
    }
  };

  const progressPercentage = (timeRemaining / poll.timeLimit) * 100;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Question</h2>
          <div className="flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
            <Clock size={16} />
            <span className="font-medium">{timeRemaining}s</span>
          </div>
        </div>
        
        {/* Timer Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              progressPercentage > 50 ? 'bg-green-500' : 
              progressPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{poll.question}</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          {poll.options.map((option, index) => (
            <label
              key={index}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedOption === option
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="pollOption"
                  value={option}
                  checked={selectedOption === option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-lg font-medium text-gray-800">{option}</span>
                {selectedOption === option && (
                  <CheckCircle className="text-purple-600 ml-auto" size={20} />
                )}
              </div>
            </label>
          ))}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={!selectedOption || isSubmitting || timeRemaining === 0}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PollQuestion;