import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, CheckCircle2, Clock, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { SOC_ALERTS, PRIORITY_CONFIG, CATEGORY_CONFIG } from '@/data/socAlertData';
import { useUserProgress } from '@/hooks/useUserProgress';

export default function SocAlertLab() {
  const { getCompletedSocAlertIds, getBestScoreForSocAlert } = useUserProgress();
  const completedIds = getCompletedSocAlertIds();

  const totalAlerts = SOC_ALERTS.length;
  const completedCount = completedIds.length;
  const progressPct = Math.round((completedCount / totalAlerts) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-5 w-5 text-primary" />
            <span className="text-xs font-terminal text-primary">// SOC ANALYST TRAINING</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            SOC Alert Investigation
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Analyze security alerts as a SOC analyst. Review evidence including logs, IP addresses, 
            and event details to determine the correct investigation steps and response actions.
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="cyber-card rounded-lg p-4 mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-terminal text-muted-foreground">INVESTIGATION PROGRESS</span>
            <span className="text-xs font-bold text-primary">{completedCount}/{totalAlerts} Alerts</span>
          </div>
          <div className="cyber-progress">
            <div
              className="cyber-progress-bar transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </motion.div>

        {/* Alert grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {SOC_ALERTS.map((alert, idx) => {
            const isCompleted = completedIds.includes(alert.id);
            const bestScore = getBestScoreForSocAlert(alert.id);
            const pctScore = isCompleted ? Math.round((bestScore / alert.maxScore) * 100) : 0;
            const priCfg = PRIORITY_CONFIG[alert.priority];
            const catCfg = CATEGORY_CONFIG[alert.category];

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/soc/${alert.id}`}
                  className="block cyber-card rounded-lg p-5 hover:border-primary/50 transition-all group"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{catCfg.icon}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${priCfg.bgColor} ${priCfg.color}`}>
                        {priCfg.badge} {priCfg.label}
                      </span>
                    </div>
                    {isCompleted ? (
                      <div className="flex items-center gap-1 text-accent">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs font-bold">{pctScore}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-[10px]">Not started</span>
                      </div>
                    )}
                  </div>

                  {/* Title & summary */}
                  <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors text-sm">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {alert.summary}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold uppercase ${catCfg.color}`}>{catCfg.label}</span>
                      <span className="text-muted-foreground">{alert.steps.length} decisions</span>
                    </div>
                    <span className="text-primary font-bold">{alert.maxScore} pts</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 cyber-card rounded-lg p-5 border-l-2 border-primary/50"
        >
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-foreground mb-1">SOC Analyst Training</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Practice real-world alert triage and investigation. Each scenario presents actual evidence 
                like logs, IP addresses, and file hashes. Learn to identify attack patterns, assess scope, 
                and take appropriate response actions following SOC best practices.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
