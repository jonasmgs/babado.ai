import { ViralAnalysis } from '@/types';

export function calculateViralScore(content: string, emotionalTone: string): ViralAnalysis {
  const words = content.toLowerCase().split(/\s+/);
  const wordCount = words.length;

  const viralKeywords = [
    'drama', 'scandal', 'shocking', 'unbelievable', 'insane', 'crazy',
    'never', 'forever', 'always', 'never again', 'finally', 'truth',
    'exposed', 'revealed', 'secret', 'hidden', 'incredible', 'amazing',
  ];

  const emotionalKeywords: Record<string, string[]> = {
    dramatic: ['died', 'broke', 'devastated', 'heartbroken', 'ruined', 'destroyed'],
    humorous: ['lol', 'funny', 'hilarious', 'cracked', 'jokes', 'laughed'],
    inspirational: ['achieved', 'success', 'overcome', 'believe', 'dream', 'won'],
    sarcastic: ['sure', 'yeah right', 'obviously', 'because', 'totally'],
    mysterious: ['mysterious', 'unknown', 'strange', 'weird', 'odd', 'curious'],
    nostalgic: ['remember', 'remember when', 'throwback', 'old days', 'childhood', 'back then'],
  };

  let score = 0;

  // Base score on word count (optimal: 50-150 words)
  if (wordCount >= 50 && wordCount <= 150) {
    score += 20;
  } else if (wordCount >= 30 && wordCount <= 300) {
    score += 15;
  } else if (wordCount > 300) {
    score += 10;
  }

  // Viral keywords bonus
  const viralCount = words.filter(word => viralKeywords.includes(word)).length;
  score += Math.min(viralCount * 5, 20);

  // Emotional tone keywords
  const toneKeywords = emotionalKeywords[emotionalTone] || [];
  const toneCount = words.filter(word => toneKeywords.includes(word)).length;
  score += Math.min(toneCount * 4, 15);

  // Questions and exclamations (engagement drivers)
  const hasQuestions = (content.match(/\?/g) || []).length;
  const hasExclamations = (content.match(/!/g) || []).length;
  score += Math.min((hasQuestions + hasExclamations) * 3, 15);

  // Line breaks and readability
  const lineBreaks = (content.match(/\n/g) || []).length;
  if (lineBreaks > 0) {
    score += Math.min(lineBreaks * 2, 10);
  }

  // Normalize to 0-100
  const finalScore = Math.min(Math.max(Math.round(score), 0), 100);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (viralCount > 0) {
    strengths.push('Strong viral keywords detected');
  } else {
    weaknesses.push('Could use more engaging vocabulary');
    recommendations.push('Add more dramatic or engaging words to increase impact');
  }

  if (wordCount < 50) {
    weaknesses.push('Story is too short');
    recommendations.push('Expand your story to at least 50 words for better engagement');
  } else if (wordCount > 300) {
    weaknesses.push('Story might be too long for social media');
    recommendations.push('Consider breaking the story into shorter segments');
  } else {
    strengths.push('Optimal story length for social media');
  }

  if (hasExclamations > 2) {
    strengths.push('High emotional expression');
  } else if (hasExclamations === 0) {
    recommendations.push('Add more exclamation marks to convey emotion');
  }

  if (hasQuestions > 0) {
    strengths.push('Story engages reader with questions');
  } else {
    recommendations.push('Consider using questions to engage readers');
  }

  return {
    score: finalScore,
    strengths,
    weaknesses,
    recommendations,
    estimatedReachPercentage: (finalScore / 100) * 85,
  };
}

export function generateHooks(content: string, count: number = 5): string[] {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const hooks: string[] = [];

  const patterns = [
    (text: string) => `You won't believe what happened next... ${text.substring(0, 60)}...`,
    (text: string) => `Wait for it... ${text.substring(0, 50)}`,
    (text: string) => `This is absolutely insane: ${text.substring(0, 55)}...`,
    (text: string) => `Plot twist: ${text.substring(0, 60)}`,
    (text: string) => `The truth is... ${text.substring(0, 60)}`,
    (text: string) => `Never thought I'd say this, but... ${text.substring(0, 50)}`,
  ];

  for (let i = 0; i < Math.min(count, patterns.length); i++) {
    if (sentences[i]) {
      hooks.push(patterns[i](sentences[i]));
    }
  }

  return hooks.slice(0, count);
}
