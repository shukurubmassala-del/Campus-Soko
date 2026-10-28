/**
 * CampusSoko - University Marketplace in Tanzania
 * Firebase Cloud Functions: Automated Prohibited Content Screener & Safety Reporting Pipeline
 * 
 * Complies with:
 * - Universities Act No. 7 of 2005 & TCU Regulations (Academic Integrity)
 * - Cybercrimes Act No. 14 of 2015
 * - Tanzania Personal Data Protection Act (PDPA 2022)
 * - Drug Control and Enforcement Act No. 5 of 2015
 * - Arms and Ammunition Act Cap 223
 * - Penal Code Cap 16 (Forgery, Stolen Property, Counterfeit Currency)
 */

import * as admin from 'firebase-admin';
import { onDocumentCreated, onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// =========================================================================
// 1. DICTIONARY OF PROHIBITED KEYWORDS & SAFETY RULES
// =========================================================================

export interface ProhibitedRule {
  term: string;
  category: 'academic_dishonesty' | 'weapons_dangerous' | 'drugs_controlled' | 'counterfeit_fraud' | 'stolen_goods';
  severity: 'critical' | 'high' | 'medium';
  reasonSw: string;
  reasonEn: string;
  legalContextSw: string;
  legalContextEn: string;
}

export const PROHIBITED_KEYWORDS: ProhibitedRule[] = [
  // Academic Dishonesty & Exam Papers
  {
    term: 'leak mtihani',
    category: 'academic_dishonesty',
    severity: 'critical',
    reasonSw: 'Kuvujisha au kuuza mitihani ni kosa la jinai na kanuni za vyuo vikuu.',
    reasonEn: 'Leaking or selling examination materials violates higher education statutes.',
    legalContextSw: 'Miongozo ya TCU na Universities Act No. 7 ya 2005.',
    legalContextEn: 'TCU Regulations & Universities Act 2005.',
  },
  {
    term: 'exam leak',
    category: 'academic_dishonesty',
    severity: 'critical',
    reasonSw: 'Mitihani iliyovuja ya chuo au NECTA ni marufuku kabisa.',
    reasonEn: 'Leaked exams are strictly prohibited on campus.',
    legalContextSw: 'Sheria ya Mitihani ya Taifa (NECTA Act).',
    legalContextEn: 'National Examinations Council Act.',
  },
  {
    term: 'mitihani iliyovuja',
    category: 'academic_dishonesty',
    severity: 'critical',
    reasonSw: 'Kuuza mitihani iliyovuja ni kosa la kinidhamu.',
    reasonEn: 'Selling leaked examinations is prohibited.',
    legalContextSw: 'Kanuni za Mitihani za Vyuo Vikuu.',
    legalContextEn: 'University Examination Regulations.',
  },
  {
    term: 'necta leak',
    category: 'academic_dishonesty',
    severity: 'critical',
    reasonSw: 'Kuvujisha mitihani ya NECTA ni kosa la jinai.',
    reasonEn: 'NECTA exam leaks are criminal violations.',
    legalContextSw: 'NECTA Act.',
    legalContextEn: 'NECTA Act.',
  },
  {
    term: 'kuandikiwa research',
    category: 'academic_dishonesty',
    severity: 'high',
    reasonSw: 'Huduma za kulipia kuandikiwa tafiti au tasnifu ni udanganyifu wa kitaaluma.',
    reasonEn: 'Ghostwriting dissertations or paid research impersonation is prohibited.',
    legalContextSw: 'TCU Standards & Guidelines 2019.',
    legalContextEn: 'TCU Higher Education Standards 2019.',
  },
  {
    term: 'kuandikiwa dissertation',
    category: 'academic_dishonesty',
    severity: 'high',
    reasonSw: 'Huduma za kuandika dissertation za wanafunzi wengine haziruhusiwi.',
    reasonEn: 'Dissertation-for-hire services violate university honor codes.',
    legalContextSw: 'Kanuni za Uadilifu wa Kitaaluma.',
    legalContextEn: 'University Academic Integrity Regulations.',
  },
  {
    term: 'assignment cheating',
    category: 'academic_dishonesty',
    severity: 'high',
    reasonSw: 'Kufanya assignments kwa niaba ya wanafunzi kwa malipo ni marufuku.',
    reasonEn: 'Paid assignment contract cheating is banned.',
    legalContextSw: 'Kanuni za Wanafunzi za Vyuo Vikuu.',
    legalContextEn: 'Student Code of Conduct.',
  },
  {
    term: 'vyeti feki',
    category: 'academic_dishonesty',
    severity: 'critical',
    reasonSw: 'Kutengeneza au kuuza vyeti feki ni kosa kubwa la jinai (kughushi).',
    reasonEn: 'Manufacturing or distributing forged diplomas is a severe crime.',
    legalContextSw: 'Penal Code Cap 16 Vifungu 333 na 335 (Kughushi). Kifungo cha hadi miaka 7.',
    legalContextEn: 'Penal Code Cap 16 Sections 333 & 335 (Forgery). Up to 7 years imprisonment.',
  },
  {
    term: 'fake certificate',
    category: 'academic_dishonesty',
    severity: 'critical',
    reasonSw: 'Vyeti feki ni marufuku kabisa.',
    reasonEn: 'Forged academic certificates are strictly illegal.',
    legalContextSw: 'Penal Code Cap 16.',
    legalContextEn: 'Penal Code Cap 16.',
  },

  // Weapons & Dangerous Materials
  {
    term: 'bunduki',
    category: 'weapons_dangerous',
    severity: 'critical',
    reasonSw: 'Silaha za moto ni marufuku maeneo yote ya chuo kikuu na kwenye soko.',
    reasonEn: 'Firearms are strictly banned on campus grounds.',
    legalContextSw: 'Sheria ya Silaha na Risasi (Arms and Ammunition Act Cap 223).',
    legalContextEn: 'Arms and Ammunition Act (Cap 223).',
  },
  {
    term: 'gun',
    category: 'weapons_dangerous',
    severity: 'critical',
    reasonSw: 'Silaha za aina yoyote haziruhusiwi.',
    reasonEn: 'Weapons of any type are prohibited.',
    legalContextSw: 'Arms and Ammunition Act Cap 223.',
    legalContextEn: 'Arms and Ammunition Act Cap 223.',
  },
  {
    term: 'bastola',
    category: 'weapons_dangerous',
    severity: 'critical',
    reasonSw: 'Bastola na silaha ndogo za moto ni marufuku.',
    reasonEn: 'Handguns and pistols are strictly banned.',
    legalContextSw: 'Sheria ya Silaha za Moto.',
    legalContextEn: 'Firearms and Ammunition Act.',
  },
  {
    term: 'risasi',
    category: 'weapons_dangerous',
    severity: 'critical',
    reasonSw: 'Kuuza au kumiliki risasi ni uhalifu.',
    reasonEn: 'Ammunition trading is illegal.',
    legalContextSw: 'Arms and Ammunition Act.',
    legalContextEn: 'Arms and Ammunition Act.',
  },
  {
    term: 'vilipuzi',
    category: 'weapons_dangerous',
    severity: 'critical',
    reasonSw: 'Vifaa vya milipuko na fataki zisizo rasmi haviruhusiwi.',
    reasonEn: 'Explosives and hazardous pyrotechnics are banned.',
    legalContextSw: 'Sheria ya Vifaa vya Milipuko (Explosives Act Cap 45).',
    legalContextEn: 'Explosives Act (Cap 45).',
  },
  {
    term: 'kisu cha kivita',
    category: 'weapons_dangerous',
    severity: 'high',
    reasonSw: 'Visu vya kijeshi na silaha hatari haziruhusiwi.',
    reasonEn: 'Combat knives and tactical weapons are prohibited.',
    legalContextSw: 'Kanuni za Ulinzi na Amani Chuoni.',
    legalContextEn: 'Campus Security Regulations.',
  },

  // Drugs & Controlled Substances
  {
    term: 'bangi',
    category: 'drugs_controlled',
    severity: 'critical',
    reasonSw: 'Bangi na dawa zote za kulevya ni marufuku kabisa.',
    reasonEn: 'Cannabis and controlled narcotics are strictly banned.',
    legalContextSw: 'Sheria ya Kudhibiti Dawa za Kulevya (DCEA Act No. 5 of 2015).',
    legalContextEn: 'Drug Control and Enforcement Act No. 5 of 2015.',
  },
  {
    term: 'marijuana',
    category: 'drugs_controlled',
    severity: 'critical',
    reasonSw: 'Marijuana ni marufuku.',
    reasonEn: 'Cannabis is illegal.',
    legalContextSw: 'DCEA Act 2015.',
    legalContextEn: 'Drug Control Act 2015.',
  },
  {
    term: 'weed',
    category: 'drugs_controlled',
    severity: 'critical',
    reasonSw: 'Weed ni marufuku.',
    reasonEn: 'Cannabis is prohibited.',
    legalContextSw: 'DCEA Act 2015.',
    legalContextEn: 'Drug Control Act 2015.',
  },
  {
    term: 'mirungi',
    category: 'drugs_controlled',
    severity: 'critical',
    reasonSw: 'Mirungi (khat) ni kileo kilichopigwa marufuku Tanzania.',
    reasonEn: 'Khat (mirungi) is a prohibited stimulant under Tanzanian statutes.',
    legalContextSw: 'Sheria ya DCEA 2015.',
    legalContextEn: 'Drug Control Act 2015.',
  },
  {
    term: 'khat',
    category: 'drugs_controlled',
    severity: 'critical',
    reasonSw: 'Khat ni marufuku.',
    reasonEn: 'Khat is banned.',
    legalContextSw: 'DCEA Act 2015.',
    legalContextEn: 'Drug Control Act 2015.',
  },
  {
    term: 'shisha',
    category: 'drugs_controlled',
    severity: 'high',
    reasonSw: 'Shisha imepigwa marufuku maeneo ya umma na hosteli.',
    reasonEn: 'Shisha is banned across public and university dormitories.',
    legalContextSw: 'Marufuku ya Kitaifa ya Shisha Tanzania.',
    legalContextEn: 'National Shisha Prohibition.',
  },
  {
    term: 'gongo',
    category: 'drugs_controlled',
    severity: 'high',
    reasonSw: 'Pombe haramu zisizo na viwango vya TBS haziruhusiwi.',
    reasonEn: 'Illicit unstamped spirits are illegal.',
    legalContextSw: 'Sheria ya Pombe Haramu na Viwango vya TBS.',
    legalContextEn: 'TBS Standards & Intoxicating Liquors Act.',
  },

  // Counterfeits & Fraud
  {
    term: 'pesa bandia',
    category: 'counterfeit_fraud',
    severity: 'critical',
    reasonSw: 'Kutengeneza au kusambaza fedha bandia ni uhalifu mkubwa wa jinai.',
    reasonEn: 'Counterfeit currency is a federal financial crime.',
    legalContextSw: 'Penal Code Cap 16 kifungu 342 na BoT Act. Kifungo cha hadi miaka 14.',
    legalContextEn: 'Penal Code Cap 16 Section 342 & Bank of Tanzania Act.',
  },
  {
    term: 'counterfeit note',
    category: 'counterfeit_fraud',
    severity: 'critical',
    reasonSw: 'Fedha bandia haziruhusiwi.',
    reasonEn: 'Counterfeit notes are illegal.',
    legalContextSw: 'Bank of Tanzania Act.',
    legalContextEn: 'Bank of Tanzania Act.',
  },
  {
    term: 'sim card bila nida',
    category: 'counterfeit_fraud',
    severity: 'high',
    reasonSw: 'Kuuza laini za simu bila usajili halisi wa NIDA ni marufuku ya TCRA.',
    reasonEn: 'Selling pre-registered SIMs without NIDA verification violates TCRA laws.',
    legalContextSw: 'Kanuni za Usajili wa Laini za Simu za TCRA na EPOCA 2010.',
    legalContextEn: 'TCRA SIM Regulations & EPOCA 2010.',
  },

  // Stolen Goods
  {
    term: 'simu ya wizi',
    category: 'stolen_goods',
    severity: 'critical',
    reasonSw: 'Kuuza au kupokea simu ya wizi ni uhalifu wa jinai.',
    reasonEn: 'Selling or buying stolen phones is a felony.',
    legalContextSw: 'Penal Code Cap 16 kifungu 311 (Kupokea Mali ya Wizi).',
    legalContextEn: 'Penal Code Cap 16 Section 311 (Receiving Stolen Goods).',
  },
  {
    term: 'laptop iliyoibwa',
    category: 'stolen_goods',
    severity: 'critical',
    reasonSw: 'Kuuza kompyuta ya wizi ni kosa la jinai.',
    reasonEn: 'Selling stolen laptops is a felony.',
    legalContextSw: 'Penal Code Cap 16 Section 311.',
    legalContextEn: 'Penal Code Cap 16 Section 311.',
  },
  {
    term: 'bypass icloud',
    category: 'stolen_goods',
    severity: 'high',
    reasonSw: 'Huduma za kufungua vifaa vilivyoibiwa au iCloud locked haziruhusiwi.',
    reasonEn: 'Unlocking stolen or iCloud locked devices violates cybercrime statutes.',
    legalContextSw: 'Sheria ya Makosa ya Mtandao (Cybercrimes Act 2015).',
    legalContextEn: 'Cybercrimes Act 2015 Section 6.',
  },
];

/**
 * Helper to scan arbitrary text against the prohibited keywords database
 */
function scanTextForProhibitions(text: string): {
  isProhibited: boolean;
  matchedRules: ProhibitedRule[];
  primaryRule?: ProhibitedRule;
} {
  if (!text) return { isProhibited: false, matchedRules: [] };

  const normalized = text.toLowerCase();
  const normalizedNoPunct = normalized.replace(/[\._\-*#@/]/g, ' ');
  const condensed = normalized.replace(/[^a-z0-9]/g, '');

  const matchedRules: ProhibitedRule[] = [];

  for (const rule of PROHIBITED_KEYWORDS) {
    const term = rule.term.toLowerCase();
    const termCondensed = term.replace(/[^a-z0-9]/g, '');

    if (
      normalized.includes(term) ||
      normalizedNoPunct.includes(term) ||
      (term.length > 4 && condensed.includes(termCondensed))
    ) {
      if (!matchedRules.some((r) => r.term === rule.term)) {
        matchedRules.push(rule);
      }
    }
  }

  if (matchedRules.length === 0) {
    return { isProhibited: false, matchedRules: [] };
  }

  // Sort by severity (critical > high > medium)
  const order = { critical: 3, high: 2, medium: 1 };
  matchedRules.sort((a, b) => order[b.severity] - order[a.severity]);

  return {
    isProhibited: true,
    matchedRules,
    primaryRule: matchedRules[0],
  };
}

// =========================================================================
// 2. FIRESTORE TRIGGER: AUTO-MODERATION ON LISTING CREATION / UPDATE
// =========================================================================
/**
 * Triggers automatically whenever a listing document is created or modified in Firestore.
 * Evaluates listing title and description for weapons, drugs, exam leaks, and counterfeit goods.
 * If detected, automatically sets status to 'flagged' and creates an urgent report for moderators.
 */
export const onListingWritten = onDocumentWritten('listings/{listingId}', async (event) => {
  const listingId = event.params.listingId;
  const snap = event.data?.after;

  if (!snap || !snap.exists) {
    // Listing was deleted; nothing to moderate
    return null;
  }

  const data = snap.data();
  if (!data) return null;

  // Skip if already moderated and rejected/flagged
  if (data.status === 'flagged' || data.status === 'delisted') {
    return null;
  }

  const combinedText = `${data.title || ''} ${data.description || ''} ${data.category || ''}`;
  const scanResult = scanTextForProhibitions(combinedText);

  if (scanResult.isProhibited && scanResult.primaryRule) {
    const rule = scanResult.primaryRule;

    console.warn(`[Content Moderation Alert] Listing ${listingId} contains prohibited item: "${rule.term}" in category ${rule.category}`);

    const batch = db.batch();

    // 1. Update listing document status to 'flagged'
    const listingRef = snap.ref;
    batch.update(listingRef, {
      status: 'flagged',
      moderationFlag: {
        flaggedAt: admin.firestore.FieldValue.serverTimestamp(),
        matchedTerm: rule.term,
        category: rule.category,
        severity: rule.severity,
        reasonSw: rule.reasonSw,
        reasonEn: rule.reasonEn,
        legalNotice: rule.legalContextSw,
      },
    });

    // 2. Automatically generate an urgent safety report in the reports collection
    const reportRef = db.collection('reports').doc(`auto_${listingId}_${Date.now()}`);
    batch.set(reportRef, {
      id: reportRef.id,
      targetType: 'listing',
      targetId: listingId,
      targetTitleOrName: data.title || 'Untitled Listing',
      targetSubtitle: data.sellerName || 'Unknown Seller',
      reporterId: 'system_automod',
      reporterName: 'CampusSoko Automated Safety Screener',
      reason: rule.category === 'academic_dishonesty' ? 'exam_cheating' : 'prohibited_item',
      notes: `Automated detection: Listing title/description matched prohibited term "${rule.term}". Severity: ${rule.severity}. Action: Auto-flagged pending manual campus moderator action.`,
      severity: rule.severity,
      autoDetected: true,
      matchedKeywords: scanResult.matchedRules.map((r) => r.term),
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 3. Increment seller's violation counter
    if (data.sellerId) {
      const sellerRef = db.collection('users').doc(data.sellerId);
      batch.update(sellerRef, {
        violationStrikes: admin.firestore.FieldValue.increment(1),
        lastViolationAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
    return { flagged: true, term: rule.term };
  }

  return { flagged: false };
});

// =========================================================================
// 3. FIRESTORE TRIGGER: REPORT LIFECYCLE & RISK ESCALATION
// =========================================================================
/**
 * Triggers when a new student report is submitted.
 * Evaluates seller history; if user accumulates >= 3 reports or any critical report (weapons, exam leaks),
 * automatically freezes their profile and listings to protect the campus community.
 */
export const onReportCreated = onDocumentCreated('reports/{reportId}', async (event) => {
  const reportId = event.params.reportId;
  const snap = event.data;

  if (!snap) return null;
  const reportData = snap.data();

  console.log(`[Safety Report Ingestion] New report ${reportId} against ${reportData.targetType} ${reportData.targetId}`);

  // If user is being reported directly, calculate risk score
  const targetUserId = reportData.targetType === 'user' ? reportData.targetId : null;

  if (targetUserId) {
    const priorReportsSnap = await db
      .collection('reports')
      .where('targetId', '==', targetUserId)
      .where('status', 'in', ['pending', 'resolved'])
      .get();

    const reportCount = priorReportsSnap.size;

    // Critical escalation threshold: >= 3 reports or critical weapons/drugs allegation
    if (reportCount >= 3 || reportData.severity === 'critical') {
      console.warn(`[High Risk Threshold Exceeded] User ${targetUserId} has ${reportCount} reports. Freezing account for safety.`);

      const userRef = db.collection('users').doc(targetUserId);
      await userRef.update({
        isBanned: true,
        bannedReason: `Suspended due to safety escalation: ${reportCount} active reports (latest: ${reportData.reason})`,
        bannedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Delist or hide all active listings for this user
      const userListings = await db.collection('listings').where('sellerId', '==', targetUserId).get();
      const batch = db.batch();
      userListings.forEach((doc) => {
        batch.update(doc.ref, { status: 'delisted', delistReason: 'Seller account suspended by administration' });
      });
      await batch.commit();
    }
  }

  return { processed: true, reportId };
});

// =========================================================================
// 4. CALLABLE FUNCTION: REAL-TIME CLIENT-SIDE KEYWORD VALIDATOR
// =========================================================================
/**
 * Callable HTTPS API endpoint for web/mobile apps to check draft listings before submitting.
 */
export const validateListingContent = onCall(async (request) => {
  const { title = '', description = '' } = request.data || {};
  const combined = `${title} ${description}`;

  const result = scanTextForProhibitions(combined);

  if (result.isProhibited && result.primaryRule) {
    const p = result.primaryRule;
    return {
      isProhibited: true,
      matchedTerm: p.term,
      category: p.category,
      severity: p.severity,
      reasonSw: p.reasonSw,
      reasonEn: p.reasonEn,
      legalContextSw: p.legalContextSw,
      legalContextEn: p.legalContextEn,
      matchedTerms: result.matchedRules.map((r) => r.term),
    };
  }

  return {
    isProhibited: false,
    matchedTerms: [],
  };
});

// =========================================================================
// 5. CALLABLE FUNCTION: ADMIN REPORT RESOLUTION WITH AUDIT TRAIL
// =========================================================================
/**
 * Callable HTTPS API endpoint for authorized campus administrators to resolve reports.
 */
export const resolveModerationReport = onCall(async (request) => {
  // Ensure caller is an authenticated administrator
  if (!request.auth || !request.auth.token || !request.auth.token.isAdmin) {
    throw new HttpsError('permission-denied', 'Administrator role required to resolve safety reports.');
  }

  const { reportId, action, resolutionNotes = '' } = request.data || {};

  if (!reportId || !['dismiss', 'delist', 'ban_user'].includes(action)) {
    throw new HttpsError('invalid-argument', 'Invalid report resolution arguments.');
  }

  const reportRef = db.collection('reports').doc(reportId);
  const reportSnap = await reportRef.get();

  if (!reportSnap.exists) {
    throw new HttpsError('not-found', 'Report document not found.');
  }

  const report = reportSnap.data()!;
  const batch = db.batch();

  // Update report
  batch.update(reportRef, {
    status: action === 'dismiss' ? 'dismissed' : 'resolved',
    actionTaken: action,
    resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
    resolvedBy: request.auth.uid,
    resolutionNotes,
  });

  // Action on target
  if (action === 'delist' && report.targetType === 'listing') {
    const listingRef = db.collection('listings').doc(report.targetId);
    batch.update(listingRef, { status: 'delisted', delistedBy: request.auth.uid });
  } else if (action === 'ban_user') {
    const userRef = db.collection('users').doc(report.targetId);
    batch.update(userRef, { isBanned: true, bannedBy: request.auth.uid });
  }

  await batch.commit();

  return { success: true, reportId, action };
});
