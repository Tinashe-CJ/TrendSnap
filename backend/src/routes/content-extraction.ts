import express from 'express';
import { logger } from '../utils/logger';

const router = express.Router();

// Extract content from URL
router.post('/extract-url', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format'
      });
    }

    logger.info(`Extracting content from URL: ${url}`);

    // Simulate content extraction (in real implementation, this would use a web scraping service)
    // For now, we'll return mock extracted content based on the URL
    const mockExtractedContent = await simulateUrlExtraction(url);

    return res.json({
      success: true,
      data: mockExtractedContent
    });

  } catch (error) {
    logger.error('URL extraction error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to extract content from URL'
    });
  }
});

// Extract content from text/script
router.post('/extract-text', async (req, res) => {
  try {
    const { text, type = 'script' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Text content is required'
      });
    }

    logger.info(`Processing text content, type: ${type}`);

    // Simulate text processing
    const processedContent = await simulateTextProcessing(text, type);

    return res.json({
      success: true,
      data: processedContent
    });

  } catch (error) {
    logger.error('Text extraction error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process text content'
    });
  }
});

// Validate input content
router.post('/validate', async (req, res) => {
  try {
    const { content, type = 'script', tier = 'free' } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    const validation = await validateContent(content, type, tier);

    return res.json({
      success: true,
      data: validation
    });

  } catch (error) {
    logger.error('Content validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to validate content'
    });
  }
});

// Helper function to simulate URL extraction
async function simulateUrlExtraction(url: string) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const urlLower = url.toLowerCase();
  
  // Return different mock content based on URL patterns
  if (urlLower.includes('news') || urlLower.includes('article')) {
    return {
      title: 'Breaking News: AI Technology Breakthrough',
      content: 'Scientists have made a groundbreaking discovery in artificial intelligence that could revolutionize how we interact with technology. The new AI system demonstrates unprecedented capabilities in natural language processing and creative content generation. This breakthrough opens up exciting possibilities for the future of automation and human-computer interaction.',
      summary: 'AI breakthrough with revolutionary capabilities',
      keywords: ['AI', 'technology', 'breakthrough', 'innovation'],
      wordCount: 45
    };
  } else if (urlLower.includes('blog') || urlLower.includes('post')) {
    return {
      title: '10 Life-Changing Productivity Tips',
      content: 'Discover the most effective productivity strategies that successful people use every day. From time management techniques to workspace optimization, these proven methods will help you achieve more in less time. Learn how to prioritize tasks, eliminate distractions, and build sustainable habits that lead to long-term success.',
      summary: 'Essential productivity strategies for success',
      keywords: ['productivity', 'tips', 'success', 'habits'],
      wordCount: 52
    };
  } else if (urlLower.includes('tutorial') || urlLower.includes('guide')) {
    return {
      title: 'Complete Guide to Video Editing',
      content: 'Master the art of video editing with this comprehensive guide. Learn essential techniques, software recommendations, and professional workflows. From basic cuts to advanced effects, this tutorial covers everything you need to create stunning videos that captivate your audience.',
      summary: 'Comprehensive video editing tutorial',
      keywords: ['video editing', 'tutorial', 'guide', 'filmmaking'],
      wordCount: 38
    };
  } else {
    // Generic content for other URLs
    return {
      title: 'Interesting Content from Web',
      content: 'This webpage contains valuable information that can be transformed into engaging video content. The material covers important topics that are relevant to current trends and audience interests. Perfect for creating viral social media content that resonates with viewers.',
      summary: 'Web content ready for video transformation',
      keywords: ['content', 'web', 'information', 'trends'],
      wordCount: 42
    };
  }
}

// Helper function to simulate text processing
async function simulateTextProcessing(text: string, type: string) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const wordCount = text.split(' ').length;
  
  return {
    processedText: text,
    wordCount,
    estimatedVideoLength: Math.max(10, Math.min(60, wordCount * 0.5)), // Rough estimate
    suggestedTemplates: getSuggestedTemplates(text, type),
    contentAnalysis: {
      tone: analyzeTone(text),
      complexity: analyzeComplexity(text),
      keywords: extractKeywords(text)
    }
  };
}

// Helper function to validate content
async function validateContent(content: string, type: string, tier: string) {
  const issues = [];
  const warnings = [];

  // Check content length
  if (content.length < 10) {
    issues.push('Content is too short (minimum 10 characters)');
  }

  if (tier === 'free' && content.length > 500) {
    issues.push('Free tier is limited to 500 characters');
  }

  // Check for inappropriate content (basic check)
  const inappropriateWords = ['spam', 'scam', 'inappropriate'];
  const contentLower = content.toLowerCase();
  
  for (const word of inappropriateWords) {
    if (contentLower.includes(word)) {
      warnings.push(`Content may contain inappropriate language`);
      break;
    }
  }

  // Check for excessive repetition
  const words = content.split(' ');
  const wordFrequency: { [key: string]: number } = {};
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
    if (cleanWord.length > 3) {
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
    }
  });

  const maxFrequency = Math.max(...Object.values(wordFrequency));
  if (maxFrequency > words.length * 0.1) {
    warnings.push('Content may have excessive word repetition');
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    wordCount: words.length,
    characterCount: content.length
  };
}

// Helper function to get suggested templates based on content
function getSuggestedTemplates(text: string, type: string) {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('news') || textLower.includes('breaking')) {
    return ['trending', 'professional'];
  } else if (textLower.includes('tutorial') || textLower.includes('guide')) {
    return ['minimal', 'professional'];
  } else if (textLower.includes('funny') || textLower.includes('humor')) {
    return ['dynamic', 'trending'];
  } else {
    return ['trending', 'minimal', 'dynamic'];
  }
}

// Helper function to analyze tone
function analyzeTone(text: string) {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('!') || textLower.includes('amazing') || textLower.includes('incredible')) {
    return 'energetic';
  } else if (textLower.includes('professional') || textLower.includes('business')) {
    return 'professional';
  } else if (textLower.includes('funny') || textLower.includes('humor')) {
    return 'casual';
  } else {
    return 'neutral';
  }
}

// Helper function to analyze complexity
function analyzeComplexity(text: string) {
  const words = text.split(' ');
  const longWords = words.filter(word => word.length > 8).length;
  const complexity = longWords / words.length;
  
  if (complexity > 0.2) return 'high';
  if (complexity > 0.1) return 'medium';
  return 'low';
}

// Helper function to extract keywords
function extractKeywords(text: string) {
  const words = text.toLowerCase().split(' ');
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const keywords = words.filter(word => 
    word.length > 3 && 
    !stopWords.includes(word) && 
    !word.match(/^[0-9]+$/)
  );
  
  // Return unique keywords, limited to 10
  return [...new Set(keywords)].slice(0, 10);
}

export default router; 