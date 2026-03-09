import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useUserProgress } from '@/hooks/useUserProgress';
import { SCENARIOS, SCENARIO_TYPE_CONFIG } from '@/data/scenarioData';

type Phase = 'intro' | 'active' | 'answered' | 'complete';

export default function ScenarioPage() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const scenario = SCENARIOS.find(s => s.id === scenarioId);
  const { addScenarioResult } = useUserProgress();

  const [phase, setPhase] = useState<Phase>('intro');
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [stepScores, setStepScores] = useState<{ points: number; correct: boolean }[]>([]);

  if (!scenario) return <Navigate to="/lab" replace />;

  const step = scenario.steps[stepIdx];
  const typeConfig = SCENARIO_TYPE_CONFIG[scenario.type];

  function startScenario() {
    setPhase('active');
    setStepIdx(0);
    setScore(0);
    setStepScores([]);
    setSelectedId(null);
  }

  function handleChoice(choiceId: string) {
    if (phase !== 'active') return;
    setSelectedId(choiceId);
    const choice = step.choices.find(c => c.id === choiceId)!;
    setScore(s => s + choice.points);
    setStepScores(ss => [...ss, { points: choice.points, correct: choice.isCorrect }]);
    setPhase('answered');
  }

  function handleNext() {
    if (stepIdx < scenario.steps.length - 1) {
      setStepIdx(i => i + 1);
      setSelectedId(null);
      setPhase('active');
    } else {
      addScenarioResult({ scenarioId: scenario.id, scenarioTitle: scenario.title, score, maxScore: scenario.maxScore, completedAt: new Date().toISOString() });
      setPhase('complete');
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12 max-w-3xl">
        <Link to="/lab" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-3 w-3" /> Back to Lab</Link>

        {/* Intro */}
        {phase === 'intro' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="cyber-card rounded-lg p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${typeConfig.bgColor} ${typeConfig.color}`}>{typeConfig.label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${scenario.difficulty === 'beginner' ? 'bg-accent/10 text-accent' : scenario.difficulty === 'intermediate' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}`}>{scenario.difficulty.toUpperCase()}</span>
              </div>
              <h1 className="text-xl font-bold mb-3">{scenario.title}</h1>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{scenario.description}</p>
              <div className="bg-secondary/50 rounded p-4 mb-6">
                <div className="font-terminal text-xs text-primary mb-2">// SCENARIO BRIEFING</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{scenario.context}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{scenario.steps.length} decisions · Max {scenario.maxScore} pts</span>
                <button onClick={startScenario} className="flex items-center gap-2 px-6 py-2 rounded bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity glow-primary">
                  <Shield className="h-3 w-3" /> BEGIN SIMULATION
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active Step */}
        {(phase === 'active' || phase === 'answered') && step && (
          <div>
            {/* Progress */}
            <div className="flex items-center gap-2 mb-4">
              {scenario.steps.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i < stepIdx ? 'bg-primary' : i === stepIdx ? 'bg-primary/50' : 'bg-muted'}`} />
              ))}
            </div>
            <div className="text-xs text-muted-foreground font-terminal mb-4">STEP {step.stepNumber}/{scenario.steps.length} — {score} PTS</div>

            <AnimatePresence mode="wait">
              <motion.div key={step.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="cyber-card rounded-lg p-6 mb-4">
                  <h2 className="text-sm font-bold text-primary mb-3">{step.title}</h2>
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{step.situation}</p>
                </div>

                {step.emailContent && (
                  <div className="email-viewer p-4 mb-4">
                    <div className="space-y-1 border-b border-border pb-2 mb-3">
                      <div className="text-xs"><span className="text-muted-foreground">From:</span> <span className="text-destructive">{step.emailContent.from}</span></div>
                      <div className="text-xs"><span className="text-muted-foreground">To:</span> <span className="text-foreground">{step.emailContent.to}</span></div>
                      <div className="text-xs"><span className="text-muted-foreground">Subject:</span> <span className="text-foreground font-bold">{step.emailContent.subject}</span></div>
                    </div>
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">{step.emailContent.body}</pre>
                  </div>
                )}

                <div className="space-y-2 mb-6">
                  {step.choices.map(choice => {
                    let cls = 'cyber-card rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-all text-left w-full';
                    if (phase === 'answered') {
                      if (choice.isCorrect) cls += ' choice-correct';
                      else if (choice.id === selectedId && !choice.isCorrect) cls += ' choice-wrong';
                      else cls += ' choice-neutral';
                    }
                    return (
                      <button key={choice.id} onClick={() => handleChoice(choice.id)} disabled={phase === 'answered'} className={cls}>
                        <span className="text-xs text-foreground">{choice.text}</span>
                      </button>
                    );
                  })}
                </div>

                {phase === 'answered' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="cyber-card rounded-lg p-4 mb-4 border-primary/30">
                      <div className="flex items-center gap-2 mb-2">
                        {step.choices.find(c => c.id === selectedId)?.isCorrect ? (
                          <><CheckCircle className="h-4 w-4 text-accent" /><span className="text-xs font-bold text-accent">+{step.choices.find(c => c.id === selectedId)?.points} PTS</span></>
                        ) : (
                          <><XCircle className="h-4 w-4 text-destructive" /><span className="text-xs font-bold text-destructive">+{step.choices.find(c => c.id === selectedId)?.points} PTS</span></>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.choices.find(c => c.id === selectedId)?.feedback}</p>
                    </div>
                    <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2 rounded bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">
                      {stepIdx < scenario.steps.length - 1 ? <>Continue <ArrowRight className="h-3 w-3" /></> : 'View Results'}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Complete */}
        {phase === 'complete' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="cyber-card rounded-lg p-8 mb-6">
              <div className="text-6xl mb-4">{score >= scenario.maxScore * 0.8 ? '🏆' : score >= scenario.maxScore * 0.5 ? '🛡️' : '🔰'}</div>
              <h2 className="text-xl font-bold mb-2">Simulation Complete</h2>
              <div className="text-3xl font-display font-bold text-primary text-glow-primary mb-1">{score} / {scenario.maxScore}</div>
              <div className="text-sm text-muted-foreground mb-4">{Math.round((score / scenario.maxScore) * 100)}%</div>
              <div className="flex justify-center gap-2 mb-4">
                {stepScores.map((s, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${s.correct ? 'bg-accent/20 text-accent' : s.points > 0 ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'}`}>
                    {s.points}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={startScenario} className="flex items-center gap-1 px-5 py-2 rounded border border-border text-xs font-bold hover:bg-secondary transition-colors"><RotateCcw className="h-3 w-3" /> Retry</button>
              <Link to="/lab" className="px-5 py-2 rounded bg-secondary text-foreground text-xs font-bold hover:bg-muted transition-colors">All Scenarios</Link>
              <Link to="/dashboard" className="px-5 py-2 rounded bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">Dashboard</Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
