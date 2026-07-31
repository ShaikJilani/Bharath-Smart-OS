import React, { useState, useEffect } from "react";
import {
  Lock, Mail, User, Phone, Sparkles, Globe, Shield, CheckCircle2, AlertCircle, Building, Radio, BookOpen, Layers, Menu, X, ArrowRight, Database, Cpu, Wifi, Languages, LogOut, Compass, HelpCircle, Bot, BarChart3, Settings, AlertTriangle, Play, CheckSquare, LayoutDashboard, Plus, Award, Users, Check, Clock, Star, Zap, EyeOff, ShieldCheck, Loader2, Building2
} from "lucide-react";
import { Role, User as UserType, INDIAN_LANGUAGES } from "./types";
import { t } from "./data";
import Navigation from "./components/Navigation";
import CitizenDashboard from "./components/CitizenDashboard";
import OfficerDashboard from "./components/OfficerDashboard";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import HelpCenter from "./components/HelpCenter";
import AiAssistant from "./components/AiAssistant";
import { hasValidKey, GmpApiKeySplash } from "./components/GmpMap";
import CommandCenterDashboard from "./components/CommandCenterDashboard";
import ViksitBharatDashboard from "./components/ViksitBharatDashboard";
import LanguageSelector from "./components/LanguageSelector";
import { supabase } from "./lib/supabase";
import CitizenSupabaseAuth from "./components/CitizenSupabaseAuth";

const APP_LOCAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    booting: "BOOTING BHARAT SMART OS ENVIRONMENT...",
    registerAccount: "Register Public Account",
    bharatSmartOs: "Bharat Smart OS",
    viksitBharatGrievance: "Viksit Bharat 2047 Civil Grievance Node",
    demoShortcuts: "⚡ DEMO ROLE SHORTCUTS (1-CLICK SIGN IN)",
    citizenUser: "Citizen User",
    wardOfficer: "Ward Officer",
    platformAdmin: "Platform Admin",
    fullName: "Full Name",
    namePlaceholder: "e.g., Aarav Mehta",
    phoneNumber: "Phone Number",
    accountRole: "Sign-up Account Role",
    reportingCitizen: "Reporting Citizen",
    maintenanceOfficer: "Municipal Maintenance Officer",
    officialEmail: "Official Email Address",
    accessCode: "Access Code / Password",
    completeRegister: "Complete Register",
    secureAccess: "Secure Account Access",
    alreadyRegistered: "Already registered? Sign In",
    needCredentials: "Need citizen credentials? Register account",
    authenticating: "Authenticating...",
    adminNode: "Super Administrator Node",
    platformConfigs: "Platform Configurations",
    platformConfigsDesc: "Configure Service-Level Agreements, monitor system audits, and manage regional parameters.",
    roadSla: "Roads & Potholes SLA",
    hoursTarget: "Hours Target",
    lightsSla: "Streetlights Restoration SLA",
    waterSla: "Water Leaks Restoration SLA",
    activityLogs: "System Activity Logs",
    eventType: "Event Type",
    entityId: "Entity Id",
    triggeredBy: "Triggered By",
    status: "Status",
    timestamp: "Timestamp",
    evtLodged: "Complaint Lodged",
    evtAiClass: "AI Classification",
    evtOfficerEsc: "Officer Escalation",
    stProcessed: "Processed",
    stSuccess: "Success",
    stLogged: "Logged",
    footerCopyright: "© 2026 National Informatics Centre (NIC) & Ministry of Urban and Rural Affairs. Under Viksit Bharat Mission.",
    footerSecNode: "BHARAT OS CORE GRID SECURITY NODE v1.0.4 - POWERED BY GEMINI 3.5 FLASH"
  },
  Hindi: {
    booting: "भारत स्मार्ट ओएस वातावरण बूट हो रहा है...",
    registerAccount: "सार्वजनिक खाता पंजीकृत करें",
    bharatSmartOs: "भारत स्मार्ट ओएस",
    viksitBharatGrievance: "विकसित भारत 2047 नागरिक शिकायत नोड",
    demoShortcuts: "⚡ डेमो भूमिका शॉर्टकट (1-क्लिक साइन इन)",
    citizenUser: "नागरिक उपयोगकर्ता",
    wardOfficer: "वार्ड अधिकारी",
    platformAdmin: "प्लेटफ़ॉर्म एडमिन",
    fullName: "पूरा नाम",
    namePlaceholder: "जैसे, आरव मेहता",
    phoneNumber: "फ़ोन नंबर",
    accountRole: "साइन-अप खाता भूमिका",
    reportingCitizen: "शिकायतकर्ता नागरिक",
    maintenanceOfficer: "नगर निगम रखरखाव अधिकारी",
    officialEmail: "आधिकारिक ईमेल पता",
    accessCode: "एक्सेस कोड / पासवर्ड",
    completeRegister: "पंजीकरण पूरा करें",
    secureAccess: "सुरक्षित खाता पहुंच",
    alreadyRegistered: "पहले से पंजीकृत हैं? साइन इन करें",
    needCredentials: "नागरिक क्रेडेंशियल चाहिए? खाता पंजीकृत करें",
    authenticating: "प्रमाणित किया जा रहा है...",
    adminNode: "सुपर प्रशासक नोड",
    platformConfigs: "प्लेटफ़ॉर्म कॉन्फ़िगरेशन",
    platformConfigsDesc: "सेवा-स्तर समझौतों को कॉन्फ़िगर करें, सिस्टम ऑडिट की निगरानी करें और क्षेत्रीय मापदंडों का प्रबंधन करें।",
    roadSla: "सड़क और गड्ढे एसएलए",
    hoursTarget: "घंटे का लक्ष्य",
    lightsSla: "स्ट्रीटलाइट बहाली एसएलए",
    waterSla: "पानी रिसाव बहाली एसएलए",
    activityLogs: "सिस्टम गतिविधि लॉग",
    eventType: "इवेंट प्रकार",
    entityId: "एंटिटी आईडी",
    triggeredBy: "द्वारा ट्रिगर",
    status: "स्थिति",
    timestamp: "समय-चिह्न",
    evtLodged: "शिकायत दर्ज की गई",
    evtAiClass: "एआई वर्गीकरण",
    evtOfficerEsc: "अधिकारी एस्केलेशन",
    stProcessed: "संसाधित",
    stSuccess: "सफलता",
    stLogged: "लॉग किया गया",
    footerCopyright: "© 2026 राष्ट्रीय सूचना विज्ञान केंद्र (एनआईसी) और शहरी एवं ग्रामीण कार्य मंत्रालय। विकसित भारत मिशन के तहत।",
    footerSecNode: "भारत ओएस कोर ग्रिड सुरक्षा नोड v1.0.4 - जेमिनी 3.5 फ्लैश द्वारा संचालित"
  },
  Telugu: {
    booting: "భారత్ స్మార్ట్ ఓఎస్ బూట్ అవుతోంది...",
    registerAccount: "పబ్లిక్ ఖాతాను నమోదు చేయండి",
    bharatSmartOs: "భారత్ స్మార్ట్ ఓఎస్",
    viksitBharatGrievance: "వికసిత్ భారత్ 2047 పౌర ఫిర్యాదుల నోడ్",
    demoShortcuts: "⚡ డెమో రోల్ షార్ట్‌కట్‌లు (1-క్లిక్ సైన్ ఇన్)",
    citizenUser: "పౌర వినియోగదారు",
    wardOfficer: "వార్డు అధికారి",
    platformAdmin: "પ્લાટોફોર્મ અડમિન",
    fullName: "పూర్తి పేరు",
    namePlaceholder: "ఉదా., ఆరవ్ మెహతా",
    phoneNumber: "ఫోన్ నంబర్",
    accountRole: "ఖాతా పాత్ర",
    reportingCitizen: "ఫిర్యాదు చేసే పౌరుడు",
    maintenanceOfficer: "మునిసిపల్ నిర్వహణ అధికారి",
    officialEmail: "అధికారిక ఈమెయిల్ చిరునామా",
    accessCode: "యాక్సెస్ కోడ్ / పాస్‌వర్డ్",
    completeRegister: "నమోదును పూర్తి చేయండి",
    secureAccess: "సురక్షిత ఖాతా యాక్సెస్",
    alreadyRegistered: "ఇప్పటికే నమోదై ఉందా? సైన్ ఇన్ చేయండి",
    needCredentials: "పౌర ఆధారాలు కావాలా? ఖాతాను నమోదు చేయండి",
    authenticating: "ధృవీకరిస్తోంది...",
    adminNode: "సూపర్ అడ్మినిస్ట్రేటర్ నోడ్",
    platformConfigs: "ప్లాట్‌ఫారమ్ కాన్ఫిగరేషన్‌లు",
    platformConfigsDesc: "సేవా-స్థాయి ఒప్పందాలను కాన్ఫిగర్ చేయండి, సిస్టమ్ ఆడిట్‌లను పర్యవేక్షించండి మరియు ప్రాంతీయ పారామితులను నిర్వహించండి.",
    roadSla: "రోడ్లు & గుంతల SLA",
    hoursTarget: "గంటల లక్ష్యం",
    lightsSla: "వీధి దీపాల పునరుద్ధరణ SLA",
    waterSla: "నీటి లీకేజీల పునరుద్ధరణ SLA",
    activityLogs: "సిస్టమ్ కార్యాచరణ లాగ్‌లు",
    eventType: "ఈవెంట్ రకం",
    entityId: "ఎంటిటీ ఐడి",
    triggeredBy: "ప్రేరేపించినది",
    status: "స్థితి",
    timestamp: "సమయము",
    evtLodged: "ఫిర్యాదు దాఖలైంది",
    evtAiClass: "ఏఐ వర్గీకరణ",
    evtOfficerEsc: "అధికారికి బదిలీ",
    stProcessed: "ప్రక్రియ పూర్తయింది",
    stSuccess: "విజయం",
    stLogged: "నమోదైంది",
    footerCopyright: "© 2026 నేషనల్ ఇన్ఫర్మేటిక్స్ సెంటర్ (NIC) & పట్టణ మరియు గ్రాમીణ వ్యవహారాల మంత్రిత్వ శాఖ. వికసిత్ భారత్ మిషన్ కింద.",
    footerSecNode: "భారత్ ఓఎస్ కోర్ గ్రిడ్ సెక్యూరిటీ నోడ్ v1.0.4 - జెమిని 3.5 ఫ్లాష్ ద్వారా శక్తిని పొందింది"
  },
  Tamil: {
    booting: "பாரத் ஸ்மார்ட் ஓএস சூழல் துவக்கப்படுகிறது...",
    registerAccount: "பொதுக் கணக்கை பதிவு செய்யவும்",
    bharatSmartOs: "பாரத் ஸ்மார்ட் ஓஎஸ்",
    viksitBharatGrievance: "விகசித் பாரத் 2047 குடிமை குறைதீர்க்கும் முனை",
    demoShortcuts: "⚡ டெமோ பங்கு குறுக்குவழிகள் (1-கிளிக் உள்நுழைவு)",
    citizenUser: "குடிமகன் பயனர்",
    wardOfficer: "வார்டு அதிகாரி",
    platformAdmin: "தள நிர்வாகி",
    fullName: "முழு பெயர்",
    namePlaceholder: "எ.கா., ஆரவ் மேத்தா",
    phoneNumber: "தொலைபேசி எண்",
    accountRole: "கணக்கு பங்கு",
    reportingCitizen: "புகாரளிக்கும் குடிமகன்",
    maintenanceOfficer: "நகராட்சி பராமரிப்பு அதிகாரி",
    officialEmail: "அதிகாரப்பூர்வ மின்னஞ்சல் முகவரி",
    accessCode: "அணுகல் குறியீடு / கடவுச்சொல்",
    completeRegister: "பதிவை முடிக்கவும்",
    secureAccess: "பாதுகாப்பான கணக்கு அணுகல்",
    alreadyRegistered: "ஏற்கனவே பதிவு செய்துள்ளீர்களா? உள்நுழைக",
    needCredentials: "குடிமகன் சான்றுகள் தேவையா? கணக்கை பதிவு செய்யவும்",
    authenticating: "அடையாளம் காணப்படுகிறது...",
    adminNode: "சூப்பர் நிர்வாகி முனை",
    platformConfigs: "தள உள்ளமைவுகள்",
    platformConfigsDesc: "சேவை-நிலை ஒப்பந்தங்களை உள்ளமைக்கவும், கணினி தணிக்கைகளைக் கண்காணிக்கவும் மற்றும் பிராந்திய அளவுருக்களை நிர்வகிக்கவும்.",
    roadSla: "சாலைகள் மற்றும் குழிகள் SLA",
    hoursTarget: "மணிநேர இலக்கு",
    lightsSla: "தெருவிளக்குகள் மறுசீரமைப்பு SLA",
    waterSla: "நீர் கசிவு மறுசீரமைப்பு SLA",
    activityLogs: "கணினி செயல்பாட்டு பதிவுகள்",
    eventType: "நிகழ்வு வகை",
    entityId: "அடையாள எண்",
    triggeredBy: "தூண்டியது",
    status: "நிலை",
    timestamp: "நேரமுத்திரை",
    evtLodged: "புகார் பதிவு செய்யப்பட்டது",
    evtAiClass: "ஏআই வகைப்பாடு",
    evtOfficerEsc: "அதிகாரி தரமுயர்வு",
    stProcessed: "செயலாக்கப்பட்டது",
    stSuccess: "வெற்றி",
    stLogged: "பதிவு செய்யப்பட்டது",
    footerCopyright: "© 2026 தேசிய தகவல் மையம் (NIC) & நகர்ப்புற மற்றும் ஊரக விவகாரங்கள் அமைச்சகம். விகசித் பாரத் திட்டத்தின் கீழ்.",
    footerSecNode: "பாரத் ஓஎஸ் கோர் கிரிட் பாதுகாப்பு முனை v1.0.4 - ஜெமினி 3.5 பிளாஷ் மூலம் இயக்கப்படுகிறது"
  },
  Kannada: {
    booting: "ಭಾರತ್ ಸ್ಮಾರ್ಟ್ ಓಎಸ್ ಪರಿಸರ ಬೂಟ್ ಆಗುತ್ತಿದೆ...",
    registerAccount: "ಸಾರ್ವಜನಿಕ ಖಾತೆ ನೋಂದಾಯಿಸಿ",
    bharatSmartOs: "ಭಾರತ್ ಸ್ಮಾರ್ಟ್ ಓಎಸ್",
    viksitBharatGrievance: "ವಿಕಸಿತ ಭಾರತ 2047 ನಾಗರಿಕ ಕುಂದುಕೊರತೆ ನೋಡ್",
    demoShortcuts: "⚡ ಡೆಮೊ ಪಾತ್ರ ಶಾರ್ಟ್‌ಕಟ್‌ಗಳು (1-ಕ್ಲಿಕ್ ಸೈನ್ ಇನ್)",
    citizenUser: "ನಾಗರಿಕ ಬಳಕೆದಾರ",
    wardOfficer: "ವಾರ್ಡ್ ಅಧಿಕಾರಿ",
    platformAdmin: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಅಡ್ಮಿನ್",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    namePlaceholder: "ಉದಾ., ಆರವ್ ಮೆಹತಾ",
    phoneNumber: "ಫೋನ್ ಸಂಖ್ಯೆ",
    accountRole: "ಖಾತೆಯ ಪಾತ್ರ",
    reportingCitizen: "ವರದಿ ಮಾಡುವ ನಾಗರಿಕ",
    maintenanceOfficer: "ನಗರಸಭೆ ನಿರ್ವಹಣಾ ಅಧಿಕಾರಿ",
    officialEmail: "ಅಧಿಕೃತ ಇಮೇಲ್ ವಿಳಾಸ",
    accessCode: "ಪ್ರವೇಶ ಕೋಡ್ / ಪಾಸ್‌ವರ್ಡ್",
    completeRegister: "ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ",
    secureAccess: "ಸುರಕ್ಷಿತ ಖಾತೆ ಪ್ರವೇಶ",
    alreadyRegistered: "ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲಾಗಿದೆಯೇ? ಸೈನ್ ಇನ್ ಮಾಡಿ",
    needCredentials: "ನಾಗರಿಕ ರುಜುವಾತುಗಳು ಬೇಕೇ? ಖಾತೆಯನ್ನು ನೋಂದಾಯಿಸಿ",
    authenticating: "ದೃಢೀಕರಿಸಲಾಗುತ್ತಿದೆ...",
    adminNode: "ಸೂಪರ್ ಅಡ್ಮಿನಿಸ್ಟ್ರೇಟರ್ ನೋಡ್",
    platformConfigs: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಕಾನ್ಫಿಗರೇಶನ್‌ಗಳು",
    platformConfigsDesc: "ಸೇವಾ-ಮಟ್ಟದ ಒಪ್ಪಂದಗಳನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ, ಸিস্টಮ್ ಆಡಿಟ್‌ಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ನಿಯತಾಂಕಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
    roadSla: "ರಸ್ತೆಗಳು ಮತ್ತು ಗುಂಡಿಗಳು SLA",
    hoursTarget: "ಗಂಟೆಗಳ ಗುರಿ",
    lightsSla: "ಬೀದಿ ದೀಪಗಳ ಮರುಸ್ಥಾಪನೆ SLA",
    waterSla: "ನೀರಿನ ಸೋರಿಕೆ ಮರುಸ್ಥಾಪನೆ SLA",
    activityLogs: "ಸಿಸ್ಟಮ್ ಚಟುವಟಿಕೆ ದಾಖಲೆಗಳು",
    eventType: "ಈವೆಂಟ್ ಪ್ರಕಾರ",
    entityId: "ಎಂಟಿಟಿ ಐಡಿ",
    triggeredBy: "ಪ್ರಚೋದಿಸಿದವರು",
    status: "ಸ್ಥಿತಿ",
    timestamp: "ಸಮಯದ ಮುದ್ರೆ",
    evtLodged: "ದೂರು ದಾಖಲಿಸಲಾಗಿದೆ",
    evtAiClass: "ಎಐ ವರ್ಗೀಕರಣ",
    evtOfficerEsc: "ಅಧಿಕಾರಿಗೆ ವರ್ಗಾವಣೆ",
    stProcessed: "ಸಂಸ್ಕರಿಸಲಾಗಿದೆ",
    stSuccess: "ಯಶಸ್ಸು",
    stLogged: "ದಾಖಲಿಸಲಾಗಿದೆ",
    footerCopyright: "© 2026 ರಾಷ್ಟ್ರೀಯ ಮಾಹಿತಿ ಕೇಂದ್ರ (NIC) ಮತ್ತು ನಗರಾಭಿವೃದ್ಧಿ ಮತ್ತು ಗ್ರಾಮೀಣ ವ್ಯವಹಾರಗಳ ಸಚಿವಾಲಯ. ವಿಕಸಿತ ಭಾರತ ಮಿಷನ್ ಅಡಿಯಲ್ಲಿ.",
    footerSecNode: "ಭารತ್ ಓಎಸ್ ಕೋರ್ ಗ್ರಿಡ್ ಸೆಕ್ಯುರಿಟಿ ನೋಡ್ v1.0.4 - ಜಿಮಿನಿ 3.5 ಫ್ಲ್ಯಾಶ್‌ನಿಂದ ಚಾಲಿತವಾಗಿದೆ"
  },
  Malayalam: {
    booting: "ഭാരത് സ്മാർട്ട് ഒഎസ് ബൂട്ട് ചെയ്യുന്നു...",
    registerAccount: "പൊതു അക്കൗണ്ട് രജിസ്റ്റർ ചെയ്യുക",
    bharatSmartOs: "ഭാരത് സ്മാർട്ട് ഒഎസ്",
    viksitBharatGrievance: "വികസിത് ഭാരത് 2047 പൗര പരാതി നോഡ്",
    demoShortcuts: "⚡ ഡെമോ റോൾ കുറുക്കുവഴികൾ (1-ക്ലിക്ക് സൈൻ ഇൻ)",
    citizenUser: "പൗരൻ ഉപയോക്താവ്",
    wardOfficer: "വാർഡ് ഓഫീസർ",
    platformAdmin: "പ്ലാറ്റ്ഫോം അഡ്മിൻ",
    fullName: "പൂർണ്ണമായ പേര്",
    namePlaceholder: "ഉദാഹരണത്തിന്, ആരവ് മേത്ത",
    phoneNumber: "ഫോൺ നമ്പർ",
    accountRole: "അക്കൗണ്ട് റോൾ",
    reportingCitizen: "പരാതി നൽകുന്ന പൗരൻ",
    maintenanceOfficer: "മുനിസിപ്പൽ മെയിന്റനൻസ് ഓഫീസർ",
    officialEmail: "ഔദ്യോഗിക ഇമെയിൽ വിലാസം",
    accessCode: "ആക്സസ് കോഡ് / പാസ്വേഡ്",
    completeRegister: "രജിസ്ട്രേഷൻ പൂർത്തിയാക്കുക",
    secureAccess: "സുരക്ഷിത അക്കൗണ്ട് ആക്സസ്",
    alreadyRegistered: "രജിസ്റ്റർ ചെയ്തതാണോ? സൈൻ ഇൻ ചെയ്യുക",
    needCredentials: "പൗരൻ ക്രെഡൻഷ്യലുകൾ വേണോ? രജിസ്റ്റർ ചെയ്യുക",
    authenticating: "പരിശോധിക്കുന്നു...",
    adminNode: "സൂപ്പർ അഡ്മിനിസ്ട്രേറ്റർ നോഡ്",
    platformConfigs: "പ്ലാറ്റ്ഫോം കോൺഫിഗറേഷനുകൾ",
    platformConfigsDesc: "സർവീസ് ലെവൽ കരാറുകൾ കോൺഫിഗർ ചെയ്യുക, സിസ്റ്റം ഓഡിറ്റുകൾ നിരീക്ഷിക്കുക, പ്രാദേശിക പരാമീറ്ററുകൾ നിയന്ത്രിക്കുക.",
    roadSla: "റോഡുകളും കുഴികളും SLA",
    hoursTarget: "മണിക്കൂർ ലക്ഷ്യം",
    lightsSla: "സ്ട്രീറ്റ് ലൈറ്റ് പുനഃസ്ഥാപനം SLA",
    waterSla: "ജലചോർച്ച പുനഃസ്ഥാപനം SLA",
    activityLogs: "സിസ്റ്റം പ്രവർത്തന രേഖകൾ",
    eventType: "ഇവന്റ് തരം",
    entityId: "എന്റിറ്റി ഐഡി",
    triggeredBy: "പ്രവർത്തിപ്പിച്ചത്",
    status: "നില",
    timestamp: "സമയം",
    evtLodged: "പരാതി നൽകി",
    evtAiClass: "എഐ വർഗ്ഗീകരണം",
    evtOfficerEsc: "ഓഫീസർ എസ്‌കലേഷൻ",
    stProcessed: "പ്രോസസ്സ് ചെയ്തു",
    stSuccess: "വിജയം",
    stLogged: "രേഖപ്പെടുത്തി",
    footerCopyright: "© 2026 നാഷണൽ ഇൻഫോർമാറ്റിക്സ് സെന്റർ (NIC) & നഗര-ഗ്രാമകാര്യ മന്ത്രാലയം. വികസിത് ഭാരത് മിഷന്റെ കീഴിൽ.",
    footerSecNode: "ഭാരത് ഒഎസ് കോർ ഗ്രിഡ് സെക്യൂരിറ്റി നോഡ് v1.0.4 - ജെമിനി 3.5 ഫ്ലാഷ് കരുത്തിൽ പ്രവർത്തിക്കുന്നു"
  },
  Marathi: {
    booting: "भारत स्मार्ट ओएस वातावरण बूट होत आहे...",
    registerAccount: "सार्वजनिक खाते नोंदणी करा",
    bharatSmartOs: "भारत स्मार्ट ओएस",
    viksitBharatGrievance: "विकसित भारत 2047 नागरिक तक्रार नोड",
    demoShortcuts: "⚡ डेमो भूमिका शॉर्टकट (1-क्लिक साइन इन)",
    citizenUser: "नागरिक वापरकर्ता",
    wardOfficer: "वॉर्ड अधिकारी",
    platformAdmin: "प्लेटफॉर्म प्रशासक",
    fullName: "पूर्ण नाव",
    namePlaceholder: "उदा., आरव मेहता",
    phoneNumber: "फोन नंबर",
    accountRole: "खाते भूमिका",
    reportingCitizen: "तक्रारदार नागरिक",
    maintenanceOfficer: "महानगरपालिका देखभाल अधिकारी",
    officialEmail: "अधिकृत ईमेल पत्ता",
    accessCode: "प्रवेश कोड / पासवर्ड",
    completeRegister: "नोंदणी पूर्ण करा",
    secureAccess: "सुरक्षित खाते प्रवेश",
    alreadyRegistered: "आधीच नोंदणीकृत आहे? साइन इन करा",
    needCredentials: "नागरिक क्रेडेंशियल हवे आहेत? खाते नोंदणी करा",
    authenticating: "प्रमाणित करत आहे...",
    adminNode: "सुपर प्रशासक नोड",
    platformConfigs: "प्लॅटफॉर्म कॉन्फिगरेशन",
    platformConfigsDesc: "सेवा-स्तर करार कॉन्फिगर करा, सिस्टम ऑडिटचे निरीक्षण करा आणि प्रादेशिक पॅरामीटर्स व्यवस्थापित करा.",
    roadSla: "रस्ते आणि खड्डे SLA",
    hoursTarget: "तासांचे लक्ष्य",
    lightsSla: "स्ट्रीटलाइट पुनर्संचयन SLA",
    waterSla: "पाणी गळती पुनर्संचयन SLA",
    activityLogs: "सिस्टम क्रियाकलाप लॉग",
    eventType: "इव्हेंट प्रकार",
    entityId: "एंटिटी आयडी",
    triggeredBy: "द्वारे ट्रिगर",
    status: "स्थिती",
    timestamp: "टाइमस्टॅम्प",
    evtLodged: "तक्रार दाखल केली",
    evtAiClass: "एआय वर्गीकरण",
    evtOfficerEsc: "अधिकारी वाढ",
    stProcessed: "प्रक्रिया केली",
    stSuccess: "यश",
    stLogged: "नोंदणीकृत",
    footerCopyright: "© 2026 राष्ट्रीय सूचना विज्ञान केंद्र (NIC) आणि शहरी व ग्रामीण व्यवहार मंत्रालय. विकसित भारत मिशन अंतर्गत.",
    footerSecNode: "भारत ओएस कोअर ग्रिड सुरक्षा नोड v1.0.4 - जेमिनी 3.5 फ्लॅशद्वारे समर्थित"
  },
  Bengali: {
    booting: "ভারত স্মার্ট ওএস পরিবেশ বুট হচ্ছে...",
    registerAccount: "পাবলিক অ্যাকাউন্ট নিবন্ধন করুন",
    bharatSmartOs: "ভারত স্মার্ট ওএস",
    viksitBharatGrievance: "বিকশিত ভারত ২০৪৭ নাগরিক অভিযোগ নোড",
    demoShortcuts: "⚡ ডেমো রোল শর্টকাট (১-ক্লিক সাইন ইন)",
    citizenUser: "নাগরিক ব্যবহারকারী",
    wardOfficer: "ওয়ার্ড কর্মকর্তা",
    platformAdmin: "প্ল্যাটফর্ম অ্যাডমিন",
    fullName: "সম্পূর্ণ নাম",
    namePlaceholder: "যেমন, আরভ মেহতা",
    phoneNumber: "ফোন নম্বর",
    accountRole: "অ্যাকাউন্ট ভূমিকা",
    reportingCitizen: "অভিযোগকারী নাগরিক",
    maintenanceOfficer: "পৌরসভা রক্ষণাবেক্ষণ কর্মকর্তা",
    officialEmail: "অফিসিয়াল ইমেল ঠিকানা",
    accessCode: "অ্যাক্সেস কোড / পাসওয়ার্ড",
    completeRegister: "নিবন্ধন সম্পন্ন করুন",
    secureAccess: "সুরক্ষিত অ্যাকাউন্ট অ্যাক্সেস",
    alreadyRegistered: "ইতিমধ্যেই নিবন্ধিত? সাইন ইন করুন",
    needCredentials: "নাগরিক শংসাপত্র প্রয়োজন? অ্যাকাউন্ট নিবন্ধন করুন",
    authenticating: "প্রমাণীকরণ করা হচ্ছে...",
    adminNode: "সুপার প্রশাসক নোড",
    platformConfigs: "প্ল্যাটফর্ম কনফিগারেশন",
    platformConfigsDesc: "পরিষেবা-স্তরের চুক্তি কনফিগার করুন, সিস্টেম অডিট নিরীক্ষণ করুন এবং আঞ্চলিক পরামিতিগুলি পরিচালনা করুন।",
    roadSla: "রাস্তা ও গর্ত SLA",
    hoursTarget: "ঘণ্টার লক্ষ্য",
    lightsSla: "রাস্তার আলো পুনরুদ্ধার SLA",
    waterSla: "জল ফুটো পুনরুদ্ধার SLA",
    activityLogs: "সিস্টেম কার্যকলাপ লগ",
    eventType: "ইভেন্ট টাইপ",
    entityId: "এন্টিটি আইডি",
    triggeredBy: "ট্রিগার করেছেন",
    status: "স্থিতি",
    timestamp: "সময়সূচী",
    evtLodged: "অভিযোগ দায়ের করা হয়েছে",
    evtAiClass: "এআই শ্রেণীবিভাগ",
    evtOfficerEsc: "অফিসার এসকেলেশন",
    stProcessed: "প্রক্রিয়াজাত",
    stSuccess: "সফল",
    stLogged: "লগ করা হয়েছে",
    footerCopyright: "© 2026 ন্যাশনাল ইনফরমেটিক্স সেন্টার (NIC) এবং নগর ও গ্রামীণ বিষয়ক মন্ত্রণালয়। বিকশিত ভারত মিশনের অধীনে।",
    footerSecNode: "ভারত ওএস কোর গ্রিড সিকিউরিটি নোড v1.0.4 - জেমিনি ৩.৫ ফ্ল্যাশ দ্বারা চালিত"
  },
  Gujarati: {
    booting: "ભારત સ્માર્ટ ઓએસ બૂટ થઈ રહ્યું છે...",
    registerAccount: "જાહેર ખાતું રજીસ્ટર કરો",
    bharatSmartOs: "ભારત સ્માર્ટ ઓએસ",
    viksitBharatGrievance: "વિકસિત ભારત 2047 નાગરિક ફરિયાદ નોડ",
    demoShortcuts: "⚡ ડેમો ભૂમિકા શોર્ટકટ (1-ક્લિક સાઇન ઇન)",
    citizenUser: "નાગરિક વપરાશકર્તા",
    wardOfficer: "વોર્ડ અધિકારી",
    platformAdmin: "પ્લેટફોર્મ એડમિન",
    fullName: "પૂરું નામ",
    namePlaceholder: "જેમ કે, આરવ મહેતા",
    phoneNumber: "ફોન નંબર",
    accountRole: "ખાતાની ભૂમિકા",
    reportingCitizen: "ફરિયાદી નાગરિક",
    maintenanceOfficer: "મ્યુનિસિપલ જાળવણી અધિકારી",
    officialEmail: "સત્તાવાર ઇમેઇલ સરનામું",
    accessCode: "એક્સેસ કોડ / પાસવર્ડ",
    completeRegister: "નોંધણી પૂર્ણ કરો",
    secureAccess: "સુરક્ષિત ખાતાની ઍક્સેસ",
    alreadyRegistered: "પહેલેથી જ નોંધાયેલ છે? સાઇન ઇન કરો",
    needCredentials: "નાગરિક ઓળખપત્રોની જરૂર છે? ખાતું રજીસ્ટર કરો",
    authenticating: "પ્રમાણિત થઈ રહ્યું છે...",
    adminNode: "સુપર એડમિનિસ્ટ્રેટર નોડ",
    platformConfigs: "પ્લેટફોર્મ કન્ફિગરેશન્સ",
    platformConfigsDesc: "સેવા-સ્તરના કરારો ગોઠવો, સિસ્ટમ ઓડિટ પર નજર રાખો અને પ્રાદેશિક પરિમાણોનું સંચાલન કરો.",
    roadSla: "રસ્તા અને ખાડા SLA",
    hoursTarget: "કલાકનો લક્ષ્યાંક",
    lightsSla: "સ્ટ્રીટલાઇટ પુનઃસ્થાપન SLA",
    waterSla: "પાણીના લીકેજ પુનઃસ્થાપન SLA",
    activityLogs: "સિસ્ટમ પ્રવૃત્તિ લૉગ્સ",
    eventType: "ઇવેન્ટ પ્રકાર",
    entityId: "એન્ટિટી આઈડી",
    triggeredBy: "દ્વારા ટ્રિગર",
    status: "સ્થિતિ",
    timestamp: "સમય સ્ટેમ્પ",
    evtLodged: "ફરિયાદ દાખલ કરવામાં આવી",
    evtAiClass: "એઆઈ વર્ગીકરણ",
    evtOfficerEsc: "અધિકારી એસ્કેલેશન",
    stProcessed: "પ્રક્રિયા કરેલ",
    stSuccess: "સફળતા",
    stLogged: "નોંધાયેલ",
    footerCopyright: "© 2026 નેશનલ ઇન્ફોર્મેટિક્સ સેન્ટર (NIC) અને શહેરી તથા ગ્રામીણ બાબતોનું મંત્રાલય. વિકસિત ભારત મિશન હેઠળ.",
    footerSecNode: "ભારત ઓએસ કોર ગ્રીડ સિક્યોરિટી નોડ v1.0.4 - જેમિની 3.5 ફ્લેશ દ્વારા સંચાલિત"
  },
  Punjabi: {
    booting: "ਭਾਰਤ ਸਮਾਰਟ ਓਐਸ ਵਾਤਾਵਰਣ ਬੂਟ ਹੋ ਰਿਹਾ ਹੈ...",
    registerAccount: "ਜਨਤਕ ਖਾਤਾ ਰਜਿਸਟਰ ਕਰੋ",
    bharatSmartOs: "ਭਾਰਤ ਸਮਾਰਟ ਓਐਸ",
    viksitBharatGrievance: "ਵਿਕਸਿਤ ਭਾਰਤ 2047 ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤ ਨੋਡ",
    demoShortcuts: "⚡ ਡੈਮੋ ਭੂਮਿਕਾ ਸ਼ਾਰਟਕੱਟ (1-ਕਲਿੱਕ ਸਾਈਨ ਇਨ)",
    citizenUser: "ਨਾਗਰਿਕ ਉਪਭੋਗਤਾ",
    wardOfficer: "ਵਾਰਡ ਅਧਿਕਾਰੀ",
    platformAdmin: "ਪਲੇਟਫਾਰਮ ਐਡਮਿਨ",
    fullName: "ਪੂਰਾ ਨਾਮ",
    namePlaceholder: "ਜਿਵੇਂ, ਆਰਵ ਮਹਿਤਾ",
    phoneNumber: "ਫੋਨ ਨੰਬਰ",
    accountRole: "ਖਾਤਾ ਭੂਮਿਕਾ",
    reportingCitizen: "ਸ਼ਿਕਾਇਤਕਰਤਾ ਨਾਗਰਿਕ",
    maintenanceOfficer: "ਮਿਉਂਸਪਲ ਰੱਖ-ਰਖਾਅ ਅਧਿਕਾਰੀ",
    officialEmail: "ਅਧਿਕਾਰਤ ਈਮੇਲ ਪਤਾ",
    accessCode: "ਐਕਸੈਸ ਕੋਡ / ਪਾਸਵਰਡ",
    completeRegister: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪੂਰੀ ਕਰੋ",
    secureAccess: "ਸੁਰੱਖਿਅਤ ਖਾਤਾ ਪਹੁੰਚ",
    alreadyRegistered: "ਪਹਿਲਾਂ ਹੀ ਰਜਿਸਟਰਡ ਹੋ? ਸਾਈਨ ਇਨ ਕਰੋ",
    needCredentials: "ਨਾਗਰਿਕ ਪ੍ਰਮਾਣ ਪੱਤਰ ਚਾਹੀਦੇ ਹਨ? ਖਾਤਾ ਰਜਿਸਟਰ ਕਰੋ",
    authenticating: "ਪ੍ਰਮਾਣਿਤ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    adminNode: "ਸੁਪਰ ਪ੍ਰਸ਼ਾਸਕ ਨੋਡ",
    platformConfigs: "ਪਲੇਟਫਾਰਮ ਸੰਰਚਨਾਵਾਂ",
    platformConfigsDesc: "ਸੇਵਾ-ਪੱਧਰ ਦੇ ਸਮਝੌਤਿਆਂ ਨੂੰ ਸੰਰਚਿਤ ਕਰੋ, ਸਿਸਟਮ ਆਡਿਟ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ ਅਤੇ ਖੇਤਰੀ ਪੈਰਾਮੀਟਰਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ।",
    roadSla: "ਸੜਕਾਂ ਅਤੇ ਟੋਏ SLA",
    hoursTarget: "ਘੰਟੇ ਦਾ ਟੀਚਾ",
    lightsSla: "ਸਟ੍ਰੀਟਲਾਈਟ ਬਹਾਲੀ SLA",
    waterSla: "ਪਾਣੀ ਦੇ ਲੀਕੇਜ ਦੀ ਬਹਾਲੀ SLA",
    activityLogs: "ਸਿਸਟਮ ਗਤੀਵਿਧੀ ਲੌਗ",
    eventType: "ਇਵੈਂਟ ਦੀ ਕਿਸਮ",
    entityId: "ਐਂਟਿਟੀ ਆਈਡੀ",
    triggeredBy: "ਦੁਆਰਾ ਸ਼ੁਰੂ ਕੀਤਾ ਗਿਆ",
    status: "ਸਥਿਤੀ",
    timestamp: "ਟਾਈਮਸਟੈਂਪ",
    evtLodged: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕੀਤੀ ਗਈ",
    evtAiClass: "ਏਆਈ ਵਰਗੀਕਰਨ",
    evtOfficerEsc: "ਅਧਿਕਾਰੀ ਐਸਕੇਲੇਸ਼ਨ",
    stProcessed: "ਪ੍ਰੋਸੈਸਡ",
    stSuccess: "ਸਫਲਤਾ",
    stLogged: "ਦਰਜ ਕੀਤਾ ਗਿਆ",
    footerCopyright: "© 2026 ਨੈਸ਼ਨਲ ਇਨਫੋਰਮੈਟিক্স ਸੈਂਟਰ (NIC) ਅਤੇ ਸ਼ਹਿਰੀ ਤੇ ਪੇਂਡੂ ਮਾਮਲਿਆਂ ਦੇ ਮੰਤਰਾਲੇ। ਵਿਕਸਿਤ ਭਾਰਤ ਮਿਸ਼ਨ ਦੇ ਤਹਿਤ।",
    footerSecNode: "ਭਾਰਤ ਓਐਸ ਕੋਰ ਗ੍ਰਿਡ ਸੁਰੱਖਿਆ ਨੋਡ v1.0.4 - ਜੇਮਿਨੀ 3.5 ਫਲੈશ ਦੁਆਰਾ ਸੰਚਾਲਿਤ"
  },
  Odia: {
    booting: "ଭାରତ ସ୍ମାର୍ଟ ଓଏସ ବୁଟ୍ ହେଉଛି...",
    registerAccount: "ସର୍ବସାଧାରଣ ଆକାଉଣ୍ଟ ପଞ୍ଜିକରଣ କରନ୍ତು",
    bharatSmartOs: "ଭାରତ ସ୍ମାର୍ଟ ଓଏସ",
    viksitBharatGrievance: "ବିକଶିତ ଭାରତ ୨୦୪୭ ନାଗରିକ ଅଭିଯୋଗ ନୋଡ୍",
    demoShortcuts: "⚡ ଡେମୋ ଭୂମିକା ସର୍ଟକଟ୍ (୧-କ୍ଲିକ୍ ସାଇନ୍ ଇନ୍)",
    citizenUser: "ନାଗରିକ ଉପଭୋକ୍ତା",
    wardOfficer: "ୱାର୍ଡ ଅଧିକାରୀ",
    platformAdmin: "ପ୍ଲାଟଫର୍ମ ଆଡମିନ",
    fullName: "ପୁରା ନାମ",
    namePlaceholder: "ଯେପରିକି, ଆରଭ ମେହେଟ୍ଟା",
    phoneNumber: "ଫୋନ ନମ୍ବର",
    accountRole: "ଆକାଉଣ୍ଟ ଭୂମିକା",
    reportingCitizen: "ରିପୋର୍ଟ କରୁଥିବା ନାଗରିକ",
    maintenanceOfficer: "ପୌରପାଳିକା ରକ୍ଷଣାବେକ୍ଷଣ ଅଧିକାରୀ",
    officialEmail: "ଆଧିକାରିକ ଇମେଲ ଠିକଣା",
    accessCode: "ଆକ୍ସେସ କୋଡ୍ / ପାସୱାର୍ଡ",
    completeRegister: "ପଞ୍ଜୀକରଣ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତು",
    secureAccess: "ସୁରକ୍ଷିତ ଆକାଉଣ୍ଟ ପ୍ରବେଶ",
    alreadyRegistered: "ପୂର୍ବରୁ ପଞ୍ଜୀକୃତ କି? ସାଇନ୍ ଇନ୍ କରନ୍ତು",
    needCredentials: "ନାଗରିକ ପ୍ରମାଣପତ୍ର ଆବଶ୍ୟକ କି? ଆକାଉଣ୍ଟ ପଞ୍ଜିକରଣ କରନ୍ତು",
    authenticating: "ପ୍ରମାଣିତ ହେଉଛି...",
    adminNode: "ସୁପר ଆଡମିନିษฐ୍ରେଟର ନୋଡ୍",
    platformConfigs: "ପ୍ଲାଟଫର୍ମ ବିନ୍ୟାସ",
    platformConfigsDesc: "ସେବା ସ୍ତରୀୟ ଚୁକ୍ତିନାମା ବିନ୍ୟାସ କରନ୍ତು, ସିଷ୍ଟମ୍ ଅଡିଟ୍ ନିରୀକ୍ଷଣ କରନ୍ତು ଏବଂ ଆଞ୍ଚଳିକ ପାରାମିଟର ପରିଚାଳନା କରନ୍ତು।",
    roadSla: "ରାସ୍ତା ଏବଂ ଗାତ SLA",
    hoursTarget: "ଘଣ୍ଟା ଲକ୍ଷ୍ୟ",
    lightsSla: "ଷ୍ଟ୍ରିଟ୍ ଲାଇଟ୍ ପୁନରୁଦ୍ଧାର SLA",
    waterSla: "ଜଳ ନିଷ୍କାସନ ପୁନରୁଦ୍ଧାର SLA",
    activityLogs: "ସିଷ୍ଟମ୍ କାର୍ଯ୍ୟକଳาପ ଲଗ୍",
    eventType: "ଘଟଣାର ପ୍ରକାର",
    entityId: "ଏଣ୍ଟିଟି ଆଇଡି",
    triggeredBy: "ଦ୍ୱାରା ପ୍ରେରିତ",
    status: "ସ୍ଥିତି",
    timestamp: "ଟାଇମଷ୍ଟାମ୍ପ",
    evtLodged: "ଅଭିଯୋଗ ଦାୟର ହେଲା",
    evtAiClass: "ଏଆଇ ବର୍ଗୀକରଣ",
    evtOfficerEsc: "ଅଧିକାରୀ ଏସ୍କାଲେସନ୍",
    stProcessed: "ପ୍ରକ୍ରିୟାକୃତ",
    stSuccess: "ସଫଳତା",
    stLogged: "ଲଗ୍ ହୋଇଛି",
    footerCopyright: "© 2026 ଜାତୀୟ ସୂଚନା ବିଜ୍ଞାନ କେନ୍ଦ୍ର (NIC) ଏବଂ ସହରୀ ଓ ଗ୍ରାମୀଣ ବ୍ୟାପାର ମନ୍ତ୍ରଣାଳୟ। ବିକଶିତ ଭାରତ ମିଶନ ଅଧୀନରେ।",
    footerSecNode: "ଭାରତ ଓଏସ କୋର ଗ୍ରୀଡ୍ ସୁରକ୍ଷା ନୋଡ୍ v1.0.4 - ଜେମିନି 3.5 ଫ୍ଲାସ ଦ୍ୱାରା ଚାଳିତ"
  }
};

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => localStorage.getItem("selectedLanguage") || "English");
  
  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [splashProgress, setSplashProgress] = useState<number>(0);
  const [splashStatus, setSplashStatus] = useState<string>("Initializing secure handshake...");

  // Authentication Forms State
  const [showCredForm, setShowCredForm] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [role, setRole] = useState<Role>("citizen");
  const [authPortalMode, setAuthPortalMode] = useState<"select" | "citizen" | "officer">("select");
  const [authSubmitting, setAuthSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Restore & Listen to Supabase Session for Citizen Auth (Google OAuth & Mobile OTP)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const su = session.user;
        const citizenUser = {
          id: su.id,
          name: su.user_metadata?.full_name || su.user_metadata?.name || (su.phone ? `Citizen (${su.phone.slice(-4)})` : su.email?.split('@')[0]) || "Citizen User",
          email: su.email || `${(su.phone || 'sp').replace(/\+/g, '')}@citizen.bharat.os`,
          phone: su.phone || "",
          role: "citizen" as Role,
          language: selectedLanguage,
          state: "Madhya Pradesh",
          district: "Indore"
        };
        setCurrentUser(citizenUser);
        setToken(session.access_token);
        localStorage.setItem("token", session.access_token);
        localStorage.setItem("currentUser", JSON.stringify(citizenUser));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const su = session.user;
        const citizenUser = {
          id: su.id,
          name: su.user_metadata?.full_name || su.user_metadata?.name || (su.phone ? `Citizen (${su.phone.slice(-4)})` : su.email?.split('@')[0]) || "Citizen User",
          email: su.email || `${(su.phone || 'sp').replace(/\+/g, '')}@citizen.bharat.os`,
          phone: su.phone || "",
          role: "citizen" as Role,
          language: selectedLanguage,
          state: "Madhya Pradesh",
          district: "Indore"
        };
        setCurrentUser(citizenUser);
        setToken(session.access_token);
        localStorage.setItem("token", session.access_token);
        localStorage.setItem("currentUser", JSON.stringify(citizenUser));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // SLA Administration States
  const [slaPotholes, setSlaPotholes] = useState<number>(48);
  const [slaStreetlights, setSlaStreetlights] = useState<number>(24);
  const [slaWaterSupply, setSlaWaterSupply] = useState<number>(36);

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Localized helper
  const at = (key: string) => {
    const dict = APP_LOCAL_TRANSLATIONS[selectedLanguage] || APP_LOCAL_TRANSLATIONS.English;
    return dict[key] || APP_LOCAL_TRANSLATIONS.English[key] || key;
  };

  // Simulates splash screen progress
  useEffect(() => {
    if (!showSplash) return;
    const statuses = [
      "Accessing National Informatics Centre Backbone...",
      "Establishing secure SSL Grid connection...",
      "Verifying encryption key and node routings...",
      "Syncing with Indore municipal database...",
      "System fully online. Welcome."
    ];
    let currentStep = 0;
    const interval = setInterval(() => {
      setSplashProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowSplash(false);
          }, 600);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 15) + 5;
        const bounded = next > 100 ? 100 : next;
        
        // Update status text based on progress
        const step = Math.floor((bounded / 100) * (statuses.length - 1));
        if (step > currentStep) {
          currentStep = step;
          setSplashStatus(statuses[step]);
        }
        
        return bounded;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [showSplash]);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem("selectedLanguage", lang);
  };

  const handleLogout = () => {
    supabase.auth.signOut().catch(() => {});
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setActiveTab("dashboard");
    setShowCredForm(false);
    setAuthPortalMode("select");
  };

  const handleRoleSwitch = (newRole: Role) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, role: newRole };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    
    // Switch to appropriate active tab
    if (newRole === "citizen") setActiveTab("dashboard");
    else if (newRole === "officer") setActiveTab("officer-dash");
    
  };

  const handleShortcutLogin = (loginRole: Role) => {
    setAuthSubmitting(true);
    setTimeout(() => {
      let defaultUser = {
        id: "usr_9081",
        name: "Aarav Mehta",
        email: "aarav.mehta@nic.in",
        phone: "+91 98765 43210",
        role: loginRole,
        language: selectedLanguage,
        state: "Madhya Pradesh",
        district: "Indore",
        ward: "Ward 34",
        department: loginRole === "officer" ? "Roads and potholes" : undefined
      };
      
      if (loginRole === "officer") {
        defaultUser.name = "Officer Rajesh Kumar";
        defaultUser.email = "rajesh.kumar@indore.gov.in";
      } 

      setToken("mock_jwt_token_nic_grid");
      setCurrentUser(defaultUser);
      localStorage.setItem("token", "mock_jwt_token_nic_grid");
      localStorage.setItem("currentUser", JSON.stringify(defaultUser));
      setAuthSubmitting(false);

      if (loginRole === "citizen") setActiveTab("dashboard");
      else if (loginRole === "officer") setActiveTab("officer-dash");
      
    }, 450);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError(null);

    setTimeout(() => {
      if (isRegistering) {
        if (!name || !phone || !email || !password) {
          setAuthError("All registration fields are required.");
          setAuthSubmitting(false);
          return;
        }
        
        const newUser = {
          id: `usr_${Math.floor(Math.random() * 9000) + 1000}`,
          name,
          email,
          phone,
          role,
          language: selectedLanguage,
          state: "Madhya Pradesh",
          district: "Indore",
          ward: role === "officer" ? "Ward 34" : undefined,
          department: role === "officer" ? "Roads and potholes" : undefined
        };

        setToken("mock_jwt_token_nic_grid");
        setCurrentUser(newUser);
        localStorage.setItem("token", "mock_jwt_token_nic_grid");
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        
        if (role === "citizen") setActiveTab("dashboard");
        else if (role === "officer") setActiveTab("officer-dash");
        
      } else {
        if (!email || !password) {
          setAuthError("Please fill in both email and password.");
          setAuthSubmitting(false);
          return;
        }

        const mockUser = {
          id: "usr_9081",
          name: "Aarav Mehta",
          email: email,
          phone: "+91 98765 43210",
          role: "citizen" as Role,
          language: selectedLanguage,
          state: "Madhya Pradesh",
          district: "Indore",
          ward: "Ward 34"
        };

        if (email.includes("officer")) {
          mockUser.role = "officer";
          mockUser.name = "Officer Rajesh Kumar";
          mockUser.email = "rajesh.kumar@indore.gov.in";
        }
        
        setToken("mock_jwt_token_nic_grid");
        setCurrentUser(mockUser);
        localStorage.setItem("token", "mock_jwt_token_nic_grid");
        localStorage.setItem("currentUser", JSON.stringify(mockUser));
        
        if (mockUser.role === "citizen") setActiveTab("dashboard");
        else if (mockUser.role === "officer") setActiveTab("officer-dash");
        
      }
      setAuthSubmitting(false);
    }, 600);
  };

  if (showSplash) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-12 text-slate-200 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40"></div>
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="h-full w-1/3 bg-[#FF9933]"></div>
          <div className="h-full w-1/3 bg-white"></div>
          <div className="h-full w-1/3 bg-[#138808]"></div>
        </div>

        <div className="relative z-10 w-full max-w-xl text-center space-y-8">
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 via-white to-emerald-600 shadow-[0_0_40px_rgba(249,115,22,0.15)] border-2 border-white/20 p-1 animate-pulse">
            <div className="rounded-full bg-slate-950 h-full w-full flex items-center justify-center border border-white/10 relative overflow-hidden">
              <span className="font-serif text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-emerald-400">भ</span>
              <div className="absolute inset-0 flex items-center justify-center opacity-10 animate-spin-slow">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-blue-400"></div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
              BHARAT SMART OS
            </h1>
            <p className="text-xs tracking-widest font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-slate-200 to-emerald-400 uppercase">
              "One Nation • Smart Governance • Viksit Bharat 2047"
            </p>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-left font-mono text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">System Handshake Logs</span>
                <span className="text-emerald-500 font-bold animate-pulse">● ONLINE</span>
              </div>
              <div className="pt-2 border-t border-slate-800/50 text-slate-300 leading-relaxed space-y-0.5">
                <p># connect -grid indore_active_node_3000</p>
                <p className="text-slate-500">Connecting to National Informatics Centre Backbone...</p>
                <p className="text-slate-400 font-semibold">{splashStatus}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>SYSTEM BOOT UP</span>
                <span>{splashProgress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 transition-all duration-150"
                  style={{ width: `${splashProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSplash(false)}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-xs font-bold rounded-2xl tracking-wider uppercase transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Enter Command Center</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

    if (!token || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] font-sans flex flex-col relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {/* Header */}
        <header className="relative z-10 w-full px-6 py-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Emblem icon */}
            <div className="h-10 w-10 flex items-center justify-center shrink-0">
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="h-full w-auto opacity-90" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-wide uppercase">BHARAT SMART OS</h1>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase tracking-widest">NATIONAL GOVERNANCE INFRASTRUCTURE NODE</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-6 text-[11px] font-bold text-slate-800">
              <span className="uppercase tracking-wider">MINISTRY OF ELECTRONICS & IT</span>
              <div className="h-4 w-px bg-slate-300"></div>
              <div className="flex items-center gap-1.5 text-slate-900">
                <Shield className="h-4 w-4" />
                <span>SECURE SSL GRID</span>
              </div>
            </div>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              variant="compact"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Column */}
          <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 relative">
            
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/50 border border-slate-200 shadow-sm rounded-full text-[11px] font-bold text-slate-800 uppercase tracking-widest backdrop-blur-sm">
              <Cpu className="h-4 w-4" />
              <span>AI-Powered Urban & Rural Grid</span>
            </div>

            <h2 className="text-6xl md:text-7xl lg:text-[84px] font-extrabold text-[#111827] leading-[1.05] tracking-tight">
              One Nation.<br/>
              Smart<br/>
              Governance.
            </h2>

            <p className="text-base text-slate-600 font-medium leading-relaxed max-w-xl">
              An AI-powered national governance platform that unifies citizens, government departments, and local authorities to deliver intelligent grievance management, real-time infrastructure monitoring, Digital Twin insights, predictive analytics, and transparent public services for a Viksit Bharat 2047.
            </p>

            {/* Cityscape Silhouette */}
            <div className="w-full max-w-2xl mt-8 opacity-[0.15] pointer-events-none absolute bottom-[-50px] lg:bottom-[-120px] left-[-20px]">
              <svg viewBox="0 0 800 150" className="w-full h-auto fill-slate-900" preserveAspectRatio="none">
                 <path d="M0,150 L0,120 L20,120 L20,100 L40,100 L40,120 L50,120 L50,90 L70,90 L70,80 L80,80 L80,120 L100,120 L100,100 L120,100 L120,110 L130,110 L130,90 L150,90 L150,120 L180,120 L180,80 L190,80 L190,60 L200,60 L200,80 L220,80 L220,120 L250,120 L250,90 L270,90 L270,70 L280,70 L280,90 L300,90 L300,120 L320,120 L320,60 L340,60 L340,30 L360,30 L360,60 L380,60 L380,120 L400,120 L400,90 L420,90 L420,70 L440,70 L440,120 L460,120 L460,80 L480,80 L480,120 L500,120 L500,70 L520,70 L520,50 L540,50 L540,70 L560,70 L560,120 L580,120 L580,90 L600,90 L600,120 L620,120 L620,100 L640,100 L640,80 L660,80 L660,120 L680,120 L680,90 L700,90 L700,120 L720,120 L720,100 L740,100 L740,120 L760,120 L760,110 L780,110 L780,120 L800,120 L800,150 Z" />
              </svg>
            </div>
          </div>

          {/* Right Column: Login Panel & Stats */}
          <div className="w-full max-w-[480px] shrink-0 flex flex-col gap-6 z-10">
            
            {/* Login Card */}
            <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 relative p-10 pb-12">
              {/* Header */}
              <div className="mb-8">
                <h3 className="text-[32px] font-extrabold text-[#111827] tracking-tight leading-[1.15]">
                  Secure Digital<br/>Access
                </h3>
                <p className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.1em] mt-4">
                  NATIONAL INFORMATICS CENTRE GRID
                </p>
              </div>

              {/* Form Area */}
              <div>
                {authPortalMode === "citizen" || authPortalMode === "officer" ? (
                  <CitizenSupabaseAuth
                    selectedLanguage={selectedLanguage}
                    initialRole={authPortalMode === "officer" ? "officer" : "citizen"}
                    onSuccess={(user, tokenVal) => {
                      setCurrentUser(user);
                      setToken(tokenVal);
                      localStorage.setItem("currentUser", JSON.stringify(user));
                      localStorage.setItem("token", tokenVal);
                      if (user.role === "officer") {
                        setActiveTab("officer-dash");
                      } else {
                        setActiveTab("dashboard");
                      }
                    }}
                    onBack={() => setAuthPortalMode("select")}
                  />
                ) : (
                  <>
                    <p className="text-[14px] font-bold text-slate-900 mb-5">Select your portal to proceed:</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Citizen Card - Supabase Powered */}
                      <button 
                        type="button"
                        onClick={() => {
                          setRole("citizen");
                          setAuthPortalMode("citizen");
                        }}
                        className="text-left p-5 rounded-2xl transition-all cursor-pointer group bg-gradient-to-br from-emerald-50/50 to-white border-2 border-emerald-600 hover:border-emerald-700 shadow-sm hover:shadow-md"
                      >
                        <div className="h-10 w-10 rounded-full bg-emerald-700 flex items-center justify-center mb-4 text-white shadow-sm">
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <h4 className="text-[15px] font-bold text-slate-900">Citizen Portal</h4>
                          <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">SUPABASE</span>
                        </div>
                        <p className="text-[11px] font-medium leading-relaxed text-slate-600">
                          Sign in or Sign up with Email/Mobile Number & Password.
                        </p>
                      </button>

                      {/* Ward Officer / Member Card - Supabase Powered */}
                      <button 
                        type="button"
                        onClick={() => {
                          setRole("officer");
                          setAuthPortalMode("officer");
                        }}
                        className="text-left p-5 rounded-2xl transition-all cursor-pointer group bg-gradient-to-br from-sky-50/50 to-white border-2 border-sky-600 hover:border-sky-700 shadow-sm hover:shadow-md"
                      >
                        <div className="h-10 w-10 rounded-full bg-sky-700 flex items-center justify-center mb-4 text-white shadow-sm">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <h4 className="text-[15px] font-bold text-slate-900">Ward Member</h4>
                          <span className="text-[9px] font-mono font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">SUPABASE</span>
                        </div>
                        <p className="text-[11px] font-medium leading-relaxed text-slate-600">
                          Official Ward Member login with Email and Password.
                        </p>
                      </button>
                    </div>

                    {authSubmitting && (
                      <div className="mt-6 p-3 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center text-teal-700">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <span className="text-sm font-semibold">Authenticating securely...</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Stats Under Login Panel */}
            <div className="w-full px-2 pt-2">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-left">
                  <p className="text-[13px] font-bold text-[#111827] mb-1">Total Ledgers</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[28px] font-extrabold text-[#111827] leading-none">288</span>
                    <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-emerald-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Status
                    </div>
                  </div>
                </div>
                
                <div className="text-left border-l border-slate-200 pl-5">
                  <p className="text-[13px] font-bold text-[#111827] mb-1">SLA Resolved</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[28px] font-extrabold text-[#111827] leading-none">320</span>
                    <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-emerald-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Status
                    </div>
                  </div>
                </div>

                <div className="text-left border-l border-slate-200 pl-5">
                  <p className="text-[13px] font-bold text-[#111827] mb-1">Avg Dispatch</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[28px] font-extrabold text-[#111827] leading-none">0.72</span>
                    <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-emerald-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Status
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full h-px bg-slate-200 mb-5 mt-6"></div>
              
              <p className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.05em]">
                MINISTRY OF ELECTRONICS CENTRE GRID
              </p>
            </div>

          </div>
        </main>

      </div>
    );
  }
  // Sidebar link definitions
  const sidebarLinks = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["citizen", "officer"],
    },
    {
      id: "viksit-bharat",
      label: "Viksit Bharat Hub",
      icon: Award,
      roles: ["citizen", "officer"],
    },
    {
      id: "lodge",
      label: "Report an Issue",
      icon: Plus,
      roles: ["citizen"]
    },
    {
      id: "my-complaints",
      label: "My Complaints",
      icon: CheckSquare,
      roles: ["citizen"]
    },
    {
      id: "officer-dash",
      label: "Assigned Worklist",
      icon: Compass,
      roles: ["officer"]
    },
    
    {
      id: "analytics",
      label: "Grid Analytics",
      icon: BarChart3,
      roles: ["citizen", "officer"]
    },
    {
      id: "assistant",
      label: "Agentic Assistant",
      icon: Bot,
      roles: ["citizen", "officer"]
    },
    {
      id: "help",
      label: "Governance SLA Help",
      icon: HelpCircle,
      roles: ["citizen", "officer"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F6F8FB] font-sans flex">
      {/* 1. Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white sticky top-0 h-screen z-40 shrink-0">
                {/* Brand Logo and Title */}
        <div className="flex items-center justify-center px-4 py-6 border-b border-slate-100 bg-white shrink-0">
          <img
            src="https://ayfmpebpnhtsahrlqnsu.supabase.co/storage/v1/object/sign/Viksit%20bharat%20hub/ChatGPT%20Image%20Jul%2019,%202026,%2008_57_42%20PM.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZjk4OTVkYy1hNjA5LTQ1MzUtODFkMC01MTg0YmMwZDM5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWtzaXQgYmhhcmF0IGh1Yi9DaGF0R1BUIEltYWdlIEp1bCAxOSwgMjAyNiwgMDhfNTdfNDIgUE0ucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NDQ3NTM5OSwiZXhwIjoyNzMwNTU1Mzk5fQ.KO7S3ulpmbGiSdaW9cw86eYBNsh4bxX9IXXsOZOIDtk"
            alt="Viksit Bharat Logo"
            className="w-48 h-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Sidebar link navigation items */}
        <div className="flex-1 py-4 overflow-y-auto space-y-1 px-4">
          {sidebarLinks
            .filter((link) => !link.roles || link.roles.includes(currentUser.role))
            .map((link) => {
              const IconComponent = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100/30"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <IconComponent className={`h-4.5 w-4.5 ${isActive ? "text-blue-500" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                  {link.id === "dashboard" && (
                    <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  )}
                </button>
              );
            })}
        </div>

        {/* Bottom Ashoka Pillar Emblem Badge */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80">
          <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm space-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 flex">
              <div className="h-full w-1/3 bg-[#FF9933]"></div>
              <div className="h-full w-1/3 bg-white"></div>
              <div className="h-full w-1/3 bg-[#138808]"></div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <span className="font-serif text-base font-bold text-orange-600">भ</span>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-slate-900 leading-none">Bharat Smart OS</h4>
                <p className="text-[9px] text-slate-400 font-medium mt-1 leading-none">Viksit India 2047</p>
              </div>
            </div>
            <p className="text-[9px] font-semibold text-slate-500 leading-normal">
              Dedicated node empowering citizens and administration towards developed India by 2047.
            </p>
          </div>
        </div>
      </aside>

      {/* 2. Responsive Mobile Sidebar Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in bg-slate-950/40 backdrop-blur-sm">
          <div className="relative flex w-64 max-w-xs flex-col bg-white h-full border-r border-slate-200">
            {/* Close button */}
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

                        {/* Brand Logo and Title */}
            <div className="flex items-center justify-center px-4 py-6 border-b border-slate-100 bg-white shrink-0">
              <img
                src="https://ayfmpebpnhtsahrlqnsu.supabase.co/storage/v1/object/sign/Viksit%20bharat%20hub/ChatGPT%20Image%20Jul%2019,%202026,%2008_57_42%20PM.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZjk4OTVkYy1hNjA5LTQ1MzUtODFkMC01MTg0YmMwZDM5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWtzaXQgYmhhcmF0IGh1Yi9DaGF0R1BUIEltYWdlIEp1bCAxOSwgMjAyNiwgMDhfNTdfNDIgUE0ucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NDQ3NTM5OSwiZXhwIjoyNzMwNTU1Mzk5fQ.KO7S3ulpmbGiSdaW9cw86eYBNsh4bxX9IXXsOZOIDtk"
                alt="Viksit Bharat Logo"
                className="w-40 h-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Sidebar navigation list */}
            <div className="flex-1 py-4 overflow-y-auto space-y-1 px-4">
              {sidebarLinks
                .filter((link) => !link.roles || link.roles.includes(currentUser.role))
                .map((link) => {
                  const IconComponent = link.icon;
                  const isActive = activeTab === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        setActiveTab(link.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100/30"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <IconComponent className={`h-4.5 w-4.5 ${isActive ? "text-blue-500" : "text-slate-400"}`} />
                      <span>{link.label}</span>
                    </button>
                  );
                })}
            </div>

            {/* Language Selection in Mobile Menu */}
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
              <label className="block text-[10px] font-extrabold uppercase text-slate-500 tracking-wider mb-2 font-mono">
                Language / भाषा चुनें
              </label>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={(lang) => {
                  setSelectedLanguage(lang);
                  setMobileMenuOpen(false);
                }}
                variant="compact"
                className="w-full"
              />
            </div>

            {/* Bottom info banner */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80">
              <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm space-y-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 flex">
                  <div className="h-full w-1/3 bg-[#FF9933]"></div>
                  <div className="h-full w-1/3 bg-white"></div>
                  <div className="h-full w-1/3 bg-[#138808]"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base font-bold text-orange-600">भ</span>
                  <span className="text-[10px] font-bold text-slate-900">Bharat Smart OS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Background clicking dismisses */}
          <div className="flex-1 cursor-pointer" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* 3. Main Content Panel */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        
        {/* Top Header Panel */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-slate-200 rounded-xl bg-white mr-2 shrink-0 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Page title and Flag pill */}
            <div className="flex items-center gap-3">
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
                {sidebarLinks.find((l) => l.id === activeTab)?.label || (activeTab === "dashboard" ? "Dashboard" : activeTab.replace("-", " "))}
              </h2>
              {activeTab === "dashboard" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-50 to-emerald-50 border border-orange-100/70 rounded-full shadow-sm text-[10px] md:text-xs font-bold text-orange-700 animate-fade-in shrink-0">
                  <span className="text-[10px]">🇮🇳</span>
                  <span>Viksit Bharat 2047</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Application Language Selector */}
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              variant="header"
            />

            {/* Quick Demo Switcher */}
            <div className="hidden lg:flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-[10px] md:text-xs shrink-0">
              <button
                onClick={() => handleRoleSwitch("citizen")}
                className={`rounded-lg px-2.5 py-1 font-bold transition-all cursor-pointer ${
                  currentUser.role === "citizen"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => handleRoleSwitch("officer")}
                className={`rounded-lg px-2.5 py-1 font-bold transition-all cursor-pointer ${
                  currentUser.role === "officer"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Officer
              </button>
              
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-xs shadow-sm border border-slate-200">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">{currentUser.name}</p>
                <span className="text-[10px] text-slate-400 font-bold uppercase leading-none mt-1 block">
                  {currentUser.role}
                </span>
              </div>
            </div>

            {/* Log Out */}
            <button
              onClick={handleLogout}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors shrink-0 cursor-pointer shadow-sm"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          
          {/* Dashboard Tab: Beautiful Viksit Bharat 2047 Dashboard */}
          {activeTab === "dashboard" && (
            <ViksitBharatDashboard
              onNavigateTab={(tab) => {
                setActiveTab(tab);
              }}
              selectedLanguage={selectedLanguage}
            />
          )}

          {/* Interactive Viksit Bharat Hub Tab */}
          {activeTab === "viksit-bharat" && (
            <CommandCenterDashboard
              defaultSubTab="viksit"
              currentUser={currentUser}
              selectedLanguage={selectedLanguage}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
              }}
              onSelectComplaint={(complaint) => {
                if (currentUser.role === "citizen") {
                  setActiveTab("my-complaints");
                } else if (currentUser.role === "officer") {
                  setActiveTab("officer-dash");
                }
              }}
            />
          )}

          {/* Citizen Complaint Lodge Tab */}
          {activeTab === "lodge" && currentUser.role === "citizen" && (
            <CitizenDashboard
              userId={currentUser.id}
              userName={currentUser.name}
              userEmail={currentUser.email}
              selectedLanguage={selectedLanguage}
              activeTab={activeTab}
            />
          )}

          {/* Citizen track lists */}
          {activeTab === "my-complaints" && currentUser.role === "citizen" && (
            <CitizenDashboard
              userId={currentUser.id}
              userName={currentUser.name}
              userEmail={currentUser.email}
              selectedLanguage={selectedLanguage}
              activeTab={activeTab}
            />
          )}

                    {/* Officer Queue */}
          {activeTab === "officer-dash" && currentUser.role === "officer" && (
            <OfficerDashboard selectedLanguage={selectedLanguage} />
          )}

          {/* Real-Time Analytics Tab */}
          {activeTab === "analytics" && <AnalyticsDashboard selectedLanguage={selectedLanguage} />}

          {/* Help Section */}
          {activeTab === "help" && <HelpCenter selectedLanguage={selectedLanguage} />}

          {/* Agentic Assistant */}
          {activeTab === "assistant" && <AiAssistant selectedLanguage={selectedLanguage} />}
        </main>
        {/* Persistent Desktop/Mobile Page Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400 font-medium z-10 shrink-0">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-slate-500 font-semibold">© 2026 National Informatics Centre (NIC) & Ministry of Urban & Rural Affairs. Under Viksit Bharat Mission.</p>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide">BHARAT OS CORE GRID SECURITY NODE v1.0.4 - POWERED BY GEMINI 3.5 FLASH</p>
          </div>
        </footer>
      </div>
    </div>
  );
}