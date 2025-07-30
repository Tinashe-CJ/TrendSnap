"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
router.post('/extract-url', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL is required'
            });
        }
        try {
            new URL(url);
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                error: 'Invalid URL format'
            });
        }
        logger_1.logger.info(`Extracting content from URL: ${url}`);
        const mockExtractedContent = await simulateUrlExtraction(url);
        return res.json({
            success: true,
            data: mockExtractedContent
        });
    }
    catch (error) {
        logger_1.logger.error('URL extraction error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to extract content from URL'
        });
    }
});
router.post('/extract-text', async (req, res) => {
    try {
        const { text, type = 'script' } = req.body;
        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text content is required'
            });
        }
        logger_1.logger.info(`Processing text content, type: ${type}`);
        const processedContent = await simulateTextProcessing(text, type);
        return res.json({
            success: true,
            data: processedContent
        });
    }
    catch (error) {
        logger_1.logger.error('Text extraction error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to process text content'
        });
    }
});
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
    }
    catch (error) {
        logger_1.logger.error('Content validation error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to validate content'
        });
    }
});
async function simulateUrlExtraction(url) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const urlLower = url.toLowerCase();
    if (urlLower.includes('news') || urlLower.includes('article')) {
        return {
            title: 'Breaking News: AI Technology Breakthrough',
            content: 'Scientists have made a groundbreaking discovery in artificial intelligence that could revolutionize how we interact with technology. The new AI system demonstrates unprecedented capabilities in natural language processing and creative content generation. This breakthrough opens up exciting possibilities for the future of automation and human-computer interaction.',
            summary: 'AI breakthrough with revolutionary capabilities',
            keywords: ['AI', 'technology', 'breakthrough', 'innovation'],
            wordCount: 45
        };
    }
    else if (urlLower.includes('blog') || urlLower.includes('post')) {
        return {
            title: '10 Life-Changing Productivity Tips',
            content: 'Discover the most effective productivity strategies that successful people use every day. From time management techniques to workspace optimization, these proven methods will help you achieve more in less time. Learn how to prioritize tasks, eliminate distractions, and build sustainable habits that lead to long-term success.',
            summary: 'Essential productivity strategies for success',
            keywords: ['productivity', 'tips', 'success', 'habits'],
            wordCount: 52
        };
    }
    else if (urlLower.includes('tutorial') || urlLower.includes('guide')) {
        return {
            title: 'Complete Guide to Video Editing',
            content: 'Master the art of video editing with this comprehensive guide. Learn essential techniques, software recommendations, and professional workflows. From basic cuts to advanced effects, this tutorial covers everything you need to create stunning videos that captivate your audience.',
            summary: 'Comprehensive video editing tutorial',
            keywords: ['video editing', 'tutorial', 'guide', 'filmmaking'],
            wordCount: 38
        };
    }
    else {
        return {
            title: 'Interesting Content from Web',
            content: 'This webpage contains valuable information that can be transformed into engaging video content. The material covers important topics that are relevant to current trends and audience interests. Perfect for creating viral social media content that resonates with viewers.',
            summary: 'Web content ready for video transformation',
            keywords: ['content', 'web', 'information', 'trends'],
            wordCount: 42
        };
    }
}
async function simulateTextProcessing(text, type) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const wordCount = text.split(' ').length;
    return {
        processedText: text,
        wordCount,
        estimatedVideoLength: Math.max(10, Math.min(60, wordCount * 0.5)),
        suggestedTemplates: getSuggestedTemplates(text, type),
        contentAnalysis: {
            tone: analyzeTone(text),
            complexity: analyzeComplexity(text),
            keywords: extractKeywords(text)
        }
    };
}
async function validateContent(content, type, tier) {
    const issues = [];
    const warnings = [];
    if (content.length < 10) {
        issues.push('Content is too short (minimum 10 characters)');
    }
    if (tier === 'free' && content.length > 500) {
        issues.push('Free tier is limited to 500 characters');
    }
    const inappropriateWords = ['spam', 'scam', 'inappropriate'];
    const contentLower = content.toLowerCase();
    for (const word of inappropriateWords) {
        if (contentLower.includes(word)) {
            warnings.push(`Content may contain inappropriate language`);
            break;
        }
    }
    const words = content.split(' ');
    const wordFrequency = {};
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
function getSuggestedTemplates(text, type) {
    const textLower = text.toLowerCase();
    if (textLower.includes('news') || textLower.includes('breaking')) {
        return ['trending', 'professional'];
    }
    else if (textLower.includes('tutorial') || textLower.includes('guide')) {
        return ['minimal', 'professional'];
    }
    else if (textLower.includes('funny') || textLower.includes('humor')) {
        return ['dynamic', 'trending'];
    }
    else {
        return ['trending', 'minimal', 'dynamic'];
    }
}
function analyzeTone(text) {
    const textLower = text.toLowerCase();
    if (textLower.includes('!') || textLower.includes('amazing') || textLower.includes('incredible')) {
        return 'energetic';
    }
    else if (textLower.includes('professional') || textLower.includes('business')) {
        return 'professional';
    }
    else if (textLower.includes('funny') || textLower.includes('humor')) {
        return 'casual';
    }
    else {
        return 'neutral';
    }
}
function analyzeComplexity(text) {
    const words = text.split(' ');
    const longWords = words.filter(word => word.length > 8).length;
    const complexity = longWords / words.length;
    if (complexity > 0.2)
        return 'high';
    if (complexity > 0.1)
        return 'medium';
    return 'low';
}
function extractKeywords(text) {
    const words = text.toLowerCase().split(' ');
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const keywords = words.filter(word => word.length > 3 &&
        !stopWords.includes(word) &&
        !word.match(/^[0-9]+$/));
    return [...new Set(keywords)].slice(0, 10);
}
exports.default = router;
//# sourceMappingURL=content-extraction.js.map