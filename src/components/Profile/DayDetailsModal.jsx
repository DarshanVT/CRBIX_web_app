import React from 'react';

export default function DayDetailsModal({ 
  day, 
  onClose, 
  getDisplayProgress, 
  getProgressText,
  formatDuration,
  getDayOfWeek,
  getMonthName
}) {
  const date = new Date(day.date);
  const isActive = day.isActiveDay;
  const progress = day.progressPercentage || 0;
  const watchedSeconds = day.watchedSeconds || 0;
  const videoDetails = day.videoDetails || [];

  const getColor = () => {
    if (!isActive) return '#E5E7EB';
    if (progress < 25) return '#FEF3C7';
    if (progress < 50) return '#FDE68A';
    if (progress < 75) return '#FBBF24';
    if (progress < 100) return '#F59E0B';
    return '#10B981';
  };

  const getColorExplanation = () => {
    if (!isActive) return 'Gray: No activity on this day';
    if (progress < 25) return 'Light Yellow: 1-25% daily progress';
    if (progress < 50) return 'Yellow: 25-50% daily progress';
    if (progress < 75) return 'Orange: 50-75% daily progress';
    if (progress < 100) return 'Dark Orange: 75-99% daily progress';
    return 'Green: 100% daily goal achieved! 🎉';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 border"
                style={{ 
                  backgroundColor: getColor(),
                  borderColor: getColor() === '#E5E7EB' ? '#D1D5DB' : getColor()
                }}
              >
                <span className={`font-bold ${isActive ? 'text-black' : 'text-gray-600'}`}>
                  {date.getDate()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {getMonthName(date)} {date.getDate()}, {date.getFullYear()}
                </h3>
                <p className={`text-sm ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {getDayOfWeek(day.date)} • {isActive ? 'Active Day' : 'No Activity'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Progress Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-gray-600 text-sm">Progress</p>
                <p className="text-gray-900 text-2xl font-bold">
                  {getProgressText(progress)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm">Watch Time</p>
                <p className="text-blue-600 text-2xl font-bold">
                  {formatDuration(watchedSeconds)}
                </p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${getDisplayProgress(progress)}%`,
                  backgroundColor: getColor()
                }}
              />
            </div>
          </div>

          {/* Videos Watched */}
          {videoDetails.length > 0 ? (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                Videos Watched ({videoDetails.length})
              </h4>
              
              <div className="space-y-3">
                {videoDetails.map((video, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-start mb-2">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-900 text-sm line-clamp-2">
                        {video.videoTitle || 'Unknown Video'}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 text-xs">
                        {getProgressText(video.videoProgress || 0)}% completed
                      </span>
                      <span className="text-blue-600 text-xs">
                        {formatDuration(video.watchedSeconds || 0)}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full bg-blue-500"
                        style={{
                          width: `${getDisplayProgress(video.videoProgress || 0)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isActive ? (
            <div className="text-center py-4">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-sm">No video details available</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-sm">No activity on this day</p>
            </div>
          )}

          {/* Color Explanation */}
          <div 
            className="rounded-lg p-3 mt-4 border"
            style={{
              backgroundColor: getColor().replace(')', ', 0.1)').replace('rgb', 'rgba'),
              borderColor: getColor()
            }}
          >
            <div className="flex items-start">
              <svg className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: getColor() }}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700 text-sm">{getColorExplanation()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}