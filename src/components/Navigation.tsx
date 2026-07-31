import React from "react";
import { Shield, Languages, User, Compass, BarChart3, HelpCircle, Bot, LogOut, CheckCircle2, MapPin, LayoutDashboard } from "lucide-react";
import { Role, INDIAN_LANGUAGES } from "../types";
import { t } from "../data";
import { hasValidKey } from "./GmpMap";
import LanguageSelector from "./LanguageSelector";

const NAV_LOCAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    nodeLabel: "BHARAT OS NODE: ACT-3000 / INDORE REGION",
    realMaps: "Real Maps Live",
    gisMaps: "Inbuilt GIS Maps Active",
    demoPanel: "Demo Simulator Panel (Quick Role Switcher):",
    citizenView: "Citizen View",
    officerDashboard: "Officer Dashboard",
    superAdmin: "Super Admin",
    signOut: "Sign Out",
    roleCitizen: "Citizen Account",
    roleOfficer: "Municipal Officer",
    roleAdmin: "Super Administrator"
  },
  Hindi: {
    nodeLabel: "भारत ओएस नोड: एसीटी-3000 / इंदौर क्षेत्र",
    realMaps: "वास्तविक मानचित्र लाइव",
    gisMaps: "अंतर्निहित जीआईएस मानचित्र सक्रिय",
    demoPanel: "डेमो सिम्युलेटर पैनल (त्वरित भूमिका स्विचर):",
    citizenView: "नागरिक दृश्य",
    officerDashboard: "अधिकारी डैशबोर्ड",
    superAdmin: "सुपर एडमिन",
    signOut: "साइन आउट",
    roleCitizen: "नागरिक खाता",
    roleOfficer: "नगर निगम अधिकारी",
    roleAdmin: "सुपर प्रशासक"
  },
  Telugu: {
    nodeLabel: "భారత్ ఓఎస్ నోడ్: ఏసిటి-3000 / ఇండోర్ ప్రాంతం",
    realMaps: "రియల్ మ్యాప్స్ లైవ్",
    gisMaps: "అంతర్నిర్మిత జీఐఎస్ మ్యాప్స్ సక్రియం",
    demoPanel: "డెమో సిమ్యులేటర్ ప్యానెల్ (త్వరిత పాత్ర స్విచ్చర్):",
    citizenView: "పౌరుడి వీక్షణ",
    officerDashboard: "అధికారి డాష్‌బోర్డ్",
    superAdmin: "సూపర్ అడ్మిన్",
    signOut: "సైన్ అవుట్",
    roleCitizen: "పౌరుడి ఖాతా",
    roleOfficer: "మునిసిపల్ అధికారి",
    roleAdmin: "సూపర్ అడ్మినిస్ట్రేటర్"
  },
  Tamil: {
    nodeLabel: "பாரத் ஓஎஸ் முனை: ஏசிடி-3000 / இந்தூர் பிராந்தியம்",
    realMaps: "உண்மையான வரைபடங்கள் நேரலை",
    gisMaps: "உள்ளமைக்கப்பட்ட ஜிஐஎஸ் வரைபடங்கள் செயலில் உள்ளன",
    demoPanel: "டெமோ சிமுலேட்டர் பேனல் (விரைவான பங்கு மாற்றி):",
    citizenView: "குடிமகன் பார்வை",
    officerDashboard: "அதிகாரி டாஷ்போர்டு",
    superAdmin: "சூப்பர் அட்மின்",
    signOut: "வெளியேறு",
    roleCitizen: "குடிமகன் கணக்கு",
    roleOfficer: "நகராட்சி அதிகாரி",
    roleAdmin: "சூப்பர் நிர்வாகி"
  },
  Kannada: {
    nodeLabel: "ಭಾರತ್ ಓಎಸ್ ನೋಡ್: ಎಸಿಟಿ-3000 / ಇಂದೋರ್ ಪ್ರದೇಶ",
    realMaps: "ನಿಜವಾದ ನಕ್ಷೆಗಳು ಲೈವ್",
    gisMaps: "ಅಂತರ್ನಿರ್ಮಿತ ಜಿಐಎಸ್ ನಕ್ಷೆಗಳು ಸಕ್ರಿಯ",
    demoPanel: "ಡೆಮೊ ಸಿಮ್ಯುಲೇಟರ್ ಪ್ಯಾನಲ್ (ತ್ವರಿತ ಪಾತ್ರ ಬದಲಾವಣೆ):",
    citizenView: "ನಾಗರಿಕ ನೋಟ",
    officerDashboard: "ಅಧಿಕಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    superAdmin: "ಸೂಪರ್ ಅಡ್ಮಿನ್",
    signOut: "ಸೈನ್ ಔಟ್",
    roleCitizen: "ನಾಗರಿಕ ಖಾತೆ",
    roleOfficer: "ಪುರಸಭೆ ಅಧಿಕಾರಿ",
    roleAdmin: "ಸೂಪರ್ ಅಡ್ಮಿನಿಸ್ಟ್ರೇಟರ್"
  },
  Malayalam: {
    nodeLabel: "ഭാരത് ഒഎസ് നോഡ്: എസിടി-3000 / ഇൻഡോർ പ്രദേശം",
    realMaps: "യഥാർത്ഥ ഭൂപടങ്ങൾ തത്സമയം",
    gisMaps: "ഇൻബിൽറ്റ് ജിഐഎസ് ഭൂപടങ്ങൾ സജീവം",
    demoPanel: "ഡെമോ സിമുലേറ്റർ പാനൽ (ക്വിക്ക് റോൾ സ്വിച്ചർ):",
    citizenView: "പൗരൻ കാഴ്ച",
    officerDashboard: "ഓഫീസർ ഡാഷ്‌ബോർഡ്",
    superAdmin: "സൂപ്പർ അഡ്മിൻ",
    signOut: "പുറത്തു കടക്കുക",
    roleCitizen: "പൗരൻ അക്കൗണ്ട്",
    roleOfficer: "മുനിസിപ്പൽ ഓഫീസർ",
    roleAdmin: "സൂപ്പർ അഡ്മിനിസ്ട്രേറ്റർ"
  },
  Marathi: {
    nodeLabel: "भारत ओएस नोड: एसीटी-3000 / इंदूर प्रदेश",
    realMaps: "वास्तविक नकाशे थेट",
    gisMaps: "अंगभूत जीआयएस नकाशे सक्रिय",
    demoPanel: "डेमो सिम्युलेटर पॅनेल (द्रुत भूमिका स्विचर):",
    citizenView: "नागरिक दृश्य",
    officerDashboard: "अधिकारी डॅशबोर्ड",
    superAdmin: "सुपर ॲडमिन",
    signOut: "बाहेर पडा",
    roleCitizen: "नागरिक खाते",
    roleOfficer: "महानगरपालिका अधिकारी",
    roleAdmin: "सुपर प्रशासक"
  },
  Bengali: {
    nodeLabel: "ভারত ওএস নোড: এসিটি-৩০০০ / ইন্দোর অঞ্চল",
    realMaps: "আসল মানচিত্র লাইভ",
    gisMaps: "ইনবিল্ট জিআইএস মানচিত্র সক্রিয়",
    demoPanel: "ডেমো সিমুলেটর প্যানেল (কুইক রোল সুইচার):",
    citizenView: "নাগরিক ভিউ",
    officerDashboard: "অফিসার ড্যাশবোর্ড",
    superAdmin: "সুপার অ্যাডমিন",
    signOut: "সাইন আউট",
    roleCitizen: "নাগরিক অ্যাকাউন্ট",
    roleOfficer: "পৌরসভা কর্মকর্তা",
    roleAdmin: "সুপার প্রশাসক"
  },
  Gujarati: {
    nodeLabel: "ભારત ઓએસ નોડ: એસીટી-3000 / ઇન્દોર પ્રદેશ",
    realMaps: "વાસ્તવિક નકશા લાઈવ",
    gisMaps: "ઇનબિલ્ટ જીઆઇએસ નકશા સક્રિય",
    demoPanel: "ડેમો સિમ્યુલેટર પેનલ (ઝડપી ભૂમિકા સ્વિચર):",
    citizenView: "નાગરિક દૃશ્ય",
    officerDashboard: "અધિકારી ડેશબોર્ડ",
    superAdmin: "સુપર એડમિન",
    signOut: "સાઇન આઉટ",
    roleCitizen: "નાગરિક ખાતું",
    roleOfficer: "મ્યુનિસિપલ અધિકારી",
    roleAdmin: "સુપર એડમિનિસ્ટ્રેટર"
  },
  Punjabi: {
    nodeLabel: "ਭਾਰਤ ਓਐਸ ਨੋਡ: ਏਸੀਟੀ-3000 / ਇੰਦੌਰ ਖੇਤਰ",
    realMaps: "ਅਸਲ ਨਕਸ਼ੇ ਲਾਈਵ",
    gisMaps: "ਇਨਬਿਲਟ ਜੀਆਈਐਸ ਨਕਸ਼ੇ ਸਰਗਰਮ",
    demoPanel: "ਡੇਮੋ ਸਿਮੂਲੇਟਰ ਪੈਨਲ (ਤੇਜ਼ ਭੂਮਿਕਾ ਸਵਿੱਚਰ):",
    citizenView: "ਨਾਗਰਿਕ ਦ੍ਰਿਸ਼",
    officerDashboard: "ਅਧਿਕਾਰੀ ਡੈਸ਼ਬੋਰਡ",
    superAdmin: "ਸੁਪਰ ਐਡਮਿਨ",
    signOut: "ਸਾਈਨ ਆਊਟ",
    roleCitizen: "ਨਾਗਰਿਕ ਖਾਤਾ",
    roleOfficer: "ਮਿਉਂਸਪਲ ਅਧਿਕਾਰੀ",
    roleAdmin: "ਸੁਪਰ ਪ੍ਰਸ਼ਾਸਕ"
  },
  Odia: {
    nodeLabel: "ଭାରତ ଓଏସ ନୋଡ୍: ଏସିଟି-୩୦୦୦ / ଇନ୍ଦୋର ଅଞ୍ଚଳ",
    realMaps: "ପ୍ରକୃତ ମାନଚିତ୍ର ଲାଇଭ୍",
    gisMaps: "ଇନବିଲ୍ଟ ଜିଆଇଏସ ମାନଚିତ୍ର ସକ୍ରିୟ",
    demoPanel: "ଡେମୋ ସିମୁଲେଟର ପ୍ୟାନେଲ (ଶୀଘ୍ର ଭୂମିକା ପରିବର୍ତ୍ତନକାରୀ):",
    citizenView: "ନାଗରିକ ଦର୍ଶନ",
    officerDashboard: "ଅଧିକାରୀ ଡ୍ୟାସବୋର୍ଡ",
    superAdmin: "ସୁପର ଆଡମିନ",
    signOut: "ସାଇନ ଆଉଟ୍",
    roleCitizen: "ନାଗରିକ ଆକାଉଣ୍ଟ",
    roleOfficer: "ପୌରପାଳିକା ଅଧିକାରୀ",
    roleAdmin: "ସୁପର ପ୍ରଶାସକ"
  },
  Assamese: {
    nodeLabel: "ভাৰত অ'এছ নোড: এচিটি-৩০০০ / ইন্দোৰ অঞ্চল",
    realMaps: "প্ৰকৃত মানচিত্ৰ লাইভ",
    gisMaps: "ইনবিল্ট জিআইএছ মানচিত্ৰ সক্ৰিয়",
    demoPanel: "ডেমো চিমুলেটৰ পেনেল (ক্ষিপ্ৰ ভূমিকা সলনিকৰণ):",
    citizenView: "নাগৰিক ভিউ",
    officerDashboard: "বিষয়া ডেশ্ববৰ্ড",
    superAdmin: "ছুপাৰ এডমিন",
    signOut: "প্ৰস্থান কৰক",
    roleCitizen: "নাগৰিক একাউণ্ট",
    roleOfficer: "পৌৰ বিষয়া",
    roleAdmin: "ছুপাৰ এডমিনিষ্ট্ৰেটৰ"
  },
  Urdu: {
    nodeLabel: "بھارت او ایس نوڈ: اے سی ٹی-3000 / اندور علاقہ",
    realMaps: "اصلی نقشے لائیو",
    gisMaps: "ان بلٹ جی آئی ایس نقشے فعال",
    demoPanel: "ڈیمو سمیلیٹر پینل (فوری رول سوئچر):",
    citizenView: "شہری کا منظر",
    officerDashboard: "آفیسر ڈیش بورڈ",
    superAdmin: "سپر ایڈمن",
    signOut: "سائن آؤٹ",
    roleCitizen: "شہری اکاؤنٹ",
    roleOfficer: "بلدیاتی افسر",
    roleAdmin: "سپر ایڈمنسٹریٹر"
  }
};

interface NavigationProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  userName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export default function Navigation({
  currentRole,
  onRoleChange,
  selectedLanguage,
  onLanguageChange,
  userName,
  activeTab,
  onTabChange,
  onLogout,
}: NavigationProps) {
  const nt = (key: string) => {
    const dict = NAV_LOCAL_TRANSLATIONS[selectedLanguage] || NAV_LOCAL_TRANSLATIONS.English;
    return dict[key] || NAV_LOCAL_TRANSLATIONS.English[key] || key;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
      {/* Top Testing utility bar - highly useful for evaluation and hackathon demo */}
      <div className="flex flex-wrap items-center justify-between bg-slate-900 px-4 py-2 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[11px] tracking-tight text-slate-400">{nt("nodeLabel")}</span>
          </div>
          {hasValidKey ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/30">
              <MapPin className="h-3 w-3 animate-pulse" />
              {nt("realMaps")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
              <MapPin className="h-3 w-3" />
              {nt("gisMaps")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-medium">{nt("demoPanel")}</span>
          <div className="flex items-center rounded bg-slate-800 p-0.5">
            <button
              onClick={() => onRoleChange("citizen")}
              className={`rounded px-2 py-0.5 font-medium transition-all ${
                currentRole === "citizen"
                  ? "bg-amber-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {nt("citizenView")}
            </button>
            <button
              onClick={() => onRoleChange("officer")}
              className={`rounded px-2 py-0.5 font-medium transition-all ${
                currentRole === "officer"
                  ? "bg-sky-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {nt("officerDashboard")}
            </button>
            
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo and Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-white to-emerald-500 shadow-md border border-slate-200">
            <div className="absolute inset-1 rounded-lg bg-white/80 flex items-center justify-center">
              <span className="font-serif text-lg font-bold text-blue-900">भ</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                {t(selectedLanguage, "appTitle")}
              </h1>
              <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-orange-700 uppercase">
                Viksit 2047
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-none">
              {t(selectedLanguage, "tagline")}
            </p>
          </div>
        </div>

        {/* Middle Navigation Tabs (Adjusted based on role) */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => onTabChange("dashboard")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-[#FF9933]/10 text-orange-800"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 text-[#FF9933]" />
            {t(selectedLanguage, "dashboard")}
          </button>

          {currentRole === "citizen" && (
            <>
              <button
                onClick={() => onTabChange("lodge")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  activeTab === "lodge"
                    ? "bg-amber-50 text-amber-800"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <Compass className="h-4 w-4" />
                {t(selectedLanguage, "raiseComplaint")}
              </button>
              <button
                onClick={() => onTabChange("my-complaints")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  activeTab === "my-complaints"
                    ? "bg-amber-50 text-amber-800"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {t(selectedLanguage, "myComplaints")}
              </button>
            </>
          )}

          {currentRole === "officer" && (
            <>
              <button
                onClick={() => onTabChange("officer-dash")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  activeTab === "officer-dash"
                    ? "bg-sky-50 text-sky-800"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <Compass className="h-4 w-4" />
                {t(selectedLanguage, "assignedQueue")}
              </button>
            </>
          )}

          

          <button
            onClick={() => onTabChange("analytics")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === "analytics"
                ? "bg-emerald-50 text-emerald-800"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            {t(selectedLanguage, "analytics")}
          </button>

          <button
            onClick={() => onTabChange("help")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === "help"
                ? "bg-indigo-50 text-indigo-800"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            {t(selectedLanguage, "helpCenter")}
          </button>

          <button
            onClick={() => onTabChange("assistant")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all relative ${
              activeTab === "assistant"
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-800"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <Bot className="h-4 w-4 text-indigo-500 animate-bounce" />
            {t(selectedLanguage, "assistant")}
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </button>
        </nav>

        {/* Right Controls: Language & Profile */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            variant="header"
          />

          {/* User Name & Profile Indicator */}
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <User className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">{userName}</p>
              <span className="text-[10px] text-slate-400 capitalize">
                {currentRole === "citizen" ? nt("roleCitizen") : nt("roleOfficer")}
              </span>
            </div>
          </div>

          {/* Log Out */}
          <button
            onClick={onLogout}
            title={nt("signOut")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
