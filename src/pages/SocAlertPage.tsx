import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronRight, CheckCircle, XCircle,
  RotateCcw, Trophy, FileText, Terminal,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { SOC_ALERTS, PRIORITY_CONFIG, CATEGORY_CONFIG, Evidence } from '@/data/socAlertData';
import { useUserProgress } from '@/hooks/useUserProgress';

function EvidenceBlock({ evidence }: { evidence: Evidence }) {
  const iconMap = {
    log: '📋',
    ip: '🌐',
    email: '✉️',
    file: '📁',
    network: '📡',
  };

  return (
    <div className="bg-background/50 border border-border/50 rounded p-3 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <span>{iconMap[evidence.type]}</span>
        <span className="text-[10px] font-terminal text-primary uppercase">{evidence.label}</span>
      </div>
      <pre className="text-[11px] text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
        {evidence.content}
      </pre>
    </div>
  );
}

export default function SocAlertPage() {
  const { alertId } = useParams<{ alertId: string }>();
  const { addSocAlertResult } = useUserProgress();

  const alert = SOC_ALERTS.find((a) => a.id === alertId);

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [stepScores, setStepScores] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  if (!alert) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Alert not found.</p>
          <Link to="/soc" className="text-primary text-sm hover:underline">← Back to SOC Lab</Link>
        </div>
      </div>
    );
  }

  const priCfg = PRIORITY_CONFIG[alert.priority];
  const catCfg = CATEGORY_CONFIG[alert.category];
  const currentStep = alert.steps[stepIndex];
  const chosen = currentStep?.actions.find((a) => a.id === selectedAction);
  const totalScore = stepScores.reduce((s, n) => s + n, 0);
  const maxPossible = alert.maxScore;
  const pct = Math.round((totalScore / maxPossible) * 100);

  function handleSelect(actionId: string) {
    if (selectedAction) return;
    setSelectedAction(actionId);
    const action = currentStep.actions.find((a) => a.id === actionId)!;
    setStepScores((prev) => [...prev, action.points]);
  }

  function handleNext() {
    if (stepIndex < alert.steps.length - 1) {
      setStepIndex((i) => i + 1);
      setSelectedAction(null);
    } else {
      const finalScore = stepScores.reduce((s, n) => s + n, 0);
      addSocAlertResult({
        socAlertId: alert.id,
        socAlertTitle: alert.title,
        score: finalScore,
        maxScore: alert.maxScore,
        completedAt: new Date().toISOString(),
      });
      setCompleted(true);
    }
  }

  function handleRestart() {
    setStepIndex(0);
    setSelectedAction(null);
    setStepScores([]);
    setCompleted(false);
  }

  const progressPct = Math.round(((stepIndex + (selectedAction ? 1 : 0)) / alert.steps.length) * 100);

  // ── Results screen ─────────────────────────────────────────────────────────
  if (completed) {
    const grade = pct >= 80 ? { label: 'EXPERT ANALYST', color: 'text-accent', icon: '🏆' }
      : pct >= 50 ? { label: 'COMPETENT ANALYST', color: 'text-warning', icon: '✅' }
      : { label: 'NEEDS TRAINING', color: 'text-destructive', icon: '⚠️' };

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-20 pb-12 max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="cyber-card rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">{grade.icon}</div>
            <div className={`text-xs font-terminal mb-2 ${grade.color}`}>{grade.label}</div>
            <h2 className="text-xl font-bold mb-1">Investigation Complete</h2>
            <p className="text-sm text-muted-foreground mb-6">{alert.title}</p>

            <div className="text-5xl font-display font-bold text-primary text-glow-primary mb-2">{totalScore}</div>
            <div className="text-sm text-muted-foreground mb-4">out of {maxPossible} points ({pct}%)</div>

            <div className="cyber-progress mb-6"><div className="cyber-progress-bar" style={{ width: `${pct}%` }} /></div>

            {/* Per-step breakdown */}
            <div className="space-y-2 mb-8 text-left">
              {alert.steps.map((step, i) => {
                const earned = stepScores[i] ?? 0;
                const best = Math.max(...step.actions.map(a => a.points));
                const spct = Math.round((earned / best) * 100);
                return (
                  <div key={step.id} className="flex items-center justify-between text-xs py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">{step.title}</span>
                    <span className={`font-bold ${spct === 100 ? 'text-accent' : spct >= 50 ? 'text-warning' : 'text-destructive'}`}>
                      {earned}/{best}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={handleRestart} className="flex items-center gap-2 px-4 py-2 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Try Again
              </button>
              <Link to="/soc" className="flex items-center gap-2 px-4 py-2 rounded bg-secondary text-foreground text-xs font-bold hover:bg-secondary/80 transition-colors">
                <Search className="h-3.5 w-3.5" /> More Alerts
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded bg-accent/10 border border-accent/20 text-accent text-xs font-bold hover:bg-accent/20 transition-colors">
                <Trophy className="h-3.5 w-3.5" /> Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Active investigation ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12 max-w-3xl">

        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/soc" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            ← SOC Alert Lab
          </Link>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${priCfg.bgColor} ${priCfg.color}`}>
              {priCfg.badge} {priCfg.label}
            </span>
            <span className="text-xs text-muted-foreground">Step {stepIndex + 1}/{alert.steps.length}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="cyber-progress mb-6">
          <div className="cyber-progress-bar transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Alert header */}
        <div className="cyber-card rounded-lg p-5 mb-5 border-l-2 border-primary/50">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-terminal font-bold text-primary">SOC ALERT — {priCfg.label} PRIORITY</span>
          </div>
          <h2 className="text-base font-bold text-foreground mb-1">{alert.title}</h2>
          <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${catCfg.color}`}>{catCfg.label}</div>
          {stepIndex === 0 && (
            <div className="bg-secondary/50 rounded p-3 mt-2">
              <div className="text-[10px] font-terminal text-muted-foreground mb-1">// ALERT SUMMARY</div>
              <p className="text-xs text-foreground leading-relaxed">{alert.summary}</p>
              <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                <span>⏰ {alert.timestamp}</span>
                <span>📡 {alert.source}</span>
              </div>
            </div>
          )}
        </div>

        {/* Step card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="cyber-card rounded-lg p-6 mb-4">
              <div className="font-terminal text-xs text-primary mb-1">// ANALYSIS {currentStep.stepNumber}</div>
              <h3 className="text-base font-bold mb-4">{currentStep.title}</h3>
              
              {/* Evidence section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal className="h-4 w-4 text-accent" />
                  <span className="text-xs font-bold text-accent">EVIDENCE</span>
                </div>
                {currentStep.evidence.map((ev, i) => (
                  <EvidenceBlock key={i} evidence={ev} />
                ))}
              </div>

              {/* Question */}
              <p className="text-sm text-foreground font-medium mb-4">{currentStep.question}</p>

              {/* Action buttons */}
              <div className="space-y-3">
                {currentStep.actions.map((action) => {
                  const isSelected = selectedAction === action.id;
                  const isRevealed = selectedAction !== null;
                  const isCorrect = action.isCorrect;

                  let borderCls = 'border-border/50 hover:border-primary/50 cursor-pointer';
                  let bgCls = 'bg-secondary/30 hover:bg-secondary/60';
                  let textCls = 'text-foreground';
                  let Icon = null;

                  if (isRevealed) {
                    if (isSelected && isCorrect) {
                      borderCls = 'border-accent'; bgCls = 'bg-accent/10'; textCls = 'text-accent';
                      Icon = <CheckCircle className="h-4 w-4 text-accent shrink-0" />;
                    } else if (isSelected && !isCorrect) {
                      borderCls = 'border-destructive'; bgCls = 'bg-destructive/10'; textCls = 'text-destructive';
                      Icon = <XCircle className="h-4 w-4 text-destructive shrink-0" />;
                    } else if (!isSelected && isCorrect) {
                      borderCls = 'border-accent/30'; bgCls = 'bg-accent/5'; textCls = 'text-accent/70';
                      Icon = <CheckCircle className="h-4 w-4 text-accent/40 shrink-0" />;
                    } else {
                      borderCls = 'border-border/20'; bgCls = 'bg-secondary/10'; textCls = 'text-muted-foreground';
                    }
                  }

                  return (
                    <motion.button
                      key={action.id}
                      whileTap={!selectedAction ? { scale: 0.99 } : {}}
                      onClick={() => handleSelect(action.id)}
                      disabled={!!selectedAction}
                      className={`w-full text-left rounded border p-4 transition-all ${borderCls} ${bgCls} disabled:cursor-default`}
                    >
                      <div className="flex items-start gap-3">
                        {Icon && <div className="mt-0.5">{Icon}</div>}
                        <span className={`text-sm ${textCls}`}>{action.text}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {chosen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`cyber-card rounded-lg p-5 mb-4 border-l-4 ${chosen.isCorrect ? 'border-accent' : 'border-destructive'}`}
                >
                  <div className={`text-[10px] font-terminal mb-1 ${chosen.isCorrect ? 'text-accent' : 'text-destructive'}`}>
                    {chosen.isCorrect ? '// CORRECT ANALYSIS' : '// SUBOPTIMAL ANALYSIS'}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-2">{chosen.feedback}</p>
                  <div className={`text-xs font-bold ${chosen.isCorrect ? 'text-accent' : chosen.points > 0 ? 'text-warning' : 'text-destructive'}`}>
                    +{chosen.points} points
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            {selectedAction && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  {stepIndex < alert.steps.length - 1 ? (
                    <>Next Analysis <ChevronRight className="h-4 w-4" /></>
                  ) : (
                    <>Complete Investigation <CheckCircle className="h-4 w-4" /></>
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Live score */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Score: <span className="text-primary font-bold">{stepScores.reduce((s, n) => s + n, 0)}</span> / {alert.maxScore} pts
        </div>
      </div>
    </div>
  );
}
