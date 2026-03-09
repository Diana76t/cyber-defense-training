import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, ChevronRight, CheckCircle, XCircle, Siren,
  RotateCcw, Trophy, Home, ClipboardList,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { INCIDENTS, SEVERITY_CONFIG, CATEGORY_CONFIG } from '@/data/incidentData';
import { useUserProgress } from '@/hooks/useUserProgress';

export default function IncidentPage() {
  const { incidentId } = useParams<{ incidentId: string }>();
  const navigate = useNavigate();
  const { addIncidentResult } = useUserProgress();

  const incident = INCIDENTS.find((i) => i.id === incidentId);

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [stepScores, setStepScores] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  if (!incident) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Incident not found.</p>
          <Link to="/incident" className="text-primary text-sm hover:underline">← Back to Incident Lab</Link>
        </div>
      </div>
    );
  }

  const sevCfg = SEVERITY_CONFIG[incident.severity];
  const catCfg = CATEGORY_CONFIG[incident.category];
  const currentStep = incident.steps[stepIndex];
  const chosen = currentStep?.actions.find((a) => a.id === selectedAction);
  const totalScore = stepScores.reduce((s, n) => s + n, 0);
  const maxPossible = incident.maxScore;
  const pct = Math.round((totalScore / maxPossible) * 100);

  function handleSelect(actionId: string) {
    if (selectedAction) return;
    setSelectedAction(actionId);
    const action = currentStep.actions.find((a) => a.id === actionId)!;
    setStepScores((prev) => [...prev, action.points]);
  }

  function handleNext() {
    if (stepIndex < incident.steps.length - 1) {
      setStepIndex((i) => i + 1);
      setSelectedAction(null);
    } else {
      const finalScore = [...stepScores].reduce((s, n) => s + n, 0);
      addIncidentResult({
        incidentId: incident.id,
        incidentTitle: incident.title,
        score: finalScore,
        maxScore: incident.maxScore,
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

  const progressPct = Math.round(((stepIndex + (selectedAction ? 1 : 0)) / incident.steps.length) * 100);

  // ── Results screen ─────────────────────────────────────────────────────────
  if (completed) {
    const grade = pct >= 80 ? { label: 'EXPERT RESPONDER', color: 'text-accent', icon: '🏆' }
      : pct >= 50 ? { label: 'COMPETENT RESPONDER', color: 'text-warning', icon: '✅' }
      : { label: 'NEEDS IMPROVEMENT', color: 'text-destructive', icon: '⚠️' };

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-20 pb-12 max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="cyber-card rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">{grade.icon}</div>
            <div className={`text-xs font-terminal mb-2 ${grade.color}`}>{grade.label}</div>
            <h2 className="text-xl font-bold mb-1">Incident Resolved</h2>
            <p className="text-sm text-muted-foreground mb-6">{incident.title}</p>

            <div className="text-5xl font-display font-bold text-primary text-glow-primary mb-2">{totalScore}</div>
            <div className="text-sm text-muted-foreground mb-4">out of {maxPossible} points ({pct}%)</div>

            <div className="cyber-progress mb-6"><div className="cyber-progress-bar" style={{ width: `${pct}%` }} /></div>

            {/* Per-step breakdown */}
            <div className="space-y-2 mb-8 text-left">
              {incident.steps.map((step, i) => {
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
              <Link to="/incident" className="flex items-center gap-2 px-4 py-2 rounded bg-secondary text-foreground text-xs font-bold hover:bg-secondary/80 transition-colors">
                <ClipboardList className="h-3.5 w-3.5" /> More Incidents
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

  // ── Active scenario ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12 max-w-3xl">

        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/incident" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            ← Incident Lab
          </Link>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sevCfg.bgColor} ${sevCfg.color}`}>
              {sevCfg.badge} {sevCfg.label}
            </span>
            <span className="text-xs text-muted-foreground">Step {stepIndex + 1}/{incident.steps.length}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="cyber-progress mb-6">
          <div className="cyber-progress-bar transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Incident header */}
        <div className="cyber-card rounded-lg p-5 mb-5 border-l-2 border-destructive/50">
          <div className="flex items-center gap-2 mb-2">
            <Siren className={`h-4 w-4 ${sevCfg.color} animate-pulse`} />
            <span className={`text-[10px] font-terminal font-bold ${sevCfg.color}`}>INCIDENT ALERT — {sevCfg.label} SEVERITY</span>
          </div>
          <h2 className="text-base font-bold text-foreground mb-1">{incident.title}</h2>
          <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${catCfg.color}`}>{catCfg.label}</div>
          {stepIndex === 0 && (
            <div className="bg-secondary/50 rounded p-3 mt-2">
              <div className="text-[10px] font-terminal text-muted-foreground mb-1">// INCIDENT BRIEFING</div>
              <p className="text-xs text-foreground leading-relaxed">{incident.briefing}</p>
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
              <div className="font-terminal text-xs text-primary mb-1">// DECISION {currentStep.stepNumber}</div>
              <h3 className="text-base font-bold mb-3">{currentStep.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mb-6">{currentStep.situation}</p>

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
                    {chosen.isCorrect ? '// CORRECT RESPONSE' : '// SUBOPTIMAL RESPONSE'}
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
                  {stepIndex < incident.steps.length - 1 ? (
                    <>Next Decision <ChevronRight className="h-4 w-4" /></>
                  ) : (
                    <>Complete Incident <CheckCircle className="h-4 w-4" /></>
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Live score */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Score: <span className="text-primary font-bold">{stepScores.reduce((s, n) => s + n, 0)}</span> / {incident.maxScore} pts
        </div>
      </div>
    </div>
  );
}
