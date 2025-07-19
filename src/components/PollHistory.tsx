import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { socketService } from '../services/socket';
import { setPollHistory } from '../store/pollSlice';
import { History, BarChart3, Clock, Users } from 'lucide-react';

const PollHistory: React.FC = () => {
  const { pollHistory } = useSelector((state: RootState) => state.poll);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('get-poll-history');
      
      socket.on('poll-history', (history) => {
        dispatch(setPollHistory(history));
      });

      return () => {
        socket.off('poll-history');
      };
    }
  }, [dispatch]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTotalVotes = (results: any) => {
    return Object.values(results).reduce((sum: number, count: any) => sum + count, 0);
  };

  const getWinningOption = (poll: any) => {
    if (!poll.results) return null;
    
    let maxVotes = 0;
    let winningOption = '';
    
    Object.entries(poll.results).forEach(([option, votes]: [string, any]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        winningOption = option;
      }
    });
    
    return winningOption;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Poll History</h2>
        <p className="text-gray-600">View results from previous polls</p>
      </div>

      {pollHistory.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <History className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Poll History</h3>
          <p className="text-gray-600">Completed polls will appear here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pollHistory
            .slice()
            .reverse()
            .map((poll: any) => {
              const totalVotes = getTotalVotes(poll.results || {});
              const winningOption = getWinningOption(poll);
              
              return (
                <div key={poll.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {poll.question}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>Completed: {formatDate(poll.completedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users size={14} />
                          <span>{totalVotes} responses</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Completed
                    </div>
                  </div>

                  {/* Winner */}
                  {winningOption && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="text-yellow-600" size={16} />
                        <span className="text-sm text-yellow-800">
                          <strong>Most Popular:</strong> {winningOption} ({poll.results[winningOption]} votes)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Results */}
                  <div className="space-y-3">
                    {poll.options.map((option: string, index: number) => {
                      const votes = poll.results?.[option] || 0;
                      const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                      const isWinner = option === winningOption;
                      
                      return (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-medium ${isWinner ? 'text-yellow-800' : 'text-gray-700'}`}>
                                {option}
                              </span>
                              <span className="text-sm text-gray-500">
                                {votes} votes ({percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${isWinner ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default PollHistory;