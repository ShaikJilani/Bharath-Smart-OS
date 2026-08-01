import React, { useState, useEffect } from "react";
import {
  Compass,
  Upload,
  MapPin,
  Bot,
  User,
  Clock,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  Star,
  CheckCircle,
  HelpCircle,
  FileImage,
  Layers,
  ArrowRight,
  Search,
  Info,
  Zap
} from "lucide-react";
import { SECTORS, AreaType, Severity, Complaint } from "../types";
import { t } from "../data";
import { InteractiveGmpMap, hasValidKey } from "./GmpMap";

interface CitizenDashboardProps {
  userId: string;
  userName: string;
  userEmail: string;
  selectedLanguage: string;
  activeTab?: string;
}

const SUCCESS_MODAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    successTitle: "Complaint Raised Successfully!",
    successSubtitle: "Your civic grievance has been registered on the block ledger and verified by our AI triage engine.",
    assignedTitle: "Assigned Supervising Officer Details",
    officerName: "Officer Name",
    designation: "Designation",
    department: "Department",
    contactPhone: "Contact Number",
    complaintId: "Complaint ID",
    slaWindow: "Resolution SLA Window",
    dismissBtn: "Acknowledge & Continue",
    addressLabel: "Location Registered",
    areaZone: "Area Type / Zone",
  },
  Hindi: {
    successTitle: "शिकायत सफलतापूर्वक दर्ज की गई!",
    successSubtitle: "आपकी नागरिक शिकायत ब्लॉक लेज़र पर पंजीकृत हो गई है और हमारे एआई इंजन द्वारा सत्यापित की गई है।",
    assignedTitle: "आवंटित पर्यवेक्षण अधिकारी का विवरण",
    officerName: "अधिकारी का नाम",
    designation: "पद",
    department: "विभाग",
    contactPhone: "संपर्क नंबर",
    complaintId: "शिकायत आईडी",
    slaWindow: "समाधान की समय सीमा (SLA)",
    dismissBtn: "स्वीकार करें और जारी रखें",
    addressLabel: "पंजीकृत स्थान",
    areaZone: "क्षेत्र का प्रकार / क्षेत्र",
  },
  Telugu: {
    successTitle: "ఫిర్యాదు విజయవంతంగా సమర్పించబడింది!",
    successSubtitle: "మీ పౌర సమస్య బ్లాక్ లెడ్జర్‌లో నమోదు చేయబడింది మరియు మా ఏఐ ఇంజిన్‌తో ధృవీకరించబడింది.",
    assignedTitle: "కేటాయించబడిన పర్యవేక్షణ అధికారి వివరాలు",
    officerName: "అధికారి పేరు",
    designation: "హోదా",
    department: "విభాగం",
    contactPhone: "సంప్రదింపు సంఖ్య",
    complaintId: "ఫిర్యాదు ఐడి",
    slaWindow: "పరిష్కార సమయం (SLA)",
    dismissBtn: "ధృవీకరించి కొనసాగించండి",
    addressLabel: "నమోదిత చిరునామా",
    areaZone: "ప్రాంతం రకం / జోన్",
  },
  Tamil: {
    successTitle: "புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
    successSubtitle: "உங்கள் குடிமைப் பிரச்சனை பிளாக் லெட்ஜரில் பதிவு செய்யப்பட்டு, எங்களது ஏআই சரிபார்ப்பு மூலம் உறுதி செய்யப்பட்டுள்ளது.",
    assignedTitle: "நியமிக்கப்பட்ட மேற்பார்வை அதிகாரியின் விவரங்கள்",
    officerName: "அதிகாரியின் பெயர்",
    designation: "பதவி",
    department: "துறை",
    contactPhone: "தொடர்பு எண்",
    complaintId: "புகார் ID",
    slaWindow: "தீர்வு காலக்கெடு (SLA)",
    dismissBtn: "உறுதிசெய்து தொடரவும்",
    addressLabel: "பதிவு செய்யப்பட்ட முகவரி",
    areaZone: "பகுதி வகை / மண்டலம்",
  },
  Urdu: {
    successTitle: "شکایت کامیابی کے ساتھ درج ہو گئی!",
    successSubtitle: "آپ کا عوامی مسئلہ بلاک لیجر میں درج کر دیا گیا ہے اور ہمارے اے آئی انجن نے اس کی تصدیق کر دی ہے۔",
    assignedTitle: "متعلقہ سپروائزنگ آفیسر کی تفصیلات",
    officerName: "آفیسر کا نام",
    designation: "عہدہ",
    department: "محکمہ",
    contactPhone: "رابطہ نمبر",
    complaintId: "شکایت آئی ڈی",
    slaWindow: "حل کی آخری حد (SLA)",
    dismissBtn: "تصدیق کریں اور آگے بڑھیں",
    addressLabel: "درج کردہ مقام",
    areaZone: "علاقے کی قسم / زون",
  },
  Kannada: {
    successTitle: "ದೂರು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ!",
    successSubtitle: "ನಿಮ್ಮ ನಾಗರಿಕ ದೂರನ್ನು ಬ್ಲಾಕ್ ಲೆಡ್ಜರ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ ಮತ್ತು ನಮ್ಮ ಎಐ ಎಂಜಿನ್‌ನಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",
    assignedTitle: "ನಿಯೋಜಿತ ಮೇಲ್ವಿಚಾರಣಾ ಅಧಿಕಾರಿಯ ವಿವರಗಳು",
    officerName: "ಅಧಿಕಾರಿಯ ಹೆಸರು",
    designation: "ಹುದ್ದೆ",
    department: "ಇಲಾಖೆ",
    contactPhone: "ಸಂಪರ್ಕ ಸಂಖ್ಯೆ",
    complaintId: "ದೂರು ಐಡಿ",
    slaWindow: "ಪರಿಹಾರದ ಗಡುವು (SLA)",
    dismissBtn: "ಖಚಿತಪಡಿಸಿ ಮುಂದುವರಿಯಿರಿ",
    addressLabel: "ನೋಂದಾಯಿತ ಸ್ಥಳ",
    areaZone: "ಪ್ರದೇಶದ ಪ್ರಕಾರ / ವಲಯ",
  },
  Malayalam: {
    successTitle: "പരാതി വിജയകരമായി ഫയൽ ചെയ്തു!",
    successSubtitle: "നിങ്ങളുടെ പരാതി വിജയകരമായി രജിസ്റ്റർ ചെയ്യുകയും ഞങ്ങളുടെ എഐ സിസ്റ്റം പരിശോധിക്കുകയും ചെയ്തിട്ടുണ്ട്.",
    assignedTitle: "ചുമതലയുള്ള ഉദ്യോഗസ്ഥന്റെ വിവരങ്ങൾ",
    officerName: "ഉദ്യോഗസ്ഥന്റെ പേര്",
    designation: "തസ്തിക",
    department: "വകുപ്പ്",
    contactPhone: "ബന്ധപ്പെടേണ്ട നമ്പർ",
    complaintId: "പരാതി ഐഡി",
    slaWindow: "പരിഹാര സമയപരിധി (SLA)",
    dismissBtn: "സ്ഥിരീകരിച്ച് തുടരുക",
    addressLabel: "രജിസ്റ്റർ ചെയ്ത സ്ഥലം",
    areaZone: "മേഖലയുടെ തരം / സോൺ",
  },
  Marathi: {
    successTitle: "तक्रार यशस्वीरित्या नोंदवली गेली!",
    successSubtitle: "तुमची नागरी तक्रार ब्लॉक लेजरवर नोंदवली गेली आहे आणि आमच्या एआय इंजिनद्वारे सत्यापित केली गेली आहे.",
    assignedTitle: "नियुक्त पर्यवेक्षक अधिकाऱ्याचा तपशील",
    officerName: "अधिकाऱ्याचे नाव",
    designation: "पद",
    department: "विभाग",
    contactPhone: "संपर्क क्रमांक",
    complaintId: "तक्रार आयडी",
    slaWindow: "निवारण कालावधी (SLA)",
    dismissBtn: "स्वीकार करा आणि पुढे चला",
    addressLabel: "नोंदणीकृत ठिकाण",
    areaZone: "क्षेत्राचा प्रकार / झोन",
  },
  Bengali: {
    successTitle: "অভিযোগ সফলভাবে দায়ের করা হয়েছে!",
    successSubtitle: "আপনার নাগরিক অভিযোগ ব্লক লেজারে নথিভুক্ত করা হয়েছে এবং আমাদের এআই ইঞ্জিন দ্বারা যাচাই করা হয়েছে।",
    assignedTitle: "নিয়োজিত তদারকি কর্মকর্তার বিবরণ",
    officerName: "কর্মকর্তার নাম",
    designation: "পদবি",
    department: "বিভাগ",
    contactPhone: "যোগাযোগ নম্বর",
    complaintId: "অভিযোগ আইডি",
    slaWindow: "সমাধানের সময়সীমা (SLA)",
    dismissBtn: "স্বীকার করুন এবং এগিয়ে যান",
    addressLabel: "নিবন্ধিত স্থান",
    areaZone: "এলাকার ধরণ / জোন",
  },
  Gujarati: {
    successTitle: "ફરિયાદ સફળતાપૂર્વક નોંધવામાં આવી છે!",
    successSubtitle: "તમારી નાગરિક ફરિયાદ બ્લોક લેજર પર રજીસ્ટર કરવામાં આવી છે અને અમારા એઆઈ એન્જિન દ્વારા ચકાસવામાં આવી છે.",
    assignedTitle: "સોંપાયેલ સુપરવાઇઝિંગ ઓફિસરની વિગતો",
    officerName: "અધિકારીનું નામ",
    designation: "હોદ્દો",
    department: "વિભાગ",
    contactPhone: "સંપર્ક નંબર",
    complaintId: "ફરિયાદ આઈડી",
    slaWindow: "નિવારણ સમય મર્યાદા (SLA)",
    dismissBtn: "સ્વીકારો અને આગળ વધો",
    addressLabel: "નોંધાયેલ સ્થળ",
    areaZone: "વિસ્તારનો પ્રકાર / ઝોન",
  },
  Punjabi: {
    successTitle: "ਸ਼ਿਕਾਇਤ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਕੀਤੀ ਗਈ!",
    successSubtitle: "ਤੁਹਾਡੀ ਸ਼ਿਕਾਇਤ ਬਲਾਕ ਲੇਜ਼ਰ 'ਤੇ ਦਰਜ ਕੀਤੀ ਗਈ ਹੈ ਅਤੇ ਸਾਡੇ ਏਆਈ ਇੰਜਣ ਦੁਆਰਾ ਤਸਦੀਕ ਕੀਤੀ ਗਈ ਹੈ।",
    assignedTitle: "ਨਿਯੁਕਤ ਨਿਗਰਾਨ ਅਧਿਕਾਰੀ ਦੇ ਵੇਰਵੇ",
    officerName: "ਅਧਿਕਾਰੀ ਦਾ ਨਾਮ",
    designation: "ਅਹੁਦਾ",
    department: "ਵਿਭਾਗ",
    contactPhone: "ਸੰਪਰਕ ਨੰਬਰ",
    complaintId: "ਸ਼ਿਕਾਇਤ ਆਈਡੀ",
    slaWindow: "ਹੱਲ ਦਾ ਸਮਾਂ (SLA)",
    dismissBtn: "ਸਵੀਕਾਰ ਕਰੋ ਅਤੇ ਅੱਗੇ ਵਧੋ",
    addressLabel: "ਦਰਜ ਕੀਤੀ ਗਈ ਥਾਂ",
    areaZone: "ਖੇਤਰ ਦੀ ਕਿਸਮ / ਜ਼ੋਨ",
  },
  Odia: {
    successTitle: "ଅଭିଯୋଗ ସଫଳତାର ସହିତ ଦାଖଲ ହୋଇଛି!",
    successSubtitle: "ଆପଣଙ୍କର ଅଭିଯୋଗ ବ୍ଲକ୍ ଲେଜରରେ ପଞ୍જୀକୃତ ହୋଇଛି ଏବଂ ଆମର ଏଆଇ ଦ୍ୱାରା ଯାଞ୍ଚ ହୋଇଛି ।",
    assignedTitle: "ନିଯୁକ୍ତ ଅଧିକାରୀଙ୍କ ବିବରଣୀ",
    officerName: "ଅଧିକାରୀଙ୍କ ନାମ",
    designation: "ପଦବୀ",
    department: "ବିଭାଗ",
    contactPhone: "ସମ୍ପର୍କ ନମ୍ବର",
    complaintId: "ଅଭିଯୋଗ ଆଇଡି",
    slaWindow: "ସମାଧାନର ସମୟସୀମା (SLA)",
    dismissBtn: "ସ୍ୱୀକାର କରନ୍ତು ଏବଂ ଆଗକୁ ବଢନ୍ତು",
    addressLabel: "ପଞ୍ಜୀକୃତ ସ୍ଥାନ",
    areaZone: "ଅଞ୍ଚଳ ପ୍ରକାର / ଜୋନ୍",
  },
  Assamese: {
    successTitle: "অভিযোগ সফলভাৱে পঞ্জীয়ন কৰা হৈছে!",
    successSubtitle: "আপোনাৰ অভিযোগটো ব্লক লেজাৰত নথিভুক্ত কৰা হৈছে আৰু আমাৰ এআই ইঞ্জিনৰ দ্বাৰা মেৰামতি পৰীক্ষা কৰা হৈছে।",
    assignedTitle: "নিযুক্ত তত্ত্বাৱধায়ক বিষয়াৰ তথ্য",
    officerName: "বিষয়াৰ নাম",
    designation: "পদবী",
    department: "বিভাগ",
    contactPhone: "যোগাযোগৰ নম্বৰ",
    complaintId: "অভিযোগ আইডি",
    slaWindow: "সমাধানৰ সময়সীমা (SLA)",
    dismissBtn: "স্বীকার কৰক আৰু আগবাঢ়ক",
    addressLabel: "পঞ্জীয়ন কৰা স্থান",
    areaZone: "এলেকাৰ প্ৰকাৰ / মণ্ডল",
  }
};

export default function CitizenDashboard({
  userId,
  userName,
  userEmail,
  selectedLanguage,
  activeTab,
}: CitizenDashboardProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newlyCreatedComplaint, setNewlyCreatedComplaint] = useState<Complaint | null>(null);

  // Form State
  const [areaType, setAreaType] = useState<AreaType>("urban");
  const [category, setCategory] = useState(SECTORS[0]);
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [latitude, setLatitude] = useState(22.7533);
  const [longitude, setLongitude] = useState(75.8937);
  const [address, setAddress] = useState("Vijay Nagar Main Rd, Scheme 54, Vijay Nagar, Indore");
  const [wardOrVillage, setWardOrVillage] = useState("Ward 45");
  const [district, setDistrict] = useState("Indore");
  const [stateName, setStateName] = useState("Madhya Pradesh");
  const [pincode, setPincode] = useState("452010");
  const [submitting, setSubmitting] = useState(false);
  const [gpsAreaType, setGpsAreaType] = useState<"urban" | "rural" | null>(null);

  // Landmark search state variables
  const [searchQuery, setSearchQuery] = useState("");
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Geolocation & Live AI Evidence check states
  const [fetchingGps, setFetchingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [verifyingImage, setVerifyingImage] = useState(false);
  const [evidenceAudit, setEvidenceAudit] = useState<{
    isSuitable: boolean;
    reason: string;
    detailLevel: string;
  } | null>(null);

  // Messaging state
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Feedback/Rating state
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSpeed, setFeedbackSpeed] = useState(5);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Optional submission experience feedback state
  const [submissionExpRating, setSubmissionExpRating] = useState(5);
  const [submissionExpComment, setSubmissionExpComment] = useState("");
  const [submittingExpFeedback, setSubmittingExpFeedback] = useState(false);
  const [isExpFeedbackSubmitted, setIsExpFeedbackSubmitted] = useState(false);

  const isLocationMismatch = !!(gpsAreaType && gpsAreaType !== areaType);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoadingList(true);
    try {
      const res = await fetch(`/api/complaints?role=citizen&citizenId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints);
      }
    } catch (err) {
      console.error("Failed to load complaints:", err);
    } finally {
      setLoadingList(false);
    }
  };

  // Ultra-fast canvas image compression helper (<20ms)
  const compressImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  };

  // Convert uploaded image to base64 with instant web-optimization and fast AI analysis
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setVerifyingImage(true);
      setEvidenceAudit(null);

      try {
        // High-speed downscale & payload compression
        const base64String = await compressImage(file, 800, 800, 0.8);
        setImagePreview(base64String);

        // Sub-second AI Evidence verification API request
        const res = await fetch("/api/verify-evidence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            evidenceUrl: base64String,
            category: category,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setEvidenceAudit({
            isSuitable: data.isSuitable,
            reason: data.reason,
            detailLevel: data.detailLevel,
          });
        }
      } catch (err) {
        console.error("AI Evidence check failed:", err);
      } finally {
        setVerifyingImage(false);
      }
    }
  };

  // Re-verify the image if the user changes the category/department
  useEffect(() => {
    if (imagePreview) {
      let isCurrent = true;
      const reVerify = async () => {
        setVerifyingImage(true);
        try {
          const res = await fetch("/api/verify-evidence", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              evidenceUrl: imagePreview,
              category: category,
            }),
          });
          if (res.ok && isCurrent) {
            const data = await res.json();
            setEvidenceAudit({
              isSuitable: data.isSuitable,
              reason: data.reason,
              detailLevel: data.detailLevel,
            });
          }
        } catch (err) {
          console.error("AI Evidence re-check failed:", err);
        } finally {
          if (isCurrent) setVerifyingImage(false);
        }
      };
      reVerify();
      return () => { isCurrent = false; };
    }
  }, [category]);

  // High-accuracy Geolocation tracker & Reverse Geocoding
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      return;
    }

    setFetchingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        await handlePositionUpdate(lat, lng);
        setFetchingGps(false);
      },
      (error) => {
        console.error("GPS retrieval error:", error);
        setGpsError(error.message || "Unable to retrieve high-accuracy location");
        setFetchingGps(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // Auto-fetch GPS position on mount
  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  // Interactive GIS Map selection simulation
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Map pixel coordinates to Indore geo bounding box roughly
    const lat = 22.7 + (1 - y / rect.height) * 0.1;
    const lng = 75.8 + (x / rect.width) * 0.15;

    handlePositionUpdate(lat, lng);
  };

  // Landmark or address search and auto-marker placement
  const handleLocationSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchingLocation(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + " Indore Madhya Pradesh")}&limit=1&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (response.ok) {
        const dataArray = await response.json();
        if (dataArray && dataArray.length > 0) {
          const data = dataArray[0];
          const lat = parseFloat(data.lat);
          const lon = parseFloat(data.lon);
          
          setLatitude(lat);
          setLongitude(lon);
          
          // Re-use handlePositionUpdate to get rich data for this lat/lon
          handlePositionUpdate(lat, lon);
          setSearchingLocation(false);
          return;
        }
      }
    } catch (err) {
      console.error("Client Nominatim Search API failed:", err);
    }

    try {
      const res = await fetch("/api/search-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, areaType }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          setLatitude(data.latitude);
          setLongitude(data.longitude);
          setAddress(data.address);
          setWardOrVillage(data.wardOrVillage || (areaType === "rural" ? "Village Panchayat" : "Ward 45"));
          setDistrict(data.district || "Indore");
          setStateName(data.state || "Madhya Pradesh");
          setPincode(data.pincode || (areaType === "urban" ? "452010" : "453331"));

          // Calculate gps area type based on query location
          const latNum = parseFloat(data.latitude);
          const lngNum = parseFloat(data.longitude);
          const distanceToCenter = Math.sqrt(Math.pow(latNum - 22.7196, 2) + Math.pow(lngNum - 75.8577, 2));
          const hasVillage = (data.wardOrVillage || "").toLowerCase().includes("panchayat") || (data.address || "").toLowerCase().includes("panchayat") || (data.address || "").toLowerCase().includes("village") || distanceToCenter > 0.085;
          const isSemiUrban = !hasVillage && (distanceToCenter > 0.045);
          setGpsAreaType(hasVillage ? "rural" : isSemiUrban ? "semi-urban" : "urban");
        } else {
          setSearchError("No match found for this location in Indore. Please click on the map directly or try another landmark.");
        }
      } else {
        setSearchError("Could not connect to geocoding services. Please try manual selection.");
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchError("Search failed. Please try manual selection.");
    } finally {
      setSearchingLocation(false);
    }
  };

  // Real Google Map position updater with dynamic reverse geocoding
  const handlePositionUpdate = async (lat: number, lng: number) => {
    setLatitude(parseFloat(lat.toFixed(6)));
    setLongitude(parseFloat(lng.toFixed(6)));

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.address) {
          const fullAddress = data.display_name;
          const addrObj = data.address;
          
          const state = addrObj.state || "Madhya Pradesh";
          const district = addrObj.city_district || addrObj.county || addrObj.district || addrObj.state_district || "Unknown District";
          const city = addrObj.city || addrObj.town || addrObj.village || addrObj.municipality || "Unknown City";
          const pincode = addrObj.postcode || (areaType === "urban" ? "452010" : "453331");
          
          let wOrV = "";
          const isRuralGPS = !!addrObj.village || !!addrObj.hamlet || !!addrObj.isolated_dwellings || !!addrObj.farm || !!addrObj.croft || !!addrObj.allotments || (fullAddress.toLowerCase().includes("panchayat") || fullAddress.toLowerCase().includes("gram"));
          const isSemiUrbanGPS = !isRuralGPS && (!!addrObj.town || !!addrObj.municipality || !!addrObj.borough);
          const detectedAreaType = isRuralGPS ? "rural" : isSemiUrbanGPS ? "semi-urban" : "urban";
          
          if (isRuralGPS) {
            const vName = addrObj.village || addrObj.hamlet || addrObj.town || "Village";
            wOrV = (vName.toLowerCase().includes("panchayat") || vName.toLowerCase().includes("gram"))
              ? vName
              : `${vName} Gram Panchayat`;
          } else {
            const sub = addrObj.suburb || addrObj.neighbourhood || addrObj.residential || addrObj.city_district || "";
            const wardSeed = Math.floor((lat + lng) * 1000) % 150 + 1;
            wOrV = `Ward ${wardSeed}`;
            if (sub) {
              wOrV += ` - ${sub}`;
            }
          }

          setAddress(fullAddress);
          setWardOrVillage(wOrV);
          setDistrict(city !== "Unknown City" ? city : district);
          setStateName(state);
          setPincode(pincode);
          setGpsAreaType(detectedAreaType);
          return;
        }
      }
    } catch (err) {
      console.error("Client Nominatim API failed:", err);
    }

    try {
      const res = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lng, areaType }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          setAddress(data.address);
          setWardOrVillage(data.wardOrVillage || data.village || (areaType === "rural" ? "Village Panchayat" : "Ward 45"));
          setDistrict(data.district || "Indore");
          setStateName(data.state || "Madhya Pradesh");
          setPincode(data.pincode || (areaType === "urban" ? "452010" : "453331"));
          if (data.detectedAreaType) {
            setGpsAreaType(data.detectedAreaType);
          }
        }
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    }
  };

  // Automatically re-geocode coordinates to refresh Mapped Ward/Village and Calculated Address when areaType changes
  useEffect(() => {
    if (latitude !== 22.7533 || longitude !== 75.8937) {
      handlePositionUpdate(latitude, longitude);
    }
  }, [areaType]);

  // Submit Complaint
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    // Strict guard to block unverified or unsuitable/category-mismatched images
    if (imagePreview && (!evidenceAudit || !evidenceAudit.isSuitable)) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        citizenId: userId,
        citizenName: userName,
        citizenEmail: userEmail,
        description,
        originalLanguage: selectedLanguage,
        areaType,
        category,
        location: {
          latitude,
          longitude,
          address,
          state: stateName,
          district: district,
          wardOrVillage,
          pincode: pincode,
        },
        evidenceUrl: imagePreview,
      };

      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        // Reset form
        setDescription("");
        setImagePreview(null);
        setImageFile(null);
        // Reset experience feedback states
        setSubmissionExpRating(5);
        setSubmissionExpComment("");
        setIsExpFeedbackSubmitted(false);

        if (data && data.complaint) {
          setNewlyCreatedComplaint(data.complaint);
        }
        fetchComplaints();
      }
    } catch (err) {
      console.error("Complaint filing failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Post chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedComplaint) return;

    setSendingMessage(true);
    try {
      const res = await fetch(`/api/complaints/${selectedComplaint.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "citizen",
          senderName: userName,
          text: newMessage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedComplaint((prev) => prev ? { ...prev, messages: data.messages } : null);
        setNewMessage("");
        fetchComplaints(); // Refresh background list
      }
    } catch (err) {
      console.error("Failed to deliver message:", err);
    } finally {
      setSendingMessage(false);
    }
  };

  // Post resolution rating and close ticket
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setSubmittingFeedback(true);
    try {
      const res = await fetch(`/api/complaints/${selectedComplaint.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: feedbackRating,
          satisfaction: feedbackText,
          speedRating: feedbackSpeed,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedComplaint(data.complaint);
        setFeedbackText("");
        fetchComplaints();
      }
    } catch (err) {
      console.error("Feedback dispatch failed:", err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Post optional complaint submission experience feedback
  const handleSubmissionFeedbackSubmit = async (complaintId: string) => {
    setSubmittingExpFeedback(true);
    try {
      const res = await fetch(`/api/complaints/${complaintId}/submission-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: submissionExpRating,
          comment: submissionExpComment,
        }),
      });
      if (res.ok) {
        setIsExpFeedbackSubmitted(true);
        fetchComplaints(); // refresh complaints list
      }
    } catch (err) {
      console.error("Failed to submit submission experience feedback:", err);
    } finally {
      setSubmittingExpFeedback(false);
    }
  };

  // Get status pill styling
  const getStatusBadge = (status: string) => {
    const base = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold leading-none uppercase font-mono ";
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Column: Register Grievance Wizard */}
        {activeTab !== "my-complaints" && (
          <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-black tracking-tight text-slate-900">
                {t(selectedLanguage, "raiseComplaint")}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Step 1: Geographic Location Map */}
              <div>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    1. {t(selectedLanguage, "location")}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGetCurrentLocation}
                      disabled={fetchingGps}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md transition-all shadow-sm border border-amber-200 disabled:opacity-50"
                    >
                      <MapPin className={`h-3 w-3 ${fetchingGps ? "animate-bounce" : ""}`} />
                      {fetchingGps ? t(selectedLanguage, "retrievingGps") : t(selectedLanguage, "accurateGps")}
                    </button>
                    <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
                      {t(selectedLanguage, "gisMap")}
                    </span>
                  </div>
                </div>

                {gpsError && (
                  <p className="mb-2 text-[10px] font-semibold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 font-mono">
                    ⚠ GPS: {gpsError}
                  </p>
                )}

                {/* Search Landmark or Neighborhood to Pinpoint Address */}
                <div className="mb-3">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={t(selectedLanguage, "mapSearchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleLocationSearch();
                        }
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-24 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder:text-slate-400"
                    />
                    <div className="absolute left-3 text-slate-400 pointer-events-none">
                      <Search className="h-3.5 w-3.5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLocationSearch()}
                      disabled={searchingLocation}
                      className="absolute right-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 text-[10px] font-bold transition-all disabled:bg-slate-100 disabled:text-slate-400 flex items-center gap-1"
                    >
                      {searchingLocation ? (
                        <>
                          <span className="h-2 w-2 animate-spin rounded-full border border-white border-t-transparent"></span>
                          <span>{t(selectedLanguage, "searching")}</span>
                        </>
                      ) : (
                        <span>{t(selectedLanguage, "searchLocation")}</span>
                      )}
                    </button>
                  </div>
                  {searchError && (
                    <p className="mt-1 text-[10px] font-semibold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 font-mono">
                      ⚠ {searchError}
                    </p>
                  )}
                </div>

                {/* Fully Interactive Map with Dynamic Leaflet/OSM Fallback */}
                <InteractiveGmpMap
                  latitude={latitude}
                  longitude={longitude}
                  onPositionChange={handlePositionUpdate}
                  height="176px"
                  selectedLanguage={selectedLanguage}
                />

                <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                  <div className={`rounded-xl border border-slate-100 bg-slate-50 p-2.5 transition-all ${isLocationMismatch ? "opacity-60" : ""}`}>
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">
                      {areaType === "rural" ? t(selectedLanguage, "villagePanchayat") : t(selectedLanguage, "municipalWard")}
                    </span>
                    <input
                      type="text"
                      value={wardOrVillage}
                      onChange={(e) => setWardOrVillage(e.target.value)}
                      disabled={isLocationMismatch}
                      placeholder={areaType === "rural" ? "e.g., Rangwasa Village Panchayat" : "e.g., Ward 45"}
                      className="w-full bg-transparent font-semibold text-xs text-slate-800 outline-none disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className={`rounded-xl border border-slate-100 bg-slate-50 p-2.5 transition-all ${isLocationMismatch ? "opacity-60" : ""}`}>
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">{t(selectedLanguage, "calculatedAddress")}</span>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={isLocationMismatch}
                      className="w-full bg-transparent font-semibold text-xs text-slate-800 outline-none overflow-ellipsis disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="mt-2 grid gap-2 grid-cols-3">
                  <div className={`rounded-xl border border-slate-100 bg-slate-50 p-2.5 transition-all ${isLocationMismatch ? "opacity-60" : ""}`}>
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">{t(selectedLanguage, "cityDistrict")}</span>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      disabled={isLocationMismatch}
                      className="w-full bg-transparent font-semibold text-xs text-slate-800 outline-none disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className={`rounded-xl border border-slate-100 bg-slate-50 p-2.5 transition-all ${isLocationMismatch ? "opacity-60" : ""}`}>
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">{t(selectedLanguage, "state")}</span>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      disabled={isLocationMismatch}
                      className="w-full bg-transparent font-semibold text-xs text-slate-800 outline-none disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className={`rounded-xl border border-slate-100 bg-slate-50 p-2.5 transition-all ${isLocationMismatch ? "opacity-60" : ""}`}>
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">{t(selectedLanguage, "pincode")}</span>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      disabled={isLocationMismatch}
                      className="w-full bg-transparent font-semibold text-xs text-slate-800 outline-none disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Area Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  2. {t(selectedLanguage, "areaType")}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["urban", "rural", "semi-urban"] as AreaType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAreaType(type)}
                      className={`rounded-xl border p-3 text-center text-xs font-bold capitalize transition-all ${
                        areaType === type
                           ? "border-amber-600 bg-amber-50/50 text-amber-900"
                           : "border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {t(selectedLanguage, type)}
                    </button>
                  ))}
                </div>

                {/* Dynamic GPS Tab Mismatch Suggestion Alert */}
                {gpsAreaType && gpsAreaType !== areaType && (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 shadow-sm animate-fade-in">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-amber-100 p-2 text-amber-800 shrink-0">
                        <Info className="h-4 w-4 animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-amber-900 font-mono uppercase tracking-wide flex items-center gap-1.5">
                          <span>{t(selectedLanguage, "locationMismatchTitle")}</span>
                          <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 uppercase font-mono tracking-normal">{t(selectedLanguage, "formLocked")}</span>
                        </h4>
                        <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                          {gpsAreaType === "rural" 
                            ? t(selectedLanguage, "ruralMismatchDesc")
                            : t(selectedLanguage, "urbanMismatchDesc")
                          }
                        </p>
                        
                        <div className="mt-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-[11px] font-semibold text-rose-950 font-mono flex items-center gap-1.5">
                          <span>🔒</span> {t(selectedLanguage, "formLockedBanner")}
                        </div>

                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setAreaType(gpsAreaType as AreaType);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-[11px] font-bold text-white shadow hover:bg-amber-700 transition-all cursor-pointer"
                          >
                            {t(selectedLanguage, "switchTab")} ({t(selectedLanguage, gpsAreaType as string)})
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Sector Choice */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  3. {t(selectedLanguage, "sector")}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isLocationMismatch}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  {SECTORS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 4: Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  4. {t(selectedLanguage, "description")}
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLocationMismatch}
                  placeholder={isLocationMismatch ? t(selectedLanguage, "lockedPlaceholder") : "Describe your issue with locations, safety risks, duration..."}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs font-medium text-slate-800 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                ></textarea>
              </div>

              {/* Step 5: Evidence Attachment */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  5. {t(selectedLanguage, "evidence")}
                </label>

                {imagePreview ? (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-48 flex items-center justify-center bg-slate-950">
                      <img src={imagePreview} alt="Attached incident" className="max-h-48 object-contain" />
                      <button
                        type="button"
                        disabled={isLocationMismatch}
                        onClick={() => {
                          setImagePreview(null);
                          setEvidenceAudit(null);
                        }}
                        className="absolute top-2 right-2 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs text-white hover:bg-slate-900 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Change Photo
                      </button>
                    </div>

                    {/* AI Auditing feedback box */}
                    {verifyingImage && (
                      <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs font-medium text-amber-900 font-mono animate-pulse shadow-sm">
                        <Zap className="h-4 w-4 text-amber-600 animate-bounce" />
                        <span>⚡ Ultra-Fast AI Vision Auditor scanning image for {category}...</span>
                      </div>
                    )}

                    {!verifyingImage && evidenceAudit && (
                      <div className={`rounded-xl border p-3 text-xs font-mono transition-all shadow-sm ${
                        evidenceAudit.isSuitable 
                          ? "border-emerald-200 bg-emerald-50/70 text-emerald-900" 
                          : "border-rose-200 bg-rose-50/70 text-rose-900"
                      }`}>
                        <div className="flex items-center justify-between gap-1.5 font-bold mb-1">
                          <span className="flex items-center gap-1.5">
                            {evidenceAudit.isSuitable ? "⚡ AI High-Speed Verification Approved" : "❌ AI Verification Mismatch"}
                          </span>
                          <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                            Accuracy: High ({evidenceAudit.detailLevel})
                          </span>
                        </div>
                        <p className="text-[11px] font-medium leading-relaxed">{evidenceAudit.reason}</p>
                        {!evidenceAudit.isSuitable && (
                          <p className="mt-2 text-[10px] text-rose-700 font-bold">
                            ⚠ Please replace with a clear photograph matching "{category}".
                          </p>
                        )}
                      </div>
                    )}

                    {!verifyingImage && !evidenceAudit && (
                      <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-xs font-mono text-amber-800">
                        <p className="font-bold">⚠ Image Verification Pending</p>
                        <p className="text-[11px] font-medium leading-relaxed mt-1">Please select/re-upload your image to trigger the AI suitability audit.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className={`flex flex-col items-center justify-center h-28 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors ${isLocationMismatch ? "opacity-50 cursor-not-allowed" : "hover:border-amber-500 hover:bg-slate-50/50 cursor-pointer"}`}>
                    <Upload className="h-5 w-5 text-slate-400 mb-1" />
                    <span className="text-[11px] font-bold text-slate-500">Drag or click to attach incident photo</span>
                    <span className="text-[9px] text-slate-400 font-mono">PNG, JPG, BMP up to 10MB</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isLocationMismatch} />
                  </label>
                )}
              </div>

              {/* Image verification warning banners */}
              {imagePreview && (!evidenceAudit || !evidenceAudit.isSuitable) && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-xs text-rose-800 font-medium space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                    {!evidenceAudit ? "AI Image Verification is pending..." : "AI Verification Failed / Category Mismatch"}
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    {!evidenceAudit 
                      ? "The AI Evidence Auditor must complete scanning the attached photo before you can submit."
                      : "The uploaded photograph does not match the selected category perfectly or lacks sufficient detail. Please upload a clear photo depicting the issue or select the correct category."}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || verifyingImage || (imagePreview ? (!evidenceAudit || !evidenceAudit.isSuitable) : false) || isLocationMismatch}
                className="w-full rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold py-3 text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-transparent"></div>
                    {t(selectedLanguage, "loading")}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                    {t(selectedLanguage, "submit")}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        )}

        {/* Right Column: Track Grievance List */}
        <div className={`${activeTab === "my-complaints" ? "lg:col-span-12" : "lg:col-span-5"} space-y-6`}>
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md">
            <h3 className="text-lg font-black tracking-tight text-slate-900 mb-4 flex items-center gap-2">
              <Compass className="h-5 w-5 text-indigo-700" />
              {t(selectedLanguage, "myComplaints")}
            </h3>

            {loadingList ? (
              <div className="space-y-3 py-4">
                <div className="h-16 rounded-xl bg-slate-50 animate-pulse"></div>
                <div className="h-16 rounded-xl bg-slate-50 animate-pulse"></div>
              </div>
            ) : complaints.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {complaints.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedComplaint(c)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all flex items-start gap-3 hover:shadow-sm ${
                      selectedComplaint?.id === c.id
                        ? "border-indigo-600 bg-indigo-50/20"
                        : "border-slate-100 bg-white"
                    }`}
                  >
                    <div className="rounded-xl h-12 w-12 shrink-0 overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
                      {c.evidenceUrl ? (
                        <img src={c.evidenceUrl} className="h-full w-full object-cover" />
                      ) : (
                        <FileImage className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-mono text-[10px] font-extrabold text-indigo-700">{c.id}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-medium">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug truncate">{c.title}</h4>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className={getStatusBadge(c.status)}>{t(selectedLanguage, c.status)}</span>
                        <span className={getSeverityBadge(c.severity)}>{t(selectedLanguage, c.severity)}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 self-center" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                <HelpCircle className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="mt-2 text-xs font-semibold text-slate-400">{t(selectedLanguage, "noComplaints")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Details Drawer Modal Overlay */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <span className="font-mono text-xs font-extrabold text-indigo-700">{selectedComplaint.id}</span>
                  <h3 className="text-base font-black text-slate-900 mt-1">{selectedComplaint.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  {t(selectedLanguage, "closeDetailsBtn")}
                </button>
              </div>

              {/* Badges Info */}
              <div className="mb-6 flex flex-wrap gap-3 items-center">
                <span className={getStatusBadge(selectedComplaint.status)}>{t(selectedLanguage, selectedComplaint.status)}</span>
                <span className={getSeverityBadge(selectedComplaint.severity)}>{t(selectedLanguage, selectedComplaint.severity)}</span>
                <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-md capitalize">
                  {t(selectedLanguage, selectedComplaint.areaType)} {t(selectedLanguage, "zone")}
                </span>
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                  {selectedComplaint.category}
                </span>
              </div>

              {/* Photos & Analysis row */}
              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                {selectedComplaint.evidenceUrl && (
                  <div className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 max-h-40 flex items-center justify-center">
                    <img src={selectedComplaint.evidenceUrl} className="max-h-40 object-contain" />
                  </div>
                )}

                {selectedComplaint.aiVerification && (
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50/50 border border-indigo-100/40 p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-indigo-800">
                      <Bot className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider font-mono">{t(selectedLanguage, "aiTriageAudit")}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-700 font-medium">
                      *Summary:* {selectedComplaint.aiSummary || selectedComplaint.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selectedComplaint.aiVerification.labels.map((lbl) => (
                        <span key={lbl} className="bg-white/80 rounded px-1.5 py-0.5 text-[9px] text-indigo-700 border border-indigo-100/50 font-semibold">
                          #{lbl}
                        </span>
                      ))}
                    </div>
                    <p className="text-[9px] text-slate-400 font-mono">
                      {t(selectedLanguage, "expectedRoutingGroup")}: <span className="font-bold text-slate-600">{selectedComplaint.aiVerification.expectedDepartment}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Original complaint text */}
              <div className="rounded-2xl bg-slate-50/50 p-4 border border-slate-100 mb-6">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">{t(selectedLanguage, "originalDescriptionLabel")}</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium mt-1">{selectedComplaint.description}</p>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  <span>{selectedComplaint.location.address}</span>
                </div>
              </div>

              {/* Assigned Officer */}
              {selectedComplaint.assignedOfficer && (
                <div className="rounded-2xl border border-slate-100 p-4 bg-white shadow-sm mb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase font-mono leading-none">
                          {t(selectedLanguage, "assignedOfficerLabel")}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 mt-0.5">{selectedComplaint.assignedOfficer.name}</h4>
                        <p className="text-[10px] text-slate-500">{selectedComplaint.assignedOfficer.title}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-50 px-2 py-1 rounded border border-sky-100">
                      {selectedComplaint.assignedOfficer.department}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">
                        {SUCCESS_MODAL_TRANSLATIONS[selectedLanguage]?.contactPhone || SUCCESS_MODAL_TRANSLATIONS.English.contactPhone}:
                      </span>
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {selectedComplaint.assignedOfficer.phone}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        SLA: 24 - 48 Hours
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline status history */}
              <div className="mb-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">{t(selectedLanguage, "resolutionMilestone")}</h4>
                <div className="relative pl-6 space-y-4 border-l-2 border-slate-100">
                  {selectedComplaint.statusHistory.map((hist, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[31px] top-0.5 rounded-full h-3 w-3 bg-indigo-600 border-2 border-white"></div>
                      <div className="text-xs">
                        <span className="font-bold text-slate-800">{hist.status}</span>
                        <span className="ml-2 font-mono text-[9px] text-slate-400">
                          {new Date(hist.timestamp).toLocaleString()}
                        </span>
                        <p className="mt-1 text-slate-500 text-[11px] leading-relaxed font-medium">{hist.note}</p>
                        <span className="text-[9px] text-slate-400 italic">By: {hist.updatedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback rating form if status is Resolved or Closed */}
              {selectedComplaint.status === "Resolved" && (
                <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/30 p-5 mb-6 space-y-3">
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle className="h-4.5 w-4.5" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">{t(selectedLanguage, "submitFeedbackTitle")}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    The maintenance crew marked this issue as resolved. Please grade your satisfaction to archive this ledger.
                  </p>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-4 pt-2">
                    <div className="flex items-center gap-6">
                      {/* Star rating */}
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">{t(selectedLanguage, "qualityRating")}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFeedbackRating(star)}
                              className="text-slate-300 hover:text-amber-500 transition-colors"
                            >
                              <Star className={`h-5 w-5 ${feedbackRating >= star ? "fill-amber-400 text-amber-500" : ""}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Speed rating */}
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">{t(selectedLanguage, "resolutionSpeed")}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFeedbackSpeed(star)}
                              className="text-slate-300 hover:text-amber-500 transition-colors"
                            >
                              <Star className={`h-5 w-5 ${feedbackSpeed >= star ? "fill-emerald-400 text-emerald-500" : ""}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1">{t(selectedLanguage, "feedbackComments")}</span>
                      <textarea
                        required
                        rows={2}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Share your experience (e.g. prompt work, polite behavior)..."
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingFeedback}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      {submittingFeedback ? t(selectedLanguage, "submitting") : t(selectedLanguage, "submitFeedbackTitle")}
                    </button>
                  </form>
                </div>
              )}

              {/* Feedback review if Closed */}
              {selectedComplaint.status === "Closed" && selectedComplaint.feedback && (
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 mb-6 space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Citizen Audit Feedback</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                      <Star className="h-4 w-4 fill-amber-400" />
                      <span>{selectedComplaint.feedback.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-emerald-600 text-xs font-bold font-mono">
                      <span>Speed: {selectedComplaint.feedback.speedRating}/5</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed font-medium">
                    "{selectedComplaint.feedback.satisfaction}"
                  </p>
                </div>
              )}
            </div>

            {/* Bottom: Real-Time Chat Thread */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-indigo-700" />
                Message Thread
              </h4>

              <div className="h-48 overflow-y-auto mb-3 bg-slate-50/50 rounded-2xl p-4 border border-slate-50 space-y-3">
                {selectedComplaint.messages.map((m) => {
                  const isCitizen = m.sender === "citizen";
                  return (
                    <div key={m.id} className={`flex flex-col ${isCitizen ? "items-end" : "items-start"}`}>
                      <span className="text-[9px] text-slate-400 font-semibold mb-0.5">{m.senderName}</span>
                      <div className={`rounded-2xl px-3 py-1.5 text-[11px] leading-relaxed max-w-[85%] font-medium ${
                        isCitizen ? "bg-indigo-600 text-white" : "bg-white text-slate-700 border border-slate-100"
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
                    placeholder="Send message or clarification to officer..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim()}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 text-xs transition-all disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    Send
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. Success Modal showing Assigned Officer details immediately after filing */}
      {newlyCreatedComplaint && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            
            {/* Success icon & Title */}
            <div className="text-center mt-2 mb-6">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {SUCCESS_MODAL_TRANSLATIONS[selectedLanguage]?.successTitle || SUCCESS_MODAL_TRANSLATIONS.English.successTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                {SUCCESS_MODAL_TRANSLATIONS[selectedLanguage]?.successSubtitle || SUCCESS_MODAL_TRANSLATIONS.English.successSubtitle}
              </p>
            </div>

            {/* Complaint Meta Box */}
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 mb-5 space-y-2.5 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                  {SUCCESS_MODAL_TRANSLATIONS[selectedLanguage]?.complaintId || SUCCESS_MODAL_TRANSLATIONS.English.complaintId}
                </span>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {newlyCreatedComplaint.id}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-2.5">
                <span className="font-semibold text-slate-400 uppercase tracking-wider font-mono text-[10px] block">
                  Title
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {newlyCreatedComplaint.title}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-2.5">
                <div>
                  <span className="font-semibold text-slate-400 uppercase tracking-wider font-mono text-[10px] block">
                    {SUCCESS_MODAL_TRANSLATIONS[selectedLanguage]?.areaZone || SUCCESS_MODAL_TRANSLATIONS.English.areaZone}
                  </span>
                  <span className="text-xs font-bold text-slate-700 capitalize">
                    {newlyCreatedComplaint.areaType} ({newlyCreatedComplaint.location.wardOrVillage})
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 uppercase tracking-wider font-mono text-[10px] block">
                    Category
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {newlyCreatedComplaint.category}
                  </span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-2.5">
                <span className="font-semibold text-slate-400 uppercase tracking-wider font-mono text-[10px] block">
                  {SUCCESS_MODAL_TRANSLATIONS[selectedLanguage]?.addressLabel || SUCCESS_MODAL_TRANSLATIONS.English.addressLabel}
                </span>
                <span className="text-xs font-medium text-slate-600 block leading-relaxed">
                  {newlyCreatedComplaint.location.address}
                </span>
              </div>
            </div>

            {/* Officer Details Section */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-4 mb-6 space-y-3 text-left">
              <div className="flex items-center gap-1.5 text-emerald-800">
                <User className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  {SUCCESS_MODAL_TRANSLATIONS[selectedLanguage]?.assignedTitle || SUCCESS_MODAL_TRANSLATIONS.English.assignedTitle}
                </span>
              </div>
              
              {newlyCreatedComplaint.assignedOfficer ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">
                      {SUCCESS_MODAL_TRANSLATIONS[selectedLanguage]?.officerName || SUCCESS_MODAL_TRANSLATIONS.English.officerName}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {newlyCreatedComplaint.assignedOfficer.name}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">
                      {SUCCESS_MODAL_TRANSLATIONS[selectedLanguage]?.designation || SUCCESS_MODAL_TRANSLATIONS.English.designation}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {newlyCreatedComplaint.assignedOfficer.title}
                    </span>
                  </div>
                  <div className="space-y-0.5 sm:col-span-2 border-t border-emerald-100/30 pt-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">
                      {SUCCESS_MODAL_TRANSLATIONS[selectedLanguage]?.department || SUCCESS_MODAL_TRANSLATIONS.English.department}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {newlyCreatedComplaint.assignedOfficer.department}
                    </span>
                  </div>
                  <div className="space-y-0.5 sm:col-span-2 border-t border-emerald-100/30 pt-1.5 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">
                        {SUCCESS_MODAL_TRANSLATIONS[selectedLanguage]?.contactPhone || SUCCESS_MODAL_TRANSLATIONS.English.contactPhone}
                      </span>
                      <span className="text-xs font-mono font-bold text-indigo-700">
                        {newlyCreatedComplaint.assignedOfficer.phone}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">
                        SLA Target Timeline
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        24 - 48 Hours
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No supervisor assigned yet. The ward sanitation engineer is reviewing.</p>
              )}
            </div>

            {/* Optional Submission Experience Feedback Form */}
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4 mb-5 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-500">
                  Rate your Filing Experience (Optional)
                </span>
                {isExpFeedbackSubmitted && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">
                    ✓ Submitted
                  </span>
                )}
              </div>

              {!isExpFeedbackSubmitted ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSubmissionExpRating(star)}
                        className="text-slate-300 hover:text-amber-500 transition-colors"
                      >
                        <Star className={`h-5 w-5 ${submissionExpRating >= star ? "fill-amber-400 text-amber-500" : ""}`} />
                      </button>
                    ))}
                    <span className="text-[11px] font-bold text-slate-500 ml-2">
                      {submissionExpRating === 5 ? "Excellent" : submissionExpRating === 4 ? "Very Good" : submissionExpRating === 3 ? "Good" : submissionExpRating === 2 ? "Fair" : "Poor"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <input
                      type="text"
                      value={submissionExpComment}
                      onChange={(e) => setSubmissionExpComment(e.target.value)}
                      placeholder="What did you like or dislike? (e.g. AI verification, speed)..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] outline-none focus:border-indigo-500 transition-all font-medium text-slate-700"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={submittingExpFeedback}
                    onClick={() => handleSubmissionFeedbackSubmit(newlyCreatedComplaint.id)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm"
                  >
                    {submittingExpFeedback ? "Submitting..." : "Submit Experience Feedback"}
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-600 font-semibold italic">
                  Thank you! Your feedback helps us improve the Bharat Smart OS civic ledger.
                </p>
              )}
            </div>

            {/* Acknowledge Button */}
            <button
              onClick={() => {
                const currentComplaint = newlyCreatedComplaint;
                setNewlyCreatedComplaint(null);
                setSelectedComplaint(currentComplaint); // Automatically open details drawer for the new complaint to let them view messages/timeline!
              }}
              className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span>{SUCCESS_MODAL_TRANSLATIONS[selectedLanguage]?.dismissBtn || SUCCESS_MODAL_TRANSLATIONS.English.dismissBtn}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
