export type IncidentSeverity = 'low' | 'medium' | 'high';
export type IncidentCategory = 'phishing-compromise' | 'suspicious-login' | 'malware-infection' | 'ransomware-attack' | 'data-breach' | 'insider-threat';

export interface IncidentAction {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  points: number;
}

export interface IncidentStep {
  id: string;
  stepNumber: number;
  title: string;
  situation: string;
  actions: IncidentAction[];
}

export interface Incident {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  description: string;
  briefing: string;
  icon: string;
  steps: IncidentStep[];
  maxScore: number;
  objectives: string[];
}

export const SEVERITY_CONFIG: Record<IncidentSeverity, { label: string; color: string; bgColor: string; borderColor: string; badge: string }> = {
  low:    { label: 'LOW',    color: 'text-accent',      bgColor: 'bg-accent/10',      borderColor: 'border-accent/30',      badge: '🟢' },
  medium: { label: 'MEDIUM', color: 'text-warning',     bgColor: 'bg-warning/10',     borderColor: 'border-warning/30',     badge: '🟡' },
  high:   { label: 'HIGH',   color: 'text-destructive',  bgColor: 'bg-destructive/10', borderColor: 'border-destructive/30', badge: '🔴' },
};

export const CATEGORY_CONFIG: Record<IncidentCategory, { label: string; color: string; bgColor: string }> = {
  'phishing-compromise': { label: 'Phishing Compromise', color: 'text-warning',    bgColor: 'bg-warning/10' },
  'suspicious-login':    { label: 'Suspicious Login',    color: 'text-primary',    bgColor: 'bg-primary/10' },
  'malware-infection':   { label: 'Malware Infection',   color: 'text-destructive', bgColor: 'bg-destructive/10' },
  'ransomware-attack':   { label: 'Ransomware Attack',   color: 'text-destructive', bgColor: 'bg-destructive/10' },
  'data-breach':         { label: 'Data Breach',         color: 'text-warning',    bgColor: 'bg-warning/10' },
  'insider-threat':      { label: 'Insider Threat',      color: 'text-accent',     bgColor: 'bg-accent/10' },
};

export const INCIDENTS: Incident[] = [
  // ─── INCIDENT 1: Phishing Compromise ────────────────────────────────────────
  {
    id: 'phishing-compromise',
    title: 'Employee Credentials Stolen',
    category: 'phishing-compromise',
    severity: 'high',
    description: 'An employee clicked a phishing link and entered their credentials on a fake login page. You are the incident responder.',
    briefing: 'ALERT: 14:32 — SOC has flagged anomalous login activity. Employee "jdoe@company.com" authenticated from IP 45.77.34.102 (Netherlands) 3 minutes after clicking a phishing link detected in email logs. The employee\'s Slack, email, and SharePoint access are now potentially compromised.',
    icon: 'Mail',
    objectives: ['Contain the breach', 'Prevent lateral movement', 'Preserve evidence', 'Notify stakeholders'],
    steps: [
      {
        id: 'ir1-step1',
        stepNumber: 1,
        title: 'Initial Containment',
        situation: 'It\'s been 5 minutes since the phishing link was clicked. The attacker is actively logged into the employee\'s account from an external IP. The employee is at their desk unaware. What is your FIRST containment action?',
        actions: [
          {
            id: 'a',
            text: 'Immediately disable the compromised account and revoke all active sessions',
            isCorrect: true,
            feedback: '✅ Correct — this is the highest priority. Disabling the account and revoking sessions immediately cuts off attacker access. Every minute they maintain access they can exfiltrate data, send phishing emails from the trusted account, or escalate privileges.',
            points: 100,
          },
          {
            id: 'b',
            text: 'Email the employee asking them to change their password',
            isCorrect: false,
            feedback: '❌ Emailing the compromised account is counterproductive — the attacker may be reading the inbox right now and intercept your warning. Immediate session revocation through admin controls is required, not self-service.',
            points: 0,
          },
          {
            id: 'c',
            text: 'Wait for the full phishing email analysis before taking any action',
            isCorrect: false,
            feedback: '❌ Analysis matters, but not before containment. While you analyze, the attacker is actively inside the account. Follow PICERL: Preparation → Identification → Containment → then Eradication/Analysis.',
            points: 10,
          },
          {
            id: 'd',
            text: 'Alert all employees via company-wide email about the phishing campaign',
            isCorrect: false,
            feedback: '⚠️ Organization-wide notification is important, but it\'s not the first action. Contain the active breach first — revoke the attacker\'s access — then issue broader communications to prevent additional victims.',
            points: 20,
          },
        ],
      },
      {
        id: 'ir1-step2',
        stepNumber: 2,
        title: 'Scope Assessment',
        situation: 'The account is now disabled. Logs show the attacker accessed: email inbox, SharePoint /HR-Documents/, and attempted (failed) to access the finance portal. Which systems need IMMEDIATE investigation?',
        actions: [
          {
            id: 'a',
            text: 'Only the email inbox — that\'s what was confirmed accessed',
            isCorrect: false,
            feedback: '⚠️ Limiting scope to confirmed access is too narrow. The HR Documents folder may contain PII (Personal Identifiable Information) triggering regulatory reporting obligations. The failed finance portal attempt indicates the attacker was actively trying to escalate access.',
            points: 20,
          },
          {
            id: 'b',
            text: 'Email, SharePoint HR folder, finance portal, and any systems sharing the same credentials',
            isCorrect: true,
            feedback: '✅ Comprehensive scope is essential. The HR folder likely has sensitive PII (may require breach notification under GDPR/CCPA). The finance attempt shows adversarial intent. Credential stuffing means any system with the same password must be audited immediately.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Only the finance portal since that\'s the most sensitive system',
            isCorrect: false,
            feedback: '⚠️ The finance portal was NOT successfully accessed — but HR Documents WAS. A data breach of PII in HR files may have already occurred and may require regulatory notification within 72 hours (GDPR). Don\'t overlook confirmed access.',
            points: 30,
          },
          {
            id: 'd',
            text: 'Request a full audit of every system in the company before proceeding',
            isCorrect: false,
            feedback: '⚠️ A company-wide audit is too broad and slow for an active incident. Focus your investigation on systems the attacker actually touched or attempted. Use the access logs you already have to guide your scope.',
            points: 15,
          },
        ],
      },
      {
        id: 'ir1-step3',
        stepNumber: 3,
        title: 'Evidence Preservation',
        situation: 'You need to preserve evidence before IT wipes the compromised system. The employee\'s manager wants the laptop cleaned and back in service ASAP. What do you do?',
        actions: [
          {
            id: 'a',
            text: 'Comply with the manager\'s request — business continuity is the priority',
            isCorrect: false,
            feedback: '❌ Wiping the system destroys forensic evidence critical to understanding the full scope of compromise. This is a major incident response failure. Evidence preservation is a legal and security requirement — escalate to leadership if needed.',
            points: 0,
          },
          {
            id: 'b',
            text: 'Create a forensic image of the disk and memory dump before any remediation, then provide the user a loaner device',
            isCorrect: true,
            feedback: '✅ Perfect incident response. Forensic imaging preserves evidence without blocking the employee from working. Chain of custody must be maintained. Memory artifacts may reveal persistence mechanisms, malware, or additional credentials the attacker captured.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Just take screenshots of the system state before wiping',
            isCorrect: false,
            feedback: '⚠️ Screenshots capture visible information but miss critical forensic artifacts: registry hives, browser history, memory contents, running processes, scheduled tasks, and file timestamps. A proper forensic image is required.',
            points: 20,
          },
          {
            id: 'd',
            text: 'Run antivirus on the machine and if it comes back clean, return it to service',
            isCorrect: false,
            feedback: '❌ Antivirus does not replace forensic investigation. Modern attackers use living-off-the-land techniques that evade AV. An AV-clean system can still harbor persistence mechanisms, credential dumpers, or lateral movement tools.',
            points: 15,
          },
        ],
      },
      {
        id: 'ir1-step4',
        stepNumber: 4,
        title: 'Stakeholder Notification',
        situation: 'Evidence shows the HR Documents folder contained personal data of 340 employees (names, salaries, home addresses). Your company operates in the EU. What are your notification obligations?',
        actions: [
          {
            id: 'a',
            text: 'Only notify the 340 affected employees via email',
            isCorrect: false,
            feedback: '⚠️ Employee notification is important but incomplete. Under GDPR Article 33, the Data Protection Authority (DPA) must be notified within 72 hours of discovering a personal data breach. Failure to do so carries significant fines (up to €10M or 2% of global turnover).',
            points: 25,
          },
          {
            id: 'b',
            text: 'Notify the Data Protection Authority within 72 hours, notify affected individuals where required, and document everything in the incident register',
            isCorrect: true,
            feedback: '✅ Full GDPR compliance. Art. 33 requires DPA notification within 72 hours. Art. 34 may require notification to individuals if there\'s high risk. Maintaining an incident register (Art. 33(5)) is mandatory regardless. Documenting decisions protects the organization legally.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Keep it internal — notifying the DPA will damage company reputation',
            isCorrect: false,
            feedback: '❌ GDPR mandatory reporting is not optional. Concealing a reportable breach is a serious criminal offense. Regulators view cover-ups far more harshly than the incident itself. The fine for concealment can be up to €20M or 4% of global annual turnover.',
            points: 0,
          },
          {
            id: 'd',
            text: 'Send a press release immediately to get ahead of the story',
            isCorrect: false,
            feedback: '⚠️ Premature public disclosure before proper assessment and regulatory notification is problematic. Follow the correct notification order: regulatory authorities first, then affected individuals, then public communications if needed.',
            points: 10,
          },
        ],
      },
    ],
    maxScore: 400,
  },

  // ─── INCIDENT 2: Suspicious Login ────────────────────────────────────────────
  {
    id: 'admin-account-takeover',
    title: 'Admin Account Takeover Attempt',
    category: 'suspicious-login',
    severity: 'high',
    description: 'The SIEM alerts on impossible travel — your IT admin account logged in from London, then 4 minutes later from Seoul. Respond to this active threat.',
    briefing: 'CRITICAL ALERT: 09:41 — SIEM rule "Impossible Travel" triggered for admin account "it-admin@company.com". Login from London, UK (legitimate) at 09:37. Login from Seoul, South Korea at 09:41. Physically impossible travel time. Admin account has domain admin privileges on 847 systems.',
    icon: 'Shield',
    objectives: ['Identify if compromise is confirmed', 'Contain the threat immediately', 'Assess blast radius', 'Prevent privilege escalation'],
    steps: [
      {
        id: 'ir2-step1',
        stepNumber: 1,
        title: 'Triage the Alert',
        situation: 'The SIEM shows impossible travel for your highest-privileged admin account. The admin confirms they are in London and did NOT log in from Seoul. How do you classify this incident?',
        actions: [
          {
            id: 'a',
            text: 'Treat as confirmed compromise and immediately escalate to a P1 (Critical) incident',
            isCorrect: true,
            feedback: '✅ Correct classification. Impossible travel + admin denial = confirmed credential compromise with active adversary in a domain admin account. This is the worst-case scenario — P1 escalation, incident commander assigned, all hands response initiated.',
            points: 100,
          },
          {
            id: 'b',
            text: 'Wait and monitor for 30 minutes to see if more activity occurs before escalating',
            isCorrect: false,
            feedback: '❌ Waiting is catastrophic with domain admin access. In 30 minutes an attacker can: create backdoor admin accounts, deploy malware across all 847 systems, exfiltrate the entire Active Directory database, and establish persistence that survives credential resets.',
            points: 0,
          },
          {
            id: 'c',
            text: 'Ask the admin if they use a VPN that could explain the Seoul login',
            isCorrect: false,
            feedback: '⚠️ VPN verification is a reasonable quick check, but should take seconds not minutes. The admin already denied the login. Even if a VPN could explain the geography, you still have an unauthorized authentication event that demands immediate action.',
            points: 20,
          },
          {
            id: 'd',
            text: 'Mark it as a false positive — impossible travel alerts fire frequently',
            isCorrect: false,
            feedback: '❌ Dismissing an admin-confirmed unauthorized login as a false positive is a critical failure. Alert fatigue is a real problem, but the admin\'s explicit denial of the Seoul login removes ambiguity. This is a true positive requiring immediate response.',
            points: 0,
          },
        ],
      },
      {
        id: 'ir2-step2',
        stepNumber: 2,
        title: 'Immediate Containment',
        situation: 'P1 declared. You have 2 minutes to execute containment before the attacker detects the investigation. The admin account has keys to 847 systems. What\'s your containment strategy?',
        actions: [
          {
            id: 'a',
            text: 'Disable the admin account, force sign-out of all sessions, rotate the account password and Kerberos tickets (krbtgt reset)',
            isCorrect: true,
            feedback: '✅ Gold-standard AD containment. Disabling the account + revoking sessions cuts immediate access. Rotating krbtgt invalidates any Kerberos tickets the attacker may have generated (Golden Ticket defense). This is the correct sequence for domain-level account compromise.',
            points: 100,
          },
          {
            id: 'b',
            text: 'Just change the admin account password',
            isCorrect: false,
            feedback: '⚠️ Password change alone is insufficient. The attacker may already have created backdoor accounts, exported credentials (Pass-the-Hash), or generated Kerberos Golden Tickets that remain valid even after a password change. Full containment requires session revocation + krbtgt reset.',
            points: 30,
          },
          {
            id: 'c',
            text: 'Block the Seoul IP address at the firewall',
            isCorrect: false,
            feedback: '⚠️ IP blocking is easily bypassed by switching to a different IP or using the compromised account\'s internal access. It\'s a band-aid, not containment. The session is already established — you need to kill it, not block the source.',
            points: 15,
          },
          {
            id: 'd',
            text: 'Shut down all 847 servers to prevent any damage',
            isCorrect: false,
            feedback: '❌ Shutting down 847 production systems causes a self-inflicted denial of service that may be worse than the attack itself. Targeted containment of the compromised account achieves the security goal without bringing down the business.',
            points: 5,
          },
        ],
      },
      {
        id: 'ir2-step3',
        stepNumber: 3,
        title: 'Persistence Check',
        situation: 'Account is contained. Active Directory logs show the attacker had access for 22 minutes before detection. They queried AD user accounts. What persistence mechanisms must you hunt for?',
        actions: [
          {
            id: 'a',
            text: 'Check only for new user accounts created in the last 22 minutes',
            isCorrect: false,
            feedback: '⚠️ New accounts are one persistence method, but skilled attackers use many more. With 22 minutes of domain admin access, they could have created Golden Tickets, added backdoor admin group memberships, deployed scheduled tasks, or installed remote access tools that new-account-only hunting would miss.',
            points: 20,
          },
          {
            id: 'b',
            text: 'Hunt for: new admin accounts, modified group memberships, new scheduled tasks/services, GPO changes, and any new software deployed via AD',
            isCorrect: true,
            feedback: '✅ Comprehensive persistence hunting. Attackers with domain admin use all these vectors. GPO changes are particularly dangerous — they can push malware to all domain-joined machines. Each vector must be hunted and any findings treated as indicators of compromise.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Run a full antivirus scan across all 847 systems',
            isCorrect: false,
            feedback: '⚠️ AV scanning helps but misses most sophisticated persistence mechanisms. Golden Tickets exist only in memory. Group membership changes are configuration changes, not files. Custom AD backdoors won\'t trigger AV. Targeted hunting of AD artifacts is more effective.',
            points: 25,
          },
          {
            id: 'd',
            text: 'Rebuild the entire Active Directory from scratch',
            isCorrect: false,
            feedback: '⚠️ Full AD rebuild may be necessary in catastrophic scenarios, but it\'s a last resort — not the first response step. A targeted hunt first determines actual scope. Rebuilding 847 systems without scope analysis would be disproportionate and cause massive downtime.',
            points: 10,
          },
        ],
      },
    ],
    maxScore: 300,
  },

  // ─── INCIDENT 3: Malware Infection ──────────────────────────────────────────
  {
    id: 'malware-infection',
    title: 'Endpoint Malware Detection',
    category: 'malware-infection',
    severity: 'medium',
    description: 'EDR detected a suspicious process on a developer\'s workstation performing credential harvesting and lateral movement. Respond to contain and eradicate.',
    briefing: 'ALERT: 11:18 — EDR flagged process "svchost32.exe" (note: NOT the legitimate svchost.exe) on DEV-WKS-042. Behaviours detected: LSASS memory read (credential dumping), network scan of internal /24 subnet, and DNS queries to known C2 domain "update-cdn-service.net". Machine belongs to senior developer with code repo access.',
    icon: 'Bug',
    objectives: ['Isolate infected endpoint', 'Prevent lateral movement', 'Identify malware family and initial access vector', 'Protect source code integrity'],
    steps: [
      {
        id: 'ir3-step1',
        stepNumber: 1,
        title: 'Endpoint Isolation',
        situation: 'The EDR shows active C2 communication. The malware is performing a network scan. The developer is in the middle of a critical code commit. What do you do?',
        actions: [
          {
            id: 'a',
            text: 'Immediately network-isolate the endpoint via EDR — let IT explain to the developer afterward',
            isCorrect: true,
            feedback: '✅ Correct — active C2 communication and a network scan means the malware is in the lateral movement phase. Every second of delay risks other systems being compromised. The developer\'s commit can be recovered; a company-wide infection cannot. Security overrides business convenience.',
            points: 100,
          },
          {
            id: 'b',
            text: 'Wait for the developer to finish the commit, then isolate the machine',
            isCorrect: false,
            feedback: '❌ A 5-10 minute delay during active lateral movement could result in 10-50 additional compromised systems. The code commit can be recovered from version control. Active malware spreading across the developer network cannot be undone without massive remediation effort.',
            points: 0,
          },
          {
            id: 'c',
            text: 'Block the C2 domain at DNS/firewall but leave the machine online',
            isCorrect: false,
            feedback: '⚠️ Blocking the known C2 domain is useful but insufficient. Malware often has multiple C2 endpoints or uses domain generation algorithms (DGA). The active network scan is a more immediate threat — the malware is already searching for its next victim inside your network.',
            points: 30,
          },
          {
            id: 'd',
            text: 'Ask the developer if they noticed anything unusual before taking action',
            isCorrect: false,
            feedback: '⚠️ User context can be valuable but should not delay containment. Ask questions while you isolate. The EDR telemetry already provides definitive evidence — you don\'t need the developer\'s confirmation to act on a confirmed malicious process.',
            points: 15,
          },
        ],
      },
      {
        id: 'ir3-step2',
        stepNumber: 2,
        title: 'Credential Compromise Assessment',
        situation: 'The EDR confirms LSASS was read — cached credentials were almost certainly harvested. The developer has SSH access to 12 production servers and write access to the main code repository. What\'s the immediate risk?',
        actions: [
          {
            id: 'a',
            text: 'The credentials stolen are only valid on the developer\'s local machine',
            isCorrect: false,
            feedback: '❌ This is incorrect. LSASS memory contains cached domain credentials, Kerberos tickets, and potentially SSH keys. Credentials harvested from LSASS work across the network — that\'s exactly why credential dumping is a primary lateral movement technique.',
            points: 0,
          },
          {
            id: 'b',
            text: 'The attacker likely has credentials to authenticate to all 12 production servers and could poison the code repository',
            isCorrect: true,
            feedback: '✅ Correct threat model. Harvested credentials from LSASS enable Pass-the-Hash or Pass-the-Ticket attacks against all accessible systems. Source code repository access is particularly dangerous — a supply chain attack could compromise every customer using your software.',
            points: 100,
          },
          {
            id: 'c',
            text: 'The risk is limited — production servers have separate authentication',
            isCorrect: false,
            feedback: '⚠️ Even with separate authentication, LSASS harvesting often captures recently-used credentials from multiple systems. Additionally, SSH private keys stored on the workstation may provide direct access. Assume all the developer\'s accessible systems are at risk.',
            points: 20,
          },
          {
            id: 'd',
            text: 'The code repository is safe because it uses HTTPS, not SSH',
            isCorrect: false,
            feedback: '❌ HTTPS authentication tokens and credentials can also be harvested from memory or credential stores. Transport protocol doesn\'t protect against local credential dumping. The repository must be treated as potentially compromised.',
            points: 10,
          },
        ],
      },
      {
        id: 'ir3-step3',
        stepNumber: 3,
        title: 'Source Code Integrity',
        situation: 'The malware had access during business hours for an estimated 3 hours before detection. The code repository shows 2 commits made during that window by the developer. How do you verify code integrity?',
        actions: [
          {
            id: 'a',
            text: 'Trust the commits since the developer says they made them legitimately',
            isCorrect: false,
            feedback: '⚠️ Developer testimony is unreliable for forensic purposes — not because they\'re dishonest, but because malware could have modified commits without their knowledge, or the developer may not remember every change. Code verification must be objective.',
            points: 10,
          },
          {
            id: 'b',
            text: 'Perform a cryptographic diff of both commits against the baseline, review all changed files, and scan for added backdoors or obfuscated code',
            isCorrect: true,
            feedback: '✅ Rigorous supply chain security. Cryptographic diff identifies every changed byte. Manual review of changed files catches backdoors that automated scanners might miss. This process is mandatory before the next release. Consider requiring code signing and mandatory code review post-incident.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Revert all commits made during the 3-hour window to be safe',
            isCorrect: false,
            feedback: '⚠️ Blanket reverts remove potentially legitimate work without analysis. The correct approach is to verify the integrity of each commit. Reverting without analysis also fails to identify if earlier, undetected malicious commits exist.',
            points: 35,
          },
          {
            id: 'd',
            text: 'Run the code through a static analysis tool and if it passes, approve it',
            isCorrect: false,
            feedback: '⚠️ Static analysis is useful but not sufficient for detecting sophisticated backdoors. Obfuscated code, time-delayed execution, or legitimate-looking but malicious logic may pass static analysis. Human review of the changed sections is required.',
            points: 25,
          },
        ],
      },
    ],
    maxScore: 300,
  },

  // ─── INCIDENT 4: Ransomware Response ────────────────────────────────────────
  {
    id: 'ransomware-response',
    title: 'Active Ransomware Outbreak',
    category: 'ransomware-attack',
    severity: 'high',
    description: 'Ransomware is spreading across the corporate network. Multiple departments report encrypted files. You are the Incident Commander. Every decision has consequences.',
    briefing: 'CRITICAL: 08:47 — Multiple helpdesk tickets flooding in. Employees in Finance, HR, and Operations report files with ".crypted24" extension. Shared drives are being encrypted. Initial analysis suggests LockBit 3.0 variant. Finance payroll due in 6 hours. The attackers gained initial access 3 days ago via a vulnerable VPN appliance.',
    icon: 'AlertTriangle',
    objectives: ['Stop the spread immediately', 'Assess encryption scope', 'Execute recovery strategy', 'Manage crisis communications'],
    steps: [
      {
        id: 'ir4-step1',
        stepNumber: 1,
        title: 'Network Segmentation Emergency',
        situation: 'Ransomware is spreading via file shares across 3 departments and accelerating. The CEO is demanding to know what\'s happening. What is your very first action as Incident Commander?',
        actions: [
          {
            id: 'a',
            text: 'Brief the CEO first, then address containment',
            isCorrect: false,
            feedback: '❌ Briefing leadership is important but never before stopping active spread. Every 60 seconds of unchecked ransomware can encrypt thousands more files. Brief leadership while containment is executing in parallel. Prioritize: Contain → Communicate.',
            points: 10,
          },
          {
            id: 'b',
            text: 'Emergency network segmentation — isolate affected department VLANs and disable all file sharing protocols (SMB)',
            isCorrect: true,
            feedback: '✅ Textbook incident command. Ransomware spreads via SMB and network file shares. VLAN isolation at the network layer stops propagation even if individual machines are already compromised. Disabling SMB prevents further spread while you assess scope. Contain first, communicate second.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Instruct all employees company-wide to immediately shut down their computers',
            isCorrect: false,
            feedback: '⚠️ Mass shutdown can help in some scenarios but is not the correct first action. It disrupts ongoing incident investigation, may destroy memory forensics, and brings down unaffected systems. Targeted network isolation is more surgical and effective.',
            points: 25,
          },
          {
            id: 'd',
            text: 'Begin negotiating with the ransomware group immediately via their contact portal',
            isCorrect: false,
            feedback: '❌ Negotiation, if pursued at all, happens much later after exhausting recovery options. Starting negotiations immediately signals weakness, may violate OFAC sanctions if the group is designated, and does nothing to stop active encryption.',
            points: 0,
          },
        ],
      },
      {
        id: 'ir4-step2',
        stepNumber: 2,
        title: 'Backup Viability Assessment',
        situation: 'Network isolated. IT reports: backups exist but the tape backups are 5 days old (predating the breach). Cloud backups sync hourly and the last sync was 40 minutes ago — before the ransomware executed. The VPN vulnerability that enabled initial access is known. What\'s the recovery strategy?',
        actions: [
          {
            id: 'a',
            text: 'Restore from cloud backups (40 min old) while simultaneously patching the VPN vulnerability before reconnecting any systems',
            isCorrect: true,
            feedback: '✅ Optimal recovery path. Cloud backups with only 40 minutes of data loss are excellent. Crucially, patching the VPN vulnerability BEFORE reconnecting eliminates the initial access vector — otherwise you restore into the same breach. Patch the hole before refilling the ship.',
            points: 100,
          },
          {
            id: 'b',
            text: 'Pay the ransom to get the decryption key — backups are too old and payroll is in 6 hours',
            isCorrect: false,
            feedback: '❌ Cloud backups from 40 minutes ago are available — paying is unnecessary here. Ransom payment has major downsides: no guarantee of working key, potential OFAC violation, encourages future attacks, and won\'t prevent data publication (double extortion). Restore from backups.',
            points: 0,
          },
          {
            id: 'c',
            text: 'Restore from the 5-day-old tape backups to ensure no malware is present in the restore',
            isCorrect: false,
            feedback: '⚠️ 5-day-old backups mean losing 5 days of work when 40-minute-old cloud backups exist. While the concern about malware in backups is valid, the cloud backup pre-dates ransomware execution and can be scanned before restoration. Use the most recent clean backup.',
            points: 20,
          },
          {
            id: 'd',
            text: 'Restore from cloud backups immediately without changing anything else — speed is critical',
            isCorrect: false,
            feedback: '❌ Restoring without patching the VPN vulnerability means you restore into an already-compromised environment. The attackers still have their initial access vector and can re-deploy ransomware. The VPN patch is a prerequisite, not optional.',
            points: 15,
          },
        ],
      },
      {
        id: 'ir4-step3',
        stepNumber: 3,
        title: 'Crisis Communications',
        situation: 'Recovery is underway. Rumors are spreading on social media that the company was "hacked." Staff are panicking. Customers are calling. The Board wants an update. How do you handle communications?',
        actions: [
          {
            id: 'a',
            text: 'Issue a holding statement acknowledging the incident, provide factual updates on a scheduled cadence, and designate a single spokesperson',
            isCorrect: true,
            feedback: '✅ Crisis communications best practice. A holding statement stops the information vacuum (which gets filled with rumors). Scheduled updates set expectations. A single spokesperson ensures consistent messaging and prevents conflicting statements from different employees.',
            points: 100,
          },
          {
            id: 'b',
            text: 'Say nothing publicly until fully recovered — don\'t confirm or deny anything',
            isCorrect: false,
            feedback: '⚠️ Silence during an active incident accelerates speculation and damages trust. Customers and partners deserve to know if their data or services are affected. Regulatory disclosure requirements may also mandate notification. Controlled transparency is better than forced disclosure.',
            points: 15,
          },
          {
            id: 'c',
            text: 'Have every department head communicate directly with their own stakeholders',
            isCorrect: false,
            feedback: '⚠️ Decentralized communications during a crisis is a major mistake. Different department heads will say different things, creating contradictory narratives. Legal liability, regulatory compliance, and brand reputation require a single, coordinated communication strategy.',
            points: 10,
          },
          {
            id: 'd',
            text: 'Post detailed technical information about the attack on social media to demonstrate transparency',
            isCorrect: false,
            feedback: '❌ Detailed technical disclosure during an active incident is counterproductive. It may assist the attackers, alert them to your recovery strategy, create legal liability, and overwhelm your team with media inquiries. High-level acknowledgment, not technical details, is appropriate at this stage.',
            points: 5,
          },
        ],
      },
    ],
    maxScore: 300,
  },

  // ─── INCIDENT 5: Data Breach ────────────────────────────────────────────────
  {
    id: 'data-breach-discovery',
    title: 'Customer Data Breach Discovery',
    category: 'data-breach',
    severity: 'high',
    description: 'A security researcher contacts you to report that 50,000 customer records appear to be for sale on a dark web forum. Respond to this disclosure.',
    briefing: 'RECEIVED: Responsible disclosure email from security researcher "Alex Chen". Claims to have found your company\'s customer database — names, emails, hashed passwords, and credit card last-4-digits for ~50,000 customers — listed for sale on a dark web marketplace. Researcher provides 5 sample records for verification. All 5 records are confirmed legitimate from your database.',
    icon: 'Database',
    objectives: ['Verify and scope the breach', 'Identify the attack vector', 'Comply with notification regulations', 'Protect remaining data'],
    steps: [
      {
        id: 'ir5-step1',
        stepNumber: 1,
        title: 'Verify the Disclosure',
        situation: 'A researcher claims your data is on the dark web. You\'ve verified 5 sample records. Is this a confirmed breach? What\'s your immediate next step?',
        actions: [
          {
            id: 'a',
            text: 'Treat as unconfirmed until you can see the dark web listing yourself',
            isCorrect: false,
            feedback: '❌ 5 verified legitimate customer records in an unauthorized location IS confirmation of a breach. You don\'t need to visit the dark web listing — the data\'s authenticity is proven. Waiting to "confirm further" delays mandatory breach response obligations.',
            points: 0,
          },
          {
            id: 'b',
            text: 'Declare a confirmed breach, activate the incident response plan, engage legal counsel, and begin forensic investigation of your database access logs',
            isCorrect: true,
            feedback: '✅ Correct immediate response. Verified real records in unauthorized possession = confirmed breach. IR plan activation ensures coordinated response. Legal counsel is critical from minute 1 for regulatory guidance and privilege protection. Database forensics begins identifying how and when exfiltration occurred.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Thank the researcher and wait to see if more data appears before escalating',
            isCorrect: false,
            feedback: '❌ The data is already confirmed and for sale — waiting for "more" to appear just delays response. Regulatory notification clocks have already started. Customers are at risk of phishing and credential stuffing attacks right now.',
            points: 5,
          },
          {
            id: 'd',
            text: 'Accuse the researcher of being the attacker and threaten legal action',
            isCorrect: false,
            feedback: '❌ Threatening responsible disclosure reporters is a critical mistake. Security researchers provide enormous value to organizations. This approach violates ethical norms, may violate law, destroys security community relationships, and misidentifies the actual threat. Reward responsible disclosure.',
            points: 0,
          },
        ],
      },
      {
        id: 'ir5-step2',
        stepNumber: 2,
        title: 'Customer Risk Assessment',
        situation: 'The breach includes hashed passwords. Initial analysis shows MD5 hashing was used (known to be weak). What is the immediate customer risk and required action?',
        actions: [
          {
            id: 'a',
            text: 'MD5 hashes are safe — customers don\'t need to be notified about their passwords',
            isCorrect: false,
            feedback: '❌ MD5 is critically weak for passwords. Attackers can crack MD5-hashed common passwords in seconds using pre-computed rainbow tables. The passwords must be considered compromised. Mandatory password resets and customer notification are required immediately.',
            points: 0,
          },
          {
            id: 'b',
            text: 'Force immediate password resets for all 50,000 affected accounts and notify customers to change passwords on any other accounts where they reuse credentials',
            isCorrect: true,
            feedback: '✅ Correct response to weak hashing. MD5 passwords can be cracked almost instantly — treat them as plaintext. Forced resets protect customers even before they see your notification. Warning about credential reuse is critical because most users reuse passwords across multiple services.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Only notify customers with weak passwords; strong passwords are safe even in MD5',
            isCorrect: false,
            feedback: '⚠️ While longer, random passwords are harder to crack, you cannot determine which passwords are "safe" without cracking them yourself. From a liability and duty-of-care perspective, all 50,000 must be notified and reset. Selective notification creates legal and reputational risk.',
            points: 20,
          },
          {
            id: 'd',
            text: 'Upgrade the password hashing algorithm (to bcrypt/Argon2) and the problem is resolved',
            isCorrect: false,
            feedback: '⚠️ Upgrading the hashing algorithm is the right long-term fix, but it doesn\'t help the 50,000 passwords already stolen and in the process of being cracked right now. Immediate forced resets are required alongside the technical remediation.',
            points: 25,
          },
        ],
      },
      {
        id: 'ir5-step3',
        stepNumber: 3,
        title: 'Root Cause Investigation',
        situation: 'Database access logs show a single API endpoint received 47,000 requests in 8 minutes at 02:13 AM — 3 weeks ago. The endpoint had no rate limiting. What type of attack caused this breach?',
        actions: [
          {
            id: 'a',
            text: 'SQL Injection — the attacker manipulated database queries',
            isCorrect: false,
            feedback: '⚠️ SQL Injection is possible, but 47,000 requests in 8 minutes to an API endpoint suggests automated scraping more than a single SQL injection payload. SQL injection typically appears as unusual queries, not high-volume API requests. Examine the actual request content.',
            points: 20,
          },
          {
            id: 'b',
            text: 'Automated data scraping / API abuse — no rate limiting allowed mass extraction of customer records',
            isCorrect: true,
            feedback: '✅ Classic API scraping attack. 47,000 requests in 8 minutes (≈100/second) is automated abuse of an unprotected API endpoint. The fix: rate limiting, authentication on all data endpoints, anomaly detection, and API gateway controls. This was 100% preventable with basic API security.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Insider threat — an employee sold the data',
            isCorrect: false,
            feedback: '⚠️ Insider threat is a possibility, but 47,000 API requests at 02:13 AM from (presumably) an external IP is more consistent with automated external scraping. Insider threats typically show different patterns: bulk exports, unusual access times from internal IPs, or direct database queries.',
            points: 15,
          },
          {
            id: 'd',
            text: 'DDoS attack that accidentally exposed the data',
            isCorrect: false,
            feedback: '❌ DDoS attacks aim to disrupt availability, not extract data. A 100 req/sec sustained rate is far too low for a DDoS. The pattern is consistent with automated, targeted data harvesting — a methodical extraction, not a flood attack.',
            points: 10,
          },
        ],
      },
    ],
    maxScore: 300,
  },

  // ─── INCIDENT 6: Insider Threat ─────────────────────────────────────────────
  {
    id: 'insider-threat',
    title: 'Disgruntled Employee Data Theft',
    category: 'insider-threat',
    severity: 'medium',
    description: 'DLP alerts flag an employee who resigned last week exfiltrating large volumes of data the day before their access termination. Investigate and respond.',
    briefing: 'DLP ALERT: 16:45 — Employee "Mike Torres" (Sales Manager, resigned, last day tomorrow) triggered 3 DLP alerts in the past 2 hours: 1) 2.3GB uploaded to personal Google Drive 2) Exported entire CRM contacts list (8,400 records) to CSV 3) Forwarded 47 internal sales strategy documents to personal email. Employee badge access shows they\'re currently in the building.',
    icon: 'UserX',
    objectives: ['Preserve evidence', 'Understand data exfiltration scope', 'Manage the situation appropriately', 'Prevent further data theft'],
    steps: [
      {
        id: 'ir6-step1',
        stepNumber: 1,
        title: 'Initial Response — Insider Threat',
        situation: 'The DLP alerts are confirmed. Mike is still in the building. What is the correct initial response? Note: Mike has not formally been terminated yet.',
        actions: [
          {
            id: 'a',
            text: 'Immediately confront Mike at their desk about the data theft',
            isCorrect: false,
            feedback: '❌ Direct confrontation without HR and Legal present creates significant legal risk and may trigger an employee to destroy additional evidence or become hostile. Insider threat incidents require measured, coordinated responses — not impromptu confrontations.',
            points: 5,
          },
          {
            id: 'b',
            text: 'Coordinate with HR, Legal, and Security: remotely revoke access immediately, preserve all logs as evidence, and let HR lead a formal conversation with the employee',
            isCorrect: true,
            feedback: '✅ Correct insider threat protocol. Access revocation stops ongoing exfiltration without confrontation. Evidence preservation is critical for potential legal action. HR and Legal involvement ensures proper process, protects the company legally, and handles the employee interaction appropriately.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Do nothing until Mike\'s last day tomorrow — it\'s technically still their data access period',
            isCorrect: false,
            feedback: '❌ Active data theft in progress has no grace period. The employee is currently stealing confidential data — CRM records, strategy documents, and 2.3GB of files. Waiting until tomorrow allows continued exfiltration and potential destruction of evidence.',
            points: 0,
          },
          {
            id: 'd',
            text: 'Block Mike\'s Google Drive access at the network level only',
            isCorrect: false,
            feedback: '⚠️ Blocking one channel (Google Drive) doesn\'t stop exfiltration — there are many other methods (USB, email, other cloud services). Full access revocation across all systems is required, and evidence must be preserved before any actions that might alert the employee.',
            points: 20,
          },
        ],
      },
      {
        id: 'ir6-step2',
        stepNumber: 2,
        title: 'Evidence and Legal Considerations',
        situation: 'Access has been revoked. Legal wants to know if there\'s enough evidence to pursue action. The DLP logs capture file names and sizes but not content. Is this sufficient?',
        actions: [
          {
            id: 'a',
            text: 'The DLP logs showing file names, timestamps, and destinations are strong evidence of exfiltration and sufficient for legal proceedings',
            isCorrect: true,
            feedback: '✅ DLP logs with file names, sizes, timestamps, destination accounts, and volume constitute strong circumstantial evidence of intentional exfiltration. Combined with email headers and Google Drive upload logs (obtainable via legal process), this forms a solid case. Content isn\'t always necessary to prove exfiltration occurred.',
            points: 100,
          },
          {
            id: 'b',
            text: 'Without seeing the actual file contents, there\'s no evidence of wrongdoing',
            isCorrect: false,
            feedback: '⚠️ This is incorrect legally. Metadata evidence (what was sent, when, where, and how much) is legally significant. Courts have accepted DLP metadata, email headers, and access logs as evidence in trade secret cases. Content is not always required to prove exfiltration.',
            points: 10,
          },
          {
            id: 'c',
            text: 'Access Mike\'s personal Google Drive to review what was uploaded',
            isCorrect: false,
            feedback: '❌ Accessing an employee\'s personal accounts without a warrant is illegal in most jurisdictions, even during an investigation. This would violate privacy laws, potentially make evidence inadmissible, and expose the company to legal liability. Use legal channels to subpoena personal account records.',
            points: 0,
          },
          {
            id: 'd',
            text: 'Wait to see if Mike misuses the data before pursuing legal action',
            isCorrect: false,
            feedback: '⚠️ Waiting for misuse means customer data is already being used against you, trade secrets are in competitors\' hands, and your legal window may be closing. Act while evidence is fresh and exfiltration is documented.',
            points: 5,
          },
        ],
      },
      {
        id: 'ir6-step3',
        stepNumber: 3,
        title: 'Prevention and Lessons Learned',
        situation: 'The incident is contained. The CRM export contained 8,400 customer contacts. Which controls would have BEST prevented or detected this earlier?',
        actions: [
          {
            id: 'a',
            text: 'Physical locks on USB ports company-wide',
            isCorrect: false,
            feedback: '⚠️ USB locks help but Mike used cloud services and email — not USB. Single-vector prevention doesn\'t address multi-channel exfiltration. A comprehensive data protection strategy requires DLP + access controls + monitoring.',
            points: 15,
          },
          {
            id: 'b',
            text: 'Triggered access revocation upon resignation notice + DLP rules alerting on bulk CRM exports + User Behavior Analytics (UBA) to detect anomalous data movement',
            isCorrect: true,
            feedback: '✅ Multi-layered defense. Immediate access de-escalation on resignation (Principle of Least Privilege) limits blast radius. DLP with bulk export rules catches exfiltration in progress. UBA establishes normal behavior baselines — Mike\'s 2.3GB upload was 50x his typical volume, which UBA would have caught on day 1.',
            points: 100,
          },
          {
            id: 'c',
            text: 'Monitoring all employee emails for keywords',
            isCorrect: false,
            feedback: '⚠️ Keyword monitoring is one DLP technique but creates privacy concerns and significant false positives. Mike used Google Drive and a CSV export — not email keywords. A more behavioral approach (anomalous volume detection) would have caught this regardless of content.',
            points: 25,
          },
          {
            id: 'd',
            text: 'Requiring two-factor authentication on the CRM',
            isCorrect: false,
            feedback: '⚠️ Mike had legitimate CRM access — 2FA wouldn\'t have prevented authorized access. The issue was abusive use of legitimate permissions. Controls must address the specific threat model: authorized users misusing their access, not unauthorized access.',
            points: 10,
          },
        ],
      },
    ],
    maxScore: 300,
  },
];
