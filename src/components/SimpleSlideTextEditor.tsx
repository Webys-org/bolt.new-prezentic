import React, { useState, useEffect } from 'react';
import { Type, AlignLeft, AlignCenter, AlignRight, Palette, X, Save, Bold, Italic, Underline } from 'lucide-react';
import { Slide } from '../types/presentation';

interface SimpleSlideTextEditorProps {
  slide: Slide;
  onUpdateSlide: (slideId: string, updatedSlide: Partial<Slide>) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface TextStyle {
  fontSize: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p';
  textAlign: 'left' | 'center' | 'right';
  textColor: string;
  backgroundColor: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  animation: 'none' | 'fadeIn' | 'slideIn' | 'bounce';
}

const defaultTextStyle: TextStyle = {
  fontSize: 'h1',
  textAlign: 'left',
  textColor: '#FFFFFF',
  backgroundColor: 'transparent',
  fontWeight: 'bold',
  fontStyle: 'normal',
  textDecoration: 'none',
  animation: 'fadeIn'
};

export const SimpleSlideTextEditor: React.FC<SimpleSlideTextEditorProps> = ({
  slide,
  onUpdateSlide,
  isOpen,
  onClose
}) => {
  const [editedTitle, setEditedTitle] = useState(slide.title);
  const [editedContent, setEditedContent] = useState(slide.content);
  const [editedNotes, setEditedNotes] = useState(slide.notes);
  const [titleStyle, setTitleStyle] = useState<TextStyle>(defaultTextStyle);
  const [contentStyle, setContentStyle] = useState<TextStyle>({
    ...defaultTextStyle,
    fontSize: 'p',
    fontWeight: 'normal'
  });

  useEffect(() => {
    if (isOpen) {
      setEditedTitle(slide.title);
      setEditedContent(slide.content);
      setEditedNotes(slide.notes);
      
      // Load existing text styles if available
      if (slide.textStyles) {
        if (slide.textStyles.title) {
          setTitleStyle({
            ...defaultTextStyle,
            ...slide.textStyles.title
          });
        }
        
        if (slide.textStyles.content) {
          setContentStyle({
            ...defaultTextStyle,
            fontSize: 'p',
            fontWeight: 'normal',
            ...slide.textStyles.content
          });
        }
      }
    }
  }, [slide, isOpen]);

  const handleSave = () => {
    onUpdateSlide(slide.id, {
      title: editedTitle.trim(),
      content: editedContent.filter(item => item.trim().length > 0),
      notes: editedNotes.trim(),
      // Store text styles in slide data
      textStyles: {
        title: titleStyle,
        content: contentStyle
      }
    });
    onClose();
  };

  const handleCancel = () => {
    setEditedTitle(slide.title);
    setEditedContent(slide.content);
    setEditedNotes(slide.notes);
    onClose();
  };

  const addContentPoint = () => {
    setEditedContent([...editedContent, '']);
  };

  const removeContentPoint = (index: number) => {
    if (editedContent.length > 1) {
      setEditedContent(editedContent.filter((_, i) => i !== index));
    }
  };

  const updateContentPoint = (index: number, value: string) => {
    const newContent = [...editedContent];
    newContent[index] = value;
    setEditedContent(newContent);
  };

  const getFontSizeClass = (fontSize: string) => {
    switch (fontSize) {
      case 'h1': return 'text-4xl';
      case 'h2': return 'text-3xl';
      case 'h3': return 'text-2xl';
      case 'h4': return 'text-xl';
      case 'h5': return 'text-lg';
      case 'p': return 'text-base';
      default: return 'text-base';
    }
  };

  const getAnimationClass = (animation: string) => {
    switch (animation) {
      case 'fadeIn': return 'animate-fade-in';
      case 'slideIn': return 'animate-slide-in-left';
      case 'bounce': return 'animate-bounce';
      default: return '';
    }
  };

  const getPreviewStyle = (style: TextStyle) => ({
    fontSize: style.fontSize === 'h1' ? '2.25rem' :
              style.fontSize === 'h2' ? '1.875rem' :
              style.fontSize === 'h3' ? '1.5rem' :
              style.fontSize === 'h4' ? '1.25rem' :
              style.fontSize === 'h5' ? '1.125rem' : '1rem',
    textAlign: style.textAlign as any,
    color: style.textColor,
    backgroundColor: style.backgroundColor === 'transparent' ? 'transparent' : style.backgroundColor,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    textDecoration: style.textDecoration,
    padding: style.backgroundColor !== 'transparent' ? '8px 12px' : '0',
    borderRadius: style.backgroundColor !== 'transparent' ? '6px' : '0'
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Type className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Simple Text Editor</h2>
              <p className="text-gray-600 text-sm">Edit slide text with fonts, colors, and animations</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor Panel */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Content</h3>
              
              {/* Title Editor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Slide Title
                  </label>
                  <div className="text-xs text-gray-500">
                    Style: {titleStyle.fontSize.toUpperCase()}
                  </div>
                </div>
                
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
                  placeholder="Enter slide title..."
                />

                {/* Title Style Controls */}
                <div className="bg-green-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-green-900">Title Style</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Font Size */}
                    <div>
                      <label className="block text-xs font-medium text-green-800 mb-1">Font Size</label>
                      <select
                        value={titleStyle.fontSize}
                        onChange={(e) => setTitleStyle(prev => ({ ...prev, fontSize: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 text-sm"
                      >
                        <option value="h1">H1 (Largest)</option>
                        <option value="h2">H2 (Large)</option>
                        <option value="h3">H3 (Medium)</option>
                        <option value="h4">H4 (Small)</option>
                        <option value="h5">H5 (Smallest)</option>
                      </select>
                    </div>

                    {/* Text Align */}
                    <div>
                      <label className="block text-xs font-medium text-green-800 mb-1">Alignment</label>
                      <div className="flex gap-1">
                        {[
                          { value: 'left', icon: AlignLeft },
                          { value: 'center', icon: AlignCenter },
                          { value: 'right', icon: AlignRight }
                        ].map(({ value, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => setTitleStyle(prev => ({ ...prev, textAlign: value as any }))}
                            className={`p-2 rounded border transition-colors ${
                              titleStyle.textAlign === value
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Color */}
                    <div>
                      <label className="block text-xs font-medium text-green-800 mb-1">Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={titleStyle.textColor}
                          onChange={(e) => setTitleStyle(prev => ({ ...prev, textColor: e.target.value }))}
                          className="w-8 h-8 rounded border border-green-300"
                        />
                        <input
                          type="text"
                          value={titleStyle.textColor}
                          onChange={(e) => setTitleStyle(prev => ({ ...prev, textColor: e.target.value }))}
                          className="flex-1 px-2 py-1 border border-green-300 rounded text-xs"
                        />
                      </div>
                    </div>

                    {/* Background Color */}
                    <div>
                      <label className="block text-xs font-medium text-green-800 mb-1">Background</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={titleStyle.backgroundColor === 'transparent' ? '#000000' : titleStyle.backgroundColor}
                          onChange={(e) => setTitleStyle(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="w-8 h-8 rounded border border-green-300"
                        />
                        <button
                          onClick={() => setTitleStyle(prev => ({ ...prev, backgroundColor: 'transparent' }))}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${
                            titleStyle.backgroundColor === 'transparent'
                              ? 'bg-green-600 text-white border-green-600'
                              : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50'
                          }`}
                        >
                          None
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Text Style Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTitleStyle(prev => ({ 
                        ...prev, 
                        fontWeight: prev.fontWeight === 'bold' ? 'normal' : 'bold' 
                      }))}
                      className={`p-2 rounded border transition-colors ${
                        titleStyle.fontWeight === 'bold'
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50'
                      }`}
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTitleStyle(prev => ({ 
                        ...prev, 
                        fontStyle: prev.fontStyle === 'italic' ? 'normal' : 'italic' 
                      }))}
                      className={`p-2 rounded border transition-colors ${
                        titleStyle.fontStyle === 'italic'
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50'
                      }`}
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTitleStyle(prev => ({ 
                        ...prev, 
                        textDecoration: prev.textDecoration === 'underline' ? 'none' : 'underline' 
                      }))}
                      className={`p-2 rounded border transition-colors ${
                        titleStyle.textDecoration === 'underline'
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50'
                      }`}
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Animation */}
                  <div>
                    <label className="block text-xs font-medium text-green-800 mb-1">Animation</label>
                    <select
                      value={titleStyle.animation}
                      onChange={(e) => setTitleStyle(prev => ({ ...prev, animation: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 text-sm"
                    >
                      <option value="none">No Animation</option>
                      <option value="fadeIn">Fade In</option>
                      <option value="slideIn">Slide In</option>
                      <option value="bounce">Bounce</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Slide Content
                  </label>
                  <button
                    onClick={addContentPoint}
                    className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    <Type className="w-4 h-4" />
                    Add Point
                  </button>
                </div>

                <div className="space-y-3">
                  {editedContent.map((point, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => updateContentPoint(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder={`Content point ${index + 1}...`}
                      />
                      {editedContent.length > 1 && (
                        <button
                          onClick={() => removeContentPoint(index)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Content Style Controls */}
                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-blue-900">Content Style</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Font Size */}
                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Font Size</label>
                      <select
                        value={contentStyle.fontSize}
                        onChange={(e) => setContentStyle(prev => ({ ...prev, fontSize: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="h1">H1 (Largest)</option>
                        <option value="h2">H2 (Large)</option>
                        <option value="h3">H3 (Medium)</option>
                        <option value="h4">H4 (Small)</option>
                        <option value="h5">H5 (Smaller)</option>
                        <option value="p">P (Normal)</option>
                      </select>
                    </div>

                    {/* Text Align */}
                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Alignment</label>
                      <div className="flex gap-1">
                        {[
                          { value: 'left', icon: AlignLeft },
                          { value: 'center', icon: AlignCenter },
                          { value: 'right', icon: AlignRight }
                        ].map(({ value, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => setContentStyle(prev => ({ ...prev, textAlign: value as any }))}
                            className={`p-2 rounded border transition-colors ${
                              contentStyle.textAlign === value
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Color */}
                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={contentStyle.textColor}
                          onChange={(e) => setContentStyle(prev => ({ ...prev, textColor: e.target.value }))}
                          className="w-8 h-8 rounded border border-blue-300"
                        />
                        <input
                          type="text"
                          value={contentStyle.textColor}
                          onChange={(e) => setContentStyle(prev => ({ ...prev, textColor: e.target.value }))}
                          className="flex-1 px-2 py-1 border border-blue-300 rounded text-xs"
                        />
                      </div>
                    </div>

                    {/* Background Color */}
                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Background</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={contentStyle.backgroundColor === 'transparent' ? '#000000' : contentStyle.backgroundColor}
                          onChange={(e) => setContentStyle(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="w-8 h-8 rounded border border-blue-300"
                        />
                        <button
                          onClick={() => setContentStyle(prev => ({ ...prev, backgroundColor: 'transparent' }))}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${
                            contentStyle.backgroundColor === 'transparent'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50'
                          }`}
                        >
                          None
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Text Style Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setContentStyle(prev => ({ 
                        ...prev, 
                        fontWeight: prev.fontWeight === 'bold' ? 'normal' : 'bold' 
                      }))}
                      className={`p-2 rounded border transition-colors ${
                        contentStyle.fontWeight === 'bold'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50'
                      }`}
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setContentStyle(prev => ({ 
                        ...prev, 
                        fontStyle: prev.fontStyle === 'italic' ? 'normal' : 'italic' 
                      }))}
                      className={`p-2 rounded border transition-colors ${
                        contentStyle.fontStyle === 'italic'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50'
                      }`}
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setContentStyle(prev => ({ 
                        ...prev, 
                        textDecoration: prev.textDecoration === 'underline' ? 'none' : 'underline' 
                      }))}
                      className={`p-2 rounded border transition-colors ${
                        contentStyle.textDecoration === 'underline'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50'
                      }`}
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Animation */}
                  <div>
                    <label className="block text-xs font-medium text-blue-800 mb-1">Animation</label>
                    <select
                      value={contentStyle.animation}
                      onChange={(e) => setContentStyle(prev => ({ ...prev, animation: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="none">No Animation</option>
                      <option value="fadeIn">Fade In</option>
                      <option value="slideIn">Slide In</option>
                      <option value="bounce">Bounce</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Speaker Notes */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Speaker Notes
                </label>
                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  placeholder="Enter speaker notes for narration..."
                />
              </div>
            </div>

            {/* Preview Panel */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 rounded-lg p-8 min-h-[400px] relative overflow-hidden">
                {/* Title Preview */}
                <div 
                  className={`mb-6 ${getAnimationClass(titleStyle.animation)}`}
                  style={getPreviewStyle(titleStyle)}
                >
                  {editedTitle || 'Slide Title'}
                </div>

                {/* Content Preview */}
                <div className="space-y-3">
                  {editedContent.map((point, index) => (
                    <div 
                      key={index}
                      className={`flex items-start gap-3 ${getAnimationClass(contentStyle.animation)}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                      <div style={getPreviewStyle(contentStyle)}>
                        {point || `Content point ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Style Info */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-white text-xs space-y-1">
                    <div>Title: {titleStyle.fontSize.toUpperCase()} • {titleStyle.textAlign} • {titleStyle.animation}</div>
                    <div>Content: {contentStyle.fontSize.toUpperCase()} • {contentStyle.textAlign} • {contentStyle.animation}</div>
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Quick Style Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setTitleStyle({ ...defaultTextStyle, fontSize: 'h1', textAlign: 'center' });
                      setContentStyle({ ...defaultTextStyle, fontSize: 'p', fontWeight: 'normal', textAlign: 'center' });
                    }}
                    className="p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <div className="font-medium text-blue-900">Centered</div>
                    <div className="text-blue-700 text-xs">Center aligned text</div>
                  </button>
                  <button
                    onClick={() => {
                      setTitleStyle({ ...defaultTextStyle, fontSize: 'h2', animation: 'slideIn' });
                      setContentStyle({ ...defaultTextStyle, fontSize: 'p', fontWeight: 'normal', animation: 'fadeIn' });
                    }}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm"
                  >
                    <div className="font-medium text-green-900">Animated</div>
                    <div className="text-green-700 text-xs">With slide animations</div>
                  </button>
                  <button
                    onClick={() => {
                      setTitleStyle({ ...defaultTextStyle, fontSize: 'h1', backgroundColor: '#1F2937', textColor: '#FFFFFF' });
                      setContentStyle({ ...defaultTextStyle, fontSize: 'p', fontWeight: 'normal', backgroundColor: '#374151', textColor: '#FFFFFF' });
                    }}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    <div className="font-medium text-gray-900">Highlighted</div>
                    <div className="text-gray-700 text-xs">With backgrounds</div>
                  </button>
                  <button
                    onClick={() => {
                      setTitleStyle({ ...defaultTextStyle, fontSize: 'h3', fontWeight: 'normal', textDecoration: 'underline' });
                      setContentStyle({ ...defaultTextStyle, fontSize: 'p', fontWeight: 'normal', fontStyle: 'italic' });
                    }}
                    className="p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-sm"
                  >
                    <div className="font-medium text-purple-900">Elegant</div>
                    <div className="text-purple-700 text-xs">Underline & italic</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 mt-8">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium shadow-lg flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Text Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};