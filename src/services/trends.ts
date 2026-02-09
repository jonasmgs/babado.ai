export interface TrendingTopic {
  id: string;
  topic: string;
  popularityScore: number;
  growthRate: number;
  platform: 'tiktok' | 'instagram' | 'twitter' | 'youtube';
  sentiment: 'positive' | 'neutral' | 'negative';
  suggestedHooks: string[];
}

/**
 * Get current trending topics
 */
export async function getTrendingTopics(): Promise<TrendingTopic[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    {
      id: '1',
      topic: 'AI Storytelling 2026',
      popularityScore: 98,
      growthRate: 15,
      platform: 'tiktok',
      sentiment: 'positive',
      suggestedHooks: [
        'How AI is changing stories forever...',
        'The secret to viral stories in 2026',
      ],
    },
    {
      id: '2',
      topic: 'Urban Legends of Brazil',
      popularityScore: 85,
      growthRate: 20,
      platform: 'youtube',
      sentiment: 'neutral',
      suggestedHooks: [
        'You won’t believe what happened in this town...',
        'The dark truth behind the legend',
      ],
    },
    {
      id: '3',
      topic: 'Crypto Mysteries',
      popularityScore: 72,
      growthRate: -5,
      platform: 'twitter',
      sentiment: 'negative',
      suggestedHooks: [
        'The biggest heist in history?',
        'Who is behind the latest crash?',
      ],
    },
  ];
}

/**
 * Generate story idea from a topic
 */
export async function generateIdeaFromTopic(topic: string): Promise<string> {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return `A suspenseful story about ${topic} that involves a secret organization and a major plot twist at the end.`;
}

/**
 * Analyze viral potential of a draft
 */
export async function analyzeViralPotential(content: string) {
  // Mock analysis
  return {
    score: Math.floor(Math.random() * 40) + 60,
    trendsAlignment: 'High',
    topKeywords: ['mystery', 'secret', 'viral'],
    recommendation: 'Add more suspenseful elements in the middle section.',
  };
}
