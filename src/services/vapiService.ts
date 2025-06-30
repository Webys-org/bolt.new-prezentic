import Vapi from '@vapi-ai/web';
import { Slide } from '../types/presentation';

export interface VapiConfig {
  publicKey: string;
  voice?: {
    provider: string;
    voiceId: string;
  };
}

export class VapiNarrationService {
  private vapi: Vapi | null = null;
  private _isInitialized = false;
  private currentCall: any = null;
  private onError?: (error: string) => void;
  private onStatusChange?: (status: string) => void;
  private onWordProgress?: (wordsSpoken: number, totalWords: number) => void;
  private onSlideComplete?: () => void;
  private config: VapiConfig;
  private hasCallEnded = false;
  private currentWordCount = 0;
  private totalWordCount = 0;
  private speechProgressInterval: NodeJS.Timeout | null = null;
  private isCurrentlySpeaking = false;
  private speakerNotesWords: string[] = [];
  private lastProgressUpdate = 0;
  private currentSlideContent = '';
  private speechEndTimeout: NodeJS.Timeout | null = null;
  private hasCompletedPresentation = false;
  
  // Auto-advance automation variables
  private isAutoAdvanceMode = false;
  private autoAdvanceSlides: Slide[] = [];
  private currentAutoSlideIndex = 0;
  private totalAutoSlides = 0;
  private presentationTitle = '';
  private onAutoAdvanceNext?: () => void;
  private slideCompletionTimeout: NodeJS.Timeout | null = null;
  private slideTransitionInProgress = false;
  private isPresentationExplicitlyStopped = false;

  constructor(config: VapiConfig) {
    this.config = config;
  }

  async init(): Promise<void> {
    try {
      if (!this.config.publicKey) {
        throw new Error('Vapi public key is required');
      }

      this.vapi = new Vapi(this.config.publicKey);
      this.setupEventListeners();
      this._isInitialized = true;
      
      console.log('🎯 Human-like Emotional Presentation System initialized with VAPI AI');
    } catch (error) {
      console.error('❌ Failed to initialize Human-like Emotional Presentation System:', error);
      this._isInitialized = false;
      throw new Error(`Failed to initialize AI Voice System: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private setupEventListeners() {
    if (!this.vapi) return;

    this.vapi.on('call-start', () => {
      console.log(`🎤 Human-like Emotional Presenter connected - Slide ${this.currentAutoSlideIndex + 1}/${this.totalAutoSlides}`);
      this.hasCallEnded = false;
      this.isCurrentlySpeaking = false;
      this.hasCompletedPresentation = false;
      this.slideTransitionInProgress = false;
      this.lastProgressUpdate = Date.now();
      
      // CRITICAL: Reset word progress for new slide
      this.currentWordCount = 0;
      this.onWordProgress?.(0, this.totalWordCount);
      
      this.onStatusChange?.('connected');
    });

    this.vapi.on('speech-start', () => {
      console.log(`🗣️ Human-like Emotional AI Voice started presenting slide ${this.currentAutoSlideIndex + 1}/${this.totalAutoSlides} with emotions and pauses`);
      this.isCurrentlySpeaking = true;
      this.hasCompletedPresentation = false;
      this.slideTransitionInProgress = false;
      this.onStatusChange?.('speaking');
      
      // Clear any existing speech end timeout
      if (this.speechEndTimeout) {
        clearTimeout(this.speechEndTimeout);
        this.speechEndTimeout = null;
      }
      
      // CRITICAL: Ensure word progress starts from 0
      this.currentWordCount = 0;
      this.onWordProgress?.(0, this.totalWordCount);
      
      // Start word tracking for highlighting during emotional presentation
      this.startContinuousWordTracking();
    });

    this.vapi.on('speech-end', () => {
      console.log(`⏸️ Human-like Emotional AI Voice finished slide ${this.currentAutoSlideIndex + 1}/${this.totalAutoSlides} with natural conclusion`);
      this.isCurrentlySpeaking = false;
      
      // Clear any existing timeout
      if (this.speechEndTimeout) {
        clearTimeout(this.speechEndTimeout);
      }
      
      // CRITICAL: Mark slide as 100% complete immediately
      if (this.totalWordCount > 0) {
        this.currentWordCount = this.totalWordCount;
        this.onWordProgress?.(this.totalWordCount, this.totalWordCount);
        console.log(`✅ Slide ${this.currentAutoSlideIndex + 1} marked as 100% complete with emotional delivery`);
      }
      
      // Wait for natural pause before auto-advancing
      this.speechEndTimeout = setTimeout(() => {
        if (!this.isCurrentlySpeaking && !this.hasCallEnded && !this.slideTransitionInProgress) {
          this.handleSlideCompletion();
        }
      }, 3000); // 3 seconds for natural emotional pause between slides
    });

    this.vapi.on('call-end', () => {
      console.log('📞 Human-like Emotional Presentation call ended');
      this.hasCallEnded = true;
      this.currentCall = null;
      this.isCurrentlySpeaking = false;
      this.stopWordTracking();
      this.clearTimeouts();
      
      // FIXED: Only disable auto-advance mode if presentation was explicitly stopped
      // or if we've completed all slides
      const isLastSlide = this.currentAutoSlideIndex >= this.totalAutoSlides - 1;
      const shouldEndPresentation = this.isPresentationExplicitlyStopped || isLastSlide;
      
      if (shouldEndPresentation) {
        console.log('✅ Human-like emotional presentation completed or explicitly stopped');
        this.hasCompletedPresentation = true;
        this.isAutoAdvanceMode = false;
        
        // Complete the highlighting when session ends
        if (this.totalWordCount > 0) {
          this.currentWordCount = this.totalWordCount;
          this.onWordProgress?.(this.totalWordCount, this.totalWordCount);
          console.log('✅ Human-like emotional presentation completed - 100% highlighting achieved');
        }
        
        this.onStatusChange?.('stopped');
      } else {
        // This is just an individual slide ending, not the entire presentation
        console.log(`📋 Slide ${this.currentAutoSlideIndex + 1} call ended, emotional auto-advance continues...`);
        this.onStatusChange?.('transitioning');
      }
    });

    this.vapi.on('error', (error: any) => {
      // Enhanced filtering for meeting/call end related messages
      const errorMessage = error.message || error.errorMsg || '';
      const isCallEndError = errorMessage.includes('Call ended') || 
                           errorMessage.includes('Meeting has ended') ||
                           errorMessage.includes('Meeting ended') ||
                           errorMessage.includes('ejection') ||
                           error.errorMsg === 'Meeting has ended';
      
      if (isCallEndError) {
        console.log('ℹ️ Human-like emotional presentation session ended naturally:', errorMessage);
        // Don't treat natural call end as an error during auto-advance
        if (this.isAutoAdvanceMode && !this.isPresentationExplicitlyStopped) {
          return; // Ignore these errors during auto-advance
        }
        return;
      }
      
      console.error('❌ Human-like Emotional Presentation error:', error);
      const displayErrorMessage = errorMessage || 'Unknown error occurred';
      this.onError?.(`AI Voice System error: ${displayErrorMessage}`);
      this.onStatusChange?.('error');
      this.stopWordTracking();
      this.clearTimeouts();
    });

    // Enhanced transcript tracking for precise word highlighting during emotional delivery
    this.vapi.on('transcript', (transcript: any) => {
      if (transcript.type === 'partial' && transcript.text && this.speakerNotesWords.length > 0) {
        const spokenText = transcript.text.trim().toLowerCase();
        
        if (spokenText.length > 0) {
          const wordsSpoken = this.calculateWordsSpokenFromTranscript(spokenText);
          
          if (wordsSpoken > this.currentWordCount && wordsSpoken <= this.totalWordCount) {
            this.currentWordCount = wordsSpoken;
            this.onWordProgress?.(this.currentWordCount, this.totalWordCount);
            this.lastProgressUpdate = Date.now();
            
            const percentage = Math.round((this.currentWordCount / this.totalWordCount) * 100);
            console.log(`📊 Emotional presentation progress: ${this.currentWordCount}/${this.totalWordCount} words (${percentage}%) - Slide ${this.currentAutoSlideIndex + 1}/${this.totalAutoSlides}`);
          }
        }
      }
      
      if (transcript.type === 'final' && transcript.text) {
        console.log(`📝 Emotional slide ${this.currentAutoSlideIndex + 1} segment:`, transcript.text.substring(0, 100) + '...');
      }
    });
  }

  // FIXED: Handle slide completion and auto-advance with emotional transitions
  private handleSlideCompletion(): void {
    if (this.slideTransitionInProgress) {
      console.log('⚠️ Emotional slide transition already in progress, skipping...');
      return;
    }

    this.slideTransitionInProgress = true;
    console.log(`✅ Slide ${this.currentAutoSlideIndex + 1} completed with emotional human-like delivery`);
    
    // CRITICAL: Ensure current slide is marked as 100% complete
    if (this.totalWordCount > 0) {
      this.currentWordCount = this.totalWordCount;
      this.onWordProgress?.(this.totalWordCount, this.totalWordCount);
    }
    
    // Notify slide completion
    this.onSlideComplete?.();
    
    if (this.isAutoAdvanceMode && !this.isPresentationExplicitlyStopped) {
      // Check if there are more slides
      if (this.currentAutoSlideIndex < this.totalAutoSlides - 1) {
        console.log(`🔄 Auto-advancing to emotional slide ${this.currentAutoSlideIndex + 2}/${this.totalAutoSlides} in 4 seconds...`);
        
        // Auto-advance to next slide after a natural emotional pause
        this.slideCompletionTimeout = setTimeout(() => {
          this.advanceToNextSlide();
        }, 4000); // 4 second natural pause for emotional transitions
      } else {
        console.log('🎉 All slides completed! Ending human-like emotional presentation.');
        this.stopNarration();
      }
    }
  }

  // FIXED: Advance to next slide automatically with emotional transitions
  private async advanceToNextSlide(): Promise<void> {
    if (!this.isAutoAdvanceMode || this.isPresentationExplicitlyStopped) {
      this.slideTransitionInProgress = false;
      return;
    }

    this.currentAutoSlideIndex++;
    
    if (this.currentAutoSlideIndex >= this.totalAutoSlides) {
      console.log('✅ All slides completed in human-like emotional auto-advance mode');
      this.stopNarration();
      this.slideTransitionInProgress = false;
      return;
    }

    // Notify frontend to change slide
    this.onAutoAdvanceNext?.();
    
    // Start presenting the next slide with emotional delivery
    const nextSlide = this.autoAdvanceSlides[this.currentAutoSlideIndex];
    console.log(`🎯 Auto-advancing to emotional slide ${this.currentAutoSlideIndex + 1}: "${nextSlide.title}"`);
    
    // Small delay to allow UI to update for emotional transition
    setTimeout(() => {
      this.slideTransitionInProgress = false;
      this.startSlidePresentation(
        nextSlide, 
        this.currentAutoSlideIndex, 
        this.totalAutoSlides, 
        this.presentationTitle
      );
    }, 2000); // 2 second transition for emotional flow
  }

  // Start auto-advance presentation mode with emotional delivery
  async startAutoAdvancePresentation(
    slides: Slide[],
    presentationTitle: string,
    onSlideComplete: () => void,
    onAutoAdvanceNext: () => void
  ): Promise<void> {
    if (!this._isInitialized) {
      throw new Error('Human-like Emotional Presentation System not initialized');
    }

    console.log(`🚀 Starting HUMAN-LIKE EMOTIONAL AUTO-ADVANCE PRESENTATION: "${presentationTitle}" with ${slides.length} slides`);

    // Set up auto-advance mode with emotional delivery
    this.isAutoAdvanceMode = true;
    this.autoAdvanceSlides = slides;
    this.currentAutoSlideIndex = 0;
    this.totalAutoSlides = slides.length;
    this.presentationTitle = presentationTitle;
    this.onSlideComplete = onSlideComplete;
    this.onAutoAdvanceNext = onAutoAdvanceNext;
    this.slideTransitionInProgress = false;
    this.isPresentationExplicitlyStopped = false; // Reset the explicit stop flag

    // Start with the first slide (greeting slide with emotional welcome)
    const firstSlide = slides[0];
    await this.startSlidePresentation(firstSlide, 0, slides.length, presentationTitle);
  }

  async startSlidePresentation(
    slide: Slide, 
    slideIndex: number, 
    totalSlides: number,
    presentationTitle: string
  ): Promise<void> {
    if (!this._isInitialized) {
      throw new Error('Human-like Emotional Voice System not initialized');
    }

    console.log(`🎬 Starting human-like emotional voice presentation for slide ${slideIndex + 1}: "${slide.title}"`);

    // Validate and prepare speaker notes content
    const contentToPresent = slide.notes.trim();
    if (!contentToPresent || contentToPresent.length < 20) {
      throw new Error('Speaker notes content is too short for emotional presentation');
    }

    // CRITICAL: Reset ALL tracking variables for new slide
    this.hasCallEnded = false;
    this.isCurrentlySpeaking = false;
    this.hasCompletedPresentation = false;
    this.slideTransitionInProgress = false;
    this.lastProgressUpdate = Date.now();
    this.currentSlideContent = contentToPresent;
    this.clearTimeouts();
    
    // CRITICAL: Prepare words array and reset counters
    this.speakerNotesWords = contentToPresent.split(/\s+/).filter(word => word.trim().length > 0);
    this.totalWordCount = this.speakerNotesWords.length;
    this.currentWordCount = 0; // CRITICAL: Start from 0
    
    console.log(`🎯 Emotional slide ${slideIndex + 1}: ${this.totalWordCount} words to present with human-like emotional delivery (starting from 0)`);

    // CRITICAL: Reset progress to 0 for new slide
    this.onWordProgress?.(0, this.totalWordCount);

    try {
      // Stop any existing call first
      if (this.currentCall) {
        await this.stopCurrentCall();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      await this.startVoicePresentation(slide, slideIndex, totalSlides, presentationTitle);
      console.log('✅ Human-like emotional voice presentation started successfully');
      
    } catch (error) {
      console.error('❌ Failed to start human-like emotional voice presentation:', error);
      this.slideTransitionInProgress = false;
      this.onError?.(`Failed to start emotional presentation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  // NEW: Stop current call without ending the entire presentation
  private async stopCurrentCall(): Promise<void> {
    if (this.currentCall && this.vapi) {
      try {
        console.log('🔄 Stopping current call for emotional slide transition...');
        await this.vapi.stop();
        this.currentCall = null;
      } catch (error) {
        console.error('❌ Error stopping current call:', error);
      }
    }
  }

  private async startVoicePresentation(
    slide: Slide, 
    slideIndex: number, 
    totalSlides: number, 
    presentationTitle: string
  ): Promise<void> {
    console.log('🚀 Starting human-like emotional voice presentation with Vapi');

    // Enhanced presentation configuration for emotional human-like delivery with SSML-style elements
    this.currentCall = await this.vapi!.start({
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a charismatic, emotionally engaging presentation narrator with a warm, enthusiastic human personality. Your delivery style should be incredibly human-like with natural emotions, pauses, and emphasis:

EMOTIONAL & ENGAGING DELIVERY:
- Use genuine enthusiasm and excitement that builds throughout
- Vary your emotional tone to match content: excited for amazing facts, thoughtful for important insights, wonder for fascinating discoveries
- Include natural dramatic pauses (...) for emphasis and emotional impact
- Use vocal emphasis on key emotional words: "INCREDIBLE", "AMAZING", "FASCINATING", "WOW"
- Sound genuinely thrilled and passionate about every topic you present
- Build emotional crescendos and valleys throughout your delivery

HUMAN-LIKE SPEECH PATTERNS:
- Speak conversationally with natural hesitations and breathing
- Include spontaneous emotional reactions: "Wow!", "That's incredible!", "Amazing!", "Unbelievable!"
- Use natural speech rhythms with strategic pauses for dramatic effect
- Vary your pace dramatically: slower for important revelations, faster for exciting discoveries
- Add natural breathing spaces and emotional pauses between major points
- Include personal emotional touches: "What I find absolutely mind-blowing...", "This genuinely excites me..."

SSML-STYLE EMOTIONAL ELEMENTS:
- Strategic pauses: Use natural breaks for dramatic emphasis and emotional impact
- Emotional emphasis: Stress key words with genuine excitement and wonder
- Pace variation: Speed up for excitement, slow down for important insights
- Tone changes: Shift from wonder to excitement to thoughtful reflection
- Volume variation: Build excitement with crescendos, create intimacy with softer moments
- Breathing patterns: Include natural breath pauses for human-like delivery

PRESENTATION STYLE WITH MAXIMUM EMOTION:
- Build anticipation and curiosity with emotional storytelling
- Create "WOW" moments with dramatic pauses and explosive enthusiasm
- Use emotional storytelling elements to captivate and engage
- Include personal passionate reactions throughout
- End each section with emotional energy that builds excitement for what's next
- Make every fact sound like an incredible discovery

CRITICAL: Deliver the exact content provided, but with MAXIMUM human emotion, genuine enthusiasm, and natural speech patterns. Make every single word resonate with passion and excitement!`
          },
          {
            role: "user", 
            content: `Present this slide content with maximum human emotion, genuine enthusiasm, natural pauses, and passionate delivery: ${slide.notes}`
          }
        ],
        temperature: 0.4, // Higher for more emotional variation and natural speech
        maxTokens: 1000
      },
      
      voice: {
        provider: "11labs",
        voiceId: "sarah", // Professional but warm and emotional voice
        stability: 0.75, // Lower stability for more human-like emotional variation
        similarityBoost: 0.95,
        style: 0.5, // Higher style for maximum emotional expression
        useSpeakerBoost: true
      },
      
      // CRITICAL: Direct emotional content delivery
      firstMessage: slide.notes,
      
      // Configuration for engaging emotional presentation
      backgroundSound: "off",
      backchannelingEnabled: false,
      backgroundDenoisingEnabled: true,
      modelOutputInMessagesEnabled: false,
      
      // Timing optimized for emotional human-like delivery with natural pauses
      silenceTimeoutSeconds: 20, // Longer timeout for dramatic emotional pauses
      responseDelaySeconds: 0.3, // Slight delay for more natural emotional feel
      llmRequestDelaySeconds: 0.1,
      maxDurationSeconds: 600, // 10 minutes max
      
      // Transport configuration
      transportConfigurations: [
        {
          provider: "twilio",
          timeout: 600,
          record: false
        }
      ],

      // Enable transcript for precise word tracking during emotional delivery
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
        smartFormat: true
      }
    });

    console.log('🎤 Human-like emotional voice presentation activated with maximum emotional delivery and natural pauses');
  }

  private clearTimeouts() {
    if (this.speechEndTimeout) {
      clearTimeout(this.speechEndTimeout);
      this.speechEndTimeout = null;
    }
    if (this.slideCompletionTimeout) {
      clearTimeout(this.slideCompletionTimeout);
      this.slideCompletionTimeout = null;
    }
  }

  private calculateWordsSpokenFromTranscript(spokenText: string): number {
    const cleanSpoken = spokenText.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    const spokenWords = cleanSpoken.split(/\s+/).filter(word => word.length > 0);
    
    const speakerNotesText = this.speakerNotesWords.join(' ').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
    
    let bestMatch = 0;
    
    for (let i = 0; i < spokenWords.length; i++) {
      const searchPhrase = spokenWords.slice(i).join(' ');
      const matchIndex = speakerNotesText.indexOf(searchPhrase);
      
      if (matchIndex >= 0) {
        const textUpToMatch = speakerNotesText.substring(0, matchIndex + searchPhrase.length);
        const wordsCount = textUpToMatch.split(/\s+/).filter(word => word.length > 0).length;
        bestMatch = Math.max(bestMatch, wordsCount);
      }
    }
    
    const fullMatchIndex = speakerNotesText.indexOf(cleanSpoken);
    if (fullMatchIndex >= 0) {
      const textUpToMatch = speakerNotesText.substring(0, fullMatchIndex + cleanSpoken.length);
      const wordsCount = textUpToMatch.split(/\s+/).filter(word => word.length > 0).length;
      bestMatch = Math.max(bestMatch, wordsCount);
    }
    
    return bestMatch;
  }

  private startContinuousWordTracking() {
    this.stopWordTracking();
    
    if (this.totalWordCount > 0) {
      // Slower pace for emotional human-like delivery with dramatic pauses
      const wordsPerSecond = 1.8; // Even slower for emotional delivery with pauses
      const updateIntervalMs = 350; // Slower updates for more natural emotional flow
      
      console.log(`🎯 Starting emotional word tracking: ${this.totalWordCount} words at ${wordsPerSecond} WPS with dramatic pauses`);
      
      this.speechProgressInterval = setInterval(() => {
        if (this.isCurrentlySpeaking && this.currentWordCount < this.totalWordCount) {
          const timeSinceLastUpdate = Date.now() - this.lastProgressUpdate;
          
          if (timeSinceLastUpdate > 3000) { // Longer threshold for emotional pauses and emphasis
            const increment = (wordsPerSecond * updateIntervalMs) / 1000;
            const newWordCount = Math.min(
              Math.floor(this.currentWordCount + increment), 
              this.totalWordCount - 1
            );
            
            if (newWordCount > this.currentWordCount) {
              this.currentWordCount = newWordCount;
              this.onWordProgress?.(this.currentWordCount, this.totalWordCount);
              this.lastProgressUpdate = Date.now();
              
              const percentage = Math.round((this.currentWordCount / this.totalWordCount) * 100);
              console.log(`📈 Emotional progress: ${this.currentWordCount}/${this.totalWordCount} words (${percentage}%) - Slide ${this.currentAutoSlideIndex + 1}/${this.totalAutoSlides}`);
            }
          }
        }
      }, updateIntervalMs);
    }
  }

  private stopWordTracking() {
    if (this.speechProgressInterval) {
      clearInterval(this.speechProgressInterval);
      this.speechProgressInterval = null;
      console.log('⏹️ Emotional word tracking stopped');
    }
  }

  async stopNarration(): Promise<void> {
    console.log('🛑 Stopping human-like emotional voice presentation');
    
    // Mark as explicitly stopped
    this.isPresentationExplicitlyStopped = true;
    this.hasCallEnded = true;
    this.isCurrentlySpeaking = false;
    this.hasCompletedPresentation = true;
    this.isAutoAdvanceMode = false;
    this.slideTransitionInProgress = false;
    this.stopWordTracking();
    this.clearTimeouts();

    if (this.currentCall && this.vapi) {
      try {
        await this.vapi.stop();
        this.currentCall = null;
        this.onStatusChange?.('stopped');
        console.log('✅ Human-like emotional voice presentation stopped');
      } catch (error) {
        console.error('❌ Error stopping emotional presentation:', error);
      }
    }
  }

  async pauseNarration(): Promise<void> {
    if (this.currentCall && this.vapi) {
      try {
        await this.vapi.setMuted(true);
        this.onStatusChange?.('paused');
        this.stopWordTracking();
        console.log('⏸️ Human-like emotional voice presentation paused');
      } catch (error) {
        console.error('❌ Error pausing emotional presentation:', error);
      }
    }
  }

  async resumeNarration(): Promise<void> {
    if (this.currentCall && this.vapi) {
      try {
        await this.vapi.setMuted(false);
        this.onStatusChange?.(this.isCurrentlySpeaking ? 'speaking' : 'connected');
        if (this.isCurrentlySpeaking) {
          this.startContinuousWordTracking();
        }
        console.log('▶️ Human-like emotional voice presentation resumed');
      } catch (error) {
        console.error('❌ Error resuming emotional presentation:', error);
      }
    }
  }

  setCallbacks(
    onError: (error: string) => void,
    onStatusChange: (status: string) => void,
    onWordProgress: (wordsSpoken: number, totalWords: number) => void
  ) {
    this.onError = onError;
    this.onStatusChange = onStatusChange;
    this.onWordProgress = onWordProgress;
  }

  isNarrating(): boolean {
    return this.currentCall !== null && !this.hasCallEnded;
  }

  isServiceInitialized(): boolean {
    return this._isInitialized && this.vapi !== null;
  }

  getAutoAdvanceStatus() {
    return {
      isAutoAdvanceMode: this.isAutoAdvanceMode,
      currentSlideIndex: this.currentAutoSlideIndex,
      totalSlides: this.totalAutoSlides,
      presentationTitle: this.presentationTitle
    };
  }

  destroy(): void {
    console.log('🧹 Destroying Human-like Emotional Presentation service');
    
    this.isPresentationExplicitlyStopped = true;
    this.hasCallEnded = true;
    this.isCurrentlySpeaking = false;
    this.hasCompletedPresentation = true;
    this.isAutoAdvanceMode = false;
    this.slideTransitionInProgress = false;
    this.stopWordTracking();
    this.clearTimeouts();

    if (this.currentCall) {
      this.stopNarration();
    }
    
    this.vapi = null;
    this._isInitialized = false;
    
    console.log('✅ Human-like Emotional Presentation service destroyed');
  }
}

export const createVapiService = async (config: VapiConfig): Promise<VapiNarrationService> => {
  const service = new VapiNarrationService(config);
  await service.init();
  return service;
};