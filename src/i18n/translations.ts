import type { ActionItem, Anomaly } from '../types';

export const translations = {
  en: {
    // Header
    title: "Operations Cockpit",
    subtitle: "Welcome back, Lead Dispatcher. Shift started at 09:00 AM.",
    statusNominal: "System Status: Nominal",
    statusWarning: "System Status: Alerts Active",
    langToggle: "हिन्दी",
    bandwidthToggle: "Low Bandwidth",
    bandwidthDense: "High Density",
    darkModeToggle: "Dark Mode",
    lightModeToggle: "Light Mode",
    shortcutsBtn: "Keyboard Shortcuts",
    lastSynced: "Last synced",

    // Live Metrics
    cutoffHeader: "SLA Batch Dispatch Cutoff",
    cutoffTime: "10:00 AM Batch",
    liveQueueAge: "Avg Critical Queue Age",
    activeShipments: "Urgent Shipments",
    seconds: "s",
    minutes: "m",
    hours: "h",

    // Action Items Panel
    actionHeader: "Top 5 Action Items Today",
    actionSub: "Crucial tasks requiring manual operational overrides.",
    approve: "Approve",
    hold: "Hold",
    undo: "Undo",
    approvedBadge: "Approved",
    heldBadge: "Held on Hold",
    keyboardNavTip: "Press [j] / [k] to navigate, [a] to Approve, [h] to Hold.",
    allDone: "All daily top action items resolved! Excellent job.",

    // Anomalies Panel
    anomalyHeader: "Automated System Anomalies",
    anomalySub: "Flagged anomalies by telemetry networks. Requires immediate review.",
    mute: "Mute",
    resolve: "Resolve",
    mutedBadge: "Muted",
    resolvedBadge: "Resolved",
    criticalSeverity: "CRITICAL",
    highSeverity: "HIGH",
    mediumSeverity: "MEDIUM",
    noAnomalies: "No active anomalies flagged.",

    // Keyboard Dialog
    shortcutsTitle: "Operational Keyboard Shortcuts",
    shortcutJ: "Move Selection Down",
    shortcutK: "Move Selection Up",
    shortcutA: "Approve Selected Item",
    shortcutH: "Hold Selected Item",
    shortcutEsc: "Close Guide / Unselect",
    shortcutQuestion: "Toggle Keyboard Shortcuts Help",
    close: "Close",

    // Lower Bandwidth Banner
    bandwidthWarning: "Low-Bandwidth Mode active. Dropping charts, images, and visual styling for optimal speed.",

    // Database & Storage Audit Ledger
    ledgerTitle: "Operational Database & Storage Audit Ledger",
    ledgerSub: "Physical window.localStorage telemetry & live state transactions",
    storageMedium: "Storage Engine",
    dbSize: "Active Size",
    activeKeys: "Monitored Keys",
    bytes: "bytes",
    rawPayload: "Raw Local JSON State Console",
    auditLog: "Live Event Logs (Operational Session Transactions)",
    resetStorage: "Factory Reset Storage",
    resetStorageConfirm: "Are you sure you want to permanently clear all localStorage overrides and reset to operational defaults?",
    copyPayload: "Copy JSON Payload",
    copied: "Payload copied to clipboard successfully!",
    toggleView: "Toggle Raw Payload View",
    logsClear: "Clear Logs"
  },
  hi: {
    // Header
    title: "संचालन कॉकपिट",
    subtitle: "आपका स्वागत है, मुख्य प्रेषक। आपकी पाली सुबह 09:00 बजे शुरू हुई।",
    statusNominal: "प्रणाली की स्थिति: सामान्य",
    statusWarning: "प्रणाली की स्थिति: अलर्ट सक्रिय",
    langToggle: "English",
    bandwidthToggle: "कम बैंडविड्थ",
    bandwidthDense: "उच्च घनत्व",
    darkModeToggle: "डार्क मोड",
    lightModeToggle: "लाइट मोड",
    shortcutsBtn: "कीबोर्ड शॉर्टकट्स",
    lastSynced: "आखिरी बार सिंक हुआ",

    // Live Metrics
    cutoffHeader: "SLA बैच प्रेषण समय सीमा",
    cutoffTime: "10:00 AM बैच",
    liveQueueAge: "औसत गंभीर कतार आयु",
    activeShipments: "अति आवश्यक शिपमेंट",
    seconds: "सेकंड",
    minutes: "मिनट",
    hours: "घंटे",

    // Action Items Panel
    actionHeader: "आज की शीर्ष 5 कार्रवाई वस्तुएं",
    actionSub: "मैन्युअल संचालन ओवरराइड की आवश्यकता वाले महत्वपूर्ण कार्य।",
    approve: "स्वीकार करें",
    hold: "रोकें",
    undo: "पूर्ववत",
    approvedBadge: "स्वीकृत",
    heldBadge: "रोका गया",
    keyboardNavTip: "नेविगेट करने के लिए [j] / [k], स्वीकार करने के लिए [a], रोकने के लिए [h] दबाएं।",
    allDone: "सभी शीर्ष दैनिक कार्रवाई वस्तुओं का समाधान हो गया है! उत्कृष्ट कार्य।",

    // Anomalies Panel
    anomalyHeader: "स्वचालित प्रणाली विसंगतियां",
    anomalySub: "टेलीमेट्री नेटवर्क द्वारा चिह्नित विसंगतियां। तत्काल समीक्षा आवश्यक है।",
    mute: "म्यूट करें",
    resolve: "सुलझाएं",
    mutedBadge: "म्यूट किया गया",
    resolvedBadge: "सुलझाया गया",
    criticalSeverity: "अति गंभीर",
    highSeverity: "गंभीर",
    mediumSeverity: "मध्यम",
    noAnomalies: "कोई सक्रिय विसंगति नहीं मिली।",

    // Keyboard Dialog
    shortcutsTitle: "परिचालन कीबोर्ड शॉर्टकट्स",
    shortcutJ: "चयन नीचे ले जाएं",
    shortcutK: "चयन ऊपर ले जाएं",
    shortcutA: "चयनित आइटम स्वीकार करें",
    shortcutH: "चयनित आइटम रोकें",
    shortcutEsc: "गाइड बंद करें / अचयनित करें",
    shortcutQuestion: "कीबोर्ड शॉर्टकट्स गाइड चालू/बंद करें",
    close: "बंद करें",

    // Lower Bandwidth Banner
    bandwidthWarning: "कम-बैंडविड्थ मोड सक्रिय। बेहतर गति के लिए चार्ट और भारी दृश्यों को हटाया गया है।",

    // Database & Storage Audit Ledger
    ledgerTitle: "परिचालन डेटाबेस और स्टोरेज ऑडिट लेजर",
    ledgerSub: "भौतिक window.localStorage टेलीमेट्री और लाइव स्थिति लेनदेन",
    storageMedium: "स्टोरेज इंजन",
    dbSize: "सक्रिय आकार",
    activeKeys: "निगरानी की गई कुंजियाँ",
    bytes: "बाइट्स",
    rawPayload: "रॉ लोकल JSON स्टेट कंसोल",
    auditLog: "लाइव इवेंट लॉग्स (परिचालन सत्र लेनदेन)",
    resetStorage: "फैक्ट्री रीसेट स्टोरेज",
    resetStorageConfirm: "क्या आप वाकई सभी localStorage ओवरराइड को स्थायी रूप से साफ़ करना चाहते हैं और परिचालन डिफ़ॉल्ट पर रीसेट करना चाहते हैं?",
    copyPayload: "JSON पेलोड कॉपी करें",
    copied: "पेलोड क्लिपबोर्ड पर सफलतापूर्वक कॉपी हो गया!",
    toggleView: "रॉ पेलोड व्यू चालू/बंद करें",
    logsClear: "लॉग्स साफ़ करें"
  }
};

export const mockActionItems = (lang: 'en' | 'hi'): ActionItem[] => [
  {
    id: "ACT-101",
    title: lang === 'en' ? "High-Value Order #8291 Clearance" : "उच्च-मूल्य ऑर्डर #8291 मंजूरी",
    category: lang === 'en' ? "Compliance" : "अनुपालन",
    context: lang === 'en' 
      ? "Manual approval needed for shipment worth $45k. Valuation exceeds regional risk threshold."
      : "USD 45k मूल्य के शिपमेंट के लिए मैन्युअल मंजूरी आवश्यक। मूल्यांकन क्षेत्रीय जोखिम सीमा से अधिक है।",
    timestamp: "08:45 AM",
    status: "pending",
    urgency: "high"
  },
  {
    id: "ACT-102",
    title: lang === 'en' ? "Route-4 Courier Diversion" : "मार्ग-4 कूरियर डायवर्जन",
    category: lang === 'en' ? "Logistics" : "रसद",
    context: lang === 'en'
      ? "Divert Truck #12 via NH-48 due to sudden road blockage. Adds 12 mins but secures SLA."
      : "अचानक सड़क बंद होने के कारण ट्रक #12 को NH-48 के रास्ते मोड़ें। 12 मिनट अधिक लगेंगे लेकिन SLA सुरक्षित रहेगा।",
    timestamp: "08:50 AM",
    status: "pending",
    urgency: "high"
  },
  {
    id: "ACT-103",
    title: lang === 'en' ? "Merchant #449 Settlement Hold" : "मर्चेंट #449 निपटान रोक",
    category: lang === 'en' ? "Risk Audit" : "जोखिम लेखा परीक्षा",
    context: lang === 'en'
      ? "Multiple refund requests of identical values within 3 mins. Suspend automated withdrawals."
      : "3 मिनट के भीतर समान राशि के कई रिफंड अनुरोध। स्वचालित निकासी तुरंत निलंबित करें।",
    timestamp: "08:52 AM",
    status: "pending",
    urgency: "medium"
  },
  {
    id: "ACT-104",
    title: lang === 'en' ? "Reefer Box 18 Temperature Breach" : "रीफर बॉक्स 18 तापमान उल्लंघन",
    category: lang === 'en' ? "Cold Chain" : "कोल्ड चेन",
    context: lang === 'en'
      ? "Vaccine payload in transit. Relocate to secondary containment box due to sensor alert."
      : "टीका पेलोड पारगमन में है। सेंसर अलर्ट के कारण द्वितीयक रोकथाम बॉक्स में स्थानांतरित करें।",
    timestamp: "08:55 AM",
    status: "pending",
    urgency: "high"
  },
  {
    id: "ACT-105",
    title: lang === 'en' ? "Driver App Offline Bangalore Hub" : "बेंगलुरु हब ड्राइवर ऐप ऑफलाइन",
    category: lang === 'en' ? "Personnel" : "कर्मचारी",
    context: lang === 'en'
      ? "Delivery agent offline for 30m during active route. Hold automated SLA penalty."
      : "सक्रिय मार्ग के दौरान वितरण एजेंट 30 मिनट से ऑफलाइन। स्वचालित SLA दंड रोकें।",
    timestamp: "08:58 AM",
    status: "pending",
    urgency: "low"
  }
];

export const mockAnomalies = (lang: 'en' | 'hi'): Anomaly[] => [
  {
    id: "ANM-201",
    title: lang === 'en' ? "Cold Storage #3 Temp Drift" : "कोल्ड स्टोरेज #3 तापमान बहाव",
    details: lang === 'en'
      ? "Sensor CR-3 registers -2.4°C (Limit: -15°C to -18°C). High risk of inventory degradation."
      : "सेंसर CR-3 -2.4°C दर्ज करता है (सीमा: -15°C से -18°C)। माल खराब होने का उच्च जोखिम।",
    timestamp: "08:42 AM",
    severity: "critical",
    status: "active"
  },
  {
    id: "ANM-202",
    title: lang === 'en' ? "Unscheduled Stop: Truck #78" : "अनिर्धारित ठहराव: ट्रक #78",
    details: lang === 'en'
      ? "Cargo vehicle stationary for 22 mins outside geofenced route near Nellore highway."
      : "नेल्लोर हाईवे के पास भू-बाड़ वाले मार्ग के बाहर मालवाहक वाहन 22 मिनट से स्थिर।",
    timestamp: "08:48 AM",
    severity: "high",
    status: "active"
  },
  {
    id: "ANM-203",
    title: lang === 'en' ? "Mumbai Hub Inbound Congestion" : "मुंबई हब आवक भीड़भाड़",
    details: lang === 'en'
      ? "Sorting belt throughput dropped 40% due to sensor jam. High back-up queue forming."
      : "सेंसर जाम होने के कारण छँटाई बेल्ट थ्रूपुट में 40% की गिरावट। उच्च बैक-अप कतार बन रही है।",
    timestamp: "08:54 AM",
    severity: "medium",
    status: "active"
  }
];
