// Demo presentation service - uses localStorage instead of Supabase
import { Presentation, Slide } from '../types/presentation';

export interface DemoPresentationMetadata {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  status: 'draft' | 'published' | 'archived';
  theme: string;
  total_slides: number;
  estimated_duration?: number;
  tags: string[];
  is_public: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  last_presented_at?: string;
  user_id: string;
}

const PRESENTATIONS_KEY = 'demo-presentations';

class DemoPresentationService {
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private getPresentations(): DemoPresentationMetadata[] {
    try {
      const presentations = localStorage.getItem(PRESENTATIONS_KEY);
      return presentations ? JSON.parse(presentations) : [];
    } catch {
      return [];
    }
  }

  private savePresentations(presentations: DemoPresentationMetadata[]): void {
    localStorage.setItem(PRESENTATIONS_KEY, JSON.stringify(presentations));
  }

  private getCurrentUserId(): string {
    try {
      const userStr = localStorage.getItem('current-user');
      const user = userStr ? JSON.parse(userStr) : null;
      return user?.id || 'demo-user';
    } catch {
      return 'demo-user';
    }
  }

  async savePresentation(presentation: Presentation): Promise<string> {
    try {
      console.log('💾 Saving presentation to demo storage:', presentation.title);

      const presentations = this.getPresentations();
      const presentationId = this.generateId();
      const userId = this.getCurrentUserId();

      const metadata: DemoPresentationMetadata = {
        id: presentationId,
        user_id: userId,
        title: presentation.title,
        description: `AI-generated presentation with ${presentation.slides.length} slides`,
        theme: 'modern',
        total_slides: presentation.slides.length,
        tags: this.extractTagsFromContent(presentation),
        status: 'draft',
        is_public: false,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      presentations.push(metadata);
      this.savePresentations(presentations);

      // Save the full presentation data separately
      const fullPresentationKey = `presentation-${presentationId}`;
      localStorage.setItem(fullPresentationKey, JSON.stringify(presentation));

      console.log('✅ Demo presentation saved successfully:', presentationId);
      return presentationId;

    } catch (error) {
      console.error('❌ Error saving demo presentation:', error);
      throw error;
    }
  }

  async loadPresentation(presentationId: string): Promise<Presentation> {
    try {
      console.log('📖 Loading presentation from demo storage:', presentationId);

      const fullPresentationKey = `presentation-${presentationId}`;
      const presentationStr = localStorage.getItem(fullPresentationKey);

      if (!presentationStr) {
        throw new Error('Presentation not found');
      }

      const presentation = JSON.parse(presentationStr);

      // Update view count
      const presentations = this.getPresentations();
      const index = presentations.findIndex(p => p.id === presentationId);
      if (index >= 0) {
        presentations[index].view_count++;
        this.savePresentations(presentations);
      }

      console.log('✅ Demo presentation loaded successfully');
      return presentation;

    } catch (error) {
      console.error('❌ Error loading demo presentation:', error);
      throw error;
    }
  }

  async getUserPresentations(): Promise<DemoPresentationMetadata[]> {
    try {
      console.log('📋 Loading user presentations from demo storage...');
      
      const presentations = this.getPresentations();
      const userId = this.getCurrentUserId();
      
      const userPresentations = presentations
        .filter(p => p.user_id === userId)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      console.log('✅ Loaded', userPresentations.length, 'demo presentations');
      return userPresentations;
    } catch (error) {
      console.error('❌ Error loading user presentations:', error);
      throw error;
    }
  }

  async updatePresentation(presentationId: string, updates: Partial<Presentation>): Promise<void> {
    try {
      console.log('🔄 Updating demo presentation:', presentationId);

      // Update metadata
      const presentations = this.getPresentations();
      const index = presentations.findIndex(p => p.id === presentationId);
      
      if (index >= 0) {
        if (updates.title) {
          presentations[index].title = updates.title;
        }
        if (updates.slides) {
          presentations[index].total_slides = updates.slides.length;
        }
        presentations[index].updated_at = new Date().toISOString();
        this.savePresentations(presentations);
      }

      // Update full presentation data
      const fullPresentationKey = `presentation-${presentationId}`;
      const presentationStr = localStorage.getItem(fullPresentationKey);
      
      if (presentationStr) {
        const presentation = JSON.parse(presentationStr);
        const updatedPresentation = { ...presentation, ...updates };
        localStorage.setItem(fullPresentationKey, JSON.stringify(updatedPresentation));
      }

      console.log('✅ Demo presentation updated successfully');
    } catch (error) {
      console.error('❌ Error updating demo presentation:', error);
      throw error;
    }
  }

  async deletePresentation(presentationId: string): Promise<void> {
    try {
      console.log('🗑️ Deleting demo presentation:', presentationId);

      // Remove from metadata
      const presentations = this.getPresentations();
      const filteredPresentations = presentations.filter(p => p.id !== presentationId);
      this.savePresentations(filteredPresentations);

      // Remove full presentation data
      const fullPresentationKey = `presentation-${presentationId}`;
      localStorage.removeItem(fullPresentationKey);

      console.log('✅ Demo presentation deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting demo presentation:', error);
      throw error;
    }
  }

  async sharePresentation(presentationId: string, shareWith?: string, permission: 'view' | 'comment' | 'edit' = 'view'): Promise<string> {
    // In demo mode, just return a mock share URL
    const shareUrl = `${window.location.origin}/demo-share/${presentationId}`;
    console.log('🔗 Demo share URL generated:', shareUrl);
    return shareUrl;
  }

  async duplicatePresentation(presentationId: string, newTitle?: string): Promise<string> {
    try {
      console.log('📋 Duplicating demo presentation:', presentationId);

      const originalPresentation = await this.loadPresentation(presentationId);
      const duplicatedPresentation = {
        ...originalPresentation,
        title: newTitle || `${originalPresentation.title} (Copy)`
      };

      const newPresentationId = await this.savePresentation(duplicatedPresentation);
      console.log('✅ Demo presentation duplicated successfully:', newPresentationId);
      return newPresentationId;

    } catch (error) {
      console.error('❌ Error duplicating demo presentation:', error);
      throw error;
    }
  }

  private extractTagsFromContent(presentation: Presentation): string[] {
    const words = presentation.title.toLowerCase().split(' ');
    const contentWords = presentation.slides
      .flatMap(slide => slide.content)
      .join(' ')
      .toLowerCase()
      .split(' ');
    
    const allWords = [...words, ...contentWords];
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    
    return [...new Set(allWords)]
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 5);
  }
}

export const demoPresentationService = new DemoPresentationService();