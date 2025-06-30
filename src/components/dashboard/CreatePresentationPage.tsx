import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Edit3, Zap, Brain, FileText, Users, BarChart3, Palette, Plus, Lightbulb, Monitor, BookOpen, Briefcase, Rocket, Loader2, ArrowRight, ChevronRight } from 'lucide-react';
import { createBlankPresentation, presentationTemplates, createTemplatePresentation } from '../../services/manualPresentationService';
import { Presentation as PresentationType } from '../../types/presentation';

interface CreatePresentationPageProps {
  onBack: () => void;
  onCreateAI: (topic: string) => void;
  onCreateManual: (presentation: PresentationType) => void;
  hasApiKey: boolean;
  onOpenSettings: () => void;
}

export const CreatePresentationPage: React.FC<CreatePresentationPageProps> = ({
  onBack,
  onCreateAI,
  onCreateManual,
  hasApiKey,
  onOpenSettings
}) => {
  const [currentStep, setCurrentStep] = useState<'method' | 'details' | 'generating'>('method');
  const [selectedMethod, setSelectedMethod] = useState<'ai' | 'manual' | 'template' | null>(null);
  const [aiTopic, setAiTopic] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualSlideCount, setManualSlideCount] = useState(5);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customTemplateTitle, setCustomTemplateTitle] = useState('');

  const handleNext = () => {
    if (selectedMethod) {
      setCurrentStep('details');
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('method');
    } else if (currentStep === 'generating') {
      setCurrentStep('details');
    } else {
      onBack();
    }
  };

  const handleCreateAI = async () => {
    if (!aiTopic.trim()) {
      alert('Please enter a topic for your AI-generated presentation');
      return;
    }
    if (!hasApiKey) {
      onOpenSettings();
      return;
    }
    
    // Move to generating step
    setCurrentStep('generating');
    
    try {
      await onCreateAI(aiTopic.trim());
    } catch (error) {
      // If there's an error, go back to details step
      setCurrentStep('details');
    }
  };

  const handleCreateManual = () => {
    if (!manualTitle.trim()) {
      alert('Please enter a title for your presentation');
      return;
    }
    const blankPresentation = createBlankPresentation(manualTitle.trim(), manualSlideCount);
    onCreateManual(blankPresentation);
  };

  const handleCreateFromTemplate = () => {
    if (!selectedTemplate) {
      alert('Please select a template');
      return;
    }
    const templatePresentation = createTemplatePresentation(
      selectedTemplate, 
      customTemplateTitle.trim() || undefined
    );
    onCreateManual(templatePresentation);
  };

  const exampleTopics = [
    "Climate Change Solutions",
    "Digital Marketing Strategy",
    "Machine Learning in Healthcare",
    "Sustainable Energy Future",
    "Remote Work Best Practices",
    "Blockchain Technology Overview"
  ];

  const getStepNumber = () => {
    switch (currentStep) {
      case 'method': return 1;
      case 'details': return 2;
      case 'generating': return 3;
      default: return 1;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'method': return 'Choose Method';
      case 'details': return 'Add Details';
      case 'generating': return 'Generating';
      default: return 'Choose Method';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 'generating'}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors p-2 rounded-lg hover:bg-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">
              {currentStep === 'details' ? 'Back to Method Selection' : 
               currentStep === 'generating' ? 'Generating...' : 'Back to Dashboard'}
            </span>
          </button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create New Presentation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentStep === 'method' 
                ? 'Choose how you\'d like to create your presentation. Generate with AI for instant content, use professional templates, or start from scratch.'
                : currentStep === 'details'
                ? 'Now let\'s set up the details for your presentation.'
                : 'Our AI is creating your presentation with professional content and structure.'
              }
            </p>
          </div>

          {/* Enhanced Step Indicator */}
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center space-x-4">
              {/* Step 1 */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 'method' ? 'bg-blue-600 text-white' : 
                getStepNumber() > 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500'
              }`}>
                <span className="text-sm font-semibold">1</span>
              </div>
              <div className={`h-1 w-16 ${
                getStepNumber() > 1 ? 'bg-blue-600' : 'bg-gray-300'
              }`}></div>
              
              {/* Step 2 */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 'details' ? 'bg-blue-600 text-white' : 
                getStepNumber() > 2 ? 'bg-green-600 text-white' : 
                getStepNumber() >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
              }`}>
                <span className="text-sm font-semibold">2</span>
              </div>
              <div className={`h-1 w-16 ${
                getStepNumber() > 2 ? 'bg-blue-600' : 'bg-gray-300'
              }`}></div>
              
              {/* Step 3 */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 'generating' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
              }`}>
                <span className="text-sm font-semibold">3</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-sm text-gray-600">
              {getStepTitle()}
            </div>
          </div>
        </div>

        {/* Step 1: Method Selection */}
        {currentStep === 'method' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* AI Generated */}
              <div
                className={`relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border-2 cursor-pointer transition-all hover:shadow-xl ${
                  selectedMethod === 'ai' ? 'border-blue-500 ring-4 ring-blue-200 scale-105' : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedMethod('ai')}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Generated</h3>
                    <p className="text-sm text-blue-600 font-medium">Recommended</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Let AI create a comprehensive presentation with professional content, structure, and speaker notes based on your topic.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span>Instant content generation</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span>Professional structure & flow</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span>AI-generated speaker notes</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Palette className="h-4 w-4 text-blue-600" />
                    <span>Background image generation</span>
                  </div>
                </div>

                {selectedMethod === 'ai' && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Template Based */}
              <div
                className={`relative bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-8 border-2 cursor-pointer transition-all hover:shadow-xl ${
                  selectedMethod === 'template' ? 'border-green-500 ring-4 ring-green-200 scale-105' : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => setSelectedMethod('template')}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl flex items-center justify-center">
                    <Monitor className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Professional Templates</h3>
                    <p className="text-sm text-green-600 font-medium">Quick Start</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Start with professionally designed templates for business, education, or creative presentations.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-green-600" />
                    <span>Professional templates</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                    <span>Business, education & creative</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Edit3 className="h-4 w-4 text-green-600" />
                    <span>Fully customizable content</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Lightbulb className="h-4 w-4 text-green-600" />
                    <span>Pre-written speaker notes</span>
                  </div>
                </div>

                {selectedMethod === 'template' && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Creation */}
              <div
                className={`relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 cursor-pointer transition-all hover:shadow-xl ${
                  selectedMethod === 'manual' ? 'border-purple-500 ring-4 ring-purple-200 scale-105' : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setSelectedMethod('manual')}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                    <Edit3 className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Start from Scratch</h3>
                    <p className="text-sm text-purple-600 font-medium">Full Control</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Create a blank presentation and build it exactly how you want with complete creative control.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Plus className="h-4 w-4 text-purple-600" />
                    <span>Blank slides to customize</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Edit3 className="h-4 w-4 text-purple-600" />
                    <span>Complete creative freedom</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Palette className="h-4 w-4 text-purple-600" />
                    <span>Custom design and layout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span>Write your own content</span>
                  </div>
                </div>

                {selectedMethod === 'manual' && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-center">
              <button
                onClick={handleNext}
                disabled={!selectedMethod}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                <span>Continue</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {currentStep === 'details' && (
          <div className="max-w-4xl mx-auto">
            {selectedMethod === 'ai' && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Generated Presentation</h2>
                    <p className="text-blue-600">Let AI create comprehensive content for you</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      What's your presentation topic?
                    </label>
                    <input
                      type="text"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="e.g., Climate Change Solutions, Marketing Strategy..."
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Popular topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {exampleTopics.map((topic, index) => (
                        <button
                          key={index}
                          onClick={() => setAiTopic(topic)}
                          className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCreateAI}
                    disabled={!aiTopic.trim() || !hasApiKey}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {!hasApiKey ? (
                      'Configure API Key First'
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generate with AI
                      </>
                    )}
                  </button>

                  {!hasApiKey && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-amber-800 text-sm">
                        API key required for AI generation. Please configure your API key first.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedMethod === 'template' && (
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-8 border border-green-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl flex items-center justify-center">
                    <Monitor className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Professional Templates</h2>
                    <p className="text-green-600">Choose from professionally designed templates</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Choose a template:
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {presentationTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`p-4 text-left rounded-xl border transition-all ${
                            selectedTemplate === template.id
                              ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                              : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            {template.category === 'business' && <Briefcase className="w-5 h-5 text-blue-600" />}
                            {template.category === 'education' && <BookOpen className="w-5 h-5 text-purple-600" />}
                            {template.category === 'creative' && <Palette className="w-5 h-5 text-pink-600" />}
                            {template.category === 'general' && <Rocket className="w-5 h-5 text-teal-600" />}
                            <span className="font-semibold text-lg">{template.name}</span>
                          </div>
                          <p className="text-gray-600 mb-2">{template.description}</p>
                          <p className="text-sm text-gray-500">{template.slideCount} slides</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Custom title (optional):
                    </label>
                    <input
                      type="text"
                      value={customTemplateTitle}
                      onChange={(e) => setCustomTemplateTitle(e.target.value)}
                      placeholder="Leave blank to use template name"
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>

                  <button
                    onClick={handleCreateFromTemplate}
                    disabled={!selectedTemplate}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create from Template
                  </button>
                </div>
              </div>
            )}

            {selectedMethod === 'manual' && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                    <Edit3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Start from Scratch</h2>
                    <p className="text-purple-600">Create a blank presentation with full control</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Presentation title:
                    </label>
                    <input
                      type="text"
                      value={manualTitle}
                      onChange={(e) => setManualTitle(e.target.value)}
                      placeholder="Enter your presentation title"
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Number of slides:
                    </label>
                    <select
                      value={manualSlideCount}
                      onChange={(e) => setManualSlideCount(parseInt(e.target.value))}
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    >
                      {[3, 4, 5, 6, 7, 8, 9, 10].map(count => (
                        <option key={count} value={count}>{count} slides</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleCreateManual}
                    disabled={!manualTitle.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Blank Presentation
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Generating (Loading UI) */}
        {currentStep === 'generating' && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-3xl p-12 max-w-2xl mx-4 text-center shadow-2xl border border-gray-100">
              {/* Animated AI Brain Icon */}
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Brain className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="h-4 w-4 text-yellow-800" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Creating Your AI Presentation
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Our advanced AI is generating comprehensive content, professional structure, and engaging speaker notes for <span className="font-semibold text-blue-600">"{aiTopic}"</span>
              </p>

              {/* Progress Steps */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 font-medium">Analyzing your topic and gathering insights...</span>
                </div>
                <div className="flex items-center gap-4 text-left">
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse delay-300"></div>
                  <span className="text-gray-700 font-medium">Generating professional slide content and structure...</span>
                </div>
                <div className="flex items-center gap-4 text-left">
                  <div className="w-3 h-3 bg-teal-600 rounded-full animate-pulse delay-700"></div>
                  <span className="text-gray-700 font-medium">Creating engaging speaker notes for narration...</span>
                </div>
                <div className="flex items-center gap-4 text-left">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse delay-1000"></div>
                  <span className="text-gray-700 font-medium">Finalizing presentation layout and flow...</span>
                </div>
              </div>

              {/* Loading Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-full animate-pulse" style={{
                  width: '100%',
                  animation: 'loading-bar 3s ease-in-out infinite'
                }}></div>
              </div>

              <p className="text-sm text-gray-500">
                This usually takes 30-60 seconds. Please don't close this window.
              </p>
            </div>
          </div>
        )}

        {/* Features Comparison - Only show on method selection step */}
        {currentStep === 'method' && (
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/20 mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What's included in all methods
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Voice Narration</h4>
                <p className="text-sm text-gray-600">Human-like emotional voice with natural pauses</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Auto-Advance Mode</h4>
                <p className="text-sm text-gray-600">Automated slide progression with perfect timing</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Edit3 className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Full Editing</h4>
                <p className="text-sm text-gray-600">Complete control over content and design</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-teal-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Export & Share</h4>
                <p className="text-sm text-gray-600">PDF, PPTX, and sharing capabilities</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for loading animation */}
      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};