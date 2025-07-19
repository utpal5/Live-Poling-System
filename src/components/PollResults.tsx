import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { BarChart3, Users, CheckCircle } from 'lucide-react';

interface PollResultsProps {
  showTitle?: boolean;
}

const PollResults: React.FC<PollResultsProps> = ({ showTitle = false }) => {
  const { currentPoll, results, userAnswer } = useSelector((state: RootState) => state.poll);
  const { role } = useSelector((state: RootState) => state.user);

  if (!currentPoll) {
    return (
      <div className="p-6 text-center">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="text-gray-400" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Poll Results</h3>
        <p className="text-gray-600">Results will appear here once a poll is created.</p>
      </div>
    );
  }

  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  const getBarColor = (option: string) => {
    if (role === 'student' && userAnswer === option) {
      return 'bg-purple-500';
    }
    return 'bg-blue-500';
  };

  const getBackgroundColor = (option: string) => {
    if (role === 'student' && userAnswer === option) {
      return 'bg-purple-50 border-purple-200';
    }
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="p-6">
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Poll Results</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users size={16} />
              <span>{totalVotes} votes</span>
            </div>
            {role === 'student' && userAnswer && (
              <div className="flex items-center space-x-1 text-purple-600">
                <CheckCircle size={16} />
                <span>Your answer submitted</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{currentPoll.question}</h3>
      </div>

      <div className="space-y-4">
        {currentPoll.options.map((option, index) => {
          const votes = results[option] || 0;
          const percentage = getPercentage(votes);
          
          return (
            <div
              key={index}
              className={`border-2 rounded-lg p-4 transition-all ${getBackgroundColor(option)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">{option}</span>
                  {role === 'student' && userAnswer === option && (
                    <CheckCircle className="text-purple-600" size={16} />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">{votes} votes</span>
                  <span className="text-lg font-bold text-gray-800">{percentage}%</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getBarColor(option)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {totalVotes === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No votes yet. Waiting for students to respond...</p>
        </div>
      )}
    </div>
  );
};

export default PollResults;