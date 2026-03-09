export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  difficulty: Difficulty;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  points: number;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ─── BEGINNER ────────────────────────────────────────────────────────────────
  {
    id: 'b1',
    difficulty: 'beginner',
    question: 'You receive an email saying "Your account will be suspended in 24 hours — verify now!" What should you do first?',
    options: [
      { id: 'a', text: 'Click the verification link immediately to prevent suspension' },
      { id: 'b', text: 'Carefully check the sender\'s email address for anything suspicious' },
      { id: 'c', text: 'Reply asking if the email is legitimate' },
      { id: 'd', text: 'Forward it to friends to warn them' },
    ],
    correctOptionId: 'b',
    explanation: 'Urgency is the #1 phishing tactic. Always check the sender address first — look for misspellings like "paypa1.com" or unknown domains. Never click links in suspicious emails; navigate directly to the website instead.',
    points: 100,
  },
  {
    id: 'b2',
    difficulty: 'beginner',
    question: 'Which of these URLs is most likely a phishing site pretending to be PayPal?',
    options: [
      { id: 'a', text: 'https://www.paypal.com/login' },
      { id: 'b', text: 'https://paypal.secure-verify.net/login' },
      { id: 'c', text: 'https://paypal.com/account/summary' },
      { id: 'd', text: 'https://www.paypal.com/us/signin' },
    ],
    correctOptionId: 'b',
    explanation: 'The actual domain here is "secure-verify.net" — not paypal.com. Phishers put the brand name as a subdomain to trick quick readers. Always read the domain between the last dot and the first slash after "https://".',
    points: 100,
  },
  {
    id: 'b3',
    difficulty: 'beginner',
    question: 'A padlock icon (🔒) in your browser means:',
    options: [
      { id: 'a', text: 'The website is completely safe and trustworthy' },
      { id: 'b', text: 'Your connection to the site is encrypted, but the site itself could still be malicious' },
      { id: 'c', text: 'The site has been verified by a government agency' },
      { id: 'd', text: 'You cannot be hacked on this site' },
    ],
    correctOptionId: 'b',
    explanation: 'HTTPS (the padlock) encrypts data in transit — it does NOT guarantee the site is legitimate. Phishing sites routinely use HTTPS. Always verify the domain name, not just the padlock.',
    points: 100,
  },
  {
    id: 'b4',
    difficulty: 'beginner',
    question: 'A friend\'s email sends: "I\'m stuck in London and lost my wallet! Please wire $500 urgently." You haven\'t heard they were traveling. This is most likely:',
    options: [
      { id: 'a', text: 'A genuine emergency from your friend' },
      { id: 'b', text: 'A scam — your friend\'s account was likely hacked' },
      { id: 'c', text: 'A prank by your friend' },
      { id: 'd', text: 'A legitimate travel insurance request' },
    ],
    correctOptionId: 'b',
    explanation: 'This is an "emergency scam" using a compromised email account. Always verify via a separate channel (phone call, text) before sending any money. Attackers count on urgency overriding your skepticism.',
    points: 100,
  },
  {
    id: 'b5',
    difficulty: 'beginner',
    question: 'Which password is the strongest?',
    options: [
      { id: 'a', text: 'Password123!' },
      { id: 'b', text: 'michael1990' },
      { id: 'c', text: 'Tr0ub4d0r&3' },
      { id: 'd', text: 'nX#7kP$mQ@2vR' },
    ],
    correctOptionId: 'd',
    explanation: '"nX#7kP$mQ@2vR" is a random 13-character string with mixed cases, numbers, and symbols — hardest to crack. "Password123!" and "Tr0ub4d0r&3" are famous examples used in security research and are in attacker wordlists.',
    points: 100,
  },

  // ─── INTERMEDIATE ─────────────────────────────────────────────────────────────
  {
    id: 'i1',
    difficulty: 'intermediate',
    question: 'What distinguishes a "spear phishing" attack from regular phishing?',
    options: [
      { id: 'a', text: 'It uses phone calls instead of email' },
      { id: 'b', text: 'It targets a specific individual using personal details to appear legitimate' },
      { id: 'c', text: 'It sends mass emails to millions of random addresses' },
      { id: 'd', text: 'It only targets government agencies' },
    ],
    correctOptionId: 'b',
    explanation: 'Spear phishing uses harvested personal data (name, employer, colleagues, recent purchases) to craft convincing targeted attacks. Because the email appears to come from someone you know and references real details, it bypasses skepticism that blocks generic phishing.',
    points: 150,
  },
  {
    id: 'i2',
    difficulty: 'intermediate',
    question: 'An email appearing to be from your CEO urgently asks you to wire $15,000 to a new vendor. The email looks real. What do you do?',
    options: [
      { id: 'a', text: 'Process it immediately — CEO requests are high priority' },
      { id: 'b', text: 'Reply asking for more details before transferring' },
      { id: 'c', text: 'Verify the request directly with the CEO via phone or in-person' },
      { id: 'd', text: 'Contact the vendor directly to confirm bank details' },
    ],
    correctOptionId: 'c',
    explanation: 'This is Business Email Compromise (BEC) — one of the most costly cybercrimes. Attackers spoof or compromise executive email accounts. ALWAYS verify financial requests through a completely separate, trusted channel. Never rely solely on email for wire transfers.',
    points: 150,
  },
  {
    id: 'i3',
    difficulty: 'intermediate',
    question: 'Two-Factor Authentication (2FA) protects your account even if your password is stolen because:',
    options: [
      { id: 'a', text: 'It encrypts your password so it can\'t be stolen' },
      { id: 'b', text: 'An attacker also needs your second factor (e.g., phone) to log in' },
      { id: 'c', text: 'It changes your password automatically every 30 days' },
      { id: 'd', text: 'It blocks all login attempts from new devices permanently' },
    ],
    correctOptionId: 'b',
    explanation: '2FA requires something you know (password) AND something you have (phone/hardware token). Even with your stolen password, the attacker can\'t log in without your second factor. Note: SMS-based 2FA can be bypassed via SIM swapping; authenticator apps or hardware keys are stronger.',
    points: 150,
  },
  {
    id: 'i4',
    difficulty: 'intermediate',
    question: '"IT Support" calls you saying there\'s a critical issue with your account and asks for your password to fix it. You should:',
    options: [
      { id: 'a', text: 'Give your password — they called you, so it must be legitimate' },
      { id: 'b', text: 'Hang up and call back using the official IT helpdesk number' },
      { id: 'c', text: 'Give a fake password to test if they\'re real IT' },
      { id: 'd', text: 'Ask them to send an email with a ticket number first' },
    ],
    correctOptionId: 'b',
    explanation: 'Legitimate IT departments NEVER ask for your password. This is "vishing" (voice phishing). Always hang up and call back using a verified number (from your company\'s official website or directory). Giving a fake password still reveals information to social engineers.',
    points: 150,
  },
  {
    id: 'i5',
    difficulty: 'intermediate',
    question: 'What is the primary function of SPF (Sender Policy Framework)?',
    options: [
      { id: 'a', text: 'To encrypt email message content end-to-end' },
      { id: 'b', text: 'To allow receiving mail servers to verify that the sender is authorized to send email from that domain' },
      { id: 'c', text: 'To block all spam emails based on content analysis' },
      { id: 'd', text: 'To add a digital signature to email messages' },
    ],
    correctOptionId: 'b',
    explanation: 'SPF is a DNS record that lists authorized mail servers for a domain, helping prevent email spoofing. DKIM adds cryptographic signatures to verify email integrity. DMARC builds on both SPF and DKIM. None of these encrypt email content — that requires S/MIME or PGP.',
    points: 150,
  },

  // ─── ADVANCED ──────────────────────────────────────────────────────────────
  {
    id: 'a1',
    difficulty: 'advanced',
    question: 'A phishing email contains a link to "google.com/url?q=http://evil.com". What evasion technique is this?',
    options: [
      { id: 'a', text: 'DNS Cache Poisoning' },
      { id: 'b', text: 'Open Redirect — abusing a trusted domain to forward to a malicious one' },
      { id: 'c', text: 'Cross-Site Scripting (XSS)' },
      { id: 'd', text: 'SSL Stripping' },
    ],
    correctOptionId: 'b',
    explanation: 'Open redirect attacks exploit URL forwarding parameters on trusted domains (Google, LinkedIn, etc.) to make a malicious link appear to point to a trusted site. Email security scanners often whitelist google.com, so the link passes through. Always inspect the full URL including query parameters.',
    points: 200,
  },
  {
    id: 'a2',
    difficulty: 'advanced',
    question: 'What is a "watering hole attack" and why is it particularly dangerous?',
    options: [
      { id: 'a', text: 'Flooding a server with requests — dangerous because it causes downtime' },
      { id: 'b', text: 'Compromising a website frequently visited by targets — dangerous because users trust the site' },
      { id: 'c', text: 'Intercepting WiFi traffic at coffee shops — dangerous due to unencrypted data' },
      { id: 'd', text: 'Harvesting credentials from data breaches — dangerous due to password reuse' },
    ],
    correctOptionId: 'b',
    explanation: 'Watering hole attacks compromise websites known to be visited by the target group (e.g., an industry forum). When targets visit the legitimate-but-compromised site, malware is silently delivered. It\'s dangerous because users have no reason to be suspicious of sites they regularly trust.',
    points: 200,
  },
  {
    id: 'a3',
    difficulty: 'advanced',
    question: 'A URL looks identical to apple.com but uses "а" (Cyrillic а) instead of "a" (Latin a). What attack is this?',
    options: [
      { id: 'a', text: 'Typosquatting — registering a misspelled version of the domain' },
      { id: 'b', text: 'A homograph (IDN homograph) attack using visually identical Unicode characters' },
      { id: 'c', text: 'DNS hijacking — redirecting the real domain' },
      { id: 'd', text: 'SSL certificate forgery' },
    ],
    correctOptionId: 'b',
    explanation: 'IDN homograph attacks use Unicode characters from different scripts that are visually identical to Latin letters. "аpple.com" (Cyrillic а = U+0430) is a completely different domain from "apple.com" (Latin a = U+0061) but looks identical. Modern browsers show the Punycode equivalent (xn--pple-43d.com) to expose this.',
    points: 200,
  },
  {
    id: 'a4',
    difficulty: 'advanced',
    question: 'An attacker sends email that passes SPF, DKIM, and DMARC checks for their domain "paypa1.com". How is this dangerous?',
    options: [
      { id: 'a', text: 'It isn\'t — passing all three checks means the email is safe' },
      { id: 'b', text: 'Email authentication validates the domain, not its intent. The attacker owns a lookalike domain with valid records' },
      { id: 'c', text: 'SPF, DKIM, and DMARC cannot all pass simultaneously for a malicious domain' },
      { id: 'd', text: 'This is impossible without access to the legitimate company\'s DNS' },
    ],
    correctOptionId: 'b',
    explanation: 'Email authentication (SPF/DKIM/DMARC) only verifies that the email is authentically from the domain it claims — not that the domain is trusted. Attackers register convincing lookalike domains, configure proper authentication records, and send emails that pass all checks. Always check the visual domain, not just the authentication result.',
    points: 200,
  },
  {
    id: 'a5',
    difficulty: 'advanced',
    question: 'What is an Adversary-in-the-Middle (AiTM) phishing attack and why can it bypass MFA?',
    options: [
      { id: 'a', text: 'It uses AI to generate phishing content — bypasses MFA by appearing more convincing' },
      { id: 'b', text: 'It uses a reverse proxy to relay authentication in real-time, capturing session cookies after MFA completes' },
      { id: 'c', text: 'It targets the MFA app directly via a SMS SIM swap' },
      { id: 'd', text: 'It replaces the MFA token database on the server side' },
    ],
    correctOptionId: 'b',
    explanation: 'AiTM tools (like Evilginx2, Modlishka) act as transparent reverse proxies. The victim authenticates normally — including MFA — but the proxy captures the resulting session cookies. With those cookies, the attacker can access the account without needing the password or MFA code. Phishing-resistant MFA (FIDO2/hardware keys) blocks this by binding authentication to the legitimate domain.',
    points: 200,
  },
];

export function getQuestionsByDifficulty(difficulty: Difficulty): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.difficulty === difficulty);
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  label: string;
  points: number;
  color: string;
  description: string;
}> = {
  beginner: {
    label: 'Beginner',
    points: 100,
    color: 'accent',
    description: 'Foundational threat recognition',
  },
  intermediate: {
    label: 'Intermediate',
    points: 150,
    color: 'warning',
    description: 'Sophisticated attack patterns',
  },
  advanced: {
    label: 'Advanced',
    points: 200,
    color: 'destructive',
    description: 'Expert-level threat analysis',
  },
};
