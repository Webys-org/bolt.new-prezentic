import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TopicInput } from './components/TopicInput';
import { SlideViewer } from './components/SlideViewer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { PresentationControls } from './components/PresentationControls';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { HeroSection } from './components/HeroSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDemoAuth } from './hooks/useDemoAuth';
import { useDemoPresentationStorage } from './hooks/useDemoPresentationStorage';
import { presentationAPI } from './services/api';
import { createVapiService, VapiNarrationService } from './services/vapiService';
import { Presentation, Slide, APIKeyConfig, NarrationStatus } from './types/presentation';

function App() {
  const { user, isAuthenticated, isLoading: authLoading } = useDemoAuth();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentPresentationId, setCurrentPresentationId] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'dashboard' | 'presentation'>('landing');
  
  // Enhanced narration state for auto-advance presentation mode
  const [narrationStatus, setNarrationStatus] = useState<NarrationStatus>({
    isNarrating: false,
    isPaused: false,
    currentSlide: 0,
    status: 'idle'
  });
  
  const [wordProgress, setWordProgress] = useState({ spoken: 0, total: 0 });
  const [isAutoAdvanceMode, setIsAutoAdvanceMode] = useState(false);
  
  const vapiServiceRef = useRef<VapiNarrationService | null>(null);
  
  const [apiKeys, setApiKeys] = useLocalStorage<APIKeyConfig>('ai-presentation-api-keys', {
    gemini: '',
    vapi: ''
  });

  // Use demo presentation storage hook
  const {
    savePresentation,
    loadPresentation,
    updatePresentation,
    uploadImage,
    exportPresentation,
    sharePresentation,
    duplicatePresentation,
    isLoading: storageLoading,
    error: storageError
  } = useDemoPresentationStorage();

  // Handle authentication state changes
  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated && currentView === 'auth') {
        setCurrentView('dashboard');
      } else if (!isAuthenticated && (currentView === 'dashboard' || currentView === 'presentation')) {
        setCurrentView('landing');
      }
    }
  }, [isAuthenticated, authLoading, currentView]);

  // Initialize Vapi service when API key is available
  useEffect(() => {
    const initializeVapiService = async () => {
      if (apiKeys.vapi && !vapiServiceRef.current) {
        try {
          console.log('Initializing Auto-Advance Presenter with key:', apiKeys.vapi.substring(0, 10) + '...');
          vapiServiceRef.current = await createVapiService({
            publicKey: apiKeys.vapi,
            voice: {
              provider: "11labs",
              voiceId: "sarah"
            }
          });
          
          if (vapiServiceRef.current.isServiceInitialized()) {
            console.log('Auto-Advance Presenter initialized successfully');
            
            // Set up callbacks for auto-advance functionality
            vapiServiceRef.current.setCallbacks(
              (error: string) => setError(error),
              (status: string) => setNarrationStatus(prev => ({ ...prev, status: status as any })),
              (wordsSpoken: number, totalWords: number) => setWordProgress({ spoken: wordsSpoken, total: totalWords })
            );
            
            setError(null);
          } else {
            throw new Error('Service failed to initialize properly');
          }
        } catch (error) {
          console.error('Failed to initialize Auto-Advance Presenter:', error);
          setError(`Failed to initialize AI Presenter: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your Vapi API key.`);
          vapiServiceRef.current = null;
        }
      }
    };

    initializeVapiService();
  }, [apiKeys.vapi]);

  // Cleanup Vapi service on unmount
  useEffect(() => {
    return () => {
      if (vapiServiceRef.current) {
        vapiServiceRef.current.destroy();
      }
    };
  }, []);

  // Save presentation to demo storage when created or updated
  const savePresentationToDemo = useCallback(async (newPresentation: Presentation) => {
    if (isAuthenticated) {
      try {
        let presentationId = currentPresentationId;
        
        if (!presentationId) {
          // Create new presentation
          presentationId = await savePresentation(newPresentation);
          setCurrentPresentationId(presentationId);
          console.log('✅ New presentation saved to demo storage:', presentationId);
        } else {
          // Update existing presentation
          await updatePresentation(presentationId, newPresentation);
          console.log('✅ Presentation updated in demo storage:', presentationId);
        }
      } catch (error) {
        console.error('❌ Failed to save presentation to demo storage:', error);
        // Don't throw error to avoid breaking the UI
      }
    }
  }, [isAuthenticated, currentPresentationId, savePresentation, updatePresentation]);

  const handleGeneratePresentation = useCallback(async (topic: string) => {
    if (!apiKeys.gemini) {
      setShowApiModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const newPresentation = await presentationAPI.generate(topic, apiKeys.gemini);
      setPresentation(newPresentation);
      setCurrentSlide(0);
      setNarrationStatus(prev => ({ ...prev, currentSlide: 0 }));
      setWordProgress({ spoken: 0, total: 0 });
      setIsAutoAdvanceMode(false);
      setCurrentView('presentation');
      
      // Save to demo storage
      await savePresentationToDemo(newPresentation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate presentation');
    } finally {
      setIsLoading(false);
    }
  }, [apiKeys.gemini, savePresentationToDemo]);

  const handleCreateManualPresentation = useCallback(async (manualPresentation: Presentation) => {
    setPresentation(manualPresentation);
    setCurrentSlide(0);
    setNarrationStatus(prev => ({ ...prev, currentSlide: 0 }));
    setWordProgress({ spoken: 0, total: 0 });
    setIsAutoAdvanceMode(false);
    setCurrentView('presentation');
    
    // Save to demo storage
    await savePresentationToDemo(manualPresentation);
  }, [savePresentationToDemo]);

  const handleOpenPresentation = useCallback(async (presentationId: string) => {
    try {
      setIsLoading(true);
      const loadedPresentation = await loadPresentation(presentationId);
      setPresentation(loadedPresentation);
      setCurrentPresentationId(presentationId);
      setCurrentSlide(0);
      setNarrationStatus(prev => ({ ...prev, currentSlide: 0 }));
      setWordProgress({ spoken: 0, total: 0 });
      setIsAutoAdvanceMode(false);
      setCurrentView('presentation');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load presentation');
    } finally {
      setIsLoading(false);
    }
  }, [loadPresentation]);

  const handleBackToDashboard = useCallback(() => {
    // Stop any ongoing narration
    if (vapiServiceRef.current && narrationStatus.isNarrating) {
      vapiServiceRef.current.stopNarration();
    }
    
    setPresentation(null);
    setCurrentPresentationId(null);
    setCurrentSlide(0);
    setNarrationStatus({
      isNarrating: false,
      isPaused: false,
      currentSlide: 0,
      status: 'idle'
    });
    setWordProgress({ spoken: 0, total: 0 });
    setIsAutoAdvanceMode(false);
    setCurrentView('dashboard');
  }, [narrationStatus.isNarrating]);

  const handleGenerateImage = useCallback(async (slide: Slide) => {
    if (!apiKeys.gemini) {
      setShowApiModal(true);
      return;
    }

    setIsGeneratingImage(true);
    setError(null);

    try {
      const result = await presentationAPI.generateImage(slide, apiKeys.gemini);
      
      if (result.imageUrl && presentation) {
        const updatedSlides = presentation.slides.map(s =>
          s.id === slide.id ? { ...s, imageUrl: result.imageUrl } : s
        );
        const updatedPresentation = { ...presentation, slides: updatedSlides };
        setPresentation(updatedPresentation);
        
        // Save to demo storage
        await savePresentationToDemo(updatedPresentation);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  }, [apiKeys.gemini, presentation, savePresentationToDemo]);

  // Enhanced slide management functions
  const handleUpdateSlide = useCallback(async (slideId: string, updatedSlide: Partial<Slide>) => {
    if (!presentation) return;

    const updatedSlides = presentation.slides.map(slide =>
      slide.id === slideId ? { ...slide, ...updatedSlide } : slide
    );
    const updatedPresentation = { ...presentation, slides: updatedSlides };
    setPresentation(updatedPresentation);
    
    // Save to demo storage
    await savePresentationToDemo(updatedPresentation);
    
    console.log(`📝 Updated slide: ${slideId}`);
  }, [presentation, savePresentationToDemo]);

  const handleDeleteSlide = useCallback(async (slideId: string) => {
    if (!presentation || presentation.slides.length <= 1) return;

    const slideIndex = presentation.slides.findIndex(s => s.id === slideId);
    const updatedSlides = presentation.slides.filter(s => s.id !== slideId);
    const updatedPresentation = { ...presentation, slides: updatedSlides };
    
    setPresentation(updatedPresentation);
    
    // Adjust current slide if necessary
    if (currentSlide >= updatedSlides.length) {
      setCurrentSlide(updatedSlides.length - 1);
    } else if (slideIndex <= currentSlide && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
    
    // Save to demo storage
    await savePresentationToDemo(updatedPresentation);
    
    console.log(`🗑️ Deleted slide: ${slideId}`);
  }, [presentation, currentSlide, savePresentationToDemo]);

  const handleAddSlide = useCallback(async (afterIndex: number, slideType: 'text' | 'image' | 'blank') => {
    if (!presentation) return;

    const newSlideId = `slide-${Date.now()}`;
    const slideNumber = afterIndex + 2;
    
    let newSlide: Slide;
    
    switch (slideType) {
      case 'image':
        newSlide = {
          id: newSlideId,
          title: `Image Slide ${slideNumber}`,
          content: ['Visual content slide', 'Add your image using the Generate Image button', 'Customize content as needed'],
          notes: `This is slide ${slideNumber} featuring visual content. Describe the image and its relevance to your presentation topic. Use this space to provide context and explanation for the visual elements.`
        };
        break;
      case 'blank':
        newSlide = {
          id: newSlideId,
          title: `Slide ${slideNumber}`,
          content: [''],
          notes: `Speaker notes for slide ${slideNumber}. Add your content and customize as needed.`
        };
        break;
      default: // text
        newSlide = {
          id: newSlideId,
          title: `New Slide ${slideNumber}`,
          content: ['First key point', 'Second important detail', 'Third supporting element'],
          notes: `This is slide ${slideNumber} with structured content. Expand on the key points presented and provide additional context that will help engage your audience effectively.`
        };
    }

    const updatedSlides = [
      ...presentation.slides.slice(0, afterIndex + 1),
      newSlide,
      ...presentation.slides.slice(afterIndex + 1)
    ];
    
    const updatedPresentation = { ...presentation, slides: updatedSlides };
    setPresentation(updatedPresentation);
    setCurrentSlide(afterIndex + 1); // Navigate to the new slide
    
    // Save to demo storage
    await savePresentationToDemo(updatedPresentation);
    
    console.log(`➕ Added ${slideType} slide after index ${afterIndex}`);
  }, [presentation, savePresentationToDemo]);

  const handleDuplicateSlide = useCallback(async (slideId: string) => {
    if (!presentation) return;

    const slideIndex = presentation.slides.findIndex(s => s.id === slideId);
    if (slideIndex === -1) return;

    const originalSlide = presentation.slides[slideIndex];
    const duplicatedSlide: Slide = {
      ...originalSlide,
      id: `slide-${Date.now()}`,
      title: `${originalSlide.title} (Copy)`
    };

    const updatedSlides = [
      ...presentation.slides.slice(0, slideIndex + 1),
      duplicatedSlide,
      ...presentation.slides.slice(slideIndex + 1)
    ];
    
    const updatedPresentation = { ...presentation, slides: updatedSlides };
    setPresentation(updatedPresentation);
    setCurrentSlide(slideIndex + 1); // Navigate to the duplicated slide
    
    // Save to demo storage
    await savePresentationToDemo(updatedPresentation);
    
    console.log(`📋 Duplicated slide: ${slideId}`);
  }, [presentation, savePresentationToDemo]);

  const handleMoveSlide = useCallback(async (slideId: string, direction: 'up' | 'down') => {
    if (!presentation) return;

    const slideIndex = presentation.slides.findIndex(s => s.id === slideId);
    if (slideIndex === -1) return;

    const newIndex = direction === 'up' ? slideIndex - 1 : slideIndex + 1;
    if (newIndex < 0 || newIndex >= presentation.slides.length) return;

    const updatedSlides = [...presentation.slides];
    [updatedSlides[slideIndex], updatedSlides[newIndex]] = [updatedSlides[newIndex], updatedSlides[slideIndex]];
    
    const updatedPresentation = { ...presentation, slides: updatedSlides };
    setPresentation(updatedPresentation);
    
    // Update current slide if it was moved
    if (currentSlide === slideIndex) {
      setCurrentSlide(newIndex);
    } else if (currentSlide === newIndex) {
      setCurrentSlide(slideIndex);
    }
    
    // Save to demo storage
    await savePresentationToDemo(updatedPresentation);
    
    console.log(`🔄 Moved slide ${slideId} ${direction}`);
  }, [presentation, currentSlide, savePresentationToDemo]);

  const handleImportPresentation = useCallback(async (importedPresentation: Presentation) => {
    setPresentation(importedPresentation);
    setCurrentSlide(0);
    setNarrationStatus(prev => ({ ...prev, currentSlide: 0 }));
    setWordProgress({ spoken: 0, total: 0 });
    setIsAutoAdvanceMode(false);
    
    // Save to demo storage
    await savePresentationToDemo(importedPresentation);
    
    console.log(`📥 Imported presentation: ${importedPresentation.title}`);
  }, [savePresentationToDemo]);

  const handleImportSlides = useCallback(async (importedSlides: Slide[]) => {
    if (!presentation) {
      // Create new presentation if none exists
      const newPresentation: Presentation = {
        title: 'Imported Presentation',
        slides: importedSlides
      };
      setPresentation(newPresentation);
      setCurrentSlide(0);
      await savePresentationToDemo(newPresentation);
    } else {
      // Add slides to existing presentation
      const updatedSlides = [...presentation.slides, ...importedSlides];
      const updatedPresentation = { ...presentation, slides: updatedSlides };
      setPresentation(updatedPresentation);
      
      // Save to demo storage
      await savePresentationToDemo(updatedPresentation);
    }
    
    setNarrationStatus(prev => ({ ...prev, currentSlide: 0 }));
    setWordProgress({ spoken: 0, total: 0 });
    setIsAutoAdvanceMode(false);
    console.log(`📥 Imported ${importedSlides.length} slides`);
  }, [presentation, savePresentationToDemo]);

  // Update slide notes
  const handleUpdateSlideNotes = useCallback(async (slideId: string, newNotes: string) => {
    await handleUpdateSlide(slideId, { notes: newNotes });
  }, [handleUpdateSlide]);

  // Export presentation
  const handleExportPresentation = useCallback(async (format: 'pdf' | 'pptx' | 'json' | 'html') => {
    if (!presentation || !currentPresentationId) {
      setError('No presentation to export');
      return;
    }

    try {
      setIsLoading(true);
      await exportPresentation(presentation, currentPresentationId, format);
      console.log(`✅ Presentation exported as ${format.toUpperCase()}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to export presentation');
    } finally {
      setIsLoading(false);
    }
  }, [presentation, currentPresentationId, exportPresentation]);

  // Start auto-advance presentation mode
  const handleStartAutoAdvancePresentation = useCallback(async () => {
    if (!apiKeys.vapi) {
      setShowApiModal(true);
      return;
    }

    if (!vapiServiceRef.current || !vapiServiceRef.current.isServiceInitialized()) {
      setError('Auto-Advance Presenter not initialized. Please check your API key and try again.');
      return;
    }

    if (!presentation) {
      setError('No presentation available');
      return;
    }

    setError(null);
    setIsAutoAdvanceMode(true);
    setCurrentSlide(0);

    try {
      await vapiServiceRef.current.startAutoAdvancePresentation(
        presentation.slides,
        presentation.title,
        () => {
          console.log('Slide completed in auto-advance mode');
        },
        () => {
          // FIXED: Auto-advance to next slide callback
          setCurrentSlide(prev => {
            const nextSlide = prev + 1;
            console.log(`🔄 Auto-advancing to slide ${nextSlide + 1}`);
            
            // CRITICAL: Reset word progress for new slide
            setWordProgress({ spoken: 0, total: 0 });
            
            return nextSlide;
          });
        }
      );
      
      setNarrationStatus({
        isNarrating: true,
        isPaused: false,
        currentSlide: 0,
        status: 'connected'
      });
      
      console.log('🚀 Auto-advance presentation started!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start auto-advance presentation');
      setIsAutoAdvanceMode(false);
    }
  }, [apiKeys.vapi, presentation]);

  const handleStartSlidePresentation = useCallback(async (slide: Slide) => {
    if (!apiKeys.vapi) {
      setShowApiModal(true);
      return;
    }

    if (!vapiServiceRef.current || !vapiServiceRef.current.isServiceInitialized()) {
      setError('Presenter not initialized. Please check your API key and try again.');
      return;
    }

    if (!presentation) {
      setError('No presentation available');
      return;
    }

    setError(null);

    try {
      await vapiServiceRef.current.startSlidePresentation(
        slide,
        currentSlide,
        presentation.slides.length,
        presentation.title
      );
      
      setNarrationStatus({
        isNarrating: true,
        isPaused: false,
        currentSlide,
        status: 'connected'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start presentation');
    }
  }, [apiKeys.vapi, presentation, currentSlide]);

  const handleStopNarration = useCallback(async () => {
    if (vapiServiceRef.current) {
      await vapiServiceRef.current.stopNarration();
    }
    setNarrationStatus({
      isNarrating: false,
      isPaused: false,
      currentSlide,
      status: 'stopped'
    });
    setWordProgress({ spoken: 0, total: 0 });
    setIsAutoAdvanceMode(false);
  }, [currentSlide]);

  const handlePauseNarration = useCallback(async () => {
    if (vapiServiceRef.current) {
      await vapiServiceRef.current.pauseNarration();
      setNarrationStatus(prev => ({ ...prev, isPaused: true, status: 'paused' }));
    }
  }, []);

  const handleResumeNarration = useCallback(async () => {
    if (vapiServiceRef.current) {
      await vapiServiceRef.current.resumeNarration();
      setNarrationStatus(prev => ({ ...prev, isPaused: false, status: 'speaking' }));
    }
  }, []);

  const handleSlideChange = useCallback((index: number) => {
    // Don't allow manual slide changes during auto-advance mode
    if (isAutoAdvanceMode && narrationStatus.isNarrating) {
      console.log('Manual slide change blocked during auto-advance mode');
      return;
    }

    setCurrentSlide(index);
    setNarrationStatus(prev => ({ ...prev, currentSlide: index }));
    setWordProgress({ spoken: 0, total: 0 }); // Reset progress for new slide
    
    // Stop current presentation when changing slides manually
    if (narrationStatus.isNarrating && vapiServiceRef.current) {
      vapiServiceRef.current.stopNarration().then(() => {
        setNarrationStatus({
          isNarrating: false,
          isPaused: false,
          currentSlide: index,
          status: 'stopped'
        });
        setIsAutoAdvanceMode(false);
      });
    }
  }, [narrationStatus.isNarrating, isAutoAdvanceMode]);

  const handleSaveApiKeys = useCallback((keys: APIKeyConfig) => {
    setApiKeys(keys);
    
    // Reinitialize Vapi service if key changed
    if (keys.vapi !== apiKeys.vapi) {
      if (vapiServiceRef.current) {
        vapiServiceRef.current.destroy();
        vapiServiceRef.current = null;
      }
      
      if (keys.vapi) {
        console.log('API key updated, Auto-Advance Presenter will reinitialize');
      }
    }
  }, [apiKeys.vapi, setApiKeys]);

  // Navigation handlers
  const handleGetStarted = () => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('auth');
    }
  };

  const handleSignIn = () => {
    setCurrentView('auth');
  };

  const handleAuthSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render based on current view
  if (currentView === 'landing') {
    return (
      <HeroSection 
        onGetStarted={handleGetStarted}
        onSignIn={handleSignIn}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  if (currentView === 'auth') {
    return (
      <AuthPage 
        onAuthSuccess={handleAuthSuccess}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} onBackToLanding={handleBackToLanding} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {(error || storageError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error || storageError}</p>
            <button
              onClick={() => {
                setError(null);
              }}
              className="text-red-600 hover:text-red-700 text-sm underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {currentView === 'dashboard' ? (
          <Dashboard
            onCreatePresentation={handleGeneratePresentation}
            onCreateManualPresentation={handleCreateManualPresentation}
            onOpenPresentation={handleOpenPresentation}
            onOpenSettings={() => setShowApiModal(true)}
            hasApiKey={!!apiKeys.gemini}
          />
        ) : !presentation ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <TopicInput
              onGenerate={handleGeneratePresentation}
              onOpenSettings={() => setShowApiModal(true)}
              isLoading={isLoading || storageLoading}
              hasApiKey={!!apiKeys.gemini}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {presentation.title}
              </h1>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleBackToDashboard}
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  ← Back to Dashboard
                </button>
                
                {/* Export buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportPresentation('pdf')}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
                  >
                    Export PDF
                  </button>
                  <button
                    onClick={() => handleExportPresentation('pptx')}
                    disabled={isLoading}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm"
                  >
                    Export PPTX
                  </button>
                  <button
                    onClick={() => handleExportPresentation('json')}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                  >
                    Export JSON
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Presentation Controls with Auto-Advance */}
            <PresentationControls
              isNarrating={narrationStatus.isNarrating}
              isPaused={narrationStatus.isPaused}
              currentSlide={currentSlide}
              totalSlides={presentation.slides.length}
              onStartSlidePresentation={() => handleStartSlidePresentation(presentation.slides[currentSlide])}
              onStartAutoAdvancePresentation={handleStartAutoAdvancePresentation}
              onStopNarration={handleStopNarration}
              onPauseNarration={handlePauseNarration}
              onResumeNarration={handleResumeNarration}
              onNextSlide={() => handleSlideChange(Math.min(currentSlide + 1, presentation.slides.length - 1))}
              onPreviousSlide={() => handleSlideChange(Math.max(currentSlide - 1, 0))}
              status={narrationStatus.status}
              hasVapiKey={!!apiKeys.vapi && vapiServiceRef.current?.isServiceInitialized()}
              onOpenSettings={() => setShowApiModal(true)}
              currentSlideTitle={presentation.slides[currentSlide]?.title || ''}
              isAutoAdvanceMode={isAutoAdvanceMode}
            />

            <SlideViewer
              slides={presentation.slides}
              currentSlide={currentSlide}
              onSlideChange={handleSlideChange}
              onGenerateImage={handleGenerateImage}
              onNarrate={() => handleStartSlidePresentation(presentation.slides[currentSlide])}
              onUpdateSlideNotes={handleUpdateSlideNotes}
              onUpdateSlide={handleUpdateSlide}
              onDeleteSlide={handleDeleteSlide}
              onAddSlide={handleAddSlide}
              onDuplicateSlide={handleDuplicateSlide}
              onMoveSlide={handleMoveSlide}
              onImportPresentation={handleImportPresentation}
              onImportSlides={handleImportSlides}
              isGeneratingImage={isGeneratingImage}
              isNarrating={narrationStatus.isNarrating}
              narrationStatus={narrationStatus.status}
              wordProgress={wordProgress}
              isAutoAdvanceMode={isAutoAdvanceMode}
            />
          </div>
        )}

        <ApiKeyModal
          isOpen={showApiModal}
          onClose={() => setShowApiModal(false)}
          onSave={handleSaveApiKeys}
          initialKeys={apiKeys}
        />
      </div>
    </div>
  );
}

export default App;