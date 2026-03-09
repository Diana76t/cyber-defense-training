import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Wifi, Monitor, Users, AlertTriangle, Mail, Link as LinkIcon, Search, Phone, Eye, Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { CYBER_TIPS, TIP_CATEGORY_CONFIG, TIP_SEVERITY_CONFIG, type TipCategory } from '@/data/tipsData';

const ICON_MAP: Record<string, React.ElementType> = {
  Mail, AlertCircle: AlertTriangle, Link: LinkIcon, Key, Shield, Search, Wifi, Router: Wifi, Download, Monitor, Phone, Eye, Users,
};

export default function Tips() {
  const [activeCategory, setActiveCategory] = useState<TipCategory | 'all'>('all');
  const filtered = activeCategory === 'all' ? CYBER_TIPS : CYBER_TIPS.filter(t => t.category === activeCategory);
  const categories = Object.entries(TIP_CATEGORY_CONFIG) as [TipCategory, typeof TIP_CATEGORY_CONFIG[TipCategory]][];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="font-terminal text-xs text-primary mb-2">// SECURITY KNOWLEDGE BASE</div>
        <h1 className="text-2xl font-bold mb-2">Cybersecurity Tips</h1>
        <p className="text-sm text-muted-foreground mb-6">Expert-curated security guidance for real-world protection.</p>

        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setActiveCategory('all')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${activeCategory === 'all' ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-secondary text-muted-foreground hover:text-foreground border border-transparent'}`}>All</button>
          {categories.map(([key, cfg]) => (
            <button key={key} onClick={() => setActiveCategory(key)} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${activeCategory === key ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-secondary text-muted-foreground hover:text-foreground border border-transparent'}`}>{cfg.label}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tip, i) => {
            const Icon = ICON_MAP[tip.icon] || Shield;
            const sev = TIP_SEVERITY_CONFIG[tip.severity];
            return (
              <motion.div key={tip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="cyber-card rounded-lg p-5 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sev.bg} ${sev.color}`}>{sev.label.toUpperCase()}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">{tip.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{tip.summary}</p>
                <p className="text-xs text-muted-foreground/70 leading-relaxed mt-auto">{tip.details}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
