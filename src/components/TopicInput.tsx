import React, { useState } from 'react';
import { Sparkles, Settings, Zap, Presentation, Mic } from 'lucide-react';

interface TopicInputProps {
  onGenerate: (topic: string) => void;
  onOpenSettings: () => void;
  isLoading: boolean;
  hasApiKey: boolean;
}

export const TopicInput: React.FC<TopicInputProps> = ({
  onGenerate,
  onOpenSettings,
  isLoading,
  hasApiKey
}) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onGenerate(topic.trim());
    }
  };

  const exampleTopics = [
    "Machine Learning in Healthcare",
    "Sustainable Energy Solutions",
    "Future of Remote Work",
    "Blockchain Technology",
    "AI Ethics and Society",
    "Climate Change Solutions"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-full mb-4 md:mb-6 shadow-2xl">
          <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
          Prezentic
        </h1>
        <p className="text-base md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
          Create stunning presentations with AI-powered content, professional visuals, and human-like narration
        </p>
        
        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 md:mb-4 mx-auto">
              <Presentation className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Smart Content Generation</h3>
            <p className="text-xs md:text-sm text-gray-600">AI creates comprehensive, topic-specific presentations with professional structure</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 md:mb-4 mx-auto">
              <Zap className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Auto-Advance Mode</h3>
            <p className="text-xs md:text-sm text-gray-600">Automated slide progression with perfect timing and natural transitions</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-3 md:mb-4 mx-auto">
              <Mic className="h-5 w-5 md:h-6 md:w-6 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Human-like Narration</h3>
            <p className="text-xs md:text-sm text-gray-600">Emotional AI voice with dramatic pauses, enthusiasm, and natural speech patterns</p>
          </div>
        </div>
      </div>

      {/* Main Input Form */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl p-6 md:p-8 lg:p-12 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="relative">
            <label className="block text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
              What would you like to present about?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your presentation topic (e.g., 'Machine Learning in Healthcare')"
              className="w-full px-4 md:px-6 py-3 md:py-4 text-sm md:text-lg border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 md:pr-6 pt-10 md:pt-12">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            </div>
          </div>

          {/* Example Topics */}
          <div className="space-y-2 md:space-y-3">
            <p className="text-xs md:text-sm font-medium text-gray-700">Popular topics:</p>
            <div className="flex flex-wrap gap-2">
              {exampleTopics.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setTopic(example)}
                  disabled={isLoading}
                  className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 md:gap-4">
            <button
              type="submit"
              disabled={!topic.trim() || isLoading || !hasApiKey}
              className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg md:rounded-xl font-semibold text-sm md:text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 md:gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 md:h-6 md:w-6 border-b-2 border-white"></div>
                  <span>Creating Your Presentation...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 md:gap-3">
                  <Sparkles className="h-4 w-4 md:h-6 md:w-6" />
                  <span>Generate Presentation</span>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="px-4 py-3 md:px-6 md:py-4 bg-gray-100 text-gray-700 rounded-lg md:rounded-xl hover:bg-gray-200 transition-colors shadow-md hover:shadow-lg"
              title="API Settings"
            >
              <Settings className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>

          {!hasApiKey && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg md:rounded-xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-3">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-600 text-xs md:text-sm font-bold">!</span>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1 text-sm md:text-base">API Configuration Required</h4>
                  <p className="text-xs md:text-sm text-amber-800">
                    Please configure your API keys in settings to unlock the full power of AI presentation generation with professional narration.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Additional Information */}
      <div className="mt-8 md:mt-12 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-blue-600 mb-1">5-8</div>
            <div className="text-xs md:text-sm text-gray-600">Professional Slides</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-purple-600 mb-1">AI</div>
            <div className="text-xs md:text-sm text-gray-600">Generated Content</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-teal-600 mb-1">Auto</div>
            <div className="text-xs md:text-sm text-gray-600">Slide Progression</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-indigo-600 mb-1">Human</div>
            <div className="text-xs md:text-sm text-gray-600">Like Narration</div>
          </div>
        </div>
      </div>
    </div>
  );
};