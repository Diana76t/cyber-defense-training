export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  level: string;
  quizzesCompleted: number;
  scenariosCompleted: number;
  badge: string;
}

export const MOCK_LEADERBOARD: Omit<LeaderboardEntry, 'rank'>[] = [
  { username: 'darknet_guardian', score: 4850, level: 'Elite', quizzesCompleted: 15, scenariosCompleted: 5, badge: '🏆' },
  { username: 'ph1sh3r_hunt3r', score: 4200, level: 'Elite', quizzesCompleted: 15, scenariosCompleted: 5, badge: '🥇' },
  { username: 'zero_day_analyst', score: 3750, level: 'Expert', quizzesCompleted: 15, scenariosCompleted: 4, badge: '🥈' },
  { username: 'sec_hawk_2024', score: 3100, level: 'Expert', quizzesCompleted: 12, scenariosCompleted: 4, badge: '🥉' },
  { username: 'cryptoshield_99', score: 2800, level: 'Expert', quizzesCompleted: 10, scenariosCompleted: 3, badge: '🛡️' },
  { username: 'infosec_viper', score: 2350, level: 'Defender', quizzesCompleted: 10, scenariosCompleted: 3, badge: '⚡' },
  { username: 'packet_ranger', score: 1950, level: 'Defender', quizzesCompleted: 8, scenariosCompleted: 2, badge: '🔍' },
  { username: 'firewall_fox', score: 1600, level: 'Analyst', quizzesCompleted: 7, scenariosCompleted: 2, badge: '🦊' },
  { username: 'b1tsh1ft_sam', score: 1200, level: 'Analyst', quizzesCompleted: 5, scenariosCompleted: 1, badge: '💻' },
  { username: 'newbie_sec', score: 850, level: 'Recruit', quizzesCompleted: 5, scenariosCompleted: 1, badge: '🔰' },
];

export const LEVELS = [
  { name: 'Recruit', minScore: 0, maxScore: 499, badge: '🔰', color: 'text-muted-foreground' },
  { name: 'Analyst', minScore: 500, maxScore: 999, badge: '🔍', color: 'text-blue-400' },
  { name: 'Defender', minScore: 1000, maxScore: 1999, badge: '🛡️', color: 'text-accent' },
  { name: 'Expert', minScore: 2000, maxScore: 3999, badge: '⚡', color: 'text-warning' },
  { name: 'Elite', minScore: 4000, maxScore: Infinity, badge: '🏆', color: 'text-primary' },
];

export function getLevelForScore(score: number) {
  return LEVELS.findLast((l) => score >= l.minScore) ?? LEVELS[0];
}

export function getLevelProgress(score: number): number {
  const level = getLevelForScore(score);
  if (level.maxScore === Infinity) return 100;
  const range = level.maxScore - level.minScore;
  const progress = score - level.minScore;
  return Math.min(100, Math.round((progress / range) * 100));
}
