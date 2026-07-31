import React, { useState, useEffect } from "react";
import {
  Compass,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Bot,
  User,
  ChevronRight,
  MessageSquare,
  Activity,
  Phone,
  FileText
} from "lucide-react";
import { SECTORS, Severity, Complaint } from "../types";
import { t } from "../data";
import { InteractiveGmpMap, hasValidKey } from "./GmpMap";

const OFFICER_LOCAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    backlogLabel: "My Jurisdiction Backlog",
    assignedTasks: "Assigned Tasks",
    criticalHotspots: "Critical Hotspots",
    urgentDispatch: "Urgent Dispatch",
    fieldExecution: "In Field Execution",
    activeRepair: "Active Repair",
    jurisdictionFilters: "Jurisdiction Filters:",
    allSectors: "All Sectors",
    allStatuses: "All Statuses",
    allSeverities: "All Severities",
    noComplaintsFiltered: "No active complaints in the filtered view.",
    gisHotspots: "GIS Jurisdictional Hotspots",
    gisHotspotsDesc: "Interactive geographic cluster plot of registered issues in Indore municipality. Select dots to check ticket info.",
    closePanel: "Close Panel",
    triageAnalysis: "Triage Analysis",
    originalGrievance: "Original Grievance Entry",
    progressLifecycle: "⚠️ Progress Grievance Lifecycle",
    setNewStatus: "Set New Status",
    chooseStatus: "-- Choose status --",
    auditLedgerNote: "Audit Ledger Justification Note",
    explainReasonPlaceholder: "Explain reason for change (e.g., dispatching road crew)...",
    processingBtn: "Processing...",
    updateStatusBtn: "Update Complaint Status",
    milestoneAuditTrail: "Milestone Audit Trail",
    bidirectionalChat: "Bi-Directional Chat",
    chatInputPlaceholder: "Write a message to the citizen...",
    sendBtn: "Send"
  },
  Hindi: {
    backlogLabel: "मेरा क्षेत्राधिकार बैकलॉग",
    assignedTasks: "सौंपे गए कार्य",
    criticalHotspots: "महत्वपूर्ण हॉटस्पॉट",
    urgentDispatch: "तत्काल प्रेषण",
    fieldExecution: "क्षेत्र निष्पादन में",
    activeRepair: "सक्रिय मरम्मत",
    jurisdictionFilters: "क्षेत्राधिकार फ़िल्टर:",
    allSectors: "सभी क्षेत्र",
    allStatuses: "सभी स्थितियाँ",
    allSeverities: "सभी गंभीरता स्तर",
    noComplaintsFiltered: "फ़िल्टर किए गए दृश्य में कोई सक्रिय शिकायत नहीं है।",
    gisHotspots: "जीआईएस क्षेत्राधिकार हॉटस्पॉट",
    gisHotspotsDesc: "इंदौर नगर पालिका में पंजीकृत समस्याओं का संवादात्मक भौगोलिक क्लस्टर प्लॉट। टिकट की जानकारी देखने के लिए बिंदुओं का चयन करें।",
    closePanel: "पैनल बंद करें",
    triageAnalysis: "वर्गीकरण विश्लेषण",
    originalGrievance: "मूल शिकायत प्रविष्टि",
    progressLifecycle: "⚠️ शिकायत जीवन चक्र की प्रगति",
    setNewStatus: "नई स्थिति सेट करें",
    chooseStatus: "-- स्थिति चुनें --",
    auditLedgerNote: "ऑडिट बही औचित्य नोट",
    explainReasonPlaceholder: "बदलाव का कारण स्पष्ट करें (जैसे, सड़क दल को भेजना)...",
    processingBtn: "प्रक्रिया की जा रही है...",
    updateStatusBtn: "शिकायत की स्थिति अपडेट करें",
    milestoneAuditTrail: "मील का पत्थर ऑडिट ट्रेल",
    bidirectionalChat: "द्वि-मार्गी चैट",
    chatInputPlaceholder: "नागरिक को संदेश लिखें...",
    sendBtn: "भेजें"
  },
  Telugu: {
    backlogLabel: "నా అధికార పరిధి బ్యాక్‌లాగ్",
    assignedTasks: "కేటాయించిన పనులు",
    criticalHotspots: "కీలక హాట్‌స్పాట్‌లు",
    urgentDispatch: "అత్యవసర రవాణా",
    fieldExecution: "ఫీల్డ్ ఎగ్జిక్యూషన్‌లో",
    activeRepair: "చురుకైన మరమ్మతు",
    jurisdictionFilters: "అధికార పరిధి ఫిల్టర్లు:",
    allSectors: "అన్ని రంగాలు",
    allStatuses: "అన్ని స్థితులు",
    allSeverities: "అన్ని తీవ్రతలు",
    noComplaintsFiltered: "ఫిల్టర్ చేసిన వీక్షణలో క్రియాశీల ఫిర్యాదులు లేవు.",
    gisHotspots: "జీఐఎస్ అధికార పరిధి హాట్‌స్పాట్‌లు",
    gisHotspotsDesc: "ఇండోర్ మునిసిపాలిటీలో నమోదైన సమస్యల ఇంటరాక్టివ్ భౌగోళిక క్లస్టర్ ప్లాట్. టికెట్ సమాచారాన్ని తనిఖీ చేయడానికి చుక్కలను ఎంచుకోండి.",
    closePanel: "ప్యానెల్ మూసివేయి",
    triageAnalysis: "ట్రయాజ్ విశ్లేషణ",
    originalGrievance: "అసలు ఫిర్యాదు నమోదు",
    progressLifecycle: "⚠️ ఫిర్యాదు పురోగతి లైఫ్‌సైకిల్",
    setNewStatus: "కొత్త స్థితిని సెట్ చేయి",
    chooseStatus: "-- స్థితిని ఎంచుకోండి --",
    auditLedgerNote: "ఆడిట్ లెడ్జర్ జస్టిఫికేషన్ నోట్",
    explainReasonPlaceholder: "మార్పుకు గల కారణాన్ని వివరించండి (ఉదా. రోడ్ క్రూని పంపడం)...",
    processingBtn: "ప్రక్రియ జరుగుతోంది...",
    updateStatusBtn: "ఫిర్యాదు స్థితిని నవీకరించు",
    milestoneAuditTrail: "మైల్‌స్టోన్ ఆడిట్ ట్రైల్",
    bidirectionalChat: "ద్వి-దిశాత్మక చాట్",
    chatInputPlaceholder: "పౌరుడికి సందేశం రాయండి...",
    sendBtn: "పంపు"
  },
  Tamil: {
    backlogLabel: "எனது அதிகார வரம்பு நிலுவை",
    assignedTasks: "ஒதுக்கப்பட்ட பணிகள்",
    criticalHotspots: "முக்கிய ஹாட்ஸ்பாட்கள்",
    urgentDispatch: "அவசர அனுப்புதல்",
    fieldExecution: "கள செயல்பாட்டில்",
    activeRepair: "செயலில் உள்ள பழுதுபார்ப்பு",
    jurisdictionFilters: "அதிகார வரம்பு வடிகட்டிகள்:",
    allSectors: "அனைத்து துறைகளும்",
    allStatuses: "அனைத்து நிலைகளும்",
    allSeverities: "அனைத்து தீவிரத்தன்மைகளும்",
    noComplaintsFiltered: "வடிகட்டப்பட்ட பார்வையில் செயலில் உள்ள புகார்கள் எதுவும் இல்லை.",
    gisHotspots: "ஜிஐஎஸ் அதிகார வரம்பு ஹாட்ஸ்பாட்கள்",
    gisHotspotsDesc: "இந்தூர் நகராட்சியில் பதிவு செய்யப்பட்ட சிக்கல்களின் ஊடாடும் புவியியல் கிளஸ்டர் வரைபடம். டிக்கெட் தகவலை சரிபார்க்க புள்ளிகளைத் தேர்ந்தெடுக்கவும்.",
    closePanel: "பேனலை மூடு",
    triageAnalysis: "வகைப்பாடு பகுப்பாய்வு",
    originalGrievance: "அசல் குறை நுழைவு",
    progressLifecycle: "⚠️ குறை வாழ்க்கைச் சுழற்சியை மேம்படுத்து",
    setNewStatus: "புதிய நிலையை அமை",
    chooseStatus: "-- நிலையைத் தேர்ந்தெடு --",
    auditLedgerNote: "தணிக்கை பேரேடு நியாயப்படுத்தல் குறிப்பு",
    explainReasonPlaceholder: "மாற்றத்திற்கான காரணத்தை விளக்குங்கள் (எ.கா., சாலைக் குழுவை அனுப்புதல்)...",
    processingBtn: "செயலாக்கப்படுகிறது...",
    updateStatusBtn: "புகார் நிலையை இற்றைப்படுத்து",
    milestoneAuditTrail: "மைல்கல் தணிக்கை தடம்",
    bidirectionalChat: "இருவழி அரட்டை",
    chatInputPlaceholder: "குடிமகனுக்கு ஒரு செய்தியை எழுதுங்கள்...",
    sendBtn: "அனுப்பு"
  },
  Kannada: {
    backlogLabel: "ನನ್ನ ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿಯ ಬಾಕಿ",
    assignedTasks: "ನಿಯೋಜಿಸಲಾದ ಕಾರ್ಯಗಳು",
    criticalHotspots: "ನಿರ್ಣಾಯಕ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು",
    urgentDispatch: "ತುರ್ತು ರವಾನೆ",
    fieldExecution: "ಕ್ಷೇತ್ರ ಅನುಷ್ಠಾನದಲ್ಲಿದೆ",
    activeRepair: "ಸಕ್ರಿಯ ದುರಸ್ತಿ",
    jurisdictionFilters: "ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿಯ ಫಿಲ್ಟರ್‌ಗಳು:",
    allSectors: "ಎಲ್ಲಾ ವಲಯಗಳು",
    allStatuses: "ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು",
    allSeverities: "ಎಲ್ಲಾ ತೀವ್ರತೆಗಳು",
    noComplaintsFiltered: "ಫಿಲ್ಟರ್ ಮಾಡಿದ ವೀಕ್ಷಣೆಯಲ್ಲಿ ಯಾವುದೇ ಸಕ್ರಿಯ ದೂರುಗಳಿಲ್ಲ.",
    gisHotspots: "ಜಿಐಎಸ್ ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿಯ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು",
    gisHotspotsDesc: "ಇಂದೋರ್ ಮುನ್ಸಿಪಾಲಿಟಿಯಲ್ಲಿ ನೋಂದಾಯಿಸಲಾದ ಸಮಸ್ಯೆಗಳ ಸಂವಾದಾತ್ಮಕ ಭೌಗೋಳಿಕ ಕ್ಲಸ್ಟರ್ ಪ್ಲಾಟ್. ಟಿಕೆಟ್ ಮಾಹಿತಿ ಪರಿಶೀಲಿಸಲು ಚುಕ್ಕೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    closePanel: "ಪ್ಯಾನಲ್ ಮುಚ್ಚಿ",
    triageAnalysis: "ಟ್ರಯಾಜ್ ವಿಶ್ಲೇಷಣೆ",
    originalGrievance: "ಮೂಲ ದೂರು ನಮೂದು",
    progressLifecycle: "⚠️ ದೂರು ಜೀವನಚಕ್ರ ಪ್ರಗತಿ",
    setNewStatus: "ಹೊಸ ಸ್ಥಿತಿಯನ್ನು ಹೊಂದಿಸಿ",
    chooseStatus: "-- ಸ್ಥಿತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ --",
    auditLedgerNote: "ಆಡಿಟ್ ಲೆಡ್ಜರ್ ಸಮರ್ಥನೆ ಟಿಪ್ಪಣಿ",
    explainReasonPlaceholder: "ಬದಲಾವಣೆಗೆ ಕಾರಣವನ್ನು ವಿವರಿಸಿ (ಉದಾ., ರಸ್ತೆ ಸಿಬ್ಬಂದಿಯನ್ನು ನಿಯೋಜಿಸುವುದು)...",
    processingBtn: "ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ...",
    updateStatusBtn: "ದೂರು ಸ್ಥಿತಿಯನ್ನು ನವೀಕರಿಸಿ",
    milestoneAuditTrail: "ಮೈಲಿಗಲ್ಲು ಆಡಿಟ್ ಟ್ರಯಲ್",
    bidirectionalChat: "ದ್ವಿಮುಖ ಚಾಟ್",
    chatInputPlaceholder: "ನಾಗರಿಕರಿಗೆ ಸಂದೇಶ ಬರೆಯಿರಿ...",
    sendBtn: "ಕಳುಹಿಸು"
  },
  Malayalam: {
    backlogLabel: "എന്റെ അധികാരപരിധിയിലെ കുടിശ്ശിക",
    assignedTasks: "നിയുക്ത ചുമതലകൾ",
    criticalHotspots: "ഗുരുതരമായ ഹോട്ട്‌സ്‌പോട്ടുകൾ",
    urgentDispatch: "അടിയന്തിര ഡിസ്പാച്ച്",
    fieldExecution: "ഫീൽഡ് എക്സിക്യൂഷനിൽ",
    activeRepair: "സജീവമായ നന്നാക്കൽ",
    jurisdictionFilters: "അധികാരപരിധി ഫിൽട്ടറുകൾ:",
    allSectors: "എല്ലാ മേഖലകളും",
    allStatuses: "എല്ലാ നിലകളും",
    allSeverities: "എല്ലാ തീവ്രതകളും",
    noComplaintsFiltered: "ഫിൽട്ടർ ചെയ്ത കാഴ്‌ചയിൽ സജീവമായ പരാതികളൊന്നുമില്ല.",
    gisHotspots: "ജിഐഎസ് അധികാരപരിധി ഹോട്ട്‌സ്‌പോട്ടുകൾ",
    gisHotspotsDesc: "ഇൻഡോർ മുനിസിപ്പാലിറ്റിയിൽ രജിസ്റ്റർ ചെയ്ത പ്രശ്നങ്ങളുടെ ഇന്ററാക്ടീവ് ഭൂമിശാസ്ത്ര ക്ലസ്റ്റർ പ്ലോട്ട്. ടിക്കറ്റ് വിവരങ്ങൾ പരിശോധിക്കാൻ ഡോട്ടുകൾ തിരഞ്ഞെടുക്കുക.",
    closePanel: "പാനൽ അടയ്ക്കുക",
    triageAnalysis: "ട്രയാജ് വിശകലനം",
    originalGrievance: "യഥാർത്ഥ പരാതി എൻട്രി",
    progressLifecycle: "⚠️ പരാതി ജീവിതചക്രം പുരോഗമിപ്പിക്കുക",
    setNewStatus: "പുതിയ നില സജ്ജമാക്കുക",
    chooseStatus: "-- നില തിരഞ്ഞെടുക്കുക --",
    auditLedgerNote: "ഓഡിറ്റ് ലെഡ്ജർ ജസ്റ്റിഫിക്കേഷൻ നോട്ട്",
    explainReasonPlaceholder: "മാറ്റത്തിനുള്ള കാരണം വിശദീകരിക്കുക (ഉദാഹരണത്തിന്, റോഡ് ക്രൂവിനെ അയക്കുന്നു)...",
    processingBtn: "പ്രോസസ്സ് ചെയ്യുന്നു...",
    updateStatusBtn: "പരാതിയുടെ നില അപ്‌ഡേറ്റ് ചെയ്യുക",
    milestoneAuditTrail: "മൈൽസ്റ്റോൺ ഓഡിറ്റ് ട്രയൽ",
    bidirectionalChat: "ദ്വിമുഖ ചാറ്റ്",
    chatInputPlaceholder: "പൗരന് ഒരു സന്ദേശം എഴുതുക...",
    sendBtn: "അയക്കുക"
  },
  Marathi: {
    backlogLabel: "माझा अधिकार क्षेत्रातील अनुशेष",
    assignedTasks: "नियुक्त कामे",
    criticalHotspots: "गंभीर हॉटस्पॉट",
    urgentDispatch: "तातडीने पाठवणे",
    fieldExecution: "थेट क्षेत्र कार्यात",
    activeRepair: "सक्रिय दुरुस्ती",
    jurisdictionFilters: "अधिकार क्षेत्र फिल्टर:",
    allSectors: "सर्व क्षेत्रे",
    allStatuses: "सर्व स्थिती",
    allSeverities: "सर्व तीव्रता",
    noComplaintsFiltered: "फिल्टर केलेल्या दृश्यामध्ये कोणतीही सक्रिय तक्रार नाही.",
    gisHotspots: "जीआयएस अधिकार क्षेत्र हॉटस्पॉट",
    gisHotspotsDesc: "इंदूर नगरपालिकेतील नोंदणीकृत समस्यांचा परस्परसंवादी भौगोलिक क्लस्टर आलेख. तिकीट माहिती तपासण्यासाठी बिंदू निवडा.",
    closePanel: "पॅनेल बंद करा",
    triageAnalysis: "ट्रायज विश्लेषण",
    originalGrievance: "मूळ तक्रार नोंद",
    progressLifecycle: "⚠️ तक्रार जीवन चक्र प्रगती",
    setNewStatus: "नवीन स्थिती सेट करा",
    chooseStatus: "-- स्थिती निवडा --",
    auditLedgerNote: "ऑडिट बही औचित्य नोंद",
    explainReasonPlaceholder: "बदलाचे कारण स्पष्ट करा (उदा. रस्ता दुरुस्ती पथक पाठवणे)...",
    processingBtn: "प्रक्रिया होत आहे...",
    updateStatusBtn: "तक्रार स्थिती अपडेट करा",
    milestoneAuditTrail: "टप्पा ऑडिट ट्रेल",
    bidirectionalChat: "द्वि-मार्गी चॅट",
    chatInputPlaceholder: "नागरिकला संदेश लिहा...",
    sendBtn: "पाठवा"
  },
  Bengali: {
    backlogLabel: "আমার এখতিয়ারের বকেয়া কাজ",
    assignedTasks: "বরাদ্দকৃত কাজ",
    criticalHotspots: "গুরুত্বপূর্ণ হটস্পট",
    urgentDispatch: "জরুরী প্রেরণ",
    fieldExecution: "ফিল্ড বাস্তবায়নে",
    activeRepair: "সক্রিয় মেরামত",
    jurisdictionFilters: "এখতিয়ার ফিল্টার:",
    allSectors: "সমস্ত সেক্টর",
    allStatuses: "সমস্ত স্থিতি",
    allSeverities: "সমস্ত তীব্রতা",
    noComplaintsFiltered: "ফিল্টার করা ভিউতে কোনো সক্রিয় অভিযোগ নেই।",
    gisHotspots: "জিআইএস এখতিয়ারের হটস্পট",
    gisHotspotsDesc: "ইন্দোর পৌরসভায় নিবন্ধিত সমস্যাগুলির ইন্টারেক্টিভ ভৌগোলিক ক্লাস্টার প্লট। টিকিটের তথ্য পরীক্ষা করতে বিন্দুগুলি নির্বাচন করুন।",
    closePanel: "প্যানেল বন্ধ করুন",
    triageAnalysis: "ট্রায়াজ বিশ্লেষণ",
    originalGrievance: "মূল অভিযোগের বিবরণ",
    progressLifecycle: "⚠️ অভিযোগ জীবনচক্রের অগ্রগতি",
    setNewStatus: "নতুন স্থিতি সেট করুন",
    chooseStatus: "-- স্থিতি নির্বাচন করুন --",
    auditLedgerNote: "অডিট লেজার জাস্টিফিকেশন নোট",
    explainReasonPlaceholder: "পরিবর্তনের কারণ ব্যাখ্যা করুন (যেমন, সড়ক দল পাঠানো)...",
    processingBtn: "প্রক্রিয়াকরণ করা হচ্ছে...",
    updateStatusBtn: "অভিযোগের স্থিতি আপডেট করুন",
    milestoneAuditTrail: "মাইলস্টোন অডিট ট্রেইল",
    bidirectionalChat: "দ্বিমুখী চ্যাট",
    chatInputPlaceholder: "নাগরিককে একটি বার্তা লিখুন...",
    sendBtn: "পাঠান"
  },
  Gujarati: {
    backlogLabel: "મારો અધિકારક્ષેત્ર બેકલોગ",
    assignedTasks: "સોંપાયેલ કાર્યો",
    criticalHotspots: "જટિલ હોટસ્પોટ્સ",
    urgentDispatch: "તાત્કાલિક રવાનગી",
    fieldExecution: "ક્ષેત્ર અમલીકરણમાં",
    activeRepair: "સક્રિય સમારકામ",
    jurisdictionFilters: "અધિકારક્ષેત્ર ફિલ્ટર્સ:",
    allSectors: "બધા સેક્ટરો",
    allStatuses: "બધી સ્થિતિઓ",
    allSeverities: "બધી તીવ્રતાઓ",
    noComplaintsFiltered: "ફિલ્ટર કરેલ દૃશ્યમાં કોઈ સક્રિય ફરિયાદો નથી.",
    gisHotspots: "જીઆઇએસ અધિકારક્ષેત્ર હોટસ્પોટ્સ",
    gisHotspotsDesc: "ઇન્દોર નગરપાલિકામાં નોંધાયેલી સમસ્યાઓનો ઇન્ટરેક્ટિવ ભૌગોલિક ક્લસ્ટર પ્લોટ. ટિકિટ માહિતી તપાસવા માટે બિંદુઓ પસંદ કરો.",
    closePanel: "પેનલ બંધ કરો",
    triageAnalysis: "ટ્રાયજ વિશ્લેષણ",
    originalGrievance: "મૂળ ફરિયાદ એન્ટ્રી",
    progressLifecycle: "⚠️ ફરિયાદ જીવનચક્ર પ્રગતિ",
    setNewStatus: "નવી સ્થિતિ સેટ કરો",
    chooseStatus: "-- સ્થિતિ પસંદ કરો --",
    auditLedgerNote: "ઓડિટ ખાતાવહી પ્રમાણીકરણ નોંધ",
    explainReasonPlaceholder: "ફેરફારનું કારણ સમજાવો (દા.ત. રોડ ટીમને મોકલવી)...",
    processingBtn: "પ્રક્રિયા થઈ રહી છે...",
    updateStatusBtn: "ફરિયાદ સ્થિતિ અપડેટ કરો",
    milestoneAuditTrail: "માઇલસ્ટોน ઓડિટ ટ્રેઇલ",
    bidirectionalChat: "દ્વિ-માર્ગી ચેટ",
    chatInputPlaceholder: "નાગરિકને સંદેશ લખો...",
    sendBtn: "મોકલો"
  },
  Punjabi: {
    backlogLabel: "ਮੇਰਾ ਅਧਿਕਾਰ ਖੇਤਰ ਬੈਕਲਾਗ",
    assignedTasks: "ਸੌਂਪੇ ਗਏ ਕੰਮ",
    criticalHotspots: "ਨਾਜ਼ੁਕ ਹੌਟਸਪੌਟ",
    urgentDispatch: "ਤੁਰੰਤ ਰਵਾਨਗੀ",
    fieldExecution: "ਫੀਲਡ ਐਗਜ਼ੀਕਿਊਸ਼ਨ ਵਿੱਚ",
    activeRepair: "ਸਰਗਰਮ ਮੁਰੰਮਤ",
    jurisdictionFilters: "ਅਧਿਕਾਰ ਖੇਤਰ ਫਿਲਟਰ:",
    allSectors: "ਸਾਰੇ ਖੇਤਰ",
    allStatuses: "ਸਾਰੀਆਂ ਸਥਿਤੀਆਂ",
    allSeverities: "ਸਾਰੀਆਂ ਗੰਭੀਰਤਾਵਾਂ",
    noComplaintsFiltered: "ਫਿਲਟਰ ਕੀਤੇ ਦ੍ਰਿਸ਼ ਵਿੱਚ ਕੋਈ ਸਰਗਰਮ ਸ਼ਿਕਾਇਤਾਂ ਨਹੀਂ ਹਨ।",
    gisHotspots: "ਜੀਆਈਐਸ ਅਧਿਕਾਰ ਖੇਤਰ ਹੌਟਸਪੌਟ",
    gisHotspotsDesc: "ਇੰਦੌਰ ਨਗਰਪਾਲਿਕਾ ਵਿੱਚ ਰਜਿਸਟਰਡ ਸਮੱਸਿਆਵਾਂ ਦਾ ਇੰਟਰਐਕਟਿਵ ਭੂਗੋਲਿਕ ਕਲਸਟਰ ਪਲਾਟ। ਟਿਕਟ ਦੀ ਜਾਣਕਾਰੀ ਦੇਖਣ ਲਈ ਬਿੰਦੂਆਂ ਦੀ ਚੋਣ ਕਰੋ।",
    closePanel: "ਪੈਨਲ ਬੰਦ ਕਰੋ",
    triageAnalysis: "ਵਰਗੀਕਰਨ ਵਿਸ਼ਲੇਸ਼ણ",
    originalGrievance: "ਅਸਲ ਸ਼ਿਕਾਇਤ ਇੰਦਰਾਜ਼",
    progressLifecycle: "⚠️ ਸ਼ਿਕਾਇত ਜੀਵਨ ਚੱਕਰ ਦੀ ਪ੍ਰਗਤੀ",
    setNewStatus: "ਨਵੀਂ ਸਥਿਤੀ ਸੈੱਟ ਕਰੋ",
    chooseStatus: "-- ਸਥਿਤੀ ਚੁਣੋ --",
    auditLedgerNote: "ਆਡਿਟ ਬਹੀ ਜਾਇਜ਼ਤਾ ਨੋਟ",
    explainReasonPlaceholder: "ਬਦਲਾਅ ਦਾ ਕਾਰਨ ਸਪੱਸ਼ਟ ਕਰੋ (ਜਿਵੇਂ ਕਿ ਸੜਕ ਟੀਮ ਭੇਜਣਾ)...",
    processingBtn: "ਪ੍ਰਕਿਰਿਆ ਜਾਰੀ ਹੈ...",
    updateStatusBtn: "ਸ਼ਿਕਾਇਤ ਦੀ ਸਥਿਤੀ ਅਪਡੇਟ ਕਰੋ",
    milestoneAuditTrail: "ਮੀਲ ਪੱਥਰ ਆਡਿਟ ਟ੍ਰੇਲ",
    bidirectionalChat: "ਦੋ-ਪਾਸੜ ਗੱਲਬਾਤ",
    chatInputPlaceholder: "ਨਾਗਰਿਕ ਨੂੰ ਸੁਨੇਹਾ ਲਿਖੋ...",
    sendBtn: "ਭੇਜੋ"
  },
  Odia: {
    backlogLabel: "මෝର ଅଧିକାର କ୍ଷේତ୍ରର ବକେୟା",
    assignedTasks: "ନ୍ୟସ୍ତ କାର୍ଯ୍ୟଗୁଡ଼ିକ",
    criticalHotspots: "ଗୁରୁତର ହଟସ୍ପଟ୍",
    urgentDispatch: "ତୁରନ୍ତ ପ୍ରେରଣ",
    fieldExecution: "କ୍ଷେତ୍ର କାର୍ଯ୍ୟକାରିତାରେ",
    activeRepair: "ସକ୍ରିୟ ମରାମତି",
    jurisdictionFilters: "ଅଧିକାର କ୍ଷେତ୍ର ଫିଲ୍ଟର୍:",
    allSectors: "ସମସ୍ତ ସେକ୍ଟର",
    allStatuses: "ସମସ୍ତ ସ୍ଥିତି",
    allSeverities: "ସମସ୍ତ ଗୁରୁତରତା",
    noComplaintsFiltered: "ଫିଲ୍ଟର୍ ହୋଇଥିବା ଭିଉରେ କୌଣସି ସକ୍ରିୟ ଅଭିଯୋଗ ନାହିଁ।",
    gisHotspots: "ଜିଆଇଏସ ଅଧିକାର କ୍ଷେତ୍ର ହଟସ୍ପଟ୍",
    gisHotspotsDesc: "ଇନ୍ଦୋର ମ୍ୟୁନିସିପାଲିଟିରେ ପଞ୍ଜୀକୃତ ସମସ୍ୟାର ଏକ ଇଣ୍ଟରାକ୍ଟିଭ୍ ଭୌଗୋଳିକ କ୍ଲଷ୍ଟର ପ୍ଲଟ୍। ଟ୍ରେକେଟ୍ ସୂଚନା ଯାଞ୍ଚ କରିବାକୁ ବିନ୍ଦୁଗୁଡ଼ିକୁ ଚୟନ କରନ୍ତୁ।",
    closePanel: "ପ୍ୟାନେଲ୍ ବନ୍ଦ କରନ୍ତୁ",
    triageAnalysis: "ଟ୍ରାଇଜ୍ ବିଶ୍ଳେଷଣ",
    originalGrievance: "ମୂଳ ଅଭିଯୋଗ ପ୍ରବେଶ",
    progressLifecycle: "⚠️ ଅଭିଯୋଗ ଜୀବନଚକ୍ର ଅଗ୍ରଗତି",
    setNewStatus: "ନୂତନ ସ୍ଥିତି ସେଟ୍ କରନ୍ତು",
    chooseStatus: "-- ସ୍ଥିତି ଚୟନ କରନ୍ତୁ --",
    auditLedgerNote: "ଅଡିଟ୍ ଲେଜର ଯଥାର୍ଥତା ନୋଟ୍",
    explainReasonPlaceholder: "ପରିବର୍ତ୍ତନର କାରଣ ସ୍ପଷ୍ଟ କରନ୍ତୁ (ଯେପରିକି, ସଡ଼କ ଦଳ ପଠାଇବା)...",
    processingBtn: "ପ୍ରକ୍ରିୟାକରଣ ଚାଲିଛି...",
    updateStatusBtn: "ଅଭିଯୋਗ ସ୍ଥିତି ଅପଡେଟ୍ କରନ୍ତು",
    milestoneAuditTrail: "මାଇଲଷ୍ଟෝන ଅଡିଟ୍ ଟ୍ରେଲ୍",
    bidirectionalChat: "ଦ୍ୱି-ମୁଖୀ ଚାଟ୍",
    chatInputPlaceholder: "ନାଗରିକଙ୍କୁ ବାର୍ତ୍ତା ଲେଖନ୍ତୁ...",
    sendBtn: "ପଠାନ୍ତୁ"
  },
  Assamese: {
    backlogLabel: "মোৰ কৰ্তৃত্বাধিকাৰৰ বাকী থকা কাম",
    assignedTasks: "আৱন্টিত কাৰ্যসমূহ",
    criticalHotspots: "গুৰুত্বপূৰ্ণ হটস্পট",
    urgentDispatch: "জৰুৰী প্ৰেৰণ",
    fieldExecution: "ক্ষেত্ৰ কাৰ্যকৰীকৰণত",
    activeRepair: "সক্ৰিয় মেৰামতি",
    jurisdictionFilters: "কৰ্তৃত্বাধিকাৰ ফিল্টাৰসমূহ:",
    allSectors: "সকলো ক্ষেত্ৰ",
    allStatuses: "সকলো স্থিতি",
    allSeverities: "সকলো গুৰুত্বতা",
    noComplaintsFiltered: "ফিল্টাৰ কৰা ভিউত কোনো সক্ৰিয় অভিযোগ নাই।",
    gisHotspots: "জিআইছ কৰ্তৃত্বাধিকাৰ হটস্পট",
    gisHotspotsDesc: "ইন্দোৰ পৌৰসভাত পঞ্জীয়ন কৰা সমস্যাসমূহৰ ক্ৰিয়া-প্ৰতিক্ৰিয়ামূলক ভৌগোলিক থুপ চিত্ৰ। টিকট তথ্য পৰীক্ষা কৰিবলৈ বিন্দুসমূহ বাছক।",
    closePanel: "পেনেল বন্ধ কৰক",
    triageAnalysis: "ট্ৰাইয়েজ বিশ্লেষণ",
    originalGrievance: "মূল অভিযোগ প্ৰৱেশ",
    progressLifecycle: "⚠️ অভিযোগ জীৱনচক্ৰৰ অগ্ৰগতি",
    setNewStatus: "নতুন স্থিতি নিৰ্ধাৰণ কৰক",
    chooseStatus: "-- স্থিতি বাছক --",
    auditLedgerNote: "অডিট লেজাৰ ঔচিত্য প্ৰমাণ পত্ৰ",
    explainReasonPlaceholder: "সলনিৰ কাৰণ ব্যাখ্যা কৰক (যেনে, পথ মেৰামতি কৰ্মী দল প্ৰেৰণ কৰা)...",
    processingBtn: "প্ৰক্ৰিয়াকৰণ কৰি থকা হৈছে...",
    updateStatusBtn: "অভিযোগৰ স্থিতি নবীকৰণ কৰক",
    milestoneAuditTrail: "মাইলষ্টোন অডিট পথ",
    bidirectionalChat: "দ্বিমুখী চাট",
    chatInputPlaceholder: "নাগরিকজনলৈ এটা বাৰ্তা লিখক...",
    sendBtn: "প্ৰেৰণ কৰক"
  },
  Urdu: {
    backlogLabel: "میرا دائرہ اختیار بقایا جات",
    assignedTasks: "تفویض کردہ کام",
    criticalHotspots: "اہم ہاٹ سپاٹ",
    urgentDispatch: "فوری ترسیل",
    fieldExecution: "فیلڈ میں عملدرآمد",
    activeRepair: "فعال مرمت",
    jurisdictionFilters: "دائرہ اختیار فلٹرز:",
    allSectors: "تمام شعبے",
    allStatuses: "تمام حالتیں",
    allSeverities: "تمام سنگینی",
    noComplaintsFiltered: "فلٹر شدہ منظر میں کوئی فعال شکایت نہیں ہے۔",
    gisHotspots: "جی آئی ایس دائرہ اختیار ہاٹ سپاٹ",
    gisHotspotsDesc: "اندور میونسپلٹی میں رجسٹرڈ مسائل کا انٹرایکٹو جغرافیائی کلسٹر پلاٹ۔ ٹکٹ کی معلومات چیک کرنے کے لیے نقطوں کو منتخب کریں۔",
    closePanel: "پینل بند کریں",
    triageAnalysis: "ٹرائیج تجزیہ",
    originalGrievance: "اصل شکایات کا اندراج",
    progressLifecycle: "⚠️ شکایت کا لائف سائیکل آگے بڑھائیں",
    setNewStatus: "نئی حالت متعین کریں",
    chooseStatus: "-- حالت منتخب کریں --",
    auditLedgerNote: "آڈٹ لیجر کے جواز کا نوٹ",
    explainReasonPlaceholder: "تبدیلی کی وجہ بتائیں (مثلاً روڈ ٹیم بھیجنا)...",
    processingBtn: "پروسیسنگ جاری ہے...",
    updateStatusBtn: "شکایت کی حالت اپ ڈیٹ کریں",
    milestoneAuditTrail: "اہم سنگ میل آڈٹ ٹریل",
    bidirectionalChat: "دو طرفہ بات چیت",
    chatInputPlaceholder: "شہری کو پیغام لکھیں...",
    sendBtn: "بھیجیں"
  }
};

interface OfficerDashboardProps {
  selectedLanguage?: string;
}

export default function OfficerDashboard({ selectedLanguage = "English" }: OfficerDashboardProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const ot = (key: string) => {
    const dict = OFFICER_LOCAL_TRANSLATIONS[selectedLanguage] || OFFICER_LOCAL_TRANSLATIONS.English;
    return dict[key] || OFFICER_LOCAL_TRANSLATIONS.English[key] || key;
  };
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Status Change State
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Chat message State
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const mapComplaints = complaints.map((c) => ({
    id: c.id,
    title: `${c.category}: ${c.description.slice(0, 50)}...`,
    latitude: c.location.latitude,
    longitude: c.location.longitude,
    severity: c.severity,
    onClick: () => setSelectedComplaint(c),
  }));

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, severityFilter, categoryFilter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let url = "/api/complaints?";
      if (statusFilter !== "all") url += `status=${statusFilter}&`;
      if (severityFilter !== "all") url += `severity=${severityFilter}&`;
      if (categoryFilter !== "all") url += `category=${categoryFilter}&`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints);
      }
    } catch (err) {
      console.error("Failed to load officer complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger Status change
  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !newStatus || !statusNote.trim()) return;

    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/complaints/${selectedComplaint.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: statusNote,
          updatedBy: "Rajesh Kumar (Sanitation Officer)",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedComplaint(data.complaint);
        setStatusNote("");
        setNewStatus("");
        fetchComplaints();
      }
    } catch (err) {
      console.error("Status modification failure:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Deliver Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedComplaint) return;

    setSendingMessage(true);
    try {
      const res = await fetch(`/api/complaints/${selectedComplaint.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "officer",
          senderName: "Rajesh Kumar (Sanitation Officer)",
          text: newMessage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedComplaint((prev) => prev ? { ...prev, messages: data.messages } : null);
        setNewMessage("");
        fetchComplaints();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSendingMessage(false);
    }
  };

  // Get status pill styling
  const getStatusBadge = (status: string) => {
    const base = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold leading-none uppercase font-mono ";
    switch (status) {
      case "Verified":
        return base + "bg-blue-50 text-blue-700 border border-blue-200";
      case "In Progress":
        return base + "bg-amber-50 text-amber-700 border border-amber-200";
      case "Resolved":
        return base + "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Closed":
        return base + "bg-slate-100 text-slate-600 border border-slate-200";
      default:
        return base + "bg-slate-50 text-slate-500";
    }
  };

  // Get severity badge styling
  const getSeverityBadge = (sev: Severity) => {
    const base = "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase font-mono ";
    switch (sev) {
      case "Low":
        return base + "bg-emerald-50 text-emerald-700";
      case "Medium":
        return base + "bg-amber-50 text-amber-700";
      case "High":
        return base + "bg-orange-50 text-orange-700";
      case "Emergency":
        return base + "bg-rose-100 text-rose-800 animate-pulse";
    }
  };

  // Quick statistics counters
  const totalCount = complaints.length;
  const highPriority = complaints.filter((c) => c.severity === "High" || c.severity === "Emergency").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      
      {/* Officer Summary Header KPIs */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            <span>{ot("backlogLabel")}</span>
            <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">{totalCount}</span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{ot("assignedTasks")}</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-500 font-mono">
            <span>{ot("criticalHotspots")}</span>
            <span className="text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full">{highPriority}</span>
          </div>
          <p className="mt-2 text-2xl font-black text-rose-600">{ot("urgentDispatch")}</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-500 font-mono">
            <span>{ot("fieldExecution")}</span>
            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">{inProgress}</span>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-600">{ot("activeRepair")}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: List + Filtering parameters */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4.5 w-4.5 text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">{ot("jurisdictionFilters")}</span>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {/* Category selector */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">{ot("allSectors")}</option>
                {SECTORS.map((sec) => (
                  <option key={sec} value={sec}>
                    {t(selectedLanguage, sec)}
                  </option>
                ))}
              </select>

              {/* Status Selector */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">{ot("allStatuses")}</option>
                <option value="Verified">{t(selectedLanguage, "Verified")}</option>
                <option value="In Progress">{t(selectedLanguage, "In Progress")}</option>
                <option value="Resolved">{t(selectedLanguage, "Resolved")}</option>
                <option value="Closed">{t(selectedLanguage, "Closed")}</option>
              </select>

              {/* Severity Selector */}
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">{ot("allSeverities")}</option>
                <option value="Low">{t(selectedLanguage, "Low")}</option>
                <option value="Medium">{t(selectedLanguage, "Medium")}</option>
                <option value="High">{t(selectedLanguage, "High")}</option>
                <option value="Emergency">{t(selectedLanguage, "Emergency")}</option>
              </select>
            </div>
          </div>

          {/* Grievance list details */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md">
            <h3 className="text-base font-black tracking-tight text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-sky-600" />
              {t(selectedLanguage, "assignedQueue")}
            </h3>

            {loading ? (
              <div className="space-y-3">
                <div className="h-16 rounded-xl bg-slate-50 animate-pulse"></div>
                <div className="h-16 rounded-xl bg-slate-50 animate-pulse"></div>
              </div>
            ) : complaints.length > 0 ? (
              <div className="space-y-3">
                {complaints.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedComplaint(c)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all flex items-start gap-3 hover:shadow-sm ${
                      selectedComplaint?.id === c.id
                        ? "border-sky-600 bg-sky-50/20"
                        : "border-slate-100 bg-white"
                    }`}
                  >
                    <div className="rounded-xl h-12 w-12 shrink-0 overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
                      {c.evidenceUrl ? (
                        <img src={c.evidenceUrl} className="h-full w-full object-cover" />
                      ) : (
                        <FileText className="h-5 w-5 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-extrabold text-sky-700">{c.id}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-semibold">
                          Filed by: {c.citizenName}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug truncate">{c.title}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.location.address}</p>
                      
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <span className={getStatusBadge(c.status)}>{c.status}</span>
                        <span className={getSeverityBadge(c.severity)}>{c.severity}</span>
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded capitalize">
                          {c.areaType} Zone
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 self-center" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="mt-2 text-xs font-semibold text-slate-400">{ot("noComplaintsFiltered")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: GIS Hotspots placement map */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md space-y-4">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <MapPin className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
              {ot("gisHotspots")}
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              {ot("gisHotspotsDesc")}
            </p>

            <InteractiveGmpMap
              latitude={complaints[0]?.location.latitude || 22.7196}
              longitude={complaints[0]?.location.longitude || 75.8577}
              onPositionChange={() => {}}
              height="256px"
              readOnly={true}
              selectedLanguage={selectedLanguage}
              multipleComplaints={mapComplaints}
            />
          </div>
        </div>
      </div>

      {/* Ticket Management Detailed Drawer */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="font-mono text-xs font-extrabold text-sky-700">{selectedComplaint.id}</span>
                  <h3 className="text-base font-black text-slate-900 mt-1">{selectedComplaint.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  {ot("closePanel")}
                </button>
              </div>

              {/* Status and Severity Badge Row */}
              <div className="mb-6 flex flex-wrap gap-2 items-center">
                <span className={getStatusBadge(selectedComplaint.status)}>{t(selectedLanguage, selectedComplaint.status)}</span>
                <span className={getSeverityBadge(selectedComplaint.severity)}>{t(selectedLanguage, selectedComplaint.severity)}</span>
                <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded capitalize">
                  {t(selectedLanguage, selectedComplaint.areaType)} {t(selectedLanguage, "zone")}
                </span>
                <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded">
                  {t(selectedLanguage, selectedComplaint.category)}
                </span>
              </div>

              {/* Photos & AI triage */}
              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                {selectedComplaint.evidenceUrl && (
                  <div className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 max-h-40 flex items-center justify-center">
                    <img src={selectedComplaint.evidenceUrl} className="max-h-40 object-contain" />
                  </div>
                )}

                {selectedComplaint.aiVerification && (
                  <div className="rounded-2xl bg-indigo-50/50 border border-indigo-100 p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-indigo-800">
                      <Bot className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider font-mono">{ot("triageAnalysis")}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-700 font-medium">
                      *Summary:* {selectedComplaint.aiSummary || selectedComplaint.description}
                    </p>
                    <p className="text-[10px] text-indigo-700 font-semibold">
                      Reason: {selectedComplaint.aiVerification.reason}
                    </p>
                  </div>
                )}
              </div>

              {/* Original complaint text */}
              <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-100 mb-6">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">{ot("originalGrievance")}</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium mt-1">{selectedComplaint.description}</p>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  <span>{selectedComplaint.location.address} (Pincode: {selectedComplaint.location.pincode})</span>
                </div>
              </div>

              {/* Status Update Form */}
              {selectedComplaint.status !== "Closed" && (
                <div className="rounded-2xl border border-sky-100 bg-sky-50/30 p-5 mb-6 space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 font-mono">
                    {ot("progressLifecycle")}
                  </span>

                  <form onSubmit={handleStatusChange} className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">{ot("setNewStatus")}</span>
                        <select
                          required
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold outline-none"
                        >
                          <option value="">{ot("chooseStatus")}</option>
                          <option value="In Progress">{t(selectedLanguage, "In Progress")}</option>
                          <option value="Resolved">{t(selectedLanguage, "Resolved")}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">{ot("auditLedgerNote")}</span>
                      <input
                        type="text"
                        required
                        placeholder={ot("explainReasonPlaceholder")}
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={updatingStatus || !newStatus || !statusNote.trim()}
                      className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      {updatingStatus ? ot("processingBtn") : ot("updateStatusBtn")}
                    </button>
                  </form>
                </div>
              )}

              {/* Status Milestone History Timeline */}
              <div className="mb-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">{ot("milestoneAuditTrail")}</h4>
                <div className="relative pl-6 space-y-4 border-l-2 border-slate-100">
                  {selectedComplaint.statusHistory.map((hist, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[31px] top-0.5 rounded-full h-3 w-3 bg-sky-600 border-2 border-white"></div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-800">{t(selectedLanguage, hist.status)}</span>
                        <span className="ml-2 font-mono text-[9px] text-slate-400">
                          {new Date(hist.timestamp).toLocaleString()}
                        </span>
                        <p className="mt-1 text-slate-500 text-[11px] leading-relaxed font-medium">{hist.note}</p>
                        <span className="text-[9px] text-slate-400 italic">Signed: {hist.updatedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom: Bi-directional chat */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-sky-700" />
                {ot("bidirectionalChat")}
              </h4>

              <div className="h-48 overflow-y-auto mb-3 bg-slate-50/50 rounded-2xl p-4 border border-slate-50 space-y-3">
                {selectedComplaint.messages.map((m) => {
                  const isOfficer = m.sender === "officer";
                  return (
                    <div key={m.id} className={`flex flex-col ${isOfficer ? "items-end" : "items-start"}`}>
                      <span className="text-[9px] text-slate-400 font-semibold mb-0.5">{m.senderName}</span>
                      <div className={`rounded-2xl px-3 py-1.5 text-[11px] leading-relaxed max-w-[85%] font-medium ${
                        isOfficer ? "bg-sky-600 text-white" : "bg-white text-slate-700 border border-slate-100"
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedComplaint.status !== "Closed" && (
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder={ot("chatInputPlaceholder")}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim()}
                    className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 text-xs transition-all"
                  >
                    {ot("sendBtn")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
