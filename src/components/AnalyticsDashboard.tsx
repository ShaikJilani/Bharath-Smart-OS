import React, { useEffect, useState, useMemo } from "react";
import { BarChart3, TrendingUp, Users, CheckCircle, Clock, Percent, ShieldCheck, Download, MapPin, Search, Filter, Calendar, Building2, Eye, History, ShieldAlert, BadgeCheck, AlertOctagon, X, FileText, User as UserIcon, Phone, CheckCircle2, Locate, Activity } from "lucide-react";
import { t } from "../data";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { SummaryStats, Complaint } from "../types";

const COLORS = ["#f97316", "#0ea5e9", "#10b981", "#8b5cf6", "#ec4899", "#3b82f6", "#eab308"];
const SEVERITY_COLORS: Record<string, string> = {
  Low: "#10b981",
  Medium: "#eab308",
  High: "#f97316",
  Emergency: "#ef4444",
};

const ANALYTICS_TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    intelNode: "LARR State Node / Central Intelligence",
    intelDesc: "Real-time resolution service-level auditing, hot-zones tracking & department workloads.",
    exportLedger: "Export Audit Ledger (CSV)",
    gpsSync: "Live Citizen GPS Telemetry Sync",
    sensorStream: "ACTIVE SENSOR STREAM",
    gpsDesc: "Continuously reading device coordinates to calculate proximity indexes, emergency response times, and distance thresholds of hotzones relative to your position.",
    nearestIncident: "Nearest Incident",
    radius5km: "Within 5km Radius",
    dispatchHq: "Municipal Dispatch HQ",
    simulateLocation: "Simulate Location Movements",
    totalReports: "Total Reports",
    inResolutionLoop: "In Resolution Loop",
    successfullySolved: "Successfully Solved",
    slaAuditCompliance: "SLA Audit Compliance",
    historicalTrendTitle: "Historical SLA & Resolved Grievance Trends",
    historicalTrendDesc: "Comparing total reported issues against on-time resolution schedules.",
    urbanRuralRatio: "Urban vs. Rural Ratio",
    demographicSplitDesc: "Demographic routing split of submitted problems.",
    incidentsByCategory: "Total Incidents by Category",
    categoryVolumeDesc: "Visual volume of complaints across the various monitored sectors.",
    severityDistribution: "Severity Distribution",
    emergencyThreatDesc: "Emergency and high priority threat index levels.",
    ledgerTitle: "Live Grievance Resolution Ledger & Real-Time Audits",
    ledgerDesc: "Direct telemetry of citizen-lodged complaints, automated AI routing classifications, and physical dispatch registries.",
    allStatuses: "All Statuses",
    allUrgency: "All Urgency Levels",
    allDistances: "All Distances",
    nearMeFirst: "Sort: Near Me First",
    grievanceId: "Grievance ID",
    subjectSector: "Subject & Sector",
    demographics: "Demographics",
    urgency: "Urgency",
    proximity: "Proximity",
    resolutionStatus: "Resolution Status",
    auditActions: "Audit Actions",
    potholesWarning: "Indore Hotspot Warning: Excess rain levels are forecasting potential sewer overflows and pothole expansion in rural sectors over the next 48 hours.",
    noIncidents: "No matching real-time incidents found in the active telemetry feed.",
    activeIssues: "active issues",
    localZone: "Immediate local zone",
    indoreHq: "Indore Center Office",
    vijayNagar: "Vijay Nagar",
    rangwasa: "Rangwasa",
    hardware: "Hardware",
    calculating: "Calculating...",
    fetching: "Fetching...",
    accuracyThreshold: "Accuracy Threshold",
    precise: "± 10.0m (Precise)",
    high: "High",
    latitude: "Latitude",
    longitude: "Longitude"
  },
  Hindi: {
    intelNode: "एलएआरआर राज्य नोड / केंद्रीय खुफिया",
    intelDesc: "वास्तविक समय समाधान सेवा-स्तर लेखापरीक्षा, हॉट-जोन ट्रैकिंग और विभाग कार्यभार।",
    exportLedger: "ऑडिट बही निर्यात करें (CSV)",
    gpsSync: "लाइव नागरिक जीपीएस टेलीमेट्री सिंक",
    sensorStream: "सक्रिय सेंसर स्ट्रीम",
    gpsDesc: "आपकी स्थिति के सापेक्ष हॉटज़ोन की निकटता सूचकांक, आपातकालीन प्रतिक्रिया समय और दूरी सीमा की गणना करने के लिए लगातार डिवाइस निर्देशांक पढ़ना।",
    nearestIncident: "निकटतम घटना",
    radius5km: "5 किमी दायरे के भीतर",
    dispatchHq: "नगर निगम प्रेषण मुख्यालय",
    simulateLocation: "स्थान संचलन का अनुकरण करें",
    totalReports: "कुल रिपोर्ट",
    inResolutionLoop: "समाधान लूप में",
    successfullySolved: "सफलतापूर्वक हल किया गया",
    slaAuditCompliance: "एसएलए ऑडिट अनुपालन",
    historicalTrendTitle: "ऐतिहासिक एसएलए और हल की गई शिकायतें",
    historicalTrendDesc: "समय पर समाधान शेड्यूल के विरुद्ध रिपोर्ट की गई कुल समस्याओं की तुलना करना।",
    urbanRuralRatio: "शहरी बनाम ग्रामीण अनुपात",
    demographicSplitDesc: "प्रस्तुत समस्याओं का जनसांख्यिकीय रूटिंग विभाजन।",
    incidentsByCategory: "श्रेणी के अनुसार कुल घटनाएं",
    categoryVolumeDesc: "विभिन्न निगरानी क्षेत्रों में शिकायतों की मात्रा का दृश्य रूप।",
    severityDistribution: "गंभीरता वितरण",
    emergencyThreatDesc: "आपातकालीन और उच्च प्राथमिकता वाले खतरे के सूचकांक स्तर।",
    ledgerTitle: "लाइव शिकायत समाधान बही और वास्तविक समय ऑडिट",
    ledgerDesc: "नागरिकों द्वारा दर्ज की गई शिकायतों, स्वचालित एआई रूटिंग वर्गीकरण और भौतिक प्रेषण रजिस्ट्रियों की सीधी टेलीमेट्री।",
    allStatuses: "सभी स्थितियाँ",
    allUrgency: "सभी तत्परता स्तर",
    allDistances: "सभी दूरियाँ",
    nearMeFirst: "क्रमबद्ध करें: मेरे पास पहले",
    grievanceId: "शिकायत आईडी",
    subjectSector: "विषय और क्षेत्र",
    demographics: "जनसांख्यिकी",
    urgency: "तत्परता",
    proximity: "निकटता",
    resolutionStatus: "समाधान की स्थिति",
    auditActions: "ऑडिट कार्रवाई",
    potholesWarning: "इंदौर हॉटस्पॉट चेतावनी: अत्यधिक बारिश के कारण अगले 48 घंटों में ग्रामीण क्षेत्रों में सीवर ओवरफ्लो और गड्ढों के बढ़ने का अनुमान है।",
    noIncidents: "सक्रिय टेलीमेट्री फीड में कोई मिलान वाली वास्तविक समय की घटनाएं नहीं मिलीं।",
    activeIssues: "सक्रिय मुद्दे",
    localZone: "तत्काल स्थानीय क्षेत्र",
    indoreHq: "इंदौर केंद्र कार्यालय",
    vijayNagar: "विजय नगर",
    rangwasa: "रंगवासा",
    hardware: "हार्डवेयर",
    calculating: "गणना की जा रही है...",
    fetching: "प्राप्त किया जा रहा है...",
    accuracyThreshold: "सटीकता सीमा",
    precise: "± 10.0मी (सटीक)",
    high: "उच्च",
    latitude: "अक्षांश",
    longitude: "देशांतर"
  },
  Telugu: {
    intelNode: "LARR స్టేట్ నోడ్ / సెంట్రల్ ఇంటెలిజెన్స్",
    intelDesc: "నిజ సమయ పరిష్కార సేవా-స్థాయి ఆడిటింగ్, హాట్-జోన్స్ ట్రాకింగ్ & డిపార్ట్‌మెంట్ పనిభారం.",
    exportLedger: "ఆడిట్ లెడ్జర్‌ను ఎగుమతి చేయండి (CSV)",
    gpsSync: "లైవ్ సిటిజన్ జీపీఎస్ టెలిమెట్రీ సింక్",
    sensorStream: "యాక్టివ్ సెన్సార్ స్ట్రీమ్",
    gpsDesc: "మీ స్థానానికి సంబంధించి హాట్‌జోన్‌ల సామీప్య సూచికలు, అత్యవసర ప్రతిస్పందన సమయాలు మరియు దూర పరిమితులను లెక్కించడానికి నిరంతరం పరికర కోఆర్డినేట్‌లను చదవడం.",
    nearestIncident: "సమీప సంఘటన",
    radius5km: "5 కిమీ వ్యాసార్థంలో",
    dispatchHq: "మునిసిపల్ డిస్పాచ్ ప్రధాన కార్యాలయం",
    simulateLocation: "స్థాన కదలికలను అనుకరించండి",
    totalReports: "మొత్తం నివేదికలు",
    inResolutionLoop: "పరిష్కార లూప్‌లో",
    successfullySolved: "విజయవంతంగా పరిష్కరించబడింది",
    slaAuditCompliance: "SLA ఆడిట్ వర్తింపు",
    historicalTrendTitle: "చారిత్రక SLA & పరిష్కరించబడిన ఫిర్యాదుల ట్రెండ్‌లు",
    historicalTrendDesc: "ఆన్-టైమ్ రిజల్యూషన్ షెడ్యూల్‌లతో మొత్తం నివేదించబడిన సమస్యలను పోల్చడం.",
    urbanRuralRatio: "పట్టణ వర్సెస్ గ్రామీణ నిష్పత్తి",
    demographicSplitDesc: "సమర్పించిన సమస్యల డెమోగ్రాఫిక్ రూటింగ్ విభజన.",
    incidentsByCategory: "వర్గం వారీగా మొత్తం సంఘటనలు",
    categoryVolumeDesc: "పర్యవేక్షించబడే వివిధ రంగాలలో ఫిర్యాదుల పరిమాణం.",
    severityDistribution: "తీవ్రత పంపిణీ",
    emergencyThreatDesc: "అత్యవసర మరియు అధిక ప్రాధాన్యత ముప్పు సూచిక స్థాయిలు.",
    ledgerTitle: "లైవ్ ఫిర్యాదు పరిష్కార లెడ్జర్ & రియల్ టైమ్ ఆడిట్",
    ledgerDesc: "పౌరులు నమోదు చేసిన ఫిర్యాదులు, స్వయంచాలక AI రూటింగ్ వర్గీకరణలు మరియు డిస్పాచ్ రిజిస్ట్రీల ప్రత్యక్ష టెలిమెట్రీ.",
    allStatuses: "అన్ని స్థితులు",
    allUrgency: "అన్ని అత్యవసర స్థాయిలు",
    allDistances: "అన్ని దూరాలు",
    nearMeFirst: "నాకు దగ్గరగా ఉన్నవి ముందు",
    grievanceId: "ఫిర్యాదు ఐడీ",
    subjectSector: "విషయం & రంగం",
    demographics: "జనాభా వివరాలు",
    urgency: "అత్యవసరం",
    proximity: "సామీప్యం",
    resolutionStatus: "పరిష్కార స్థితి",
    auditActions: "ఆడిట్ చర్యలు",
    potholesWarning: "ఇండోర్ హాట్‌స్పాట్ హెచ్చరిక: రాబోయే 48 గంటల్లో గ్రామీణ ప్రాంతాల్లో మురుగునీరు పొంగిపొర్లడం మరియు గుంతలు పెరిగే అవకాశం ఉంది.",
    noIncidents: "యాక్టివ్ టెలిమెట్రీ ఫీడ్‌లో సరిపోలే నిజ-సమయ సంఘటనలు ఏవీ కనుగొనబడలేదు.",
    activeIssues: "యాక్టివ్ సమస్యలు",
    localZone: "తక్షణ స్థానిక ప్రాంతం",
    indoreHq: "ఇండోర్ సెంటర్ ఆఫీస్",
    vijayNagar: "విజయ్ నగర్",
    rangwasa: "రంగవాస",
    hardware: "హార్డ్‌వేర్",
    calculating: "లెక్కిస్తోంది...",
    fetching: "పొందుతోంది...",
    accuracyThreshold: "ఖచ్చితత్వ పరిమితి",
    precise: "± 10.0మీ (ఖచ్చితమైన)",
    high: "అధిక",
    latitude: "అక్షాంశం",
    longitude: "రేఖాంశం"
  },
  Tamil: {
    intelNode: "LARR மாநில முனையம் / மத்திய உளவுத்துறை",
    intelDesc: "நிகழ்நேர தீர்வு சேவை-நிலை தணிக்கை, ஹாட்-ஜோன் கண்காணிப்பு மற்றும் துறை பணிச்சுமை.",
    exportLedger: "தணிக்கை பேரேட்டை ஏற்றுமதி செய் (CSV)",
    gpsSync: "நேரடி குடிமகன் ஜிபிஎஸ் டெலிமெட்ரி ஒத்திசைவு",
    sensorStream: "செயலில் உள்ள சென்சார் ஸ்ட்ரீம்",
    gpsDesc: "உங்கள் நிலைக்கு ஏற்ப ஹாட்ஜோன்களின் அருகாமை குறியீடுகள், அவசரகால மறுமொழி நேரம் மற்றும் தூர வரம்புகளைக் கணக்கிட சாதன ஒருங்கிணைப்புகளைத் தொடர்ந்து படித்தல்.",
    nearestIncident: "அருகிலுள்ள சம்பவம்",
    radius5km: "5 கிமீ சுற்றளவுக்குள்",
    dispatchHq: "நகராட்சி அனுப்பும் தலைமையகம்",
    simulateLocation: "இருப்பிட இயக்கங்களை உருவகப்படுத்து",
    totalReports: "மொத்த புகார்கள்",
    inResolutionLoop: "தீர்வுச் சுழற்சியில்",
    successfullySolved: "வெற்றிகரமாக தீர்க்கப்பட்டது",
    slaAuditCompliance: "SLA தணிக்கை இணக்கம்",
    historicalTrendTitle: "வரலாற்று SLA மற்றும் தீர்க்கப்பட்ட புகார்களின் போக்குகள்",
    historicalTrendDesc: "நேரடி தீர்வு அட்டவணைகளுடன் மொத்த புகார்களை ஒப்பிடுதல்.",
    urbanRuralRatio: "நகர்ப்புறம் மற்றும் கிராமப்புற விகிதம்",
    demographicSplitDesc: "சமர்ப்பிக்கப்பட்ட புகார்களின் புவியியல் ரூட்டிங் பிரிவு.",
    incidentsByCategory: "துறை வாரியாக மொத்த சம்பவங்கள்",
    categoryVolumeDesc: "கண்காணிக்கப்படும் பல்வேறு துறைகளில் புகார்களின் அளவு.",
    severityDistribution: "தீவிரத்தன்மை விநியோகம்",
    emergencyThreatDesc: "அவசரநிலை மற்றும் உயர் முன்னுரிமை அச்சுறுத்தல் குறியீட்டு நிலைகள்.",
    ledgerTitle: "நேரடி புகார் தீர்வு பேரேடு & நிகழ்நேர தணிக்கை",
    ledgerDesc: "குடிமக்களால் பதிவு செய்யப்பட்ட புகார்கள், தானியங்கி AI ரூட்டிங் வகைப்பாடுகள் மற்றும் நேரடி அனுப்பும் பதிவேடுகள்.",
    allStatuses: "அனைத்து நிலைகளும்",
    allUrgency: "அனைத்து அவசர நிலைகள்",
    allDistances: "அனைத்து தூரங்களும்",
    nearMeFirst: "எனக்கு அருகில் உள்ளவை முதலில்",
    grievanceId: "புகார் ஐடி",
    subjectSector: "பொருள் & துறை",
    demographics: "மக்கள்தொகை",
    urgency: "அவசரம்",
    proximity: "அருகாமை",
    resolutionStatus: "தீர்வு நிலை",
    auditActions: "தணிக்கை நடவடிக்கைகள்",
    potholesWarning: "இந்தூர் ஹாட்ஸ்பாட் எச்சரிக்கை: அடுத்த 48 மணி நேரத்தில் கிராமப்புறங்களில் கழிவுநீர் பெருக்கெடுத்து ஓடவும், குழிகள் விரிவடையவும் வாய்ப்புள்ளது.",
    noIncidents: "செயலில் உள்ள டெலிமெட்ரி ஊட்டங்களில் பொருந்தும் நிகழ்நேர சம்பவங்கள் எதுவும் இல்லை.",
    activeIssues: "செயலில் உள்ள சிக்கல்கள்",
    localZone: "உடனடி உள்ளூர் பகுதி",
    indoreHq: "இந்தூர் மத்திய அலுவலகம்",
    vijayNagar: "விஜய் नगर",
    rangwasa: "ரங்வாசா",
    hardware: "வன்பொருள்",
    calculating: "கணக்கிடுகிறது...",
    fetching: "பெறுகிறது...",
    accuracyThreshold: "துல்லிய வரம்பு",
    precise: "± 10.0மீ (துல்லியமான)",
    high: "உயர்",
    latitude: "அட்சரேகை",
    longitude: "தீர்க்கரேகை"
  },
  Bengali: {
    intelNode: "LARR স্টেট নোড / কেন্দ্রীয় গোয়েন্দা সংস্থা",
    intelDesc: "রিয়েল-টাইম সমাধান পরিষেবা-স্তরের অডিটিং, হট-জোন ট্র্যাকিং এবং বিভাগের কাজের চাপ।",
    exportLedger: "অডিট লেজার রপ্তানি করুন (CSV)",
    gpsSync: "লাইভ নাগরিক জিপিএস টেলিমেট্রি সিঙ্ক",
    sensorStream: "সক্রিয় সেন্সর স্ট্রিম",
    gpsDesc: "আপনার অবস্থানের সাপেক্ষে হটজোনগুলির সান্নিধ্য সূচক, জরুরি প্রতিক্রিয়া সময় এবং দূরত্বের থ্রেশহোল্ড গণনা করতে অবিরাম ডিভাইস স্থানাঙ্ক রিডিং নেওয়া।",
    nearestIncident: "নিকটতম ঘটনা",
    radius5km: "৫ কিমি ব্যাসার্ধের মধ্যে",
    dispatchHq: "পৌরসভা প্রেরণ সদর দফতর",
    simulateLocation: "অবস্থান চলাচল অনুকরণ করুন",
    totalReports: "মোট রিপোর্ট",
    inResolutionLoop: "সমাধান লুপে",
    successfullySolved: "সফলভাবে সমাধান করা হয়েছে",
    slaAuditCompliance: "SLA অডিট সম্মতি",
    historicalTrendTitle: "ঐতিহাসিক SLA এবং সমাধান করা অভিযোগের প্রবণতা",
    historicalTrendDesc: "অন-টাইম সমাধান সময়সূচীর বিরুদ্ধে রিপোর্ট করা মোট সমস্যার তুলনা করা।",
    urbanRuralRatio: "শহুরে বনাম গ্রামীণ অনুপাত",
    demographicSplitDesc: "জমা দেওয়া সমস্যাগুলির ডেমোগ্রাফিক রাউটিং বিভাজন।",
    incidentsByCategory: "বিভাগ অনুযায়ী মোট ঘটনা",
    categoryVolumeDesc: "বিভিন্ন পর্যবেক্ষণকৃত সেক্টর জুড়ে অভিযোগের দৃশ্যমান পরিমাণ।",
    severityDistribution: "গুরুত্ব বন্টন",
    emergencyThreatDesc: "জরুরি এবং উচ্চ অগ্রাধিকারের হুমকি সূচক স্তর।",
    ledgerTitle: "লাইভ অভিযোগ সমাধান খতিয়ান এবং রিয়েল-টাইম অডিট",
    ledgerDesc: "নাগরিক-দায়ের করা অভিযোগের সরাসরি টেলিমেট্রি, স্বয়ংক্রিয় এআই রাউটিং শ্রেণীবিভাগ এবং শারীরিক প্রেরণ রেজিস্ট্রি।",
    allStatuses: "সমস্ত স্ট্যাটাস",
    allUrgency: "সমস্ত জরুরিতা স্তর",
    allDistances: "সমস্ত দূরত্ব",
    nearMeFirst: "বাছাই: আমার কাছাকাছি প্রথম",
    grievanceId: "অভিযোগ আইডি",
    subjectSector: "বিষয় ও সেক্টর",
    demographics: "জনসংখ্যা",
    urgency: "জরুরিতা",
    proximity: "সান্নিধ্য",
    resolutionStatus: "সমাধান স্ট্যাটাস",
    auditActions: "অডিট পদক্ষেপ",
    potholesWarning: "ইন্দোর হটস্পট সতর্কীকরণ: অতিরিক্ত বৃষ্টির কারণে আগামী ৪৮ ঘণ্টার মধ্যে গ্রামীণ সেক্টরে সম্ভাব্য নর্দমা উপচে পড়া এবং গর্ত বৃদ্ধির পূর্বাভাস দেওয়া হচ্ছে।",
    noIncidents: "সক্রিয় টেলিমেট্রি ফিডে কোনো ম্যাচিং রিয়েল-টাইম ঘটনা পাওয়া যায়নি।",
    activeIssues: "সক্রিয় সমস্যা",
    localZone: "অবিলম্বে স্থানীয় এলাকা",
    indoreHq: "ইন্দোর কেন্দ্রীয় অফিস",
    vijayNagar: "বিজয় নগর",
    rangwasa: "রংওয়াসা",
    hardware: "হার্ডওয়্যার",
    calculating: "গণনা করা হচ্ছে...",
    fetching: "আনা হচ্ছে...",
    accuracyThreshold: "নির্ভুলতা থ্রেশহোল্ড",
    precise: "± ১০.০মি (নির্ভুল)",
    high: "উচ্চ",
    latitude: "অক্ষাংশ",
    longitude: "দ্রাঘিমাংশ"
  },
  Marathi: {
    intelNode: "LARR राज्य नोड / केंद्रीय गुप्तचर",
    intelDesc: "रिअल-टाइम रिझोल्यूशन सेवा-स्तर ऑडिटिंग, हॉट-झोन ट्रॅकिंग आणि विभाग वर्कलोड.",
    exportLedger: "ऑडिट लेजर निर्यात करा (CSV)",
    gpsSync: "थेट नागरिक GPS टेलिमेट्री सिंक",
    sensorStream: "सक्रिय सेन्सर प्रवाह",
    gpsDesc: "तुमच्या स्थानाच्या सापेक्ष हॉटझोनचे प्रॉक्सिमिटी इंडेक्स, आपत्कालीन प्रतिसाद वेळ आणि अंतर मर्यादा मोजण्यासाठी सतत डिव्हाइसचे अक्षांश-रेखांश वाचणे.",
    nearestIncident: "जवळची घटना",
    radius5km: "५ किमी त्रिज्येत",
    dispatchHq: "महानगरपालिका डिस्पॅच मुख्यालय",
    simulateLocation: "स्थान हालचालींचे अनुकरण करा",
    totalReports: "एकूण अहवाल",
    inResolutionLoop: "रिझोल्यूशन लूपमध्ये",
    successfullySolved: "यशस्वीरित्या सोडवले",
    slaAuditCompliance: "SLA ऑडिट अनुपालन",
    historicalTrendTitle: "ऐतिहासिक SLA आणि सोडवलेल्या तक्रारींचा ट्रेंड",
    historicalTrendDesc: "वेळेवर निराकरण वेळापत्रकाविरुद्ध एकूण नोंदवलेल्या समस्यांची तुलना करणे.",
    urbanRuralRatio: "शहरी विरुद्ध ग्रामीण प्रमाण",
    demographicSplitDesc: "सबमिट केलेल्या समस्यांचे लोकसंख्याशास्त्रीय राउटिंग विभाजन.",
    incidentsByCategory: "वर्गवारीनुसार एकूण घटना",
    categoryVolumeDesc: "विविध निरीक्षण केलेल्या क्षेत्रांमधील तक्रारींचे दृश्य प्रमाण.",
    severityDistribution: "तीव्रतेचे वितरण",
    emergencyThreatDesc: "आपत्कालीन आणि उच्च प्राधान्य धोक्याचे निर्देशांक स्तर.",
    ledgerTitle: "थेट तक्रार निवारण खातेवही आणि रिअल-टाइम ऑडिट",
    ledgerDesc: "नागरिकांनी दाखल केलेल्या तक्रारींची थेट टेलिमेट्री, स्वयंचलित AI राउटिंग वर्गीकरण आणि प्रत्यक्ष डिस्पॅच नोंदी.",
    allStatuses: "सर्व स्थिती",
    allUrgency: "सर्व तीव्रतेचे स्तर",
    allDistances: "सर्व अंतरे",
    nearMeFirst: "क्रमवारी लावा: माझ्या जवळचे पहिले",
    grievanceId: "तक्रार आयडी",
    subjectSector: "विषय आणि क्षेत्र",
    demographics: "लोकसंख्याशास्त्र",
    urgency: "तीव्रता/तात्काळता",
    proximity: "जवळीक",
    resolutionStatus: "निवारण स्थिती",
    auditActions: "ऑडिट क्रिया",
    potholesWarning: "इंदूर हॉटस्पॉट चेतावणी: अतिवृष्टीमुळे पुढील ४८ तासांत ग्रामीण भागात सांडपाणी वाहून जाण्याची आणि खड्डे वाढण्याची शक्यता वर्तवली जात आहे.",
    noIncidents: "सक्रिय टेलिमेट्री फीडमध्ये जुळणारी रिअल-टाइम घटना आढळली नाही.",
    activeIssues: "सक्रिय समस्या",
    localZone: "तात्काळ स्थानिक क्षेत्र",
    indoreHq: "इंदूर मध्यवर्ती कार्यालय",
    vijayNagar: "विजय नगर",
    rangwasa: "रंगवासा",
    hardware: "हार्डवेअर",
    calculating: "गणना करत आहे...",
    fetching: "माहिती मिळवत आहे...",
    accuracyThreshold: "अचूकता मर्यादा",
    precise: "± १०.०मी (अचूक)",
    high: "उच्च",
    latitude: "अक्षांश",
    longitude: "रेखांश"
  },
  Urdu: {
    intelNode: "LARR اسٹیٹ نوڈ / مرکزی انٹیلی جنس",
    intelDesc: "ریئل ٹائم حل سروس لیول آڈٹنگ، ہاٹ زون ٹریکنگ اور محکمہ کے کام کا بوجھ۔",
    exportLedger: "آڈٹ لیجر برآمد کریں (CSV)",
    gpsSync: "لائیو شہری GPS ٹیلی میٹری سنک",
    sensorStream: "ایکٹو سینسر اسٹریم",
    gpsDesc: "آپ کی پوزیشن کے مقابلے میں ہاٹ زونز کی قربت کے اشاریہ جات، ہنگامی ردعمل کے اوقات اور فاصلے کی حدوں کا حساب لگانے کے لیے آلے کے نقاط کو مسلسل پڑھنا۔",
    nearestIncident: "قریب ترین واقعہ",
    radius5km: "5 کلومیٹر کے دائرے میں",
    dispatchHq: "میونسپل ڈسپیچ ہیڈ کوارٹر",
    simulateLocation: "مقام کی نقل و حرکت کی نقالی کریں",
    totalReports: "کل رپورٹس",
    inResolutionLoop: "حل کے لوپ میں",
    successfullySolved: "کامیابی سے حل ہو گیا",
    slaAuditCompliance: "SLA آڈٹ تعمیل",
    historicalTrendTitle: "تاریخی SLA اور حل شدہ شکایات کے رجحانات",
    historicalTrendDesc: "وقت پر حل کے نظام الاوقات کے خلاف رپورٹ کردہ کل مسائل کا موازنہ کرنا۔",
    urbanRuralRatio: "شہری بمقابلہ دیہی تناسب",
    demographicSplitDesc: "جمع کردہ مسائل کی آبادیاتی روٹنگ تقسیم۔",
    incidentsByCategory: "زمرہ کے لحاظ سے کل واقعات",
    categoryVolumeDesc: "مختلف مانیٹر کردہ شعبوں میں شکایات کا بصری حجم۔",
    severityDistribution: "شدت کی تقسیم",
    emergencyThreatDesc: "ہنگامی اور اعلیٰ ترجیحی خطرے کے اشاریہ کے درجات۔",
    ledgerTitle: "لائیو شکایت کے حل کا لیجر اور ریئل ٹائم آڈٹ",
    ledgerDesc: "شہریوں کی درج کردہ شکایات کی براہ راست ٹیلی میٹری، خودکار AI روٹنگ کی درجہ بندی، اور جسمانی ڈسپیچ رجسٹر۔",
    allStatuses: "تمام حالات",
    allUrgency: "شدت کے تمام درجات",
    allDistances: "تمام فاصلے",
    nearMeFirst: "ترتیب دیں: پہلے میرے قریب",
    grievanceId: "شکایت کی آئی ڈی",
    subjectSector: "موضوع اور شعبہ",
    demographics: "آبادیاتی معلومات",
    urgency: "شدت/فوری ضرورت",
    proximity: "قربت",
    resolutionStatus: "حل کی صورتحال",
    auditActions: "آڈٹ اقدامات",
    potholesWarning: "اندور ہاٹ اسپاٹ وارننگ: اگلے 48 گھنٹوں میں دیہی علاقوں میں گندے پانی کے بہاؤ اور گڑھوں کے پھیلنے کی پیش گوئی کی گئی ہے۔",
    noIncidents: "فعال ٹیلی میٹری فیڈ میں کوئی مماثل حقیقی وقت کا واقعہ نہیں ملا۔",
    activeIssues: "فعال مسائل",
    localZone: "فوری مقامی علاقہ",
    indoreHq: "اندور مرکز کا دفتر",
    vijayNagar: "وجے نگر",
    rangwasa: "رنگواسا",
    hardware: "ہارڈ ویئر",
    calculating: "حساب کتاب ہو رہا ہے...",
    fetching: "حاصل کیا جا رہا ہے...",
    accuracyThreshold: "درستگی کی حد",
    precise: "± 10.0 میٹر (درست)",
    high: "اعلیٰ",
    latitude: "عرض بلد",
    longitude: "طول بلد"
  },
  Gujarati: {
    intelNode: "LARR સ્ટેટ નોડ / સેન્ટ્રલ ઇન્ટેલિજન્સ",
    intelDesc: "રીઅલ-ટાઇમ રિઝોલ્યુશન સેવા-સ્તર ઓડિટિંગ, હોટ-ઝોન ટ્રેકિંગ અને વિભાગના કામનું ભારણ.",
    exportLedger: "ઓડિટ ખાતાવહી નિકાસ કરો (CSV)",
    gpsSync: "લાઇવ નાગરિક જીપીએસ ટેલિમેટ્રી સિંક",
    sensorStream: "સક્રિય સેન્સર સ્ટ્રીમ",
    gpsDesc: "તમારી સ્થિતિની સાપેક્ષે હોટઝોનની નિકટતા સૂચકાંકો, કટોકટી પ્રતિભાવ સમય અને અંતર મર્યાદાઓની ગણતરી કરવા માટે ઉપકરણના કોઓર્ડિનેટ્સ સતત વાંચવા.",
    nearestIncident: "સૌથી નજીકની ઘટના",
    radius5km: "૫ કિમીની ત્રિજ્યામાં",
    dispatchHq: "મ્યુનિસિપલ ડિસ્પેચ હેડક્વાર્ટર",
    simulateLocation: "સ્થાન હિલચાલનું અનુકરણ કરો",
    totalReports: "કુલ અહેવાલો",
    inResolutionLoop: "રિઝોલ્યુશન લૂપમાં",
    successfullySolved: "સફળતાપૂર્વક ઉકેલાયું",
    slaAuditCompliance: "SLA ઓડિટ પાલન",
    historicalTrendTitle: "ઐતિહાસિક SLA અને ઉકેલાયેલી ફરિયાદોના પ્રવાહો",
    historicalTrendDesc: "સમયસર ઉકેલના સમયપત્રક સામે નોંધાયેલી કુલ સમસ્યાઓની સરખામણી.",
    urbanRuralRatio: "શહેરી વિરુદ્ધ ગ્રામીણ ગુણોત્તર",
    demographicSplitDesc: "સબમિટ કરેલી સમસ્યાઓનું વસ્તી વિષયક રૂટીંગ વિભાજન.",
    incidentsByCategory: "કેટેગરી પ્રમાણે કુલ ઘટનાઓ",
    categoryVolumeDesc: "વિવિધ મોનિટર કરાયેલા ક્ષેત્રોમાં ફરિયાદોનું દ્રશ્ય પ્રમાણ.",
    severityDistribution: "ગંભીરતા વિતરણ",
    emergencyThreatDesc: "કટોકટી અને ઉચ્ચ અગ્રતાના જોખમ સૂચકાંક સ્તરો.",
    ledgerTitle: "லைவ் ફરિયાદ નિવારણ ખાતાવહી અને રીઅલ-ટાઇમ ઓડિટ",
    ledgerDesc: "નાગરિક દ્વારા નોંધાયેલી ફરિયાદોની સીધી ટેલિમેટ્રી, સ્વચાલિત એઆઇ રૂટીંગ વર્ગીકરણ અને ભૌતિક ડિસ્પેચ રજિસ્ટ્રી.",
    allStatuses: "તમામ સ્થિતિ",
    allUrgency: "તમામ તાકીદના સ્તરો",
    allDistances: "તમામ અંતરો",
    nearMeFirst: "સૉર્ટ કરો: મારી નજીકના પ્રથમ",
    grievanceId: "ફરિયાદ આઈડી",
    subjectSector: "વિષય અને ક્ષેત્ર",
    demographics: "વસ્તી વિષયક",
    urgency: "તાકીદ",
    proximity: "નિકટતા",
    resolutionStatus: "ઉકેલની સ્થિતિ",
    auditActions: "ઓડિટ પગલાં",
    potholesWarning: "ઇન્દોર હોટસ્પોટ ચેતવણી: આગામી ૪૮ કલાકમાં ગ્રામીણ વિસ્તારોમાં ગટરના પાણી ભરાઈ જવા અને ખાડાઓ વધવાની સંભાવના છે.",
    noIncidents: "સક્રિય ટેલિમેટ્રી ફીડમાં કોઈ મેળ ખાતી રીઅલ-ટાઇમ ઘટનાઓ મળી નથી.",
    activeIssues: "સક્રિય સમસ્યાઓ",
    localZone: "તાત્કાલિક સ્થાનિક વિસ્તાર",
    indoreHq: "ઇન્દોર સેન્ટર ઓફિસ",
    vijayNagar: "વિજય નગર",
    rangwasa: "રંગવાસા",
    hardware: "હાર્ડવેર",
    calculating: "ગણતરી કરી રહ્યું છે...",
    fetching: "મેળવી રહ્યું છે...",
    accuracyThreshold: "ચોકસાઈ થ્રેશોલ્ડ",
    precise: "± ૧૦.૦મી (ચોક્કસ)",
    high: "ઉચ્ચ",
    latitude: "અક્ષાંશ",
    longitude: "રેખાંશ"
  },
  Kannada: {
    intelNode: "LARR ಸ್ಟೇಟ್ ನೋಡ್ / ಸೆಂಟ್ರಲ್ ಇಂಟೆಲಿಜೆನ್ಸ್",
    intelDesc: "ನೈಜ-ಸಮಯದ ಪರಿಹಾರ ಸೇವಾ-ಮಟ್ಟದ ಆಡಿಟಿಂಗ್, ಹಾಟ್-ಜೋನ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಇಲಾಖೆಯ ಕೆಲಸದ ಹೊರೆ.",
    exportLedger: "ಆಡಿಟ್ ಲೆಡ್ಜರ್ ರಫ್ತು ಮಾಡಿ (CSV)",
    gpsSync: "ಲೈವ್ ನಾಗರಿಕ ಜಿಪಿಎಸ್ ಟೆಲಿಮೆಟ್ರಿ ಸಿಂಕ್",
    sensorStream: "ಸಕ್ರಿಯ ಸಂವೇದಕ ಸ್ಟ್ರೀಮ್",
    gpsDesc: "ನಿಮ್ಮ ಸ್ಥಾನಕ್ಕೆ ಸಂಬಂಧಿಸಿದಂತೆ ಹಾಟ್‌ಜೋನ್‌ಗಳ ಸಾಮೀಪ್ಯ ಸೂಚಕಗಳು, ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯಗಳು ಮತ್ತು ದೂರದ ಮಿತಿಗಳನ್ನು ಲೆಕ್ಕಹಾಕಲು ನಿರಂತರವಾಗಿ ಸಾಧನದ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಓದುವುದು.",
    nearestIncident: "ಹತ್ತಿರದ ಘಟನೆ",
    radius5km: "೫ ಕಿಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ",
    dispatchHq: "ಮುನ್ಸಿಪಲ್ ಡಿಸ್ಪ್ಯಾಚ್ ಪ್ರಧಾನ ಕಚೇರಿ",
    simulateLocation: "ಸ್ಥಳದ ಚಲನವಲನಗಳನ್ನು ಅನುಕರಿಸಿ",
    totalReports: "ಒಟ್ಟು ವರದಿಗಳು",
    inResolutionLoop: "ಪರಿಹಾರ ಲೂಪ್‌ನಲ್ಲಿ",
    successfullySolved: "ಯಶಸ್ವಿಯಾಗಿ ಪರಿಹರಿಸಲಾಗಿದೆ",
    slaAuditCompliance: "SLA ಆಡಿಟ್ ಅನುಸರಣೆ",
    historicalTrendTitle: "ಐತಿಹಾಸಿಕ SLA ಮತ್ತು ಪರಿಹರಿಸಲಾದ ದೂರುಗಳ ಟ್ರೆಂಡ್‌ಗಳು",
    historicalTrendDesc: "ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಪರಿಹರಿಸುವ ವೇಳಾಪಟ್ಟಿಗಳ ವಿರುದ್ಧ ಒಟ್ಟು ವರದಿಯಾದ ಸಮಸ್ಯೆಗಳನ್ನು ಹೋಲಿಸುವುದು.",
    urbanRuralRatio: "ನಗರ ಮತ್ತು ಗ್ರಾಮೀಣ ಅನುಪಾತ",
    demographicSplitDesc: "ಸಲ್ಲಿಸಿದ ಸಮಸ್ಯೆಗಳ ಜನಸಂಖ್ಯಾ ರೂಟಿಂಗ್ ವಿಭಜನೆ.",
    incidentsByCategory: "ವರ್ಗವಾರು ಒಟ್ಟು ಘಟನೆಗಳು",
    categoryVolumeDesc: "ವಿವಿಧ ಮೇಲ್ವಿಚಾರಣಾ ವಲಯಗಳಲ್ಲಿನ ದೂರುಗಳ ದೃಶ್ಯ ಪ್ರಮಾಣ.",
    severityDistribution: "ತೀವ್ರತೆಯ ವಿತರಣೆ",
    emergencyThreatDesc: "ತುರ್ತು ಮತ್ತು ಹೆಚ್ಚಿನ ಆದ್ಯತೆಯ ಬೆದರಿಕೆ ಸೂಚ್ಯಂಕ ಮಟ್ಟಗಳು.",
    ledgerTitle: "ಲೈವ್ ದೂರು ಪರಿಹಾರ ಲೆಡ್ಜರ್ ಮತ್ತು ನೈಜ-ಸಮಯದ ಆಡಿಟ್",
    ledgerDesc: "ನಾಗರಿಕರು ದಾಖಲಿಸಿದ ದೂರುಗಳ ನೇರ ಟೆಲಿಮೆಟ್ರಿ, ಸ್ವಯಂಚಾಲಿತ AI ರೂಟಿಂಗ್ ವರ್ಗೀಕರಣಗಳು ಮತ್ತು ಭೌತಿಕ ರವಾನೆ ದಾಖಲೆಗಳು.",
    allStatuses: "ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು",
    allUrgency: "ಎಲ್ಲಾ ತುರ್ತು ಮಟ್ಟಗಳು",
    allDistances: "ಎಲ್ಲಾ ದೂರಗಳು",
    nearMeFirst: "ವಿಂಗಡಿಸು: ನನಗೆ ಹತ್ತಿರವಿರುವ ಮೊದಲನೆಯದು",
    grievanceId: "ದೂರು ಐಡಿ",
    subjectSector: "ವಿಷಯ ಮತ್ತು ವಲಯ",
    demographics: "ಜನಸಂಖ್ಯಾಶಾಸ್ತ್ರ",
    urgency: "ತುರ್ತು",
    proximity: "ಸಾಮೀಪ್ಯ",
    resolutionStatus: "ಪರಿಹಾರ ಸ್ಥಿತಿ",
    auditActions: "ಆಡಿಟ್ ಕ್ರಮಗಳು",
    potholesWarning: "ಇಂದೋರ್ ಹಾಟ್‌ಸ್ಪಾಟ್ ಎಚ್ಚರಿಕೆ: ಮುಂಬರುವ ೪೮ ಗಂಟೆಗಳಲ್ಲಿ ಗ್ರಾಮೀಣ ವಲಯಗಳಲ್ಲಿ ಒಳಚರಂಡಿ ಉಕ್ಕಿ ಹರಿಯುವುದು ಮತ್ತು ಗುಂಡಿಗಳು ಹೆಚ್ಚಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ.",
    noIncidents: "ಸಕ್ರಿಯ ಟೆಲಿಮೆಟ್ರಿ ಫೀಡ್‌ನಲ್ಲಿ ಯಾವುದೇ ನೈಜ-ಸಮಯದ ಘಟನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    activeIssues: "ಸಕ್ರಿಯ ಸಮಸ್ಯೆಗಳು",
    localZone: "ತಕ್ಷಣದ ಸ್ಥಳೀಯ ವಲಯ",
    indoreHq: "ಇಂದೋರ್ ಕೇಂದ್ರ ಕಚೇರಿ",
    vijayNagar: "ವಿಜಯ್ ನಗರ",
    rangwasa: "ರಂಗವಾಸ",
    hardware: "ಯಂತ್ರಾಂಶ",
    calculating: "ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ...",
    fetching: "ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
    accuracyThreshold: "ನಿಖರತೆಯ ಮಿತಿ",
    precise: "± ೧೦.೦ಮೀ (ನಿಖರ)",
    high: "ಹೆಚ್ಚು",
    latitude: "ಅಕ್ಷಾಂಶ",
    longitude: "ರೇಖಾಂಶ"
  },
  Odia: {
    intelNode: "LARR ରାଜ୍ୟ ନୋଡ୍ / କେନ୍ଦ୍ରୀୟ ଗୁପ୍ତଚର ସଂସ୍ଥା",
    intelDesc: "ରିଅଲ-ଟାଇମ୍ ସମାଧାନ ସେବା-ସ୍ତରର ଅଡିଟିଂ, ହଟ୍-ଜୋନ୍ ଟ୍ରାକିଂ ଏବଂ ବିଭାଗୀୟ କାର୍ଯ୍ୟଭାର।",
    exportLedger: "ଅଡିଟ୍ ଖାତା ରପ୍ତାନି କରନ୍ତୁ (CSV)",
    gpsSync: "ଲାଇଭ୍ ନାଗରିକ ଜିପିଏସ୍ ଟେଲିମେଟ୍ରି ସିଙ୍କ୍",
    sensorStream: "ସକ୍ରିୟ ସେନ୍ସର ଷ୍ଟ୍ରିମ୍",
    gpsDesc: "ଆପଣଙ୍କର ସ୍ଥିତି ସାପେକ୍ଷରେ ହଟ୍‌ଜୋନଗୁଡ଼ିକର ସାନ୍ନିଧ୍ୟ ସୂଚକାଙ୍କ, ଜରୁରୀକାଳୀନ ପ୍ରତିକ୍ରିୟା ସମୟ ଏବଂ ଦୂରତା ସୀମା ଗଣନା କରିବାକୁ କ୍ରମାଗତ ଭାବରେ ଉପକରଣ ନିର୍ଦ୍ଦେଶାଙ୍କ ପଢିବା।",
    nearestIncident: "ନିକଟତମ ଘଟଣା",
    radius5km: "୫ କିମି ବ୍ୟାସାର୍ଦ୍ଧ ମଧ୍ୟରେ",
    dispatchHq: "ମ୍ୟୁନିସିପାଲ୍ ପ୍ରେରଣ ମୁଖ୍ୟାଳୟ",
    simulateLocation: "ସ୍ଥାନର ଗତିବିଧି ଅନୁକରଣ କରନ୍ତୁ",
    totalReports: "ସମୁଦାୟ ରିପୋର୍ଟ",
    inResolutionLoop: "ସମାଧାନ ଲୁପ୍‌ରେ",
    successfullySolved: "ସଫଳତାର ସହିତ ସମାଧାନ ହୋଇଛି",
    slaAuditCompliance: "SLA ଅଡିଟ୍ ଅନୁପାଳନ",
    historicalTrendTitle: "ଐତିହାସିକ SLA ଏବଂ ସମାଧାନ ହୋଇଥିବା ଅଭିଯୋଗର ଧାରା",
    historicalTrendDesc: "ସମୟାନୁବର୍ତ୍ତୀ ସମାଧାନ ସମୟସାରଣୀ ବିରୁଦ୍ଧରେ ରିପୋର୍ଟ ହୋଇଥିବା ସମୁଦାୟ ସମସ୍ୟାର ତୁଳନା।",
    urbanRuralRatio: "ସହରୀ ବନାମ ଗ୍ରାମୀଣ ଅନୁପାତ",
    demographicSplitDesc: "ଦାଖଲ ହୋଇଥିବା ସମସ୍ୟାଗୁଡ଼ିକର ଜନସଂଖ୍ୟାଗତ ରୁଟିଂ ବିଭାଜନ।",
    incidentsByCategory: "ବିଭାଗ ଅନୁଯାୟୀ ସମୁଦାୟ ଘଟଣା",
    categoryVolumeDesc: "ବିଭିନ୍ନ ନିରୀକ୍ଷଣ କରାଯାଉଥିବା କ୍ଷେତ୍ରଗୁଡିକରେ ଅଭିଯୋଗର ଦୃଶ୍ୟମାନ ପରିମାଣ।",
    severityDistribution: "ଗୁରୁତ୍ଵ ବଣ୍ଟନ",
    emergencyThreatDesc: "ଜରୁରୀକାଳୀନ ଏବଂ ଉଚ୍ଚ ପ୍ରାଥମିକତା ବିଶିଷ୍ତ ବିପଦ ସୂଚକାଙ୍କ ସ୍ତର।",
    ledgerTitle: "ଲାଇଭ୍ ଅଭିଯୋଗ ସମାଧାନ ଖାତା ଏବଂ ରିଅଲ-ଟାଇମ୍ ଅଡିଟ୍",
    ledgerDesc: "ନାଗରିକଙ୍କ ଦ୍ୱାରା ଦାଖଲ ହୋଇଥିବା ଅଭିଯୋଗଗୁଡିକର ସିଧାସଳଖ ଟେଲିମେଟ୍ରି, ସ୍ୱୟଂଚାଳିତ AI ରୁଟିଂ ଶ୍ରେଣୀକରଣ ଏବଂ ଶାରୀରିକ ପ୍ରେରଣ ପଞ୍ଜିକରଣ।",
    allStatuses: "ସମସ୍ତ ସ୍ଥିତି",
    allUrgency: "ସମସ୍ତ ଜରୁରୀ ସ୍ତର",
    allDistances: "ସମସ୍ତ ଦୂରତା",
    nearMeFirst: "ସର୍ଟ କରନ୍ତୁ: ପ୍ରଥਮେ ମୋ ନିକଟରେ",
    grievanceId: "ଅଭିଯୋଗ ଆଇଡି",
    subjectSector: "ବିଷୟ ଏବଂ କ୍ଷେତ୍ର",
    demographics: "ଜନସଂଖ୍ୟାଗତ ବିବରଣୀ",
    urgency: "ଜରୁରୀ",
    proximity: "ସାନ୍ନିଧ୍ୟ",
    resolutionStatus: "ସମାଧାନ ସ୍ଥିତି",
    auditActions: "ଅଡିଟ୍ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ",
    potholesWarning: "ଇନ୍ଦୋର ହଟ୍‌ସ୍ପଟ୍ ଚେତାବନୀ: ଆଗାମୀ ୪୮ ଘଣ୍ଟା ମଧ୍ୟରେ ଗ୍ରାມୀଣ କ୍ଷେତ୍ରରେ ପ୍ରବଳ ବର୍ଷା ଯୋଗୁଁ ନର୍ଦ୍ଦମା ଜଳ ପ୍ରବାହିତ ହେବା ଏବଂ ଗାତ ସୃଷ୍ଟି ହେବାର ପୂର୍ବାନୁମାନ କରାଯାଉଛି।",
    noIncidents: "ସକ୍ରିୟ ଟେଲିମେଟ୍ରି ଫିଡ୍‌ରେ କୌଣସି ମେଳ ଖାଉଥିବା ରିଅଲ-ଟਾਈମ୍ ଘଟଣା ମିଳିଲା ନାହିଁ।",
    activeIssues: "ସକ੍ਰିୟ ସମସ୍ୟା",
    localZone: "ତୁରନ୍ତ ସ୍ଥାନୀୟ କ୍ଷେତ୍ର",
    indoreHq: "ଇନ୍ଦୋର କେନ୍ଦ୍ର କାର୍ଯ୍ୟାଳୟ",
    vijayNagar: "ବିଜୟ ନଗର",
    rangwasa: "ରଙ୍ଗୱାସା",
    hardware: "ହାର୍ଡୱେର୍",
    calculating: "ଗଣନା କରାଯାଉଛି...",
    fetching: "ଅଣାଯାଉଛି...",
    accuracyThreshold: "ସଠିକତା ସୀମਾ",
    precise: "± ୧୦.୦ମି (ସଠିକ୍)",
    high: "ଉଚ୍ଚ",
    latitude: "ଅକ୍ଷାଂଶ",
    longitude: "ଦ୍ରାଘିମା"
  },
  Malayalam: {
    intelNode: "LARR സ്റ്റേറ്റ് നോഡ് / സെൻട്രൽ ഇൻ്റലിജൻസ്",
    intelDesc: "തത്സമയ പരിഹാര സേവന-തല ഓഡിറ്റിംഗ്, ഹോട്ട്-സോൺ ട്രാക്കിംഗ്, വകുപ്പിലെ ജോലിഭാരം.",
    exportLedger: "ഓഡിറ്റ് ലെഡ്ജർ കയറ്റുമതി ചെയ്യുക (CSV)",
    gpsSync: "തത്സമയ പൗരൻ ജിപിഎസ് ടെലിമെട്രി സമന്വയം",
    sensorStream: "സജീവ സെൻസർ സ്ട്രീം",
    gpsDesc: "നിങ്ങളുടെ സ്ഥാനവുമായി ബന്ധപ്പെട്ട് ഹോട്ട് സോണുകളുടെ സാമീപ്യ സൂചികകൾ, അടിയന്തിര പ്രതികരണ സമയം, ദൂര പരിധികൾ എന്നിവ കണക്കാക്കുന്നതിനായി ഉപകരണത്തിൻ്റെ കോർഡിനേറ്റുകൾ തുടർച്ചയായി വായിക്കുന്നു.",
    nearestIncident: "ഏറ്റവും അടുത്തുള്ള സംഭവം",
    radius5km: "5 കിലോമീറ്റർ പരിധിക്കുള്ളിൽ",
    dispatchHq: "മുനിസിപ്പൽ ഡിസ്പാച്ച് ആസ്ഥാനം",
    simulateLocation: "ലൊക്കേഷൻ ചലനങ്ങൾ അനുകരിക്കുക",
    totalReports: "ആകെ റിപ്പോർട്ടുകൾ",
    inResolutionLoop: "പരിഹാര ലൂപ്പിൽ",
    successfullySolved: "വിജയകരമായി പരിഹരിച്ചു",
    slaAuditCompliance: "SLA ഓഡിറ്റ് പാലിക്കൽ",
    historicalTrendTitle: "ചരിത്രപരമായ SLA-യും പരിഹരിച്ച പരാതികളുടെ പ്രവണതകളും",
    historicalTrendDesc: "കൃത്യസമയത്ത് പരിഹരിക്കുന്നതിനുള്ള ഷെഡ്യൂളുകളുമായി റിപ്പോർട്ട് ചെയ്യപ്പെട്ട ആകെ പ്രശ്നങ്ങളെ താരതമ്യം ചെയ്യുന്നു.",
    urbanRuralRatio: "നഗര-ഗ്രാമ അനുപാതം",
    demographicSplitDesc: "സമർപ്പിച്ച പ്രശ്നങ്ങളുടെ ഡെമോഗ്രാഫിക് റൂട്ടിംഗ് വിഭജനം.",
    incidentsByCategory: "വിഭാഗം തിരിച്ച് ആകെ സംഭവങ്ങൾ",
    categoryVolumeDesc: "വിവിധ മേഖലകളിൽ നിരീക്ഷിക്കപ്പെടുന്ന പരാതികളുടെ ദൃശ്യപരമായ അളവ്.",
    severityDistribution: "തീവ്രത വിതരണം",
    emergencyThreatDesc: "അടിയന്തിരവും ഉയർന്ന മുൻഗണനയുള്ളതുമായ ഭീഷണി സൂചിക തലങ്ങൾ.",
    ledgerTitle: "തത്സമയ പരാതി പരിഹാര ലെഡ്ജറും തത്സമയ ഓഡിറ്റും",
    ledgerDesc: "പൗരന്മാർ ഫയൽ ചെയ്ത പരാതികളുടെ നേരിട്ടുള്ള ടെലിമെട്രി, ഓട്ടോമേറ്റഡ് AI റൂട്ടിംഗ് വർഗ്ഗീകരണങ്ങൾ, ഫിസിക്കൽ ഡിസ്പാച്ച് രജിസ്ട്രികൾ.",
    allStatuses: "എല്ലാ സ്റ്റാറ്റസുകളും",
    allUrgency: "എല്ലാ അടിയന്തിര തലങ്ങളും",
    allDistances: "എല്ലാ ദൂരങ്ങളും",
    nearMeFirst: "ക്രമീകരിക്കുക: എനിക്ക് അടുത്തുള്ളത് ആദ്യം",
    grievanceId: "പരാതി ഐഡി",
    subjectSector: "വിഷയവും മേഖലയും",
    demographics: "ജനസംഖ്യാ വിവരങ്ങൾ",
    urgency: "അടിയന്തിരാവസ്ഥ",
    proximity: "സാമീപ്യം",
    resolutionStatus: "പരിഹാര നില",
    auditActions: "ഓഡിറ്റ് നടപടிகள்",
    potholesWarning: "ഇൻഡോർ ഹോട്ട്‌സ്‌പോട്ട് മുന്നറിയിപ്പ്: അടുത്ത 48 മണിക്കൂറിനുള്ളിൽ ഗ്രാമീണ മേഖലകളിൽ കനത്ത മഴ കാരണം മലിനജലം കവിഞ്ഞൊഴുകാനും കുഴികൾ രൂപപ്പെടാനും സാധ്യതയുണ്ടെന്ന് പ്രവചിക്കുന്നു.",
    noIncidents: "സജീവ ടെലിമെട്രി ഫീഡിൽ പൊരുത്തപ്പെടുന്ന തത്സമയ സംഭവങ്ങളൊന്നും കണ്ടെത്തിയില്ല.",
    activeIssues: "സജീവമായ പ്രശ്നങ്ങൾ",
    localZone: "ഉടൻ തദ്ദേശീയ മേഖല",
    indoreHq: "ഇൻഡോർ സെൻ്റർ ഓഫീസ്",
    vijayNagar: "വിജയ് നഗർ",
    rangwasa: "രംഗ്വാസ",
    hardware: "ഹാർഡ്‌വെയർ",
    calculating: "കണക്കാക്കുന്നു...",
    fetching: "ശേഖരിക്കുന്നു...",
    accuracyThreshold: "കൃത്യതയുടെ പരിധി",
    precise: "± 10.0മീ (കൃത്യമായ)",
    high: "ഉയർന്ന",
    latitude: "അക്ഷാംശം",
    longitude: "രേഖാംശം"
  },
  Punjabi: {
    intelNode: "LARR ਸਟੇਟ ਨੋਡ / ਕੇਂਦਰੀ ਖੁਫੀਆ ਵਿਭਾਗ",
    intelDesc: "ਰੀਅਲ-ਟਾਈਮ ਹੱਲ ਸੇਵਾ-ਪੱਧਰ ਦੀ ਆਡਿਟਿੰਗ, ਹੌਟ-ਜ਼ੋਨ ਟ੍ਰੈਕਿੰਗ ਅਤੇ ਵਿਭਾਗ ਦੇ ਕੰਮ ਦਾ ਬੋਝ।",
    exportLedger: "ਆਡਿਟ ਲੈਜਰ ਨਿਰਯਾਤ ਕਰੋ (CSV)",
    gpsSync: "ਲਾਈਵ ਨਾਗਰਿਕ GPS ਟੈਲੀਮੈਟਰੀ ਸਿੰਕ",
    sensorStream: "ਸਰਗਰਮ ਸੈਂਸਰ ਸਟ੍ਰੀਮ",
    gpsDesc: "ਤੁਹਾਡੀ ਸਥਿਤੀ ਦੇ ਸਾਪੇਖਿਕ ਹੌਟਜ਼ੋਨ ਦੀ ਨੇੜਤਾ ਸੂਚਕਾਂਕ, ਐਮਰਜੈਂਸੀ ਪ੍ਰਤੀਕਿਰਿਆ ਸਮੇਂ ਅਤੇ ਦੂਰੀ ਦੀਆਂ ਸੀਮਾਵਾਂ ਦੀ ਗਣਨਾ ਕਰਨ ਲਈ ਡਿਵਾਈਸ ਦੇ ਕੋਆਰਡੀਨੇਟਸ ਨੂੰ ਲਗਾਤਾਰ ਪੜ੍ਹਨਾ।",
    nearestIncident: "ਸਭ ਤੋਂ ਨਜ਼ਦੀਕੀ ਘਟਨਾ",
    radius5km: "5 ਕਿਲੋਮੀਟਰ ਦੇ ਦਾਇਰੇ ਵਿੱਚ",
    dispatchHq: "ਮਿਊਂਸੀਪਲ ਡਿਸਪੈਚ ਹੈੱਡਕੁਆਰਟਰ",
    simulateLocation: "ਸਥਾਨ ਦੀ ਹਿਲਜੁਲ ਦਾ ਨਕਲ ਕਰੋ",
    totalReports: "ਕੁੱਲ ਰਿਪੋਰਟਾਂ",
    inResolutionLoop: "ਹੱਲ ਲੂਪ ਵਿੱਚ",
    successfullySolved: "ਸਫਲਤਾਪੂਰਵਕ ਹੱਲ ਕੀਤਾ ਗਿਆ",
    slaAuditCompliance: "SLA ਆਡਿਟ ਪਾਲਣਾ",
    historicalTrendTitle: "ਇਤਿਹਾਸਕ SLA ਅਤੇ ਹੱਲ ਕੀਤੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਦੇ ਰੁਝਾਨ",
    historicalTrendDesc: "ਸਮੇਂ ਸਿਰ ਹੱਲ ਕਰਨ ਦੇ ਕਾਰਜਕ੍ਰਮਾਂ ਦੇ ਵਿਰੁੱਧ ਰਿਪੋਰਟ ਕੀਤੀਆਂ ਕੁੱਲ ਸਮੱਸਿਆਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰਨਾ।",
    urbanRuralRatio: "ਸ਼ਹਿਰੀ ਬਨਾਮ ਪੇਂਡੂ ਅਨੁਪਾਤ",
    demographicSplitDesc: "ਸਪੁਰਦ ਕੀਤੀਆਂ ਸਮੱਸਿਆਵਾਂ ਦੀ ਜਨਸੰਖਿਆ ਸੰਬੰਧੀ ਰੂਟਿੰਗ ਵੰਡ।",
    incidentsByCategory: "ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਕੁੱਲ ਘਟਨਾਵਾਂ",
    categoryVolumeDesc: "ਵੱਖ-ਵੱਖ ਨਿਗਰਾਨੀ ਅਧੀਨ ਖੇਤਰਾਂ ਵਿੱਚ ਸ਼ਿਕਾਇਤਾਂ ਦੀ ਮਾਤਰਾ।",
    severityDistribution: "ਗੰਭੀਰਤਾ ਵੰਡ",
    emergencyThreatDesc: "ਐਮਰਜੈਂਸੀ ਅਤੇ ਉੱਚ ਤਰਜੀਹ ਵਾਲੇ ਖਤਰੇ ਦੇ ਸੂਚਕਾਂਕ ਦੇ ਪੱਧਰ।",
    ledgerTitle: "ਲਾਈਵ ਸ਼ਿਕਾਇਤ ਹੱਲ ਲੈਜਰ ਅਤੇ ਰੀਅਲ-ਟਾਈਮ ਆਡਿਟ",
    ledgerDesc: "ਨਾਗਰਿਕਾਂ ਦੁਆਰਾ ਦਰਜ ਕੀਤੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਦੀ ਸਿੱਧੀ ਟੈਲੀਮੈਟਰੀ, ਸਵੈਚਾਲਿਤ AI ਰੂਟਿੰਗ ਵਰਗੀਕਰਨ ਅਤੇ ਭੌਤਿਕ ਡਿਸਪੈਚ ਰਜਿਸਟਰੀਆਂ।",
    allStatuses: "ਸਾਰੀਆਂ ਸਥਿਤੀਆਂ",
    allUrgency: "ਸਾਰੇ ਜ਼ਰੂਰੀ ਪੱਧਰ",
    allDistances: "ਸਾਰੀਆਂ ਦੂਰੀਆਂ",
    nearMeFirst: "ਤਰਤੀਬ ਦਿਓ: ਪਹਿਲਾਂ ਮੇਰੇ ਨੇੜੇ",
    grievanceId: "ਸ਼ਿਕਾਇਤ ਆਈਡੀ",
    subjectSector: "ਵਿਸ਼ਾ ਅਤੇ ਖੇਤਰ",
    demographics: "ਜਨਸੰਖਿਆ",
    urgency: "ਜ਼ਰੂਰੀ",
    proximity: "ਨੇੜਤਾ",
    resolutionStatus: "ਹੱਲ ਸਥਿਤੀ",
    auditActions: "ਆਡਿਟ ਕਾਰਵਾਈਆਂ",
    potholesWarning: "ਇੰਦੌਰ ਹੌਟਸਪੌਟ ਚੇਤਾਵਨੀ: ਅਗਲੇ 48 ਘੰਟਿਆਂ ਵਿੱਚ ਪੇਂਡੂ ਖੇਤਰਾਂ ਵਿੱਚ ਭਾਰੀ ਮੀਂਹ ਕਾਰਨ ਸੀਵਰ ਓਵਰਫਲੋ ਅਤੇ ਟੋਏ ਵਧਣ ਦੀ ਭਵਿੱਖਬਾਣੀ ਕੀਤੀ ਗਈ ਹੈ।",
    noIncidents: "ਸਰਗਰਮ ਟੈਲੀਮੈਟਰੀ ਫੀਡ ਵਿੱਚ ਕੋਈ ਮੇਲ ਖਾਂਦੀਆਂ ਰੀਅਲ-ਟਾਈਮ ਘਟਨਾਵਾਂ ਨਹੀਂ ਮਿਲੀਆਂ।",
    activeIssues: "ਸਰਗਰਮ ਮੁੱਦੇ",
    localZone: "ਤੁਰੰਤ ਸਥਾਨਕ ਖੇਤਰ",
    indoreHq: "ਇੰਦੌਰ ਕੇਂਦਰ ਦਫ਼ਤਰ",
    vijayNagar: "ਵਿਜੇ ਨਗਰ",
    rangwasa: "ਰੰਗਵਾਸਾ",
    hardware: "ਹਾਰਡਵੇਅਰ",
    calculating: "ਗਣਨਾ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
    fetching: "ਪ੍ਰਾਪਤ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    accuracyThreshold: "ਸ਼ੁੱਧਤਾ ਦੀ ਸੀਮਾ",
    precise: "± 10.0 ਮੀਟਰ (ਸਟੀਕ)",
    high: "ਉੱਚ",
    latitude: "ਅਕਸ਼ਾਂਸ਼",
    longitude: "ਰੇਖਾਂਸ਼"
  },
  Assamese: {
    intelNode: "LARR ষ্টেট ন’ড / কেন্দ্ৰীয় চোৰাংচোৱা সংস্থা",
    intelDesc: "ৰিয়েল-টাইম সমাধান সেৱা-স্তৰৰ অডিটিং, হট-জ’ন ট্ৰেকিং আৰু বিভাগীয় কৰ্মৰ বোজা।",
    exportLedger: "অডিট লেজাৰ ৰপ্তানি কৰক (CSV)",
    gpsSync: "লাইভ নাগৰিক GPS টেলিমাইট্ৰি সংযোগ",
    sensorStream: "সক্ৰিয় চেন্সৰ ষ্ট্ৰীম",
    gpsDesc: "আপোনাৰ স্থানৰ সাপেক্ষে হটজ’নসমূহৰ সান্নিধ্য সূচক, জৰুৰীকালীন সঁহাৰিৰ সময় আৰু দূৰত্বৰ সীমা গণনা কৰিবলৈ অবিৰতভাৱে ডিভাইচৰ স্থানাংক পঢ়া।",
    nearestIncident: "নিকটতম ঘটনা",
    radius5km: "৫ কিমি ব্যাসাৰ্ধৰ ভিতৰত",
    dispatchHq: "পৌৰসভা প্ৰেৰণ সদৰ কাৰ্যালয়",
    simulateLocation: "স্থানৰ গতিবিধি অনুকৰণ কৰক",
    totalReports: "মুঠ প্ৰতিবেদন",
    inResolutionLoop: "সমাধান লুপত",
    successfullySolved: "সফলতাৰে সমাধান কৰা হৈছে",
    slaAuditCompliance: "SLA অডিট সন্মতি",
    historicalTrendTitle: "ঐতিহাসিক SLA আৰু সমাধান কৰা অভিযোগৰ ধাৰা",
    historicalTrendDesc: "অন-টাইম সমাধান সময়সূচীৰ সৈতে প্ৰতিবেদন কৰা মুঠ সমস্যাৰ তুলনা কৰা।",
    urbanRuralRatio: "নগৰীয়া বনাম গ্ৰাম্য অনুপাত",
    demographicSplitDesc: "দাখিল কৰা সমস্যাসমূহৰ জনগাঁথনিমূলক ৰুটিং বিভাজন।",
    incidentsByCategory: "শ্ৰেণী অনুসৰি মুঠ ঘটনা",
    categoryVolumeDesc: "বিভিন্ন নিৰীক্ষণ কৰা খণ্ডসমূহত অভিযোগৰ দৃশ্যমান পৰিমাণ।",
    severityDistribution: "তীব্ৰতাৰ বিতৰণ",
    emergencyThreatDesc: "জৰুৰীকালীন আৰু উচ্চ অগ্ৰাধিকাৰৰ ভাবুকি সূচক স্তৰ।",
    ledgerTitle: "লাইভ অভিযোগ সমাধান খতিয়ান আৰু ৰিয়েল-টাইম অডিট",
    ledgerDesc: "নাগরিকৰ দ্বাৰা দাখিল কৰা অভিযোগসমূহৰ পোনপটীয়া টেলিমাইট্ৰি, স্বয়ংক্ৰিয় এআই ৰুটিং শ্ৰেণীবিভাজন আৰু শাৰীৰিক প্ৰেৰণ পঞ্জী।",
    allStatuses: "সকলো স্থিতি",
    allUrgency: "সকলো জৰুৰী স্তৰ",
    allDistances: "সকলো দূৰত্ব",
    nearMeFirst: "সজাওক: মোৰ ওচৰৰ প্ৰথম",
    grievanceId: "অভিযোগ আইডি",
    subjectSector: "বিষয় আৰু খণ্ড",
    demographics: "জনগাঁথনি",
    urgency: "জৰুৰী",
    proximity: "সান্নিধ্য",
    resolutionStatus: "সমাধানৰ স্থিতি",
    auditActions: "অডিট ব্যৱস্থা",
    potholesWarning: "ইন্দোৰ হটস্পট সতৰ্কবাণী: অতিপাত বৰষুণৰ ফলত আগন্তুক ৪৮ ঘণ্টাৰ ভিতৰত গ্ৰাম্য খণ্ডত নলা উপচি পৰা আৰু গাঁতৰ সংখ্যা বৃদ্ধি পোৱাৰ সম্ভাৱনা আছে।",
    noIncidents: "সক্ৰিয় টেলিমাইট্ৰি ফীডত কোনো মিলা ৰিয়েল-টাইম ঘটনা পোৱা নগ’ল।",
    activeIssues: "সক্ৰিয় সমস্যা",
    localZone: "তৎক্ষণাৎ স্থানীয় এলেকা",
    indoreHq: "ইন্দোৰ কেন্দ্ৰীয় কাৰ্যালয়",
    vijayNagar: "বিজয় নগৰ",
    rangwasa: "ৰংৱাচা",
    hardware: "হাৰ্ডৱেৰ",
    calculating: "গণনা কৰি থকা হৈছে...",
    fetching: "অনা হৈ আছে...",
    accuracyThreshold: "শুদ্ধতাৰ সীমা",
    precise: "± ১০.০মি (শুদ্ধ)",
    high: "উচ্চ",
    latitude: "অক্ষাংশ",
    longitude: "দ্ৰাঘিমাংশ"
  }
};

const EXTRA_ANALYTICS_TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    indoreWarning: "Indore Hotspot Warning:",
    searchPlaceholder: "Search GID, Title, Ward...",
    syncing: "Syncing...",
    inspectAudit: "Inspect Audit",
    activeConnection: "Active Feed Connection: Secure",
    showingRecords: "Showing {filtered} of {total} records",
    filed: "Filed:",
    reportedConcern: "Reported Civic Concern",
    attachedEvidence: "Attached Photographic Evidence",
    aiAudit: "AI Verification Audit",
    classificationConfidence: "Classification Confidence",
    assignedDept: "Assigned Department",
    autoLabels: "Auto-detected Labels",
    aiReason: "AI Triage Reason",
    assignedExecutive: "Assigned Field Executive",
    ledgerHistory: "Ledger History & Status Timestamps",
    closeInspection: "Close Audit Inspection",
    within5km: "Within 5 km",
    within10km: "Within 10 km",
    within15km: "Within 15 km",
    within25km: "Within 25 km",
    within50km: "Within 50 km",
    avgDispatch: "Avg dispatch:",
    slaTarget: "SLA Target:"
  },
  Hindi: {
    indoreWarning: "इंदौर हॉटस्पॉट चेतावनी:",
    searchPlaceholder: "खोजें GID, शीर्षक, वार्ड...",
    syncing: "सिंक किया जा रहा है...",
    inspectAudit: "ऑडिट जांचें",
    activeConnection: "सक्रिय फ़ीड कनेक्शन: सुरक्षित",
    showingRecords: "{total} रिकॉर्ड्स में से {filtered} दिखा रहा है",
    filed: "दर्ज किया गया:",
    reportedConcern: "रिपोर्ट की गई नागरिक चिंता",
    attachedEvidence: "संलग्न फोटोग्राफिक साक्ष्य",
    aiAudit: "एआई सत्यापन ऑडिट",
    classificationConfidence: "वर्गीकरण आत्मविश्वास",
    assignedDept: "सौंपा गया विभाग",
    autoLabels: "ऑटो-डिटेक्टेड लेबल",
    aiReason: "एआई ट्राइएज कारण",
    assignedExecutive: "सौंपा गया फील्ड कार्यकारी",
    ledgerHistory: "खाता इतिहास और स्थिति टाइमस्टैम्प",
    closeInspection: "ऑडिट निरीक्षण बंद करें",
    within5km: "5 किमी के भीतर",
    within10km: "10 किमी के भीतर",
    within15km: "15 किमी के भीतर",
    within25km: "25 किमी के भीतर",
    within50km: "50 किमी के भीतर",
    avgDispatch: "औसत प्रेषण:",
    slaTarget: "एसएलए लक्ष्य:"
  },
  Telugu: {
    indoreWarning: "ఇండోర్ హాట్‌స్పాట్ హెచ్చరిక:",
    searchPlaceholder: "శోధించండి GID, శీర్షిక, వార్డ్...",
    syncing: "సింక్ అవుతోంది...",
    inspectAudit: "ఆడిట్ తనిఖీ చేయండి",
    activeConnection: "యాక్టివ్ ఫీడ్ కనెక్షన్: సురక్షితం",
    showingRecords: "{total} రికార్డులలో {filtered} చూపుతోంది",
    filed: "నమోదైంది:",
    reportedConcern: "నివేదించబడిన పౌర ఆందోళన",
    attachedEvidence: "జతచేయబడిన ఫోటోగ്രാఫిక్ ఆధారాలు",
    aiAudit: "AI ధ్రువీకరణ ఆడిట్",
    classificationConfidence: "वर्गीकरण విశ్వసనీయత",
    assignedDept: "కేటాయించిన విభాగం",
    autoLabels: "ఆటో-గుర్తించబడిన లేబుల్స్",
    aiReason: "AI ట్రయాజ్ కారణం",
    assignedExecutive: "కేటాయించిన ఫీల్డ్ ఎగ్జిక్యూటివ్",
    ledgerHistory: "లెడ్జర్ చరిత్ర & స్థితి టైమ్‌స్టాంప్‌లు",
    closeInspection: "ఆడిట్ తనిఖీని మూసివేయి",
    within5km: "5 కిమీ పరిధిలో",
    within10km: "10 కిమీ పరిధిలో",
    within15km: "15 కిమీ పరిధిలో",
    within25km: "25 కిమీ పరిధిలో",
    within50km: "50 కిమీ పరిధిలో",
    avgDispatch: "సగటు డిస్పాచ్:",
    slaTarget: "SLA లక్ష్యం:"
  },
  Tamil: {
    indoreWarning: "இந்தூர் ஹாட்ஸ்பாட் எச்சரிக்கை:",
    searchPlaceholder: "தேடுக GID, தலைப்பு, வார்டு...",
    syncing: "ஒত্তিசைக்கிறது...",
    inspectAudit: "தணிக்கையை ஆய்வு செய்",
    activeConnection: "செயலில் உள்ள ஊட்ட இணைப்பு: பாதுகாப்பானது",
    showingRecords: "{total} பதிவுகளில் {filtered} காட்டுகிறது",
    filed: "பதிவு செய்யப்பட்டது:",
    reportedConcern: "புகாரளிக்கப்பட்ட குடிமகன் கவலை",
    attachedEvidence: "இணைக்கப்பட்ட புகைப்பட ஆதாரம்",
    aiAudit: "AI சரிபார்ப்பு தணிக்கை",
    classificationConfidence: "வகைப்பாடு நம்பிக்கை",
    assignedDept: "ஒதுக்கப்பட்ட துறை",
    autoLabels: "தானாக கண்டறியப்பட்ட லேபிள்கள்",
    aiReason: "AI வகைப்படுத்தல் காரணம்",
    assignedExecutive: "ஒதுக்கப்பட்ட கள அதிகாரி",
    ledgerHistory: "பேரேட்டு வரலாறு & நேரமுத்திரைகள்",
    closeInspection: "தணிக்கை ஆய்வை மூடு",
    within5km: "5 கி.மீக்குள்",
    within10km: "10 கி.மீக்குள்",
    within15km: "15 கி.மீக்குள்",
    within25km: "25 கி.மீக்குள்",
    within50km: "50 கி.மீக்குள்",
    avgDispatch: "சராசரி அனுப்புதல்:",
    slaTarget: "SLA இலக்கு:"
  },
  Kannada: {
    indoreWarning: "ಇಂದೋರ್ ಹಾಟ್‌ಸ್ಪಾಟ್ ಎಚ್ಚರಿಕೆ:",
    searchPlaceholder: "ಹುಡುಕಿ GID, ಶೀರ್ಷಿಕೆ, ವಾರ್ಡ್...",
    syncing: "ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...",
    inspectAudit: "ದೂರನ್ನು ಪರಿಶೀಲಿಸಿ",
    activeConnection: "ಸಕ್ರಿಯ ಫೀಡ್ ಸಂಪರ್ಕ: ಸುರಕ್ಷิต",
    showingRecords: "{total} ದಾಖಲೆಗಳಲ್ಲಿ {filtered} ತೋರಿಸಲಾಗುತ್ತಿದೆ",
    filed: "ಸಲ್ಲಿಸಲಾಗಿದೆ:",
    reportedConcern: "ವರದಿಯಾದ ನಾಗರಿಕ ಕಾಳಜಿ",
    attachedEvidence: "ಲગತ್ತಿಸಲಾದ ಛಾಯಾಚಿತ್ರ ಪುರಾವೆ",
    aiAudit: "ಎಐ ಪರಿಶೀಲನೆ ಆಡಿಟ್",
    classificationConfidence: "ವರ್ಗೀಕರಣದ ವಿಶ್ವಾಸಾರ್ಹತೆ",
    assignedDept: "ನಿಯೋಜಿಸಲಾದ ಇಲಾಖೆ",
    autoLabels: "ಸ್ವಯಂ ಪತ್ತೆಯಾದ ಲೇಬಲ್‌ಗಳು",
    aiReason: "ಎಐ ವರ್ಗೀಕರಣದ ಕಾರಣ",
    assignedExecutive: "ನಿಯೋಜಿತ ಕ್ಷೇತ್ರ ಕಾರ್ಯನಿರ್ವಾಹಕ",
    ledgerHistory: "ಖಾತಾ ಇತಿಹಾಸ ಮತ್ತು ಸ್ಥಿತಿ ಸಮಯದ ಮುದ್ರೆಗಳು",
    closeInspection: "ಪರಿಶೀಲನೆಯನ್ನು ಮುಚ್ಚಿ",
    within5km: "5 ಕಿಮೀ ಒಳಗೆ",
    within10km: "10 ಕಿಮೀ ಒಳಗೆ",
    within15km: "15 ಕಿಮೀ ಒಳಗೆ",
    within25km: "25 ಕಿಮೀ ಒಳಗೆ",
    within50km: "50 ಕಿಮೀ ಒಳಗೆ",
    avgDispatch: "ಸರಾಸರಿ ರವಾನೆ:",
    slaTarget: "SLA ಗುರಿ:"
  },
  Malayalam: {
    indoreWarning: "ഇൻഡോർ ഹോട്ട്‌സ്‌പോട്ട് മുന്നറിയിപ്പ്:",
    searchPlaceholder: "തിരയുക GID, വിഷയം, വാർഡ്...",
    syncing: "സമന്വയിപ്പിക്കുന്നു...",
    inspectAudit: "ഓഡിറ്റ് പരിശോധിക്കുക",
    activeConnection: "സജീവ ഫീഡ് കണക്ഷൻ: സുരക്ഷിതം",
    showingRecords: "{total} റെക്കോർഡുകളിൽ {filtered} കാണിക്കുന്നു",
    filed: "രേഖപ്പെടുത്തിയത്:",
    reportedConcern: "റിപ്പോർട്ട് ചെയ്ത പൗരന്റെ ആശങ്ക",
    attachedEvidence: "ചേർത്തിട്ടുള്ള ഫോട്ടോ തെളിവ്",
    aiAudit: "എഐ പരിശോധനാ ഓഡിറ്റ്",
    classificationConfidence: "വർഗ്ഗീകരണ വിശ്വാസ്യത",
    assignedDept: "നിയോഗിക്കപ്പെട്ട വകുപ്പ്",
    autoLabels: "സ്വയം കണ്ടെത്തിയ ലേബലുകൾ",
    aiReason: "എഐ ട്രിയാജ് കാരണം",
    assignedExecutive: "നിയോഗിക്കപ്പെട്ട ഫീൽഡ് എക്സിക്യൂട്ടീവ്",
    ledgerHistory: "ലെഡ്ജർ ചരിത്രവും നിലവിലെ ടൈംസ്റ്റാമ്പുകളും",
    closeInspection: "പരിശോധന അവസാനിപ്പിക്കുക",
    within5km: "5 കിലോമീറ്ററിനുള്ളിൽ",
    within10km: "10 കിലോമീറ്ററിനുള്ളിൽ",
    within15km: "15 കിലോമീറ്ററിനുള്ളിൽ",
    within25km: "25 കിലോമീറ്ററിനുള്ളിൽ",
    within50km: "50 കിലോമീറ്ററിനുള്ളിൽ",
    avgDispatch: "ശരാശരി അയയ്ക്കൽ സമയം:",
    slaTarget: "SLA ലക്ഷ്യം:"
  },
  Marathi: {
    indoreWarning: "इंदूर हॉटस्पॉट चेतावणी:",
    searchPlaceholder: "शोधा GID, शीर्षक, वॉर्ड...",
    syncing: "सिंक होत आहे...",
    inspectAudit: "ऑडिट तपासा",
    activeConnection: "सक्रिय फीड कनेक्शन: सुरक्षित",
    showingRecords: "{total} रेकॉर्डपैकी {filtered} दाखवत आहे",
    filed: "नोंदवले गेले:",
    reportedConcern: "नोंदवलेली नागरी चिंता",
    attachedEvidence: "जोडलेला फोटो पुरावा",
    aiAudit: "एआय पडताळणी ऑडिट",
    classificationConfidence: "वर्गीकरण आत्मविश्वास",
    assignedDept: "नियुक्त विभाग",
    autoLabels: "स्वयंचलितपणे आढळलेले लेबल्स",
    aiReason: "एआय वर्गीकरण कारण",
    assignedExecutive: "नियुक्त क्षेत्र कार्यकारी",
    ledgerHistory: "खाते इतिहास आणि स्थिती टाइमस्टॅम्प",
    closeInspection: "ऑडिट तपासणी बंद करा",
    within5km: "५ किमीच्या आत",
    within10km: "१० किमीच्या आत",
    within15km: "१५ किमीच्या आत",
    within25km: "२५ किमीच्या आत",
    within50km: "५० किमीच्या आत",
    avgDispatch: "सरासरी डिस्पॅच:",
    slaTarget: "SLA लक्ष्य:"
  },
  Bengali: {
    indoreWarning: "ইন্দোর হটস্পট সতর্কীকরণ:",
    searchPlaceholder: "অনুসন্ধান GID, শিরোনাম, ওয়ার্ড...",
    syncing: "সিঙ্ক করা হচ্ছে...",
    inspectAudit: "অডিট পরীক্ষা করুন",
    activeConnection: "সক্রিয় ফিড সংযোগ: সুরক্ষিত",
    showingRecords: "{total} রেকর্ডের মধ্যে {filtered} দেখানো হচ্ছে",
    filed: "দাখিল করা হয়েছে:",
    reportedConcern: "রিপোর্ট করা নাগরিক উদ্বেগ",
    attachedEvidence: "সংযুক্ত ছবি প্রমাণ",
    aiAudit: "এআই যাচাইকরণ অডিট",
    classificationConfidence: "শ্রেণীবদ্ধকরণ আত্মবিশ্বাস",
    assignedDept: "বরাদ্দ বিভাগ",
    autoLabels: "স্বয়ংক্রিয়ভাবে সনাক্ত লেবেল",
    aiReason: "এআই ট্রিয়েজ কারণ",
    assignedExecutive: "নিযুক্ত ফিল্ড এক্সিকিউটিভ",
    ledgerHistory: "খতিয়ান ইতিহাস ও স্ট্যাটাস টাইমস্ট্যাম্প",
    closeInspection: "অডিট পরিদর্শন বন্ধ করুন",
    within5km: "৫ কিমি এর মধ্যে",
    within10km: "১০ কিমি এর মধ্যে",
    within15km: "১৫ কিমি এর মধ্যে",
    within25km: "২৫ কিমি এর মধ্যে",
    within50km: "৫০ কিমি এর মধ্যে",
    avgDispatch: "গড় প্রেরণ:",
    slaTarget: "SLA লক্ষ্য:"
  },
  Gujarati: {
    indoreWarning: "ઇન્દોર હોટસ્પોટ ચેતવણી:",
    searchPlaceholder: "શોધો GID, શીર્ષક, વોર્ડ...",
    syncing: "સિંક થઈ રહ્યું છે...",
    inspectAudit: "ઓડિટ તપાસો",
    activeConnection: "સક્રિય ફીડ કનેક્શન: સુરક્ષિત",
    showingRecords: "{total} રેકોર્ડમાંથી {filtered} દર્શાવે છે",
    filed: "દાખલ કરેલ:",
    reportedConcern: "અહેવાલ કરેલ નાગરિક ચિંતા",
    attachedEvidence: "જોડાયેલ ફોટો પુરાવો",
    aiAudit: "એઆઈ વેરિફિકેશન ઓડિટ",
    classificationConfidence: "વર્ગીકરણ આત્મવિશ્વાસ",
    assignedDept: "સોંપાયેલ વિભાગ",
    autoLabels: "સ્વચાલિત રૂપે મળેલ લેબલ્સ",
    aiReason: "એઆઈ વર્ગીકરણ કારણ",
    assignedExecutive: "સોંપાયેલ ફિલ્ડ એક્ઝિક્યુટિવ",
    ledgerHistory: "ખાતાવહી ઇતિહાસ અને સ્થિતિ સમય સ્ટેમ્પ",
    closeInspection: "ઓડિટ નિરીક્ષણ બંધ કરો",
    within5km: "૫ કિમીની અંદર",
    within10km: "૧૦ કિમીની અંદર",
    within15km: "૧૫ કિમીની અંદર",
    within25km: "૨૫ કિમીની અંદર",
    within50km: "૫૦ કિમીની અંદર",
    avgDispatch: "સરેરાશ મોકલવાનો સમય:",
    slaTarget: "SLA લક્ષ્ય:"
  },
  Punjabi: {
    indoreWarning: "ਇੰਦੌਰ ਹੌਟਸਪੌਟ ਚੇਤਾਵਨੀ:",
    searchPlaceholder: "ਖੋਜੋ GID, ਸਿਰਲੇਖ, ਵਾਰਡ...",
    syncing: "ਸਿੰਕ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    inspectAudit: "ਆਡਿਟ ਦੀ ਜਾਂਚ ਕਰੋ",
    activeConnection: "ਸਰਗਰਮ ਫੀਡ ਕਨੈਕਸ਼ਨ: ਸੁਰੱਖਿਅਤ",
    showingRecords: "{total} ਰਿਕਾਰਡਾਂ ਵਿੱਚੋਂ {filtered} ਦਿਖਾ ਰਿਹਾ ਹੈ",
    filed: "ਦਰਜ ਕੀਤਾ ਗਿਆ:",
    reportedConcern: "ਰਿਪੋਰਟ ਕੀਤੀ ਨਾਗਰਿਕ ਚਿੰਤਾ",
    attachedEvidence: "ਨੱਥੀ ਫੋਟੋਗ੍ਰਾਫਿਕ ਸਬੂਤ",
    aiAudit: "ਏਆਈ ਵੈਰੀਫਿਕੇਸ਼ਨ ਆਡਿਟ",
    classificationConfidence: "ਵਰਗੀਕਰਨ ਦਾ ਭਰੋਸਾ",
    assignedDept: "ਸੌਂਪਿਆ ਗਿਆ ਵਿਭਾਗ",
    autoLabels: "ਆਟੋ-ਡਿਟੈਕਟਡ ਲੇਬਲ",
    aiReason: "ਏਆਈ ਟ੍ਰਾਈਏਜ ਦਾ ਕਾਰਨ",
    assignedExecutive: "ਸੌਂਪਿਆ ਗਿਆ ਫੀਲਡ ਐਗਜ਼ੀਕਿਊਟਿਵ",
    ledgerHistory: "ਖਾਤਾ ਇਤਿਹਾਸ ਅਤੇ ਸਥਿਤੀ ਦੇ ਟਾਈਮਸਟੈਂਪ",
    closeInspection: "ਆਡਿਟ ਨਿਰੀਖਣ ਬੰਦ ਕਰੋ",
    within5km: "5 ਕਿਲੋਮੀਟਰ ਦੇ ਅੰਦਰ",
    within10km: "10 ਕਿਲੋਮੀਟਰ ਦੇ ਅੰਦਰ",
    within15km: "15 ਕਿਲੋਮੀਟਰ ਦੇ ਅੰਦਰ",
    within25km: "25 ਕਿਲੋਮੀਟਰ ਦੇ ਅੰਦਰ",
    within50km: "50 ਕਿਲੋਮੀਟਰ ਦੇ ਅੰਦਰ",
    avgDispatch: "ਔਸਤ ਭੇਜਣਾ:",
    slaTarget: "SLA ਟੀਚਾ:"
  },
  Odia: {
    indoreWarning: "ଇନ୍ଦୋର ହଟସ୍ପଟ ସତର୍କତା:",
    searchPlaceholder: "ଖୋଜନ୍ତୁ GID, ଶୀର୍ଷକ, ୱାର୍ଡ...",
    syncing: "ସିଙ୍କ୍ ହେଉଛି...",
    inspectAudit: "ଅଡିଟ୍ ଯାଞ୍ଚ କରନ୍ତୁ",
    activeConnection: "ସକ୍ରିୟ ଫିଡ୍ ସଂଯୋଗ: ସୁରକ୍ଷିତ",
    showingRecords: "{total} ରେକର୍ଡରୁ {filtered} ଦର୍ଶାଉଛି",
    filed: "ଦାଖଲ ତାରିଖ:",
    reportedConcern: "ରିପୋର୍ଟ ହୋଇଥିବା ନାଗରିକ ଚିନ୍ତା",
    attachedEvidence: "ସଂଲଗ୍ନ ଫଟୋଗ୍ରାଫିକ୍ ପ୍ରମାଣ",
    aiAudit: "ଏଆଇ ଯାଞ୍ଚ ଅଡିଟ୍",
    classificationConfidence: "ବର୍ଗୀକରଣ ଆତ୍ମବିଶ୍ୱାସ",
    assignedDept: "ଆବଣ୍ଟିତ ବିଭାଗ",
    autoLabels: "ସ୍ୱୟଂ ଚିହ୍ନଟ ଲେବଲ୍",
    aiReason: "ଏଆଇ ଯାଞ୍ଚ କାରଣ",
    assignedExecutive: "ନିୟୋଜିତ କ୍ଷେତ୍ର କାର୍ଯ୍ୟନିର୍ବାହୀ",
    ledgerHistory: "ଖତିୟାନ ଇତିହାସ ଏବଂ ସ୍ଥିତି ସମୟ ସୂଚକ",
    closeInspection: "ଅଡିਟ୍ ଯାଞ୍ಚ ବନ୍ଦ କରନ୍ତୁ",
    within5km: "୫ କିମି ମଧ୍ୟରେ",
    within10km: "୧୦ କିମି ମଧ୍ୟରେ",
    within15km: "୧୫ କିମି ମଧ୍ୟରେ",
    within25km: "୨୫ କିମି ମଧ୍ୟରେ",
    within50km: "୫୦ କିମି ମଧ୍ୟରେ",
    avgDispatch: "ହାରାହାରି ପ୍ରେରଣ:",
    slaTarget: "SLA ଲକ୍ଷ୍ୟ:"
  },
  Assamese: {
    indoreWarning: "ইন্দোৰ হটস্পট সতৰ্কবাণী:",
    searchPlaceholder: "সন্ধান কৰক GID, শিৰোনাম, ৱাৰ্ড...",
    syncing: "সংযোগ হৈ আছে...",
    inspectAudit: "অডিট পৰীক্ষা কৰক",
    activeConnection: "সক্ৰিয় ফীড সংযোগ: সুৰক্ষিত",
    showingRecords: "{total} টা ৰেকৰ্ডৰ ভিতৰত {filtered} টা দেখুওৱা হৈছে",
    filed: "দাখিল কৰা হৈছে:",
    reportedConcern: "প্ৰতিবেদন কৰা নাগৰিক চিন্তা",
    attachedEvidence: "সংলগ্ন ফটোগ্ৰাফী প্ৰমাণ",
    aiAudit: "এআই পৰীক্ষা অডিট",
    classificationConfidence: "শ্ৰেণীবিভাজন আত্মবিশ্বাস",
    assignedDept: "আৱন্টিত বিভাগ",
    autoLabels: "স্বয়ংক্ৰিয়ভাৱে ধৰা পেলোৱা লেবেল",
    aiReason: "এআই শ্ৰেণীবিভাজনৰ কাৰণ",
    assignedExecutive: "নিযুক্ত ক্ষেত্ৰ কাৰ্যবাহী",
    ledgerHistory: "খতিয়ান ইতিহাস আৰু স্থিতি সময়সূচী",
    closeInspection: "অডিট পৰীক্ষণ বন্ধ কৰক",
    within5km: "৫ কিমিৰ ভিতৰত",
    within10km: "১০ কিমিৰ ভিতৰত",
    within15km: "১৫ কিমিৰ ভিতৰত",
    within25km: "২৫ কিমিৰ ভিতৰত",
    within50km: "৫০ কিমিৰ ভিতৰত",
    avgDispatch: "গড় প্ৰেৰণ:",
    slaTarget: "SLA লক্ষ্য:"
  },
  Urdu: {
    indoreWarning: "اندور ہاٹ اسپاٹ انتباہ:",
    searchPlaceholder: "تلاش کریں GID، عنوان، وارڈ...",
    syncing: "سنک ہو رہا ہے...",
    inspectAudit: "آڈٹ چیک کریں",
    activeConnection: "فعال فیڈ کنکشن: محفوظ",
    showingRecords: "{total} ریکارڈ میں سے {filtered} دکھا رہا ہے",
    filed: "درج کیا گیا:",
    reportedConcern: "رپورٹ کردہ شہری تشویش",
    attachedEvidence: "منسلک تصویری ثبوت",
    aiAudit: "اے آئی تصدیق آڈٹ",
    classificationConfidence: "درجہ بندی کا اعتماد",
    assignedDept: "تفویض کردہ محکمہ",
    autoLabels: "خود بخود معلوم کردہ لیبلز",
    aiReason: "اے آئی چھانٹی کی وجہ",
    assignedExecutive: "تفویض کردہ فیلڈ ایگزیکٹو",
    ledgerHistory: "لیجر کی تاریخ اور اسٹیٹس ٹائم اسٹیمپ",
    closeInspection: "آڈٹ معائنہ بند کریں",
    within5km: "5 کلومیٹر کے اندر",
    within10km: "10 کلومیٹر کے اندر",
    within15km: "15 کلومیٹر کے اندر",
    within25km: "25 کلومیٹر کے اندر",
    within50km: "50 کلومیٹر کے اندر",
    avgDispatch: "اوسط بھیجنے کا وقت:",
    slaTarget: "SLA ہدف:"
  }
};

interface AnalyticsDashboardProps {
  selectedLanguage?: string;
}

export default function AnalyticsDashboard({ selectedLanguage = "English" }: AnalyticsDashboardProps) {
  const at = (key: string) => {
    const extraDict = EXTRA_ANALYTICS_TRANSLATIONS[selectedLanguage] || EXTRA_ANALYTICS_TRANSLATIONS.English;
    if (extraDict && extraDict[key]) return extraDict[key];
    const extraDictEn = EXTRA_ANALYTICS_TRANSLATIONS.English;
    if (extraDictEn && extraDictEn[key]) return extraDictEn[key];

    const dict = ANALYTICS_TRANSLATIONS[selectedLanguage] || ANALYTICS_TRANSLATIONS.English;
    return dict[key] || ANALYTICS_TRANSLATIONS.English[key] || key;
  };

  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  
  // Interactive filters for the real-time grid
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Live continuous GPS state variables
  const [gps, setGps] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>({
    latitude: 22.7533,
    longitude: 75.8937,
    accuracy: 15
  });
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(true);
  const [proximityFilter, setProximityFilter] = useState<"5km" | "10km" | "15km" | "25km" | "50km">("15km");
  const [sortByProximity, setSortByProximity] = useState(false);

  // Continuous background tracking of citizen position
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      setGpsLoading(false);
      return;
    }

    setGpsLoading(true);
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setGps({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setGpsError(null);
        setGpsLoading(false);
      },
      (error) => {
        console.error("Continuous GPS lookup failed:", error);
        setGpsError(error.message);
        setGpsLoading(false);
        // Fallback to primary Indore coordinates (Vijay Nagar) if sensor blocked/unauthorized
        setGps({ latitude: 22.7533, longitude: 75.8937, accuracy: 15 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2?: number, lon2?: number) => {
    if (lat2 === undefined || lon2 === undefined) return null;
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "AI Verification":
        return "bg-purple-50 text-purple-700 border-purple-200 animate-pulse";
      case "Verified":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "In Progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Closed":
        return "bg-slate-100 text-slate-700 border-slate-300";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "High":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Emergency":
        return "bg-rose-50 text-rose-700 border-rose-200 font-bold animate-pulse";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // Base list of complaints scoped specifically to the current location radius of the user
  const localComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (!gps) return true;
      const dist = calculateDistance(gps.latitude, gps.longitude, c.location?.latitude, c.location?.longitude);
      if (dist === null) return false;
      const limit = parseFloat(proximityFilter); // e.g., "15km" -> 15
      return dist <= limit;
    });
  }, [complaints, gps, proximityFilter]);

  // Derived Summary metrics scoped ONLY to the current user location
  const stats = useMemo<SummaryStats | null>(() => {
    const total = localComplaints.length;
    if (total === 0) {
      return {
        total: 0,
        verified: 0,
        inProgress: 0,
        resolved: 0,
        resolutionRate: 0,
        slaCompliance: 100,
      };
    }

    const verified = localComplaints.filter((c) => c.status === "Verified").length;
    const inProgress = localComplaints.filter((c) => c.status === "In Progress").length;
    const resolved = localComplaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length;
    
    let compliantCount = 0;
    localComplaints.forEach((c) => {
      const targetHours = c.severity === "Emergency" ? 12 : c.severity === "High" ? 36 : c.severity === "Medium" ? 72 : 120;
      const dateCreated = new Date(c.createdAt).getTime();
      
      if (c.status === "Resolved" || c.status === "Closed") {
        const dateUpdated = new Date(c.updatedAt).getTime();
        const elapsedHours = (dateUpdated - dateCreated) / (1000 * 60 * 60);
        if (elapsedHours <= targetHours) {
          compliantCount += 1;
        }
      } else {
        const elapsedHours = (new Date().getTime() - dateCreated) / (1000 * 60 * 60);
        if (elapsedHours <= targetHours || elapsedHours < 2) {
          compliantCount += 1;
        }
      }
    });

    const slaCompliance = Math.round((compliantCount / total) * 1000) / 10;
    const resolutionRate = Math.round((resolved / total) * 100);

    return {
      total,
      verified,
      inProgress,
      resolved,
      resolutionRate,
      slaCompliance,
    };
  }, [localComplaints]);

  // Derived Category counts scoped ONLY to the current user location
  const categoriesData = useMemo<any[]>(() => {
    const categoryCount: Record<string, number> = {};
    localComplaints.forEach((c) => {
      categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
    });
    return Object.keys(categoryCount).map((cat) => ({
      name: cat,
      value: categoryCount[cat],
    }));
  }, [localComplaints]);

  // Derived Demographics scoped ONLY to the current user location
  const areaData = useMemo<any[]>(() => {
    const areaCount: Record<string, number> = { urban: 0, rural: 0, "semi-urban": 0 };
    localComplaints.forEach((c) => {
      const at = c.areaType || "urban";
      areaCount[at] = (areaCount[at] || 0) + 1;
    });
    return Object.keys(areaCount)
      .filter((area) => areaCount[area] > 0 || area === "urban" || area === "rural")
      .map((area) => ({
        name: area.charAt(0).toUpperCase() + area.slice(1),
        value: areaCount[area],
      }));
  }, [localComplaints]);

  // Derived Severity levels scoped ONLY to the current user location
  const severityData = useMemo<any[]>(() => {
    const severityCount: Record<string, number> = { Low: 0, Medium: 0, High: 0, Emergency: 0 };
    localComplaints.forEach((c) => {
      if (c.severity in severityCount) {
        severityCount[c.severity] += 1;
      }
    });
    return Object.keys(severityCount).map((sev) => ({
      name: sev,
      value: severityCount[sev],
    }));
  }, [localComplaints]);

  // Derived SLA Resolution Speeds timeline scoped ONLY to the current user location
  const monthlySLA = useMemo<any[]>(() => {
    const scale = complaints.length > 0 ? localComplaints.length / complaints.length : 1;
    const monthlyStatsMap: Record<string, { reported: number; resolvedOnTime: number; delayed: number }> = {
      Feb: { reported: Math.round(15 * scale), resolvedOnTime: Math.round(14 * scale), delayed: Math.round(1 * scale) },
      Mar: { reported: Math.round(20 * scale), resolvedOnTime: Math.round(19 * scale), delayed: Math.round(1 * scale) },
      Apr: { reported: Math.round(18 * scale), resolvedOnTime: Math.round(17 * scale), delayed: Math.round(1 * scale) },
      May: { reported: Math.round(25 * scale), resolvedOnTime: Math.round(23 * scale), delayed: Math.round(2 * scale) },
      Jun: { reported: Math.round(30 * scale), resolvedOnTime: Math.round(28 * scale), delayed: Math.round(2 * scale) },
      Jul: { reported: 0, resolvedOnTime: 0, delayed: 0 }
    };

    localComplaints.forEach((c) => {
      const date = new Date(c.createdAt);
      const monthName = date.toLocaleString("en-US", { month: "short" });
      if (!monthlyStatsMap[monthName]) {
        monthlyStatsMap[monthName] = { reported: 0, resolvedOnTime: 0, delayed: 0 };
      }
      
      monthlyStatsMap[monthName].reported += 1;
      if (c.status === "Resolved" || c.status === "Closed") {
        monthlyStatsMap[monthName].resolvedOnTime += 1;
      } else {
        const targetHours = c.severity === "Emergency" ? 12 : c.severity === "High" ? 36 : c.severity === "Medium" ? 72 : 120;
        const hoursSinceCreation = (new Date("2026-07-17T02:55:00-07:00").getTime() - date.getTime()) / (1000 * 60 * 60);
        if (hoursSinceCreation > targetHours) {
          monthlyStatsMap[monthName].delayed += 1;
        } else {
          monthlyStatsMap[monthName].resolvedOnTime += 1;
        }
      }
    });

    return Object.keys(monthlyStatsMap).map((m) => ({
      month: m,
      reported: monthlyStatsMap[m].reported,
      resolvedOnTime: monthlyStatsMap[m].resolvedOnTime,
      delayed: monthlyStatsMap[m].delayed,
    }));
  }, [localComplaints]);

  // Filter the location-scoped list further based on standard text search, status filters and severity filters
  const filteredComplaints = useMemo(() => {
    return localComplaints.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.location?.address || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesSeverity = severityFilter === "all" || c.severity.toLowerCase() === severityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [localComplaints, searchTerm, statusFilter, severityFilter]);

  const displayedComplaints = useMemo(() => {
    const list = [...filteredComplaints];
    if (sortByProximity && gps) {
      list.sort((a, b) => {
        const distA = calculateDistance(gps.latitude, gps.longitude, a.location?.latitude, a.location?.longitude) ?? 999999;
        const distB = calculateDistance(gps.latitude, gps.longitude, b.location?.latitude, b.location?.longitude) ?? 999999;
        return distA - distB;
      });
    }
    return list;
  }, [filteredComplaints, sortByProximity, gps]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics/summary");
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error("Failed to load statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!stats) return;
    const rows = [
      ["Metric", "Value"],
      ["Total Grievances Logged", stats.total],
      ["AI Verified", stats.verified],
      ["In Progress Tasks", stats.inProgress],
      ["Successfully Resolved", stats.resolved],
      ["Resolution Success Rate (%)", `${stats.resolutionRate}%`],
      ["SLA Compliance Ratio (%)", `${stats.slaCompliance}%`],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BharatOS_Analytics_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        <p className="text-sm font-medium text-slate-500 font-mono">Aggregating district databases...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header Panel */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-emerald-700">
            <BarChart3 className="h-5 w-5" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">{at("intelNode")}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{t(selectedLanguage, "analytics")}</h2>
          <p className="text-sm text-slate-500">{at("intelDesc")}</p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 self-start rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all"
        >
          <Download className="h-4 w-4" />
          {at("exportLedger")}
        </button>
      </div>

      {/* Live GPS Telemetry Sync Sentinel */}
      <div className="mb-8 rounded-3xl border border-emerald-100 bg-emerald-50/20 p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              </span>
              <h3 className="text-base font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                <Locate className="h-5 w-5 text-emerald-600" />
                {at("gpsSync")}
              </h3>
              <span className="rounded-full bg-emerald-100/70 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 font-mono">
                {at("sensorStream")}
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl">
              {at("gpsDesc")}
            </p>
          </div>

          {/* Real-time telemetry coordinates HUD */}
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white border border-slate-100 p-4 shadow-sm md:grid-cols-3 shrink-0">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider block">{at("latitude")}</span>
              <p className="font-mono text-xs font-extrabold text-slate-800 tracking-tight">
                {gps ? gps.latitude.toFixed(6) : at("fetching")}
              </p>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider block">{at("longitude")}</span>
              <p className="font-mono text-xs font-extrabold text-slate-800 tracking-tight">
                {gps ? gps.longitude.toFixed(6) : at("fetching")}
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider block">{at("accuracyThreshold")}</span>
              <p className="font-mono text-[10px] font-bold text-emerald-600">
                {gps && gps.accuracy ? `± ${gps.accuracy.toFixed(1)}m (${at("high")})` : at("precise")}
              </p>
            </div>
          </div>
        </div>

        {/* Proximity Metrics Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 border-t border-slate-100 pt-6">
          {/* Proximity 1: Nearest open incident */}
          <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm flex items-start gap-3">
            <div className="rounded-xl bg-orange-50 p-2 text-orange-600 shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{at("nearestIncident")}</span>
              <p className="text-sm font-black text-slate-800">
                {(() => {
                  if (!gps || complaints.length === 0) return at("calculating");
                  const sorted = [...complaints]
                    .map((c) => ({
                      ...c,
                      dist: calculateDistance(gps.latitude, gps.longitude, c.location?.latitude, c.location?.longitude),
                    }))
                    .filter((c) => c.dist !== null)
                    .sort((a, b) => (a.dist ?? 999999) - (b.dist ?? 999999));
                  if (sorted.length === 0) return "N/A";
                  return `${sorted[0].dist!.toFixed(2)} km`;
                })()}
              </p>
              <p className="text-[9px] text-slate-400 font-medium">
                {(() => {
                  if (!gps || complaints.length === 0) return "";
                  const sorted = [...complaints]
                    .map((c) => ({
                      ...c,
                      dist: calculateDistance(gps.latitude, gps.longitude, c.location?.latitude, c.location?.longitude),
                    }))
                    .filter((c) => c.dist !== null)
                    .sort((a, b) => (a.dist ?? 999999) - (b.dist ?? 999999));
                  if (sorted.length === 0) return "";
                  return sorted[0].id;
                })()}
              </p>
            </div>
          </div>

          {/* Proximity 2: Incidents in 5km */}
          <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm flex items-start gap-3">
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{at("radius5km")}</span>
              <p className="text-sm font-black text-slate-800">
                {(() => {
                  if (!gps) return "0";
                  const count = complaints.filter((c) => {
                    const d = calculateDistance(gps.latitude, gps.longitude, c.location?.latitude, c.location?.longitude);
                    return d !== null && d <= 5;
                  }).length;
                  return `${count} ${at("activeIssues")}`;
                })()}
              </p>
              <p className="text-[9px] text-slate-400 font-medium">{at("localZone")}</p>
            </div>
          </div>

          {/* Proximity 3: Nearest Municipal hub */}
          <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm flex items-start gap-3">
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600 shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{at("dispatchHq")}</span>
              <p className="text-sm font-black text-slate-800">
                {(() => {
                  if (!gps) return "Indore HQ";
                  const d = calculateDistance(gps.latitude, gps.longitude, 22.7196, 75.8577);
                  return d ? `${d.toFixed(1)} km` : "Indore HQ";
                })()}
              </p>
              <p className="text-[9px] text-slate-400 font-medium">{at("indoreHq")}</p>
            </div>
          </div>

          {/* GPS Location Simulation Override Controls */}
          <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{at("simulateLocation")}</span>
            <div className="flex gap-1.5 mt-2">
              <button
                onClick={() => setGps({ latitude: 22.7533, longitude: 75.8937, accuracy: 5 })}
                className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[9px] font-bold font-mono transition-all text-center"
                title="Vijay Nagar Square"
              >
                {at("vijayNagar")}
              </button>
              <button
                onClick={() => setGps({ latitude: 22.6841, longitude: 75.7925, accuracy: 8 })}
                className="flex-1 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg text-[9px] font-bold font-mono transition-all text-center"
                title="Rangwasa Village Connect"
              >
                {at("rangwasa")}
              </button>
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((p) => {
                      setGps({ latitude: p.coords.latitude, longitude: p.coords.longitude, accuracy: p.coords.accuracy });
                    });
                  }
                }}
                className="py-1 px-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[9px] font-bold transition-all"
                title="Use physical device sensor"
              >
                📡 {at("hardware")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">{at("totalReports")}</span>
            <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{stats?.total}</p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span className="text-emerald-600 font-bold">+18% MoM</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">{at("inResolutionLoop")}</span>
            <div className="rounded-lg bg-sky-50 p-2 text-sky-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {stats ? stats.verified + stats.inProgress : 0}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>{at("avgDispatch")}</span>
            <span className="font-bold text-slate-700">12m</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">{at("successfullySolved")}</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{stats?.resolved}</p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Percent className="h-3 w-3 text-emerald-600" />
            <span className="text-emerald-600 font-bold">{stats?.resolutionRate}%</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">{at("slaAuditCompliance")}</span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{stats?.slaCompliance}%</p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>{at("slaTarget")}</span>
            <span className="font-bold text-slate-700">95.0%</span>
          </div>
        </div>
      </div>

      {/* Graphs Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Resolution SLA Timeline */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">{at("historicalTrendTitle")}</h3>
            <p className="text-xs text-slate-400">{at("historicalTrendDesc")}</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySLA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area
                  name={at("totalReports")}
                  type="monotone"
                  dataKey="reported"
                  stroke="#f97316"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorReported)"
                />
                <Area
                  name={at("successfullySolved")}
                  type="monotone"
                  dataKey="resolvedOnTime"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Demographics Split */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">{at("urbanRuralRatio")}</h3>
            <p className="text-xs text-slate-400">{at("demographicSplitDesc")}</p>
          </div>
          <div className="flex h-56 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={areaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {areaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-around border-t border-slate-50 pt-4 text-center">
            {areaData.map((item, idx) => (
              <div key={item.name}>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{t(selectedLanguage, item.name.toLowerCase()) || item.name}</span>
                <p className="text-base font-extrabold text-slate-800">{item.value} {at("activeIssues")}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Categorical Breakdown Bar Chart */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">{at("incidentsByCategory")}</h3>
            <p className="text-xs text-slate-400">{at("categoryVolumeDesc")}</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoriesData} layout="vertical" margin={{ top: 5, right: 10, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} width={120} tickLine={false} tickFormatter={(val) => t(selectedLanguage, val) || val} />
                <Tooltip formatter={(value, name, props) => [value, t(selectedLanguage, props.payload.name) || props.payload.name]} />
                <Bar name={at("totalReports")} dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {categoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Hot-Zone Indexes */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">{at("severityDistribution")}</h3>
            <p className="text-xs text-slate-400">{at("emergencyThreatDesc")}</p>
          </div>
          <div className="space-y-4">
            {severityData.map((item) => {
              const totalSum = severityData.reduce((acc, curr) => acc + curr.value, 0);
              const percentage = totalSum > 0 ? Math.round((item.value / totalSum) * 100) : 0;
              const barColor = SEVERITY_COLORS[item.name] || "#94a3b8";

              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{item.name}</span>
                    <span className="font-mono text-slate-400 font-semibold">{item.value} ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: barColor }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-xl bg-orange-50 border border-orange-100 p-4 text-xs text-orange-800">
            <div className="flex gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-orange-600 animate-pulse" />
              <div>
                <span className="font-bold">{at("indoreWarning")}</span>
                <p className="mt-1 text-[11px] leading-relaxed text-orange-700">
                  {at("potholesWarning")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Detailed Audit Ledger Table */}
      <div className="mt-10 rounded-3xl border border-slate-100 bg-white p-6 shadow-md">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              {at("ledgerTitle")}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {at("ledgerDesc")}
            </p>
          </div>

          {/* Interactive Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={at("searchPlaceholder")}
                className="rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-56 bg-slate-50/50"
              />
            </div>

            {/* Status dropdown */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
              <Filter className="h-3 w-3 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"
              >
                <option value="all">{at("allStatuses")}</option>
                <option value="Submitted">{t(selectedLanguage, "Submitted") || "Submitted"}</option>
                <option value="Verified">{t(selectedLanguage, "Verified") || "Verified"}</option>
                <option value="In Progress">{t(selectedLanguage, "In Progress") || "In Progress"}</option>
                <option value="Resolved">{t(selectedLanguage, "Resolved") || "Resolved"}</option>
                <option value="Closed">{t(selectedLanguage, "Closed") || "Closed"}</option>
              </select>
            </div>

            {/* Severity dropdown */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
              <ShieldAlert className="h-3 w-3 text-slate-400" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"
              >
                <option value="all">{at("allUrgency")}</option>
                <option value="Low">{t(selectedLanguage, "Low") || "Low"}</option>
                <option value="Medium">{t(selectedLanguage, "Medium") || "Medium"}</option>
                <option value="High">{t(selectedLanguage, "High") || "High"}</option>
                <option value="Emergency">{t(selectedLanguage, "Emergency") || "Emergency"}</option>
              </select>
            </div>

            {/* Proximity Filter dropdown */}
            <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 rounded-xl px-2 py-1">
              <MapPin className="h-3 w-3 text-emerald-600 animate-pulse" />
              <select
                value={proximityFilter}
                onChange={(e) => setProximityFilter(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-emerald-800 outline-none cursor-pointer pr-1"
              >
                <option value="5km">{at("within5km")}</option>
                <option value="10km">{at("within10km")}</option>
                <option value="15km">{at("within15km")}</option>
                <option value="25km">{at("within25km")}</option>
                <option value="50km">{at("within50km")}</option>
              </select>
            </div>

            {/* Sort by proximity */}
            <label className="flex items-center gap-1.5 cursor-pointer bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all select-none">
              <input
                type="checkbox"
                checked={sortByProximity}
                onChange={(e) => setSortByProximity(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 cursor-pointer"
              />
              <span>{at("nearMeFirst")}</span>
            </label>
          </div>
        </div>

        {/* Audit list of complaints */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium text-slate-500 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3 px-4">{at("grievanceId")}</th>
                <th className="py-3 px-4">{at("subjectSector")}</th>
                <th className="py-3 px-4">{at("demographics")}</th>
                <th className="py-3 px-4">{at("urgency")}</th>
                <th className="py-3 px-4">{at("proximity")}</th>
                <th className="py-3 px-4">{at("resolutionStatus")}</th>
                <th className="py-3 px-4 text-center">{at("auditActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                    {at("noIncidents")}
                  </td>
                </tr>
              ) : (
                displayedComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* GID */}
                    <td className="py-4 px-4 font-mono font-bold text-emerald-700">{c.id}</td>

                    {/* Subject */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-slate-800 text-xs line-clamp-1">{c.title}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                          {c.category}
                        </span>
                      </div>
                    </td>

                    {/* Demographics */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-slate-700 capitalize">{c.areaType}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{c.location?.wardOrVillage || c.location?.pincode}</p>
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getSeverityBadge(c.severity)}`}>
                        {t(selectedLanguage, c.severity) || c.severity}
                      </span>
                    </td>

                    {/* Proximity Column */}
                    <td className="py-4 px-4 font-mono text-slate-600">
                      {gps ? (
                        (() => {
                          const dist = calculateDistance(gps.latitude, gps.longitude, c.location?.latitude, c.location?.longitude);
                          if (dist === null) return <span className="text-slate-400">N/A</span>;
                          const walkingMinutes = Math.round(dist * 12);
                          return (
                            <div className="space-y-0.5">
                              <span className={`inline-flex items-center gap-1 text-[11px] font-black ${dist <= 5 ? "text-emerald-700" : "text-slate-600"}`}>
                                {dist.toFixed(1)} km
                              </span>
                              <p className="text-[9px] text-slate-400 font-medium">
                                🚶 ~{walkingMinutes} min
                              </p>
                            </div>
                          );
                        })()
                      ) : (
                        <span className="text-slate-400">
                          {at("syncing")}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(c.status)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${c.status === "In Progress" || c.status === "AI Verification" ? "bg-indigo-600 animate-pulse" : c.status === "Resolved" || c.status === "Closed" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                        {t(selectedLanguage, c.status) || c.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setSelectedComplaint(c)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm transition-all"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-400" />
                        {at("inspectAudit")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-50 pt-3">
          <span>
            {at("activeConnection")}
          </span>
          <span>
            {at("showingRecords")
              .replace("{filtered}", filteredComplaints.length.toString())
              .replace("{total}", complaints.length.toString())}
          </span>
        </div>
      </div>

      {/* Detailed Audit Inspection Backdrop Overlay */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="border-b border-slate-100 p-5 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-xl">
                  {selectedComplaint.id}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {at("filed")} {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="h-8 w-8 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 flex items-center justify-center transition-all shadow-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="grid gap-8 md:grid-cols-5">
                
                {/* Left Side: General Info, Description, Photo (3/5 cols) */}
                <div className="md:col-span-3 space-y-6">
                  <div>
                    <h4 className="text-base font-black text-slate-900">{selectedComplaint.title}</h4>
                    <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono">
                      {t(selectedLanguage, selectedComplaint.category) || selectedComplaint.category}
                    </span>
                  </div>

                  {/* Citizen's Reported Narrative */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      {at("reportedConcern")}
                    </span>
                    <p className="mt-2 text-xs leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">
                      {selectedComplaint.description}
                    </p>
                  </div>

                  {/* Real-time Evidence Photographic Attachment */}
                  {selectedComplaint.evidenceUrl && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-2">
                        {at("attachedEvidence")}
                      </span>
                      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-72 flex items-center justify-center">
                        <img
                          src={selectedComplaint.evidenceUrl}
                          alt="Citizen uploaded audit proof"
                          className="w-full object-cover max-h-72 hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: AI Audit & Officer routing details (2/5 cols) */}
                <div className="md:col-span-2 space-y-6 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6">
                  {/* AI verification intelligence card */}
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5">
                    <div className="flex items-center gap-1.5 text-indigo-800">
                      <BadgeCheck className="h-4.5 w-4.5 text-indigo-600" />
                      <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                        {at("aiAudit")}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3.5">
                      {/* confidence bar */}
                      {selectedComplaint.aiVerification?.confidence !== undefined && (
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-indigo-600/80 mb-1">
                            <span>
                              {at("classificationConfidence")}
                            </span>
                            <span>{Math.round(selectedComplaint.aiVerification.confidence * 100)}%</span>
                          </div>
                          <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
                              style={{ width: `${selectedComplaint.aiVerification.confidence * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* expected department */}
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono">
                          {at("assignedDept")}
                        </span>
                        <p className="text-xs font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                          {selectedComplaint.aiVerification?.expectedDepartment || selectedComplaint.assignedOfficer?.department || "Department Triage"}
                        </p>
                      </div>

                      {/* auto labels */}
                      {selectedComplaint.aiVerification?.labels && selectedComplaint.aiVerification.labels.length > 0 && (
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1.5">
                            {at("autoLabels")}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {selectedComplaint.aiVerification.labels.map((label: string, idx: number) => (
                              <span key={idx} className="bg-white border border-indigo-100 text-[9px] font-bold px-1.5 py-0.5 rounded text-indigo-600">
                                #{label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ai triage narrative reason */}
                      {selectedComplaint.aiVerification?.reason && (
                        <div className="border-t border-indigo-100/50 pt-2.5">
                          <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono">
                            {at("aiReason")}
                          </span>
                          <p className="text-[11px] leading-relaxed text-slate-600 mt-1 font-medium italic">
                            "{selectedComplaint.aiVerification.reason}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Officer assigned card */}
                  {selectedComplaint.assignedOfficer && (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <UserIcon className="h-4 w-4 text-slate-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
                          {at("assignedExecutive")}
                        </span>
                      </div>

                      <div className="mt-3.5 space-y-2 text-xs">
                        <div>
                          <p className="font-extrabold text-slate-800">{selectedComplaint.assignedOfficer.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium font-mono mt-0.5">{selectedComplaint.assignedOfficer.title}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium border-t border-slate-200/50 pt-2 mt-2">
                          <Phone className="h-3 w-3" />
                          <span>{selectedComplaint.assignedOfficer.phone}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Audit History Timeline */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-3">
                      {at("ledgerHistory")}
                    </span>
                    <div className="relative border-l-2 border-slate-100 pl-4 space-y-4 font-mono text-[11px]">
                      {selectedComplaint.statusHistory?.map((history: any, idx: number) => (
                        <div key={idx} className="relative">
                          {/* Circle indicator on line */}
                          <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border border-white bg-slate-300 ring-4 ring-slate-100"></span>
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-0.5">
                            <span>{history.updatedBy}</span>
                            <span>{new Date(history.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="font-bold text-slate-800">{t(selectedLanguage, history.status) || history.status}</p>
                          <p className="text-[10px] text-slate-500 font-sans mt-0.5 font-medium leading-relaxed">{history.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all"
              >
                {at("closeInspection")}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
