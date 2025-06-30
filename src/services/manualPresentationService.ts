import { Slide, Presentation } from '../types/presentation';

export interface PresentationTemplate {
  id: string;
  name: string;
  description: string;
  slideCount: number;
  category: 'business' | 'education' | 'creative' | 'general';
  slides: Omit<Slide, 'id'>[];
}

export const presentationTemplates: PresentationTemplate[] = [
  {
    id: 'business-pitch',
    name: 'Business Pitch',
    description: 'Professional presentation for business proposals and pitches',
    slideCount: 6,
    category: 'business',
    slides: [
      {
        title: 'Welcome & Company Introduction',
        content: [
          'Company name and mission statement',
          'Brief overview of what we do',
          'Today\'s presentation agenda'
        ],
        notes: 'Welcome everyone to our presentation. Today we\'ll be sharing our company mission and providing an overview of our innovative solutions. This presentation will cover our key value propositions and exciting opportunities ahead.'
      },
      {
        title: 'Problem Statement',
        content: [
          'Current market challenges and pain points',
          'Impact on target customers and industry',
          'Why existing solutions fall short'
        ],
        notes: 'Let\'s start by examining the critical challenges facing our target market. These pain points have significant impact on businesses and customers, and current solutions simply aren\'t meeting the growing demands of today\'s market.'
      },
      {
        title: 'Our Solution',
        content: [
          'Innovative approach to solving the problem',
          'Key features and unique value proposition',
          'How we differentiate from competitors'
        ],
        notes: 'Our innovative solution directly addresses these challenges with a unique approach that sets us apart. We\'ve developed key features that provide exceptional value and differentiate us significantly from existing competitors in the market.'
      },
      {
        title: 'Market Opportunity',
        content: [
          'Total addressable market size and growth',
          'Target customer segments and demographics',
          'Market trends supporting our solution'
        ],
        notes: 'The market opportunity is substantial and growing rapidly. Our target customer segments represent significant revenue potential, and current market trends strongly support the adoption of our innovative solution.'
      },
      {
        title: 'Business Model & Strategy',
        content: [
          'Revenue streams and pricing strategy',
          'Go-to-market approach and partnerships',
          'Scalability and growth projections'
        ],
        notes: 'Our business model is designed for sustainable growth with multiple revenue streams. We have a clear go-to-market strategy with strategic partnerships that will enable rapid scalability and impressive growth projections.'
      },
      {
        title: 'Next Steps & Investment',
        content: [
          'Immediate action items and timeline',
          'Investment or partnership opportunities',
          'Contact information and follow-up'
        ],
        notes: 'Thank you for your attention. We have clear next steps and immediate action items with an aggressive timeline. We\'re excited about investment and partnership opportunities and look forward to continuing our conversation.'
      }
    ]
  },
  {
    id: 'educational-course',
    name: 'Educational Course',
    description: 'Structured presentation for training and educational content',
    slideCount: 5,
    category: 'education',
    slides: [
      {
        title: 'Course Introduction & Objectives',
        content: [
          'Course objectives and learning outcomes',
          'What students will gain from this session',
          'Prerequisites and course structure'
        ],
        notes: 'Welcome to this educational course! Today we\'ll cover important learning objectives that will provide valuable skills and knowledge. This session is designed to build upon your existing knowledge and take your understanding to the next level.'
      },
      {
        title: 'Key Concepts & Theory',
        content: [
          'Fundamental principles and core concepts',
          'Theoretical framework and background',
          'Important definitions and terminology'
        ],
        notes: 'Let\'s dive into the fundamental principles that form the foundation of our topic. Understanding these core concepts and theoretical frameworks is essential for applying this knowledge effectively in real-world situations.'
      },
      {
        title: 'Practical Examples & Case Studies',
        content: [
          'Real-world applications and case studies',
          'Step-by-step demonstrations',
          'Common scenarios and best practices'
        ],
        notes: 'Now let\'s examine practical examples that demonstrate these concepts in action. These real-world applications and case studies will help you understand how to apply this knowledge effectively in your own work and projects.'
      },
      {
        title: 'Hands-on Activity & Practice',
        content: [
          'Interactive exercise or workshop',
          'Guided practice with immediate feedback',
          'Opportunity to apply new knowledge'
        ],
        notes: 'Time for hands-on practice! This interactive exercise will give you the opportunity to apply what you\'ve learned with guided practice and immediate feedback. This is where theory meets practical application.'
      },
      {
        title: 'Summary & Next Steps',
        content: [
          'Key takeaways and main points recap',
          'Additional resources for continued learning',
          'Next steps and follow-up opportunities'
        ],
        notes: 'Let\'s recap the key takeaways from today\'s session. I\'ve provided additional resources for continued learning and next steps to help you continue developing these important skills and knowledge areas.'
      }
    ]
  },
  {
    id: 'project-update',
    name: 'Project Status Report',
    description: 'Professional status report for project management',
    slideCount: 5,
    category: 'business',
    slides: [
      {
        title: 'Project Overview & Scope',
        content: [
          'Project name, scope, and objectives',
          'Key stakeholders and team members',
          'Timeline and major milestones'
        ],
        notes: 'Welcome to our project update presentation. Today we\'ll review our project scope, objectives, and the incredible progress our team has made. Let me introduce our key stakeholders and highlight the major milestones we\'ve achieved.'
      },
      {
        title: 'Progress & Key Achievements',
        content: [
          'Completed tasks and deliverables',
          'Key accomplishments and successes',
          'Metrics and performance indicators'
        ],
        notes: 'I\'m excited to share our significant progress and achievements. Our team has completed major deliverables ahead of schedule, and our key performance indicators show exceptional results that exceed our initial projections.'
      },
      {
        title: 'Current Challenges & Risks',
        content: [
          'Obstacles and roadblocks encountered',
          'Resource constraints and dependencies',
          'Risk factors and mitigation strategies'
        ],
        notes: 'While we\'ve made excellent progress, we have encountered some challenges that require attention. I\'ll outline the obstacles we\'re facing and our comprehensive strategies for overcoming these roadblocks effectively.'
      },
      {
        title: 'Solutions & Action Plan',
        content: [
          'Action plans to address challenges',
          'Upcoming tasks and priorities',
          'Resource requirements and timeline'
        ],
        notes: 'We have clear action plans to address our current challenges with specific next steps and priorities. Our resource requirements are well-defined, and we have an aggressive timeline to keep the project on track for success.'
      },
      {
        title: 'Q&A & Discussion',
        content: [
          'Open floor for questions and feedback',
          'Discussion of concerns and suggestions',
          'Collaborative problem-solving session'
        ],
        notes: 'Thank you for your attention. Now I\'d like to open the floor for questions, feedback, and discussion. Your input is valuable for our continued success, and I welcome any concerns or suggestions you may have.'
      }
    ]
  },
  {
    id: 'creative-showcase',
    name: 'Creative Portfolio',
    description: 'Showcase presentation for creative work and projects',
    slideCount: 4,
    category: 'creative',
    slides: [
      {
        title: 'Creative Vision & Philosophy',
        content: [
          'Artistic philosophy and design approach',
          'Inspiration sources and creative process',
          'Unique style and signature elements'
        ],
        notes: 'Welcome to my creative showcase! I\'m excited to share my artistic philosophy and unique design approach. My creative process draws inspiration from diverse sources, resulting in a distinctive style with signature elements that define my work.'
      },
      {
        title: 'Featured Work & Projects',
        content: [
          'Showcase of best projects and pieces',
          'Creative techniques and methodologies',
          'Client collaborations and outcomes'
        ],
        notes: 'Let me present some of my featured work that demonstrates my creative capabilities. These projects showcase innovative techniques and methodologies, along with successful client collaborations that delivered exceptional outcomes and results.'
      },
      {
        title: 'Impact & Recognition',
        content: [
          'Measurable outcomes and success metrics',
          'Client testimonials and feedback',
          'Awards, recognition, and achievements'
        ],
        notes: 'The impact of this creative work has been remarkable, with measurable outcomes that exceed expectations. Client testimonials reflect exceptional satisfaction, and the recognition and awards received validate the quality and innovation of these projects.'
      },
      {
        title: 'Future Vision & Opportunities',
        content: [
          'Upcoming creative endeavors and goals',
          'New techniques and experimental approaches',
          'Collaboration opportunities and vision'
        ],
        notes: 'Looking ahead, I have exciting creative endeavors planned with ambitious goals. I\'m exploring new techniques and experimental approaches, and I\'m always open to collaboration opportunities that align with my creative vision and values.'
      }
    ]
  }
];

export const createBlankPresentation = (title: string, slideCount: number): Presentation => {
  const slides: Slide[] = [];
  
  for (let i = 0; i < slideCount; i++) {
    slides.push({
      id: `blank-slide-${i + 1}-${Date.now()}`,
      title: i === 0 ? `Welcome to ${title}` : `Slide ${i + 1}`,
      content: i === 0 
        ? [`Introduction to ${title}`, 'Key topics we\'ll cover today', 'Let\'s get started!']
        : ['Add your content here', 'Customize this slide', 'Include key points'],
      notes: i === 0 
        ? `Welcome everyone to this presentation about ${title}. Today we'll explore key topics and insights that will provide valuable information and actionable takeaways.`
        : `This is slide ${i + 1} of your presentation. Add your speaker notes here to guide your narration and ensure you cover all important points effectively.`
    });
  }

  return {
    title,
    slides
  };
};

export const createTemplatePresentation = (templateId: string, customTitle?: string): Presentation => {
  const template = presentationTemplates.find(t => t.id === templateId);
  
  if (!template) {
    throw new Error(`Template with id ${templateId} not found`);
  }

  const slides: Slide[] = template.slides.map((slide, index) => ({
    id: `${templateId}-slide-${index + 1}-${Date.now()}`,
    ...slide
  }));

  return {
    title: customTitle || template.name,
    slides
  };
};

export const getTemplateById = (templateId: string): PresentationTemplate | undefined => {
  return presentationTemplates.find(t => t.id === templateId);
};

export const getTemplatesByCategory = (category: PresentationTemplate['category']): PresentationTemplate[] => {
  return presentationTemplates.filter(t => t.category === category);
};