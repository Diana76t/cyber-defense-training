import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useUserProgress } from '@/hooks/useUserProgress';
import { MOCK_LEADERBOARD, getLevelForScore, type LeaderboardEntry } from '@/data/leaderboardData';

export default function Leaderboard() {
  const { progress } = useUserProgress();

  const leaderboard = useMemo<LeaderboardEntry[]>(() => {
    const userEntry = {
      username: progress.username || 'You',
      score: progress.totalScore,
      level: getLevelForScore(progress.totalScore).name,
      quizzesCompleted: progress.quizHistory.length,
      scenariosCompleted: progress.scenarioHistory.length,
      badge: getLevelForScore(progress.totalScore).badge,
    };

    const allEntries = [...MOCK_LEADERBOARD, userEntry]
      .sort((a, b) => b.score - a.score)
      .map((entry, i) => ({ ...entry, rank: i + 1 }));

    return allEntries;
  }, [progress]);

  const userRank = leaderboard.find(e => e.username === (progress.username || 'You'))?.rank ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12 max-w-3xl">
        <div className="font-terminal text-xs text-primary mb-2">// GLOBAL RANKINGS</div>
        <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
        <p className="text-sm text-muted-foreground mb-8">Your rank: <span className="text-primary font-bold">#{userRank}</span> of {leaderboard.length}</p>

        {/* Top 3 */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {leaderboard.slice(0, 3).map((entry, i) => {
            const isUser = entry.username === (progress.username || 'You');
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
            return (
              <motion.div key={entry.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`cyber-card rounded-lg p-4 text-center ${isUser ? 'glow-primary border-primary/50' : ''} ${i === 0 ? 'row-span-1' : ''}`}>
                <div className="text-2xl mb-1">{medal}</div>
                <div className={`text-xs font-bold mb-1 truncate ${isUser ? 'text-primary' : 'text-foreground'}`}>{entry.username}</div>
                <div className="text-lg font-display font-bold text-primary">{entry.score.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">{entry.level}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Full Table */}
        <div className="cyber-card rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-bold text-muted-foreground px-4 py-2">#</th>
                <th className="text-left text-[10px] font-bold text-muted-foreground px-4 py-2">OPERATOR</th>
                <th className="text-right text-[10px] font-bold text-muted-foreground px-4 py-2">SCORE</th>
                <th className="text-right text-[10px] font-bold text-muted-foreground px-4 py-2 hidden sm:table-cell">LEVEL</th>
                <th className="text-right text-[10px] font-bold text-muted-foreground px-4 py-2 hidden md:table-cell">QUIZZES</th>
                <th className="text-right text-[10px] font-bold text-muted-foreground px-4 py-2 hidden md:table-cell">SCENARIOS</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => {
                const isUser = entry.username === (progress.username || 'You');
                return (
                  <motion.tr key={entry.rank} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: entry.rank * 0.03 }}
                    className={`border-b border-border/50 ${isUser ? 'bg-primary/5' : 'hover:bg-secondary/50'} transition-colors`}>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{entry.rank}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span>{entry.badge}</span>
                        <span className={`text-xs font-bold ${isUser ? 'text-primary' : 'text-foreground'}`}>{entry.username}{isUser && ' (You)'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs font-bold text-primary">{entry.score.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right text-xs text-muted-foreground hidden sm:table-cell">{entry.level}</td>
                    <td className="px-4 py-2.5 text-right text-xs text-muted-foreground hidden md:table-cell">{entry.quizzesCompleted}</td>
                    <td className="px-4 py-2.5 text-right text-xs text-muted-foreground hidden md:table-cell">{entry.scenariosCompleted}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
