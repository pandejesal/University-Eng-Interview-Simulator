export function parseTimeToSeconds(time: string): number {
  const lower = time.toLowerCase();
  if (lower.includes('minute')) {
    const match = lower.match(/\d+/);
    const minutes = match ? parseInt(match[0], 10) : 2;
    return minutes * 60;
  }
  if (lower.includes('second')) {
    const match = lower.match(/\d+/);
    return match ? parseInt(match[0], 10) : 90;
  }
  return 120;
}
