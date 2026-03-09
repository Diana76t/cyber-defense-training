import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, BookOpen, Trophy, TrendingUp, RotateCcw, Siren } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useUserProgress } from '@/hooks/useUserProgress';
import { getLevelProgress, LEVELS } from '@/data/leaderboardData';
import { SCENARIOS } from '@/data/scenarioData';
import { INCIDENTS } from '@/data/incidentData';
import { DIFFICULTY_CONFIG, type Difficulty } from '@/data/quizData';

export default function Dashboard() {
  const { progress, level, updateUsername, resetProgress, getCompletedDifficulties, getCompletedScenarioIds, getCompletedIncidentIds, getBestScoreForDifficulty, getBestScoreForScenario, getBestScoreForIncident } = useUserProgress();
  const levelProg = getLevelProgress(progress.totalScore);
  const completedDiffs = getCompletedDifficulties();
  const completedScenarios = getCompletedScenarioIds();
  const completedIncidents = getCompletedIncidentIds();
  const nextLevel = LEVELS.find(l => l.minScore > progress.totalScore);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="font-terminal text-xs text-primary mb-1">// OPERATOR DASHBOARD</div>
            <div className="flex items-center gap-3">
              <input
                value={progress.username}
                onChange={(e) => updateUsername(e.target.value)}
                className="bg-transparent border-b border-border text-xl font-display font-bold text-foreground focus:outline-none focus:border-primary w-48"
              />
              <span className="text-lg">{level.badge}</span>
              <span className={`text-xs font-bold ${level.color}`}>{level.name}</span>
            </div>
          </div>
          <button onClick={resetProgress} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>

        {/* Score & Level */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="cyber-card rounded-lg p-6 col-span-2">
            <div className="text-xs text-muted-foreground mb-1">TOTAL SCORE</div>
            <div className="text-4xl font-display font-bold text-primary text-glow-primary mb-3">{progress.totalScore.toLocaleString()}</div>
            <div className="cyber-progress mb-2"><div className="cyber-progress-bar" style={{ width: `${levelProg}%` }} /></div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{level.badge} {level.name}</span>
              {nextLevel && <span>{nextLevel.minScore - progress.totalScore} pts to {nextLevel.name}</span>}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="cyber-card rounded-lg p-6">
            <div className="text-xs text-muted-foreground mb-3">STATS</div>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-xs text-muted-foreground">Quizzes</span><span className="text-sm font-bold text-foreground">{progress.quizHistory.length}</span></div>
              <div className="flex justify-between"><span className="text-xs text-muted-foreground">Scenarios</span><span className="text-sm font-bold text-foreground">{progress.scenarioHistory.length}</span></div>
              <div className="flex justify-between"><span className="text-xs text-muted-foreground">Incidents</span><span className="text-sm font-bold text-foreground">{(progress.incidentHistory ?? []).length}</span></div>
              <div className="flex justify-between"><span className="text-xs text-muted-foreground">Difficulties</span><span className="text-sm font-bold text-foreground">{completedDiffs.length}/3</span></div>
            </div>
          </motion.div>
        </div>

        {/* Quiz Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="cyber-card rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4"><Target className="h-4 w-4 text-primary" /><h3 className="text-sm font-bold">Quiz Progress</h3></div>
            <div className="space-y-3">
              {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(d => {
                const best = getBestScoreForDifficulty(d);
                const max = DIFFICULTY_CONFIG[d].points * 5;
                const pct = max > 0 ? Math.round((best / max) * 100) : 0;
                return (
                  <div key={d}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground capitalize">{d}</span>
                      <span className="text-foreground">{best}/{max} ({pct}%)</span>
                    </div>
                    <div className="cyber-progress"><div className="cyber-progress-bar" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
            <Link to="/quiz" className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline"><Target className="h-3 w-3" /> Take a quiz →</Link>
          </div>

          <div className="cyber-card rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4"><BookOpen className="h-4 w-4 text-primary" /><h3 className="text-sm font-bold">Scenario Progress</h3></div>
            <div className="space-y-3">
              {SCENARIOS.map(s => {
                const best = getBestScoreForScenario(s.id);
                const pct = Math.round((best / s.maxScore) * 100);
                const done = completedScenarios.includes(s.id);
                return (
                  <div key={s.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{s.title}</span>
                      <span className="text-foreground">{done ? `${best}/${s.maxScore}` : 'Not started'}</span>
                    </div>
                    <div className="cyber-progress"><div className="cyber-progress-bar" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
            <Link to="/lab" className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:underline"><BookOpen className="h-3 w-3" /> Enter Sim Lab →</Link>
          </div>

          <div className="cyber-card rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4"><Siren className="h-4 w-4 text-destructive" /><h3 className="text-sm font-bold">Incident Response Progress</h3></div>
            <div className="space-y-3">
              {INCIDENTS.map(inc => {
                const best = getBestScoreForIncident(inc.id);
                const pct = Math.round((best / inc.maxScore) * 100);
                const done = completedIncidents.includes(inc.id);
                return (
                  <div key={inc.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{inc.title}</span>
                      <span className="text-foreground">{done ? `${best}/${inc.maxScore}` : 'Not started'}</span>
                    </div>
                    <div className="cyber-progress"><div className="cyber-progress-bar" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
            <Link to="/incident" className="mt-4 inline-flex items-center gap-1 text-xs text-destructive hover:underline"><Siren className="h-3 w-3" /> Enter IR Lab →</Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="cyber-card rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4"><TrendingUp className="h-4 w-4 text-primary" /><h3 className="text-sm font-bold">Recent Activity</h3></div>
          {progress.quizHistory.length === 0 && progress.scenarioHistory.length === 0 && (progress.incidentHistory ?? []).length === 0 ? (
            <p className="text-xs text-muted-foreground">No activity yet. Start a quiz, scenario, or incident to begin tracking your progress!</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[...progress.quizHistory.map(r => ({ type: 'Quiz' as const, label: `${r.difficulty} Quiz`, score: r.score, max: r.maxScore, date: r.completedAt })),
                ...progress.scenarioHistory.map(r => ({ type: 'Scenario' as const, label: r.scenarioTitle, score: r.score, max: r.maxScore, date: r.completedAt })),
                ...(progress.incidentHistory ?? []).map(r => ({ type: 'Incident' as const, label: r.incidentTitle, score: r.score, max: r.maxScore, date: r.completedAt })),
              ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <span className={item.type === 'Quiz' ? 'text-primary' : item.type === 'Scenario' ? 'text-accent' : 'text-destructive'}>{item.type === 'Quiz' ? '◆' : item.type === 'Scenario' ? '▲' : '⚠'}</span>
                    <span className="text-foreground capitalize">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold">{item.score}/{item.max}</span>
                    <span className="text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/quiz" className="px-4 py-2 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">Quiz →</Link>
          <Link to="/lab" className="px-4 py-2 rounded bg-accent/10 border border-accent/20 text-accent text-xs font-bold hover:bg-accent/20 transition-colors">Sim Lab →</Link>
          <Link to="/incident" className="px-4 py-2 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors"><Siren className="h-3 w-3 inline mr-1" />IR Lab →</Link>
          <Link to="/leaderboard" className="px-4 py-2 rounded bg-warning/10 border border-warning/20 text-warning text-xs font-bold hover:bg-warning/20 transition-colors"><Trophy className="h-3 w-3 inline mr-1" />Leaderboard →</Link>
        </div>
      </div>
    </div>
  );
}
