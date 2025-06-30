// This service is now deprecated in favor of real VAPI AI voice synthesis
// Keeping minimal implementation for backward compatibility

export interface TTSProgressCallback {
  (wordsSpoken: number, totalWords: number, currentWord?: string): void;
}

export interface TTSCompletionCallback {
  (): void;
}

export interface TTSErrorCallback {
  (error: string): void;
}

export class CustomTTSService {
  private isConnected = false;

  constructor() {
    console.log('⚠️ CustomTTSService is deprecated - using real VAPI AI voice instead');
  }

  async startNarration(
    text: string,
    onProgress: TTSProgressCallback,
    onComplete: TTSCompletionCallback,
    onError: TTSErrorCallback
  ): Promise<string> {
    console.log('⚠️ CustomTTSService.startNarration called - redirecting to VAPI AI');
    onError('Custom TTS is deprecated - please use VAPI AI voice synthesis');
    return 'deprecated';
  }

  stopNarration() {
    console.log('⚠️ CustomTTSService.stopNarration called - no action needed');
  }

  isServiceReady(): boolean {
    return false; // Always return false to force VAPI usage
  }

  destroy() {
    console.log('🧹 CustomTTSService destroyed (deprecated)');
  }
}

// Export singleton instance for backward compatibility
export const customTTSService = new CustomTTSService();