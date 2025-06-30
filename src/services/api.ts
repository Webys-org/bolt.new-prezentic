import { Presentation, Slide } from '../types/presentation';

// Detect if we're in production (deployed) or development
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = isProduction ? '' : 'http://localhost:3001/api';

export const presentationAPI = {
  generate: async (topic: string, apiKey: string): Promise<Presentation> => {
    if (isProduction) {
      // In production, call Gemini API directly from the client
      return await generatePresentationDirect(topic, apiKey);
    }

    // In development, use the local server
    const response = await fetch(`${API_BASE_URL}/generate-presentation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, apiKey }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate presentation');
    }

    return response.json();
  },

  generateImage: async (slide: Slide, apiKey: string): Promise<{ imageUrl: string | null }> => {
    if (isProduction) {
      // In production, call Gemini API directly for image generation
      return await generateImageDirect(slide, apiKey);
    }

    // In development, use the local server
    const response = await fetch(`${API_BASE_URL}/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slideTitle: slide.title,
        slideContent: slide.content,
        apiKey,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate image');
    }

    return response.json();
  },
};

// Direct API calls for production deployment
async function generatePresentationDirect(topic: string, apiKey: string): Promise<Presentation> {
  try {
    console.log(`🎯 Generating AI presentation for: "${topic}" (direct API call)`);

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create a comprehensive, professional presentation about "${topic}". 

CRITICAL REQUIREMENTS:
1. Create exactly 5-7 slides with substantial, informative content
2. First slide MUST be a warm welcome/greeting slide
3. Each slide needs detailed speaker notes (50-80 words) for human-like narration
4. Content should be educational, engaging, and topic-specific
5. Include real facts, insights, and practical information about the topic

STRUCTURE REQUIRED:
- Slide 1: Welcome/Introduction to ${topic}
- Slides 2-6: Core content covering key aspects of ${topic}
- Final slide: Conclusion/Next steps for ${topic}

For each slide, provide:
- A compelling, descriptive title
- 3-4 bullet points with substantial content (not just keywords)
- Detailed speaker notes that sound natural and engaging when spoken aloud

SPEAKER NOTES REQUIREMENTS:
- Write in a conversational, enthusiastic tone
- Include natural speech patterns and transitions
- 50-80 words per slide for proper narration timing
- Sound like a knowledgeable presenter explaining the topic
- Include emotional elements like "exciting", "fascinating", "incredible" naturally
- Use dramatic pauses indicated by ellipses (...)

Return the response in this exact JSON format:
{
  "title": "Presentation title here",
  "slides": [
    {
      "id": "slide-1",
      "title": "Slide title here",
      "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "notes": "Detailed speaker notes here with natural speech patterns..."
    }
  ]
}

Topic: ${topic}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from Gemini API');
    }

    console.log('🤖 Raw Gemini response received:', text.substring(0, 200) + '...');

    // Parse the JSON response from Gemini
    let presentationData: Presentation;
    
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const jsonText = jsonMatch[0];
      presentationData = JSON.parse(jsonText);
      
      // Validate the structure
      if (!presentationData.title || !presentationData.slides || !Array.isArray(presentationData.slides)) {
        throw new Error('Invalid presentation structure');
      }

      // Ensure each slide has proper structure
      presentationData.slides = presentationData.slides.map((slide, index) => ({
        id: slide.id || `slide-${index + 1}`,
        title: slide.title || `Slide ${index + 1}`,
        content: Array.isArray(slide.content) ? slide.content : [`Content for slide ${index + 1}`],
        notes: slide.notes || `Speaker notes for slide ${index + 1} about ${topic}.`
      }));

      console.log(`✅ Successfully generated ${presentationData.slides.length} slides with AI content`);
      console.log(`🎊 First slide: "${presentationData.slides[0].title}"`);
      
      return presentationData;
      
    } catch (parseError) {
      console.error('❌ Failed to parse Gemini response:', parseError);
      console.log('📝 Falling back to structured content generation...');
      
      // Fallback: Generate structured content if JSON parsing fails
      return generateFallbackPresentation(topic);
    }

  } catch (error) {
    console.error('❌ Error generating presentation:', error);
    
    // Ultimate fallback with topic-specific content
    return createTopicSpecificFallback(topic);
  }
}

async function generateImageDirect(slide: Slide, apiKey: string): Promise<{ imageUrl: string | null }> {
  try {
    console.log('🎨 Generating image directly with Gemini API for:', slide.title);

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create a professional presentation slide background image for: "${slide.title}".

Content context: ${Array.isArray(slide.content) ? slide.content.join(', ') : slide.content}

CRITICAL DESIGN REQUIREMENTS:
- Create a background image that will be used BEHIND text content
- The image should be subtle and not compete with text overlay
- Use muted colors, soft gradients, or abstract patterns
- Ensure there are areas with low visual complexity for text readability
- Professional corporate aesthetic with modern design elements
- Colors: Deep blues, purples, teals with subtle gradients
- Include relevant but abstract visual elements related to the topic
- 16:9 aspect ratio optimized for presentations
- The image will have a dark overlay applied, so design accordingly
- Think of this as a background texture/pattern, not a main focal image
- Avoid busy details, complex illustrations, or competing visual elements
- Create depth with subtle layering and gradient effects

Style: Corporate presentation background, similar to Microsoft PowerPoint or Apple Keynote professional templates.`
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini image API error:', errorData);
      return { imageUrl: null };
    }

    const data = await response.json();
    
    // Check for image in response
    const candidates = data.candidates;
    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
          
          // Return the image as base64 data URL
          const dataUrl = `data:${mimeType};base64,${imageData}`;
          console.log('✅ Image generated successfully with direct API call');
          return { imageUrl: dataUrl };
        }
      }
    }

    console.log('ℹ️ No image generated, using fallback');
    return { imageUrl: null };

  } catch (error) {
    console.error('❌ Error generating image with direct API:', error);
    return { imageUrl: null };
  }
}

// Fallback presentation generation
function generateFallbackPresentation(topic: string): Presentation {
  console.log(`🔄 Generating structured fallback presentation for: ${topic}`);
  
  const slides = [
    {
      id: 'slide-1',
      title: `Welcome to ${topic}! 🎉`,
      content: [
        `🎊 Warm welcome to our exploration of ${topic}`,
        `✨ Discover incredible insights and practical knowledge`,
        `🚀 Get ready for an amazing learning journey ahead!`
      ],
      notes: `Hello everyone! Welcome to this comprehensive exploration of ${topic}. Today we'll dive deep into fascinating concepts and practical applications. This journey will provide you with valuable insights and actionable knowledge about ${topic}. Let's begin this exciting adventure together!`
    },
    {
      id: 'slide-2',
      title: `Understanding ${topic} Fundamentals`,
      content: [
        `🏗️ Core principles and foundational concepts`,
        `⚡ Key components that make ${topic} powerful`,
        `💎 Essential knowledge for mastering ${topic}`
      ],
      notes: `Let's explore the fundamental concepts of ${topic}. Understanding these core principles is crucial for building a solid foundation. These key components work together to create the powerful framework that makes ${topic} so effective and valuable in today's world.`
    },
    {
      id: 'slide-3',
      title: `Key Features and Benefits of ${topic}`,
      content: [
        `🎯 Game-changing capabilities and advantages`,
        `🔥 Performance benefits and practical value`,
        `✨ Revolutionary features that transform workflows`
      ],
      notes: `The features of ${topic} are truly remarkable and game-changing. These capabilities provide significant advantages and practical value in real-world applications. The performance benefits and revolutionary features make ${topic} an essential tool for modern challenges and opportunities.`
    },
    {
      id: 'slide-4',
      title: `Real-World Applications of ${topic}`,
      content: [
        `🌟 Practical implementations in various industries`,
        `🏆 Success stories and proven results`,
        `📈 Industry adoption and measurable impact`
      ],
      notes: `Let's examine how ${topic} is being successfully implemented across various industries. These real-world applications demonstrate proven results and measurable impact. The success stories show how organizations are leveraging ${topic} to achieve remarkable outcomes and competitive advantages.`
    },
    {
      id: 'slide-5',
      title: `The Future of ${topic} and Next Steps`,
      content: [
        `🎯 Emerging trends and future developments`,
        `🛠️ Resources and tools for continued learning`,
        `🌈 Opportunities and exciting possibilities ahead`
      ],
      notes: `As we conclude our exploration of ${topic}, let's look toward the future. Emerging trends and developments promise exciting possibilities and new opportunities. With the right resources and continued learning, you can leverage ${topic} to achieve remarkable success and innovation.`
    }
  ];

  return {
    title: `Comprehensive Guide to ${topic}`,
    slides
  };
}

function createTopicSpecificFallback(topic: string): Presentation {
  console.log(`🔧 Creating topic-specific fallback for: ${topic}`);
  
  const slides = [
    {
      id: 'slide-1',
      title: `Welcome to ${topic}! 🎉`,
      content: [
        `🎊 Warm welcome to our exploration of ${topic}`,
        `✨ Discover incredible insights and practical knowledge`,
        `🚀 Get ready for an amazing learning journey ahead!`
      ],
      notes: `Hello everyone! Welcome to this comprehensive exploration of ${topic}. Today we'll dive deep into fascinating concepts and practical applications. This journey will provide you with valuable insights and actionable knowledge about ${topic}. Let's begin this exciting adventure together!`
    },
    {
      id: 'slide-2',
      title: `Understanding ${topic} Fundamentals`,
      content: [
        `🏗️ Core principles and foundational concepts`,
        `⚡ Key components that make ${topic} powerful`,
        `💎 Essential knowledge for mastering ${topic}`
      ],
      notes: `Let's explore the fundamental concepts of ${topic}. Understanding these core principles is crucial for building a solid foundation. These key components work together to create the powerful framework that makes ${topic} so effective and valuable in today's world.`
    },
    {
      id: 'slide-3',
      title: `Key Features and Benefits of ${topic}`,
      content: [
        `🎯 Game-changing capabilities and advantages`,
        `🔥 Performance benefits and practical value`,
        `✨ Revolutionary features that transform workflows`
      ],
      notes: `The features of ${topic} are truly remarkable and game-changing. These capabilities provide significant advantages and practical value in real-world applications. The performance benefits and revolutionary features make ${topic} an essential tool for modern challenges and opportunities.`
    },
    {
      id: 'slide-4',
      title: `Real-World Applications of ${topic}`,
      content: [
        `🌟 Practical implementations in various industries`,
        `🏆 Success stories and proven results`,
        `📈 Industry adoption and measurable impact`
      ],
      notes: `Let's examine how ${topic} is being successfully implemented across various industries. These real-world applications demonstrate proven results and measurable impact. The success stories show how organizations are leveraging ${topic} to achieve remarkable outcomes and competitive advantages.`
    },
    {
      id: 'slide-5',
      title: `The Future of ${topic} and Next Steps`,
      content: [
        `🎯 Emerging trends and future developments`,
        `🛠️ Resources and tools for continued learning`,
        `🌈 Opportunities and exciting possibilities ahead`
      ],
      notes: `As we conclude our exploration of ${topic}, let's look toward the future. Emerging trends and developments promise exciting possibilities and new opportunities. With the right resources and continued learning, you can leverage ${topic} to achieve remarkable success and innovation.`
    }
  ];

  return {
    title: `Comprehensive Guide to ${topic}`,
    slides
  };
}

// Text-to-Speech using Web Speech API as fallback
export const speechAPI = {
  narrate: (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error('Speech synthesis failed'));

      speechSynthesis.speak(utterance);
    });
  },

  stop: () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  },
};