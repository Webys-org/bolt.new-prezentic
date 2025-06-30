export interface Slide {
  id: string;
  title: string;
  content: string[];
  notes: string;
  imageUrl?: string;
  // Text styles for the slide
  textStyles?: {
    title?: {
      fontSize?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p';
      textAlign?: 'left' | 'center' | 'right';
      textColor?: string;
      backgroundColor?: string;
      fontWeight?: 'normal' | 'bold';
      fontStyle?: 'normal' | 'italic';
      textDecoration?: 'none' | 'underline';
      animation?: 'none' | 'fadeIn' | 'slideIn' | 'bounce';
    };
    content?: {
      fontSize?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p';
      textAlign?: 'left' | 'center' | 'right';
      textColor?: string;
      backgroundColor?: string;
      fontWeight?: 'normal' | 'bold';
      fontStyle?: 'normal' | 'italic';
      textDecoration?: 'none' | 'underline';
      animation?: 'none' | 'fadeIn' | 'slideIn' | 'bounce';
    };
  };
  // Legacy slide style
  slideStyle?: SlideStyle;
}

export interface SlideStyle {
  template: 'modern' | 'minimal' | 'corporate' | 'hero' | 'split' | 'overlay' | 'magazine' | 'timeline' | 'comparison' | 'showcase';
  background: {
    type: 'gradient' | 'solid' | 'image' | 'pattern';
    primary: string;
    secondary?: string;
    imageUrl?: string;
    opacity: number;
  };
  typography: {
    titleFont: 'inter' | 'playfair' | 'roboto' | 'montserrat' | 'poppins';
    contentFont: 'inter' | 'roboto' | 'open-sans' | 'lato';
    titleSize: 'small' | 'medium' | 'large' | 'xl';
    contentSize: 'small' | 'medium' | 'large';
    titleColor: string;
    contentColor: string;
  };
  layout: {
    contentAlignment: 'left' | 'center' | 'right';
    imagePosition: 'left' | 'right' | 'top' | 'bottom' | 'background' | 'overlay';
    spacing: 'compact' | 'normal' | 'spacious';
    padding: 'small' | 'medium' | 'large';
  };
  effects: {
    shadow: 'none' | 'subtle' | 'medium' | 'strong';
    borderRadius: number;
    animation: 'none' | 'fade' | 'slide' | 'zoom' | 'bounce';
    overlay: {
      enabled: boolean;
      color: string;
      opacity: number;
      blend: 'normal' | 'multiply' | 'overlay' | 'screen';
    };
  };
}

export interface Presentation {
  title: string;
  slides: Slide[];
}

export interface APIKeyConfig {
  gemini: string;
  vapi: string;
}

export interface NarrationStatus {
  isNarrating: boolean;
  isPaused: boolean;
  currentSlide: number;
  status: 'idle' | 'connected' | 'speaking' | 'listening' | 'paused' | 'stopped' | 'error';
  error?: string;
}

export type PresentationCreationType = 'ai' | 'manual' | 'blank';

export interface PresentationTemplate {
  id: string;
  name: string;
  description: string;
  slideCount: number;
  type: 'business' | 'educational' | 'creative' | 'minimal';
  slides: Omit<Slide, 'id'>[];
}