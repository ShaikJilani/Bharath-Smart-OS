import React from "react";
import {
  Train,
  Leaf,
  Cpu,
  GraduationCap,
  Sprout,
  Activity,
  Heart,
  Rocket,
  Landmark,
  Award,
  ArrowRight, Target, CheckCircle2, BarChart3, Globe, Quote, Sparkles,
} from "lucide-react";

interface ViksitBharatDashboardProps {
  onNavigateTab: (tab: string) => void;
  selectedLanguage: string;
}

const VIKSIT_LOCAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    vision2047: "Vision 2047 Initiative",
    heroTitle1: "India Towards a",
    heroTitle2: "Developed Nation",
    heroDesc: "A unified digital infrastructure empowering citizens and government to build a sustainable, inclusive, and technologically advanced future.",
    realTimeTracking: "Real-time Tracking",
    aiPredictiveAnalytics: "AI Predictive Analytics",
    spatialGisMapping: "Spatial GIS Mapping",
    pillarsTitle: "Pillars of Developed India",
    pillarsDesc: "Key development areas targeted for transformation by 2047",
    quoteText1: "Together, let's build a",
    quoteHighlight: "Viksit Bharat 2047",
    quoteText2: "for ourselves and for future generations.",
    nationalInit: "National Governance Initiative",
    s1Title: "Infrastructure",
    s1Desc: "World-class infrastructure for a stronger India",
    s2Title: "Sustainable Future",
    s2Desc: "Driving clean energy and green growth",
    s3Title: "Digital India",
    s3Desc: "Technology for empowerment and inclusion",
    s4Title: "Education & Skills",
    s4Desc: "Empowering youth for a brighter tomorrow",
    s5Title: "Agriculture & Rural Growth",
    s5Desc: "Prosperous villages, stronger Bharat",
    s6Title: "Health & Well-being",
    s6Desc: "Healthy citizens, stronger nation",
    s7Title: "Women Empowerment",
    s7Desc: "Nari Shakti driving the nation forward",
    s8Title: "Innovation & Startups",
    s8Desc: "Fostering a culture of entrepreneurship",
    s9Title: "Heritage & Culture",
    s9Desc: "Preserving our rich traditions and history",
  },
  Hindi: {
    vision2047: "विजन 2047 पहल",
    heroTitle1: "विकसित राष्ट्र की ओर",
    heroTitle2: "भारत",
    heroDesc: "एक स्थायी, समावेशी और तकनीकी रूप से उन्नत भविष्य बनाने के लिए नागरिकों और सरकार को सशक्त बनाने वाला एकीकृत डिजिटल ढांचा।",
    realTimeTracking: "रियल-टाइम ट्रैकिंग",
    aiPredictiveAnalytics: "एआई भविष्यसूचक विश्लेषण",
    spatialGisMapping: "स्थानिक जीआईएस मैपिंग",
    pillarsTitle: "विकसित भारत के स्तंभ",
    pillarsDesc: "2047 तक परिवर्तन के लिए लक्षित प्रमुख विकास क्षेत्र",
    quoteText1: "आइए मिलकर अपने और आने वाली पीढ़ियों के लिए",
    quoteHighlight: "विकसित भारत 2047",
    quoteText2: "का निर्माण करें।",
    nationalInit: "राष्ट्रीय सुशासन पहल",
    s1Title: "इन्फ्रास्ट्रक्चर",
    s1Desc: "मजबूत भारत के लिए विश्वस्तरीय बुनियादी ढांचा",
    s2Title: "सतत भविष्य",
    s2Desc: "स्वच्छ ऊर्जा और हरित विकास को बढ़ावा देना",
    s3Title: "डिजिटल इंडिया",
    s3Desc: "सशक्तिकरण और समावेशन के लिए प्रौद्योगिकी",
    s4Title: "शिक्षा एवं कौशल",
    s4Desc: "उज्ज्वल कल के लिए युवाओं का सशक्तिकरण",
    s5Title: "कृषि एवं ग्रामीण विकास",
    s5Desc: "समृद्ध गांव, सशक्त भारत",
    s6Title: "स्वास्थ्य एवं कल्याण",
    s6Desc: "स्वस्थ नागरिक, मजबूत राष्ट्र",
    s7Title: "महिला सशक्तिकरण",
    s7Desc: "देश को आगे बढ़ाती नारी शक्ति",
    s8Title: "नवाचार एवं स्टार्टअप",
    s8Desc: "उद्यमिता की संस्कृति को बढ़ावा देना",
    s9Title: "विरासत एवं संस्कृति",
    s9Desc: "हमारी समृद्ध परंपराओं और इतिहास का संरक्षण",
  },
  Telugu: {
    vision2047: "విజన్ 2047 చొరవ",
    heroTitle1: "అభివృద్ధి చెందిన వైపు",
    heroTitle2: "భారతదేశం 2047",
    heroDesc: "సుస్థిర, సమగ్ర, సాంకేతికంగా పురోగమించిన భవిష్యత్తు కోసం సమగ్ర డిజిటల్ మౌలిక సదుపాయాలు.",
    realTimeTracking: "రియల్ టైమ్ ట్రాకింగ్",
    aiPredictiveAnalytics: "ఏఐ ప్రిడిక్టివ్ అనలిటిక్స్",
    spatialGisMapping: "GIS స్పేషియల్ మ్యాపింగ్",
    pillarsTitle: "వికసిత్ భారత్ పిల్లర్లు",
    pillarsDesc: "2047 నాటికి మార్పు కోసం లక్ష్యంగా చేసుకున్న రంగాలు",
    quoteText1: "అందరం కలిసి మనకోసం మరియు భవిష్యత్ తరాల కోసం",
    quoteHighlight: "వికసిత్ భారత్ 2047",
    quoteText2: "ను నిర్మిద్దాం.",
    nationalInit: "జాతీయ పాలనా చొరవ",
    s1Title: "మౌలిక సదుపాయాలు",
    s1Desc: "బలమైన భారతదేశం కోసం ప్రపంచ స్థాయి సౌకర్యాలు",
    s2Title: "సుస్థిర భవిష్యత్తు",
    s2Desc: "హరిత అభివృద్ధి మరియు స్వచ్ఛమైన ఇంధనం",
    s3Title: "డిజిటల్ ఇండియా",
    s3Desc: "సాధికారత మరియు విలీనం కోసం సాంకేతికత",
    s4Title: "విద్య & నైపుణ్యాలు",
    s4Desc: "ప్రకాశవంతమైన రేపటి కోసం యువత సాధికారత",
    s5Title: "వ్యవసాయం & గ్రామీణాభివృద్ధి",
    s5Desc: "సమృద్ధిగా ఉన్న గ్రామాలు, బలమైన భారత్",
    s6Title: "ఆరోగ్యం & సంక్షేమం",
    s6Desc: "ఆరోగ్యవంతమైన పౌరులు, బలమైన దేశం",
    s7Title: "మహిళా సాధికారత",
    s7Desc: "దేశాన్ని ముందుకు నడిపిస్తున్న నారీ శక్తి",
    s8Title: "నవకల్పనలు & స్టార్టప్‌లు",
    s8Desc: "పారిశ్రామికవేత్తల సంస్కృతిని ప్రోత్సహించడం",
    s9Title: "సస్కృతి & వారసత్వం",
    s9Desc: "మన సంప్రదాయాలు మరియు చరిత్ర పరిరక్షణ",
  },
  Tamil: {
    vision2047: "விஷன் 2047 திட்டம்",
    heroTitle1: "வளர்ச்சியடைந்த நாட்டை நோக்கி",
    heroTitle2: "பாரதம் 2047",
    heroDesc: "நிலையான மற்றும் தொழில்நுட்ப ரீதியாக மேம்பட்ட எதிர்காலத்தை உருவாக்குவதற்கான ஒருங்கிணைந்த டிஜிட்டல் கட்டமைப்பு.",
    realTimeTracking: "நேரலை கண்காணிப்பு",
    aiPredictiveAnalytics: "AI முன்கணிப்பு பகுப்பாய்வு",
    spatialGisMapping: "GIS மேப்பிங் சேவை",
    pillarsTitle: "வளர்ச்சியடைந்த இந்தியாவின் தூண்கள்",
    pillarsDesc: "2047க்குள் மாற்றத்திற்கான முக்கிய வளர்ச்சிப் பகுதிகள்",
    quoteText1: "ஒன்றாக இணைந்து நமது எதிர்கால சந்ததிக்காக",
    quoteHighlight: "விகசித் பாரதம் 2047",
    quoteText2: "உருவாக்குவோம்.",
    nationalInit: "தேசிய ஆளுமை திட்டம்",
    s1Title: "அடிப்படைக் கட்டமைப்பு",
    s1Desc: "வலிமையான இந்தியாவிற்கான உலகத்தரம் வாய்ந்த கட்டமைப்பு",
    s2Title: "நிலையான எதிர்காலம்",
    s2Desc: "தூய்மையான ஆற்றல் மற்றும் பசுமை வளர்ச்சி",
    s3Title: "டிஜிட்டல் இந்தியா",
    s3Desc: "மக்களுக்கான தொழில்நுட்ப அதிகாரம்",
    s4Title: "கல்வி & திறன்கள்",
    s4Desc: "சிறந்த எதிர்காலத்திற்காக இளைஞர்களின் திறன் மேம்பாடு",
    s5Title: "வேளாண்மை & கிராமப்புற வளர்ச்சி",
    s5Desc: "செழிப்பான கிராமங்கள், வலிமையான பாரதம்",
    s6Title: "சுகாதாரம் & நல்வாழ்வு",
    s6Desc: "ஆரோக்கியமான குடிமக்கள், வலிமையான தேசம்",
    s7Title: "மகளிர் அதிகாரம்",
    s7Desc: "நாட்டை முன்னோக்கி நடத்தும் நாரி சக்தி",
    s8Title: "நவம்பாக்கம் & ஸ்டார்ட்அப்",
    s8Desc: "தொழில்முனைவோர் கலாச்சாரத்தை ஊக்குவித்தல்",
    s9Title: "பாரம்பரியம் & கலாச்சாரம்",
    s9Desc: "நமது கலாச்சாரம் மற்றும் வரலாற்றைப் பாதுகாத்தல்",
  }
};

export default function ViksitBharatDashboard({
  onNavigateTab,
  selectedLanguage,
}: ViksitBharatDashboardProps) {
  const vt = (key: string) => {
    const dict = VIKSIT_LOCAL_TRANSLATIONS[selectedLanguage] || VIKSIT_LOCAL_TRANSLATIONS.English;
    return dict[key] || VIKSIT_LOCAL_TRANSLATIONS.English[key] || key;
  };

  // Sector cards configuration
  const sectorCards = [
    {
      title: vt("s1Title"),
      description: vt("s1Desc"),
      image:
        "https://ayfmpebpnhtsahrlqnsu.supabase.co/storage/v1/object/sign/Viksit%20bharat%20hub/Infastructure1.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZjk4OTVkYy1hNjA5LTQ1MzUtODFkMC01MTg0YmMwZDM5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWtzaXQgYmhhcmF0IGh1Yi9JbmZhc3RydWN0dXJlMS5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg0OTY4NTAwLCJleHAiOjI3MzEwNDg1MDB9.odXZJcdpaRy38JSRvFBt-VqLKs3nhtCOA-kdSq7aWP8",
      icon: Train,
      iconBg: "bg-blue-100 text-blue-600 border-blue-200",
      colorTheme: "blue",
    },
    {
      title: vt("s2Title"),
      description: vt("s2Desc"),
      image:
        "https://ayfmpebpnhtsahrlqnsu.supabase.co/storage/v1/object/sign/Viksit%20bharat%20hub/Sustainable%20Future1.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZjk4OTVkYy1hNjA5LTQ1MzUtODFkMC01MTg0YmMwZDM5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWtzaXQgYmhhcmF0IGh1Yi9TdXN0YWluYWJsZSBGdXR1cmUxLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODQ5Njg3ODksImV4cCI6MjczMTA0ODc4OX0.4bPwd0gjduNw8phVCkYwI2Y4asH4qg4PxvvM5l6WX2Y",
      icon: Leaf,
      iconBg: "bg-emerald-100 text-emerald-600 border-emerald-200",
      colorTheme: "emerald",
    },
    {
      title: vt("s3Title"),
      description: vt("s3Desc"),
      image:
        "https://ayfmpebpnhtsahrlqnsu.supabase.co/storage/v1/object/sign/Viksit%20bharat%20hub/Digital%20India.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZjk4OTVkYy1hNjA5LTQ1MzUtODFkMC01MTg0YmMwZDM5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWtzaXQgYmhhcmF0IGh1Yi9EaWdpdGFsIEluZGlhLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODQ5NjI4MzgsImV4cCI6MjczMTA0MjgzOH0.8ur9E1ONx_nEFHqblVF_2PcMZoMcrL-R5wgmcEyu0AE",
      icon: Cpu,
      iconBg: "bg-purple-100 text-purple-600 border-purple-200",
      colorTheme: "purple",
    },
    {
      title: vt("s4Title"),
      description: vt("s4Desc"),
      image:
        "https://ayfmpebpnhtsahrlqnsu.supabase.co/storage/v1/object/sign/Viksit%20bharat%20hub/Education.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZjk4OTVkYy1hNjA5LTQ1MzUtODFkMC01MTg0YmMwZDM5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWtzaXQgYmhhcmF0IGh1Yi9FZHVjYXRpb24ucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NDk2Nzc1NSwiZXhwIjoyNzMxMDQ3NzU1fQ.MZQGSUahXUNOdef_1AwCFfN3Ad3DN3P13OB2TDiZKnk",
      icon: GraduationCap,
      iconBg: "bg-orange-100 text-orange-600 border-orange-200",
      colorTheme: "orange",
    },
    {
      title: vt("s5Title"),
      description: vt("s5Desc"),
      image:
        "https://ayfmpebpnhtsahrlqnsu.supabase.co/storage/v1/object/sign/Viksit%20bharat%20hub/Agriculture.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZjk4OTVkYy1hNjA5LTQ1MzUtODFkMC01MTg0YmMwZDM5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWtzaXQgYmhhcmF0IGh1Yi9BZ3JpY3VsdHVyZS5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg0OTY3OTI4LCJleHAiOjI3MzEwNDc5Mjh9.6Hs4P3HFnfn9Os4gmxsLKheR6l0Cg2oc_eix-wPmUoA",
      icon: Sprout,
      iconBg: "bg-green-100 text-green-600 border-green-200",
      colorTheme: "green",
    },
    {
      title: vt("s6Title"),
      description: vt("s6Desc"),
      image:
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop",
      icon: Activity,
      iconBg: "bg-rose-100 text-rose-600 border-rose-200",
      colorTheme: "rose",
    },
    {
      title: vt("s7Title"),
      description: vt("s7Desc"),
      image:
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop",
      icon: Heart,
      iconBg: "bg-pink-100 text-pink-600 border-pink-200",
      colorTheme: "pink",
    },
    {
      title: vt("s8Title"),
      description: vt("s8Desc"),
      image:
        "https://upload.wikimedia.org/wikipedia/commons/7/70/Gathering_at_the_National_Startup_Day_programme_marking_a_decade_of_Startup_India.jpg",
      icon: Rocket,
      iconBg: "bg-indigo-100 text-indigo-600 border-indigo-200",
      colorTheme: "indigo",
    },
    {
      title: vt("s9Title"),
      description: vt("s9Desc"),
      image:
        "https://upload.wikimedia.org/wikipedia/commons/7/74/Taj_Mahal%2C_Agra%2C_India_edit2.jpg",
      icon: Landmark,
      iconBg: "bg-amber-100 text-amber-600 border-amber-200",
      colorTheme: "amber",
    },
  ];

  return (
    <div
      id="viksit-bharat-dashboard"
      className="space-y-6 md:space-y-8 animate-fade-in pb-12"
    >
      {/* 1. Main Hero Banner */}
      <div
        id="viksit-hero-banner"
        className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 mb-8 w-full h-48 sm:h-64 md:h-80 lg:h-[380px]"
      >
        <img
          src="https://ayfmpebpnhtsahrlqnsu.supabase.co/storage/v1/object/sign/Viksit%20bharat%20hub/Dashboard%20image%202.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZjk4OTVkYy1hNjA5LTQ1MzUtODFkMC01MTg0YmMwZDM5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWtzaXQgYmhhcmF0IGh1Yi9EYXNoYm9hcmQgaW1hZ2UgMi5wbmciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg1MTQ0MTI1LCJleHAiOjMwNDY1ODQxMjV9.UTn_ynXEckuyg8Mz4EwkIq4k7mclnWAXXbrcOfCNaRI"
          alt="Viksit Bharat 2047 Banner"
          referrerPolicy="no-referrer"
          className="w-full h-full block object-fill object-center rounded-3xl"
        />
      </div>

      {/* 2. Grid of 6 Sector Cards */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            {vt("pillarsTitle")}
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            {vt("pillarsDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectorCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                id={`sector-card-${index}`}
                className="group relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors z-10 duration-300"></div>
                  <img
                    src={card.image}
                    alt={card.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col gap-3 flex-1 bg-white">
                  <div className="flex items-center gap-3">
                    {/* Circle Icon Badge */}
                    <div
                      className={`w-11 h-11 rounded-2xl border ${card.iconBg} flex items-center justify-center shrink-0`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-tight line-clamp-2 min-h-[2.5rem] flex items-center">
                      {card.title}
                    </h4>
                  </div>

                  {/* Text Details */}
                  <p className="text-[11px] md:text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 flex-1 min-h-[2rem]">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Quote Card */}
      <div
        id="viksit-quote-banner"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-white to-emerald-500/10 border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        {/* Decorative Background Glows */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex items-center gap-3 max-w-2xl">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs">
            <Quote className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
              {vt("quoteText1")}{" "}
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 bg-clip-text text-transparent font-extrabold">
                {vt("quoteHighlight")}
              </span>{" "}
              {vt("quoteText2")}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                {vt("nationalInit")}
              </p>
            </div>
          </div>
        </div>

        {/* Right Badge Accent */}
        <div className="relative z-10 shrink-0 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/80 border border-slate-200 shadow-2xs backdrop-blur-sm">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="text-left">
            <span className="block text-[9px] font-extrabold uppercase text-slate-400 tracking-wider font-mono leading-none">
              GOVERNMENT OF INDIA
            </span>
            <span className="block text-[11px] font-extrabold text-slate-800 leading-tight">
              Vision 2047
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
