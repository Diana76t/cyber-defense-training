export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';
export type AlertCategory = 'authentication' | 'malware' | 'phishing' | 'network';

export interface Evidence {
  type: 'log' | 'ip' | 'email' | 'file' | 'network';
  label: string;
  content: string;
}

export interface AlertAction {
  id: string;
  text: string;
  isCorrect: boolean;
  points: number;
  feedback: string;
}

export interface AlertStep {
  id: string;
  stepNumber: number;
  title: string;
  question: string;
  evidence: Evidence[];
  actions: AlertAction[];
}

export interface SocAlert {
  id: string;
  title: string;
  category: AlertCategory;
  priority: AlertPriority;
  summary: string;
  timestamp: string;
  source: string;
  steps: AlertStep[];
  maxScore: number;
}

export const PRIORITY_CONFIG: Record<AlertPriority, { label: string; color: string; bgColor: string; badge: string }> = {
  low: { label: 'LOW', color: 'text-accent', bgColor: 'bg-accent/10', badge: 'P4' },
  medium: { label: 'MEDIUM', color: 'text-warning', bgColor: 'bg-warning/10', badge: 'P3' },
  high: { label: 'HIGH', color: 'text-orange-500', bgColor: 'bg-orange-500/10', badge: 'P2' },
  critical: { label: 'CRITICAL', color: 'text-destructive', bgColor: 'bg-destructive/10', badge: 'P1' },
};

export const CATEGORY_CONFIG: Record<AlertCategory, { label: string; color: string; icon: string }> = {
  authentication: { label: 'Authentication', color: 'text-blue-400', icon: '🔐' },
  malware: { label: 'Malware', color: 'text-red-400', icon: '🦠' },
  phishing: { label: 'Phishing', color: 'text-yellow-400', icon: '🎣' },
  network: { label: 'Network', color: 'text-purple-400', icon: '🌐' },
};

export const SOC_ALERTS: SocAlert[] = [
  {
    id: 'brute-force-attack',
    title: 'Multiple Failed Login Attempts Detected',
    category: 'authentication',
    priority: 'high',
    summary: 'SIEM detected 47 failed login attempts to user account "admin.thompson" within 2 minutes from external IP.',
    timestamp: '2024-01-15 14:32:18 UTC',
    source: 'Azure AD / SIEM',
    steps: [
      {
        id: 'bf-1',
        stepNumber: 1,
        title: 'Initial Triage',
        question: 'Based on the evidence, what is your first analysis step?',
        evidence: [
          { type: 'log', label: 'Authentication Log', content: '14:30:12 - FAILED LOGIN - user: admin.thompson - IP: 185.234.72.19 - Reason: Invalid password\n14:30:14 - FAILED LOGIN - user: admin.thompson - IP: 185.234.72.19 - Reason: Invalid password\n14:30:16 - FAILED LOGIN - user: admin.thompson - IP: 185.234.72.19 - Reason: Invalid password\n... (44 more attempts)\n14:32:18 - FAILED LOGIN - user: admin.thompson - IP: 185.234.72.19 - Reason: Account locked' },
          { type: 'ip', label: 'Source IP', content: '185.234.72.19 - Location: Russia - ISP: Unknown VPS Provider - Reputation: Malicious (Threat Intel)' },
        ],
        actions: [
          { id: 'bf-1a', text: 'Immediately disable the user account', isCorrect: false, points: 5, feedback: 'The account is already locked. Disabling without investigation may disrupt legitimate user access.' },
          { id: 'bf-1b', text: 'Check if the IP has been seen in other authentication attempts', isCorrect: true, points: 15, feedback: 'Correct! Checking for lateral movement attempts from this IP helps determine the scope of the attack.' },
          { id: 'bf-1c', text: 'Close the alert as false positive', isCorrect: false, points: 0, feedback: 'This is clearly malicious activity from a known bad IP. Never dismiss without proper investigation.' },
          { id: 'bf-1d', text: 'Wait for more failed attempts before taking action', isCorrect: false, points: 0, feedback: 'The attack is active. Waiting allows potential compromise if credentials are guessed.' },
        ],
      },
      {
        id: 'bf-2',
        stepNumber: 2,
        title: 'Scope Assessment',
        question: 'Your search reveals this IP attempted logins to 12 other accounts. What action do you take?',
        evidence: [
          { type: 'log', label: 'Extended Search Results', content: 'IP 185.234.72.19 activity (last 24h):\n- admin.thompson: 47 attempts (LOCKED)\n- sarah.chen: 23 attempts (LOCKED)\n- mike.rodriguez: 15 attempts (ACTIVE)\n- cfo.jenkins: 8 attempts (ACTIVE)\n- it.support: 31 attempts (LOCKED)\n... 7 more accounts targeted' },
        ],
        actions: [
          { id: 'bf-2a', text: 'Block the IP at the firewall and force password reset for all targeted accounts', isCorrect: true, points: 20, feedback: 'Excellent! Blocking the IP stops the attack, and forced password resets protect accounts that may have been compromised.' },
          { id: 'bf-2b', text: 'Only reset passwords for locked accounts', isCorrect: false, points: 5, feedback: 'Active accounts may have been compromised before lockout. All targeted accounts need password resets.' },
          { id: 'bf-2c', text: 'Send an email to all users warning about the attack', isCorrect: false, points: 3, feedback: 'While communication is important, immediate containment actions take priority.' },
          { id: 'bf-2d', text: 'Escalate to management before taking action', isCorrect: false, points: 5, feedback: 'Active attacks require immediate response. Escalate while taking containment actions, not before.' },
        ],
      },
      {
        id: 'bf-3',
        stepNumber: 3,
        title: 'Root Cause Analysis',
        question: 'Investigation reveals the attacker used a credential list. What is the most likely attack type?',
        evidence: [
          { type: 'log', label: 'Pattern Analysis', content: 'Attack pattern: Sequential usernames with common passwords\nPasswords attempted: Password123!, Company2024, Welcome1, Summer2023\nTiming: 2-second intervals between attempts\nUser-Agent: Python-requests/2.28.1' },
        ],
        actions: [
          { id: 'bf-3a', text: 'Password spraying attack using leaked credentials', isCorrect: true, points: 15, feedback: 'Correct! The pattern of common passwords against multiple accounts with automated timing indicates a password spraying attack.' },
          { id: 'bf-3b', text: 'Targeted phishing campaign', isCorrect: false, points: 0, feedback: 'Phishing involves deception to steal credentials, not automated login attempts.' },
          { id: 'bf-3c', text: 'Insider threat from disgruntled employee', isCorrect: false, points: 0, feedback: 'The external IP and automated pattern indicate external attacker, not insider.' },
          { id: 'bf-3d', text: 'Misconfigured application causing false positives', isCorrect: false, points: 0, feedback: 'The malicious IP reputation and attack pattern clearly indicate intentional malicious activity.' },
        ],
      },
    ],
    maxScore: 50,
  },
  {
    id: 'malware-detection',
    title: 'Endpoint Malware Detection - Emotet Variant',
    category: 'malware',
    priority: 'critical',
    summary: 'EDR detected and quarantined suspected Emotet malware on workstation WS-FIN-042. User reported opening email attachment.',
    timestamp: '2024-01-15 09:15:33 UTC',
    source: 'CrowdStrike EDR',
    steps: [
      {
        id: 'mal-1',
        stepNumber: 1,
        title: 'Initial Assessment',
        question: 'The EDR quarantined the malware. What is your immediate priority?',
        evidence: [
          { type: 'file', label: 'Malware Details', content: 'File: Invoice_Q4_2024.xlsm\nHash: a3b9c2d4e5f6789...\nDetection: Emotet.Dropper.Gen\nAction: Quarantined\nUser: jennifer.walsh\nPath: C:\\Users\\jennifer.walsh\\Downloads\\' },
          { type: 'log', label: 'Process Activity', content: '09:14:22 - EXCEL.EXE spawned powershell.exe\n09:14:23 - PowerShell executed encoded command\n09:14:24 - Connection attempt to 45.142.213.87:443 (BLOCKED)\n09:14:25 - EDR terminated malicious process' },
        ],
        actions: [
          { id: 'mal-1a', text: 'Isolate the endpoint from the network immediately', isCorrect: true, points: 20, feedback: 'Correct! Network isolation prevents potential lateral movement and C2 communication, even though EDR blocked initial attempts.' },
          { id: 'mal-1b', text: 'Close the alert since EDR already quarantined the threat', isCorrect: false, points: 0, feedback: 'EDR containment is not guaranteed complete. Emotet is sophisticated and may have secondary payloads.' },
          { id: 'mal-1c', text: 'Contact the user to ask about the email', isCorrect: false, points: 5, feedback: 'User interview is important but network isolation takes priority to prevent spread.' },
          { id: 'mal-1d', text: 'Run a full system scan before taking other actions', isCorrect: false, points: 5, feedback: 'Scanning takes time. Isolation should happen immediately while investigation continues.' },
        ],
      },
      {
        id: 'mal-2',
        stepNumber: 2,
        title: 'Scope Determination',
        question: 'You need to determine if other systems are affected. What do you search for?',
        evidence: [
          { type: 'email', label: 'Phishing Email Header', content: 'From: accounting@supp1ier-invoices.com\nTo: jennifer.walsh@company.com\nSubject: Urgent: Q4 Invoice Attached\nReceived: 09:12:45 UTC\nX-Originating-IP: 91.234.56.78' },
        ],
        actions: [
          { id: 'mal-2a', text: 'Search email logs for all recipients of emails from the same sender domain', isCorrect: true, points: 20, feedback: 'Excellent! Finding all recipients helps identify other potential victims who may have received the same phishing campaign.' },
          { id: 'mal-2b', text: 'Only check computers in the Finance department', isCorrect: false, points: 5, feedback: 'The phishing campaign may have targeted users across departments. Limiting scope risks missing infections.' },
          { id: 'mal-2c', text: 'Search for the specific file hash across all endpoints', isCorrect: false, points: 10, feedback: 'Good start, but attackers often use different file hashes. Searching by sender domain is more comprehensive.' },
          { id: 'mal-2d', text: 'Wait for other EDR alerts before expanding investigation', isCorrect: false, points: 0, feedback: 'Proactive hunting is essential. Waiting allows potential infections to progress undetected.' },
        ],
      },
      {
        id: 'mal-3',
        stepNumber: 3,
        title: 'Containment & Remediation',
        question: 'Email search reveals 15 users received the same phishing email. 3 opened the attachment. What is your response?',
        evidence: [
          { type: 'log', label: 'Email Analysis', content: 'Recipients who opened attachment:\n1. jennifer.walsh (WS-FIN-042) - DETECTED\n2. robert.kim (WS-HR-019) - No detection\n3. amanda.price (WS-SALES-007) - No detection\n\n12 users received but did not open attachment' },
        ],
        actions: [
          { id: 'mal-3a', text: 'Isolate all 3 endpoints, run forensic analysis, and block the sender domain', isCorrect: true, points: 20, feedback: 'Perfect! Even without EDR detection, those endpoints need isolation and analysis. Blocking the domain prevents future attempts.' },
          { id: 'mal-3b', text: 'Only investigate jennifer.walsh since EDR detected malware there', isCorrect: false, points: 5, feedback: 'Absence of detection doesn\'t mean absence of infection. All endpoints that opened the attachment need investigation.' },
          { id: 'mal-3c', text: 'Send a company-wide email about the phishing campaign', isCorrect: false, points: 5, feedback: 'Awareness is good but containment comes first. Communication should follow immediate response actions.' },
          { id: 'mal-3d', text: 'Reimage jennifer.walsh\'s computer and return to normal operations', isCorrect: false, points: 3, feedback: 'Reimaging without full investigation may miss persistence mechanisms and leaves other potential infections unaddressed.' },
        ],
      },
    ],
    maxScore: 60,
  },
  {
    id: 'phishing-campaign',
    title: 'Reported Phishing Email - Credential Harvesting',
    category: 'phishing',
    priority: 'medium',
    summary: 'User reported suspicious email claiming to be from IT department requesting password verification. Multiple similar reports received.',
    timestamp: '2024-01-15 11:45:22 UTC',
    source: 'User Report / Phishing Mailbox',
    steps: [
      {
        id: 'ph-1',
        stepNumber: 1,
        title: 'Email Analysis',
        question: 'Analyze the reported email. What indicators suggest this is phishing?',
        evidence: [
          { type: 'email', label: 'Reported Email', content: 'From: IT-Support@company-helpdesk.net\nTo: multiple recipients\nSubject: Urgent: Password Expiration Notice\n\nDear Employee,\n\nYour password will expire in 24 hours. Click below to verify:\nhttps://company-login.secure-verify.net/auth\n\nIT Department' },
          { type: 'log', label: 'Email Headers', content: 'Return-Path: bounce@mass-mailer.ru\nX-Originating-IP: 178.62.43.221\nSPF: FAIL\nDKIM: FAIL\nReceived: from mail.mass-mailer.ru' },
        ],
        actions: [
          { id: 'ph-1a', text: 'External domain mimicking internal IT, failed SPF/DKIM, suspicious link domain', isCorrect: true, points: 15, feedback: 'Correct! Multiple red flags: external sender posing as IT, failed email authentication, and a lookalike phishing domain.' },
          { id: 'ph-1b', text: 'The email looks legitimate, this may be a false positive', isCorrect: false, points: 0, feedback: 'The evidence clearly shows failed authentication checks and external origin. This is a phishing attempt.' },
          { id: 'ph-1c', text: 'Only the suspicious link is concerning', isCorrect: false, points: 5, feedback: 'While the link is suspicious, the failed SPF/DKIM and external origin are equally important indicators.' },
          { id: 'ph-1d', text: 'Need more information to determine if this is phishing', isCorrect: false, points: 3, feedback: 'The provided evidence is sufficient to confirm this is phishing. Multiple indicators are present.' },
        ],
      },
      {
        id: 'ph-2',
        stepNumber: 2,
        title: 'Impact Assessment',
        question: 'You need to determine how many users may have fallen victim. What do you check?',
        evidence: [
          { type: 'log', label: 'Email Gateway Stats', content: 'Emails from IT-Support@company-helpdesk.net:\nDelivered: 342\nBlocked by spam filter: 89\nUser-reported: 23\nTime range: 11:30 - 11:45 UTC' },
        ],
        actions: [
          { id: 'ph-2a', text: 'Check proxy logs for connections to the phishing domain', isCorrect: true, points: 20, feedback: 'Excellent! Proxy logs will show which users clicked the link and potentially submitted credentials.' },
          { id: 'ph-2b', text: 'Assume only the 23 reporters are at risk', isCorrect: false, points: 0, feedback: 'Reporters are the safe users! The 319 who didn\'t report are more likely to have clicked the link.' },
          { id: 'ph-2c', text: 'Send a survey asking users if they clicked the link', isCorrect: false, points: 5, feedback: 'Users may not admit to clicking. Technical logs provide accurate evidence.' },
          { id: 'ph-2d', text: 'Wait for helpdesk tickets about account issues', isCorrect: false, points: 0, feedback: 'Reactive waiting allows attackers time to use stolen credentials. Proactive investigation is required.' },
        ],
      },
      {
        id: 'ph-3',
        stepNumber: 3,
        title: 'Remediation',
        question: 'Proxy logs show 28 users visited the phishing site. What is the appropriate response?',
        evidence: [
          { type: 'log', label: 'Proxy Log Analysis', content: 'Users who visited https://company-login.secure-verify.net:\n- 28 unique users\n- 19 users submitted POST data (likely credentials)\n- Average time on page: 45 seconds\n- 9 users left immediately (no submission)' },
        ],
        actions: [
          { id: 'ph-3a', text: 'Force password reset for 19 users who submitted data, block domain, and notify all 342 recipients', isCorrect: true, points: 20, feedback: 'Perfect response! Credential reset for compromised accounts, domain blocking, and user awareness covers all bases.' },
          { id: 'ph-3b', text: 'Reset passwords for all 342 email recipients', isCorrect: false, points: 10, feedback: 'While cautious, this causes unnecessary disruption. Focus on the 19 confirmed compromised accounts.' },
          { id: 'ph-3c', text: 'Only reset passwords for the 19 users, no need to notify others', isCorrect: false, points: 10, feedback: 'Notification helps prevent future clicks and builds security awareness. All recipients should be informed.' },
          { id: 'ph-3d', text: 'Block the domain and consider the incident resolved', isCorrect: false, points: 5, feedback: 'Blocking alone doesn\'t address compromised credentials. Password resets are essential.' },
        ],
      },
    ],
    maxScore: 55,
  },
  {
    id: 'unusual-traffic',
    title: 'Unusual Outbound Traffic to Tor Exit Node',
    category: 'network',
    priority: 'high',
    summary: 'Network monitoring detected sustained outbound connections from internal server to known Tor exit nodes during off-hours.',
    timestamp: '2024-01-15 02:34:56 UTC',
    source: 'Network IDS / Firewall',
    steps: [
      {
        id: 'net-1',
        stepNumber: 1,
        title: 'Traffic Analysis',
        question: 'Review the network evidence. What is your initial assessment?',
        evidence: [
          { type: 'network', label: 'Firewall Logs', content: 'Source: 10.50.20.15 (SRV-DB-PROD-01)\nDestination: 185.220.101.xx (Tor Exit Node)\nPort: 443\nBytes Out: 2.4 GB\nBytes In: 156 MB\nDuration: 4 hours 22 minutes\nTime: 02:00 - 06:22 UTC' },
          { type: 'ip', label: 'Source System', content: 'Hostname: SRV-DB-PROD-01\nRole: Production Database Server\nOS: Windows Server 2019\nOwner: Database Team\nCritical Asset: Yes' },
        ],
        actions: [
          { id: 'net-1a', text: 'Potential data exfiltration - critical server sending large data to anonymizing network', isCorrect: true, points: 20, feedback: 'Correct! A production database server sending 2.4GB to Tor during off-hours is a major red flag for data exfiltration.' },
          { id: 'net-1b', text: 'Likely a misconfigured backup job', isCorrect: false, points: 3, feedback: 'Backups don\'t go to Tor exit nodes. This pattern strongly suggests malicious activity.' },
          { id: 'net-1c', text: 'Normal traffic, Tor usage may be legitimate', isCorrect: false, points: 0, feedback: 'Production database servers should never communicate with Tor. This is highly suspicious.' },
          { id: 'net-1d', text: 'False positive from the IDS', isCorrect: false, points: 0, feedback: 'The evidence clearly shows real traffic to confirmed Tor exit nodes. This requires investigation.' },
        ],
      },
      {
        id: 'net-2',
        stepNumber: 2,
        title: 'Immediate Response',
        question: 'Given the severity, what is your immediate action?',
        evidence: [
          { type: 'log', label: 'Current Connection Status', content: 'Connection State: ACTIVE\nData transfer: Ongoing\nLast packet: 2 seconds ago\nEstimated remaining data: Unknown' },
        ],
        actions: [
          { id: 'net-2a', text: 'Immediately isolate the server and preserve memory for forensics', isCorrect: true, points: 20, feedback: 'Excellent! Stopping active exfiltration is critical. Memory capture preserves evidence of running malware/tools.' },
          { id: 'net-2b', text: 'Monitor the traffic to understand what data is being sent', isCorrect: false, points: 5, feedback: 'Monitoring allows more data loss. Active exfiltration must be stopped immediately.' },
          { id: 'net-2c', text: 'Contact the database team to ask about scheduled jobs', isCorrect: false, points: 3, feedback: 'This delays response. A production DB server talking to Tor at 2 AM is not a scheduled job.' },
          { id: 'net-2d', text: 'Block the destination IP and continue monitoring', isCorrect: false, points: 10, feedback: 'Blocking helps but the server may have other C2 channels. Full isolation is required.' },
        ],
      },
      {
        id: 'net-3',
        stepNumber: 3,
        title: 'Investigation',
        question: 'Forensic analysis reveals a web shell on the server. What is the likely attack chain?',
        evidence: [
          { type: 'file', label: 'Forensic Findings', content: 'Found: C:\\inetpub\\wwwroot\\upload.aspx (Web Shell)\nCreated: 2024-01-10 15:22:33\nProcess: w3wp.exe spawned cmd.exe\nTools found: Mimikatz, PsExec, 7zip\nSQL exports: customer_data.csv (2.1GB), financial_records.csv (300MB)' },
        ],
        actions: [
          { id: 'net-3a', text: 'Web application compromise → web shell → credential theft → data staging → exfiltration', isCorrect: true, points: 20, feedback: 'Correct! Classic attack pattern: initial access via web vuln, persistence via web shell, lateral movement tools, and data theft.' },
          { id: 'net-3b', text: 'Insider threat using legitimate access', isCorrect: false, points: 5, feedback: 'The web shell and hacking tools indicate external compromise, not insider access.' },
          { id: 'net-3c', text: 'Ransomware attack in progress', isCorrect: false, points: 5, feedback: 'The evidence shows data exfiltration, not encryption. This appears to be espionage/theft focused.' },
          { id: 'net-3d', text: 'Cryptocurrency mining operation', isCorrect: false, points: 0, feedback: 'Mining doesn\'t involve data exfiltration or the tools found. This is clearly data theft.' },
        ],
      },
    ],
    maxScore: 60,
  },
  {
    id: 'impossible-travel',
    title: 'Impossible Travel Alert - Executive Account',
    category: 'authentication',
    priority: 'critical',
    summary: 'CFO account authenticated from New York and Singapore within 15 minutes. User confirmed to be in New York office.',
    timestamp: '2024-01-15 08:45:12 UTC',
    source: 'Azure AD Identity Protection',
    steps: [
      {
        id: 'it-1',
        stepNumber: 1,
        title: 'Alert Validation',
        question: 'The CFO confirms they are in New York. How do you assess the Singapore login?',
        evidence: [
          { type: 'log', label: 'Authentication Events', content: '08:30:45 UTC - SUCCESS - cfo.martinez@company.com\n  Location: New York, USA\n  IP: 203.45.67.89 (Corporate Office)\n  Device: LAPTOP-CFO-001 (Compliant)\n\n08:45:12 UTC - SUCCESS - cfo.martinez@company.com\n  Location: Singapore\n  IP: 103.252.118.42 (Residential ISP)\n  Device: Unknown device\n  MFA: Approved via push notification' },
          { type: 'ip', label: 'Singapore IP Analysis', content: 'IP: 103.252.118.42\nISP: Singapore Residential Broadband\nProxy/VPN: Not detected\nReputation: Neutral\nPrevious company activity: None' },
        ],
        actions: [
          { id: 'it-1a', text: 'Account compromise confirmed - attacker has both credentials and MFA access', isCorrect: true, points: 20, feedback: 'Correct! The user confirmed their location, MFA was approved, but the login is from Singapore. This indicates MFA bypass or SIM swap.' },
          { id: 'it-1b', text: 'VPN usage causing false positive', isCorrect: false, points: 5, feedback: 'VPN was not detected, and the user confirmed they are in NY. This is not a VPN issue.' },
          { id: 'it-1c', text: 'The user may have approved MFA accidentally', isCorrect: false, points: 10, feedback: 'While MFA fatigue is possible, the combination of impossible travel and executive account requires immediate action regardless.' },
          { id: 'it-1d', text: 'Wait for additional suspicious activity before acting', isCorrect: false, points: 0, feedback: 'Executive account compromise requires immediate response. Waiting allows attacker access to sensitive data.' },
        ],
      },
      {
        id: 'it-2',
        stepNumber: 2,
        title: 'Immediate Containment',
        question: 'What is your immediate containment action?',
        evidence: [
          { type: 'log', label: 'Recent Account Activity', content: 'Post-Singapore login activity:\n08:46:01 - Accessed SharePoint: /Finance/Board-Reports/\n08:47:33 - Downloaded: Q4_Financial_Projections.xlsx\n08:48:15 - Accessed: M&A_Confidential folder\n08:49:02 - Created mail rule: Auto-forward to external address' },
        ],
        actions: [
          { id: 'it-2a', text: 'Revoke all sessions, disable account, and reset MFA immediately', isCorrect: true, points: 20, feedback: 'Perfect! Full session revocation stops the attacker. MFA reset prevents reuse of compromised authentication method.' },
          { id: 'it-2b', text: 'Just reset the password', isCorrect: false, points: 5, feedback: 'Password reset alone doesn\'t revoke active sessions or address compromised MFA.' },
          { id: 'it-2c', text: 'Block the Singapore IP address', isCorrect: false, points: 5, feedback: 'The attacker can easily change IPs. Account-level controls are more effective.' },
          { id: 'it-2d', text: 'Call the CFO to verify before taking action', isCorrect: false, points: 3, feedback: 'Active data access is occurring. Containment must happen immediately - verification was already done.' },
        ],
      },
      {
        id: 'it-3',
        stepNumber: 3,
        title: 'Root Cause Analysis',
        question: 'Investigation shows the CFO\'s phone received an MFA push they don\'t remember approving. What likely occurred?',
        evidence: [
          { type: 'log', label: 'MFA Push History', content: 'CFO Phone MFA Activity (last 24 hours):\n- 07:55:12 - Push sent, Approved (NY office login)\n- 08:44:58 - Push sent, Approved (Singapore login)\n- 08:44:45 - Push sent, Denied\n- 08:44:30 - Push sent, Denied\n- 08:44:15 - Push sent, Denied\n\nNote: 4 pushes in 45 seconds before approval' },
        ],
        actions: [
          { id: 'it-3a', text: 'MFA fatigue attack - attacker spammed push notifications until user approved', isCorrect: true, points: 15, feedback: 'Exactly right! MFA fatigue/push bombing involves flooding the user with MFA requests until they approve out of frustration or accident.' },
          { id: 'it-3b', text: 'SIM swap attack giving attacker access to MFA', isCorrect: false, points: 5, feedback: 'SIM swap would affect SMS-based MFA. Push notifications suggest the legitimate phone received them.' },
          { id: 'it-3c', text: 'Malware on the CFO\'s phone auto-approved the push', isCorrect: false, points: 5, feedback: 'The denied pushes before approval suggest human interaction, not automated malware.' },
          { id: 'it-3d', text: 'The CFO shared their credentials with someone', isCorrect: false, points: 0, feedback: 'The evidence shows an attack pattern (push bombing), not credential sharing.' },
        ],
      },
    ],
    maxScore: 55,
  },
  {
    id: 'dns-tunneling',
    title: 'Suspicious DNS Query Pattern Detected',
    category: 'network',
    priority: 'medium',
    summary: 'DNS monitoring detected unusual query patterns with high-entropy subdomain requests to a newly registered domain.',
    timestamp: '2024-01-15 16:22:08 UTC',
    source: 'DNS Security / SIEM',
    steps: [
      {
        id: 'dns-1',
        stepNumber: 1,
        title: 'Pattern Analysis',
        question: 'Analyze the DNS queries. What type of activity does this pattern suggest?',
        evidence: [
          { type: 'network', label: 'DNS Query Log', content: 'Source: 10.20.30.45 (WS-DEV-017)\nQueries to: *.data-sync-cdn.net\n\nSample queries:\n- aGVsbG8gd29ybGQ.data-sync-cdn.net\n- dGhpcyBpcyBhIHRlc3Q.data-sync-cdn.net  \n- c2VjcmV0IGRhdGE.data-sync-cdn.net\n\nQuery rate: 50 queries/minute\nAvg subdomain length: 24 characters\nDomain age: 3 days' },
          { type: 'ip', label: 'Domain Analysis', content: 'Domain: data-sync-cdn.net\nRegistrar: Anonymous registration\nCreated: 2024-01-12\nNameservers: Custom (suspicious)\nCategory: Uncategorized\nReputation: Unknown' },
        ],
        actions: [
          { id: 'dns-1a', text: 'DNS tunneling - data being exfiltrated via encoded DNS queries', isCorrect: true, points: 20, feedback: 'Correct! High-entropy subdomains (Base64 encoded), high query rate, and newly registered domain are classic DNS tunneling indicators.' },
          { id: 'dns-1b', text: 'Normal CDN traffic for a web application', isCorrect: false, points: 0, feedback: 'Legitimate CDN domains are well-established and don\'t use encoded subdomains. This is suspicious.' },
          { id: 'dns-1c', text: 'Cryptocurrency mining activity', isCorrect: false, points: 3, feedback: 'Mining typically uses direct connections, not DNS tunneling. The pattern suggests data exfiltration.' },
          { id: 'dns-1d', text: 'Software update check', isCorrect: false, points: 0, feedback: 'Software updates don\'t generate high-entropy DNS queries at this rate.' },
        ],
      },
      {
        id: 'dns-2',
        stepNumber: 2,
        title: 'Source Investigation',
        question: 'You need to investigate the source workstation. What do you look for first?',
        evidence: [
          { type: 'log', label: 'Workstation Info', content: 'Hostname: WS-DEV-017\nUser: alex.kumar (Developer)\nOS: Windows 11\nEDR Status: Active, no alerts\nLast login: 08:30 today\nDNS queries started: 14:00 today' },
        ],
        actions: [
          { id: 'dns-2a', text: 'Check for recently installed software or scripts that started around 14:00', isCorrect: true, points: 15, feedback: 'Excellent! Correlating the DNS activity start time with software installations or script executions helps identify the malicious process.' },
          { id: 'dns-2b', text: 'Interview the user about their activities', isCorrect: false, points: 5, feedback: 'User may not be aware of malware. Technical investigation should come first.' },
          { id: 'dns-2c', text: 'Since EDR shows no alerts, this is likely a false positive', isCorrect: false, points: 0, feedback: 'DNS tunneling often evades EDR. The evidence strongly suggests malicious activity regardless of EDR status.' },
          { id: 'dns-2d', text: 'Check the user\'s browsing history', isCorrect: false, points: 5, feedback: 'Browser history may help but process/software analysis is more directly relevant to DNS tunneling.' },
        ],
      },
      {
        id: 'dns-3',
        stepNumber: 3,
        title: 'Remediation',
        question: 'Analysis reveals a malicious Python script running as a scheduled task. What is your remediation plan?',
        evidence: [
          { type: 'file', label: 'Malware Analysis', content: 'File: C:\\Users\\alex.kumar\\AppData\\Local\\Temp\\sync_service.py\nScheduled Task: DataSync (runs every 5 minutes)\nFunction: Reads files from Documents folder, Base64 encodes, sends via DNS\nData sent: Approximately 50MB over 2 hours\nInstallation: Via phishing email attachment yesterday' },
        ],
        actions: [
          { id: 'dns-3a', text: 'Isolate endpoint, remove malware and task, block domain, assess data exposure, and check other recipients', isCorrect: true, points: 20, feedback: 'Complete response! Addresses containment, eradication, and scoping while preventing future incidents via domain blocking.' },
          { id: 'dns-3b', text: 'Delete the script and scheduled task, return system to production', isCorrect: false, points: 5, feedback: 'This misses network-level blocking and doesn\'t assess what data was stolen or if others are affected.' },
          { id: 'dns-3c', text: 'Block the DNS domain at the firewall only', isCorrect: false, points: 5, feedback: 'Domain blocking helps but doesn\'t address the malware still on the system or potential other infections.' },
          { id: 'dns-3d', text: 'Reimage the workstation immediately', isCorrect: false, points: 10, feedback: 'Reimaging removes evidence needed for investigation. Forensic analysis should precede reimaging.' },
        ],
      },
    ],
    maxScore: 55,
  },
];
