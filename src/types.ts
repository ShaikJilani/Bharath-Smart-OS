export type Role = "citizen" | "officer";
export type AreaType = "urban" | "rural" | "semi-urban";
export type Severity = "Low" | "Medium" | "High" | "Emergency";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: Role;
  language: string;
  state: string;
  district: string;
  ward?: string;
  department?: string;
  title?: string;
}

export interface Message {
  id: string;
  sender: "citizen" | "officer" | "ai";
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Complaint {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  title: string;
  description: string;
  originalLanguage: string;
  areaType: AreaType;
  category: string;
  subcategory: string;
  status: string;
  severity: Severity;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    state: string;
    district: string;
    wardOrVillage: string;
    pincode: string;
  };
  evidenceUrl?: string;
  voiceUrl?: string;
  voiceTranscript?: string;
  aiSummary?: string;
  aiVerification?: {
    isValid: boolean;
    reason: string;
    labels: string[];
    confidence: number;
    expectedDepartment: string;
  };
  assignedOfficer?: {
    name: string;
    title: string;
    department: string;
    phone: string;
  };
  messages: Message[];
  statusHistory: {
    status: string;
    timestamp: string;
    note: string;
    updatedBy: string;
  }[];
  feedback?: {
    rating: number;
    satisfaction: string;
    speedRating: number;
    text?: string;
    createdAt: string;
  };
  submissionFeedback?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SummaryStats {
  total: number;
  verified: number;
  inProgress: number;
  resolved: number;
  resolutionRate: number;
  slaCompliance: number;
}

export interface InnovativeIdea {
  id: string;
  authorName: string;
  authorEmail: string;
  title: string;
  description: string;
  category: string;
  goodVotes: number;
  badVotes: number;
  createdAt: string;
}

export const SECTORS = [
  "Roads and potholes",
  "Streetlights",
  "Water supply",
  "Water leakage",
  "Drainage and sewage",
  "Waste collection",
  "Illegal dumping",
  "Public toilets",
  "Air pollution",
  "Water pollution",
  "Traffic congestion",
  "Electricity issues",
  "Government building damage",
  "Public safety",
  "Agricultural problems",
  "Other civic concerns"
];

export const INDIAN_LANGUAGES = [
  "English",
  "Hindi",
  "Telugu",
  "Assamese",
  "Bengali",
  "Bodo",
  "Dogri",
  "Gujarati",
  "Kannada",
  "Kashmiri",
  "Konkani",
  "Maithili",
  "Malayalam",
  "Manipuri",
  "Marathi",
  "Nepali",
  "Odia",
  "Punjabi",
  "Sanskrit",
  "Santali",
  "Sindhi",
  "Tamil",
  "Urdu"
];

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "English", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "Hindi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "Telugu", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "Assamese", name: "Assamese", nativeName: "অসমীয়া", flag: "🇮🇳" },
  { code: "Bengali", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "Bodo", name: "Bodo", nativeName: "बड़ो", flag: "🇮🇳" },
  { code: "Dogri", name: "Dogri", nativeName: "डोगरी", flag: "🇮🇳" },
  { code: "Gujarati", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "Kannada", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "Kashmiri", name: "Kashmiri", nativeName: "कॉशुर / कश्मीरी", flag: "🇮🇳" },
  { code: "Konkani", name: "Konkani", nativeName: "कोंकणी", flag: "🇮🇳" },
  { code: "Maithili", name: "Maithili", nativeName: "मैथिली", flag: "🇮🇳" },
  { code: "Malayalam", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "Manipuri", name: "Manipuri", nativeName: "মৈতৈলোন্", flag: "🇮🇳" },
  { code: "Marathi", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "Nepali", name: "Nepali", nativeName: "नेपाली", flag: "🇮🇳" },
  { code: "Odia", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "Punjabi", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "Sanskrit", name: "Sanskrit", nativeName: "संस्कृतम्", flag: "🇮🇳" },
  { code: "Santali", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ", flag: "🇮🇳" },
  { code: "Sindhi", name: "Sindhi", nativeName: "सिंधी", flag: "🇮🇳" },
  { code: "Tamil", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "Urdu", name: "Urdu", nativeName: "اردو", flag: "🇮🇳" },
];

