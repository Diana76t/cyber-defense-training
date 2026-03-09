export type ScenarioType = 'phishing' | 'ransomware' | 'suspicious-login' | 'fake-website' | 'social-engineering';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ScenarioChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  points: number;
}

export interface ScenarioStep {
  id: string;
  stepNumber: number;
  title: string;
  situation: string;
  emailContent?: {
    from: string;
    to: string;
    subject: string;
    body: string;
  };
  choices: ScenarioChoice[];
}

export interface Scenario {
  id: string;
  title: string;
  type: ScenarioType;
  difficulty: Difficulty;
  description: string;
  context: string;
  icon: string;
  steps: ScenarioStep[];
  maxScore: number;
}

export const SCENARIOS: Scenario[] = [
  // ─── SCENARIO 1: Phishing Email ───────────────────────────────────────────
  {
    id: 'phishing-email',
    title: 'The Urgent Account Alert',
    type: 'phishing',
    difficulty: 'beginner',
    description: 'A convincing email arrives demanding immediate account verification. Analyze clues, make decisions, and see the consequences unfold.',
    context: 'It\'s 9am Monday morning. You open your work email and see an urgent message in your inbox requiring immediate action.',
    icon: 'Mail',
    steps: [
      {
        id: 's1-step1',
        stepNumber: 1,
        title: 'The Suspicious Email',
        situation: 'You receive the following email. What is your FIRST step before taking any action?',
        emailContent: {
          from: 'security@paypa1-support.com',
          to: 'you@company.com',
          subject: '⚠️ URGENT: Suspicious Login Detected — Verify Now or Account Locked',
          body: `Dear Valued Customer,

Our Security team has detected unauthorized access to your PayPal account from an unrecognized device in Moscow, Russia.

Your account will be PERMANENTLY SUSPENDED within 2 hours unless you verify your identity immediately.

[CLICK HERE TO VERIFY YOUR ACCOUNT]

Failure to respond will result in loss of access and pending transactions being cancelled.

— PayPal Security Team
© 2024 PayPal Inc. All rights reserved.`,
        },
        choices: [
          {
            id: 'a',
            text: 'Click "Verify Account" immediately to prevent being locked out',
            isCorrect: false,
            feedback: '🚨 Dangerous move! The link leads to a fake PayPal site that steals your credentials. Urgency is designed to make you act before thinking. The domain "paypa1-support.com" is NOT PayPal.',
            points: 0,
          },
          {
            id: 'b',
            text: 'Carefully examine the sender\'s email address before doing anything',
            isCorrect: true,
            feedback: '✅ Excellent instinct! "paypa1-support.com" uses the number "1" instead of the letter "l" — a classic typosquatting technique. Real PayPal only sends from @paypal.com addresses.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Reply to the email to ask if it\'s legitimate',
            isCorrect: false,
            feedback: '⚠️ Replying confirms your email address is active and hands it directly to the attacker. You\'d be communicating with the phisher, not PayPal.',
            points: 15,
          },
          {
            id: 'd',
            text: 'Open a new browser tab and navigate to PayPal.com directly to check your account',
            isCorrect: false,
            feedback: '⚠️ Going to the official site is safer than clicking the link, but you missed the key analysis step. Always examine the sender address first — "paypa1-support.com" uses a "1" instead of "l," confirming it\'s phishing before you take any action.',
            points: 50,
          },
        ],
      },
      {
        id: 's1-step2',
        stepNumber: 2,
        title: 'Analyzing the Link',
        situation: 'You hover your mouse over the "Verify Account" button without clicking. Your email client shows the actual destination URL:\n\nhttp://paypal-account-verify.net/login?user=you@company.com\n\nWhat is the most critical red flag here?',
        choices: [
          {
            id: 'a',
            text: 'It uses HTTP, not HTTPS — so the connection is unencrypted',
            isCorrect: false,
            feedback: '⚠️ HTTP is a red flag, but the bigger issue is the domain name. Even if this had HTTPS, "paypal-account-verify.net" is NOT owned by PayPal. Phishing sites frequently use HTTPS to appear legitimate.',
            points: 40,
          },
          {
            id: 'b',
            text: 'The real domain is "paypal-account-verify.net" — not paypal.com',
            isCorrect: true,
            feedback: '✅ Correct! This is the critical indicator. PayPal only operates from paypal.com. Attackers put "paypal" in the subdomain or path to trick a quick glance. Always read from right-to-left from the TLD (.net here).',
            points: 100,
          },
          {
            id: 'c',
            text: 'The URL contains your email address — that\'s suspicious',
            isCorrect: false,
            feedback: '⚠️ Pre-filled email addresses in URLs can be legitimate (for convenience). The far more important issue is the domain name itself.',
            points: 25,
          },
          {
            id: 'd',
            text: 'URLs that include "verify" are always phishing',
            isCorrect: false,
            feedback: '❌ That\'s not accurate — legitimate sites use "verify" in URLs too. Focus on the registered domain, not keywords in the URL path.',
            points: 10,
          },
        ],
      },
      {
        id: 's1-step3',
        stepNumber: 3,
        title: 'Taking the Right Action',
        situation: 'You\'ve confirmed this is a phishing email. You also realize you reuse the same password on PayPal, your email, and two other sites. What is the MOST comprehensive action you should take?',
        choices: [
          {
            id: 'a',
            text: 'Report the phishing email to IT but only change your PayPal password since that was the targeted account',
            isCorrect: false,
            feedback: '⚠️ Reporting is great, but changing only the PayPal password leaves your other accounts wide open. Since you reuse the same password, attackers will use "credential stuffing" — automatically trying stolen passwords on your email, bank, and every other site.',
            points: 45,
          },
          {
            id: 'b',
            text: 'Report the email to IT, change passwords on ALL reused accounts, and enable 2FA everywhere',
            isCorrect: true,
            feedback: '✅ Perfect response! Reporting protects your colleagues. Changing all reused passwords stops credential stuffing. Enabling 2FA means stolen passwords alone can\'t access your accounts.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Just delete the email — you didn\'t click anything, so you\'re safe',
            isCorrect: false,
            feedback: '❌ Deleting without reporting means your colleagues could still fall for this. Also, password reuse remains a serious risk regardless of whether you clicked.',
            points: 10,
          },
          {
            id: 'd',
            text: 'Forward the email to all colleagues to warn them about the threat',
            isCorrect: false,
            feedback: '❌ Never forward phishing emails — you could spread the threat. Instead, report to your IT/security team who can block it at the mail gateway and send a proper, safe warning.',
            points: 20,
          },
        ],
      },
    ],
    maxScore: 300,
  },

  // ─── SCENARIO 2: Ransomware Attack ─────────────────────────────────────────
  {
    id: 'ransomware-attack',
    title: 'Ransomware Outbreak',
    type: 'ransomware',
    difficulty: 'intermediate',
    description: 'Files on your workstation begin encrypting. A ransom note appears. Every second counts — your decisions will determine the outcome.',
    context: 'You\'re working on a critical project deadline. You opened an email attachment from "HR" about updated benefits forms. Suddenly, your files start renaming themselves with a ".locked" extension.',
    icon: 'Lock',
    steps: [
      {
        id: 's2-step1',
        stepNumber: 1,
        title: 'Files Are Encrypting — Now!',
        situation: 'A red skull screensaver appears: "YOUR FILES ARE ENCRYPTED. Pay 3 BTC within 48 hours or lose everything forever. DECRYPTION KEY: Pay at darkweb-ransom.onion"\n\nFile explorer shows hundreds of files becoming ".locked". What is your IMMEDIATE priority?',
        choices: [
          {
            id: 'a',
            text: 'Immediately disconnect the computer from the network (unplug ethernet, disable WiFi)',
            isCorrect: true,
            feedback: '✅ Critical correct action! Disconnecting from the network stops ransomware from spreading to file servers, shared drives, and other machines. This is the single most important immediate action.',
            points: 100,
          },
          {
            id: 'b',
            text: 'Pay the ransom immediately to stop the encryption',
            isCorrect: false,
            feedback: '🚨 Never pay! There\'s no guarantee you\'ll get the decryption key. Paying funds criminal operations and marks you as a willing victim for future attacks. Ransomware may continue encrypting even after payment.',
            points: 0,
          },
          {
            id: 'c',
            text: 'Restart the computer — it will stop the encryption process',
            isCorrect: false,
            feedback: '❌ Restarting doesn\'t stop ransomware and may actually trigger some variants to accelerate encryption. You also lose the opportunity to capture forensic evidence in memory.',
            points: 10,
          },
          {
            id: 'd',
            text: 'Keep working — maybe it will stop on its own if you ignore it',
            isCorrect: false,
            feedback: '🚨 Catastrophic choice. The longer ransomware runs, the more files it encrypts — potentially spreading to network drives affecting the entire organization. Stop it immediately.',
            points: 0,
          },
        ],
      },
      {
        id: 's2-step2',
        stepNumber: 2,
        title: 'Reporting to IT Security',
        situation: 'You\'ve disconnected the machine. IT Security is on the phone. What is the MOST useful information to provide them FIRST?',
        choices: [
          {
            id: 'a',
            text: 'The exact time it started, what you were doing (opened an email attachment), and the email details',
            isCorrect: true,
            feedback: '✅ Excellent! Precise timeline and patient zero information is critical for incident response. IT can identify the malware family, find Patient Zero, check for lateral movement, and notify potentially affected users.',
            points: 100,
          },
          {
            id: 'b',
            text: 'Just say "my computer got a virus" and ask them to fix it',
            isCorrect: false,
            feedback: '⚠️ Vague reporting significantly hampers the incident response. IT needs specifics to understand the scope, contain spread, and recover effectively.',
            points: 15,
          },
          {
            id: 'c',
            text: 'Mention only the ransom note details (amount, wallet address)',
            isCorrect: false,
            feedback: '⚠️ The ransom note details are useful for identifying the ransomware family, but IT urgently needs to know the infection vector (the email) to prevent others from opening the same attachment.',
            points: 30,
          },
          {
            id: 'd',
            text: 'Deny opening any attachments — you don\'t want to get in trouble',
            isCorrect: false,
            feedback: '🚨 Hiding information during an incident directly harms your organization. Others may be receiving the same malicious email right now. Honesty enables faster containment and is essential for forensics.',
            points: 0,
          },
        ],
      },
      {
        id: 's2-step3',
        stepNumber: 3,
        title: 'Recovery Decision',
        situation: 'IT asks about your backups. Which backup strategy provides the BEST protection against ransomware?',
        choices: [
          {
            id: 'a',
            text: 'Backups on the same network drive that was also encrypted',
            isCorrect: false,
            feedback: '🚨 Network-connected backups are often encrypted by ransomware alongside primary data. This is why this backup strategy fails — and why many organizations pay ransoms.',
            points: 0,
          },
          {
            id: 'b',
            text: 'Offline backups (air-gapped) or immutable cloud backups not connected to the same network',
            isCorrect: true,
            feedback: '✅ The 3-2-1 backup rule: 3 copies, 2 different media, 1 offsite. Air-gapped or immutable cloud backups can\'t be reached by ransomware. This is the gold standard for ransomware resilience.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Backups sent as email attachments to yourself',
            isCorrect: false,
            feedback: '⚠️ Email backups are impractical for large data volumes and slow to restore. They also depend on email being accessible, which may not be the case during an incident.',
            points: 20,
          },
          {
            id: 'd',
            text: 'No backups — paying the ransom is the only option',
            isCorrect: false,
            feedback: '❌ This is preventable! Organizations without proper backups lose critical data or pay ransoms. Regular, tested, offline backups are fundamental cybersecurity hygiene.',
            points: 0,
          },
        ],
      },
    ],
    maxScore: 300,
  },

  // ─── SCENARIO 3: Suspicious Login Alert ────────────────────────────────────
  {
    id: 'suspicious-login',
    title: 'Unknown Login Detected',
    type: 'suspicious-login',
    difficulty: 'beginner',
    description: 'You receive an alert: someone logged into your account from a country you\'ve never visited. Respond quickly and correctly.',
    context: 'It\'s 3:17 AM when your phone buzzes with a security notification from your email provider.',
    icon: 'AlertTriangle',
    steps: [
      {
        id: 's3-step1',
        stepNumber: 1,
        title: 'The Security Alert',
        situation: 'Your phone shows: "New sign-in to your account from Bucharest, Romania (IP: 185.220.xxx.xxx) at 3:14 AM. If this wasn\'t you, click here to secure your account."\n\nYou\'ve never been to Romania. What is the SAFEST immediate response?',
        choices: [
          {
            id: 'a',
            text: 'Click the "Secure your account" link in the notification',
            isCorrect: false,
            feedback: '⚠️ Be careful! This notification could itself be a phishing alert designed to steal your credentials. Never click links in notifications. Instead, open your email app directly and go to security settings.',
            points: 25,
          },
          {
            id: 'b',
            text: 'Open the email app directly (not via the link) and immediately change your password',
            isCorrect: true,
            feedback: '✅ Perfect! Opening the app directly ensures you\'re on the real site, not a phishing page. Changing the password immediately locks out the attacker.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Ignore it — it might just be a VPN or Tor exit node',
            isCorrect: false,
            feedback: '❌ Ignoring genuine account compromise lets attackers maintain access, harvest your contacts, send phishing emails from your account, and access your personal data. Always investigate.',
            points: 0,
          },
          {
            id: 'd',
            text: 'Wait until morning to deal with it properly',
            isCorrect: false,
            feedback: '⚠️ Every minute of delay allows the attacker more access. Account takeovers often happen in minutes — sensitive data is exfiltrated, passwords are changed, and contacts are exploited quickly.',
            points: 10,
          },
        ],
      },
      {
        id: 's3-step2',
        stepNumber: 2,
        title: 'Password Changed — What Next?',
        situation: 'You\'ve successfully changed your password. The unauthorized session shows the attacker accessed your email for about 8 minutes. What is the MOST complete set of follow-up actions?',
        choices: [
          {
            id: 'a',
            text: 'Nothing — changing the password fixed the problem',
            isCorrect: false,
            feedback: '⚠️ Changing the password is just the first step. Active sessions may still exist with the old credentials. Check what the attacker accessed and enable 2FA to prevent recurrence.',
            points: 15,
          },
          {
            id: 'b',
            text: 'Enable 2FA, sign out all other active sessions, and review recent account activity',
            isCorrect: true,
            feedback: '✅ Comprehensive recovery! 2FA prevents future unauthorized logins even if your password is stolen again. Signing out all sessions kills any active attacker sessions. Reviewing activity reveals what was accessed or sent.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Enable 2FA only — that should prevent future unauthorized access',
            isCorrect: false,
            feedback: '⚠️ 2FA alone is incomplete. The attacker may still have an active session right now — 2FA only protects future logins, not existing sessions. You must also sign out all sessions and audit what was accessed during those 8 minutes.',
            points: 50,
          },
          {
            id: 'd',
            text: 'Change your email address and start fresh',
            isCorrect: false,
            feedback: '❌ A new email address doesn\'t address the security of your existing account and is very disruptive. Secure the existing account with a new password + 2FA + session review instead.',
            points: 10,
          },
        ],
      },
      {
        id: 's3-step3',
        stepNumber: 3,
        title: 'Assessing the Damage',
        situation: 'Reviewing your activity log, you see the attacker opened 12 emails and sent 3 emails from your account to your contacts during the 8 minutes of access. What is the MOST urgent action to protect others?',
        choices: [
          {
            id: 'a',
            text: 'Notify your contacts that they may have received phishing emails from your compromised account',
            isCorrect: true,
            feedback: '✅ Critical! Your contacts received emails from a trusted source (you) and may have clicked malicious links or shared sensitive information. Prompt notification can prevent them from being victimized too.',
            points: 100,
          },
          {
            id: 'b',
            text: 'Delete the sent emails from your Sent folder to clean up',
            isCorrect: false,
            feedback: '❌ Deleting evidence hampers investigation and doesn\'t help your contacts. The emails have already been delivered. You need to warn recipients, not hide the incident.',
            points: 0,
          },
          {
            id: 'c',
            text: 'Quietly review which of your own emails were read before telling anyone',
            isCorrect: false,
            feedback: '⚠️ Auditing your own inbox matters, but it doesn\'t protect others. Your contacts already received malicious emails from your trusted address — they could be clicking phishing links right now. Warning them is far more urgent than reviewing your own exposure.',
            points: 40,
          },
          {
            id: 'd',
            text: 'Nothing — the attacker only had 8 minutes, so the damage must be minimal',
            isCorrect: false,
            feedback: '❌ 8 minutes is plenty of time to exfiltrate contacts, send phishing emails, reset passwords on linked accounts, and harvest sensitive documents. Never underestimate the speed of a determined attacker.',
            points: 5,
          },
        ],
      },
    ],
    maxScore: 300,
  },

  // ─── SCENARIO 4: Fake Website ───────────────────────────────────────────────
  {
    id: 'fake-website',
    title: 'The Banking Imposter',
    type: 'fake-website',
    difficulty: 'intermediate',
    description: 'You\'re redirected to what looks exactly like your online banking portal. Something feels off. Can you spot the deception before it\'s too late?',
    context: 'You search Google for your bank and click the top result (a paid advertisement). The page looks identical to your bank\'s website.',
    icon: 'Globe',
    steps: [
      {
        id: 's4-step1',
        stepNumber: 1,
        title: 'Something Feels Off',
        situation: 'The page looks exactly like your bank\'s website. The logo is correct, the layout matches, even the "security tips" sidebar is there. What is the MOST reliable way to verify this site is legitimate?',
        choices: [
          {
            id: 'a',
            text: 'The website\'s design — it looks professional so it must be real',
            isCorrect: false,
            feedback: '❌ Website design is trivially copyable in minutes. Modern phishing kits create pixel-perfect replicas of real sites. Never use visual design as a trust indicator.',
            points: 0,
          },
          {
            id: 'b',
            text: 'The URL in the address bar to verify the exact domain name',
            isCorrect: true,
            feedback: '✅ The URL is the most reliable trust indicator. The address bar shows "mybank-secure-login.com" — not your bank\'s real domain. That single character difference matters enormously.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Whether the page has a padlock icon',
            isCorrect: false,
            feedback: '⚠️ Phishing sites routinely have HTTPS padlocks. A padlock means the connection is encrypted, not that the site is legitimate. Always verify the actual domain name.',
            points: 25,
          },
          {
            id: 'd',
            text: 'Log in and see if your account balance looks correct',
            isCorrect: false,
            feedback: '🚨 If you log in on a fake site, you\'ve just given attackers your credentials. They capture them in real-time and can immediately access your real account.',
            points: 0,
          },
        ],
      },
      {
        id: 's4-step2',
        stepNumber: 2,
        title: 'Verifying the Domain',
        situation: 'You check the URL and see: https://firstnationalbank-secure.com\n\nYour actual bank\'s domain is: firstnationalbank.com\n\nThe SSL certificate shows "firstnationalbank-secure.com is secure." What do you do?',
        choices: [
          {
            id: 'a',
            text: 'The SSL certificate says it\'s secure, so it should be fine to log in',
            isCorrect: false,
            feedback: '❌ An SSL certificate only verifies that the connection to "firstnationalbank-secure.com" is encrypted — not that this site is your bank. The certificate authority only checked that the applicant owns the domain.',
            points: 0,
          },
          {
            id: 'b',
            text: 'Close the tab immediately and navigate directly to firstnationalbank.com',
            isCorrect: true,
            feedback: '✅ Correct! "firstnationalbank-secure.com" is not the same as "firstnationalbank.com" — it\'s a completely different domain. Close it and type your bank\'s real URL directly.',
            points: 100,
          },
          {
            id: 'c',
            text: 'The domain has "firstnationalbank" in it, so it must be the same company',
            isCorrect: false,
            feedback: '❌ Attackers register domains that contain the legitimate brand name to create an impression of legitimacy. "firstnationalbank-secure.com" is NOT owned by First National Bank.',
            points: 0,
          },
          {
            id: 'd',
            text: 'Enter your username only to test if the site responds correctly',
            isCorrect: false,
            feedback: '⚠️ Even entering just a username gives attackers your account identifier, which they can use for targeted attacks or account enumeration.',
            points: 15,
          },
        ],
      },
      {
        id: 's4-step3',
        stepNumber: 3,
        title: 'You Already Logged In',
        situation: 'Scenario twist: A colleague admits they already entered their full banking credentials on this fake site before realizing. What is their FIRST priority action?',
        choices: [
          {
            id: 'a',
            text: 'Call the bank\'s official phone number and change their online banking password immediately',
            isCorrect: true,
            feedback: '✅ Immediate action is critical. Calling the bank alerts them to potential fraud and lets them flag the account. Changing the password locks out the attacker before they can use the stolen credentials.',
            points: 100,
          },
          {
            id: 'b',
            text: 'Wait and monitor their account for suspicious activity',
            isCorrect: false,
            feedback: '⚠️ Credential stuffing attacks happen within seconds of theft. By the time you notice suspicious activity, the attacker may have already transferred funds or changed account settings.',
            points: 10,
          },
          {
            id: 'c',
            text: 'Clear browser history and cookies to remove the fake site',
            isCorrect: false,
            feedback: '❌ Clearing history doesn\'t help — the attacker already captured the credentials on their server. Focus on securing the compromised account, not cleaning up your browser.',
            points: 5,
          },
          {
            id: 'd',
            text: 'Report the fake site to Google Safe Browsing only',
            isCorrect: false,
            feedback: '⚠️ Reporting is valuable but doesn\'t protect the compromised account. Securing the bank account must come first, then reporting to help protect others.',
            points: 20,
          },
        ],
      },
    ],
    maxScore: 300,
  },

  // ─── SCENARIO 5: Social Engineering ────────────────────────────────────────
  {
    id: 'social-engineering',
    title: 'The IT Helpdesk Call',
    type: 'social-engineering',
    difficulty: 'advanced',
    description: 'A sophisticated attacker calls posing as your IT department with highly convincing details. This advanced scenario tests your ability to resist social pressure.',
    context: 'You receive a phone call. The caller ID shows "IT Helpdesk (Ext. 4821)". The voice is professional and knows your full name, your manager\'s name, and mentions a "critical security incident" in your department.',
    icon: 'Phone',
    steps: [
      {
        id: 's5-step1',
        stepNumber: 1,
        title: 'The Convincing Caller',
        situation: '"Hi [Your Name], this is Marcus from IT Security. We\'re responding to a critical incident — your machine is actively exfiltrating data to an external server. Your manager Sarah is already aware. I need your current password to remote into your machine immediately and stop the breach. This is time-sensitive."\n\nWhat is the BEST immediate response?',
        choices: [
          {
            id: 'a',
            text: 'Give the password — they know your name, manager, and IT extension details',
            isCorrect: false,
            feedback: '🚨 This information is easily found via LinkedIn, company directories, and social media. Attackers extensively research targets. Legitimate IT NEVER asks for your password — they have admin tools that don\'t require it.',
            points: 0,
          },
          {
            id: 'b',
            text: 'Tell them you\'ll call back on the official IT helpdesk number to verify, then hang up',
            isCorrect: true,
            feedback: '✅ Perfect! Hanging up and calling back on a verified number defeats caller ID spoofing and social pressure tactics. A real IT emergency can wait 2 minutes for this verification step.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Ask them security questions to verify their identity on the call',
            isCorrect: false,
            feedback: '⚠️ An attacker who has already researched you can answer most security questions. Call-back verification is the gold standard, not Q&A on an inbound call.',
            points: 30,
          },
          {
            id: 'd',
            text: 'Give only your username, not your full password',
            isCorrect: false,
            feedback: '❌ Even partial credentials help attackers. Username + a later phishing attack can yield the full password. Give nothing sensitive on an unverified inbound call.',
            points: 10,
          },
        ],
      },
      {
        id: 's5-step2',
        stepNumber: 2,
        title: 'Escalating Pressure',
        situation: 'You say you\'ll call back. The caller says: "There\'s no time — every second of delay means more data is being stolen. Your manager Sarah will hear about your non-cooperation during a security incident. I just need your password for 5 minutes."\n\nHow do you respond?',
        choices: [
          {
            id: 'a',
            text: 'Relent and give the password — you don\'t want trouble with your manager',
            isCorrect: false,
            feedback: '🚨 This pressure tactic — invoking authority and consequences — is a textbook social engineering technique. Real security professionals NEVER use threats or pressure to obtain credentials. Your instinct to verify is correct.',
            points: 0,
          },
          {
            id: 'b',
            text: 'Firmly say "I\'m following security policy — I will call you back on the official IT line" and hang up',
            isCorrect: true,
            feedback: '✅ Excellent! Security policy is your shield. When someone pressures you to bypass security procedures, that\'s the biggest red flag of all. Legitimate requests can survive a verification step.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Text your manager Sarah to ask if this IT request is real',
            isCorrect: false,
            feedback: '⚠️ Reaching out to Sarah seems reasonable, but the attacker already knows her name — they may have compromised her phone or be impersonating her too. The safest method is always calling back on the official, published IT helpdesk number.',
            points: 35,
          },
          {
            id: 'd',
            text: 'Put them on hold to think about it',
            isCorrect: false,
            feedback: '⚠️ Delaying without resolving still leaves you in an uncomfortable position. Make the decision: verify via callback or hang up. Don\'t stay on the line with an active social engineer.',
            points: 15,
          },
        ],
      },
      {
        id: 's5-step3',
        stepNumber: 3,
        title: 'Reporting the Incident',
        situation: 'You hung up and verified — IT confirms they made no such call. You\'ve been targeted by a vishing (voice phishing) attack. What should you do now?',
        choices: [
          {
            id: 'a',
            text: 'Report to IT Security with the call time, caller\'s details, and the information they requested',
            isCorrect: true,
            feedback: '✅ Reporting with full details allows IT to alert other employees, investigate whether others were targeted or compromised, and potentially trace the attacker. Your vigilance protected the organization.',
            points: 100,
          },
          {
            id: 'b',
            text: 'Tell a few colleagues informally but don\'t officially report it',
            isCorrect: false,
            feedback: '⚠️ Informal warnings are better than nothing, but official reporting triggers a proper incident response process. IT needs to know to protect others and document the attempted attack.',
            points: 25,
          },
          {
            id: 'c',
            text: 'Do nothing — you didn\'t give any information so there\'s nothing to report',
            isCorrect: false,
            feedback: '⚠️ Even unsuccessful attacks should be reported! The attacker knows your name, manager, and attempted this specific approach. Others in your organization may be targeted next, possibly with less resistance.',
            points: 15,
          },
          {
            id: 'd',
            text: 'Call the number back to confront the attacker',
            isCorrect: false,
            feedback: '❌ Never engage with attackers. The number is likely spoofed or belongs to a VoIP service. You\'d be wasting time and potentially giving the attacker more information or opportunities.',
            points: 0,
          },
        ],
      },
    ],
    maxScore: 300,
  },
];

export const SCENARIO_TYPE_CONFIG: Record<ScenarioType, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  phishing: { label: 'Phishing Email', color: 'text-primary', bgColor: 'bg-primary/10' },
  ransomware: { label: 'Ransomware', color: 'text-destructive', bgColor: 'bg-destructive/10' },
  'suspicious-login': { label: 'Account Takeover', color: 'text-warning', bgColor: 'bg-warning/10' },
  'fake-website': { label: 'Fake Website', color: 'text-accent', bgColor: 'bg-accent/10' },
  'social-engineering': { label: 'Social Engineering', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
};
