import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Volume2, Download, Maximize, Minimize, PlayCircle, Edit3, Save, X, Palette, Layout, Upload, Plus, FileText, Camera, Type } from 'lucide-react';
import { Slide, SlideStyle } from '../types/presentation';
import { SlideEditor } from './SlideEditor';
import { SlidePhotoEditor } from './SlidePhotoEditor';
import { SimpleSlideTextEditor } from './SimpleSlideTextEditor';
import { PresentationUploader } from './PresentationUploader';
import { PPTXImportModal } from './PPTXImportModal';

interface SlideViewerProps {
  slides: Slide[];
  currentSlide: number;
  onSlideChange: (index: number) => void;
  onGenerateImage: (slide: Slide) => void;
  onNarrate: (slide: Slide) => void;
  onUpdateSlideNotes?: (slideId: string, newNotes: string) => void;
  onUpdateSlide?: (slideId: string, updatedSlide: Partial<Slide>) => void;
  onDeleteSlide?: (slideId: string) => void;
  onAddSlide?: (afterIndex: number, slideType: 'text' | 'image' | 'blank') => void;
  onDuplicateSlide?: (slideId: string) => void;
  onMoveSlide?: (slideId: string, direction: 'up' | 'down') => void;
  onImportPresentation?: (presentation: any) => void;
  onImportSlides?: (slides: Slide[]) => void;
  isGeneratingImage: boolean;
  isNarrating: boolean;
  narrationStatus?: string;
  wordProgress?: { spoken: number; total: number };
  isAutoAdvanceMode?: boolean;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  slides,
  currentSlide,
  onSlideChange,
  onGenerateImage,
  onNarrate,
  onUpdateSlideNotes,
  onUpdateSlide,
  onDeleteSlide,
  onAddSlide,
  onDuplicateSlide,
  onMoveSlide,
  onImportPresentation,
  onImportSlides,
  isGeneratingImage,
  isNarrating,
  narrationStatus = 'idle',
  wordProgress = { spoken: 0, total: 0 },
  isAutoAdvanceMode = false
}) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showPPTXImport, setShowPPTXImport] = useState(false);
  const [showFullscreenControls, setShowFullscreenControls] = useState(true);
  const speakerNotesRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const slide = slides[currentSlide];

  // Enhanced fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls in fullscreen after 3 seconds of inactivity
  useEffect(() => {
    if (isFullscreen) {
      const resetTimeout = () => {
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        setShowFullscreenControls(true);
        controlsTimeoutRef.current = setTimeout(() => {
          setShowFullscreenControls(false);
        }, 3000);
      };

      const handleMouseMove = () => resetTimeout();
      const handleKeyPress = () => resetTimeout();

      resetTimeout();
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('keydown', handleKeyPress);

      return () => {
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isFullscreen]);

  const handlePrevious = () => {
    if (isAutoAdvanceMode && isNarrating) return;
    if (currentSlide > 0) {
      onSlideChange(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (isAutoAdvanceMode && isNarrating) return;
    if (currentSlide < slides.length - 1) {
      onSlideChange(currentSlide + 1);
    }
  };

  const handleImageError = (slideId: string) => {
    console.error('Image failed to load for slide:', slideId);
    setImageErrors(prev => new Set(prev).add(slideId));
  };

  const exportToPDF = () => {
    window.print();
  };

  // Enhanced fullscreen toggle with native browser fullscreen API
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await fullscreenRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      // Fallback to CSS fullscreen
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isAutoAdvanceMode && isNarrating) {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          setIsFullscreen(false);
        }
      }
      return;
    }
    
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        setIsFullscreen(false);
      }
    }
    if (e.key === 'f' || e.key === 'F') toggleFullscreen();
  };

  // SIMPLIFIED: Basic image validation
  const hasValidImage = slide.imageUrl && slide.imageUrl.trim() !== '' && !imageErrors.has(slide.id);

  // Get text styles from slide data
  const getTextStyles = (slide: Slide) => {
    const textStyles = slide.textStyles;
    return {
      title: textStyles?.title || {
        fontSize: 'h1',
        textAlign: 'left',
        textColor: '#FFFFFF',
        backgroundColor: 'transparent',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textDecoration: 'none',
        animation: 'fadeIn'
      },
      content: textStyles?.content || {
        fontSize: 'p',
        textAlign: 'left',
        textColor: '#FFFFFF',
        backgroundColor: 'transparent',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        animation: 'fadeIn'
      }
    };
  };

  // Apply text styles to elements
  const applyTextStyle = (style: any) => ({
    fontSize: style.fontSize === 'h1' ? '2.25rem' :
              style.fontSize === 'h2' ? '1.875rem' :
              style.fontSize === 'h3' ? '1.5rem' :
              style.fontSize === 'h4' ? '1.25rem' :
              style.fontSize === 'h5' ? '1.125rem' : '1rem',
    textAlign: style.textAlign,
    color: style.textColor,
    backgroundColor: style.backgroundColor === 'transparent' ? 'transparent' : style.backgroundColor,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    textDecoration: style.textDecoration,
    padding: style.backgroundColor !== 'transparent' ? '8px 12px' : '0',
    borderRadius: style.backgroundColor !== 'transparent' ? '6px' : '0'
  });

  // Get animation class
  const getAnimationClass = (animation: string) => {
    switch (animation) {
      case 'fadeIn': return 'animate-fade-in';
      case 'slideIn': return 'animate-slide-in-left';
      case 'bounce': return 'animate-bounce';
      default: return '';
    }
  };

  // SIMPLIFIED: Basic slide rendering with text styling support
  const renderSimpleSlide = (slide: Slide) => {
    console.log('Rendering slide with image:', slide.imageUrl, 'hasValidImage:', hasValidImage);
    
    const textStyles = getTextStyles(slide);
    
    return (
      <div className="relative h-full overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 p-4 md:p-8 lg:p-12">
        {/* SIMPLIFIED: Content Layout */}
        <div className="relative z-20 h-full flex flex-col md:flex-row">
          {/* Content Area */}
          <div className={`flex flex-col justify-center ${hasValidImage ? 'w-full md:w-1/2 md:pr-4 lg:pr-8' : 'w-full'} mb-4 md:mb-0`}>
            <div className="max-w-4xl space-y-4 md:space-y-6">
              {/* Title with custom styling */}
              <h1 
                className={`mb-4 md:mb-6 leading-tight ${getAnimationClass(textStyles.title.animation)}`}
                style={applyTextStyle(textStyles.title)}
              >
                {slide.title}
              </h1>
              
              {/* Content with custom styling */}
              <div className="space-y-3 md:space-y-4">
                {slide.content.map((point, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-2 md:gap-4 ${getAnimationClass(textStyles.content.animation)}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <span 
                      className="leading-relaxed text-sm md:text-base"
                      style={applyTextStyle(textStyles.content)}
                    >
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIMPLIFIED: Image Area */}
          {hasValidImage && (
            <div className="w-full md:w-1/2 relative h-48 md:h-auto">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover rounded-lg"
                onError={() => {
                  console.error('Image failed to load:', slide.imageUrl);
                  handleImageError(slide.id);
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', slide.imageUrl);
                  // Remove from error set if it was there
                  setImageErrors(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(slide.id);
                    return newSet;
                  });
                }}
              />
              {!isFullscreen && onUpdateSlide && (
                <button
                  onClick={() => setShowPhotoEditor(true)}
                  className="absolute top-2 right-2 md:top-4 md:right-4 p-1 md:p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-lg"
                  title="Edit photo"
                >
                  <Camera className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* SIMPLIFIED: Editor Buttons - Only show when NOT in fullscreen */}
        {!isFullscreen && onUpdateSlide && (
          <>
            <button
              onClick={() => setShowTextEditor(true)}
              className="absolute top-2 left-2 md:top-4 md:left-4 p-2 md:p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-lg hover:shadow-xl z-30"
              title="Edit slide text"
            >
              <Type className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            
            <button
              onClick={() => setShowPhotoEditor(true)}
              className="absolute top-2 right-2 md:top-4 md:right-4 p-2 md:p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl z-30"
              title="Edit slide photo"
            >
              <Camera className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </>
        )}
      </div>
    );
  };

  // Enhanced function to render highlighted text with precise word-by-word highlighting
  const renderHighlightedText = (text: string) => {
    if (!text) return null;
    
    const words = text.split(/(\s+)/);
    let wordIndex = 0;
    
    return words.map((segment, segmentIndex) => {
      if (segment.trim().length === 0) {
        return <span key={`space-${segmentIndex}`}>{segment}</span>;
      } else {
        const isHighlighted = wordIndex < wordProgress.spoken;
        const isCurrentWord = wordIndex === wordProgress.spoken - 1 && isNarrationActive;
        const currentWordIndex = wordIndex;
        wordIndex++;
        
        return (
          <span
            key={`word-${currentWordIndex}-${segmentIndex}`}
            className={`transition-all duration-300 ease-in-out ${
              isHighlighted 
                ? `bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-900 font-semibold shadow-sm rounded-sm px-1 py-0.5 ${
                    isCurrentWord ? 'ring-2 ring-yellow-500 ring-opacity-50 scale-105 animate-pulse' : ''
                  }` 
                : 'text-gray-700 hover:text-gray-900'
            }`}
            style={{
              transform: isCurrentWord ? 'scale(1.05)' : 'scale(1)',
              zIndex: isCurrentWord ? 10 : 1
            }}
          >
            {segment}
          </span>
        );
      }
    });
  };

  const progressPercentage = wordProgress.total > 0 ? Math.round((wordProgress.spoken / wordProgress.total) * 100) : 0;
  const isNarrationComplete = progressPercentage >= 100;
  const isNarrationActive = isNarrating && narrationStatus === 'speaking';

  // Auto-scroll to keep current word visible
  useEffect(() => {
    if (isNarrationActive && speakerNotesRef.current && wordProgress.spoken > 0) {
      const currentWordElement = speakerNotesRef.current.querySelector(`[key*="word-${wordProgress.spoken - 1}"]`) as HTMLElement;
      
      if (currentWordElement) {
        const container = speakerNotesRef.current;
        const containerRect = container.getBoundingClientRect();
        const wordRect = currentWordElement.getBoundingClientRect();
        
        const isVisible = (
          wordRect.top >= containerRect.top &&
          wordRect.bottom <= containerRect.bottom
        );
        
        if (!isVisible) {
          const containerScrollTop = container.scrollTop;
          const wordOffsetTop = currentWordElement.offsetTop;
          const containerHeight = container.clientHeight;
          
          const targetScrollTop = wordOffsetTop - (containerHeight / 2);
          
          container.scrollTo({
            top: Math.max(0, targetScrollTop),
            behavior: 'smooth'
          });
        }
      }
    }
  }, [wordProgress.spoken, isNarrationActive]);

  // Reset scroll position when slide changes
  useEffect(() => {
    if (speakerNotesRef.current) {
      speakerNotesRef.current.scrollTop = 0;
    }
  }, [currentSlide]);

  const handleImageUpdate = (slideId: string, imageUrl: string) => {
    console.log('Updating slide image:', slideId, imageUrl);
    if (onUpdateSlide) {
      // Clear any previous errors for this slide
      setImageErrors(prev => {
        const newSet = new Set(prev);
        newSet.delete(slideId);
        return newSet;
      });
      
      onUpdateSlide(slideId, { imageUrl });
    }
  };

  const handleImageRemove = (slideId: string) => {
    console.log('Removing slide image:', slideId);
    if (onUpdateSlide) {
      setImageErrors(prev => {
        const newSet = new Set(prev);
        newSet.delete(slideId);
        return newSet;
      });
      
      onUpdateSlide(slideId, { imageUrl: undefined });
    }
  };

  const handlePPTXImport = (presentation: any) => {
    if (onImportPresentation) {
      onImportPresentation(presentation);
    }
    setShowPPTXImport(false);
  };

  return (
    <div 
      ref={fullscreenRef}
      className={`w-full transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-black flex flex-col fullscreen-mode' 
          : 'max-w-full md:max-w-7xl mx-auto'
      }`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Main Slide Display */}
      <div className={`${
        isFullscreen 
          ? 'flex-1 flex items-center justify-center' 
          : 'bg-white rounded-2xl shadow-2xl overflow-hidden mb-4 md:mb-8 border border-gray-100'
      }`}>
        <div className={`relative ${
          isFullscreen 
            ? 'w-full h-full' 
            : 'aspect-video w-full'
        } overflow-hidden bg-white`}>
          
          {/* SIMPLIFIED: Slide Content */}
          <div className="absolute inset-0">
            {renderSimpleSlide(slide)}
          </div>

          {/* CLEAN FULLSCREEN: Only show minimal controls that auto-hide */}
          {isFullscreen && showFullscreenControls && (
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">
              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-colors backdrop-blur-sm text-sm md:text-base"
                title="Exit Fullscreen (ESC)"
              >
                <Minimize className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </button>

              <div className="text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold bg-black/60 backdrop-blur-sm text-sm md:text-base">
                Slide {currentSlide + 1} of {slides.length}
                {isAutoAdvanceMode && <span className="ml-2 text-xs">(Auto)</span>}
              </div>
            </div>
          )}

          {/* Regular Top Controls Bar - Only show when not fullscreen */}
          {!isFullscreen && (
            <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-2 md:p-4 z-40">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs md:text-sm"
                    title="Enter Fullscreen"
                  >
                    <Maximize className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Fullscreen</span>
                  </button>

                  {/* Text Editor Button */}
                  {onUpdateSlide && (
                    <button
                      onClick={() => setShowTextEditor(true)}
                      className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-xs md:text-sm"
                      title="Edit Slide Text"
                    >
                      <Type className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Text Editor</span>
                    </button>
                  )}

                  {/* Photo Editor Button */}
                  {onUpdateSlide && (
                    <button
                      onClick={() => setShowPhotoEditor(true)}
                      className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors text-xs md:text-sm"
                      title="Edit Slide Photo"
                    >
                      <Camera className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Photo Editor</span>
                    </button>
                  )}

                  {/* Import Button */}
                  <button
                    onClick={() => setShowUploader(true)}
                    className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-xs md:text-sm"
                    title="Import Slides"
                  >
                    <Upload className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Import</span>
                  </button>

                  {/* PPTX Import Button */}
                  <button
                    onClick={() => setShowPPTXImport(true)}
                    className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors text-xs md:text-sm"
                    title="Import PPTX"
                  >
                    <FileText className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Import PPTX</span>
                  </button>
                </div>

                <div className={`text-white px-2 py-1 md:px-4 md:py-2 rounded-lg font-semibold text-xs md:text-sm ${
                  isAutoAdvanceMode ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-blue-600'
                }`}>
                  Slide {currentSlide + 1} of {slides.length}
                  {isAutoAdvanceMode && <span className="ml-1 md:ml-2 text-xs">(Auto)</span>}
                </div>
              </div>
            </div>
          )}

          {/* Minimal Presentation Status Indicator - Positioned at bottom-right corner */}
          {isNarrating && isFullscreen && (
            <div className={`fixed bottom-4 right-4 backdrop-blur-sm text-white p-2 md:p-3 z-50 rounded-lg shadow-lg max-w-xs ${
              isAutoAdvanceMode 
                ? 'bg-gradient-to-r from-purple-600/95 to-blue-600/95'
                : 'bg-gradient-to-r from-blue-600/95 to-purple-600/95'
            }`}>
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                  narrationStatus === 'speaking'
                    ? (isAutoAdvanceMode ? 'bg-purple-400 animate-pulse' : 'bg-blue-400 animate-pulse')
                    : isNarrationComplete
                    ? 'bg-green-400'
                    : 'bg-gray-400'
                }`}></div>
                <span className="font-medium text-xs md:text-sm">
                  {narrationStatus === 'speaking'
                    ? (isAutoAdvanceMode ? 'Auto-Advancing' : 'Presenting')
                    : isNarrationComplete
                    ? 'Complete'
                    : 'Ready'
                  }
                </span>
                {isNarrationActive && wordProgress.total > 0 && (
                  <span className="text-xs opacity-90">
                    {progressPercentage}%
                  </span>
                )}
              </div>
              
              {isNarrationActive && wordProgress.total > 0 && (
                <div className="w-full bg-white/20 rounded-full h-1 md:h-1.5 shadow-inner overflow-hidden">
                  <div 
                    className={`h-1 md:h-1.5 rounded-full transition-all duration-500 shadow-sm ${
                      isAutoAdvanceMode 
                        ? 'bg-gradient-to-r from-white to-purple-200'
                        : 'bg-gradient-to-r from-white to-blue-200'
                    }`}
                    style={{ 
                      width: `${progressPercentage}%`,
                      transition: 'width 0.5s ease-out'
                    }}
                  ></div>
                </div>
              )}
            </div>
          )}

          {/* Regular Presentation Status Indicator - Only when not fullscreen */}
          {isNarrating && !isFullscreen && (
            <div className={`absolute bottom-0 left-0 right-0 backdrop-blur-sm text-white p-2 md:p-4 z-40 ${
              isAutoAdvanceMode 
                ? 'bg-gradient-to-r from-purple-600/95 to-blue-600/95'
                : 'bg-gradient-to-r from-blue-600/95 to-purple-600/95'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                    narrationStatus === 'speaking'
                      ? (isAutoAdvanceMode ? 'bg-purple-400 animate-pulse' : 'bg-blue-400 animate-pulse')
                      : isNarrationComplete
                      ? 'bg-green-400'
                      : 'bg-gray-400'
                  }`}></div>
                  <span className="font-semibold text-sm md:text-base">
                    {narrationStatus === 'speaking'
                      ? (isAutoAdvanceMode ? '🚀 Auto-Advancing' : '🗣️ Presenting')
                      : isNarrationComplete
                      ? '✅ Complete'
                      : '🎪 Ready'
                    }
                  </span>
                </div>
                {isNarrationActive && wordProgress.total > 0 && (
                  <div className="text-xs md:text-sm font-medium">
                    {wordProgress.spoken} / {wordProgress.total} words ({progressPercentage}%)
                  </div>
                )}
              </div>
              
              {isNarrationActive && wordProgress.total > 0 && (
                <div className="w-full bg-white/20 rounded-full h-1.5 md:h-2 shadow-inner overflow-hidden">
                  <div 
                    className={`h-1.5 md:h-2 rounded-full transition-all duration-500 shadow-sm ${
                      isAutoAdvanceMode 
                        ? 'bg-gradient-to-r from-white to-purple-200'
                        : 'bg-gradient-to-r from-white to-blue-200'
                    }`}
                    style={{ 
                      width: `${progressPercentage}%`,
                      transition: 'width 0.5s ease-out'
                    }}
                  ></div>
                </div>
              )}
              
              <div className="mt-2 text-xs text-white/80 text-center">
                {narrationStatus === 'speaking'
                  ? (isAutoAdvanceMode 
                      ? `🎯 Auto-advancing through all ${slides.length} slides`
                      : `🎯 Presenting current slide`
                    )
                  : isNarrationComplete
                  ? '🎉 Presentation completed'
                  : '🎪 Ready to start'
                }
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Controls Bar - Hide in fullscreen */}
      {!isFullscreen && (
        <div className="bg-white rounded-xl shadow-lg p-3 md:p-6 mb-4 md:mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Navigation Controls */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentSlide === 0 || (isAutoAdvanceMode && isNarrating)}
                className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200 rounded-lg font-medium transition-all disabled:cursor-not-allowed shadow-sm hover:shadow-md text-xs md:text-base"
                title={isAutoAdvanceMode && isNarrating ? "Navigation disabled during auto-advance" : "Previous slide"}
              >
                <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentSlide === slides.length - 1 || (isAutoAdvanceMode && isNarrating)}
                className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200 rounded-lg font-medium transition-all disabled:cursor-not-allowed shadow-sm hover:shadow-md text-xs md:text-base"
                title={isAutoAdvanceMode && isNarrating ? "Navigation disabled during auto-advance" : "Next slide"}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
              </button>
            </div>

            {/* Action Controls */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <button
                onClick={() => onGenerateImage(slide)}
                disabled={isGeneratingImage}
                className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg text-xs md:text-base"
              >
                {isGeneratingImage ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Generating...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Generate Image</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => onNarrate(slide)}
                disabled={isNarrating}
                className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md hover:shadow-lg text-xs md:text-base"
              >
                {isNarrating ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Presenting...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Present</span>
                  </>
                )}
              </button>

              <button
                onClick={exportToPDF}
                className="flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all font-medium shadow-md hover:shadow-lg text-xs md:text-base"
              >
                <Download className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Slide Editor */}
      {!isFullscreen && onUpdateSlide && (
        <SlideEditor
          slide={slide}
          slideIndex={currentSlide}
          totalSlides={slides.length}
          onUpdateSlide={onUpdateSlide}
          onDeleteSlide={onDeleteSlide!}
          onDuplicateSlide={onDuplicateSlide!}
          onMoveSlide={onMoveSlide!}
          onAddSlide={onAddSlide!}
          isEditing={editingSlideId === slide.id}
          onToggleEdit={() => setEditingSlideId(editingSlideId === slide.id ? null : slide.id)}
        />
      )}

      {/* Enhanced Slide Thumbnails - Hide in fullscreen */}
      {!isFullscreen && (
        <div className="bg-white rounded-xl shadow-lg p-3 md:p-6 mb-4 md:mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-1 md:gap-2">
              <Layout className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              Slide Overview
            </h3>
            <div className="text-xs md:text-sm text-gray-600">
              {slides.length} slides total
            </div>
          </div>
          
          <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-4">
            {slides.map((thumbnailSlide, index) => {
              const thumbnailHasImage = thumbnailSlide.imageUrl && thumbnailSlide.imageUrl.trim() !== '' && !imageErrors.has(thumbnailSlide.id);
              
              return (
                <button
                  key={thumbnailSlide.id}
                  onClick={() => onSlideChange(index)}
                  disabled={isAutoAdvanceMode && isNarrating}
                  className={`flex-shrink-0 w-24 h-16 md:w-48 md:h-28 rounded-lg border-2 p-2 md:p-4 transition-all hover:shadow-lg relative group ${
                    index === currentSlide 
                      ? (isAutoAdvanceMode 
                          ? 'border-purple-500 ring-2 ring-purple-200 shadow-md' 
                          : 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                        )
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${isAutoAdvanceMode && isNarrating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)'
                  }}
                  title={isAutoAdvanceMode && isNarrating ? "Navigation disabled during auto-advance" : `Go to slide ${index + 1}`}
                >
                  <div className="text-[10px] md:text-xs font-semibold text-white truncate mb-1 md:mb-2 drop-shadow-md">
                    {index + 1}. {thumbnailSlide.title}
                  </div>
                  <div className="text-[8px] md:text-xs text-white/90 leading-tight line-clamp-2 md:line-clamp-3 drop-shadow-sm">
                    {thumbnailSlide.content.slice(0, 1).join(', ')}...
                  </div>
                  {isAutoAdvanceMode && index === currentSlide && (
                    <div className="absolute top-1 right-1 md:top-2 md:right-2">
                      <PlayCircle className="w-3 h-3 md:w-4 md:h-4 text-white drop-shadow-md" />
                    </div>
                  )}
                  
                  {/* Image indicator with proper validation */}
                  {thumbnailHasImage && (
                    <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2">
                      <ImageIcon className="w-2 h-2 md:w-3 md:h-3 text-white/80" />
                    </div>
                  )}
                  
                  {/* Slide number indicator */}
                  <div className={`absolute top-1 left-1 md:top-2 md:left-2 w-4 h-4 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[8px] md:text-xs font-bold ${
                    index === currentSlide 
                      ? (isAutoAdvanceMode ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white')
                      : 'bg-white/20 text-white'
                  }`}>
                    {index + 1}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Enhanced Speaker Notes with Professional Design - Hide in fullscreen */}
      {!isFullscreen && slide.notes && (
        <div className="bg-white rounded-xl shadow-lg p-3 md:p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 md:mb-4 gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-1 md:gap-2">
              <div className={`w-4 h-4 md:w-5 md:h-5 rounded flex items-center justify-center ${
                isAutoAdvanceMode ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-blue-600'
              }`}>
                <svg className="w-2 h-2 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Speaker Notes
              {isNarrationActive && (
                <div className={`ml-1 md:ml-2 px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs rounded-full font-medium flex items-center gap-1 ${
                  isAutoAdvanceMode 
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse ${
                    isAutoAdvanceMode ? 'bg-purple-600' : 'bg-blue-600'
                  }`}></div>
                  {isAutoAdvanceMode ? 'Auto' : 'Presenting'}
                </div>
              )}
            </h3>
            
            {/* Enhanced Controls */}
            <div className="flex items-center gap-2">
              {/* Real-time Progress indicator */}
              {isNarrationActive && wordProgress.total > 0 && (
                <div className="hidden md:flex items-center gap-3 text-xs md:text-sm mr-2 md:mr-4">
                  <div className={`flex items-center gap-1 md:gap-2 ${
                    isAutoAdvanceMode ? 'text-purple-600' : 'text-blue-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse ${
                      isAutoAdvanceMode ? 'bg-purple-600' : 'bg-blue-600'
                    }`}></div>
                    <span className="font-medium">
                      {isAutoAdvanceMode ? 'Auto' : 'Presenting'}
                    </span>
                  </div>
                  <div className="text-gray-600 font-medium">
                    {wordProgress.spoken}/{wordProgress.total}
                  </div>
                  <div className={`font-semibold ${
                    isAutoAdvanceMode ? 'text-purple-600' : 'text-blue-600'
                  }`}>
                    {progressPercentage}%
                  </div>
                </div>
              )}

              {/* Edit Button */}
              {onUpdateSlideNotes && (
                <button
                  onClick={() => setEditingSlideId(editingSlideId === slide.id ? null : slide.id)}
                  className="flex items-center gap-1 px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors shadow-sm"
                  title="Edit speaker notes"
                >
                  <Edit3 className="w-3 h-3" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Speaker Notes Content */}
          <div 
            ref={speakerNotesRef}
            className="text-gray-700 leading-relaxed text-xs md:text-base max-h-48 md:max-h-96 overflow-y-auto bg-gray-50 rounded-lg p-2 md:p-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {renderHighlightedText(slide.notes)}
          </div>
          
          {/* Enhanced Progress bar for presentation tracking */}
          {isNarrationActive && wordProgress.total > 0 && (
            <div className="mt-3 md:mt-6 pt-2 md:pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 mb-1 md:mb-3">
                <span className="font-medium flex items-center gap-1 md:gap-2">
                  <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse ${
                    isAutoAdvanceMode ? 'bg-purple-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="truncate">
                    {isAutoAdvanceMode ? 'Auto-Advance' : 'Presenting'}
                  </span>
                </span>
                <span className={`font-semibold ${
                  isAutoAdvanceMode ? 'text-purple-600' : 'text-blue-600'
                }`}>
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 shadow-inner overflow-hidden">
                <div 
                  className={`h-2 md:h-3 rounded-full transition-all duration-500 shadow-sm ${
                    isAutoAdvanceMode 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}
                  style={{ 
                    width: `${progressPercentage}%`,
                    transition: 'width 0.5s ease-out'
                  }}
                ></div>
              </div>
              <div className="mt-1 md:mt-2 text-[10px] md:text-xs text-gray-500 text-center">
                {isAutoAdvanceMode 
                  ? '🚀 Auto-advancing through all slides'
                  : '🎯 Single slide presentation'
                }
              </div>
            </div>
          )}
        </div>
      )}

      {/* Simple Text Editor Modal */}
      {onUpdateSlide && (
        <SimpleSlideTextEditor
          slide={slide}
          onUpdateSlide={onUpdateSlide}
          isOpen={showTextEditor}
          onClose={() => setShowTextEditor(false)}
        />
      )}

      {/* Photo Editor Modal */}
      {onUpdateSlide && (
        <SlidePhotoEditor
          slideId={slide.id}
          currentImageUrl={slide.imageUrl}
          onImageUpdate={handleImageUpdate}
          onImageRemove={handleImageRemove}
          isOpen={showPhotoEditor}
          onClose={() => setShowPhotoEditor(false)}
        />
      )}

      {/* Presentation Uploader Modal */}
      {onImportPresentation && onImportSlides && (
        <PresentationUploader
          isOpen={showUploader}
          onClose={() => setShowUploader(false)}
          onImportPresentation={onImportPresentation}
          onImportSlides={onImportSlides}
        />
      )}

      {/* PPTX Import Modal */}
      {onImportPresentation && (
        <PPTXImportModal
          isOpen={showPPTXImport}
          onClose={() => setShowPPTXImport(false)}
          onImportComplete={handlePPTXImport}
          existingPresentation={slides.length > 0 ? { title: 'Current Presentation', slides } : undefined}
        />
      )}
    </div>
  );
};