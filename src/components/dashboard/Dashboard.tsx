import React, { useState, useEffect } from 'react';
import { Plus, Presentation, Settings, LogOut, Sparkles, FileText, Clock, User, TrendingUp, Zap, Volume2, Search, Filter, Grid, List, Trash2, AlertCircle } from 'lucide-react';
import { useDemoAuth } from '../../hooks/useDemoAuth';
import { useDemoPresentationStorage } from '../../hooks/useDemoPresentationStorage';
import { Presentation as PresentationType } from '../../types/presentation';
import { DemoPresentationMetadata } from '../../services/demoPresentationService';
import { CreatePresentationPage } from './CreatePresentationPage';
import { PresentationCard } from './PresentationCard';

interface DashboardProps {
  onCreatePresentation: (topic: string) => void;
  onCreateManualPresentation: (presentation: PresentationType) => void;
  onOpenPresentation: (presentationId: string) => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onCreatePresentation, 
  onCreateManualPresentation, 
  onOpenPresentation, 
  onOpenSettings, 
  hasApiKey 
}) => {
  const { user, signOut } = useDemoAuth();
  const { getUserPresentations, deletePresentation, duplicatePresentation, sharePresentation } = useDemoPresentationStorage();
  
  const [currentView, setCurrentView] = useState<'dashboard' | 'create'>('dashboard');
  const [presentations, setPresentations] = useState<DemoPresentationMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showClearStorageModal, setShowClearStorageModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load user presentations
  useEffect(() => {
    const loadPresentations = async () => {
      try {
        setIsLoading(true);
        const userPresentations = await getUserPresentations();
        setPresentations(userPresentations);
      } catch (error) {
        console.error('Failed to load presentations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadPresentations();
    }
  }, [user, getUserPresentations]);

  const handleCreateAI = async (topic: string) => {
    // Don't change view here - let CreatePresentationPage handle the loading UI
    try {
      await onCreatePresentation(topic);
      // Only change view after successful creation
      setCurrentView('dashboard');
      // Reload presentations after creating
      const userPresentations = await getUserPresentations();
      setPresentations(userPresentations);
    } catch (error) {
      // If there's an error, CreatePresentationPage will handle going back to details step
      console.error('Failed to create AI presentation:', error);
    }
  };

  const handleCreateManual = async (presentation: PresentationType) => {
    setCurrentView('dashboard');
    await onCreateManualPresentation(presentation);
    // Reload presentations after creating
    const userPresentations = await getUserPresentations();
    setPresentations(userPresentations);
  };

  const handleDeletePresentation = async (presentationId: string) => {
    if (window.confirm('Are you sure you want to delete this presentation?')) {
      try {
        await deletePresentation(presentationId);
        setPresentations(prev => prev.filter(p => p.id !== presentationId));
      } catch (error) {
        console.error('Failed to delete presentation:', error);
      }
    }
  };

  const handleDuplicatePresentation = async (presentationId: string) => {
    try {
      const newPresentationId = await duplicatePresentation(presentationId);
      // Reload presentations to show the new one
      const userPresentations = await getUserPresentations();
      setPresentations(userPresentations);
    } catch (error) {
      console.error('Failed to duplicate presentation:', error);
    }
  };

  const handleSharePresentation = async (presentationId: string) => {
    try {
      const shareUrl = await sharePresentation(presentationId);
      navigator.clipboard.writeText(shareUrl);
      alert('Demo share link copied to clipboard!');
    } catch (error) {
      console.error('Failed to share presentation:', error);
    }
  };

  const handleExportPresentation = async (presentationId: string, format: string) => {
    try {
      const presentation = presentations.find(p => p.id === presentationId);
      if (!presentation) return;

      // For demo mode, create a simple export
      const exportData = {
        title: presentation.title,
        description: presentation.description,
        slides: presentation.total_slides,
        created: presentation.created_at
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${presentation.title}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export presentation:', error);
    }
  };

  // Clear all local storage data
  const handleClearLocalStorage = () => {
    try {
      // Keep the current user logged in
      const currentUser = localStorage.getItem('current-user');
      
      // Clear all localStorage
      localStorage.clear();
      
      // Restore current user if needed
      if (currentUser) {
        localStorage.setItem('current-user', currentUser);
      }
      
      // Reset presentations
      setPresentations([]);
      
      // Close modal
      setShowClearStorageModal(false);
      
      // Show success message
      alert('Local storage has been cleared successfully. All presentations have been removed.');
      
      console.log('✅ Local storage cleared successfully');
    } catch (error) {
      console.error('Failed to clear local storage:', error);
      alert('Failed to clear local storage. Please try again.');
    }
  };

  // Filter presentations
  const filteredPresentations = presentations.filter(presentation => {
    const matchesSearch = presentation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (presentation.description && presentation.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || presentation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (currentView === 'create') {
    return (
      <CreatePresentationPage
        onBack={() => setCurrentView('dashboard')}
        onCreateAI={handleCreateAI}
        onCreateManual={handleCreateManual}
        hasApiKey={hasApiKey}
        onOpenSettings={onOpenSettings}
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">Prezentic</h1>
                  <p className="text-xs md:text-sm text-gray-600">Demo Dashboard</p>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 bg-white/20 rounded-lg border border-white/30"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-700 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.fullName || user?.username}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Demo</span>
                </div>
                <button
                  onClick={onOpenSettings}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm border border-white/20"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Settings</span>
                </button>
                <button
                  onClick={() => setShowClearStorageModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm border border-white/20"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm">Clear Data</span>
                </button>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm border border-white/20"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-3 pt-3 border-t border-white/20 space-y-2">
                <div className="flex items-center gap-2 text-gray-700 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.fullName || user?.username}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Demo</span>
                </div>
                <button
                  onClick={onOpenSettings}
                  className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/20 rounded-lg transition-all backdrop-blur-sm border border-white/20"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Settings</span>
                </button>
                <button
                  onClick={() => setShowClearStorageModal(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-white/20 rounded-lg transition-all backdrop-blur-sm border border-white/20"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm">Clear Data</span>
                </button>
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/20 rounded-lg transition-all backdrop-blur-sm border border-white/20"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-4 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
            Welcome back, {user?.fullName || user?.username}! 👋
          </h2>
          <p className="text-sm md:text-xl text-gray-600">
            Create stunning presentations with AI-powered content and professional narration in demo mode.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
          <button
            onClick={() => setCurrentView('create')}
            className="group bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 text-white p-4 md:p-8 rounded-xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-left relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
                <Plus className="h-5 w-5 md:h-8 md:w-8" />
                <h3 className="text-lg md:text-xl font-semibold">Create Presentation</h3>
              </div>
              <p className="text-xs md:text-sm text-blue-100">
                Generate AI-powered presentations or create manually with templates
              </p>
            </div>
          </button>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 md:p-8 rounded-xl md:rounded-3xl shadow-lg hover:shadow-xl transition-all hover:bg-white/20">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-lg md:rounded-xl flex items-center justify-center">
                <Presentation className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">My Presentations</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">
              {presentations.length} presentations created
            </p>
            <div className="text-xl md:text-3xl font-bold text-purple-600">
              {presentations.length}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 md:p-8 rounded-xl md:rounded-3xl shadow-lg hover:shadow-xl transition-all hover:bg-white/20">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-teal-100 rounded-lg md:rounded-xl flex items-center justify-center">
                <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-teal-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">Total Slides</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">
              Slides across all presentations
            </p>
            <div className="text-xl md:text-3xl font-bold text-teal-600">
              {presentations.reduce((total, p) => total + p.total_slides, 0)}
            </div>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl md:rounded-2xl p-3 md:p-6 mb-4 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-1 md:mb-2">Demo Mode Active</h3>
              <p className="text-xs md:text-sm text-blue-800 leading-relaxed">
                You're using the demo version of Prezentic. All data is stored locally in your browser. 
                Your presentations and account information will persist until you clear your browser data.
              </p>
              <button
                onClick={() => setShowClearStorageModal(true)}
                className="mt-2 md:mt-3 flex items-center gap-1 md:gap-2 px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs md:text-sm"
              >
                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                Clear Local Storage
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
          {[
            {
              icon: Sparkles,
              title: "AI Content Generation",
              description: "Smart, topic-specific content creation",
              color: "blue"
            },
            {
              icon: Volume2,
              title: "Voice Narration",
              description: "Human-like emotional AI voice",
              color: "purple"
            },
            {
              icon: Zap,
              title: "Auto-Advance",
              description: "Automated slide progression",
              color: "teal"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 p-3 md:p-6 rounded-xl md:rounded-2xl hover:bg-white/20 transition-all">
              <div className={`w-8 h-8 md:w-12 md:h-12 bg-${feature.color}-100 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-4`}>
                <feature.icon className={`h-4 w-4 md:h-6 md:w-6 text-${feature.color}-600`} />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">{feature.title}</h3>
              <p className="text-xs md:text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Presentations Section */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-3xl shadow-lg p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-6 gap-3">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900">My Presentations</h3>
            <button
              onClick={() => setCurrentView('create')}
              className="flex items-center gap-1 md:gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg md:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
            >
              <Plus className="h-4 w-4" />
              New Presentation
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search presentations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 text-xs md:text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-2 md:px-3 py-2 text-xs md:text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              
              <div className="flex items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-white/20'}`}
                >
                  <Grid className="h-3 w-3 md:h-4 md:w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-white/20'}`}
                >
                  <List className="h-3 w-3 md:h-4 md:w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Presentations Grid/List */}
          {isLoading ? (
            <div className="text-center py-8 md:py-12">
              <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto mb-3 md:mb-4"></div>
              <p className="text-sm md:text-base text-gray-600">Loading presentations...</p>
            </div>
          ) : filteredPresentations.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <FileText className="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
              </div>
              <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 md:mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No presentations found' : 'No presentations yet'}
              </h4>
              <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6 max-w-md mx-auto">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first presentation to get started with AI-powered content generation and professional narration.'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <button
                  onClick={() => setCurrentView('create')}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white px-6 py-3 rounded-lg md:rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
                >
                  Create Your First Presentation
                </button>
              )}
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
              : "space-y-3 md:space-y-4"
            }>
              {filteredPresentations.map((presentation) => (
                <PresentationCard
                  key={presentation.id}
                  presentation={presentation}
                  onOpen={onOpenPresentation}
                  onEdit={onOpenPresentation}
                  onDelete={handleDeletePresentation}
                  onShare={handleSharePresentation}
                  onExport={handleExportPresentation}
                  onDuplicate={handleDuplicatePresentation}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Clear Local Storage Confirmation Modal */}
      {showClearStorageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Clear All Data</h3>
            </div>
            
            <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">
              This will permanently delete all your presentations and reset the application. This action cannot be undone.
            </p>
            
            <div className="bg-red-50 p-3 md:p-4 rounded-lg mb-4 md:mb-6">
              <p className="text-xs md:text-sm text-red-800">
                <strong>Warning:</strong> All your presentations, settings, and application data will be permanently removed from your browser's local storage.
              </p>
            </div>
            
            <div className="flex gap-3 md:gap-4">
              <button
                onClick={() => setShowClearStorageModal(false)}
                className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleClearLocalStorage}
                className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};