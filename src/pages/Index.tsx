import { Link } from 'react-router-dom';
import { Shield, Target, BookOpen, Trophy, Zap, Users, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-cyber.jpg';
import Navbar from '@/components/Navbar';

const features = [
  {
    icon: Target,
    title: 'Phishing Quiz',
    description: 'Test your ability to detect phishing emails across 3 difficulty levels.',
    link: '/quiz',
    glow: 'glow-primary',
  },
  {
    icon: BookOpen,
    title: 'Simulation Lab',
    description: 'Face realistic attack scenarios — phishing, ransomware, fake websites.',
    link: '/lab',
    glow: 'glow-danger',
  },
  {
    icon: Zap,
    title: 'Security Tips',
    description: '12+ expert-curated cybersecurity tips for real-world protection.',
    link: '/tips',
    glow: 'glow-success',
  },
  {
    icon: Trophy,
    title: 'Leaderboard',
    description: 'Compete globally and climb the ranks from Recruit to Elite.',
    link: '/leaderboard',
    glow: 'glow-warning',
  },
];

const stats = [
  { icon: Users, value: '50,000+', label: 'Professionals Trained' },
  { icon: Shield, value: '200+', label: 'Attack Scenarios' },
  { icon: TrendingUp, value: '97%', label: 'Detection Improvement' },
  { icon: Award, value: '4.8/5', label: 'Platform Rating' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
        <div className="absolute inset-0 cyber-grid" />

        <div className="container relative mx-auto px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="font-terminal text-xs tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
              <span className="inline-block w-8 h-px bg-primary" />
              SECURITY AWARENESS PLATFORM v2.0
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-foreground">CYBER </span>
              <span className="text-primary text-glow-primary">DEFENSE</span>
              <br />
              <span className="text-foreground">ACADEMY</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8 font-ui">
              Master cybersecurity awareness through realistic attack simulations,
              phishing quizzes, and expert training. Protect yourself and your organization.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/quiz"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-primary text-primary-foreground font-display text-xs font-bold tracking-wider hover:opacity-90 transition-opacity glow-primary"
              >
                <Target className="h-4 w-4" />
                START TRAINING
              </Link>
              <Link
                to="/lab"
                className="inline-flex items-center gap-2 px-6 py-3 rounded border border-border bg-secondary text-foreground font-display text-xs font-bold tracking-wider hover:bg-muted transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                SIMULATION LAB
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 relative border-b border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">ABOUT THIS PLATFORM</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Cyber Defense Academy is a hands-on cybersecurity awareness training platform
              designed to help users understand and respond to modern cyber threats through
              realistic simulations, phishing exercises, and SOC-style investigations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="cyber-card rounded-lg p-5">
                <div className="text-primary font-display text-xs font-bold mb-2">LEARN</div>
                <p className="text-xs text-muted-foreground">Explore expert-curated tips and real-world attack patterns to sharpen your threat awareness.</p>
              </div>
              <div className="cyber-card rounded-lg p-5">
                <div className="text-primary font-display text-xs font-bold mb-2">PRACTICE</div>
                <p className="text-xs text-muted-foreground">Face interactive simulations — from phishing emails to ransomware incidents — in a safe environment.</p>
              </div>
              <div className="cyber-card rounded-lg p-5">
                <div className="text-primary font-display text-xs font-bold mb-2">PROVE</div>
                <p className="text-xs text-muted-foreground">Track your progress, earn points, and climb the leaderboard from Recruit to Elite defender.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">TRAINING MODULES</h2>
            <p className="text-muted-foreground">Comprehensive cybersecurity awareness in four pillars</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link
                  to={f.link}
                  className={`cyber-card rounded-lg p-6 h-full block hover:${f.glow} transition-shadow duration-300`}
                >
                  <f.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-sm font-bold mb-2 text-foreground">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <s.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-display font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-foreground">READY TO DEFEND?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Start with the phishing quiz to test your baseline, then advance through simulations.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 rounded bg-primary text-primary-foreground font-display text-xs font-bold tracking-wider hover:opacity-90 transition-opacity glow-primary"
          >
            VIEW DASHBOARD
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-display">CDA</span> © 2026
          </div>
          <div className="font-terminal text-xs text-muted-foreground">
            SYSTEM STATUS: <span className="text-accent">OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
