import { useState, useCallback } from 'react';
import { Presentation } from '../types/presentation';
import { demoPresentationService, DemoPresentationMetadata } from '../services/demoPresentationService';
import { PPTXExportService } from '../services/pptxService';

export const useDemoPresentationStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save presentation to demo storage
  const savePresentation = useCallback(async (presentation: Presentation): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const presentationId = await demoPresentationService.savePresentation(presentation);
      return presentationId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save presentation';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load presentation from demo storage
  const loadPresentation = useCallback(async (presentationId: string): Promise<Presentation> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const presentation = await demoPresentationService.loadPresentation(presentationId);
      return presentation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load presentation';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get user's presentations
  const getUserPresentations = useCallback(async (): Promise<DemoPresentationMetadata[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const presentations = await demoPresentationService.getUserPresentations();
      return presentations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load presentations';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update presentation
  const updatePresentation = useCallback(async (
    presentationId: string, 
    updates: Partial<Presentation>
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await demoPresentationService.updatePresentation(presentationId, updates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update presentation';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete presentation
  const deletePresentation = useCallback(async (presentationId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await demoPresentationService.deletePresentation(presentationId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete presentation';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Upload image (demo version - just returns a placeholder)
  const uploadImage = useCallback(async (
    file: File, 
    presentationId?: string
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In demo mode, we'll just return a placeholder image URL
      const placeholderUrl = `https://picsum.photos/800/600?random=${Date.now()}`;
      console.log('📷 Demo image upload - returning placeholder:', placeholderUrl);
      return placeholderUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enhanced export presentation with proper PPTX support
  const exportPresentation = useCallback(async (
    presentation: Presentation,
    presentationId: string,
    format: 'pdf' | 'pptx' | 'json' | 'html'
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      let exportData: any;
      let mimeType: string;
      let fileName: string;

      switch (format) {
        case 'pptx':
          // Use the proper PPTX export service with real PowerPoint format
          console.log('🎯 Exporting as proper PPTX format...');
          await PPTXExportService.exportToPPTX(presentation);
          console.log('✅ PPTX export completed successfully - PowerPoint compatible');
          return 'pptx-exported';

        case 'json':
          exportData = JSON.stringify(presentation, null, 2);
          mimeType = 'application/json';
          fileName = `${presentation.title}.json`;
          break;

        case 'html':
          exportData = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>${presentation.title}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                .slide { page-break-after: always; padding: 30px; border-bottom: 3px solid #eee; margin-bottom: 40px; }
                .slide-title { font-size: 28px; font-weight: bold; color: #333; margin-bottom: 25px; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
                .slide-content { margin-bottom: 25px; }
                .slide-content ul { padding-left: 20px; }
                .slide-content li { margin-bottom: 10px; font-size: 16px; }
                .speaker-notes { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 25px; border-left: 4px solid #007acc; }
                .notes-title { font-weight: bold; color: #007acc; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; }
                .slide-number { color: #666; font-size: 14px; margin-bottom: 10px; }
                .presentation-header { text-align: center; margin-bottom: 50px; padding-bottom: 30px; border-bottom: 3px solid #007acc; }
                .presentation-title { font-size: 36px; color: #007acc; margin-bottom: 10px; }
                .presentation-meta { color: #666; font-size: 16px; }
              </style>
            </head>
            <body>
              <div class="presentation-header">
                <h1 class="presentation-title">${presentation.title}</h1>
                <div class="presentation-meta">
                  <strong>Generated:</strong> ${new Date().toLocaleDateString()} | 
                  <strong>Total Slides:</strong> ${presentation.slides.length}
                </div>
              </div>
              ${presentation.slides.map((slide, i) => `
                <div class="slide">
                  <div class="slide-number">Slide ${i + 1} of ${presentation.slides.length}</div>
                  <h2 class="slide-title">${slide.title}</h2>
                  <div class="slide-content">
                    <ul>
                      ${slide.content.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                  </div>
                  ${slide.imageUrl ? `<p><strong>📷 Image:</strong> <a href="${slide.imageUrl}" target="_blank">View Image</a></p>` : ''}
                  ${slide.notes ? `
                    <div class="speaker-notes">
                      <div class="notes-title">🎤 Speaker Notes</div>
                      <p>${slide.notes}</p>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </body>
            </html>
          `;
          mimeType = 'text/html';
          fileName = `${presentation.title}.html`;
          break;

        case 'pdf':
          // For PDF, we'll create a structured text format that can be easily converted
          exportData = `${presentation.title}\n`;
          exportData += `Generated: ${new Date().toLocaleDateString()}\n`;
          exportData += `Total Slides: ${presentation.slides.length}\n\n`;
          exportData += '='.repeat(80) + '\n\n';

          presentation.slides.forEach((slide, i) => {
            exportData += `SLIDE ${i + 1}: ${slide.title}\n`;
            exportData += '-'.repeat(50) + '\n\n';
            
            exportData += 'CONTENT:\n';
            slide.content.forEach((point, idx) => {
              exportData += `  ${idx + 1}. ${point}\n`;
            });
            
            if (slide.imageUrl) {
              exportData += `\nIMAGE: ${slide.imageUrl}\n`;
            }
            
            if (slide.notes) {
              exportData += `\nSPEAKER NOTES:\n${slide.notes}\n`;
            }
            
            exportData += '\n' + '='.repeat(80) + '\n\n';
          });

          mimeType = 'application/pdf';
          fileName = `${presentation.title}.pdf`;
          break;

        default:
          exportData = `${presentation.title}\n\n${presentation.slides.map((slide, i) => 
            `Slide ${i + 1}: ${slide.title}\n${slide.content.join('\n')}\n\nNotes: ${slide.notes}\n\n---\n`
          ).join('')}`;
          mimeType = 'text/plain';
          fileName = `${presentation.title}.txt`;
      }

      // For non-PPTX formats, create and download the file
      if (format !== 'pptx') {
        const blob = new Blob([exportData], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        // Trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log(`✅ Presentation exported as ${format.toUpperCase()}`);
      }
      
      return 'exported';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export presentation';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Share presentation (demo version)
  const sharePresentation = useCallback(async (
    presentationId: string,
    shareWith?: string,
    permission: 'view' | 'comment' | 'edit' = 'view'
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const shareUrl = await demoPresentationService.sharePresentation(presentationId, shareWith, permission);
      return shareUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to share presentation';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Duplicate presentation
  const duplicatePresentation = useCallback(async (
    presentationId: string,
    newTitle?: string
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newPresentationId = await demoPresentationService.duplicatePresentation(presentationId, newTitle);
      return newPresentationId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate presentation';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    isLoading,
    error,
    
    // Actions
    savePresentation,
    loadPresentation,
    getUserPresentations,
    updatePresentation,
    deletePresentation,
    uploadImage,
    exportPresentation,
    sharePresentation,
    duplicatePresentation,
    
    // Utilities
    clearError: () => setError(null)
  };
};