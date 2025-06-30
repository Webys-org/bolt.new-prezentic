import React from 'react';
import { Play, Pause, Square, SkipForward, SkipBack, Mic, MicOff, Settings, AlertCircle, Users, PlayCircle, Zap, Volume2 } from 'lucide-react';

interface PresentationControlsProps {
  isNarrating: boolean;
  isPaused: boolean;
  currentSlide: number;
  totalSlides: number;
  onStartSlidePresentation: () => void;
  onStartAutoAdvancePresentation: () => void;
  onStopNarration: () => void;
  onPauseNarration: () => void;
  onResumeNarration: () => void;
  onNextSlide: () => void;
  onPreviousSlide: () => void;
  status: string;
  hasVapiKey: boolean;
  onOpenSettings: () => void;
  currentSlideTitle: string;
  isAutoAdvanceMode: boolean;
}

export const PresentationControls: React.FC<PresentationControlsProps> = ({
  isNarrating,
  isPaused,
  currentSlide,
  totalSlides,
  onStartSlidePresentation,
  onStartAutoAdvancePresentation,
  onStopNarration,
  onPauseNarration,
  onResumeNarration,
  onNextSlide,
  onPreviousSlide,
  status,
  hasVapiKey,
  onOpenSettings,
  currentSlideTitle,
  isAutoAdvanceMode
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'speaking': return 'text-blue-600';
      case 'paused': return 'text-yellow-600';
      case 'stopped': return 'text-gray-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    if (isAutoAdvanceMode) {
      switch (status) {
        case 'connected': return 'Auto-Advance Ready';
        case 'speaking': return 'Auto-Advancing';
        case 'paused': return 'Auto-Advance Paused';
        case 'stopped': return 'Auto-Advance Complete';
        case 'error': return 'Auto-Advance Error';
        default: return 'Auto-Advance Ready';
      }
    } else {
      switch (status) {
        case 'connected': return 'Presenter Ready';
        case 'speaking': return 'Presenting';
        case 'paused': return 'Paused';
        case 'stopped': return 'Complete';
        case 'error': return 'Error';
        default: return 'Ready';
      }
    }
  };

  const getStatusIcon = () => {
    if (isAutoAdvanceMode) {
      switch (status) {
        case 'connected':
          return <Zap className="w-3 h-3 md:w-4 md:h-4" />;
        case 'speaking':
          return <div className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />;
        case 'error':
          return <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />;
        default:
          return <PlayCircle className="w-3 h-3 md:w-4 md:h-4" />;
      }
    } else {
      switch (status) {
        case 'connected':
          return <Volume2 className="w-3 h-3 md:w-4 md:h-4" />;
        case 'speaking':
          return <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full animate-pulse" />;
        case 'error':
          return <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />;
        default:
          return <MicOff className="w-3 h-3 md:w-4 md:h-4" />;
      }
    }
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-100 p-3 md:p-8 mb-4 md:mb-8">
      {/* Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-6 gap-3">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg md:rounded-xl ${
              status === 'error' ? 'bg-red-50 border border-red-200' : 
              isNarrating ? (isAutoAdvanceMode ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200' : 'bg-blue-50 border border-blue-200') : 'bg-gray-50 border border-gray-200'
            }`}>
              {getStatusIcon()}
              <span className={`font-semibold text-xs md:text-sm ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
          </div>
          
          {isNarrating && status !== 'error' && (
            <div className={`flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600 px-3 py-2 rounded-lg md:rounded-xl border ${
              isAutoAdvanceMode 
                ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full animate-pulse ${
                isAutoAdvanceMode ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-blue-500'
              }`}></div>
              <span className="font-medium">
                {isAutoAdvanceMode 
                  ? 'Auto-Advancing' 
                  : 'Presenting'
                }
              </span>
            </div>
          )}
        </div>

        <div className="text-xs md:text-sm text-gray-600 font-semibold bg-gray-50 px-3 py-2 rounded-lg md:rounded-xl border border-gray-200">
          Slide {currentSlide + 1} of {totalSlides}
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {!isNarrating ? (
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {/* Auto-Advance Presentation Button */}
              <button
                onClick={onStartAutoAdvancePresentation}
                disabled={!hasVapiKey}
                className="flex items-center gap-1 md:gap-3 px-3 py-2 md:px-8 md:py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white rounded-lg md:rounded-xl hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none text-xs md:text-base"
              >
                <Zap className="w-3 h-3 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Auto-Present All</span>
                <span className="sm:hidden">Auto</span>
              </button>
              
              {/* Single Slide Presentation Button */}
              <button
                onClick={onStartSlidePresentation}
                disabled={!hasVapiKey}
                className="flex items-center gap-1 md:gap-3 px-3 py-2 md:px-8 md:py-4 bg-blue-600 text-white rounded-lg md:rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none text-xs md:text-base"
              >
                <Volume2 className="w-3 h-3 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Present This Slide</span>
                <span className="sm:hidden">Present</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              {isPaused ? (
                <button
                  onClick={onResumeNarration}
                  className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 bg-green-600 text-white rounded-lg md:rounded-xl hover:bg-green-700 transition-all font-semibold shadow-md hover:shadow-lg text-xs md:text-base"
                >
                  <Play className="w-3 h-3 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Resume</span>
                </button>
              ) : (
                <button
                  onClick={onPauseNarration}
                  className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 bg-yellow-600 text-white rounded-lg md:rounded-xl hover:bg-yellow-700 transition-all font-semibold shadow-md hover:shadow-lg text-xs md:text-base"
                >
                  <Pause className="w-3 h-3 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Pause</span>
                </button>
              )}
              
              <button
                onClick={onStopNarration}
                className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 bg-red-600 text-white rounded-lg md:rounded-xl hover:bg-red-700 transition-all font-semibold shadow-md hover:shadow-lg text-xs md:text-base"
              >
                <Square className="w-3 h-3 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Stop</span>
              </button>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center gap-1 md:gap-2 ml-0 md:ml-6 bg-gray-50 rounded-lg md:rounded-xl p-1 md:p-2 border border-gray-200">
            <button
              onClick={onPreviousSlide}
              disabled={currentSlide === 0 || (isAutoAdvanceMode && isNarrating)}
              className="p-2 md:p-3 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              title={isAutoAdvanceMode && isNarrating ? "Navigation disabled during auto-advance" : "Previous Slide"}
            >
              <SkipBack className="w-3 h-3 md:w-5 md:h-5" />
            </button>
            
            <button
              onClick={onNextSlide}
              disabled={currentSlide === totalSlides - 1 || (isAutoAdvanceMode && isNarrating)}
              className="p-2 md:p-3 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              title={isAutoAdvanceMode && isNarrating ? "Navigation disabled during auto-advance" : "Next Slide"}
            >
              <SkipForward className="w-3 h-3 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg md:rounded-xl transition-all shadow-sm hover:shadow-md text-xs md:text-base"
          title="API Settings"
        >
          <Settings className="w-3 h-3 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>

      {/* Current Slide Info */}
      <div className="mt-3 md:mt-6 p-2 md:p-4 bg-gray-50 rounded-lg md:rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h4 className="font-semibold text-gray-900 text-xs md:text-base mb-0.5 md:mb-1">Current Slide:</h4>
            <p className="text-xs md:text-sm text-gray-600 truncate">"{currentSlideTitle}"</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] md:text-xs text-gray-500 font-medium">
              {isAutoAdvanceMode ? 'Auto-Advance Mode' : 'Manual Presentation Mode'}
            </div>
            <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">
              {isAutoAdvanceMode ? 'Automatic progression' : 'Single slide delivery'}
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {!hasVapiKey && (
        <div className="mt-3 md:mt-6 p-3 md:p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg md:rounded-xl">
          <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-amber-900 font-semibold mb-1 text-sm md:text-base">AI Presenter Configuration Required</p>
              <p className="text-amber-800 text-xs md:text-sm">
                Please configure your Vapi.ai API key to enable both single slide and auto-advance presentation modes with human-like emotional narration.
              </p>
            </div>
          </div>
        </div>
      )}

      {isNarrating && status === 'speaking' && (
        <div className={`mt-3 md:mt-6 p-3 md:p-6 rounded-lg md:rounded-xl border ${
          isAutoAdvanceMode 
            ? 'bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 border-purple-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h4 className={`font-semibold mb-2 md:mb-3 flex items-center gap-1 md:gap-2 text-sm md:text-base ${
            isAutoAdvanceMode ? 'text-purple-900' : 'text-blue-900'
          }`}>
            <div className={`w-2 h-2 md:w-4 md:h-4 rounded-full animate-pulse ${
              isAutoAdvanceMode ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-blue-500'
            }`} />
            {isAutoAdvanceMode ? 'Auto-Advance Presentation Active' : 'Single Slide Presentation Active'}
          </h4>
          <div className={`text-xs md:text-sm space-y-1 md:space-y-2 ${
            isAutoAdvanceMode ? 'text-purple-700' : 'text-blue-700'
          }`}>
            {isAutoAdvanceMode ? (
              <>
                <p>• AI presenter is automatically advancing through ALL slides</p>
                <p className="hidden md:block">• Each slide will be presented completely before auto-advancing</p>
                <p className="hidden md:block">• Professional pacing with natural emotional transitions between slides</p>
                <p>• Manual navigation is disabled during auto-advance mode</p>
                <p className="hidden md:block">• Real-time word highlighting shows exact progress through speaker notes</p>
              </>
            ) : (
              <>
                <p>• AI presenter is delivering current slide content with emotional emphasis</p>
                <p className="hidden md:block">• Professional delivery with natural pauses and dramatic emphasis</p>
                <p>• Presentation will complete and stop on this slide</p>
                <p className="hidden md:block">• Real-time word highlighting shows exact progress through speaker notes</p>
              </>
            )}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-3 md:mt-6 p-3 md:p-6 bg-red-50 border border-red-200 rounded-lg md:rounded-xl">
          <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-900 font-semibold mb-1 text-sm md:text-base">Presentation Error</p>
              <p className="text-red-800 text-xs md:text-sm">
                There was an issue with the AI presenter. Please check your API key and internet connection, then try again.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};