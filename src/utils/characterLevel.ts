export function getAscensionFromLevel(level: number) {
  if (level <= 20) return 0;
  if (level <= 40) return 1;
  if (level <= 50) return 2;
  if (level <= 60) return 3;
  if (level <= 70) return 4;
  if (level <= 80) return 5;
  return 6;
}

export function getLevelFromAscension(ascension: number) {
  const levels = [20, 40, 50, 60, 70, 80, 90];
  return levels[ascension] ?? 20;
}