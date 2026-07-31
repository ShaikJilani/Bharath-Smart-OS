import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, User, HelpCircle, Mic, MicOff, Paperclip, X, FileText } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  file?: {
    name: string;
    url: string;
    type: string;
  };
}

interface AiAssistantProps {
  selectedLanguage: string;
}

const LOCAL_ASSISTANT_TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    welcomeMsg: "Namaste! I am your Bharat Smart OS Agentic Assistant. I can help classify your civic complaints, draft professional reports, or explain local governance rules. What problem are you experiencing today?",
    nodeLabel: "Autonomous Agentic Node",
    agentTitle: "Digital Governance Support Agent",
    agentSubtitle: "Ask questions, understand regulations, or get help with complex complaint categories.",
    agentHeader: "Bharat OS Agent (Gemini Core Engine)",
    reasoning: "AI Agent is reasoning",
    suggestionsLabel: "Suggestions:",
    sugPothole: "How long does pothole repair take in rural areas?",
    sugPotholeLabel: "Pothole SLA?",
    sugPrivacy: "Are drainage reports kept private?",
    sugPrivacyLabel: "Identity Privacy?",
    sugLeak: "How to write a professional street water leakage report?",
    sugLeakLabel: "Draft a Leakage Report",
    micListening: "Listening to your voice...",
    placeholder: "Ask anything about municipal services...",
    errText: "I encountered a routing latency in communication. Please check your internet connectivity or write your request again."
  },
  Hindi: {
    welcomeMsg: "नमस्ते! मैं आपका भारत स्मार्ट ओएस एआई सहायक हूँ। मैं आपकी शिकायतों को वर्गीकृत करने, पेशेवर रिपोर्ट तैयार करने या स्थानीय शासन के नियमों को समझाने में मदद कर सकता हूँ। आज आप किस समस्या का सामना कर रहे हैं?",
    nodeLabel: "स्वायत्त एआई नोड",
    agentTitle: "डिजिटल शासन सहायता एजेंट",
    agentSubtitle: "प्रश्न पूछें, नियमों को समझें या जटिल शिकायत श्रेणियों में सहायता प्राप्त करें।",
    agentHeader: "भारत स्मार्ट ओएस एजेंट (जेमिनी कोर इंजन)",
    reasoning: "एआई एजेंट सोच रहा है",
    suggestionsLabel: "सुझाव:",
    sugPothole: "ग्रामीण क्षेत्रों में सड़क के गड्ढों की मरम्मत में कितना समय लगता है?",
    sugPotholeLabel: "गड्ढे की समय सीमा?",
    sugPrivacy: "क्या ड्रेनेज शिकायतें निजी रखी जाती हैं?",
    sugPrivacyLabel: "पहचान की गोपनीयता?",
    sugLeak: "सड़क पर पानी के रिसाव की शिकायत का पेशेवर मसौदा कैसे तैयार करें?",
    sugLeakLabel: "पानी रिसाव रिपोर्ट",
    micListening: "आपकी आवाज़ सुन रहा हूँ...",
    placeholder: "नगर पालिका सेवाओं के बारे में कुछ भी पूछें...",
    errText: "मुझे संचार में कुछ समस्या आ रही है। कृपया अपना इंटरनेट कनेक्शन जांचें या फिर से प्रयास करें।"
  },
  Telugu: {
    welcomeMsg: "నమస్తే! నేను మీ భారత్ స్మార్ట్ ఓఎస్ ఏఐ అసిస్టెంట్‌ని. మీ పౌర ఫిర్యాదులను వర్గీకరించడంలో, ప్రొఫెషనల్ నివేదికలను సిద్ధం చేయడంలో లేదా స్థానిక పాలన నియమాలను వివరించడంలో నేను సహాయపడగలను. ఈ రోజు మీరు ఏ సమస్యను ఎదుర్కొంటున్నారు?",
    nodeLabel: "స్వయంప్రతిపత్తి ఏఐ నోడ్",
    agentTitle: "డిజిటల్ గవర్నెన్స్ సహాయ ఏజెంట్",
    agentSubtitle: "ప్రశ్నలు అడగండి, నిబంధనలను అర్థం చేసుకోండి లేదా సంక్లిష్టమైన ఫిర్యాదు విభాగాలలో సహాయం పొందండి.",
    agentHeader: "భారత్ స్మార్ట్ ఓఎస్ ఏజెంట్ (జెమిని కోర్ ఇంజిన్)",
    reasoning: "ఏఐ ఏజెంట్ ఆలోచిస్తోంది",
    suggestionsLabel: "సూచనలు:",
    sugPothole: "గ్రాಮೀణ ప్రాంతాలలో రోడ్డు గుంతల మరమ్మత్తుకు ఎంత సమయం పడుతుంది?",
    sugPotholeLabel: "గుంతల పరిష్కార సమయం?",
    sugPrivacy: "డ్రైనేజీ ఫిర్యాదులు రహస్యంగా ఉంచబడతాయా?",
    sugPrivacyLabel: "వ్యక్తిగత గోప్యత?",
    sugLeak: "వీధి నీటి లీకేజీ గురించి ప్రొఫెషనల్ నివేదికను ఎలా రాయాలి?",
    sugLeakLabel: "నీటి లీకేజీ రిపోర్ట్",
    micListening: "మీ వాయిస్ వింటున్నాను...",
    placeholder: "మునిసిపల్ సేవల గురించి ఏదైనా అడగండి...",
    errText: "కమ్యూనికేషన్‌లో అడ్డంకులు ఏర్పడ్డాయి. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్‌ని తనిఖీ చేసి, మళ్లీ ప్రయత్నించండి."
  },
  Tamil: {
    welcomeMsg: "வணக்கம்! நான் உங்கள் பாரத் ஸ்மார்ட் ஓஎஸ் ஏআই உதவியாளர். உங்கள் குடிமைப் புகார்களை வகைப்படுத்தவும், தொழில்முறை அறிக்கைகளை உருவாக்கவும் அல்லது உள்ளூர் நிர்வாக விதிகளை விளக்கவும் நான் உங்களுக்கு உதவ முடியும். இன்று நீங்கள் என்ன சிக்கலை எதிர்கொள்கிறீர்கள்?",
    nodeLabel: "தன்னாட்சி ஏআই முனை",
    agentTitle: "டிஜிட்டல் நிர்வாக ஆதரவு முகவர்",
    agentSubtitle: "கேள்விகள் கேட்கவும், விதிமுறைகளைப் புரிந்து கொள்ளவும் அல்லது சிக்கலான புகார் வகைகளில் உதவி பெறவும்.",
    agentHeader: "பாரத் ஸ்மார்ட் ஓஎஸ் முகவர் (ஜெமினி கோர் இன்ஜின்)",
    reasoning: "ஏஐ முகவர் சிந்திக்கிறார்",
    suggestionsLabel: "பரிந்துரைகள்:",
    sugPothole: "கிராமப்புறங்களில் சாலைக் குழிகளை சரிசெய்ய எவ்வளவு நேரம் ஆகும்?",
    sugPotholeLabel: "சாலைக்குழி காலக்கெடு?",
    sugPrivacy: "வடிகால் புகார்கள் ரகசியமாக வைக்கப்படுமா?",
    sugPrivacyLabel: "அடையாள தனியுரிமை?",
    sugLeak: "தெரு நீர் கசிவு பற்றிய முறையான அறிக்கையை எவ்வாறு எழுதுவது?",
    sugLeakLabel: "நீர் கசிவு அறிக்கை",
    micListening: "உங்கள் குரலைக் கேட்கிறது...",
    placeholder: "நகராட்சி சேவைகள் பற்றி எதுவும் கேளுங்கள்...",
    errText: "தொடர்பு கொள்வதில் சிக்கல் ஏற்பட்டது. தயவுசெய்து உங்கள் இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்."
  },
  Kannada: {
    welcomeMsg: "ನಮಸ್ತೆ! ನಾನು ನಿಮ್ಮ ಭಾರತ ಸ್ಮಾರ್ಟ್ ಓಎಸ್ ಎಐ ಸಹಾಯಕ. ನಿಮ್ಮ ದೂರುಗಳನ್ನು ವರ್ಗೀಕರಿಸಲು, ವರದಿಗಳನ್ನು ತಯಾರಿಸಲು ಅಥವಾ ಸ್ಥಳೀಯ ಆಡಳಿತದ ನಿಯಮಗಳನ್ನು ವಿವರಿಸಲು ನಾನು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ಇಂದು ನೀವು ಯಾವ ಸಮಸ್ಯೆಯನ್ನು ಎದುರಿಸುತ್ತಿದ್ದೀರಿ?",
    nodeLabel: "ಸ್ವಾಯತ್ತ ಎಐ ನೋಡ್",
    agentTitle: "ಡಿಜಿಟಲ್ ಆಡಳಿತ ಸಹಾಯ ಏಜೆಂಟ್",
    agentSubtitle: "ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ, ನಿಯಮಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ ಅಥವಾ ಸಂಕೀರ್ಣ ದೂರು ವರ್ಗಗಳಲ್ಲಿ ಸಹಾಯ ಪಡೆಯಿರಿ.",
    agentHeader: "ಭಾರತ ಸ್ಮಾರ್ಟ್ ಓಎಸ್ ಏಜೆಂಟ್ (ಜೆಮಿನಿ ಕೀಲ್ ಎಂಜಿನ್)",
    reasoning: "ಎಐ ಏಜೆಂಟ್ ಯೋಚಿಸುತ್ತಿದೆ",
    suggestionsLabel: "ಸಲಹೆಗಳು:",
    sugPothole: "ಗ್ರಾಮೀಣ ಪ್ರದೇಶಗಳಲ್ಲಿ ರಸ್ತೆ ಗುಂಡಿ ದುರಸ್ತಿಗೆ ಎಷ್ಟು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ?",
    sugPotholeLabel: "ಗುಂಡಿ ದುರಸ್ತಿ ಸಮಯ?",
    sugPrivacy: "ಒಳಚರಂಡಿ ದೂರುಗಳನ್ನು ಖಾಸಗಿಯಾಗಿ ಇಡಲಾಗುತ್ತದೆಯೇ?",
    sugPrivacyLabel: "ಖಾಸಗಿತನ?",
    sugLeak: "ರಸ್ತೆ ನೀರಿನ ಸೋರಿಕೆಯ ಬಗ್ಗೆ ವೃತ್ತಿಪರ ವರದಿಯನ್ನು ಹೇಗೆ ಬರೆಯುವುದು?",
    sugLeakLabel: "ನೀರು ಸೋರಿಕೆ ವರದಿ",
    micListening: "ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
    placeholder: "ಪುರಸಭೆಯ ಸೇವೆಗಳ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ...",
    errText: "ಸಂಪರ್ಕದಲ್ಲಿ ದೋಷ ಕಂಡುಬಂದಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
  },
  Malayalam: {
    welcomeMsg: "നമസ്തേ! ഞാൻ നിങ്ങളുടെ ഭാരത് സ്മാർട്ട് ഒഎസ് എഐ അസിസ്റ്റന്റാണ്. നിങ്ങളുടെ പരാതികൾ തരംതിരിക്കാനും റിപ്പോർട്ടുകൾ തയ്യാറാക്കാനും പ്രാദേശിക ഭരണ നിയമങ്ങൾ വിശദീകരിക്കാനും എനിക്ക് സഹായിക്കാനാകും. ഇന്ന് നിങ്ങൾ നേരിടുന്ന പ്രശ്നം എന്താണ്?",
    nodeLabel: "സ്വയംഭരണ എഐ നോഡ്",
    agentTitle: "ഡിജിറ്റൽ ഗവേണൻസ് സഹായ ഏജന്റ്",
    agentSubtitle: "ചോദ്യങ്ങൾ ചോദിക്കുക, നിയമങ്ങൾ മനസ്സിലാക്കുക അല്ലെങ്കിൽ സങ്കീർണ്ണമായ പരാതി വിഭാഗങ്ങളിൽ സഹായം നേടുക.",
    agentHeader: "ഭാരത് സ്മാർട്ട് ഒഎസ് ഏജന്റ് (ജെമിനി കോർ എഞ്ചിൻ)",
    reasoning: "എഐ ഏജന്റ് ചിന്തിക്കുന്നു",
    suggestionsLabel: "നിർദ്ദേശങ്ങൾ:",
    sugPothole: "ഗ്രാമീണ മേഖലകളിൽ റോഡിലെ കുഴികൾ അടയ്ക്കാൻ എത്ര സമയമെടുക്കും?",
    sugPotholeLabel: "റോഡിലെ കുഴി പരിഹാര സമയം?",
    sugPrivacy: "ഡ്രെയിനേജ് റിപ്പോർട്ടുകൾ രഹസ്യമായി സൂക്ഷിക്കുമോ?",
    sugPrivacyLabel: "വ്യക്തിഗത രഹസ്യസ്വഭാവം?",
    sugLeak: "റോഡിലെ ജലച്ചോർച്ചയെക്കുറിച്ച് ഒരു പ്രൊഫഷണൽ റിപ്പോർട്ട് എങ്ങനെ തയ്യാറാക്കാം?",
    sugLeakLabel: "जലച്ചോർച്ച റിപ്പോർട്ട്",
    micListening: "നിങ്ങളുടെ ശബ്ദം കേൾക്കുന്നു...",
    placeholder: "മുനിസിപ്പൽ സേവനങ്ങളെക്കുറിച്ച് എന്തും ചോദിക്കാം...",
    errText: "ആശയവിനിമയത്തിൽ തടസ്സം നേരിട്ടു. ദയവായി നിങ്ങളുടെ ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിക്കുക അല്ലെങ്കിൽ വീണ്ടും ശ്രമിക്കുക."
  },
  Marathi: {
    welcomeMsg: "नमस्ते! मी तुमचा भारत स्मार्ट ओएस एआय सहाय्यक आहे. मी तुमच्या तक्रारींचे वर्गीकरण करण्यात, अहवाल तयार करण्यात किंवा स्थानिक प्रशासनाचे नियम समजावून सांगण्यात मदत करू शकतॊ. आज तुम्हाला कोणती समस्या येत आहे?",
    nodeLabel: "स्वायत्त एआय नोड",
    agentTitle: "डिजिटल गव्हर्नन्स मदत एजंट",
    agentSubtitle: "प्रश्न विचारा, नियम समजून घ्या किंवा जटिल तक्रार श्रेणींमध्ये मदत मिळवा.",
    agentHeader: "भारत स्मार्ट ओएस एजंट (जेमिनी कोर इंजिन)",
    reasoning: "एआय एजंट विचार करत आहे",
    suggestionsLabel: "सुझाव:",
    sugPothole: "ग्रामीण भागात रस्त्यावरील खड्डे दुरुस्त करायला किती वेळ लागतो?",
    sugPotholeLabel: "खड्डे दुरुस्ती कालावधी?",
    sugPrivacy: "ड्रेनेज तक्रारी गोपनीय ठेवल्या जातात का?",
    sugPrivacyLabel: "गोपनीयता?",
    sugLeak: "रस्त्यावरील पाणी गळतीबाबत व्यावसायिक अहवाल कसा लिहायचा?",
    sugLeakLabel: "पाणी गळती अहवाल",
    micListening: "तुमचा आवाज ऐकत आहे...",
    placeholder: "नगरपालिका सेवांबद्दल काहीही विचारा...",
    errText: "संपर्कात अडथळा आला आहे. कृपया तुमचे इंटरनेट कनेक्शन तपासा किंवा पुन्हा प्रयत्न करा."
  },
  Bengali: {
    welcomeMsg: "নমস্তে! আমি আপনার ভারত স্মার্ট ওএস এআই সহকারী। আমি আপনার অভিযোগ শ্রেণীবদ্ধ করতে, পেশাদার প্রতিবেদন তৈরি করতে বা স্থানীয় শাসনের নিয়মগুলি ব্যাখ্যা করতে সাহায্য করতে পারি। আজ আপনি কী সমস্যার সম্মুখীন হচ্ছেন?",
    nodeLabel: "স্বায়ত্তশাসিত এআই নোড",
    agentTitle: "ডিজিটাল গভর্নেন্স সহায়তা এজেন্ট",
    agentSubtitle: "প্রশ্ন জিজ্ঞাসা করুন, নিয়মগুলি বুঝুন বা জটিল অভিযোগ বিভাগে সাহায্য পান।",
    agentHeader: "ভারত স্মার্ট ওএস এজেন্ট (জেমিনি কোর ইঞ্জিন)",
    reasoning: "এআই সহকারী চিন্তা করছে",
    suggestionsLabel: "পরামর্শসমূহ:",
    sugPothole: "গ্রামীণ এলাকায় রাস্তার গর্ত মেরামত করতে কত সময় লাগে?",
    sugPotholeLabel: "গর্ত মেরামতের সময়?",
    sugPrivacy: "ড্রেনেজ অভিযোগ কি গোপন রাখা হয়?",
    sugPrivacyLabel: "ব্যক্তিগত গোপনীয়তা?",
    sugLeak: "রাস্তায় জল ফুটো সংক্রান্ত একটি পেশাদার প্রতিবেদন কীভাবে লিখবেন?",
    sugLeakLabel: "জল ফুটো প্রতিবেদন",
    micListening: "আপনার কথা শোনা হচ্ছে...",
    placeholder: "পৌরসভা পরিষেবা সম্পর্কে কিছু জিজ্ঞাসা করুন...",
    errText: "যোগাযোগে ত্রুটি দেখা দিয়েছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন বা আবার চেষ্টা করুন।"
  },
  Gujarati: {
    welcomeMsg: "નમસ્તે! હું તમારો ભારત સ્માર્ટ ઓએસ એઆઈ સહાયક છું. હું તમારી ફરિયાદોનું વર્ગીકરણ કરવા, અહેવાલો તૈયાર કરવા અથવા સ્થાનિક વહીવટના નિયમો સમજાવવામાં મદદ કરી શકું છું. આજે તમને કઈ સમસ્યા આવી રહી છે?",
    nodeLabel: "સ્વાયત્ત એઆઈ નોડ",
    agentTitle: "ડિજિટલ ગવર્નન્સ સહાય એજન્ટ",
    agentSubtitle: "પ્રશ્નો પૂછો, નિયમો સમજો અથવા જટિલ ફરિયાદ શ્રેણીઓમાં મદદ મેળવો.",
    agentHeader: "ભારત સ્માર્ટ ઓએસ એજન્ટ (જેમિની કોર એન્જિન)",
    reasoning: "એઆઈ એજન્ટ વિચારી રહ્યો છે",
    suggestionsLabel: "સૂચનો:",
    sugPothole: "ગ્રામીણ વિસ્તારોમાં રસ્તાના ખાડા રિપેર કરવામાં કેટલો સમય લાગે છે?",
    sugPotholeLabel: "ખાડા રિપેર સમય?",
    sugPrivacy: "શું ડ્રેનેજ ફરિયાદો ખાનગી રાખવામાં આવે છે?",
    sugPrivacyLabel: "ખાનગીતા?",
    sugLeak: "રસ્તા પર પાણીના લીકેજ અંગે વ્યાવસાયિક અહેવાલ કેવી રીતે લખવો?",
    sugLeakLabel: "પાણી લીકેજ રિપોર્ટ",
    micListening: "તમારો અવાજ સાંભળી રહ્યો છે...",
    placeholder: "મ્યુનિસિપલ સેવાઓ વિશે કંઈપણ પૂછો...",
    errText: "સંપર્કમાં અવરોધ આવ્યો છે. કૃપા કરીને તમારું ઇન્ટરનેટ કનેક્શન તપાસો અથવા ફરીથી પ્રયાસ કરો."
  },
  Punjabi: {
    welcomeMsg: "ਨਮਸਤੇ! ਮੈਂ ਤੁਹਾਡਾ ਭਾਰਤ ਸਮਾਰਟ ਓਐਸ ਏਆਈ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਨੂੰ ਸ਼੍ਰੇਣੀਬੱਧ ਕਰਨ, ਰਿਪੋਰਟਾਂ ਤਿਆਰ ਕਰਨ ਜਾਂ ਸਥਾਨਕ ਪ੍ਰਸ਼ਾਸਨ ਦੇ ਨਿਯਮਾਂ ਨੂੰ ਸਮਝਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਤੁਸੀਂ ਕਿਸ ਸਮੱਸਿਆ ਦਾ ਸਾਹਮਣਾ ਕਰ ਰਹੇ ਹੋ?",
    nodeLabel: "ਖੁਦਮੁਖਤਿਆਰ ਏਆਈ ਨੋਡ",
    agentTitle: "ਡਿਜੀਟਲ ਗਵਰਨੈਂਸ ਸਹਾਇਤਾ ਏਜੰਟ",
    agentSubtitle: "ਸਵਾਲ ਪੁੱਛੋ, ਨਿਯਮਾਂ ਨੂੰ ਸਮਝੋ ਜਾਂ ਗੁੰਝਲਦਾਰ ਸ਼ਿਕਾਇਤ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚ ਮਦਦ ਪ੍ਰਾਪਤ ਕਰੋ।",
    agentHeader: "ਭਾਰਤ ਸਮਾਰਟ ਓਐਸ ਏਜੰਟ (ਜੇਮਿਨੀ ਕੋਰ ਇੰਜਨ)",
    reasoning: "ਏਆਈ ਏਜੰਟ ਸੋਚ ਰਿਹਾ ਹੈ",
    suggestionsLabel: "ਸੁਝਾਅ:",
    sugPothole: "ਪੇਂਡੂ ਖੇਤਰਾਂ ਵਿੱਚ ਸੜਕ ਦੇ ਟੋਇਆਂ ਦੀ ਮੁਰੰਮਤ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗਦਾ ਹੈ?",
    sugPotholeLabel: "ਟੋਇਆਂ ਦੀ ਮੁਰੰਮਤ ਦਾ ਸਮਾਂ?",
    sugPrivacy: "ਕੀ ਡਰੇਨੇਜ ਰਿਪੋਰਟਾਂ ਗੁਪਤ ਰੱਖੀਆਂ ਜਾਂਦੀਆਂ ਹਨ?",
    sugPrivacyLabel: "ਨਿੱਜੀ ਗੁਪਤਤਾ?",
    sugLeak: "ਸੜਕ 'ਤੇ ਪਾਣੀ ਦੇ ਲੀਕੇਜ ਬਾਰੇ ਇੱਕ ਪੇਸ਼ੇਵਰ ਰਿਪੋਰਟ ਕਿਵੇਂ ਲਿਖੀਏ?",
    sugLeakLabel: "ਪਾਣੀ ਲੀਕੇਜ ਰਿਪੋਰਟ",
    micListening: "ਤੁਹਾਡੀ ਆਵਾਜ਼ ਸੁਣੀ ਜਾ ਰਹੀ ਹੈ...",
    placeholder: "ਮਿਉਂਸਪਲ ਸੇਵਾਵਾਂ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ...",
    errText: "ਸੰਚਾਰ ਵਿੱਚ ਕੋਈ ਸਮੱਸਿਆ ਆਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਇੰਟਰਨੈਟ ਕਨੈਕਸ਼ਨ ਚੈੱਕ ਕਰੋ ਜਾਂ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"
  },
  Odia: {
    welcomeMsg: "ନମସ୍ତେ! ମୁଁ ଆପଣଙ୍କର ଭାରତ ସ୍ମାର୍ଟ ଓଏସ ଏଆଇ ସହାୟକ। ମୁଁ ଆପଣଙ୍କର ଅଭିଯୋଗଗୁଡ଼ିକୁ ଶ୍ରେଣୀଭୁକ୍ତ କରିବାରେ, ରିପୋର୍ଟ ପ୍ରସ୍ତୁତ କରିବାରେ କିମ୍ବା ସ୍ଥାନୀୟ ଶାସନ ନିୟମ ବୁଝାଇବାରେ ସାହାଯ୍ୟ କରିପାରିବି। ଆଜି ଆପଣ କେଉଁ ସମସ୍ୟାର ସମ୍ମୁଖୀନ ହେଉଛନ୍ତି?",
    nodeLabel: "ସ୍ୱୟଂଚାଳିତ ଏଆଇ ନୋଡ୍",
    agentTitle: "ଡିଜିଟାଲ୍ ଶାସନ ସହାୟତା ଏଜେଣ୍ଟ",
    agentSubtitle: "ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ, ନିୟମ ବୁଝନ୍ତୁ କିମ୍ବା ଜଟିଳ ଅଭିଯୋଗ ଶ୍ରେଣୀରେ ସାହାଯ୍ୟ ପାଆନ୍ତୁ ।",
    agentHeader: "ଭାରତ ସ୍ମାର୍ଟ ଓଏସ ଏଜେଣ୍ଟ (ଜେମିନି କୋର୍ ଇଞ୍ଜିନ୍)",
    reasoning: "ଏଆଇ ଏଜେଣ୍ଟ ଚିନ୍ତା କରୁଛି",
    suggestionsLabel: "ପରାମର୍ଶ:",
    sugPothole: "ଗ୍ରାମାଞ୍ଚଳରେ ରାସ୍ତା ଖାଲ ମରାମତି ପାଇଁ କେତେ ସମୟ ଲାଗେ?",
    sugPotholeLabel: "ଖାଲ ମରାମତି ସମୟ?",
    sugPrivacy: "ଡ୍ରେନେଜ୍ ଅଭିଯୋଗଗୁଡିକ ଗୋପନୀୟ ରଖାଯାଏ କି?",
    sugPrivacyLabel: "ବ୍ୟକ୍ତିଗତ ଗୋପନୀୟତା?",
    sugLeak: "ରାସ୍ତାରେ ଜଳ ନିଷ୍କାସନ ଲିକ୍ ସମ୍ବନ୍ଧରେ ଏକ ବ୍ୟବସାୟିକ ରିପୋର୍ଟ କିପରି ଲେଖିବେ?",
    sugLeakLabel: "ଜଳ ଲିକ୍ ରିପୋର୍ଟ",
    micListening: "ଆପଣଙ୍କ ସ୍ୱର ଶୁଣୁଛି...",
    placeholder: "ପୌରସେବା ବିଷୟରେ କିଛି ବି ପଚାରନ୍ତୁ...",
    errText: "ଯୋଗାଯୋଗରେ ତ୍ରୁଟି ଦେଖାଦେଇଛି। ଦୟାକରି ଆପଣଙ୍କର ଇଣ୍ଟରନେଟ୍ ସଂଯୋਗ ଯାଞ୍ಚ କରନ୍ତು କିମ୍ବା ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ ।"
  },
  Assamese: {
    welcomeMsg: "নমস্কাৰ! মই আপোনাৰ ভাৰত স্মাৰ্ট অ'এছ এআই সহায়ক। মই আপোনাৰ অভিযোগসমূহ শ্ৰেণীভুক্ত কৰাত, প্ৰতিবেদন প্ৰস্তুত কৰাত বা স্থানীয় শাসনৰ নিয়মসমূহ বুজাই দিয়াত সহায় কৰিব পাৰোঁ। আজি আপুনি কি সমস্যাৰ সন্মুখীন হৈছে?",
    nodeLabel: "স্বয়ংক্ৰিয় এআই নোড",
    agentTitle: "ডিজিটেল প্ৰশাসন সহায়ক বিষয়া",
    agentSubtitle: "প্ৰশ্ন সোধক, নিয়মসমূহ বুজি লওক বা জটিল অভিযোগৰ শ্ৰেণীসমূহত সহায় লাভ কৰক।",
    agentHeader: "ভাৰত স্মাৰ্ট অ'এছ এজেণ্ট (জেমিনি ক'ৰ ইঞ্জিন)",
    reasoning: "এআই সহায়কে চিন্তা কৰি আছে",
    suggestionsLabel: "পৰামৰ্শসমূহ:",
    sugPothole: "গ্ৰাম্য অঞ্চলত পথৰ খন্দা মেৰামতি কৰিবলৈ কিমান সময় লাগে?",
    sugPotholeLabel: "পথৰ মেৰামতিৰ সময়?",
    sugPrivacy: "নলা-নৰ্দমাৰ অভিযোগসমূহ গোপনীয় কৰা হয়নে?",
    sugPrivacyLabel: "গোপনীয়তা?",
    sugLeak: "পথত পানী নিৰ্গমনৰ সম্পৰ্কে এটা পেচাদাৰী প্ৰতিবেদন কেনেকৈ লিখিব?",
    sugLeakLabel: "পানী নিৰ্গমন প্ৰতিবেদন",
    micListening: "আপোনাৰ মাত শুনি থকা হৈছে...",
    placeholder: "पौৰসেৱা সম্পৰ্কে যিকোনো কথা সোধক...",
    errText: "সংযোগ স্থাপনত সমস্যা হৈছে। অনুগ্ৰহ কৰি আপোনাৰ ইণ্টাৰনেট সংযোগ পৰীক্ষা কৰক বা আকৌ চেষ্টা কৰক।"
  },
  Urdu: {
    welcomeMsg: "سلام! میں آپ کا بھارت سمارٹ او ایس اے آئی معاون ہوں۔ میں آپ کی شکایات کی درجہ بندی کرنے، پیشہ ورانہ رپورٹ تیار کرنے، یا مقامی حکمرانی کے قوانین کی وضاحت کرنے میں مدد کر سکتا ہوں۔ آج آپ کو کس مسئلے کا سامنا ہے؟",
    nodeLabel: "خود مختار اے آئی نوڈ",
    agentTitle: "ڈیجیٹل گورننس سپورٹ ایجنٹ",
    agentSubtitle: "سوالات پوچھیں، قوانین کو سمجھیں، یا پیچیدہ شکایات کے زمرے میں مدد حاصل کریں۔",
    agentHeader: "بھارت سمارٹ او ایس ایجنٹ (جیمینی کور انجن)",
    reasoning: "اے آئی ایجنٹ سوچ رہا ہے",
    suggestionsLabel: "تجاویز:",
    sugPothole: "دیہی علاقوں میں گڑھوں کی مرمت میں کتنا وقت لگتا ہے؟",
    sugPotholeLabel: "Gadhon ki marammat?",
    sugPrivacy: "کیا نکاسی آب کی شکایات کو پوشیدہ رکھا جاتا ہے؟",
    sugPrivacyLabel: "راز داری؟",
    sugLeak: "سڑک پر پانی کے اخراج کے بارے میں پیشہ ورانہ رپورٹ کیسے لکھیں؟",
    sugLeakLabel: "پانی کا اخراج رپورٹ",
    micListening: "آپ کی آواز سن رہا ہوں...",
    placeholder: "میونسپل سروسز کے بارے में کچھ بھی پوچھیں...",
    errText: "مواصلات میں خرابی پیش آئی ہے۔ براہ کرમ اپنا انٹرنیٹ کنکشن چیک کریں یا دوبارہ کوشش کریں۔"
  }
};

export default function AiAssistant({ selectedLanguage }: AiAssistantProps) {
  const translations = LOCAL_ASSISTANT_TRANSLATIONS[selectedLanguage] || LOCAL_ASSISTANT_TRANSLATIONS.English;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; url: string; type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Helper to convert File to Base64
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64Url = await toBase64(file);
      setAttachedFile({
        name: file.name,
        url: base64Url,
        type: file.type,
      });
    } catch (err) {
      console.error("Failed to read file", err);
    }
    // Reset file input so same file can be chosen again
    if (e.target) {
      e.target.value = "";
    }
  };

  // Initialize or update welcome message when selectedLanguage changes
  useEffect(() => {
    setMessages([
      {
        id: "init",
        sender: "ai",
        text: translations.welcomeMsg,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [selectedLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() && !attachedFile) return;

    const currentAttached = attachedFile;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: "user",
      text: queryText,
      timestamp: new Date().toISOString(),
      file: currentAttached || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachedFile(null);
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText || (currentAttached ? `Attached file: ${currentAttached.name}` : ""),
          history: messages.slice(-5).map(m => ({
            sender: m.sender,
            text: m.text,
            file: m.file ? { url: m.file.url, type: m.file.type } : undefined,
          })),
          language: selectedLanguage,
          file: currentAttached ? { url: currentAttached.url, type: currentAttached.type } : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-ai`,
            sender: "ai",
            text: data.text,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        throw new Error();
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          sender: "ai",
          text: translations.errText,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate speech-to-text input in selected language
      if (selectedLanguage === "Hindi") {
        setInput("मैं इंदौर बाजार के पास टूटी हुई स्ट्रीटलाइट के बारे में शिकायत दर्ज करना चाहता हूँ।");
      } else if (selectedLanguage === "Telugu") {
        setInput("ఇండోర్ మార్కెట్ ప్రాంతంలో విరిగిపోయిన వీధి దీపాల గురించి నేను ఫిర్యాదు చేయాలనుకుంటున్నాను.");
      } else if (selectedLanguage === "Tamil") {
        setInput("இந்தூர் சந்தை பகுதியில் உடைந்த தெருவிளக்குகள் குறித்து புகார் அளிக்க விரும்புகிறேன்.");
      } else {
        setInput("I want to raise a grievance about broken streetlights near the Indore marketplace.");
      }
    } else {
      setIsRecording(true);
    }
  };

  const handleSuggestion = (promptText: string) => {
    handleSend(promptText);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-indigo-700">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="font-mono text-xs font-extrabold uppercase tracking-widest">{translations.nodeLabel}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">{translations.agentTitle}</h2>
          <p className="text-xs text-slate-500">
            {translations.agentSubtitle}
          </p>
        </div>
      </div>

      {/* Main chat window */}
      <div className="flex flex-col rounded-3xl border border-slate-100 bg-white shadow-md overflow-hidden">
        {/* Top bar info */}
        <div className="bg-slate-50 px-6 py-3 flex items-center gap-2 border-b border-slate-100">
          <Bot className="h-5 w-5 text-indigo-600" />
          <div>
            <span className="text-xs font-bold text-slate-800">{translations.agentHeader}</span>
            <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>

        {/* Message logs */}
        <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((m) => {
            const isAi = m.sender === "ai";
            return (
              <div key={m.id} className={`flex gap-3 max-w-[85%] ${isAi ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right"}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-sm ${isAi ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                  {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div>
                  <div className={`rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-sm ${isAi ? "bg-white text-slate-800 border border-slate-100" : "bg-indigo-600 text-white"}`}>
                    {m.file && (
                      <div className="mb-2">
                        {m.file.type.startsWith("image/") ? (
                          <img
                            src={m.file.url}
                            alt={m.file.name}
                            className="max-h-48 rounded-lg object-contain shadow-sm border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className={`flex items-center gap-2 p-2 rounded-xl border text-left ${isAi ? "bg-slate-50 border-slate-100 text-slate-700" : "bg-indigo-700/50 border-indigo-500/30 text-indigo-50"}`}>
                            <FileText className="h-5 w-5 text-slate-400" />
                            <div className="overflow-hidden">
                              <p className="font-semibold text-[11px] truncate max-w-[200px]">{m.file.name}</p>
                              <p className="text-[9px] opacity-75 uppercase font-mono">{m.file.type.split("/")[1] || "File"}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {m.text && m.text.split("\n").map((line, idx) => (
                      <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>{line}</p>
                    ))}
                  </div>
                  <span className="block mt-1 text-[9px] text-slate-400 font-mono">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex gap-3 mr-auto items-center">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Bot className="h-4 w-4 animate-bounce" />
              </div>
              <div className="rounded-2xl bg-white border border-slate-100 px-4 py-2.5 text-xs text-slate-400 flex gap-1 items-center">
                <span>{translations.reasoning}</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-75">.</span>
                <span className="animate-bounce delay-150">.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion tags */}
        <div className="px-6 py-3 border-t border-slate-100 bg-white flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1 mr-1">
            <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
            {translations.suggestionsLabel}
          </span>
          <button
            onClick={() => handleSuggestion(translations.sugPothole)}
            className="rounded-full bg-slate-50 border border-slate-100 hover:bg-indigo-50 hover:text-indigo-900 transition-all px-3 py-1 text-xs font-semibold text-slate-600"
          >
            {translations.sugPotholeLabel}
          </button>
          <button
            onClick={() => handleSuggestion(translations.sugPrivacy)}
            className="rounded-full bg-slate-50 border border-slate-100 hover:bg-indigo-50 hover:text-indigo-900 transition-all px-3 py-1 text-xs font-semibold text-slate-600"
          >
            {translations.sugPrivacyLabel}
          </button>
          <button
            onClick={() => handleSuggestion(translations.sugLeak)}
            className="rounded-full bg-slate-50 border border-slate-100 hover:bg-indigo-50 hover:text-indigo-900 transition-all px-3 py-1 text-xs font-semibold text-slate-600"
          >
            {translations.sugLeakLabel}
          </button>
        </div>

        {/* Input box */}
        <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3">
          {/* File Attachment Preview */}
          {attachedFile && (
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl p-2 self-start max-w-full">
              {attachedFile.type.startsWith("image/") ? (
                <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-slate-200">
                  <img src={attachedFile.url} alt="Attached image preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <FileText className="h-5 w-5" />
                </div>
              )}
              <div className="overflow-hidden min-w-0 pr-2">
                <p className="text-[11px] font-bold text-slate-700 truncate max-w-[180px]">{attachedFile.name}</p>
                <p className="text-[9px] text-slate-400 font-mono uppercase">{attachedFile.type.split("/")[1] || "File"}</p>
              </div>
              <button
                onClick={() => setAttachedFile(null)}
                className="h-6 w-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-all ml-1"
                title="Remove attachment"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="flex gap-3 items-center">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,application/pdf,text/plain"
            />

            {/* Attach button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isRecording}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all hover:bg-slate-100 disabled:opacity-50"
              title="Attach an image or file"
            >
              <Paperclip className="h-4.5 w-4.5" />
            </button>

            <button
              onClick={toggleRecording}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all ${
                isRecording
                  ? "bg-rose-500 text-white border-rose-500 animate-pulse"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
              title={isRecording ? "Stop voice recording" : "Record voice input"}
            >
              {isRecording ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
            </button>

            <input
              type="text"
              placeholder={isRecording ? translations.micListening : translations.placeholder}
              value={input}
              disabled={isRecording}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
            />

            <button
              onClick={() => handleSend()}
              disabled={(!input.trim() && !attachedFile) || loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all disabled:bg-slate-100 disabled:text-slate-400"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
