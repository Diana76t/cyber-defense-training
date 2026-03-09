import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Shield, Bug, AlertTriangle, Database, UserX, ChevronRight, Siren } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useUserProgress } from '@/hooks/useUserProgress';
import { INCIDENTS, SEVERITY_CONFIG, CATEGORY_CONFIG } from '@/data/incidentData';

const ICON_MAP: Record<string, React.ElementType> = { Mail, Shield, Bug, AlertTriangle, Database, UserX };

export default function IncidentLab() {
  const { getBestScoreForIncident, getCompletedIncidentIds } = useUserProgress();
  const completedIds = getCompletedIncidentIds();

  const highCount = INCIDENTS.filter(i => i.severity === 'high').length;
  const medCount  = INCIDENTS.filter(i => i.severity === 'medium').length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="font-terminal text-xs text-destructive mb-2">// INCIDENT RESPONSE COMMAND CENTER</div>
        <h1 className="text-2xl font-bold mb-1">Incident Response Lab</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Real-world security incidents. You are the responder. Every decision has consequences.
        </p>

        {/* Stat chips */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-destructive/10 border border-destructive/20">
            <Siren className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs font-bold text-destructive">{highCount} HIGH SEVERITY</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-warning/10 border border-warning/20">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            <span className="text-xs font-bold text-warning">{medCount} MEDIUM SEVERITY</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-secondary">
            <span className="text-xs font-bold text-muted-foreground">{completedIds.length}/{INCIDENTS.length} RESOLVED</span>
          </div>
        </div>

        {/* Incident cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INCIDENTS.map((incident, i) => {
            const Icon = ICON_MAP[incident.icon] || AlertTriangle;
            const sevCfg = SEVERITY_CONFIG[incident.severity];
            const catCfg = CATEGORY_CONFIG[incident.category];
            const completed = completedIds.includes(incident.id);
            const bestScore = getBestScoreForIncident(incident.id);
            const pct = Math.round((bestScore / incident.maxScore) * 100);

            return (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/incident/${incident.id}`}
                  className={`cyber-card rounded-lg p-6 block hover:glow-primary transition-shadow group border-l-2 ${sevCfg.borderColor}`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded ${catCfg.bgColor}`}>
                      <Icon className={`h-5 w-5 ${catCfg.color}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sevCfg.bgColor} ${sevCfg.color}`}>
                        {sevCfg.badge} {sevCfg.label}
                      </span>
                      {completed && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent/10 text-accent">✓ RESOLVED</span>
                      )}
                    </div>
                  </div>

                  {/* Category tag */}
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${catCfg.color}`}>
                    {catCfg.label}
                  </div>

                  <h3 className="text-sm font-bold text-foreground mb-1">{incident.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">{incident.description}</p>

                  {/* Objectives */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {incident.objectives.map((obj) => (
                      <span key={obj} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{obj}</span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{incident.steps.length} decisions</span>
                    {completed ? (
                      <span className="text-xs text-primary font-bold">{bestScore}/{incident.maxScore} ({pct}%)</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-primary group-hover:translate-x-1 transition-transform">
                        RESPOND <ChevronRight className="h-3 w-3" />
                      </span>
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
