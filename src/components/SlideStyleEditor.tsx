import React, { useState, useEffect, useRef } from 'react';
import { Palette, Type, Layout, Sparkles, X, Save, RefreshCw, Eye, Monitor, Briefcase, Star, Grid, BarChart3, Image as ImageIcon, Layers, Upload, Camera } from 'lucide-react';
import { Slide, SlideStyle } from '../types/presentation';

interface SlideStyleEditorProps {
  slide: Slide;
  onStyleUpdate: (slideId: string, style: SlideStyle) => void;
  onImageUpdate?: (slideId: string, imageUrl: string) => void;
  onImageRemove?: (slideId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const defaultSlideStyle: SlideStyle = {
  template: 'modern',
  background: {
    type: 'gradient',
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    opacity: 100
  },
  typography: {
    titleFont: 'inter',
    contentFont: 'inter',
    titleSize: 'large',
    contentSize: 'medium',
    titleColor: '#FFFFFF',
    contentColor: '#FFFFFF'
  },
  layout: {
    contentAlignment: 'left',
    imagePosition: 'right',
    spacing: 'normal',
    padding: 'medium'
  },
  effects: {
    shadow: 'medium',
    borderRadius: 12,
    animation: 'fade',
    overlay: {
      enabled: false,
      color: '#000000',
      opacity: 30,
      blend: 'normal'
    }
  }
};

export const SlideStyleEditor: React.FC<SlideStyleEditorProps> = ({
  slide,
  onStyleUpdate,
  onImageUpdate,
  onImageRemove,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'template' | 'background' | 'typography' | 'layout' | 'effects' | 'image'>('template');
  const [currentStyle, setCurrentStyle] = useState<SlideStyle>(slide.slideStyle || defaultSlideStyle);
  const [previewMode, setPreviewMode] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>('');
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempImageUrl(slide.imageUrl || '');
    console.log('Style Editor: Syncing image URL:', slide.imageUrl);
  }, [slide.imageUrl, slide.id]);

  useEffect(() => {
    setCurrentStyle(slide.slideStyle || defaultSlideStyle);
  }, [slide.slideStyle]);

  const handleStyleChange = (updates: Partial<SlideStyle>) => {
    setCurrentStyle(prev => ({ ...prev, ...updates }));
  };

  const handleNestedStyleChange = (section: keyof SlideStyle, updates: any) => {
    setCurrentStyle(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  const handleSave = () => {
    console.log('Saving style and image:', { style: currentStyle, imageUrl: tempImageUrl });
    
    onStyleUpdate(slide.id, currentStyle);
    
    if (tempImageUrl !== slide.imageUrl) {
      if (tempImageUrl && onImageUpdate) {
        console.log('Updating image URL:', tempImageUrl);
        onImageUpdate(slide.id, tempImageUrl);
      } else if (!tempImageUrl && onImageRemove) {
        console.log('Removing image');
        onImageRemove(slide.id);
      }
    }
    
    onClose();
  };

  const handleReset = () => {
    setCurrentStyle(defaultSlideStyle);
    setTempImageUrl(slide.imageUrl || '');
    setImageError(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setImageError('Invalid file type. Please select an image file.');
        return;
      }
      
      setImageError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setTempImageUrl(imageUrl);
        console.log('Image uploaded in style editor:', imageUrl.substring(0, 50) + '...');
      };
      reader.onerror = () => {
        setImageError('Failed to read image file');
        console.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemoveLocal = () => {
    setTempImageUrl('');
    setImageError(null);
    console.log('Image removed in style editor');
  };

  const handleImageUrlChange = (url: string) => {
    setTempImageUrl(url);
    setImageError(null);
  };

  const templateOptions = [
    { 
      id: 'modern', 
      name: 'Modern', 
      icon: Monitor, 
      description: 'Clean, contemporary design with gradients',
      preview: 'bg-gradient-to-br from-blue-500 to-purple-600'
    },
    { 
      id: 'minimal', 
      name: 'Minimal', 
      icon: Grid, 
      description: 'Simple, clean layout with lots of white space',
      preview: 'bg-white border-2 border-gray-200'
    },
    { 
      id: 'corporate', 
      name: 'Corporate', 
      icon: Briefcase, 
      description: 'Professional business presentation style',
      preview: 'bg-gradient-to-r from-slate-600 to-slate-800'
    },
    { 
      id: 'hero', 
      name: 'Hero', 
      icon: Star, 
      description: 'Full-screen impact with large imagery',
      preview: 'bg-gradient-to-br from-indigo-900 to-purple-900'
    },
    { 
      id: 'split', 
      name: 'Split', 
      icon: Layout, 
      description: '50/50 content and image layout',
      preview: 'bg-gradient-to-r from-green-400 to-blue-500'
    },
    { 
      id: 'overlay', 
      name: 'Overlay', 
      icon: Layers, 
      description: 'Content overlaid on background image',
      preview: 'bg-gradient-to-br from-gray-900 to-black'
    },
    { 
      id: 'magazine', 
      name: 'Magazine', 
      icon: Type, 
      description: 'Editorial-style layout with typography focus',
      preview: 'bg-gradient-to-br from-red-500 to-pink-600'
    },
    { 
      id: 'timeline', 
      name: 'Timeline', 
      icon: BarChart3, 
      description: 'Sequential content with timeline elements',
      preview: 'bg-gradient-to-r from-teal-500 to-cyan-600'
    },
    { 
      id: 'comparison', 
      name: 'Comparison', 
      icon: Grid, 
      description: 'Side-by-side comparison layout',
      preview: 'bg-gradient-to-r from-orange-500 to-red-600'
    },
    { 
      id: 'showcase', 
      name: 'Showcase', 
      icon: ImageIcon, 
      description: 'Image-focused presentation style',
      preview: 'bg-gradient-to-br from-purple-600 to-pink-600'
    }
  ];

  const fontOptions = [
    { id: 'inter', name: 'Inter', style: 'font-sans' },
    { id: 'playfair', name: 'Playfair Display', style: 'font-serif' },
    { id: 'roboto', name: 'Roboto', style: 'font-sans' },
    { id: 'montserrat', name: 'Montserrat', style: 'font-sans' },
    { id: 'poppins', name: 'Poppins', style: 'font-sans' },
    { id: 'open-sans', name: 'Open Sans', style: 'font-sans' },
    { id: 'lato', name: 'Lato', style: 'font-sans' }
  ];

  const backgroundPatterns = [
    { id: 'dots', name: 'Dots', pattern: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)' },
    { id: 'grid', name: 'Grid', pattern: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)' },
    { id: 'diagonal', name: 'Diagonal', pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #e5e7eb 10px, #e5e7eb 20px)' },
    { id: 'waves', name: 'Waves', pattern: 'radial-gradient(ellipse at top, #f3f4f6, transparent), radial-gradient(ellipse at bottom, #e5e7eb, transparent)' }
  ];

  const positionOptions = [
    { id: 'left', name: 'Left' },
    { id: 'right', name: 'Right' },
    { id: 'top', name: 'Top' },
    { id: 'bottom', name: 'Bottom' },
    { id: 'background', name: 'Background' },
    { id: 'overlay', name: 'Overlay' }
  ];

  // Stock photos from Pexels
  const stockPhotos = [
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Individual Slide Style Editor</h2>
              <p className="text-gray-600 text-sm">Customize this slide's appearance with professional templates and styling</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                previewMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Edit Mode' : 'Preview'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'template', name: 'Templates', icon: Monitor },
            { id: 'background', name: 'Background', icon: ImageIcon },
            { id: 'typography', name: 'Typography', icon: Type },
            { id: 'layout', name: 'Layout', icon: Layout },
            { id: 'effects', name: 'Effects', icon: Sparkles },
            { id: 'image', name: 'Slide Image', icon: Camera }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-xl p-6 min-h-[500px] relative">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                
                {/* Slide Preview */}
                <div 
                  className="w-full aspect-video rounded-lg overflow-hidden shadow-lg relative"
                  style={{
                    background: currentStyle.background.type === 'gradient' 
                      ? `linear-gradient(135deg, ${currentStyle.background.primary}, ${currentStyle.background.secondary || currentStyle.background.primary})`
                      : currentStyle.background.type === 'solid'
                      ? currentStyle.background.primary
                      : currentStyle.background.type === 'image' && currentStyle.background.imageUrl
                      ? `url(${currentStyle.background.imageUrl})`
                      : '#f3f4f6',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Background Image */}
                  {tempImageUrl && currentStyle.layout.imagePosition === 'background' && (
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={tempImageUrl} 
                        alt="Background"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Background image failed to load:', tempImageUrl);
                          setImageError('Failed to load image. Please check the URL or try another image.');
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('Background image loaded successfully');
                          setImageError(null);
                        }}
                      />
                    </div>
                  )}

                  {/* Overlay */}
                  {currentStyle.effects.overlay.enabled && (
                    <div 
                      className="absolute inset-0 z-10"
                      style={{
                        background: currentStyle.effects.overlay.color,
                        opacity: currentStyle.effects.overlay.opacity / 100,
                        mixBlendMode: currentStyle.effects.overlay.blend
                      }}
                    />
                  )}
                  
                  {/* Content Layout */}
                  <div className="relative z-20 h-full flex">
                    {/* Content Area */}
                    <div className={`flex flex-col justify-center p-8 ${
                      currentStyle.template === 'split' && tempImageUrl && (currentStyle.layout.imagePosition === 'right' || currentStyle.layout.imagePosition === 'left') ? 'w-1/2' : 'w-full'
                    } ${
                      currentStyle.template === 'split' && tempImageUrl && currentStyle.layout.imagePosition === 'left' ? 'order-2' : ''
                    } ${
                      currentStyle.layout.contentAlignment === 'center' ? 'items-center text-center' :
                      currentStyle.layout.contentAlignment === 'right' ? 'items-end text-right' :
                      'items-start text-left'
                    }`}>
                      <h1 
                        className={`font-bold mb-4 ${
                          currentStyle.typography.titleSize === 'xl' ? 'text-4xl' :
                          currentStyle.typography.titleSize === 'large' ? 'text-3xl' :
                          currentStyle.typography.titleSize === 'medium' ? 'text-2xl' : 'text-xl'
                        }`}
                        style={{ 
                          color: currentStyle.typography.titleColor,
                          fontFamily: currentStyle.typography.titleFont
                        }}
                      >
                        {slide.title}
                      </h1>
                      
                      <div className="space-y-2">
                        {slide.content.slice(0, 3).map((point, index) => (
                          <div 
                            key={index}
                            className={`flex items-start gap-3 ${
                              currentStyle.typography.contentSize === 'large' ? 'text-lg' :
                              currentStyle.typography.contentSize === 'medium' ? 'text-base' : 'text-sm'
                            }`}
                            style={{ 
                              color: currentStyle.typography.contentColor,
                              fontFamily: currentStyle.typography.contentFont
                            }}
                          >
                            <div className="w-2 h-2 bg-current rounded-full mt-2 flex-shrink-0"></div>
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Split Layout Image */}
                    {currentStyle.template === 'split' && tempImageUrl && (currentStyle.layout.imagePosition === 'left' || currentStyle.layout.imagePosition === 'right') && (
                      <div className={`w-1/2 relative ${
                        currentStyle.layout.imagePosition === 'left' ? 'order-1' : ''
                      }`}>
                        <img
                          src={tempImageUrl}
                          alt="Slide"
                          className="w-full h-full object-cover"
                          style={{ borderRadius: `${currentStyle.effects.borderRadius}px` }}
                          onError={(e) => {
                            console.error('Split layout image failed to load:', tempImageUrl);
                            setImageError('Failed to load image. Please check the URL or try another image.');
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('Split layout image loaded successfully');
                            setImageError(null);
                          }}
                        />
                      </div>
                    )}

                    {/* Overlay Image */}
                    {currentStyle.layout.imagePosition === 'overlay' && tempImageUrl && (
                      <div className="absolute inset-0 z-15 flex items-center justify-center">
                        <img
                          src={tempImageUrl}
                          alt="Overlay"
                          className="max-w-md max-h-md object-contain opacity-80"
                          style={{ borderRadius: `${currentStyle.effects.borderRadius}px` }}
                          onError={(e) => {
                            console.error('Overlay image failed to load:', tempImageUrl);
                            setImageError('Failed to load image. Please check the URL or try another image.');
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('Overlay image loaded successfully');
                            setImageError(null);
                          }}
                        />
                      </div>
                    )}

                    {/* Top/Bottom Image */}
                    {(currentStyle.layout.imagePosition === 'top' || currentStyle.layout.imagePosition === 'bottom') && tempImageUrl && (
                      <div className={`absolute ${currentStyle.layout.imagePosition === 'top' ? 'top-4' : 'bottom-4'} left-1/2 transform -translate-x-1/2 z-15`}>
                        <img
                          src={tempImageUrl}
                          alt={currentStyle.layout.imagePosition}
                          className="max-w-xs max-h-32 object-contain"
                          style={{ borderRadius: `${currentStyle.effects.borderRadius}px` }}
                          onError={(e) => {
                            console.error(`${currentStyle.layout.imagePosition} image failed to load:`, tempImageUrl);
                            setImageError('Failed to load image. Please check the URL or try another image.');
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log(`${currentStyle.layout.imagePosition} image loaded successfully`);
                            setImageError(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Style Info */}
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      Template: <span className="text-blue-600">{currentStyle.template}</span>
                    </span>
                    <span className="text-gray-500">
                      Background: {currentStyle.background.type} • Layout: {currentStyle.layout.contentAlignment}
                      {tempImageUrl && <span className="ml-2 text-green-600">• Image: ✅ {currentStyle.layout.imagePosition}</span>}
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {imageError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{imageError}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Panel */}
            <div className="space-y-6">
              {/* Image Tab */}
              {activeTab === 'image' && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-gray-900">Slide Image Settings</h3>
                  
                  {/* Image Upload */}
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Image
                    </h4>
                    
                    {tempImageUrl ? (
                      <div className="space-y-4">
                        <img
                          src={tempImageUrl}
                          alt="Current slide image"
                          className="w-full h-32 object-cover rounded-lg border border-purple-200"
                          onError={(e) => {
                            console.error('Preview image failed to load:', tempImageUrl);
                            setImageError('Failed to load image. Please check the URL or try another image.');
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+';
                          }}
                          onLoad={() => {
                            console.log('Preview image loaded successfully');
                            setImageError(null);
                          }}
                        />
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            ref={fileInputRef}
                          />
                          <label
                            htmlFor="image-upload"
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all cursor-pointer text-center text-sm"
                          >
                            Change Image
                          </label>
                          <button
                            onClick={handleImageRemoveLocal}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          ref={fileInputRef}
                        />
                        <label
                          htmlFor="image-upload"
                          className="w-full p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 transition-colors cursor-pointer flex flex-col items-center justify-center text-center bg-white"
                        >
                          <Upload className="w-8 h-8 text-purple-500 mb-2" />
                          <span className="text-sm text-purple-700 font-medium">Click to upload image</span>
                          <p className="text-xs text-purple-600 mt-1">JPG, PNG, GIF up to 10MB</p>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Stock Photos */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-4">Professional Stock Photos</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {stockPhotos.map((photo, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setTempImageUrl(photo);
                            setImageError(null);
                          }}
                          className={`aspect-square rounded-lg overflow-hidden transition-all ${
                            tempImageUrl === photo 
                              ? 'ring-3 ring-blue-500 scale-105' 
                              : 'hover:ring-2 hover:ring-blue-300 hover:scale-105'
                          }`}
                        >
                          <img
                            src={photo}
                            alt={`Stock photo ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Stock photo failed to load:', photo);
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OTk5OSI+SW1hZ2UgRXJyb3I8L3RleHQ+PC9zdmc+';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Position */}
                  {tempImageUrl && (
                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-4">Image Position</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {positionOptions.map((position) => (
                          <button
                            key={position.id}
                            onClick={() => handleNestedStyleChange('layout', { imagePosition: position.id })}
                            className={`p-3 rounded-lg border-2 transition-all text-sm ${
                              currentStyle.layout.imagePosition === position.id
                                ? 'border-green-500 bg-green-100 text-green-700'
                                : 'border-gray-200 hover:border-green-300 text-gray-700'
                            }`}
                          >
                            {position.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image URL Input */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Or Enter Image URL</h4>
                    <input
                      type="url"
                      value={tempImageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Enter a valid image URL (e.g., https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg)
                    </p>
                  </div>

                  {/* Template Recommendation */}
                  {tempImageUrl && (
                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                      <h4 className="font-semibold text-amber-900 mb-2">💡 Template Recommendation</h4>
                      <p className="text-sm text-amber-800 mb-3">
                        For best image display, try the <strong>Split</strong> template with <strong>Right</strong> or <strong>Left</strong> positioning.
                      </p>
                      <button
                        onClick={() => {
                          handleStyleChange({ template: 'split' });
                          handleNestedStyleChange('layout', { imagePosition: 'right' });
                          setActiveTab('template');
                        }}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all text-sm"
                      >
                        Apply Split Template
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Template Tab */}
              {activeTab === 'template' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Choose Template Style</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {templateOptions.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleStyleChange({ template: template.id as any })}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          currentStyle.template === template.id
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 rounded-lg ${template.preview} flex items-center justify-center`}>
                            <template.icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{template.name}</div>
                            <div className="text-xs text-gray-600">{template.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Background Tab */}
              {activeTab === 'background' && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-gray-900">Background Settings</h3>
                  
                  {/* Background Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'gradient', name: 'Gradient' },
                        { id: 'solid', name: 'Solid Color' },
                        { id: 'image', name: 'Image' },
                        { id: 'pattern', name: 'Pattern' }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => handleNestedStyleChange('background', { type: type.id })}
                          className={`p-3 rounded-lg border-2 transition-all text-sm ${
                            currentStyle.background.type === type.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700'
                          }`}
                        >
                          {type.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentStyle.background.primary}
                        onChange={(e) => handleNestedStyleChange('background', { primary: e.target.value })}
                        className="w-12 h-8 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={currentStyle.background.primary}
                        onChange={(e) => handleNestedStyleChange('background', { primary: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  {/* Secondary Color (for gradients) */}
                  {currentStyle.background.type === 'gradient' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentStyle.background.secondary || currentStyle.background.primary}
                          onChange={(e) => handleNestedStyleChange('background', { secondary: e.target.value })}
                          className="w-12 h-8 rounded border border-gray-300"
                        />
                        <input
                          type="text"
                          value={currentStyle.background.secondary || currentStyle.background.primary}
                          onChange={(e) => handleNestedStyleChange('background', { secondary: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Background Image URL */}
                  {currentStyle.background.type === 'image' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={currentStyle.background.imageUrl || ''}
                        onChange={(e) => handleNestedStyleChange('background', { imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  )}

                  {/* Pattern Selection */}
                  {currentStyle.background.type === 'pattern' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pattern Style
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {backgroundPatterns.map((pattern) => (
                          <button
                            key={pattern.id}
                            onClick={() => handleNestedStyleChange('background', { pattern: pattern.pattern })}
                            className="p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 text-sm"
                          >
                            {pattern.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Opacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Opacity: {currentStyle.background.opacity}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={currentStyle.background.opacity}
                      onChange={(e) => handleNestedStyleChange('background', { opacity: parseInt(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* Typography Tab */}
              {activeTab === 'typography' && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-gray-900">Typography Settings</h3>
                  
                  {/* Title Font */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title Font
                    </label>
                    <select
                      value={currentStyle.typography.titleFont}
                      onChange={(e) => handleNestedStyleChange('typography', { titleFont: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {fontOptions.map((font) => (
                        <option key={font.id} value={font.id}>{font.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Content Font */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Font
                    </label>
                    <select
                      value={currentStyle.typography.contentFont}
                      onChange={(e) => handleNestedStyleChange('typography', { contentFont: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {fontOptions.map((font) => (
                        <option key={font.id} value={font.id}>{font.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Title Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title Size
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'small', name: 'Small' },
                        { id: 'medium', name: 'Medium' },
                        { id: 'large', name: 'Large' },
                        { id: 'xl', name: 'Extra Large' }
                      ].map((size) => (
                        <button
                          key={size.id}
                          onClick={() => handleNestedStyleChange('typography', { titleSize: size.id })}
                          className={`p-2 rounded-lg border-2 transition-all text-sm ${
                            currentStyle.typography.titleSize === size.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700'
                          }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'small', name: 'Small' },
                        { id: 'medium', name: 'Medium' },
                        { id: 'large', name: 'Large' }
                      ].map((size) => (
                        <button
                          key={size.id}
                          onClick={() => handleNestedStyleChange('typography', { contentSize: size.id })}
                          className={`p-2 rounded-lg border-2 transition-all text-sm ${
                            currentStyle.typography.contentSize === size.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700'
                          }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentStyle.typography.titleColor}
                        onChange={(e) => handleNestedStyleChange('typography', { titleColor: e.target.value })}
                        className="w-12 h-8 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={currentStyle.typography.titleColor}
                        onChange={(e) => handleNestedStyleChange('typography', { titleColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  {/* Content Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentStyle.typography.contentColor}
                        onChange={(e) => handleNestedStyleChange('typography', { contentColor: e.target.value })}
                        className="w-12 h-8 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={currentStyle.typography.contentColor}
                        onChange={(e) => handleNestedStyleChange('typography', { contentColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Layout Tab */}
              {activeTab === 'layout' && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-gray-900">Layout Settings</h3>
                  
                  {/* Content Alignment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Alignment
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'left', name: 'Left' },
                        { id: 'center', name: 'Center' },
                        { id: 'right', name: 'Right' }
                      ].map((align) => (
                        <button
                          key={align.id}
                          onClick={() => handleNestedStyleChange('layout', { contentAlignment: align.id })}
                          className={`p-3 rounded-lg border-2 transition-all text-sm ${
                            currentStyle.layout.contentAlignment === align.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700'
                          }`}
                        >
                          {align.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Position */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Position
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {positionOptions.map((position) => (
                        <button
                          key={position.id}
                          onClick={() => handleNestedStyleChange('layout', { imagePosition: position.id })}
                          className={`p-2 rounded-lg border-2 transition-all text-sm ${
                            currentStyle.layout.imagePosition === position.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700'
                          }`}
                        >
                          {position.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spacing */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Spacing
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'compact', name: 'Compact' },
                        { id: 'normal', name: 'Normal' },
                        { id: 'spacious', name: 'Spacious' }
                      ].map((spacing) => (
                        <button
                          key={spacing.id}
                          onClick={() => handleNestedStyleChange('layout', { spacing: spacing.id })}
                          className={`p-2 rounded-lg border-2 transition-all text-sm ${
                            currentStyle.layout.spacing === spacing.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700'
                          }`}
                        >
                          {spacing.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Padding */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slide Padding
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'small', name: 'Small' },
                        { id: 'medium', name: 'Medium' },
                        { id: 'large', name: 'Large' }
                      ].map((padding) => (
                        <button
                          key={padding.id}
                          onClick={() => handleNestedStyleChange('layout', { padding: padding.id })}
                          className={`p-2 rounded-lg border-2 transition-all text-sm ${
                            currentStyle.layout.padding === padding.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700'
                          }`}
                        >
                          {padding.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Effects Tab */}
              {activeTab === 'effects' && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-gray-900">Visual Effects</h3>
                  
                  {/* Shadow */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shadow Effect
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'none', name: 'None' },
                        { id: 'subtle', name: 'Subtle' },
                        { id: 'medium', name: 'Medium' },
                        { id: 'strong', name: 'Strong' }
                      ].map((shadow) => (
                        <button
                          key={shadow.id}
                          onClick={() => handleNestedStyleChange('effects', { shadow: shadow.id })}
                          className={`p-2 rounded-lg border-2 transition-all text-sm ${
                            currentStyle.effects.shadow === shadow.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700'
                          }`}
                        >
                          {shadow.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Radius: {currentStyle.effects.borderRadius}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={currentStyle.effects.borderRadius}
                      onChange={(e) => handleNestedStyleChange('effects', { borderRadius: parseInt(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  {/* Animation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entrance Animation
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'none', name: 'None' },
                        { id: 'fade', name: 'Fade In' },
                        { id: 'slide', name: 'Slide In' },
                        { id: 'zoom', name: 'Zoom In' },
                        { id: 'bounce', name: 'Bounce In' }
                      ].map((animation) => (
                        <button
                          key={animation.id}
                          onClick={() => handleNestedStyleChange('effects', { animation: animation.id })}
                          className={`p-2 rounded-lg border-2 transition-all text-sm ${
                            currentStyle.effects.animation === animation.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700'
                          }`}
                        >
                          {animation.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Overlay Settings */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Content Overlay
                      </label>
                      <input
                        type="checkbox"
                        checked={currentStyle.effects.overlay.enabled}
                        onChange={(e) => handleNestedStyleChange('effects', { 
                          overlay: { ...currentStyle.effects.overlay, enabled: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    {currentStyle.effects.overlay.enabled && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Overlay Color
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={currentStyle.effects.overlay.color}
                              onChange={(e) => handleNestedStyleChange('effects', { 
                                overlay: { ...currentStyle.effects.overlay, color: e.target.value }
                              })}
                              className="w-12 h-8 rounded border border-gray-300"
                            />
                            <input
                              type="text"
                              value={currentStyle.effects.overlay.color}
                              onChange={(e) => handleNestedStyleChange('effects', { 
                                overlay: { ...currentStyle.effects.overlay, color: e.target.value }
                              })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Overlay Opacity: {currentStyle.effects.overlay.opacity}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={currentStyle.effects.overlay.opacity}
                            onChange={(e) => handleNestedStyleChange('effects', { 
                              overlay: { ...currentStyle.effects.overlay, opacity: parseInt(e.target.value) }
                            })}
                            className="w-full accent-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Blend Mode
                          </label>
                          <select
                            value={currentStyle.effects.overlay.blend}
                            onChange={(e) => handleNestedStyleChange('effects', { 
                              overlay: { ...currentStyle.effects.overlay, blend: e.target.value as any }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            <option value="normal">Normal</option>
                            <option value="multiply">Multiply</option>
                            <option value="overlay">Overlay</option>
                            <option value="screen">Screen</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  Apply Style & Image to Slide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};