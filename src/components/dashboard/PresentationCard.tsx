import React, { useState } from 'react';
import { 
  Presentation, 
  Calendar, 
  Eye, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Share2, 
  Download, 
  Copy,
  ExternalLink,
  Clock,
  FileText
} from 'lucide-react';
import { PresentationMetadata } from '../../services/presentationService';

interface PresentationCardProps {
  presentation: PresentationMetadata;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onExport: (id: string, format: string) => void;
  onDuplicate: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

export const PresentationCard: React.FC<PresentationCardProps> = ({
  presentation,
  onOpen,
  onEdit,
  onDelete,
  onShare,
  onExport,
  onDuplicate,
  viewMode = 'grid'
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div 
          className="p-3 md:p-4 cursor-pointer flex flex-col md:flex-row md:items-center gap-2 md:gap-4"
          onClick={() => onOpen(presentation.id)}
        >
          {/* Thumbnail/Icon */}
          <div className="w-full md:w-12 h-24 md:h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center overflow-hidden">
            {presentation.thumbnail_url ? (
              <img 
                src={presentation.thumbnail_url} 
                alt={presentation.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Presentation className="w-6 h-6 text-blue-400" />
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-2">
              <div>
                <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {presentation.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>{presentation.total_slides} slides</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(presentation.updated_at)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(presentation.status)}`}>
                  {presentation.status}
                </span>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{presentation.view_count}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="relative flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-40">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(presentation.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 text-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(presentation.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 text-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplicate
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(presentation.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 text-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExport(presentation.id, 'pdf');
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 text-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export PDF
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(presentation.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-red-50 flex items-center gap-2 text-red-600 text-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative h-32 md:h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        {presentation.thumbnail_url ? (
          <img 
            src={presentation.thumbnail_url} 
            alt={presentation.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <Presentation className="w-10 h-10 md:w-16 md:h-16 text-blue-400 mx-auto mb-1 md:mb-2" />
            <span className="text-xs md:text-sm text-gray-500">No preview</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-2 left-2 md:top-3 md:left-3 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${getStatusColor(presentation.status)}`}>
          {presentation.status}
        </div>

        {/* Menu Button */}
        <div className="absolute top-2 right-2 md:top-3 md:right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 md:p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
          >
            <MoreVertical className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-8 md:top-12 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-40 text-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(presentation.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(presentation.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
              >
                <Copy className="w-3.5 h-3.5" />
                Duplicate
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(presentation.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExport(presentation.id, 'pdf');
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
              >
                <Download className="w-3.5 h-3.5" />
                Export PDF
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExport(presentation.id, 'pptx');
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
              >
                <FileText className="w-3.5 h-3.5" />
                Export PPTX
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(presentation.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-1.5 text-left hover:bg-red-50 flex items-center gap-2 text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Public Badge */}
        {presentation.is_public && (
          <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 px-1.5 py-0.5 md:px-2 md:py-1 bg-blue-100 text-blue-800 rounded-full text-[10px] md:text-xs font-medium flex items-center gap-1">
            <ExternalLink className="w-2 h-2 md:w-3 md:h-3" />
            Public
          </div>
        )}
      </div>

      {/* Content */}
      <div 
        className="p-3 md:p-6 cursor-pointer"
        onClick={() => onOpen(presentation.id)}
      >
        <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 md:mb-2 truncate group-hover:text-blue-600 transition-colors">
          {presentation.title}
        </h3>
        
        {presentation.description && (
          <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-4 line-clamp-2">
            {presentation.description}
          </p>
        )}

        {/* Tags */}
        {presentation.tags && presentation.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2 md:mb-4">
            {presentation.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="px-1.5 py-0.5 md:px-2 md:py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] md:text-xs"
              >
                {tag}
              </span>
            ))}
            {presentation.tags.length > 2 && (
              <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] md:text-xs">
                +{presentation.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-500 mb-2 md:mb-4">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1">
              <Presentation className="w-3 h-3 md:w-4 md:h-4" />
              <span>{presentation.total_slides} slides</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              <span>{presentation.view_count} views</span>
            </div>
            
            {presentation.estimated_duration && (
              <div className="hidden sm:flex items-center gap-1">
                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                <span>{presentation.estimated_duration}m</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
            <span>Updated {formatDate(presentation.updated_at)}</span>
          </div>
          
          {presentation.last_presented_at && (
            <div className="hidden sm:flex items-center gap-1">
              <span>Last presented {formatDate(presentation.last_presented_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};