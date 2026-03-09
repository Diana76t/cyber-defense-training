export type TipCategory = 'phishing' | 'passwords' | 'network' | 'devices' | 'social' | 'incident';
export type TipSeverity = 'info' | 'medium' | 'high' | 'critical';

export interface CyberTip {
  id: string;
  category: TipCategory;
  title: string;
  summary: string;
  details: string;
  severity: TipSeverity;
  icon: string;
}

export const CYBER_TIPS: CyberTip[] = [
  // ─── PHISHING ────────────────────────────────────────────────────────────
  {
    id: 't1',
    category: 'phishing',
    title: 'Verify the Sender Domain',
    summary: 'Always check the full email address, not just the display name.',
    details: 'Display names can say anything — "PayPal Security Team" — but the actual address reveals the truth. Look for typosquatting like "paypa1.com" or unrelated domains like "paypal-support.xyz". Hover over links before clicking to preview the real URL.',
    severity: 'critical',
    icon: 'Mail',
  },
  {
    id: 't2',
    category: 'phishing',
    title: 'Urgency Is a Red Flag',
    summary: 'Legitimate organizations don\'t demand immediate action under threat.',
    details: 'Phrases like "Your account will be deleted in 2 hours", "Immediate action required", or "Final notice" are pressure tactics designed to bypass your critical thinking. When you feel rushed, slow down. A real account suspension can be resolved on your timeline.',
    severity: 'high',
    icon: 'AlertCircle',
  },
  {
    id: 't3',
    category: 'phishing',
    title: 'Navigate, Don\'t Click',
    summary: 'Manually type URLs instead of clicking links in emails or messages.',
    details: 'Even if a link looks correct, it can be disguised using URL shorteners, Unicode characters, or legitimate redirect services. For sensitive sites (banking, email, HR portals), always type the URL directly in your browser or use a bookmarked link you trust.',
    severity: 'high',
    icon: 'Link',
  },

  // ─── PASSWORDS ────────────────────────────────────────────────────────────
  {
    id: 't4',
    category: 'passwords',
    title: 'Use a Password Manager',
    summary: 'Generate and store unique, complex passwords for every account.',
    details: 'Password managers (like Bitwarden, 1Password, or Dashlane) generate strong random passwords and store them encrypted. You only need to remember one strong master password. This eliminates password reuse — the #1 cause of account breaches after phishing.',
    severity: 'critical',
    icon: 'Key',
  },
  {
    id: 't5',
    category: 'passwords',
    title: 'Enable MFA on Everything',
    summary: 'Multi-factor authentication stops 99.9% of automated attacks.',
    details: 'Even if your password is stolen, MFA requires a second factor (authenticator app, hardware key) to log in. Prefer authenticator apps (Google Authenticator, Authy) over SMS-based 2FA. The strongest form is FIDO2/hardware security keys (YubiKey) which are phishing-resistant by design.',
    severity: 'critical',
    icon: 'Shield',
  },
  {
    id: 't6',
    category: 'passwords',
    title: 'Check for Data Breaches',
    summary: 'Your credentials may already be in attacker hands.',
    details: 'Visit haveibeenpwned.com to check if your email appears in known data breaches. Change any compromised passwords immediately. Enable breach alerts to be notified when new breaches include your email. Assume any password used on a breached site is compromised.',
    severity: 'high',
    icon: 'Search',
  },

  // ─── NETWORK ─────────────────────────────────────────────────────────────
  {
    id: 't7',
    category: 'network',
    title: 'Avoid Public WiFi for Sensitive Tasks',
    summary: 'Public networks can be monitored or spoofed by attackers.',
    details: 'Coffee shop WiFi, hotel networks, and airport hotspots can be sniffed or fully controlled by attackers via "evil twin" access points (a fake WiFi network with the same name as the real one). Use your phone\'s mobile hotspot or a trusted VPN for any banking, work, or sensitive browsing on public networks.',
    severity: 'high',
    icon: 'Wifi',
  },
  {
    id: 't8',
    category: 'network',
    title: 'Keep Your Router Firmware Updated',
    summary: 'Unpatched routers are a common entry point for home network attacks.',
    details: 'Router firmware updates fix security vulnerabilities that attackers exploit to intercept traffic or pivot into your home network. Check your router\'s admin panel monthly, change default admin credentials, and consider enabling automatic updates if your router supports it.',
    severity: 'medium',
    icon: 'Router',
  },

  // ─── DEVICES ─────────────────────────────────────────────────────────────
  {
    id: 't9',
    category: 'devices',
    title: 'Apply Security Updates Immediately',
    summary: 'Unpatched systems are the most common ransomware entry vector.',
    details: 'The WannaCry ransomware (2017) infected 230,000+ computers — all running a Windows vulnerability that had been patched 2 months earlier. Enable automatic updates on your OS, browsers, and all software. "If it ain\'t broke don\'t fix it" doesn\'t apply to security patches.',
    severity: 'critical',
    icon: 'Download',
  },
  {
    id: 't10',
    category: 'devices',
    title: 'Lock Your Screen When Away',
    summary: 'Physical access is just as dangerous as remote attacks.',
    details: 'Even 60 seconds of unattended access to an unlocked computer is enough to install malware, steal files, or create backdoor accounts. Set your screen to lock after 5 minutes of inactivity. Use Windows+L (Windows) or Cmd+Ctrl+Q (Mac) to lock instantly when stepping away.',
    severity: 'medium',
    icon: 'Monitor',
  },

  // ─── SOCIAL ENGINEERING ───────────────────────────────────────────────────
  {
    id: 't11',
    category: 'social',
    title: 'Verify Requests Through Separate Channels',
    summary: 'Always confirm unusual requests via a different, trusted communication method.',
    details: 'If you receive an email asking for sensitive info or urgent action, verify it exists by calling the person on a known number — NOT the one provided in the email. This "out-of-band verification" defeats email spoofing, account compromise, and vishing attacks. The 2 minutes it takes can prevent millions in losses.',
    severity: 'critical',
    icon: 'Phone',
  },
  {
    id: 't12',
    category: 'social',
    title: 'Minimize Your Digital Footprint',
    summary: 'Attackers use public information to personalize and legitimize attacks.',
    details: 'LinkedIn, social media, and company websites provide attackers with names, titles, relationships, projects, and travel patterns used in spear phishing. Audit your privacy settings, think before posting about work projects, and be aware that "out of office" replies reveal your absence to anyone who emails you.',
    severity: 'medium',
    icon: 'Eye',
  },
];

export const TIP_CATEGORY_CONFIG: Record<TipCategory, {
  label: string;
  icon: string;
  color: string;
}> = {
  phishing: { label: 'Phishing', icon: 'Mail', color: 'text-primary' },
  passwords: { label: 'Passwords', icon: 'Key', color: 'text-accent' },
  network: { label: 'Network', icon: 'Wifi', color: 'text-blue-400' },
  devices: { label: 'Devices', icon: 'Monitor', color: 'text-warning' },
  social: { label: 'Social Engineering', icon: 'Users', color: 'text-purple-400' },
  incident: { label: 'Incident Response', icon: 'AlertTriangle', color: 'text-destructive' },
};

export const TIP_SEVERITY_CONFIG: Record<TipSeverity, {
  label: string;
  color: string;
  bg: string;
}> = {
  info: { label: 'Info', color: 'text-muted-foreground', bg: 'bg-muted' },
  medium: { label: 'Medium', color: 'text-warning', bg: 'bg-warning/10' },
  high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  critical: { label: 'Critical', color: 'text-destructive', bg: 'bg-destructive/10' },
};
