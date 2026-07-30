const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally', 'sort of', 'kind of', 'i mean', 'right', 'so yeah'];

export function countFillerWords(text: string): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) count += matches.length;
  }
  return count;
}

export function calculateWPM(text: string, durationSeconds: number): number {
  if (!text || durationSeconds <= 0) return 0;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = durationSeconds / 60;
  return Math.round(wordCount / minutes);
}

export function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
