import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useUserProgress } from '@/hooks/useUserProgress';
import { getQuestionsByDifficulty, shuffleArray, DIFFICULTY_CONFIG, type Difficulty, type QuizQuestion } from '@/data/quizData';

type Phase = 'select' | 'playing' | 'answered' | 'complete';

export default function Quiz() {
  const { addQuizResult } = useUserProgress();
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [phase, setPhase] = useState<Phase>('select');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<{ correct: boolean }[]>([]);

  const currentQ = questions[currentIdx];
  const maxScore = useMemo(() => questions.reduce((s, q) => s + q.points, 0), [questions]);

  function startQuiz(d: Difficulty) {
    setDifficulty(d);
    setQuestions(shuffleArray(getQuestionsByDifficulty(d)));
    setCurrentIdx(0);
    setScore(0);
    setResults([]);
    setSelectedId(null);
    setPhase('playing');
  }

  function handleSelect(optId: string) {
    if (phase !== 'playing') return;
    setSelectedId(optId);
    const correct = optId === currentQ.correctOptionId;
    if (correct) setScore(s => s + currentQ.points);
    setResults(r => [...r, { correct }]);
    setPhase('answered');
  }

  function handleNext() {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedId(null);
      setPhase('playing');
    } else {
      const finalScore = score;
      addQuizResult({ difficulty: difficulty!, score: finalScore, maxScore, completedAt: new Date().toISOString() });
      setPhase('complete');
    }
  }

  function handleRestart() {
    setPhase('select');
    setDifficulty(null);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12 max-w-3xl">

        {/* Difficulty Selection */}
        {phase === 'select' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="font-terminal text-xs text-primary mb-2">// SELECT DIFFICULTY</div>
            <h1 className="text-2xl font-bold mb-2">Phishing Detection Quiz</h1>
            <p className="text-sm text-muted-foreground mb-8">Test your ability to identify phishing attacks. 5 questions per level.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(d => {
                const c = DIFFICULTY_CONFIG[d];
                return (
                  <button key={d} onClick={() => startQuiz(d)} className="cyber-card rounded-lg p-6 text-left hover:glow-primary transition-shadow">
                    <div className={`text-xs font-bold mb-2 ${d === 'beginner' ? 'text-accent' : d === 'intermediate' ? 'text-warning' : 'text-destructive'}`}>
                      {c.label.toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">{c.description}</div>
                    <div className="text-xs text-primary">{c.points} pts/question</div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Question */}
        {(phase === 'playing' || phase === 'answered') && currentQ && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <button onClick={handleRestart} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3 w-3" /> Back</button>
              <div className="text-xs text-muted-foreground font-terminal">Q{currentIdx + 1}/{questions.length} | {score} pts</div>
            </div>
            <div className="cyber-progress mb-6"><div className="cyber-progress-bar" style={{ width: `${((currentIdx + (phase === 'answered' ? 1 : 0)) / questions.length) * 100}%` }} /></div>

            <AnimatePresence mode="wait">
              <motion.div key={currentQ.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="cyber-card rounded-lg p-6 mb-4">
                  <div className={`text-xs font-bold mb-3 capitalize ${difficulty === 'beginner' ? 'text-accent' : difficulty === 'intermediate' ? 'text-warning' : 'text-destructive'}`}>{difficulty}</div>
                  <h2 className="text-sm font-bold text-foreground leading-relaxed">{currentQ.question}</h2>
                </div>

                <div className="space-y-2 mb-6">
                  {currentQ.options.map(opt => {
                    let cls = 'cyber-card rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-all text-left w-full';
                    if (phase === 'answered') {
                      if (opt.id === currentQ.correctOptionId) cls += ' choice-correct';
                      else if (opt.id === selectedId) cls += ' choice-wrong';
                      else cls += ' choice-neutral';
                    } else if (selectedId === opt.id) {
                      cls += ' border-primary';
                    }
                    return (
                      <button key={opt.id} onClick={() => handleSelect(opt.id)} disabled={phase === 'answered'} className={cls}>
                        <span className="text-xs text-foreground">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {phase === 'answered' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="cyber-card rounded-lg p-4 mb-4 border-primary/30">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedId === currentQ.correctOptionId ? (
                        <><CheckCircle className="h-4 w-4 text-accent" /><span className="text-xs font-bold text-accent">CORRECT!</span></>
                      ) : (
                        <><XCircle className="h-4 w-4 text-destructive" /><span className="text-xs font-bold text-destructive">INCORRECT</span></>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{currentQ.explanation}</p>
                  </motion.div>
                )}

                {phase === 'answered' && (
                  <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2 rounded bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">
                    {currentIdx < questions.length - 1 ? <>Next <ArrowRight className="h-3 w-3" /></> : 'View Results'}
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Results */}
        {phase === 'complete' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="cyber-card rounded-lg p-8 mb-6">
              <div className="text-6xl mb-4">{score >= maxScore * 0.8 ? '🏆' : score >= maxScore * 0.5 ? '⚡' : '🔰'}</div>
              <h2 className="text-xl font-bold mb-2">Quiz Complete!</h2>
              <div className="text-3xl font-display font-bold text-primary text-glow-primary mb-1">{score} / {maxScore}</div>
              <div className="text-sm text-muted-foreground mb-4">{Math.round((score / maxScore) * 100)}% — {score >= maxScore * 0.8 ? 'Outstanding!' : score >= maxScore * 0.5 ? 'Good effort!' : 'Keep practicing!'}</div>
              <div className="flex justify-center gap-2 mb-4">
                {results.map((r, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${r.correct ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'}`}>
                    {r.correct ? '✓' : '✗'}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={handleRestart} className="flex items-center gap-1 px-5 py-2 rounded border border-border text-xs font-bold hover:bg-secondary transition-colors"><RotateCcw className="h-3 w-3" /> Try Again</button>
              <Link to="/dashboard" className="px-5 py-2 rounded bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">Dashboard</Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
