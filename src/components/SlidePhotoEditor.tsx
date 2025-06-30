import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Edit3, Save, X, RotateCw, ZoomIn, ZoomOut, Move, Crop, Filter, Palette, Download, RefreshCw, Square, Circle, Hexagon, Triangle, Star, Heart } from 'lucide-react';

interface SlidePhotoEditorProps {
  slideId: string;
  currentImageUrl?: string;
  onImageUpdate: (slideId: string, imageUrl: string) => void;
  onImageRemove: (slideId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface ImageStyle {
  shape: 'rectangle' | 'circle' | 'rounded' | 'hexagon' | 'triangle' | 'star' | 'heart';
  borderWidth: number;
  borderColor: string;
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'double';
  shadow: 'none' | 'small' | 'medium' | 'large' | 'glow';
  position: 'center' | 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size: 'small' | 'medium' | 'large' | 'full';
  overlay: 'none' | 'dark' | 'light' | 'gradient' | 'color';
  overlayColor: string;
  overlayOpacity: number;
}

export const SlidePhotoEditor: React.FC<SlidePhotoEditorProps> = ({
  slideId,
  currentImageUrl,
  onImageUpdate,
  onImageRemove,
  isOpen,
  onClose
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImageUrl || null);
  const [activeTab, setActiveTab] = useState<'upload' | 'style' | 'effects' | 'position'>('upload');
  const [imageStyle, setImageStyle] = useState<ImageStyle>({
    shape: 'rectangle',
    borderWidth: 0,
    borderColor: '#3B82F6',
    borderStyle: 'solid',
    shadow: 'medium',
    position: 'center',
    size: 'medium',
    overlay: 'none',
    overlayColor: '#000000',
    overlayOpacity: 30
  });
  const [editSettings, setEditSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    rotation: 0,
    scale: 100,
    opacity: 100,
    hue: 0,
    sepia: 0,
    grayscale: 0
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync with current image URL when it changes
  useEffect(() => {
    setSelectedImage(currentImageUrl || null);
    console.log('Photo Editor: Syncing image URL:', currentImageUrl);
  }, [currentImageUrl]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file');
      return;
    }

    setIsUploading(true);
    setImageError(null);
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        setIsUploading(false);
        setActiveTab('style');
        console.log('Image uploaded successfully:', imageUrl.substring(0, 50) + '...');
      };
      reader.onerror = () => {
        setImageError('Failed to read image file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      setImageError('Failed to upload image. Please try again.');
    }
  };

  const handleSaveImage = () => {
    if (!selectedImage) return;
    
    setIsSaving(true);
    
    try {
      // Apply styles to the image
      const styledImage = applyStyleToImage(selectedImage);
      
      // Update the slide with the styled image
      onImageUpdate(slideId, styledImage);
      
      // Show success feedback
      console.log('✅ Image successfully applied to slide:', slideId);
      
      // Close the editor
      onClose();
    } catch (error) {
      console.error('Error applying image to slide:', error);
      setImageError('Failed to apply image to slide. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveImage = () => {
    onImageRemove(slideId);
    setSelectedImage(null);
    onClose();
  };

  const applyStyleToImage = (imageUrl: string): string => {
    // In a real implementation, we would apply the styles to create a new image
    // For now, we'll just return the original image URL
    console.log('Applying style to image:', {
      shape: imageStyle.shape,
      borderWidth: imageStyle.borderWidth,
      shadow: imageStyle.shadow,
      position: imageStyle.position,
      size: imageStyle.size,
      overlay: imageStyle.overlay
    });
    
    return imageUrl;
  };

  const resetEditSettings = () => {
    setEditSettings({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      rotation: 0,
      scale: 100,
      opacity: 100,
      hue: 0,
      sepia: 0,
      grayscale: 0
    });
  };

  const resetImageStyle = () => {
    setImageStyle({
      shape: 'rectangle',
      borderWidth: 0,
      borderColor: '#3B82F6',
      borderStyle: 'solid',
      shadow: 'medium',
      position: 'center',
      size: 'medium',
      overlay: 'none',
      overlayColor: '#000000',
      overlayOpacity: 30
    });
  };

  const getShapeStyles = () => {
    const baseStyles: React.CSSProperties = {
      filter: `
        brightness(${editSettings.brightness}%)
        contrast(${editSettings.contrast}%)
        saturate(${editSettings.saturation}%)
        blur(${editSettings.blur}px)
        hue-rotate(${editSettings.hue}deg)
        sepia(${editSettings.sepia}%)
        grayscale(${editSettings.grayscale}%)
      `,
      transform: `
        rotate(${editSettings.rotation}deg)
        scale(${editSettings.scale / 100})
      `,
      opacity: editSettings.opacity / 100,
      border: imageStyle.borderWidth > 0 ? `${imageStyle.borderWidth}px ${imageStyle.borderStyle} ${imageStyle.borderColor}` : 'none',
    };

    // Add shape-specific styles
    switch (imageStyle.shape) {
      case 'circle':
        baseStyles.borderRadius = '50%';
        break;
      case 'rounded':
        baseStyles.borderRadius = '20px';
        break;
      case 'hexagon':
        baseStyles.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        break;
      case 'triangle':
        baseStyles.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        break;
      case 'star':
        baseStyles.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
        break;
      case 'heart':
        baseStyles.clipPath = 'path("M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z")';
        break;
      default:
        baseStyles.borderRadius = '0px';
    }

    // Add shadow
    switch (imageStyle.shadow) {
      case 'small':
        baseStyles.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        break;
      case 'medium':
        baseStyles.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        break;
      case 'large':
        baseStyles.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
        break;
      case 'glow':
        baseStyles.boxShadow = `0 0 20px ${imageStyle.borderColor}40`;
        break;
      default:
        baseStyles.boxShadow = 'none';
    }

    return baseStyles;
  };

  // Stock photos from Pexels
  const stockPhotos = [
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  const shapeOptions = [
    { id: 'rectangle', name: 'Rectangle', icon: Square },
    { id: 'circle', name: 'Circle', icon: Circle },
    { id: 'rounded', name: 'Rounded', icon: Square },
    { id: 'hexagon', name: 'Hexagon', icon: Hexagon },
    { id: 'triangle', name: 'Triangle', icon: Triangle },
    { id: 'star', name: 'Star', icon: Star },
    { id: 'heart', name: 'Heart', icon: Heart }
  ];

  const positionOptions = [
    { id: 'center', name: 'Center' },
    { id: 'left', name: 'Left' },
    { id: 'right', name: 'Right' },
    { id: 'top', name: 'Top' },
    { id: 'bottom', name: 'Bottom' },
    { id: 'top-left', name: 'Top Left' },
    { id: 'top-right', name: 'Top Right' },
    { id: 'bottom-left', name: 'Bottom Left' },
    { id: 'bottom-right', name: 'Bottom Right' }
  ];

  const sizeOptions = [
    { id: 'small', name: 'Small (25%)', width: '25%' },
    { id: 'medium', name: 'Medium (50%)', width: '50%' },
    { id: 'large', name: 'Large (75%)', width: '75%' },
    { id: 'full', name: 'Full (100%)', width: '100%' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Professional Photo Editor</h2>
              <p className="text-gray-600 text-sm">Upload, style, and customize your slide image with professional formats</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'upload', name: 'Upload & Select', icon: Upload },
            { id: 'style', name: 'Shape & Style', icon: Palette },
            { id: 'effects', name: 'Effects & Filters', icon: Filter },
            { id: 'position', name: 'Position & Size', icon: Move }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
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
            {/* Image Preview */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-xl p-6 min-h-[500px] flex items-center justify-center relative">
                {selectedImage ? (
                  <div className="relative max-w-full max-h-[500px] flex items-center justify-center">
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Slide preview"
                        className="max-w-full max-h-[400px] object-contain"
                        style={getShapeStyles()}
                        onError={() => {
                          console.error('Image failed to load:', selectedImage);
                          setImageError('Failed to load image. Please check the URL or try another image.');
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully');
                          setImageError(null);
                        }}
                      />
                      
                      {/* Overlay */}
                      {imageStyle.overlay !== 'none' && (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: imageStyle.overlay === 'gradient' 
                              ? `linear-gradient(45deg, ${imageStyle.overlayColor}${Math.round(imageStyle.overlayOpacity * 2.55).toString(16)}, transparent)`
                              : `${imageStyle.overlayColor}${Math.round(imageStyle.overlayOpacity * 2.55).toString(16)}`,
                            borderRadius: imageStyle.shape === 'circle' ? '50%' : 
                                         imageStyle.shape === 'rounded' ? '20px' : '0px',
                            clipPath: imageStyle.shape === 'hexagon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' :
                                     imageStyle.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                                     imageStyle.shape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none'
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Style Preview Badge */}
                    <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {imageStyle.shape} • {imageStyle.size} • {imageStyle.position}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4 text-lg">No image selected</p>
                    <p className="text-sm text-gray-500">Upload an image or choose from stock photos to start styling</p>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {imageError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{imageError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={resetImageStyle}
                    disabled={!selectedImage}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Style
                  </button>
                  
                  <button
                    onClick={resetEditSettings}
                    disabled={!selectedImage}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Effects
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {selectedImage && (
                    <button
                      onClick={handleRemoveImage}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                  
                  <button
                    onClick={handleSaveImage}
                    disabled={!selectedImage || isSaving || !!imageError}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Applying...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Apply to Slide
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="space-y-6">
              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div className="space-y-6">
                  {/* Upload Section */}
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Custom Image
                    </h3>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 transition-colors text-center bg-white"
                    >
                      {isUploading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                          <span className="text-sm text-purple-700">Uploading...</span>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                          <span className="text-sm text-purple-700 font-medium">Click to upload your image</span>
                          <p className="text-xs text-purple-600 mt-1">JPG, PNG, GIF up to 10MB</p>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Image URL Input */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-4">Enter Image URL</h3>
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={selectedImage || ''}
                        onChange={(e) => {
                          setSelectedImage(e.target.value);
                          setImageError(null);
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => {
                          if (selectedImage) {
                            setActiveTab('style');
                          }
                        }}
                        disabled={!selectedImage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Use This URL
                      </button>
                      <p className="text-xs text-blue-700">
                        Enter a valid image URL (e.g., https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg)
                      </p>
                    </div>
                  </div>

                  {/* Stock Photos */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Professional Stock Photos
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {stockPhotos.map((photo, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedImage(photo);
                            setImageError(null);
                            setActiveTab('style');
                          }}
                          className={`aspect-square rounded-lg overflow-hidden transition-all ${
                            selectedImage === photo 
                              ? 'ring-3 ring-purple-500 scale-105' 
                              : 'hover:ring-2 hover:ring-purple-300 hover:scale-105'
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
                </div>
              )}

              {/* Style Tab */}
              {activeTab === 'style' && (
                <div className="space-y-6">
                  {/* Shape Selection */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-4">Image Shape</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {shapeOptions.map((shape) => (
                        <button
                          key={shape.id}
                          onClick={() => setImageStyle(prev => ({ ...prev, shape: shape.id as any }))}
                          className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                            imageStyle.shape === shape.id
                              ? 'border-blue-500 bg-blue-100 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300 text-gray-700'
                          }`}
                        >
                          <shape.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{shape.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Settings */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-4">Border & Frame</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-2">
                          Border Width: {imageStyle.borderWidth}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={imageStyle.borderWidth}
                          onChange={(e) => setImageStyle(prev => ({ ...prev, borderWidth: parseInt(e.target.value) }))}
                          className="w-full accent-green-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-2">
                          Border Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={imageStyle.borderColor}
                            onChange={(e) => setImageStyle(prev => ({ ...prev, borderColor: e.target.value }))}
                            className="w-12 h-8 rounded border border-green-300"
                          />
                          <input
                            type="text"
                            value={imageStyle.borderColor}
                            onChange={(e) => setImageStyle(prev => ({ ...prev, borderColor: e.target.value }))}
                            className="flex-1 px-3 py-1 border border-green-300 rounded text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-green-800 mb-2">
                          Border Style
                        </label>
                        <select
                          value={imageStyle.borderStyle}
                          onChange={(e) => setImageStyle(prev => ({ ...prev, borderStyle: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500"
                        >
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                          <option value="double">Double</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Shadow Settings */}
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-4">Shadow & Glow</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'none', name: 'No Shadow' },
                        { id: 'small', name: 'Small' },
                        { id: 'medium', name: 'Medium' },
                        { id: 'large', name: 'Large' },
                        { id: 'glow', name: 'Glow Effect' }
                      ].map((shadow) => (
                        <button
                          key={shadow.id}
                          onClick={() => setImageStyle(prev => ({ ...prev, shadow: shadow.id as any }))}
                          className={`p-2 rounded-lg border-2 transition-all text-sm ${
                            imageStyle.shadow === shadow.id
                              ? 'border-purple-500 bg-purple-100 text-purple-700'
                              : 'border-gray-200 hover:border-purple-300 text-gray-700'
                          }`}
                        >
                          {shadow.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Overlay Settings */}
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                    <h3 className="font-semibold text-orange-900 mb-4">Overlay Effects</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-orange-800 mb-2">
                          Overlay Type
                        </label>
                        <select
                          value={imageStyle.overlay}
                          onChange={(e) => setImageStyle(prev => ({ ...prev, overlay: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-orange-300 rounded focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="none">No Overlay</option>
                          <option value="dark">Dark Overlay</option>
                          <option value="light">Light Overlay</option>
                          <option value="gradient">Gradient Overlay</option>
                          <option value="color">Color Overlay</option>
                        </select>
                      </div>

                      {imageStyle.overlay !== 'none' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-orange-800 mb-2">
                              Overlay Color
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={imageStyle.overlayColor}
                                onChange={(e) => setImageStyle(prev => ({ ...prev, overlayColor: e.target.value }))}
                                className="w-12 h-8 rounded border border-orange-300"
                              />
                              <input
                                type="text"
                                value={imageStyle.overlayColor}
                                onChange={(e) => setImageStyle(prev => ({ ...prev, overlayColor: e.target.value }))}
                                className="flex-1 px-3 py-1 border border-orange-300 rounded text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-orange-800 mb-2">
                              Overlay Opacity: {imageStyle.overlayOpacity}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={imageStyle.overlayOpacity}
                              onChange={(e) => setImageStyle(prev => ({ ...prev, overlayOpacity: parseInt(e.target.value) }))}
                              className="w-full accent-orange-600"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Effects Tab */}
              {activeTab === 'effects' && selectedImage && (
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200 space-y-4">
                  <h3 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Image Effects & Filters
                  </h3>

                  {/* Brightness */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-1">
                      Brightness: {editSettings.brightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editSettings.brightness}
                      onChange={(e) => setEditSettings(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Contrast */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-1">
                      Contrast: {editSettings.contrast}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editSettings.contrast}
                      onChange={(e) => setEditSettings(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Saturation */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-1">
                      Saturation: {editSettings.saturation}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editSettings.saturation}
                      onChange={(e) => setEditSettings(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Hue */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-1">
                      Hue Shift: {editSettings.hue}°
                    </label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={editSettings.hue}
                      onChange={(e) => setEditSettings(prev => ({ ...prev, hue: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Blur */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-1">
                      Blur: {editSettings.blur}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={editSettings.blur}
                      onChange={(e) => setEditSettings(prev => ({ ...prev, blur: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Sepia */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-1">
                      Sepia: {editSettings.sepia}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editSettings.sepia}
                      onChange={(e) => setEditSettings(prev => ({ ...prev, sepia: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Grayscale */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-1">
                      Grayscale: {editSettings.grayscale}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editSettings.grayscale}
                      onChange={(e) => setEditSettings(prev => ({ ...prev, grayscale: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Rotation */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-1">
                      Rotation: {editSettings.rotation}°
                    </label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={editSettings.rotation}
                      onChange={(e) => setEditSettings(prev => ({ ...prev, rotation: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Scale */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-1">
                      Scale: {editSettings.scale}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={editSettings.scale}
                      onChange={(e) => setEditSettings(prev => ({ ...prev, scale: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Opacity */}
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-1">
                      Opacity: {editSettings.opacity}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editSettings.opacity}
                      onChange={(e) => setEditSettings(prev => ({ ...prev, opacity: parseInt(e.target.value) }))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              )}

              {/* Position Tab */}
              {activeTab === 'position' && (
                <div className="space-y-6">
                  {/* Position Settings */}
                  <div className="bg-teal-50 rounded-xl p-6 border border-teal-200">
                    <h3 className="font-semibold text-teal-900 mb-4">Image Position</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {positionOptions.map((position) => (
                        <button
                          key={position.id}
                          onClick={() => setImageStyle(prev => ({ ...prev, position: position.id as any }))}
                          className={`p-3 rounded-lg border-2 transition-all text-sm ${
                            imageStyle.position === position.id
                              ? 'border-teal-500 bg-teal-100 text-teal-700'
                              : 'border-gray-200 hover:border-teal-300 text-gray-700'
                          }`}
                        >
                          {position.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Settings */}
                  <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
                    <h3 className="font-semibold text-pink-900 mb-4">Image Size</h3>
                    <div className="space-y-3">
                      {sizeOptions.map((size) => (
                        <label
                          key={size.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            imageStyle.size === size.id
                              ? 'border-pink-500 bg-pink-100'
                              : 'border-gray-200 hover:border-pink-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="size"
                            value={size.id}
                            checked={imageStyle.size === size.id}
                            onChange={(e) => setImageStyle(prev => ({ ...prev, size: e.target.value as any }))}
                            className="text-pink-600"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{size.name}</div>
                            <div className="text-sm text-gray-600">Width: {size.width}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Layout Preview */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Layout Preview</h3>
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 relative">
                      <div
                        className={`bg-blue-200 rounded absolute transition-all ${
                          imageStyle.size === 'small' ? 'w-6 h-6' :
                          imageStyle.size === 'medium' ? 'w-12 h-12' :
                          imageStyle.size === 'large' ? 'w-16 h-16' : 'w-20 h-20'
                        } ${
                          imageStyle.position === 'center' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' :
                          imageStyle.position === 'left' ? 'top-1/2 left-2 transform -translate-y-1/2' :
                          imageStyle.position === 'right' ? 'top-1/2 right-2 transform -translate-y-1/2' :
                          imageStyle.position === 'top' ? 'top-2 left-1/2 transform -translate-x-1/2' :
                          imageStyle.position === 'bottom' ? 'bottom-2 left-1/2 transform -translate-x-1/2' :
                          imageStyle.position === 'top-left' ? 'top-2 left-2' :
                          imageStyle.position === 'top-right' ? 'top-2 right-2' :
                          imageStyle.position === 'bottom-left' ? 'bottom-2 left-2' :
                          imageStyle.position === 'bottom-right' ? 'bottom-2 right-2' : ''
                        }`}
                      />
                      <div className="text-xs text-gray-500 absolute bottom-1 left-1">
                        {imageStyle.position} • {imageStyle.size}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};