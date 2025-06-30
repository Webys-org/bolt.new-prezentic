import React, { useState, useRef } from 'react';
import { Edit3, Save, X, Plus, Trash2, Upload, Image as ImageIcon, Type, FileText, Move3D, Copy, Download, Camera, Palette } from 'lucide-react';
import { Slide } from '../types/presentation';
import { SlidePhotoEditor } from './SlidePhotoEditor';

interface SlideEditorProps {
  slide: Slide;
  slideIndex: number;
  totalSlides: number;
  onUpdateSlide: (slideId: string, updatedSlide: Partial<Slide>) => void;
  onDeleteSlide: (slideId: string) => void;
  onDuplicateSlide: (slideId: string) => void;
  onMoveSlide: (slideId: string, direction: 'up' | 'down') => void;
  onAddSlide: (afterIndex: number, slideType: 'text' | 'image' | 'blank') => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({
  slide,
  slideIndex,
  totalSlides,
  onUpdateSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onMoveSlide,
  onAddSlide,
  isEditing,
  onToggleEdit
}) => {
  const [editedTitle, setEditedTitle] = useState(slide.title);
  const [editedContent, setEditedContent] = useState(slide.content);
  const [editedNotes, setEditedNotes] = useState(slide.notes);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateSlide(slide.id, {
      title: editedTitle.trim(),
      content: editedContent.filter(item => item.trim().length > 0),
      notes: editedNotes.trim()
    });
    onToggleEdit();
  };

  const handleCancel = () => {
    setEditedTitle(slide.title);
    setEditedContent(slide.content);
    setEditedNotes(slide.notes);
    onToggleEdit();
  };

  const handleAddContentPoint = () => {
    setEditedContent([...editedContent, '']);
  };

  const handleRemoveContentPoint = (index: number) => {
    setEditedContent(editedContent.filter((_, i) => i !== index));
  };

  const handleContentChange = (index: number, value: string) => {
    const newContent = [...editedContent];
    newContent[index] = value;
    setEditedContent(newContent);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setImageError('Please select a valid image file');
        return;
      }
      
      setImageError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onUpdateSlide(slide.id, { imageUrl });
        console.log('Image uploaded successfully:', imageUrl.substring(0, 50) + '...');
      };
      reader.onerror = () => {
        setImageError('Failed to read the image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpdate = (slideId: string, imageUrl: string) => {
    setImageError(null);
    onUpdateSlide(slideId, { imageUrl });
  };

  const handleImageRemove = (slideId: string) => {
    setImageError(null);
    onUpdateSlide(slideId, { imageUrl: undefined });
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
        {/* Slide Header with Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">{slideIndex + 1}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 truncate max-w-md">
              {slide.title}
            </h3>
          </div>

          {/* Slide Controls */}
          <div className="flex items-center gap-2">
            {/* Move Controls */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onMoveSlide(slide.id, 'up')}
                disabled={slideIndex === 0}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Move up"
              >
                <Move3D className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={() => onMoveSlide(slide.id, 'down')}
                disabled={slideIndex === totalSlides - 1}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                title="Move down"
              >
                <Move3D className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Editor Button */}
            <button
              onClick={() => setShowPhotoEditor(true)}
              className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all"
              title="Edit slide photo"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Action Controls */}
            <button
              onClick={() => onDuplicateSlide(slide.id)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Duplicate slide"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleEdit}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
              title="Edit slide"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDeleteSlide(slide.id)}
              disabled={totalSlides <= 1}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Delete slide"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Add Slide Menu */}
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all"
                title="Add new slide"
              >
                <Plus className="w-4 h-4" />
              </button>

              {showAddMenu && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-48">
                  <button
                    onClick={() => {
                      onAddSlide(slideIndex, 'text');
                      setShowAddMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                  >
                    <Type className="w-4 h-4" />
                    Text Slide
                  </button>
                  <button
                    onClick={() => {
                      onAddSlide(slideIndex, 'image');
                      setShowAddMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Image Slide
                  </button>
                  <button
                    onClick={() => {
                      onAddSlide(slideIndex, 'blank');
                      setShowAddMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                  >
                    <FileText className="w-4 h-4" />
                    Blank Slide
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Slide Preview */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-600 mb-2">Content Preview:</div>
          <div className="space-y-2">
            {slide.content.map((point, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 text-sm">{point}</span>
              </div>
            ))}
          </div>
          {slide.imageUrl && (
            <div className="mt-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-600">Image attached</span>
              <button
                onClick={() => setShowPhotoEditor(true)}
                className="text-xs text-purple-600 hover:text-purple-700 underline"
              >
                Edit Photo
              </button>
            </div>
          )}
        </div>

        {/* Speaker Notes Preview */}
        {slide.notes && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-900 mb-2">Speaker Notes:</div>
            <div className="text-sm text-blue-800 line-clamp-3">{slide.notes}</div>
          </div>
        )}

        {/* Photo Editor Modal */}
        <SlidePhotoEditor
          slideId={slide.id}
          currentImageUrl={slide.imageUrl}
          onImageUpdate={handleImageUpdate}
          onImageRemove={handleImageRemove}
          isOpen={showPhotoEditor}
          onClose={() => setShowPhotoEditor(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6 mb-6">
      {/* Edit Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Edit3 className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900">
            Editing Slide {slideIndex + 1}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      {/* Title Editor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slide Title
        </label>
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
          placeholder="Enter slide title..."
        />
      </div>

      {/* Content Editor */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Slide Content
          </label>
          <button
            onClick={handleAddContentPoint}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Point
          </button>
        </div>
        
        <div className="space-y-3">
          {editedContent.map((point, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
              <input
                type="text"
                value={point}
                onChange={(e) => handleContentChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Content point ${index + 1}...`}
              />
              {editedContent.length > 1 && (
                <button
                  onClick={() => handleRemoveContentPoint(index)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Image Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Slide Image
          </label>
          <button
            onClick={() => setShowPhotoEditor(true)}
            className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm"
          >
            <Camera className="w-4 h-4" />
            Photo Editor
          </button>
        </div>
        
        {slide.imageUrl ? (
          <div className="relative">
            <img
              src={slide.imageUrl}
              alt="Slide"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
              onError={() => {
                console.error('Image failed to load in editor:', slide.imageUrl);
                setImageError('Failed to load image. Please check the URL or try another image.');
              }}
              onLoad={() => {
                console.log('Image loaded successfully in editor');
                setImageError(null);
              }}
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => setShowPhotoEditor(true)}
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                title="Edit photo"
              >
                <Palette className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleImageRemove(slide.id)}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                title="Remove photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No image selected</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Quick Upload
              </button>
              <button
                onClick={() => setShowPhotoEditor(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Photo Editor
              </button>
            </div>
            {imageError && (
              <p className="mt-2 text-sm text-red-600">{imageError}</p>
            )}
          </div>
        )}
      </div>

      {/* Speaker Notes Editor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Speaker Notes
        </label>
        <textarea
          value={editedNotes}
          onChange={(e) => setEditedNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Enter speaker notes for narration..."
        />
        <div className="mt-2 text-sm text-gray-500">
          💡 Tip: Write 50-80 words for optimal narration timing
        </div>
      </div>

      {/* Photo Editor Modal */}
      <SlidePhotoEditor
        slideId={slide.id}
        currentImageUrl={slide.imageUrl}
        onImageUpdate={handleImageUpdate}
        onImageRemove={handleImageRemove}
        isOpen={showPhotoEditor}
        onClose={() => setShowPhotoEditor(false)}
      />
    </div>
  );
};