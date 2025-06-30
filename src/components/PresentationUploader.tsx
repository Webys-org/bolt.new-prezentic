import React, { useRef, useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Slide, Presentation } from '../types/presentation';

interface PresentationUploaderProps {
  onImportPresentation: (presentation: Presentation) => void;
  onImportSlides: (slides: Slide[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationUploader: React.FC<PresentationUploaderProps> = ({
  onImportPresentation,
  onImportSlides,
  isOpen,
  onClose
}) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewData, setPreviewData] = useState<Presentation | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('processing');
    setErrorMessage('');

    try {
      if (file.type === 'application/json') {
        await handleJSONUpload(file);
      } else if (file.type.startsWith('text/')) {
        await handleTextUpload(file);
      } else {
        throw new Error('Unsupported file type. Please upload JSON or text files.');
      }
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process file');
    }
  };

  const handleJSONUpload = async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);

    // Validate structure
    if (!data.title || !data.slides || !Array.isArray(data.slides)) {
      throw new Error('Invalid presentation format. Expected JSON with title and slides array.');
    }

    // Normalize slides
    const normalizedSlides: Slide[] = data.slides.map((slide: any, index: number) => ({
      id: slide.id || `imported-slide-${index + 1}`,
      title: slide.title || `Imported Slide ${index + 1}`,
      content: Array.isArray(slide.content) ? slide.content : [slide.content || 'Imported content'],
      notes: slide.notes || `Speaker notes for imported slide ${index + 1}`,
      imageUrl: slide.imageUrl
    }));

    const presentation: Presentation = {
      title: data.title,
      slides: normalizedSlides
    };

    setPreviewData(presentation);
    setUploadStatus('success');
  };

  const handleTextUpload = async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      throw new Error('File appears to be empty');
    }

    // Parse text format (simple format: title on first line, then slide content)
    const title = lines[0] || 'Imported Presentation';
    const slides: Slide[] = [];
    
    let currentSlide: Partial<Slide> = {};
    let slideIndex = 1;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('# ') || line.startsWith('## ')) {
        // New slide title
        if (currentSlide.title) {
          slides.push({
            id: `imported-slide-${slideIndex}`,
            title: currentSlide.title,
            content: currentSlide.content || ['Imported content'],
            notes: currentSlide.notes || `Speaker notes for ${currentSlide.title}`,
            imageUrl: currentSlide.imageUrl
          });
          slideIndex++;
        }
        
        currentSlide = {
          title: line.replace(/^#+\s*/, ''),
          content: [],
          notes: ''
        };
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        // Bullet point
        if (!currentSlide.content) currentSlide.content = [];
        currentSlide.content.push(line.replace(/^[-*]\s*/, ''));
      } else if (line.length > 0) {
        // Regular text - add to notes
        currentSlide.notes = (currentSlide.notes || '') + line + ' ';
      }
    }

    // Add the last slide
    if (currentSlide.title) {
      slides.push({
        id: `imported-slide-${slideIndex}`,
        title: currentSlide.title,
        content: currentSlide.content || ['Imported content'],
        notes: currentSlide.notes || `Speaker notes for ${currentSlide.title}`,
        imageUrl: currentSlide.imageUrl
      });
    }

    if (slides.length === 0) {
      throw new Error('No slides found in the text file');
    }

    const presentation: Presentation = {
      title,
      slides
    };

    setPreviewData(presentation);
    setUploadStatus('success');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadStatus('processing');

    try {
      const imageSlides: Slide[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        await new Promise((resolve) => {
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            imageSlides.push({
              id: `image-slide-${i + 1}`,
              title: `Image Slide: ${file.name}`,
              content: [`Image: ${file.name}`, 'Visual content slide', 'Imported from image upload'],
              notes: `This slide contains an image: ${file.name}. Describe the visual content and its relevance to your presentation topic.`,
              imageUrl
            });
            resolve(void 0);
          };
          reader.readAsDataURL(file);
        });
      }

      const presentation: Presentation = {
        title: `Image Presentation (${imageSlides.length} slides)`,
        slides: imageSlides
      };

      setPreviewData(presentation);
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Failed to process images');
    }
  };

  const handleImport = () => {
    if (previewData) {
      onImportPresentation(previewData);
      handleClose();
    }
  };

  const handleImportSlidesOnly = () => {
    if (previewData) {
      onImportSlides(previewData.slides);
      handleClose();
    }
  };

  const handleClose = () => {
    setUploadStatus('idle');
    setErrorMessage('');
    setPreviewData(null);
    onClose();
  };

  const downloadSampleJSON = () => {
    const sample = {
      title: "Sample Presentation",
      slides: [
        {
          id: "slide-1",
          title: "Welcome Slide",
          content: [
            "Welcome to our presentation",
            "Key topics we'll cover today",
            "Interactive and engaging content"
          ],
          notes: "Welcome everyone to this presentation. Today we'll explore key topics with interactive and engaging content that will provide valuable insights."
        },
        {
          id: "slide-2",
          title: "Main Content",
          content: [
            "Primary concept or idea",
            "Supporting details and examples",
            "Practical applications"
          ],
          notes: "This slide covers the main content including primary concepts, supporting details with examples, and practical applications you can use."
        }
      ]
    };

    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-presentation.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Import Presentation</h2>
              <p className="text-gray-600">Upload slides from files or images</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-8">
          {uploadStatus === 'idle' && (
            <div className="space-y-8">
              {/* Upload Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* JSON/Text Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.txt,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Presentation File</h3>
                  <p className="text-gray-600 mb-4">JSON, TXT, or Markdown files</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto"
                  >
                    <Upload className="w-5 h-5" />
                    Choose File
                  </button>
                </div>

                {/* Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Images</h3>
                  <p className="text-gray-600 mb-4">Create slides from images</p>
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2 mx-auto"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Choose Images
                  </button>
                </div>
              </div>

              {/* Sample Download */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Need a template?</h4>
                <p className="text-blue-800 text-sm mb-4">
                  Download a sample JSON file to see the expected format for presentations.
                </p>
                <button
                  onClick={downloadSampleJSON}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download Sample JSON
                </button>
              </div>

              {/* Format Guide */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Supported Formats</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">JSON Format:</h5>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Complete presentation structure</li>
                      <li>• Title, slides, content, and notes</li>
                      <li>• Image URLs supported</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Text/Markdown:</h5>
                    <ul className="text-gray-600 space-y-1">
                      <li>• # or ## for slide titles</li>
                      <li>• - or * for bullet points</li>
                      <li>• Regular text for speaker notes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {uploadStatus === 'processing' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Upload...</h3>
              <p className="text-gray-600">Please wait while we process your files</p>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">Upload Failed</h3>
              <p className="text-red-700 mb-6">{errorMessage}</p>
              <button
                onClick={() => setUploadStatus('idle')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {uploadStatus === 'success' && previewData && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-900 mb-2">Upload Successful!</h3>
                <p className="text-green-700">Preview your imported presentation below</p>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">{previewData.title}</h4>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {previewData.slides.map((slide, index) => (
                    <div key={slide.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-2">{slide.title}</h5>
                          <div className="text-sm text-gray-600 space-y-1">
                            {slide.content.slice(0, 2).map((point, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{point}</span>
                              </div>
                            ))}
                            {slide.content.length > 2 && (
                              <div className="text-gray-500 text-xs">
                                +{slide.content.length - 2} more points
                              </div>
                            )}
                          </div>
                          {slide.imageUrl && (
                            <div className="mt-2 text-xs text-blue-600">📷 Image attached</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Import Options */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleImportSlidesOnly}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  Add Slides to Current
                </button>
                <button
                  onClick={handleImport}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Replace Entire Presentation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};