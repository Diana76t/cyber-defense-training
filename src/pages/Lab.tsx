import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertTriangle, Globe, Phone, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useUserProgress } from '@/hooks/useUserProgress';
import { SCENARIOS, SCENARIO_TYPE_CONFIG } from '@/data/scenarioData';

const ICON_MAP: Record<string, React.ElementType> = { Mail, Lock, AlertTriangle, Globe, Phone };

export default function Lab() {
  const { getBestScoreForScenario, getCompletedScenarioIds } = useUserProgress();
  const completedIds = getCompletedScenarioIds();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="font-terminal text-xs text-primary mb-2">// CYBER ATTACK SIMULATION LAB</div>
        <h1 className="text-2xl font-bold mb-2">Simulation Lab</h1>
        <p className="text-sm text-muted-foreground mb-8">Face realistic security scenarios. Make decisions. See consequences. Learn from mistakes.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCENARIOS.map((s, i) => {
            const Icon = ICON_MAP[s.icon] || AlertTriangle;
            const typeConfig = SCENARIO_TYPE_CONFIG[s.type];
            const completed = completedIds.includes(s.id);
            const bestScore = getBestScoreForScenario(s.id);
            const pct = Math.round((bestScore / s.maxScore) * 100);

            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/lab/${s.id}`} className="cyber-card rounded-lg p-6 block hover:glow-primary transition-shadow group">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded ${typeConfig.bgColor}`}>
                      <Icon className={`h-5 w-5 ${typeConfig.color}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${s.difficulty === 'beginner' ? 'bg-accent/10 text-accent' : s.difficulty === 'intermediate' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>
                        {s.difficulty.toUpperCase()}
                      </span>
                      {completed && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent/10 text-accent">✓ DONE</span>}
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{s.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      <span className={typeConfig.color}>{typeConfig.label}</span> · {s.steps.length} decisions
                    </div>
                    {completed ? (
                      <span className="text-xs text-primary font-bold">{bestScore}/{s.maxScore} ({pct}%)</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-primary group-hover:translate-x-1 transition-transform">START <ChevronRight className="h-3 w-3" /></span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
