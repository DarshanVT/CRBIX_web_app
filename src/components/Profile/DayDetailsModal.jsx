import React from 'react';
import { useTheme } from "../Profile/ThemeContext";

export default function DayDetailsModal({ 
  day, 
  onClose, 
  getDisplayProgress, 
  getProgressText,
  formatDuration,
  getDayOfWeek,
  getMonthName
}) {
  const { theme } = useTheme();
  const date = new Date(day.date);
  const isActive = day.isActiveDay;
  const progress = day.progressPercentage || 0;
  const watchedSeconds = day.watchedSeconds || 0;
  const videoDetails = day.videoDetails || [];

  const getColor = () => {
    if (!isActive) return theme === 'dark' ? '#374151' : '#E5E7EB';
    if (progress < 25) return theme === 'dark' ? '#451A03' : '#FEF3C7';
    if (progress < 50) return theme === 'dark' ? '#78350F' : '#FDE68A';
    if (progress < 75) return theme === 'dark' ? '#92400E' : '#FBBF24';
    if (progress < 100) return theme === 'dark' ? '#B45309' : '#F59E0B';
    return theme === 'dark' ? '#065F46' : '#10B981';
  };

  const getBorderColor = () => {
    const color = getColor();
    if (color === '#E5E7EB' || color === '#374151') return theme === 'dark' ? '#4B5563' : '#D1D5DB';
    return color;
  };

  const getTextColor = () => {
    if (!isActive) return theme === 'dark' ? '#9CA3AF' : '#6B7280';
    if (progress >= 75) return '#FFFFFF';
    return theme === 'dark' ? '#111827' : '#111827';
  };

  const getColorExplanation = () => {
    if (!isActive) return 'Gray: No activity on this day';
    if (progress < 25) return 'Light Yellow: 1-25% daily progress';
    if (progress < 50) return 'Yellow: 25-50% daily progress';
    if (progress < 75) return 'Orange: 50-75% daily progress';
    if (progress < 100) return 'Dark Orange: 75-99% daily progress';
    return 'Green: 100% daily goal achieved! 🎉';
  };

  const getProgressBarColor = () => {
    if (!isActive) return theme === 'dark' ? '#4B5563' : '#D1D5DB';
    if (progress < 25) return theme === 'dark' ? '#92400E' : '#FBBF24';
    if (progress < 50) return theme === 'dark' ? '#B45309' : '#F59E0B';
    if (progress < 75) return theme === 'dark' ? '#D97706' : '#EA580C';
    if (progress < 100) return theme === 'dark' ? '#059669' : '#10B981';
    return theme === 'dark' ? '#10B981' : '#059669';
  };

  const getStatusColor = () => {
    return isActive ? 
      (theme === 'dark' ? '#34D399' : '#10B981') : 
      (theme === 'dark' ? '#9CA3AF' : '#6B7280');
  };

  const getVideoProgressColor = (videoProgress) => {
    if (videoProgress >= 95) return theme === 'dark' ? '#10B981' : '#059669';
    if (videoProgress >= 75) return theme === 'dark' ? '#F59E0B' : '#D97706';
    if (videoProgress >= 50) return theme === 'dark' ? '#FBBF24' : '#F59E0B';
    return theme === 'dark' ? '#FDE68A' : '#FBBF24';
  };

  const getVideoProgressBarColor = (videoProgress) => {
    if (videoProgress >= 95) return theme === 'dark' ? '#10B981' : '#059669';
    if (videoProgress >= 75) return theme === 'dark' ? '#F59E0B' : '#D97706';
    if (videoProgress >= 50) return theme === 'dark' ? '#FBBF24' : '#F59E0B';
    return theme === 'dark' ? '#FDE68A' : '#FBBF24';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className={`${theme === 'dark' ? 'dark' : ''} bg-white dark:bg-gray-900 rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl ${theme === 'dark' ? 'shadow-gray-900/50' : 'shadow-xl'}`}>
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mr-3 border-2"
                style={{ 
                  backgroundColor: getColor(),
                  borderColor: getBorderColor()
                }}
              >
                <span className={`font-bold text-lg ${progress >= 75 ? 'text-white' : theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                  {date.getDate()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {getMonthName(date)} {date.getDate()}, {date.getFullYear()}
                </h3>
                <p className={`text-sm font-medium ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {getDayOfWeek(day.date)} • {isActive ? 'Active Day' : 'No Activity'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close modal"
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
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 border dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Progress</p>
                <p className="text-gray-900 dark:text-white text-2xl font-bold">
                  {getProgressText(progress)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Watch Time</p>
                <p className="text-blue-600 dark:text-blue-400 text-2xl font-bold">
                  {formatDuration(watchedSeconds)}
                </p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${getDisplayProgress(progress)}%`,
                  backgroundColor: getProgressBarColor()
                }}
              />
            </div>
            
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
              <span className="text-xs font-medium" style={{ color: getProgressBarColor() }}>
                {getProgressText(progress)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">100%</span>
            </div>
          </div>

          {/* Videos Watched */}
          {videoDetails.length > 0 ? (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Videos Watched
                </h4>
                <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                  {videoDetails.length} video{videoDetails.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-3">
                {videoDetails.map((video, index) => {
                  const videoProgress = video.videoProgress || 0;
                  const progressColor = getVideoProgressColor(videoProgress);
                  const progressBarColor = getVideoProgressBarColor(videoProgress);
                  
                  return (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                      <div className="flex items-start mb-3">
                        <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 dark:text-white text-sm font-medium line-clamp-2">
                            {video.videoTitle || 'Unknown Video'}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{
                              backgroundColor: `${progressColor}20`,
                              color: progressColor
                            }}>
                              {getProgressText(videoProgress)}% completed
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mx-2">•</span>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                              {formatDuration(video.watchedSeconds || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${getDisplayProgress(videoProgress)}%`,
                            backgroundColor: progressBarColor
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : isActive ? (
            <div className="text-center py-6 mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No video details available</p>
            </div>
          ) : (
            <div className="text-center py-6 mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No activity on this day</p>
            </div>
          )}

          {/* Color Explanation */}
          <div 
            className="rounded-xl p-4 border mt-4"
            style={{
              backgroundColor: theme === 'dark' ? 
                (getColor() === '#374151' ? '#37415140' : `${getColor()}40`) : 
                `${getColor()}20`,
              borderColor: theme === 'dark' ? 
                (getColor() === '#374151' ? '#4B5563' : `${getColor()}80`) : 
                getColor()
            }}
          >
            <div className="flex items-start">
              <div 
                className="w-8 h-8 rounded-md flex items-center justify-center mr-3 flex-shrink-0"
                style={{ 
                  backgroundColor: getColor(),
                  borderColor: getBorderColor()
                }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: getTextColor() }}>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-gray-900 dark:text-white text-sm font-medium mb-1">
                  Color Legend
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{getColorExplanation()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg active:scale-95 transition-transform duration-200"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}