import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertTriangle, CheckCircle, ArrowRight, Merge, Replace, Plus, Settings } from 'lucide-react';
import { Presentation } from '../types/presentation';
import { PPTXImportService, ConflictResolutionService, ConflictResolutionOptions } from '../services/pptxService';

interface PPTXImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (presentation: Presentation) => void;
  existingPresentation?: Presentation;
}

export const PPTXImportModal: React.FC<PPTXImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
  existingPresentation
}) => {
  const [step, setStep] = useState<'upload' | 'conflict' | 'processing' | 'complete'>('upload');
  const [importedPresentation, setImportedPresentation] = useState<Presentation | null>(null);
  const [conflictOptions, setConflictOptions] = useState<ConflictResolutionOptions>({
    action: 'merge',
    slideHandling: 'mergeContent',
    titleHandling: 'combine'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pptx') && !file.name.toLowerCase().endsWith('.ppt')) {
      setError('Please select a valid PowerPoint file (.pptx or .ppt)');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const imported = await PPTXImportService.importPPTX(file);
      setImportedPresentation(imported);
      
      // If there's an existing presentation, show conflict resolution
      if (existingPresentation) {
        setStep('conflict');
      } else {
        // No conflicts, proceed directly
        onImportComplete(imported);
        handleClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import PPTX file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConflictResolution = () => {
    if (!importedPresentation || !existingPresentation) return;

    setIsProcessing(true);
    
    try {
      const resolvedPresentation = ConflictResolutionService.resolveImportConflicts(
        existingPresentation,
        importedPresentation,
        conflictOptions
      );
      
      onImportComplete(resolvedPresentation);
      setStep('complete');
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve conflicts');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('upload');
    setImportedPresentation(null);
    setError(null);
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Import PowerPoint Presentation</h2>
              <p className="text-gray-600 text-sm">Upload and integrate PPTX files professionally</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload PowerPoint File
                </h3>
                <p className="text-gray-600">
                  Select a .pptx or .ppt file to import into your presentation
                </p>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-orange-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pptx,.ppt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {isProcessing ? (
                  <div className="space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="text-gray-600">Processing PowerPoint file...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-gray-600 mb-4">
                        Drag and drop your PowerPoint file here, or click to browse
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all flex items-center gap-2 mx-auto"
                      >
                        <Upload className="w-4 h-4" />
                        Choose PPTX File
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Supports .pptx and .ppt files up to 50MB
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-800 font-medium">Import Error</p>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-4">Import Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">Preserves slide structure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">Imports speaker notes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">Handles content conflicts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">Professional integration</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Conflict Resolution */}
          {step === 'conflict' && importedPresentation && existingPresentation && (
            <div className="space-y-6">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Resolve Import Conflicts
                </h3>
                <p className="text-gray-600">
                  You have an existing presentation. Choose how to handle the imported content.
                </p>
              </div>

              {/* Conflict Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Import Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Existing Presentation</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Title:</strong> {existingPresentation.title}</p>
                      <p><strong>Slides:</strong> {existingPresentation.slides.length}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Imported Presentation</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Title:</strong> {importedPresentation.title}</p>
                      <p><strong>Slides:</strong> {importedPresentation.slides.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resolution Options */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Choose Resolution Method</h4>
                
                <div className="grid grid-cols-1 gap-4">
                  {/* Replace */}
                  <label className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    conflictOptions.action === 'replace' 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 hover:border-red-300'
                  }`}>
                    <input
                      type="radio"
                      name="action"
                      value="replace"
                      checked={conflictOptions.action === 'replace'}
                      onChange={(e) => setConflictOptions(prev => ({ ...prev, action: e.target.value as any }))}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <Replace className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-gray-900">Replace Existing</h5>
                        <p className="text-sm text-gray-600">
                          Replace your current presentation entirely with the imported one
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Merge */}
                  <label className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    conflictOptions.action === 'merge' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}>
                    <input
                      type="radio"
                      name="action"
                      value="merge"
                      checked={conflictOptions.action === 'merge'}
                      onChange={(e) => setConflictOptions(prev => ({ ...prev, action: e.target.value as any }))}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <Merge className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-gray-900">Smart Merge</h5>
                        <p className="text-sm text-gray-600">
                          Intelligently combine content from both presentations
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Append */}
                  <label className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    conflictOptions.action === 'append' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}>
                    <input
                      type="radio"
                      name="action"
                      value="append"
                      checked={conflictOptions.action === 'append'}
                      onChange={(e) => setConflictOptions(prev => ({ ...prev, action: e.target.value as any }))}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <Plus className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-gray-900">Append Slides</h5>
                        <p className="text-sm text-gray-600">
                          Add imported slides to the end of your existing presentation
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Advanced Options */}
              {conflictOptions.action === 'merge' && (
                <div className="bg-blue-50 rounded-xl p-6 space-y-4">
                  <h5 className="font-medium text-blue-900 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Advanced Merge Options
                  </h5>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      Title Handling:
                    </label>
                    <select
                      value={conflictOptions.titleHandling}
                      onChange={(e) => setConflictOptions(prev => ({ 
                        ...prev, 
                        titleHandling: e.target.value as any 
                      }))}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="keepExisting">Keep existing title</option>
                      <option value="keepImported">Use imported title</option>
                      <option value="combine">Combine both titles</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      Slide Content Handling:
                    </label>
                    <select
                      value={conflictOptions.slideHandling}
                      onChange={(e) => setConflictOptions(prev => ({ 
                        ...prev, 
                        slideHandling: e.target.value as any 
                      }))}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="mergeContent">Merge slide content</option>
                      <option value="keepExisting">Keep existing slides</option>
                      <option value="keepImported">Use imported slides</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep('upload')}
                  className="flex-1 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConflictResolution}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Apply Changes
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === 'complete' && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                Import Completed Successfully!
              </h3>
              <p className="text-green-700">
                Your PowerPoint presentation has been imported and integrated professionally.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};