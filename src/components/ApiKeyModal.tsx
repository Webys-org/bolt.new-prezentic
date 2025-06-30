import React, { useState, useEffect } from 'react';
import { Key, X, ExternalLink, Shield, Zap, Mic, Sparkles } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKeys: { gemini: string; vapi: string }) => void;
  initialKeys?: { gemini: string; vapi: string };
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialKeys
}) => {
  const [geminiKey, setGeminiKey] = useState(initialKeys?.gemini || '');
  const [vapiKey, setVapiKey] = useState(initialKeys?.vapi || '');

  useEffect(() => {
    if (initialKeys) {
      setGeminiKey(initialKeys.gemini || '');
      setVapiKey(initialKeys.vapi || '');
    }
  }, [initialKeys]);

  const handleSave = () => {
    if (!geminiKey.trim()) {
      alert('Gemini API key is required');
      return;
    }
    onSave({ 
      gemini: geminiKey.trim(), 
      vapi: vapiKey.trim() 
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-md md:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 md:p-8 border-b border-gray-100">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
              <Key className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">API Configuration</h2>
              <p className="text-xs md:text-sm text-gray-600">Configure your AI services for presentation generation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        <div className="p-4 md:p-8 space-y-4 md:space-y-8">
          {/* Gemini API Section */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Google Gemini API</h3>
                <p className="text-xs md:text-sm text-gray-600">Required for AI content generation and image creation</p>
              </div>
            </div>
            
            <div className="space-y-2 md:space-y-3">
              <label className="block text-xs md:text-sm font-medium text-gray-700">
                API Key *
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 md:gap-2 text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Get your API key <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
              </a>
            </div>

            <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200 text-xs md:text-sm">
              <h4 className="font-medium text-blue-900 mb-1 md:mb-2">Gemini Features:</h4>
              <ul className="text-blue-800 space-y-0.5 md:space-y-1">
                <li>• Smart presentation content generation</li>
                <li>• Professional slide structure and organization</li>
                <li>• AI-powered background image creation</li>
                <li className="hidden md:block">• Topic-specific content with real insights</li>
              </ul>
            </div>
          </div>

          {/* Vapi API Section */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mic className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Vapi.ai Voice API</h3>
                <p className="text-xs md:text-sm text-gray-600">Required for human-like AI narration and auto-advance features</p>
              </div>
            </div>
            
            <div className="space-y-2 md:space-y-3">
              <label className="block text-xs md:text-sm font-medium text-gray-700">
                Public API Key *
              </label>
              <input
                type="password"
                value={vapiKey}
                onChange={(e) => setVapiKey(e.target.value)}
                placeholder="Enter your Vapi.ai public API key"
                className="w-full px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
              <a
                href="https://dashboard.vapi.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 md:gap-2 text-xs md:text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Get your API key <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
              </a>
            </div>

            <div className="bg-purple-50 p-3 md:p-4 rounded-lg border border-purple-200 text-xs md:text-sm">
              <h4 className="font-medium text-purple-900 mb-1 md:mb-2">Vapi.ai Features:</h4>
              <ul className="text-purple-800 space-y-0.5 md:space-y-1">
                <li>• Human-like emotional AI voice narration</li>
                <li>• Dramatic pauses and natural speech patterns</li>
                <li>• Auto-advance presentation mode</li>
                <li className="hidden md:block">• Real-time word highlighting during narration</li>
                <li className="hidden md:block">• Professional presentation delivery</li>
              </ul>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="bg-gray-50 p-3 md:p-6 rounded-lg md:rounded-xl border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-3">
              <Shield className="h-5 w-5 md:h-6 md:w-6 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Privacy & Security</h4>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Your API keys are stored locally in your browser and are never sent to our servers. 
                  They are only used to make direct API calls to Google Gemini and Vapi.ai services. 
                  All data remains secure and private.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 md:p-6 rounded-lg md:rounded-xl border border-blue-200">
            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-3">
              <Zap className="h-5 w-5 md:h-6 md:w-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Quick Start Guide</h4>
                <ol className="text-xs md:text-sm text-gray-700 space-y-0.5 md:space-y-1 list-decimal list-inside">
                  <li>Get your Gemini API key from Google AI Studio</li>
                  <li>Get your Vapi.ai public key from the Vapi dashboard</li>
                  <li>Enter both keys above and click "Save Keys"</li>
                  <li>Generate your first AI presentation with emotional narration!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 md:gap-4 p-4 md:p-8 border-t border-gray-100 bg-gray-50 rounded-b-xl md:rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 md:px-6 md:py-3 text-xs md:text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 md:px-6 md:py-3 text-xs md:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg"
          >
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
};