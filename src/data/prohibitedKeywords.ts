export type ProhibitedCategory =
  | 'academic_dishonesty'
  | 'weapons_dangerous'
  | 'drugs_controlled'
  | 'counterfeit_fraud'
  | 'stolen_goods'
  | 'adult_prohibited';

export interface ProhibitedRule {
  term: string;
  category: ProhibitedCategory;
  severity: 'critical' | 'high' | 'medium';
  reasonSw: string;
  reasonEn: string;
  legalContextSw: string;
  legalContextEn: string;
}

export const PROHIBITED_KEYWORDS: ProhibitedRule[] = [
  // =========================================================================
  // 1. ACADEMIC DISHONESTY & EXAM LEAKS & CHEATING SERVICES
  // =========================================================================
  {
    term: 'leak mtihani',
    category: 'academic_dishonesty',
    severity: 'critical',
    reasonSw: 'Kuvujisha au kuuza mitihani ni kosa kubwa la kinidhamu la chuo na uhalifu wa kitaaluma.',
    reasonEn: 'Leaking or selling examination materials violates university disciplinary statutes and academic integrity codes.',
    legalContextSw: 'Miongozo ya TCU na Kanuni za Chuo (Universities Act No. 7 of 2005): Adhabu ni kufukuzwa chuo mara moja na kufikishwa kwenye vyombo vya sheria.',
    legalContextEn: 'TCU Regulations & University By-Laws: Offense carries summary expulsion and potential prosecution under the National Examinations Council Act.',
  },
  {
    term: 'exam leak',
    category: 'academic_dishonesty',
    severity: 'critical',
    reasonSw: 'Kuuza au kutafuta mitihani iliyovuja ya chuo kikuu au NECTA ni marufuku kabisa.',
    reasonEn: 'Trading university or national exam leaks is strictly prohibited across all campuses.',
    legalContextSw: 'Sheria ya Mitihani ya Taifa na Sheria ya Makosa ya Mtandao ya 2015 kifungu cha 16.',
    legalContextEn: 'National Examinations Act & Cybercrimes Act 2015 Section 16 (Unauthorized disclosure of secure computer data).',
  },
  {
    term: 'mitihani iliyovuja',
    category: 'academic_dishonesty',
    severity: 'critical',
    reasonSw: 'Matangazo ya mitihani iliyovuja hayaruhusiwi.',
    reasonEn: 'Listings advertising leaked examination papers are prohibited.',
    legalContextSw: 'Adhabu ya kufutiwa usajili wa chuo na kufunguliwa mashtaka ya jinai.',
    legalContextEn: 'Immediate deregistration from university and criminal charges.',
  },
  {
    term: 'necta leak',
    category: 'academic_dishonesty',
    severity: 'critical',
    reasonSw: 'Kuvujisha au kuuza mitihani ya NECTA ni kosa la jinai.',
    reasonEn: 'Leaking or distributing NECTA examination papers is an actionable crime.',
    legalContextSw: 'Sheria ya Baraza la Mitihani la Tanzania (NECTA Act).',
    legalContextEn: 'National Examinations Council of Tanzania Act.',
  },
  {
    term: 'kuandikiwa research',
    category: 'academic_dishonesty',
    severity: 'high',
    reasonSw: 'Huduma za kuandikiwa tafiti (research / dissertation / proposal) au udanganyifu wa kitaaluma haziruhusiwi.',
    reasonEn: 'Academic ghostwriting, research impersonation, and dissertation-for-hire services are strictly prohibited.',
    legalContextSw: 'Kanuni za Uadilifu wa Kitaaluma za Vyuo Vikuu Tanzania (Academic Integrity Regulations).',
    legalContextEn: 'University Academic Integrity Regulations: Grounds for revocation of academic awards.',
  },
  {
    term: 'kuandikiwa dissertation',
    category: 'academic_dishonesty',
    severity: 'high',
    reasonSw: 'Kuuza au kutoa huduma za kuandika tasnifu (dissertation) za wengine ni kinyume cha maadili.',
    reasonEn: 'Selling or advertising dissertation ghostwriting violates higher education research ethics.',
    legalContextSw: 'TCU Standards & Guidelines for Higher Education 2019.',
    legalContextEn: 'TCU Standards & Guidelines for Higher Education 2019.',
  },
  {
    term: 'dissertation for sale',
    category: 'academic_dishonesty',
    severity: 'high',
    reasonSw: 'Kuuza tafiti za kitaaluma ni kinyume cha sheria za hakimiliki na maadili ya chuo.',
    reasonEn: 'Selling dissertations or thesis works violates copyright and university ethics.',
    legalContextSw: 'Sheria ya Hakimiliki na Hakishiriki (Copyright and Neighbouring Rights Act).',
    legalContextEn: 'Copyright and Neighbouring Rights Act & university intellectual property regulations.',
  },
  {
    term: 'assignment cheating',
    category: 'academic_dishonesty',
    severity: 'high',
    reasonSw: 'Huduma za kufanya assignments au mitihani ya darasani kwa niaba ya mwanafunzi haziruhusiwi.',
    reasonEn: 'Paid contract cheating or taking assignments on behalf of students is strictly prohibited.',
    legalContextSw: 'Kanuni za mitihani ya chuo: Adhabu ya kusimamishwa masomo mwaka mzima au kufukuzwa.',
    legalContextEn: 'University Examination Regulations: Penalties include academic suspension or expulsion.',
  },
  {
    term: 'ghostwriting',
    category: 'academic_dishonesty',
    severity: 'high',
    reasonSw: 'Huduma za kuandikiwa kazi za kitaaluma za chuo haziruhusiwi sokoni.',
    reasonEn: 'Contract cheating and academic ghostwriting services are banned.',
    legalContextSw: 'Ukiukwaji wa mkataba wa mwanafunzi na chuo (Student Disciplinary Code).',
    legalContextEn: 'Breach of student enrollment terms & university disciplinary code.',
  },
  {
    term: 'vyeti feki',
    category: 'academic_dishonesty',
    severity: 'critical',
    reasonSw: 'Kuuza, kutengeneza au kusambaza vyeti feki vya chuo au sekondari ni kosa kubwa la jinai (kughushi).',
    reasonEn: 'Manufacturing, advertising, or distributing forged academic diplomas, certificates, or transcripts is a serious felony.',
    legalContextSw: 'Kifungu cha 333 na 335 cha Sheria ya Kanuni ya Adhabu (Penal Code Cap 16) - Kughushi (Forgery). Kifungo cha hadi miaka 7.',
    legalContextEn: 'Sections 333 & 335 of the Penal Code (Cap 16) - Forgery & uttering false documents. Punishable by up to 7 years imprisonment.',
  },
  {
    term: 'fake certificate',
    category: 'academic_dishonesty',
    severity: 'critical',
    reasonSw: 'Kuuza au kununua vyeti feki ni marufuku kabisa.',
    reasonEn: 'Selling forged credentials, fake degrees, or transcripts is strictly prohibited.',
    legalContextSw: 'Kughushi nyaraka rasmi (Penal Code Cap 16).',
    legalContextEn: 'Forgery of official documentation under Tanzanian Penal Code.',
  },
  {
    term: 'fake degree',
    category: 'academic_dishonesty',
    severity: 'critical',
    reasonSw: 'Matangazo ya shahada au stashahada feki ni marufuku.',
    reasonEn: 'Fraudulent degree credentials are fully banned.',
    legalContextSw: 'Sheria ya TCU na Kanuni za Makosa ya Jinai.',
    legalContextEn: 'TCU Accreditation Act and criminal forgery statutes.',
  },
  {
    term: 'kughushi cheti',
    category: 'academic_dishonesty',
    severity: 'critical',
    reasonSw: 'Huduma za kughushi nyaraka za chuo au serikali ni uhalifu wa jinai.',
    reasonEn: 'Document forgery services are criminal offenses.',
    legalContextSw: 'Kanuni ya Adhabu (Penal Code Cap 16) - Forgery.',
    legalContextEn: 'Penal Code Cap 16.',
  },

  // =========================================================================
  // 2. WEAPONS & DANGEROUS ITEMS
  // =========================================================================
  {
    term: 'bunduki',
    category: 'weapons_dangerous',
    severity: 'critical',
    reasonSw: 'Silaha za moto ni marufuku kabisa kwenye soko la wanafunzi na maeneo yote ya chuo kikuu.',
    reasonEn: 'Firearms are strictly banned on campus grounds and within the student marketplace.',
    legalContextSw: 'Sheria ya Silaha na Risasi (Arms and Ammunition Act Cap 223) na Kanuni za Ulinzi wa Chuo.',
    legalContextEn: 'Arms and Ammunition Act (Cap 223) & Campus Security By-Laws.',
  },
  {
    term: 'gun',
    category: 'weapons_dangerous',
    severity: 'critical',
    reasonSw: 'Silaha za aina yoyote haziruhusiwi kwenye jukwaa hili la wanafunzi.',
    reasonEn: 'Weapons of any type are prohibited in this student marketplace.',
    legalContextSw: 'Sheria ya Kanuni ya Adhabu na Kanuni za Usalama wa Chuo.',
    legalContextEn: 'Tanzania Arms and Ammunition Act & university safety statutes.',
  },
  {
    term: 'bastola',
    category: 'weapons_dangerous',
    severity: 'critical',
    reasonSw: 'Silaha za moto (bastola) ni marufuku kabisa.',
    reasonEn: 'Handguns and firearms are strictly prohibited.',
    legalContextSw: 'Sheria ya Silaha na Risasi ya Tanzania (Cap 223).',
    legalContextEn: 'Arms and Ammunition Act (Cap 223).',
  },
  {
    term: 'pistol',
    category: 'weapons_dangerous',
    severity: 'critical',
    reasonSw: 'Bastola na silaha za moto ni marufuku.',
    reasonEn: 'Pistols and firearms are strictly prohibited.',
    legalContextSw: 'Sheria ya Silaha za Moto Tanzania.',
    legalContextEn: 'Tanzania Firearms and Ammunition Act.',
  },
  {
    term: 'risasi',
    category: 'weapons_dangerous',
    severity: 'critical',
    reasonSw: 'Kuuza au kumiliki risasi za silaha ni uhalifu wa jinai.',
    reasonEn: 'Ammunition trading is an actionable criminal violation.',
    legalContextSw: 'Sheria ya Silaha na Risasi (Cap 223).',
    legalContextEn: 'Arms and Ammunition Act (Cap 223).',
  },
  {
    term: 'ammunition',
    category: 'weapons_dangerous',
    severity: 'critical',
    reasonSw: 'Kuuza risasi ni marufuku.',
    reasonEn: 'Ammunition sales are illegal.',
    legalContextSw: 'Arms and Ammunition Act.',
    legalContextEn: 'Arms and Ammunition Act.',
  },
  {
    term: 'vilipuzi',
    category: 'weapons_dangerous',
    severity: 'critical',
    reasonSw: 'Vifaa vya milipuko na fataki zisizo rasmi haviruhusiwi chuoni.',
    reasonEn: 'Explosives and unauthorized pyrotechnics are hazardous and illegal.',
    legalContextSw: 'Sheria ya Vifaa vya Milipuko (Explosives Act).',
    legalContextEn: 'Explosives Act (Cap 45).',
  },
  {
    term: 'explosives',
    category: 'weapons_dangerous',
    severity: 'critical',
    reasonSw: 'Vilipuzi ni marufuku.',
    reasonEn: 'Explosives are strictly prohibited.',
    legalContextSw: 'Explosives Act.',
    legalContextEn: 'Explosives Act.',
  },
  {
    term: 'kisu cha kivita',
    category: 'weapons_dangerous',
    severity: 'high',
    reasonSw: 'Visu vya kijeshi au mapanga ya vurugu haviruhusiwi sokoni.',
    reasonEn: 'Combat knives, tactical blades, or combat weapons are prohibited.',
    legalContextSw: 'Kanuni za Usalama wa Wanafunzi Vyuo Vikuu.',
    legalContextEn: 'Campus Security and Peace Preservation By-Laws.',
  },
  {
    term: 'taser',
    category: 'weapons_dangerous',
    severity: 'high',
    reasonSw: 'Vifaa vya umeme vya kushambulia watu (stun guns/tasers) haviruhusiwi.',
    reasonEn: 'Stun guns, tasers, and electroshock weapons are prohibited.',
    legalContextSw: 'Sheria za Polisi na Kanuni za Silaha Zilizozuiwa.',
    legalContextEn: 'Prohibited Offensive Weapons Regulations.',
  },
  {
    term: 'stun gun',
    category: 'weapons_dangerous',
    severity: 'high',
    reasonSw: 'Silaha za shoti ya umeme haziruhusiwi.',
    reasonEn: 'Electroshock weapons are prohibited.',
    legalContextSw: 'Offensive Weapons Act.',
    legalContextEn: 'Offensive Weapons Act.',
  },

  // =========================================================================
  // 3. DRUGS & CONTROLLED SUBSTANCES
  // =========================================================================
  {
    term: 'bangi',
    category: 'drugs_controlled',
    severity: 'critical',
    reasonSw: 'Bangi na dawa zote za kulevya ni marufuku kabisa kwenye mabweni, vyuo, na CampusSoko.',
    reasonEn: 'Cannabis and illicit narcotics are strictly prohibited on campus premises and within CampusSoko.',
    legalContextSw: 'Sheria ya Kudhibiti Dawa za Kulevya (Drug Control and Enforcement Act No. 5 of 2015). Kifungo cha miaka hadi 30.',
    legalContextEn: 'Drug Control and Enforcement Act No. 5 of 2015: Carries severe criminal penalties and student expulsion.',
  },
  {
    term: 'marijuana',
    category: 'drugs_controlled',
    severity: 'critical',
    reasonSw: 'Dawa za kulevya haziruhusiwi kabisa.',
    reasonEn: 'Cannabis is strictly prohibited on campus.',
    legalContextSw: 'Drug Control and Enforcement Act.',
    legalContextEn: 'Drug Control and Enforcement Act 2015.',
  },
  {
    term: 'weed',
    category: 'drugs_controlled',
    severity: 'critical',
    reasonSw: 'Kuuza au kutangaza bangi/weed ni marufuku.',
    reasonEn: 'Trading or advertising cannabis/weed is prohibited.',
    legalContextSw: 'Sheria ya DCEA Tanzania.',
    legalContextEn: 'DCEA Enforcement Regulations.',
  },
  {
    term: 'mirungi',
    category: 'drugs_controlled',
    severity: 'critical',
    reasonSw: 'Mirungi ni kileo kilichopigwa marufuku na sheria za Tanzania na miongozo ya vyuo.',
    reasonEn: 'Khat (mirungi) is a prohibited controlled stimulant under Tanzanian law.',
    legalContextSw: 'Sheria ya Dawa za Kulevya ya 2015.',
    legalContextEn: 'Drug Control and Enforcement Act 2015.',
  },
  {
    term: 'khat',
    category: 'drugs_controlled',
    severity: 'critical',
    reasonSw: 'Khat ni marufuku.',
    reasonEn: 'Khat is a prohibited substance.',
    legalContextSw: 'Drug Control Act.',
    legalContextEn: 'Drug Control Act.',
  },
  {
    term: 'cocaine',
    category: 'drugs_controlled',
    severity: 'critical',
    reasonSw: 'Dawa za kulevya ni marufuku kabisa.',
    reasonEn: 'Narcotics are strictly prohibited.',
    legalContextSw: 'Drug Control and Enforcement Act No. 5 of 2015.',
    legalContextEn: 'Drug Control and Enforcement Act No. 5 of 2015.',
  },
  {
    term: 'heroin',
    category: 'drugs_controlled',
    severity: 'critical',
    reasonSw: 'Dawa za kulevya ni marufuku.',
    reasonEn: 'Hard narcotics are prohibited.',
    legalContextSw: 'DCEA Act 2015.',
    legalContextEn: 'DCEA Act 2015.',
  },
  {
    term: 'shisha',
    category: 'drugs_controlled',
    severity: 'high',
    reasonSw: 'Shisha na vifaa vinavyohusiana vimepigwa marufuku maeneo ya umma na vyuo vikuu nchini Tanzania.',
    reasonEn: 'Shisha smoking and paraphernalia are banned in public and university spaces in Tanzania.',
    legalContextSw: 'Marufuku ya Kitaifa ya Shisha ya Serikali ya Jamhuri ya Muungano wa Tanzania.',
    legalContextEn: 'National Ban on Shisha Tobacco in Tanzania.',
  },
  {
    term: 'gongo',
    category: 'drugs_controlled',
    severity: 'high',
    reasonSw: 'Pombe haramu zisizosajiliwa (kama gongo) haziruhusiwi kwenye jukwaa la wanafunzi.',
    reasonEn: 'Illicit unstamped spirits and moonshine (gongo) are strictly banned.',
    legalContextSw: 'Sheria ya Pombe Haramu na Viwango vya TBS.',
    legalContextEn: 'Intoxicating Liquors Act & TBS Standards.',
  },
  {
    term: 'tramadol',
    category: 'drugs_controlled',
    severity: 'high',
    reasonSw: 'Dawa zenye maagizo ya daktari (prescription medication) haziruhusiwi kuuzwa na wanafunzi.',
    reasonEn: 'Prescription pharmaceuticals (such as Tramadol or sedatives) may not be sold without medical pharmacy licenses.',
    legalContextSw: 'Mamlaka ya Dawa na Vifaa Tiba (TMDA Act 2019).',
    legalContextEn: 'Tanzania Medicines and Medical Devices Authority (TMDA Act 2019).',
  },

  // =========================================================================
  // 4. COUNTERFEIT GOODS & FINANCIAL FRAUD
  // =========================================================================
  {
    term: 'pesa bandia',
    category: 'counterfeit_fraud',
    severity: 'critical',
    reasonSw: 'Kutengeneza, kusambaza au kutumia noti feki/bandia ni uhalifu mkubwa wa kifedha wa jinai.',
    reasonEn: 'Manufacturing, trading, or circulating counterfeit bank notes is a severe federal financial crime.',
    legalContextSw: 'Kifungu cha 342 cha Sheria ya Kanuni ya Adhabu (Penal Code) na Sheria ya Benki Kuu ya Tanzania (BoT Act). Kifungo cha miaka hadi 14.',
    legalContextEn: 'Section 342 of Penal Code Cap 16 & Bank of Tanzania Act. Carries up to 14 years imprisonment.',
  },
  {
    term: 'counterfeit note',
    category: 'counterfeit_fraud',
    severity: 'critical',
    reasonSw: 'Fedha bandia haziruhusiwi.',
    reasonEn: 'Counterfeit currency is illegal.',
    legalContextSw: 'Bank of Tanzania Act & Penal Code.',
    legalContextEn: 'Bank of Tanzania Act & Penal Code.',
  },
  {
    term: 'fake dollar',
    category: 'counterfeit_fraud',
    severity: 'critical',
    reasonSw: 'Dola feki au fedha za kigeni bandia ni kosa la jinai.',
    reasonEn: 'Counterfeit foreign exchange is a federal criminal violation.',
    legalContextSw: 'BoT Foreign Exchange Regulations & Penal Code.',
    legalContextEn: 'BoT Foreign Exchange Regulations & Penal Code.',
  },
  {
    term: 'dola bandia',
    category: 'counterfeit_fraud',
    severity: 'critical',
    reasonSw: 'Fedha za kigeni bandia haziruhusiwi.',
    reasonEn: 'Counterfeit currency is banned.',
    legalContextSw: 'Sheria ya BoT na Kanuni ya Adhabu.',
    legalContextEn: 'Bank of Tanzania Act.',
  },
  {
    term: 'hacked account',
    category: 'counterfeit_fraud',
    severity: 'high',
    reasonSw: 'Kuuza au kusambaza akaunti zilizodukuliwa (barua pepe za chuo, ARIS/SARIS portals, mitandao) ni uhalifu wa kimtandao.',
    reasonEn: 'Selling compromised student portal credentials, email accounts, or software accounts violates cybercrime law.',
    legalContextSw: 'Sheria ya Makosa ya Mtandao (Cybercrimes Act No. 14 of 2015), Vifungu vya 3 na 4.',
    legalContextEn: 'Cybercrimes Act No. 14 of 2015 Sections 3 & 4 (Illegal access to computer systems).',
  },
  {
    term: 'sim card bila nida',
    category: 'counterfeit_fraud',
    severity: 'high',
    reasonSw: 'Kuuza laini za simu zilizosajiliwa kinyume cha utaratibu wa TCRA na bila uthibitisho wa NIDA ni marufuku.',
    reasonEn: 'Selling pre-registered SIM cards without physical biometric NIDA verification violates TCRA telecommunications laws.',
    legalContextSw: 'Kanuni za Usajili wa Laini za Simu za TCRA na Sheria ya Posta na Mawasiliano ya Kielektroniki (EPOCA 2010).',
    legalContextEn: 'TCRA SIM Card Biometric Registration Regulations & EPOCA 2010.',
  },
  {
    term: 'laini iliyosajiliwa',
    category: 'counterfeit_fraud',
    severity: 'high',
    reasonSw: 'Kuuza laini iliyosajiliwa tayari kwa jina la mtu mwingine ni marufuku na kunavunja sheria za TCRA.',
    reasonEn: 'Selling SIM cards already registered under third-party identities violates TCRA regulations.',
    legalContextSw: 'Kanuni za TCRA na Sheria ya EPOCA.',
    legalContextEn: 'TCRA Regulations & Electronic Communications Act.',
  },

  // =========================================================================
  // 5. STOLEN GOODS & COMPROMISED HARDWARE
  // =========================================================================
  {
    term: 'simu ya wizi',
    category: 'stolen_goods',
    severity: 'critical',
    reasonSw: 'Kuuza au kununua kifaa chochote cha wizi ni kosa kubwa la jinai (kupokea mali ya wizi).',
    reasonEn: 'Handling, selling, or buying stolen goods is a serious criminal felony (receiving stolen property).',
    legalContextSw: 'Kifungu cha 311 cha Sheria ya Kanuni ya Adhabu (Penal Code Cap 16) - Kupokea Mali ya Wizi. Kifungo cha miaka hadi 7.',
    legalContextEn: 'Section 311 of Penal Code (Cap 16) - Receiving stolen property. Punishable by up to 7 years imprisonment.',
  },
  {
    term: 'stolen phone',
    category: 'stolen_goods',
    severity: 'critical',
    reasonSw: 'Simu za wizi haziruhusiwi.',
    reasonEn: 'Stolen devices are strictly prohibited.',
    legalContextSw: 'Penal Code Cap 16 Section 311.',
    legalContextEn: 'Penal Code Cap 16 Section 311.',
  },
  {
    term: 'laptop iliyoibwa',
    category: 'stolen_goods',
    severity: 'critical',
    reasonSw: 'Kuuza kompyuta au kifaa cha wizi chuoni ni kosa la jinai.',
    reasonEn: 'Selling stolen campus property or laptops is a criminal offense.',
    legalContextSw: 'Sheria ya Kanuni ya Adhabu.',
    legalContextEn: 'Penal Code Cap 16.',
  },
  {
    term: 'bypass icloud',
    category: 'stolen_goods',
    severity: 'high',
    reasonSw: 'Kutoa huduma za kufungua au kuvunja (bypass) iCloud au Google FRP za vifaa vilivyofungwa kwa wizi hakuruhusiwi.',
    reasonEn: 'Offering iCloud bypass or stolen device firmware modifications is strictly prohibited.',
    legalContextSw: 'Sheria ya Makosa ya Mtandao ya 2015 kifungu cha 6.',
    legalContextEn: 'Cybercrimes Act 2015 Section 6 (Unauthorized modification of computer data).',
  },
  {
    term: 'clean imei change',
    category: 'stolen_goods',
    severity: 'high',
    reasonSw: 'Kubadili namba ya IMEI ya simu ni kinyume cha sheria za TCRA na kunaficha rekodi za vifaa vilivyoibiwa.',
    reasonEn: 'Altering mobile phone IMEI hardware identifiers violates TCRA regulations and masks stolen gear.',
    legalContextSw: 'Kanuni za Vifaa vya Mawasiliano za TCRA.',
    legalContextEn: 'TCRA Telecommunications Equipment Standards.',
  },
];

export interface KeywordMatchResult {
  isProhibited: boolean;
  matchedTerm?: string;
  category?: ProhibitedCategory;
  severity?: 'critical' | 'high' | 'medium';
  reasonSw?: string;
  reasonEn?: string;
  legalContextSw?: string;
  legalContextEn?: string;
  matchedRules: ProhibitedRule[];
}

/**
 * Normalizes text and runs automated keyword checks against all university prohibited terms.
 */
export function checkProhibitedContent(text: string): KeywordMatchResult {
  if (!text || typeof text !== 'string') {
    return { isProhibited: false, matchedRules: [] };
  }

  // Normalize: lower case, strip extra special punctuation that spammers use to disguise terms (e.g., b.a.n.g.i -> bangi)
  const normalizedRaw = text.toLowerCase();
  const normalizedDePunct = normalizedRaw.replace(/[\._\-*#@/]/g, ' ');
  const condensed = normalizedRaw.replace(/[^a-z0-9]/g, '');

  const matchedRules: ProhibitedRule[] = [];

  for (const rule of PROHIBITED_KEYWORDS) {
    const term = rule.term.toLowerCase();
    const termCondensed = term.replace(/[^a-z0-9]/g, '');

    // Check direct substring in raw, de-punctuated, or condensed representation
    const hasMatch =
      normalizedRaw.includes(term) ||
      normalizedDePunct.includes(term) ||
      (term.length > 4 && condensed.includes(termCondensed));

    if (hasMatch) {
      if (!matchedRules.some((r) => r.term === rule.term)) {
        matchedRules.push(rule);
      }
    }
  }

  if (matchedRules.length > 0) {
    // Pick the most severe rule as primary
    const sorted = [...matchedRules].sort((a, b) => {
      const order = { critical: 3, high: 2, medium: 1 };
      return order[b.severity] - order[a.severity];
    });

    const primary = sorted[0];

    return {
      isProhibited: true,
      matchedTerm: primary.term,
      category: primary.category,
      severity: primary.severity,
      reasonSw: primary.reasonSw,
      reasonEn: primary.reasonEn,
      legalContextSw: primary.legalContextSw,
      legalContextEn: primary.legalContextEn,
      matchedRules,
    };
  }

  return { isProhibited: false, matchedRules: [] };
}

export const PROHIBITED_CATEGORIES_INFO = [
  {
    id: 'academic_dishonesty',
    titleSw: 'Mitihani, Kazi za Chuo & Udanganyifu wa Kitaaluma',
    titleEn: 'Academic Dishonesty, Exam Leaks & Ghostwriting',
    icon: 'GraduationCap',
    color: '#dc2626',
    bgColor: 'bg-red-500/10 text-red-600 dark:text-red-400',
    summarySw: 'Mitihani iliyovuja ya chuo au NECTA, huduma za kuandikiwa dissertation/research/assignments, na vyeti vya kughushi.',
    summaryEn: 'Leaked examinations, contract cheating, dissertation/assignment ghostwriting, and forged educational certificates.',
    rulesSw: [
      'Marufuku kabisa kutangaza mitihani iliyovuja ya vyuo vikuu au mitihani ya kitaifa ya NECTA.',
      'Huduma za kulipia kuandikiwa dissertation, research proposal, au coursework zimepigwa marufuku (Academic Integrity Code).',
      'Kuuza au kusambaza vyeti feki vya chuo, shahada, au diploma ni kosa kubwa la jinai chini ya Penal Code kifungu cha 333.',
      'Ukiukaji husababisha kufukuzwa chuo mara moja bila msamaha na kufikishwa kwenye vyombo vya dola.',
    ],
    rulesEn: [
      'Strict ban on offering or soliciting leaked university tests, end-of-semester papers, or NECTA national exams.',
      'Contract cheating, paid ghostwriting of dissertations, theses, and course assignments is forbidden.',
      'Manufacturing or buying forged degrees, transcripts, or academic certificates is a felony under Penal Code Section 333.',
      'Violators face immediate expulsion from higher learning institutions and referral to the police.',
    ],
    legalBasisSw: 'TCU Standards & Guidelines 2019, Universities Act 2005, NECTA Act, na Penal Code Cap 16.',
    legalBasisEn: 'TCU Standards & Guidelines 2019, Universities Act 2005, NECTA Act, and Penal Code Cap 16.',
  },
  {
    id: 'weapons_dangerous',
    titleSw: 'Silaha, Vilipuzi & Vifaa Hatari',
    titleEn: 'Weapons, Explosives & Hazardous Contraband',
    icon: 'ShieldAlert',
    color: '#e11d48',
    bgColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    summarySw: 'Silaha za moto, risasi, bastola, vilipuzi, visu vya kivita, na tasers.',
    summaryEn: 'Firearms, handguns, ammunition, explosives, tactical blades, and stun weapons.',
    rulesSw: [
      'Silaha za moto, bastola, na risasi ni marufuku kabisa kwenye hosteli na majukwaa ya wanafunzi.',
      'Vilipuzi vya aina yoyote au fataki zisizoidhinishwa haziruhusiwi kwenye maeneo ya chuo.',
      'Silaha za shoti ya umeme (tasers/stun guns) na visu vya kivita ni marufuku.',
      'Taarifa za silaha zinaripotiwa mara moja kwa Idara ya Ulinzi ya Chuo na Kituo cha Polisi.',
    ],
    rulesEn: [
      'Firearms, handguns, and ammunition are banned across all university halls and student marketplaces.',
      'Explosives, improvised fireworks, and hazardous chemicals are forbidden.',
      'Electroshock weapons (tasers, stun devices) and combat daggers are strictly prohibited.',
      'Reports of weapon sales trigger immediate campus security dispatch and Tanzania Police Force notification.',
    ],
    legalBasisSw: 'Sheria ya Silaha na Risasi (Arms and Ammunition Act Cap 223) na Kanuni za Ulinzi wa Chuo.',
    legalBasisEn: 'Arms and Ammunition Act (Cap 223) & Campus Security By-Laws.',
  },
  {
    id: 'drugs_controlled',
    titleSw: 'Dawa za Kulevya & Vileo Vilivyopigwa Marufuku',
    titleEn: 'Illicit Drugs & Controlled Substances',
    icon: 'AlertTriangle',
    color: '#7c3aed',
    bgColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    summarySw: 'Bangi, mirungi/khat, shisha, dawa za hospitali bila cheti (tramadol), na vileo haramu.',
    summaryEn: 'Cannabis, khat, shisha tobacco, unlicensed prescription opioids (Tramadol), and illicit spirits.',
    rulesSw: [
      'Bangi, mirungi (khat), na dawa zote za kulevya ni marufuku kabisa.',
      'Shisha na vifaa vyake vimepigwa marufuku maeneo yote ya umma na hosteli za wanafunzi.',
      'Dawa zenye maagizo ya daktari haziruhusiwi kuuzwa na wanafunzi bila leseni ya TMDA.',
      'Pombe haramu zisizo na viwango vya TBS (kama gongo) haziruhusiwi.',
    ],
    rulesEn: [
      'Zero tolerance for cannabis (bangi), khat (mirungi), and controlled narcotics.',
      'Shisha and related paraphernalia are prohibited in all residential campus spaces.',
      'Prescription medicines cannot be resold without TMDA pharmaceutical licensing.',
      'Illicit or uninspected home-distilled spirits (gongo) are illegal.',
    ],
    legalBasisSw: 'Sheria ya Kudhibiti Dawa za Kulevya (DCEA Act No. 5 of 2015) na Sheria ya TMDA ya 2019.',
    legalBasisEn: 'Drug Control and Enforcement Act No. 5 of 2015 & TMDA Act 2019.',
  },
  {
    id: 'counterfeit_fraud',
    titleSw: 'Fedha Bandia, Vitu Feki & Utapeli',
    titleEn: 'Counterfeit Currency, Forged Notes & Scams',
    icon: 'Banknote',
    color: '#d97706',
    bgColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    summarySw: 'Noti feki za Kitanzania au kigeni, akaunti zilizodukuliwa, na laini za simu bila NIDA.',
    summaryEn: 'Counterfeit local or foreign banknotes, hacked student accounts, and unverified SIM cards.',
    rulesSw: [
      'Kutengeneza au kusambaza fedha bandia ni uhalifu unaobeba kifungo cha hadi miaka 14.',
      'Kuuza akaunti zilizoibwa au kudukuliwa za mifumo ya chuo (SARIS, ARIS, emails) ni kosa la kimtandao.',
      'Kuuza laini za simu zilizosajiliwa bila usajili halisi wa kibaometiki wa NIDA ni marufuku ya TCRA.',
      'Kuahidi kupata mikopo ya HESLB au huduma za vyuo kwa njia za udanganyifu ni marufuku.',
    ],
    rulesEn: [
      'Counterfeit currency manufacturing or circulation carries up to 14 years imprisonment.',
      'Trafficking hacked student portal credentials (ARIS, SARIS, university email) violates Cybercrimes Act.',
      'Selling pre-registered SIM cards without physical biometric NIDA checks violates TCRA laws.',
      'HESLB loan manipulation scams or bribing university officers are criminalized.',
    ],
    legalBasisSw: 'Penal Code Cap 16 kifungu cha 342, Sheria ya BoT, Cybercrimes Act 2015, na EPOCA 2010.',
    legalBasisEn: 'Penal Code Cap 16 Section 342, BoT Act, Cybercrimes Act 2015, and EPOCA 2010.',
  },
  {
    id: 'stolen_goods',
    titleSw: 'Mali za Wizi & Simu/Laptops Zilizofungwa',
    titleEn: 'Stolen Property & Tampered Electronics',
    icon: 'Lock',
    color: '#ea580c',
    bgColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    summarySw: 'Simu na laptops za wizi, vifaa vilivyofungwa iCloud/Google FRP, na kubadili namba za IMEI.',
    summaryEn: 'Stolen student laptops and phones, iCloud/Google FRP locked devices, and IMEI alteration.',
    rulesSw: [
      'Kuuza au kupokea mali yoyote ya wizi ni kosa la jinai chini ya Penal Code kifungu cha 311.',
      'Matangazo ya "kufungua simu iliyofungwa ya wizi" au "iCloud bypass" hayaruhusiwi.',
      'Kubadilisha namba ya IMEI ya simu ni kinyume cha miongozo ya usalama ya TCRA.',
      'Wanunuzi wanashauriwa kudai uthibitisho wa umiliki au risiti wakati wa kununua gadgets za gharama.',
    ],
    rulesEn: [
      'Selling or receiving stolen goods is a crime under Penal Code Section 311 (Receiving Stolen Property).',
      'Services offering iCloud locks bypass or Google FRP bypass for stolen devices are banned.',
      'Changing IMEI numbers of mobile phones is illegal under TCRA regulations.',
      'Buyers are advised to verify proof of ownership or original purchase receipts for high-value items.',
    ],
    legalBasisSw: 'Penal Code Cap 16 kifungu cha 311 na Miongozo ya TCRA ya Usalama wa Vifaa vya Mawasiliano.',
    legalBasisEn: 'Penal Code Cap 16 Section 311 and TCRA Telecommunications Security Guidelines.',
  },
];
