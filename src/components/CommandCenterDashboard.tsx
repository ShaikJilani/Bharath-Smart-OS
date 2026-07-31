import React, { useState, useEffect } from "react";
import {
  Shield,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  BarChart3,
  Radio,
  Plus,
  PhoneCall,
  Bot,
  HelpCircle,
  Map,
  Database,
  Cpu,
  Wifi,
  Globe,
  Layers,
  ArrowRight,
  UserCheck,
  CheckSquare,
  Activity,
  HeartPulse,
  Sun,
  Flame,
  Droplets,
  AlertTriangle,
  FileText,
  Award,
  BookOpen,
  Heart,
  Users,
  Leaf,
  Coins,
  Flag,
  Send,
  Download,
  Trophy,
  Smile,
  GraduationCap,
  ThumbsUp,
  ThumbsDown,
  Bird,
  PawPrint,
  Trees,
  Search,
  Filter,
  Check,
  Sprout,
  HandHeart,
  TrendingDown,
  ShieldCheck,
  DollarSign,
  Target,
  Home,
  Briefcase,
  Building2,
  Wheat,
  Tractor,
  Zap
} from "lucide-react";
import { Complaint, Role, InnovativeIdea } from "../types";
import { InteractiveGmpMap } from "./GmpMap";

interface CommandCenterDashboardProps {
  currentUser: {
    name: string;
    role: Role;
    email: string;
    state: string;
    district: string;
  };
  selectedLanguage: string;
  onNavigateTab: (tab: string) => void;
  onSelectComplaint?: (complaint: Complaint) => void;
  defaultSubTab?: "telemetry" | "viksit";
}

const DASH_TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    commandCenter: "Bharat Smart OS Command Center",
    oneNation: "One Nation • Smart Governance • Viksit Bharat 2047",
    welcome: "Welcome, Director",
    districtGrid: "Indore District Grid • Active Node",
    connectedNodes: "Connected Nodes",
    kpiTotal: "Total Grievances",
    kpiResolved: "Resolved Cases",
    kpiPending: "Active Pending",
    kpiCritical: "SLA Escalations",
    liveTelemetry: "Real-time AI & GIS Spatial Telemetry",
    mapSub: "Live mapping of reported civil grievances and AI verified anomalies.",
    aiInsights: "AI Predictive Intelligence & Hazard Detection",
    recentComplaints: "Live Feed: Recent Civil Grievances",
    departmentRanking: "Department SLA Leaderboard",
    quickActions: "Unified Government Quick Actions",
    systemHealth: "Core Infrastructure Telemetry",
    sosTriggered: "SOS Emergency Alert dispatched to Ward Police & Medical response grid."
  },
  Hindi: {
    commandCenter: "भारत स्मार्ट ओएस कमांड सेंटर",
    oneNation: "एक राष्ट्र • स्मार्ट गवर्नेंस • विकसित भारत 2047",
    welcome: "स्वागत है, निदेशक",
    districtGrid: "इंदौर जिला ग्रिड • सक्रिय नोड",
    connectedNodes: "कनेक्टेड नोड्स",
    kpiTotal: "कुल शिकायतें",
    kpiResolved: "समाधान किए गए मामले",
    kpiPending: "सक्रिय लंबित",
    kpiCritical: "एसएलए उल्लंघन",
    liveTelemetry: "रीयल-टाइम एआई और जीआईएस स्थानिक टेलीमेट्री",
    mapSub: "दर्ज की गई शिकायतों और एआई सत्यापित विसंगतियों का लाइव मानचित्रण।",
    aiInsights: "एआई भविष्य कहनेवाला खुफिया और खतरा जांच",
    recentComplaints: "लाइव फ़ीड: हाल की नागरिक शिकायतें",
    departmentRanking: "विभाग एसएलए लीडरबोर्ड",
    quickActions: "एकीकृत सरकारी त्वरित कार्रवाई",
    systemHealth: "कोर इन्फ्रास्ट्रक्चर टेलीमेट्री",
    sosTriggered: "एसओएस आपातकालीन अलर्ट वार्ड पुलिस और चिकित्सा प्रतिक्रिया ग्रिड को भेजा गया।"
  }
};

// BioShield Nature & Tree Protection Ideas Interface & Default Feed
const DEFAULT_BIOSHIELD_IDEAS = [
  {
    id: "BS-101",
    title: "Mandatory Geo-Tagged Tree Census & Digital QR ID for All Urban Trees",
    category: "Tree & Forest Protection",
    description: "Require 100% geo-tagging and digital QR tracking of all mature trees in expanding smart cities. Any construction project must obtain a digital environmental clearance requiring a 10:1 native sapling replanting ratio before modifying any green zone.",
    authorName: "Ananya Sharma",
    location: "Indore, MP",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    goodVotes: 84,
    badVotes: 2
  },
  {
    id: "BS-102",
    title: "Miyawaki Micro-Forest Corridors along Expressways & Railway Lines",
    category: "Eco-Smart Urban Zoning",
    description: "Transforming empty highway buffer zones into high-density Miyawaki native forests that act as bio-acoustic sound barriers, absorb vehicle carbon emissions, and provide safe bird nesting corridors.",
    authorName: "Dr. K. S. Venkatesh",
    location: "Bengaluru, KA",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    goodVotes: 112,
    badVotes: 3
  },
  {
    id: "BS-103",
    title: "Municipal Property Tax Rebates for Rooftop Green Gardens & Native Trees",
    category: "Community Afforestation Rewards",
    description: "Offering direct municipal property tax reductions (up to 10%) for homeowners and commercial buildings that dedicate over 25% of rooftop or plot area to native trees and rainwater absorption pits.",
    authorName: "Rajesh Patel",
    location: "Ahmedabad, GJ",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    goodVotes: 67,
    badVotes: 5
  },
  {
    id: "BS-104",
    title: "AI Solar Patrol Drones for Deforestation & Forest Fire Early Warnings",
    category: "Biodiversity & Wildlife Preservation",
    description: "Deploying autonomous solar-powered thermal drone fleets across national parks and forest margins to instantly alert forest rangers about illegal tree felling, forest fires, or wildlife encroachment.",
    authorName: "Priya Sundaram (IFS)",
    location: "Dehradun, UK",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    goodVotes: 95,
    badVotes: 1
  },
  {
    id: "BS-105",
    title: "Urban Wetland Buffer Belts & Natural Sponge City Drainage Ponds",
    category: "Waterway & Wetland Eco-Restoration",
    description: "Restoring natural lakes, ponds, and wetlands in developing smart cities with native reed beds and tree borders to absorb monsoon runoff, recharge groundwater aquifers, and eliminate urban flooding.",
    authorName: "Vikram Sengupta",
    location: "Kolkata, WB",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    goodVotes: 73,
    badVotes: 2
  }
];

// Animal Sanctuary Birds & Animals Protection Ideas
const SANCTUARY_IDEAS = [
  {
    title: "Smart Urban Avian Habitats & Nesting Canopies",
    titleHi: "पक्षियों के लिए स्मार्ट शहरी घोंसले और प्राकृतिक फलदार वृक्ष",
    text: "Equipping smart cities with native fruit trees, bio-acoustic highway sound barriers, rooftop bird sanctuaries, and automated clean water feeders—ensuring urban birds thrive, breed safely, and find abundant natural food.",
    textHi: "स्मार्ट शहरों में पक्षियों के प्रजनन, भोजन और सुरक्षा के लिए स्वचालित पेयजल कुंड, फलदार वृक्ष और ध्वनि-रोधी हरित गलियारे।"
  },
  {
    title: "Automated Wildlife Corridors & Safe Breeding Reserves",
    titleHi: "सुरक्षित वन्यजीव प्रजनन क्षेत्र और स्मार्ट इको-ब्रिज",
    text: "Establishing protected forest corridors with thermal AI camera surveillance, preventing vehicle collisions with animals, guarding natural breeding grounds, and providing undisturbed sanctuary space for endangered fauna.",
    textHi: "वन्यजीवों के सुरक्षित प्रजनन क्षेत्रों, थर्मल एआई कैमरों से लैस हाइवे ओवरपास और संरक्षित जंगल के प्राकृतिक गलियारों का निर्माण।"
  },
  {
    title: "Pesticide-Free Foraging Belts & Organic Feed Zones",
    titleHi: "जैविक आहार क्षेत्र और कीटनाशक-मुक्त प्राकृतिक भोजन",
    text: "Promoting organic farming near smart city perimeters and forest margins, eliminating toxic agro-chemicals to protect birds, bees, and mammals from poisoning while expanding natural seed and berry feeding reserves.",
    textHi: "पक्षियों और पशुओं को जहरीले रसायनों से बचाने के लिए जैविक कृषि बेल्ट, परागण रक्षकों और प्राकृतिक भोजन भंडार की स्थापना।"
  },
  {
    title: "24/7 Smart Animal Rescue & Avian Trauma Care Networks",
    titleHi: "24x7 पशु-पक्षी एम्बुलेंस और अत्याधुनिक चिकित्सा केंद्र",
    text: "Deploying GPS-tracked emergency wildlife ambulances, kite-string hazard removals (Manjha bans), and city-wide avian trauma care centers ensuring rapid medical aid for injured urban and forest animals.",
    textHi: "घायल पशु-पक्षियों के त्वरित इलाज के लिए जीपीएस से लैस आपातकालीन एम्बुलेंस, मांझा मुक्ति अभियान और ट्रौमा केयर सेंटर।"
  },
  {
    title: "Dark-Sky Reserves & Acoustic Pollution Shields",
    titleHi: "प्रवासी पक्षियों के लिए डार्क-स्काई क्षेत्र और ध्वनि नियंत्रण",
    text: "Minimizing nocturnal light pollution and industrial noise during bird migration seasons, preserving natural celestial navigation routes, feeding wetlands, and roosting trees in developed smart urban hubs.",
    textHi: "प्रवासी पक्षियों के सुरक्षित आगमन और भोजन के लिए प्रकाश व ध्वनि प्रदूषण पर सख्त नियंत्रण और संरक्षित आर्द्रभूमि (Wetlands)।"
  }
];

// BioShield Nature Protection Pillars data
const GYAN_PILLARS = [
  {
    id: "zero-deforestation",
    letter: "Z",
    title: "Zero-Deforestation Smart Cities",
    titleHi: "शून्य वनों की कटाई एवं हरित विकास",
    subtitle: "Geo-Fenced Canopy & Tree Root Transplantation",
    metric: "0 Trees Felled / 10M Transplanted",
    progress: "98.5%",
    bg: "from-emerald-500 to-green-600",
    color: "text-emerald-600",
    icon: Leaf,
    description: "Mandates 100% preservation of native tree canopy in all smart city masterplans. Infrastructure projects utilize automated root transplanters, vertical forest towers, and subterranean cable ducting to build high-density smart urban nodes without felling a single mature tree."
  },
  {
    id: "eco-corridors",
    letter: "E",
    title: "Biodiversity Corridors & Wildlife Passages",
    titleHi: "जैव-विविधता कॉरिडोर और वन्यजीव सुरक्षा",
    subtitle: "IoT Eco-Bridges & Protected Green Belts",
    metric: "5,000+ Smart Eco-Bridges",
    progress: "94.2%",
    bg: "from-teal-500 to-emerald-600",
    color: "text-teal-600",
    icon: Globe,
    description: "Establishes interconnected natural green highways, canopy bridges, and IoT-monitored animal overpasses connecting smart cities directly with pristine natural sanctuaries, allowing wildlife to migrate safely alongside bullet trains and expressways."
  },
  {
    id: "sponge-cities",
    letter: "S",
    title: "Sponge Cities & Natural Wetland Shield",
    titleHi: "स्पंज सिटी एवं प्राकृतिक जल संरक्षण",
    subtitle: "Permeable Pavements & Phytoremediation",
    metric: "12,000+ Reclaimed Wetlands",
    progress: "91.8%",
    bg: "from-sky-500 to-blue-600",
    color: "text-sky-600",
    icon: Droplets,
    description: "Converts urban districts into self-sustaining 'Sponge Cities' using permeable bio-pavements, natural wetland bio-filtration ponds, and riverbank afforestation—reclaiming 100% stormwater and protecting groundwater aquifers without disturbing natural river basins."
  },
  {
    id: "clean-energy",
    letter: "C",
    title: "Solar-Wind Grids & Non-Invasive Energy",
    titleHi: "स्वच्छ ऊर्जा और शून्य उत्सर्जन ग्रिड",
    subtitle: "Floating Canal Solar & Building Photovoltaics",
    metric: "500 GW Clean Power Grid",
    progress: "96.0%",
    bg: "from-[#FF9933] to-amber-600",
    color: "text-amber-600",
    icon: Sun,
    description: "Powers smart mega-cities using canal-top floating solar panels, building-integrated photovoltaics (BIPV), and quiet urban wind micro-turbines—achieving 100% clean power without encroaching on forest land or natural agricultural habitats."
  }
];

// Zero Poverty (Garibi Mukt Bharat) Strategic Pillars Data
const ZERO_POVERTY_PILLARS = [
  {
    id: "zp-p1",
    title: "Financial Inclusion & Direct Benefit Transfer (DBT)",
    titleHi: "वित्तीय समावेशन एवं प्रत्यक्ष लाभ अंतरण",
    icon: DollarSign,
    color: "emerald",
    bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-800",
    summary: "JAM Trinity (Jan Dhan, Aadhaar, Mobile) delivering 100% direct leakage-free welfare transfers to citizen bank accounts.",
    details: "Over ₹34+ Lakh Crore transferred directly through 300+ central welfare schemes, eliminating middleman leakages and saving over ₹2.7 Lakh Crore for targeted welfare empowerment.",
    keyMetrics: [
      "50+ Crore Jan Dhan Accounts Opened",
      "100% Zero-Leakage Direct Aadhaar-DBT Pipeline",
      "PM SVANidhi Micro-Credit for Street Vendors"
    ],
    target2047: "100% Universal Micro-Insurance & Investment Access for All Low-Income Households"
  },
  {
    id: "zp-p2",
    title: "Lakhpati Didi & Women-Led Livelihoods (DAY-NRLM)",
    titleHi: "लखपति दीदी एवं महिला आजीविका क्रांति",
    icon: Users,
    color: "amber",
    bg: "bg-amber-500/10 border-amber-500/30 text-amber-800",
    summary: "Empowering rural Self-Help Groups (SHGs) to scale micro-enterprises and cross ₹1 Lakh/year net income per member.",
    details: "Targeting 3 Crore (30 Million) rural women to become 'Lakhpati Didis' through agricultural drone operations, solar agro-processing, handloom clusters, and financial literacy.",
    keyMetrics: [
      "1 Crore+ Lakhpati Didis Achieved Already",
      "15,000+ Drone Didis Certified & Operating",
      "100% SHG Access to Bank Credit Linkages"
    ],
    target2047: "3 Crore Rural Women with Sustained High Incomes & Micro-Business Leadership"
  },
  {
    id: "zp-p3",
    title: "Basic Needs Foundation: Housing, Health & Clean Power",
    titleHi: "मूलभूत आवश्यकताएं: आवास, स्वास्थ्य एवं स्वच्छ ऊर्जा",
    icon: Home,
    color: "blue",
    bg: "bg-blue-500/10 border-blue-500/30 text-blue-800",
    summary: "Eliminating multidimensional poverty deficits via Pucca Housing (PMAY), Ayushman Bharat Insurance, and PM Surya Ghar.",
    details: "100% coverage of core living standards: 4+ Crore Pucca houses constructed, 14+ Crore rural households connected with piped tap water (JJM), and free 300-unit monthly rooftop solar electricity.",
    keyMetrics: [
      "4 Crore+ PMAY Houses Handed Over",
      "55 Crore+ Citizens Covered under PM-JAY (₹5 L/Yr Health Shield)",
      "14 Crore+ Rural Tap Connections (JJM)"
    ],
    target2047: "0% Housing & Health Vulnerability Deficit Across All 700+ Districts"
  },
  {
    id: "zp-p4",
    title: "Skill Upgradation, Micro-Credit & PM Vishwakarma",
    titleHi: "कौशल विकास, सूक्ष्म-ऋण एवं पीएम विश्वकर्मा",
    icon: Briefcase,
    color: "purple",
    bg: "bg-purple-500/10 border-purple-500/30 text-purple-800",
    summary: "Up-skilling traditional artisans, rural youth, and small farmers with modern technology, toolkits, and market integration.",
    details: "Formalizing 18 traditional artisan trades with subsidized collateral-free credit, modern toolkits, ONDC e-commerce onboarding, and global export certification.",
    keyMetrics: [
      "18 Traditional Artisan Trades Modernized",
      "₹3 Lakh Collateral-Free Credit at 5% Subsidized Interest",
      "PM-KVY 4.0 Industry-Aligned Skill Labs"
    ],
    target2047: "Universal Industry Skill Certification & Global Export Readiness for All Artisans"
  }
];

// Zero Poverty Proposals & Community Feed
const DEFAULT_ZERO_POVERTY_IDEAS = [
  {
    id: "ZP-101",
    title: "Solar Agro-Processing & Cold Storage Pods for Women SHGs",
    category: "Lakhpati Didi & SHGs",
    description: "Deploying village-level solar grain sorters, oil extractors, and zero-electricity cooling pods managed by women SHGs to triple agricultural crop value addition before market sale.",
    authorName: "Savita Devi (Saraswati SHG Leader)",
    location: "Varanasi, UP",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    goodVotes: 142,
    badVotes: 2
  },
  {
    id: "ZP-102",
    title: "Digital UPI & Micro-E-Commerce Onboarding for PM Vishwakarma Artisans",
    category: "PM Vishwakarma & Artisans",
    description: "Setting up block-level digital facilitation booths to assist traditional weavers, blacksmiths, and potters with UPI QR merchant setup, product catalog photography, and ONDC marketplace listing.",
    authorName: "Rameshwar Prasad",
    location: "Jaipur, Rajasthan",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    goodVotes: 118,
    badVotes: 1
  },
  {
    id: "ZP-103",
    title: "Gram Panchayat Multidimensional MPI Real-Time Telemetry Mapping",
    category: "Financial Inclusion & Policy",
    description: "Integrating Panchayat telemetry to monitor all 12 Multidimensional Poverty Index (MPI) indicators (nutrition, schooling, sanitation, housing) so targeted welfare automatically reaches unserved households.",
    authorName: "Dr. K. S. Venkatesh",
    location: "Ranchi, Jharkhand",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    goodVotes: 95,
    badVotes: 3
  },
  {
    id: "ZP-104",
    title: "Community Green-Skill Residential Labs for Low-Income & Tribal Youth",
    category: "Skill Development & Employment",
    description: "Providing 100% free residential training in EV maintenance, solar rooftop installation, and agricultural drone servicing for BPL youth with direct employer placement linkages.",
    authorName: "Ananya Sharma",
    location: "Indore, MP",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    goodVotes: 167,
    badVotes: 4
  }
];

// Agriculture & Farmers Modernization Strategic Pillars Data (Food Basket of the World)
const FARMERS_AGRI_PILLARS = [
  {
    id: "ag-p1",
    title: "Smart Precision Agriculture & Kisan Drones",
    titleHi: "स्मार्ट सटीक कृषि एवं किसान ड्रोन",
    icon: Tractor,
    color: "emerald",
    bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-800",
    summary: "AI-driven IoT soil telemetry, satellite crop health mapping, and Kisan Drones for micro-fertilization and targeted crop protection.",
    details: "Modernizing 140 Million hectares of cultivated land with IoT sensor networks, automated soil nutrient health cards, precision drone spraying, and weather micro-telemetry to maximize yield while reducing chemical inputs.",
    keyMetrics: [
      "1,00,000+ Kisan Drones Active across Panchayats",
      "30% Reduction in Water & Fertilizer Input Costs",
      "100% Soil Health Card Digitalization"
    ],
    target2047: "100% AI & Precision Drone Agriculture Coverage Across All Indian Farming Clusters"
  },
  {
    id: "ag-p2",
    title: "Global Food Basket & Agri-Export Corridors",
    titleHi: "वैश्विक खाद्य टोकरी एवं कृषि-निर्यात गलियारे",
    icon: Globe,
    color: "amber",
    bg: "bg-amber-500/10 border-amber-500/30 text-amber-800",
    summary: "Connecting Farmer Producer Organizations (FPOs) directly to global supermarkets and ports via ONDC and cold-chain logistics.",
    details: "Building dedicated seamless cold-chain express corridors, solar agro-warehouses, phytosanitary export labs, and direct ONDC marketplace linkages that eliminate middleman commission leakages.",
    keyMetrics: [
      "$50B+ Agricultural Exports Reached Already",
      "10,000+ FPOs Formed & Digitalized on ONDC",
      "Zero-Intermediary Farm-to-Port Supply Chain"
    ],
    target2047: "India as #1 Global Agri Exporter ($150B+ Agricultural Export Economy)"
  },
  {
    id: "ag-p3",
    title: "Shree Anna (Millet Revolution) & Climate Crops",
    titleHi: "श्री अन्न (श्री अन्न श्री संवर्धन) एवं जलवायु अनुकूल फसलें",
    icon: Wheat,
    color: "green",
    bg: "bg-green-500/10 border-green-500/30 text-green-800",
    summary: "Establishing India as the global superfood capital for climate-resilient indigenous millets, organic produce, and bio-fortified seeds.",
    details: "Promoting drought-resistant millets (Ragi, Jowar, Bajra), bio-fortified high-yield seed varieties, and organic farming clusters to guarantee national food security under climate variability.",
    keyMetrics: [
      "Global Superfood Leader in Shree Anna Millets",
      "5 Million+ Hectares Converted to Organic Farming",
      "100% High-Yield Climate-Resilient Seed Distribution"
    ],
    target2047: "Global Center of Excellence for Sustainable Climate-Smart Agriculture & Superfoods"
  },
  {
    id: "ag-p4",
    title: "PM-KISAN Financial Shield & Satellite Crop Insurance",
    titleHi: "पीएम-किसान वित्तीय सुरक्षा एवं उपग्रह फसल बीमा",
    icon: ShieldCheck,
    color: "purple",
    bg: "bg-purple-500/10 border-purple-500/30 text-purple-800",
    summary: "Collateral-free credit, direct PM-KISAN income transfers, and instant satellite-driven automated crop loss insurance payouts.",
    details: "Providing 11+ Crore farm families with direct income support, 4% interest Kisan Credit Cards (KCC), and PM Fasal Bima Yojana (PMFBY) featuring AI-satellite loss assessment for 48-hour claim settlements.",
    keyMetrics: [
      "₹2.8+ Lakh Crore Disbursed directly under PM-KISAN",
      "₹1.5+ Lakh Crore Insurance Claims Settled via PMFBY",
      "4% Subsidized Interest Rate on Kisan Credit Cards"
    ],
    target2047: "0% Farmer Financial Vulnerability & Automated 48-Hour Satellite Claim Settlements"
  }
];

// Agriculture & Farmers Community Proposals & Ideas
const DEFAULT_FARMERS_IDEAS = [
  {
    id: "AG-101",
    title: "Solar-Powered Micro Cold Storage Pods for Horticulture Smallholders",
    category: "Agri Logistics & Cold Chain",
    description: "Installing 5-tonne solar-refrigerated modular cold storage pods at Panchayat markets to prevent post-harvest spoilage of perishable fruits and vegetables, enabling farmers to sell at peak market rates.",
    authorName: "Sardar Gurpreet Singh",
    location: "Ludhiana, Punjab",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    goodVotes: 185,
    badVotes: 2
  },
  {
    id: "AG-102",
    title: "AI Kisan Voice Saathi for Multilingual Pest Diagnosis & Weather Telemetry",
    category: "Precision Agri & AI",
    description: "A zero-cost WhatsApp/voice AI assistant that analyzes smartphone crop leaf photos in 12 Indian languages to diagnose pest diseases instantly and recommend organic bio-pesticide treatments.",
    authorName: "Dr. Madhavan Nair",
    location: "Kottayam, Kerala",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    goodVotes: 210,
    badVotes: 1
  },
  {
    id: "AG-103",
    title: "Panchayat Kisan Drone Cooperative Rental Hubs",
    category: "Kisan Drones & Mechanization",
    description: "Setting up village drone hubs operated by trained youth and SHG Drone Didis to offer subsidized per-acre spraying services for paddy, wheat, and sugarcane crops.",
    authorName: "Vikramaditya Patil",
    location: "Kolhapur, Maharashtra",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    goodVotes: 142,
    badVotes: 3
  },
  {
    id: "AG-104",
    title: "FPO Direct Overseas Supermarket Export Hub on ONDC",
    category: "Global Exports & ONDC",
    description: "Empowering regional FPOs with phytosanitary digital passports and QR barcode traceability to export organic Shree Anna millet snacks directly to European and Middle Eastern retail chains.",
    authorName: "Sunita Choudhary",
    location: "Jodhpur, Rajasthan",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    goodVotes: 168,
    badVotes: 0
  }
];

export default function CommandCenterDashboard({
  currentUser,
  selectedLanguage,
  onNavigateTab,
  onSelectComplaint,
  defaultSubTab
}: CommandCenterDashboardProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sosActive, setSosActive] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  
  // New State variables for Viksit Bharat features
  const [subTab, setSubTab] = useState<"telemetry" | "viksit">(defaultSubTab || "viksit");
  const [viksitSubTab, setViksitSubTab] = useState<"innovations" | "gyan" | "pledge" | "poverty" | "farmers">("innovations");

  useEffect(() => {
    if (defaultSubTab) {
      setSubTab(defaultSubTab);
    }
  }, [defaultSubTab]);
  
  // Pledge & Certificate Generator States
  const [pledgeName, setPledgeName] = useState(currentUser?.name || "Aarav Mehta");
  const [selectedPran, setSelectedPran] = useState<number>(0);
  const [pledgeTaken, setPledgeTaken] = useState(false);
  const [certSerialNumber, setCertSerialNumber] = useState("");
  
  // GYAN Pillar dialog/info state
  const [activePillarInfo, setActivePillarInfo] = useState<string | null>(null);

  // BioShield Nature & Tree Protection Ideation States
  const [bioIdeas, setBioIdeas] = useState(() => {
    try {
      const saved = localStorage.getItem("bharatos_bioshield_ideas");
      return saved ? JSON.parse(saved) : DEFAULT_BIOSHIELD_IDEAS;
    } catch {
      return DEFAULT_BIOSHIELD_IDEAS;
    }
  });

  const [bioTitle, setBioTitle] = useState("");
  const [bioCategory, setBioCategory] = useState<string>("Tree & Forest Protection");
  const [bioDescription, setBioDescription] = useState("");
  const [bioLocation, setBioLocation] = useState(currentUser?.district ? `${currentUser.district}, ${currentUser.state}` : "Indore, MP");
  const [bioSubmitSuccess, setBioSubmitSuccess] = useState(false);
  const [bioCategoryFilter, setBioCategoryFilter] = useState<string>("All");
  const [bioSearchQuery, setBioSearchQuery] = useState<string>("");

  const [votedBioIdeaIds, setVotedBioIdeaIds] = useState<Record<string, "good" | "bad">>(() => {
    try {
      const saved = localStorage.getItem("bharatos_voted_bioshield_ideas");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleBioIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bioTitle.trim() || !bioDescription.trim()) return;

    const newIdea = {
      id: `BS-${Math.floor(1000 + Math.random() * 9000)}`,
      title: bioTitle.trim(),
      category: bioCategory,
      description: bioDescription.trim(),
      authorName: currentUser?.name || "Citizen Eco Guardian",
      location: bioLocation.trim() || "India",
      createdAt: new Date().toISOString(),
      goodVotes: 1,
      badVotes: 0
    };

    const updated = [newIdea, ...bioIdeas];
    setBioIdeas(updated);
    try {
      localStorage.setItem("bharatos_bioshield_ideas", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save bioshield idea:", err);
    }

    setBioTitle("");
    setBioDescription("");
    setBioSubmitSuccess(true);
    setTimeout(() => setBioSubmitSuccess(false), 4000);
  };

  const handleBioVote = (ideaId: string, voteType: "good" | "bad") => {
    if (votedBioIdeaIds[ideaId]) return;

    const updatedVoted = { ...votedBioIdeaIds, [ideaId]: voteType };
    setVotedBioIdeaIds(updatedVoted);
    try {
      localStorage.setItem("bharatos_voted_bioshield_ideas", JSON.stringify(updatedVoted));
    } catch (err) {
      console.error("Failed to save voted bioshield idea state:", err);
    }

    setBioIdeas((prev: any[]) =>
      prev.map(item => {
        if (item.id === ideaId) {
          return {
            ...item,
            goodVotes: voteType === "good" ? item.goodVotes + 1 : item.goodVotes,
            badVotes: voteType === "bad" ? item.badVotes + 1 : item.badVotes
          };
        }
        return item;
      }).sort((a, b) => b.goodVotes - a.goodVotes)
    );
  };

  // Zero Poverty States & Handlers
  const [zpIdeas, setZpIdeas] = useState(() => {
    try {
      const saved = localStorage.getItem("bharatos_zeropoverty_ideas");
      return saved ? JSON.parse(saved) : DEFAULT_ZERO_POVERTY_IDEAS;
    } catch {
      return DEFAULT_ZERO_POVERTY_IDEAS;
    }
  });

  const [zpTitle, setZpTitle] = useState("");
  const [zpCategory, setZpCategory] = useState<string>("Lakhpati Didi & SHGs");
  const [zpDescription, setZpDescription] = useState("");
  const [zpLocation, setZpLocation] = useState(currentUser?.district ? `${currentUser.district}, ${currentUser.state}` : "Varanasi, UP");
  const [zpSubmitSuccess, setZpSubmitSuccess] = useState(false);
  const [zpCategoryFilter, setZpCategoryFilter] = useState<string>("All");
  const [zpSearchQuery, setZpSearchQuery] = useState<string>("");

  const [votedZpIdeaIds, setVotedZpIdeaIds] = useState<Record<string, "good" | "bad">>(() => {
    try {
      const saved = localStorage.getItem("bharatos_voted_zeropoverty_ideas");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Zero Poverty District Simulator Parameters (%)
  const [simWater, setSimWater] = useState<number>(85);
  const [simHousing, setSimHousing] = useState<number>(80);
  const [simHealth, setSimHealth] = useState<number>(88);
  const [simSkills, setSimSkills] = useState<number>(75);
  const [simInclusion, setSimInclusion] = useState<number>(90);

  const handleZpIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zpTitle.trim() || !zpDescription.trim()) return;

    const newIdea = {
      id: `ZP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: zpTitle.trim(),
      category: zpCategory,
      description: zpDescription.trim(),
      authorName: currentUser?.name || "Citizen Poverty Mission Partner",
      location: zpLocation,
      createdAt: new Date().toISOString(),
      goodVotes: 1,
      badVotes: 0
    };

    const updated = [newIdea, ...zpIdeas];
    setZpIdeas(updated);
    try {
      localStorage.setItem("bharatos_zeropoverty_ideas", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save zero poverty proposal:", err);
    }

    setZpTitle("");
    setZpDescription("");
    setZpSubmitSuccess(true);
    setTimeout(() => setZpSubmitSuccess(false), 4000);
  };

  const handleZpVote = (ideaId: string, voteType: "good" | "bad") => {
    if (votedZpIdeaIds[ideaId]) return;

    const updatedVoted = { ...votedZpIdeaIds, [ideaId]: voteType };
    setVotedZpIdeaIds(updatedVoted);
    try {
      localStorage.setItem("bharatos_voted_zeropoverty_ideas", JSON.stringify(updatedVoted));
    } catch (err) {
      console.error("Failed to save voted zero poverty idea state:", err);
    }

    setZpIdeas((prev: any[]) =>
      prev.map(item => {
        if (item.id === ideaId) {
          return {
            ...item,
            goodVotes: voteType === "good" ? item.goodVotes + 1 : item.goodVotes,
            badVotes: voteType === "bad" ? item.badVotes + 1 : item.badVotes
          };
        }
        return item;
      }).sort((a, b) => b.goodVotes - a.goodVotes)
    );
  };

  // Agriculture & Farmers Modernization States & Handlers
  const [farmersIdeas, setFarmersIdeas] = useState(() => {
    try {
      const saved = localStorage.getItem("bharatos_farmers_ideas");
      return saved ? JSON.parse(saved) : DEFAULT_FARMERS_IDEAS;
    } catch {
      return DEFAULT_FARMERS_IDEAS;
    }
  });

  const [farmersTitle, setFarmersTitle] = useState("");
  const [farmersCategory, setFarmersCategory] = useState<string>("Precision Agri & AI");
  const [farmersDescription, setFarmersDescription] = useState("");
  const [farmersLocation, setFarmersLocation] = useState(currentUser?.district ? `${currentUser.district}, ${currentUser.state}` : "Ludhiana, Punjab");
  const [farmersSubmitSuccess, setFarmersSubmitSuccess] = useState(false);
  const [farmersCategoryFilter, setFarmersCategoryFilter] = useState<string>("All");
  const [farmersSearchQuery, setFarmersSearchQuery] = useState<string>("");

  const [votedFarmersIdeaIds, setVotedFarmersIdeaIds] = useState<Record<string, "good" | "bad">>(() => {
    try {
      const saved = localStorage.getItem("bharatos_voted_farmers_ideas");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Farmers District Agri-Simulator Parameters (%)
  const [agriDrones, setAgriDrones] = useState<number>(80);
  const [agriIrrigation, setAgriIrrigation] = useState<number>(85);
  const [agriColdChain, setAgriColdChain] = useState<number>(75);
  const [agriExport, setAgriExport] = useState<number>(70);
  const [agriSoil, setAgriSoil] = useState<number>(90);

  const handleFarmersIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmersTitle.trim() || !farmersDescription.trim()) return;

    const newIdea = {
      id: `AG-${Math.floor(1000 + Math.random() * 9000)}`,
      title: farmersTitle.trim(),
      category: farmersCategory,
      description: farmersDescription.trim(),
      authorName: currentUser?.name || "Kisan Mitra Partner",
      location: farmersLocation,
      createdAt: new Date().toISOString(),
      goodVotes: 1,
      badVotes: 0
    };

    const updated = [newIdea, ...farmersIdeas];
    setFarmersIdeas(updated);
    try {
      localStorage.setItem("bharatos_farmers_ideas", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save farmers proposal:", err);
    }

    setFarmersTitle("");
    setFarmersDescription("");
    setFarmersSubmitSuccess(true);
    setTimeout(() => setFarmersSubmitSuccess(false), 4000);
  };

  const handleFarmersVote = (ideaId: string, voteType: "good" | "bad") => {
    if (votedFarmersIdeaIds[ideaId]) return;

    const updatedVoted = { ...votedFarmersIdeaIds, [ideaId]: voteType };
    setVotedFarmersIdeaIds(updatedVoted);
    try {
      localStorage.setItem("bharatos_voted_farmers_ideas", JSON.stringify(updatedVoted));
    } catch (err) {
      console.error("Failed to save voted farmers idea state:", err);
    }

    setFarmersIdeas((prev: any[]) =>
      prev.map(item => {
        if (item.id === ideaId) {
          return {
            ...item,
            goodVotes: voteType === "good" ? item.goodVotes + 1 : item.goodVotes,
            badVotes: voteType === "bad" ? item.badVotes + 1 : item.badVotes
          };
        }
        return item;
      }).sort((a, b) => b.goodVotes - a.goodVotes)
    );
  };

  // Real-Time Innovative Ideas Polling States
  const [ideas, setIdeas] = useState<InnovativeIdea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState<boolean>(true);
  const [ideaTitle, setIdeaTitle] = useState<string>("");
  const [ideaCategory, setIdeaCategory] = useState<string>("Sustainable Infrastructure");
  const [customIdeaCategory, setCustomIdeaCategory] = useState<string>("");
  const [ideaText, setIdeaText] = useState<string>("");
  const [ideaSubmitting, setIdeaSubmitting] = useState<boolean>(false);
  const [ideaSubmitError, setIdeaSubmitError] = useState<string | null>(null);
  const [votedIdeaIds, setVotedIdeaIds] = useState<Record<string, "good" | "bad">>(() => {
    try {
      const saved = localStorage.getItem("bharatos_voted_ideas");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const dt = (key: string) => {
    const dict = DASH_TRANSLATIONS[selectedLanguage] || DASH_TRANSLATIONS.English;
    return dict[key] || DASH_TRANSLATIONS.English[key] || key;
  };

  useEffect(() => {
    // Current Date/Time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString("en-IN", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchIdeas = async () => {
    setIdeasLoading(true);
    try {
      const res = await fetch("/api/ideas");
      if (res.ok) {
        const data = await res.json();
        setIdeas(data.ideas || []);
      }
    } catch (err) {
      console.error("Failed to load innovative ideas:", err);
    } finally {
      setIdeasLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchIdeas();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/complaints");
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error("Failed to load complaints for dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  // KPI Calculations
  const totalCount = complaints.length;
  const resolvedCount = complaints.filter(c => c.status === "Resolved" || c.status === "Closed").length;
  const pendingCount = complaints.filter(c => c.status !== "Resolved" && c.status !== "Closed").length;
  const criticalCount = complaints.filter(c => c.severity === "Emergency" || c.severity === "High").length;

  // Filter complaints based on map selection
  const filteredComplaints = complaints.filter(c => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Road") return c.category.toLowerCase().includes("road") || c.category.toLowerCase().includes("pothole");
    if (activeFilter === "Water") return c.category.toLowerCase().includes("water") || c.category.toLowerCase().includes("leak");
    if (activeFilter === "Lights") return c.category.toLowerCase().includes("light");
    if (activeFilter === "Garbage") return c.category.toLowerCase().includes("waste") || c.category.toLowerCase().includes("dumping") || c.category.toLowerCase().includes("garbage");
    if (activeFilter === "Emergency") return c.severity === "Emergency";
    return true;
  });

  // Convert complaints to map markers format
  const mapMarkers = filteredComplaints.map(c => ({
    id: c.id,
    title: c.title,
    latitude: c.location.latitude,
    longitude: c.location.longitude,
    severity: c.severity,
    onClick: () => {
      if (onSelectComplaint) {
        onSelectComplaint(c);
      }
    }
  }));

  const handleSos = () => {
    setSosActive(true);
    setTimeout(() => {
      setSosActive(false);
    }, 6000);
  };

  const handleTakePledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeName.trim()) return;
    
    // Generate simulated serial number
    const rand = Math.floor(100000 + Math.random() * 900000);
    setCertSerialNumber(`VB-2047-MP-IND-${rand}`);
    setPledgeTaken(true);
  };

  const handleDownloadAndPrintCertificate = (name: string, serial: string) => {
    // 1. High-resolution offscreen canvas (1200 x 840)
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 840;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Base background
      ctx.fillStyle = "#FAFDFB";
      ctx.fillRect(0, 0, 1200, 840);

      // Gradient overlay
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 840);
      bgGrad.addColorStop(0, "rgba(16, 185, 129, 0.08)");
      bgGrad.addColorStop(0.5, "#FAFDFB");
      bgGrad.addColorStop(1, "rgba(15, 118, 110, 0.08)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 840);

      // Outer Double Emerald Border
      ctx.strokeStyle = "#047857";
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, 1160, 800);

      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, 1128, 768);

      // Watermark Ashoka Chakra pattern
      ctx.save();
      ctx.strokeStyle = "rgba(4, 120, 87, 0.05)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(600, 420, 220, 0, 2 * Math.PI);
      ctx.stroke();
      for (let i = 0; i < 24; i++) {
        const angle = (i * 15 * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(600, 420);
        ctx.lineTo(600 + 210 * Math.cos(angle), 420 + 210 * Math.sin(angle));
        ctx.stroke();
      }
      ctx.restore();

      // Top Headers
      ctx.textAlign = "center";

      ctx.font = "bold 14px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#065F46";
      ctx.fillText("SATYAMEVA JAYATE", 600, 95);

      ctx.font = "900 18px 'Poppins', sans-serif";
      ctx.fillStyle = "#022C22";
      ctx.fillText("GOVERNMENT OF INDIA • MINISTRY OF ENVIRONMENT, FOREST & CLIMATE CHANGE", 600, 130);

      // Divider line
      const lineGrad = ctx.createLinearGradient(400, 0, 800, 0);
      lineGrad.addColorStop(0, "#10B981");
      lineGrad.addColorStop(0.5, "#14B8A6");
      lineGrad.addColorStop(1, "#047857");
      ctx.fillStyle = lineGrad;
      ctx.fillRect(400, 150, 400, 4);

      // Certificate Title
      ctx.font = "bold 20px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#047857";
      ctx.fillText("ANIMAL SANCTUARY & AVIAN PROTECTION CERTIFICATE", 600, 210);

      // Certification statement
      ctx.font = "italic 22px Georgia, serif";
      ctx.fillStyle = "#334155";
      ctx.fillText("This is to solemnly certify that", 600, 270);

      // Full Name
      ctx.font = "900 38px 'Poppins', sans-serif";
      ctx.fillStyle = "#064E3B";
      ctx.fillText(name, 600, 350);

      // Underline name
      ctx.strokeStyle = "#047857";
      ctx.lineWidth = 3;
      const nameWidth = ctx.measureText(name).width;
      ctx.beginPath();
      ctx.moveTo(600 - nameWidth / 2 - 20, 365);
      ctx.lineTo(600 + nameWidth / 2 + 20, 365);
      ctx.stroke();

      // Charter Description Paragraph
      ctx.font = "500 18px 'Poppins', sans-serif";
      ctx.fillStyle = "#1E293B";
      ctx.fillText("has solemnly signed The Animal Sanctuary Charter, committing to protect birds,", 600, 430);
      ctx.fillText("wildlife, and natural ecosystems in a developed Viksit Bharat by 2047 with", 600, 465);
      ctx.fillText("zero-deforestation smart cities and abundant natural habitats.", 600, 500);

      // Verification Stamp Circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(600, 590, 45, 0, 2 * Math.PI);
      ctx.fillStyle = "#D1FAE5";
      ctx.fill();
      ctx.strokeStyle = "#047857";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Checkmark icon
      ctx.strokeStyle = "#047857";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(585, 590);
      ctx.lineTo(596, 602);
      ctx.lineTo(618, 578);
      ctx.stroke();
      ctx.restore();

      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#047857";
      ctx.fillText("NATIONAL WILDLIFE INTEGRATED NODE", 600, 665);

      // Footer - Left: Certificate ID
      ctx.textAlign = "left";
      ctx.font = "bold 14px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#047857";
      ctx.fillText(`CERTIFICATE ID: ${serial}`, 70, 750);

      // Footer - Right: Issue Date & Hub
      ctx.textAlign = "right";
      const dateStr = new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' });
      ctx.fillText(`ISSUED: ${dateStr} • VIKSIT BHARAT 2047`, 1130, 750);

      // Convert to image blob/url and trigger browser download
      try {
        const dataUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `Animal_Sanctuary_Certificate_${serial}.png`;
        downloadLink.href = dataUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch (err) {
        console.error("Canvas download error:", err);
      }
    }

    // Trigger print window after download start
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim() || !ideaText.trim()) {
      setIdeaSubmitError("Both title and description are required.");
      return;
    }

    if (ideaCategory === "Other" && !customIdeaCategory.trim()) {
      setIdeaSubmitError("Please specify details for the custom policy segment/category.");
      return;
    }

    setIdeaSubmitting(true);
    setIdeaSubmitError(null);

    const finalCategory = ideaCategory === "Other" ? customIdeaCategory.trim() : ideaCategory;

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: ideaTitle,
          description: ideaText,
          category: finalCategory,
          authorName: currentUser.name,
          authorEmail: currentUser.email
        })
      });

      if (res.ok) {
        setIdeaTitle("");
        setIdeaText("");
        setCustomIdeaCategory("");
        setIdeaCategory("Sustainable Infrastructure");
        await fetchIdeas();
      } else {
        const errData = await res.json();
        setIdeaSubmitError(errData.message || "Failed to submit your idea. Please try again.");
      }
    } catch (err) {
      console.error("Failed to submit innovative idea:", err);
      setIdeaSubmitError("A connection error occurred. Please try again.");
    } finally {
      setIdeaSubmitting(false);
    }
  };

  const handleVote = async (ideaId: string, voteType: "good" | "bad") => {
    if (votedIdeaIds[ideaId]) {
      return;
    }

    try {
      const res = await fetch(`/api/ideas/${ideaId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType })
      });

      if (res.ok) {
        const updatedVoted = { ...votedIdeaIds, [ideaId]: voteType };
        setVotedIdeaIds(updatedVoted);
        localStorage.setItem("bharatos_voted_ideas", JSON.stringify(updatedVoted));
        
        // Update local state smoothly and sort on the fly to keep high votes first
        setIdeas(prevIdeas => 
          prevIdeas.map(idea => {
            if (idea.id === ideaId) {
              return {
                ...idea,
                goodVotes: voteType === "good" ? idea.goodVotes + 1 : idea.goodVotes,
                badVotes: voteType === "bad" ? idea.badVotes + 1 : idea.badVotes
              };
            }
            return idea;
          }).sort((a, b) => b.goodVotes - a.goodVotes)
        );
      }
    } catch (err) {
      console.error("Failed to register vote:", err);
    }
  };

  // AI Predictive Insights Data
  const aiPredictions = [
    {
      id: "pred-1",
      hazard: "Water Inundation / Flood",
      confidence: "94%",
      severity: "Emergency",
      affected: "Indore Vijay Nagar Lowlands",
      action: "Pre-dispatch drainage maintenance vehicles and optimize high-discharge pump nodes."
    },
    {
      id: "pred-2",
      hazard: "Grid Traffic Congestion",
      confidence: "88%",
      severity: "High",
      affected: "Indore Bypass Highway Junction",
      action: "Dynamically adjust Smart Traffic Light cycles and dispatch regional transit alerts."
    },
    {
      id: "pred-3",
      hazard: "Municipal Water Line Shortage",
      confidence: "91%",
      severity: "High",
      affected: "Ward 45 Central Sector",
      action: "Route standby tankers from Regional Water hub and alert localized storage valves."
    },
    {
      id: "pred-4",
      hazard: "Localized Disease Outbreak Risk",
      confidence: "82%",
      severity: "Medium",
      affected: "Gram Panchayat Rural Zone-C",
      action: "Schedule prophylactic pest spraying and audit local open waste dumps."
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner & Dynamic Information Ribbon */}
      {subTab !== "viksit" && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B2C5F] via-[#155FA0] to-[#1e3a8a] p-6 text-white shadow-xl">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 Z" fill="white" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FF9933]">
                  Viksit Bharat 2047 Node
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  GRID SECURE
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
                {dt("welcome")}, {currentUser.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-200">
                {currentUser.state} • {currentUser.district} District • {dt("districtGrid")}
              </p>
              
              {/* Quick Metrics connected */}
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-100">
                <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Globe className="h-3.5 w-3.5 text-[#FF9933]" />
                  <span>12 Departments Integrated</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Radio className="h-3.5 w-3.5 text-orange-400" />
                  <span>1,580 IoT Grid Sensors</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Sun className="h-3.5 w-3.5 text-amber-300 animate-spin-slow" />
                  <span>Indore: 28°C Scattered Clouds</span>
                </div>
              </div>
            </div>

            {/* Clock Node */}
            <div className="rounded-2xl bg-black/20 p-4 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center min-w-[180px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF9933] font-mono">Real-Time Clock Node</span>
              <span className="text-xl font-black font-mono tracking-tight text-white mt-1">{currentTime}</span>
              <span className="text-[10px] font-medium text-slate-300 mt-0.5 uppercase tracking-wider">{currentDate}</span>
            </div>
          </div>
        </div>
      )}

      {/* RENDER ACTIVE SUB-TAB */}
      {subTab === "telemetry" ? (
        <div className="space-y-6">
          {/* SOS Toast notification */}
          {sosActive && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-800 animate-pulse flex items-center gap-3 shadow-lg">
              <AlertCircle className="h-6 w-6 text-rose-600 animate-bounce" />
              <div>
                <p className="uppercase text-[10px] tracking-wider text-rose-500">CRITICAL PRIORITY BROADCAST</p>
                <p className="mt-0.5 text-sm font-black text-rose-900">{dt("sosTriggered")}</p>
              </div>
            </div>
          )}

          {/* 2. KPI Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* KPI 1 */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">{dt("kpiTotal")}</span>
                <div className="rounded-lg bg-blue-50 p-2 text-blue-900 transition-colors group-hover:bg-blue-100">
                  <Shield className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {loading ? "..." : totalCount + 1845}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12.4% Today's Growth</span>
                </p>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">{dt("kpiResolved")}</span>
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-900 transition-colors group-hover:bg-emerald-100">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {loading ? "..." : resolvedCount + 1684}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>91.0% Resolution Rate</span>
                </p>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">{dt("kpiPending")}</span>
                <div className="rounded-lg bg-amber-50 p-2 text-amber-950 transition-colors group-hover:bg-amber-100">
                  <Clock className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {loading ? "..." : pendingCount + 161}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                  <span>-8.2% Weekly Drop</span>
                </p>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">{dt("kpiCritical")}</span>
                <div className="rounded-lg bg-rose-50 p-2 text-rose-900 transition-colors group-hover:bg-rose-100">
                  <AlertCircle className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {loading ? "..." : criticalCount + 18}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-rose-600">
                  <span>Immediate Escalation</span>
                </p>
              </div>
            </div>
          </div>

          {/* 3. Map & Live Telemetry Panel */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Leaflet Live Map Card */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-md lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-[#0B2C5F]">
                    <Map className="h-5 w-5 text-[#155FA0]" />
                    <h3 className="text-lg font-black">{dt("liveTelemetry")}</h3>
                  </div>
                  <p className="text-xs text-slate-400">{dt("mapSub")}</p>
                </div>
                
                {/* Filter Pillbox */}
                <div className="flex flex-wrap gap-1 bg-slate-50 border border-slate-100 p-1 rounded-xl">
                  {["All", "Road", "Water", "Lights", "Garbage", "Emergency"].map((filt) => (
                    <button
                      key={filt}
                      onClick={() => setActiveFilter(filt)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                        activeFilter === filt
                          ? "bg-[#0B2C5F] text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {filt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Map integration */}
              <div className="h-[380px] w-full rounded-2xl overflow-hidden border border-slate-100 relative shadow-inner">
                <InteractiveGmpMap
                  latitude={22.7533}
                  longitude={75.8937}
                  onPositionChange={() => {}}
                  height="100%"
                  readOnly={true}
                  selectedLanguage={selectedLanguage}
                  multipleComplaints={mapMarkers}
                />
              </div>
            </div>

            {/* Side panel: AI Predictive Insights & System Health */}
            <div className="space-y-6">
              {/* AI Predictive Intelligence */}
              <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-md space-y-4">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse" />
                  <h3 className="text-base font-black text-slate-900">{dt("aiInsights")}</h3>
                </div>
                
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {aiPredictions.map((pred) => (
                    <div key={pred.id} className="rounded-xl border border-slate-50 bg-slate-50/50 p-3 hover:border-slate-200 transition-all space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{pred.hazard}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          pred.severity === "Emergency"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-orange-100 text-orange-800"
                        }`}>
                          {pred.severity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                          Confidence {pred.confidence}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">
                          📍 {pred.affected}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed bg-white border border-slate-100 rounded-lg p-1.5">
                        💡 <strong className="text-slate-600">Action:</strong> {pred.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Recent complaints & Leaderboards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent complaints column */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-md lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CheckSquare className="h-5 w-5 text-[#0B2C5F]" />
                  <h3 className="text-base font-black text-slate-900">{dt("recentComplaints")}</h3>
                </div>
                <button
                  onClick={() => onNavigateTab(currentUser.role === "citizen" ? "my-complaints" : "officer-dash")}
                  className="text-xs font-bold text-[#155FA0] hover:underline flex items-center gap-1"
                >
                  <span>View All Feed</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-3.5">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-2 text-xs text-slate-400 font-mono">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500"></div>
                    <span>Loading core grievance ledger...</span>
                  </div>
                ) : complaints.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-6 text-center">No complaints registered in the system yet.</p>
                ) : (
                  complaints.slice(0, 3).map((comp) => (
                    <div
                      key={comp.id}
                      onClick={() => onSelectComplaint && onSelectComplaint(comp)}
                      className="rounded-2xl border border-slate-100 bg-white p-3.5 hover:border-[#155FA0] hover:shadow-md transition-all cursor-pointer flex gap-4"
                    >
                      {comp.evidenceUrl ? (
                        <img
                          src={comp.evidenceUrl}
                          alt={comp.title}
                          className="h-16 w-16 rounded-xl object-cover border border-slate-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                          <FileText className="h-6 w-6 text-slate-300" />
                        </div>
                      )}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {comp.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            comp.status === "Resolved" || comp.status === "Closed"
                              ? "bg-emerald-100 text-emerald-800"
                              : comp.status === "In Progress"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {comp.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 truncate">{comp.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium truncate">
                          📍 {comp.location.address}
                        </p>
                        <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 font-mono uppercase">
                          <span>{comp.category}</span>
                          <span>•</span>
                          <span className={comp.severity === "Emergency" ? "text-rose-600" : comp.severity === "High" ? "text-orange-600" : ""}>
                            {comp.severity} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Department SLA leaderboards column */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-md space-y-4">
              <div className="flex items-center gap-1.5">
                <BarChart3 className="h-5 w-5 text-[#0B2C5F]" />
                <h3 className="text-base font-black text-slate-900">{dt("departmentRanking")}</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Sanitation (Indore MC)</span>
                    <span className="text-emerald-600 font-mono">98.4% SLA</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-slate-50 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: "98.4%" }}></div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 font-mono block mt-1">2.4 HR AVG SPEED</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Water Works Department</span>
                    <span className="text-emerald-600 font-mono">94.2% SLA</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-slate-50 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: "94.2%" }}></div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 font-mono block mt-1">4.1 HR AVG SPEED</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Electrical Engineering</span>
                    <span className="text-[#FF9933] font-mono">91.8% SLA</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-slate-50 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: "91.8%" }}></div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 font-mono block mt-1">1.8 HR AVG SPEED</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Public Works Division (PWD)</span>
                    <span className="text-rose-600 font-mono">87.0% SLA</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-slate-50 overflow-hidden">
                    <div className="h-full rounded-full bg-rose-500" style={{ width: "87%" }}></div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 font-mono block mt-1">8.2 HR AVG SPEED</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Quick Actions Bento Grid */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-md space-y-4">
            <h3 className="text-base font-black text-slate-900">{dt("quickActions")}</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <button
                onClick={() => onNavigateTab("lodge")}
                className="group rounded-2xl bg-slate-50 border border-slate-100 p-4 text-left hover:border-[#155FA0] hover:bg-indigo-50/20 transition-all flex flex-col justify-between"
              >
                <div className="rounded-xl bg-orange-100 p-2.5 text-orange-900 w-10 h-10 flex items-center justify-center">
                  <Plus className="h-5 w-5" />
                </div>
                <div className="mt-6">
                  <h4 className="text-xs font-bold text-slate-800">Raise Complaint</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Standard step wizard report</p>
                </div>
              </button>

              <button
                onClick={handleSos}
                className="group rounded-2xl bg-rose-50 border border-rose-100 p-4 text-left hover:border-rose-300 hover:bg-rose-100/30 transition-all flex flex-col justify-between"
              >
                <div className="rounded-xl bg-rose-100 p-2.5 text-rose-950 w-10 h-10 flex items-center justify-center animate-pulse">
                  <PhoneCall className="h-5 w-5 text-rose-700" />
                </div>
                <div className="mt-6">
                  <h4 className="text-xs font-bold text-rose-900">SOS Emergency</h4>
                  <p className="text-[10px] text-rose-500 mt-1 font-medium">1-click law & medical dispatch</p>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab("assistant")}
                className="group rounded-2xl bg-slate-50 border border-slate-100 p-4 text-left hover:border-[#155FA0] hover:bg-indigo-50/20 transition-all flex flex-col justify-between"
              >
                <div className="rounded-xl bg-indigo-100 p-2.5 text-indigo-950 w-10 h-10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-indigo-700" />
                </div>
                <div className="mt-6">
                  <h4 className="text-xs font-bold text-slate-800">Agentic AI Assistant</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Chat, rules & drafted circulars</p>
                </div>
              </button>

              <button
                onClick={() => onNavigateTab("analytics")}
                className="group rounded-2xl bg-slate-50 border border-slate-100 p-4 text-left hover:border-[#155FA0] hover:bg-indigo-50/20 transition-all flex flex-col justify-between"
              >
                <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-950 w-10 h-10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-emerald-700" />
                </div>
                <div className="mt-6">
                  <h4 className="text-xs font-bold text-slate-800">Interactive Analytics</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">SLA completion metrics</p>
                </div>
              </button>
            </div>
          </div>

          {/* 6. System Health Core Widget */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-md space-y-4">
            <h3 className="text-base font-black text-slate-900">{dt("systemHealth")}</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 text-xs">
              <div className="rounded-xl border border-slate-50 bg-slate-50/60 p-3 flex items-center gap-3">
                <Database className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-700 leading-tight">Ledger Database</p>
                  <span className="text-[9px] font-bold text-emerald-600 font-mono">ONLINE</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-50 bg-slate-50/60 p-3 flex items-center gap-3">
                <Cpu className="h-5 w-5 text-emerald-600 shrink-0 animate-pulse" />
                <div>
                  <p className="font-bold text-slate-700 leading-tight">AI Gemini Core</p>
                  <span className="text-[9px] font-bold text-emerald-600 font-mono">ONLINE</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-50 bg-slate-50/60 p-3 flex items-center gap-3">
                <Map className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-700 leading-tight">GIS Leaflet Engine</p>
                  <span className="text-[9px] font-bold text-emerald-600 font-mono">ONLINE</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-50 bg-slate-50/60 p-3 flex items-center gap-3">
                <Wifi className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-700 leading-tight">IoT Sensoring Grid</p>
                  <span className="text-[9px] font-bold text-emerald-600 font-mono">ACTIVE (1,580)</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-50 bg-slate-50/60 p-3 flex items-center gap-3 col-span-2 sm:col-span-1">
                <UserCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-700 leading-tight">Biometric Gateway</p>
                  <span className="text-[9px] font-bold text-emerald-600 font-mono">READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VIKSIT BHARAT 2047 HUB SUB-TAB */
        <div className="space-y-6 animate-fadeIn">
          {/* Sub-tab Navigation Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-4 mb-2">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
              <button
                onClick={() => setViksitSubTab("innovations")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viksitSubTab === "innovations"
                    ? "bg-white text-[#0B2C5F] shadow-sm border border-slate-200/20 font-black"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/45"
                }`}
              >
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span>Innovation Sandbox</span>
              </button>

              <button
                onClick={() => setViksitSubTab("gyan")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viksitSubTab === "gyan"
                    ? "bg-white text-[#0B2C5F] shadow-sm border border-slate-200/20 font-black"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/45"
                }`}
              >
                <Trees className="h-4 w-4 text-emerald-600" />
                <span>BioShield</span>
              </button>

              <button
                onClick={() => setViksitSubTab("pledge")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viksitSubTab === "pledge"
                    ? "bg-white text-[#0B2C5F] shadow-sm border border-slate-200/20 font-black"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/45"
                }`}
              >
                <div className="flex items-center gap-0.5">
                  <Bird className="h-4 w-4 text-emerald-600" />
                  <PawPrint className="h-3.5 w-3.5 text-emerald-700" />
                </div>
                <span>The Animal Sanctuary</span>
              </button>

              <button
                onClick={() => setViksitSubTab("poverty")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viksitSubTab === "poverty"
                    ? "bg-white text-[#0B2C5F] shadow-sm border border-slate-200/20 font-black"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/45"
                }`}
              >
                <HandHeart className="h-4 w-4 text-amber-600" />
                <span>Zero Poverty (Garibi Mukt)</span>
              </button>

              <button
                onClick={() => setViksitSubTab("farmers")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viksitSubTab === "farmers"
                    ? "bg-white text-[#0B2C5F] shadow-sm border border-slate-200/20 font-black"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/45"
                }`}
              >
                <Wheat className="h-4 w-4 text-emerald-600" />
                <span>Farmers & Agriculture</span>
              </button>
            </div>

            <div className="text-[10px] font-bold text-slate-400 font-mono uppercase bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Synced with BharatOS Grid Ledger</span>
            </div>
          </div>

          {viksitSubTab === "innovations" && (
            <div className="space-y-6">
              {/* Hero Banner Section */}
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 bg-[#0B2C5F] w-full aspect-[21/9] sm:aspect-[3/1] max-h-[400px]">
                <img 
                  src="https://ayfmpebpnhtsahrlqnsu.supabase.co/storage/v1/object/sign/Viksit%20bharat%20hub/ChatGPT%20Image%20Jul%2020,%202026,%2012_29_08%20PM.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZjk4OTVkYy1hNjA5LTQ1MzUtODFkMC01MTg0YmMwZDM5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWtzaXQgYmhhcmF0IGh1Yi9DaGF0R1BUIEltYWdlIEp1bCAyMCwgMjAyNiwgMTJfMjlfMDggUE0ucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NDUzMDgyNSwiZXhwIjoyNzMwNjEwODI1fQ.DLYDX3odlHLWEwpO9JQY2Lq97mUmsRKS7JRZZFY7JEU"
                  alt="Viksit Bharat Banner" 
                  className="w-full h-full block object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            
            {/* Left Column: Form (span 5) */}
            <div className="lg:col-span-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-md space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-orange-100 p-2 text-orange-950">
                    <Plus className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Propose an Innovation</h3>
                    <p className="text-[10px] font-bold text-slate-400">Directly syncs to national policy sandbox</p>
                  </div>
                </div>

                <form onSubmit={handleIdeaSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Proposal Title</label>
                    <input
                      type="text"
                      required
                      value={ideaTitle}
                      onChange={(e) => setIdeaTitle(e.target.value)}
                      placeholder="E.g., Smart Solar-Powered Rainwater Harvesting Benches"
                      className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-3 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Policy Segment / Category</label>
                    <select
                      value={ideaCategory}
                      onChange={(e) => setIdeaCategory(e.target.value)}
                      className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-3 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white cursor-pointer"
                    >
                      <option value="Sustainable Infrastructure">Sustainable Infrastructure (Clean Water, Green Energy)</option>
                      <option value="Digital Public Infrastructure">Digital Public Infrastructure (UPI, Civil Nodes, GIS)</option>
                      <option value="Youth Skill Development">Youth Skill Development & Vocational Incubation</option>
                      <option value="Good Governance & Transparency">Good Governance, Trust-Building & SLA Audits</option>
                      <option value="Other">Other (Custom Policy Segment)</option>
                    </select>
                  </div>

                  {ideaCategory === "Other" && (
                    <div className="space-y-1.5 animate-fadeIn">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
                        Specify Custom Policy Segment / Category Details <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customIdeaCategory}
                        onChange={(e) => setCustomIdeaCategory(e.target.value)}
                        placeholder="E.g., Rural Healthcare Access & Tele-Medicine Grid"
                        className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-3 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Detailed Proposal / Vision Description</label>
                    <textarea
                      rows={6}
                      required
                      value={ideaText}
                      onChange={(e) => setIdeaText(e.target.value)}
                      placeholder="Explain how this implementation improves quality of living in India. Detail how local municipal bodies can deploy and monitor it..."
                      className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-3 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white leading-relaxed"
                    ></textarea>
                  </div>

                  {ideaSubmitError && (
                    <p className="text-xs text-rose-600 font-bold bg-rose-50 border border-rose-100 rounded-xl p-3">
                      {ideaSubmitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={ideaSubmitting || !ideaTitle.trim() || !ideaText.trim() || (ideaCategory === "Other" && !customIdeaCategory.trim())}
                    className="w-full py-3 rounded-xl text-xs font-bold bg-[#7B91B2] hover:bg-[#687C9A] text-white transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{ideaSubmitting ? "Submitting..." : "Submit to Ideation Ledger"}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Trending Ideas (span 7) */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-100 bg-white p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-100 p-2 text-indigo-950">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">National Innovation Leaderboard</h3>
                    <p className="text-[10px] font-bold text-slate-400">Real-time public voting • Top voted at top</p>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-mono">
                  {ideas.length} Active
                </div>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[620px] pr-1">
                {ideasLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
                    <p className="text-xs text-slate-400 font-mono">Retrieving community voting ledger...</p>
                  </div>
                ) : ideas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-2 text-slate-400">
                    <Sparkles className="h-10 w-10 text-slate-300" />
                    <h4 className="text-xs font-bold">No Proposals Yet</h4>
                    <p className="text-[10px]">Be the first to submit a proposal for national development!</p>
                  </div>
                ) : (
                  ideas.map((idea, index) => {
                    const totalVotes = idea.goodVotes + idea.badVotes;
                    const goodPct = totalVotes > 0 ? Math.round((idea.goodVotes / totalVotes) * 100) : 0;
                    const badPct = totalVotes > 0 ? Math.round((idea.badVotes / totalVotes) * 100) : 0;
                    const hasVoted = votedIdeaIds[idea.id];

                    // Category colors mapping
                    const catColors: Record<string, string> = {
                      "Sustainable Infrastructure": "bg-emerald-50 text-emerald-700 border-emerald-100",
                      "Digital Public Infrastructure": "bg-indigo-50 text-indigo-700 border-indigo-100",
                      "Youth Skill Development": "bg-amber-50 text-amber-700 border-amber-100",
                      "Good Governance & Transparency": "bg-sky-50 text-sky-700 border-sky-100",
                    };
                    const colorClasses = catColors[idea.category] || "bg-slate-50 text-slate-700 border-slate-100";
                    const rank = index + 1;

                    return (
                      <div
                        key={idea.id}
                        className="group rounded-2xl border border-slate-100 bg-white p-5 hover:shadow-md transition-all space-y-4 relative"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${colorClasses}`}>
                                {idea.category}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400 font-mono">
                                {idea.id} • {new Date(idea.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                              </span>
                            </div>

                            <h4 className="text-sm font-black text-[#0B2C5F] leading-snug group-hover:text-[#155FA0] transition-colors font-sans">
                              {idea.title}
                            </h4>
                          </div>

                          {/* Rank Badge */}
                          <div className="flex items-center gap-1.5 shrink-0 select-none">
                            <div className={`h-6 w-6 rounded-md font-black text-xs text-white flex items-center justify-center ${
                              rank === 1 ? "bg-[#FF9933]" : rank === 2 ? "bg-[#3B82F6]" : "bg-slate-400"
                            }`}>
                              {rank}
                            </div>
                            <span className={`text-[11px] font-black font-sans ${
                              rank === 1 ? "text-orange-500" : rank === 2 ? "text-[#3B82F6]" : "text-slate-500"
                            }`}>
                              #{rank} Rank
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                          {idea.description}
                        </p>

                        {/* Author info and Vote Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-extrabold text-slate-500 uppercase font-mono">
                              {idea.authorName.charAt(0)}
                            </div>
                            <span className="text-[10px] font-bold text-slate-500">
                              Proposed by <span className="text-slate-800 font-bold">{idea.authorName}</span>
                            </span>
                          </div>

                          {/* 2-Option Polling system: Good Idea / Bad Idea */}
                          <div className="flex items-center gap-2">
                            <button
                              disabled={!!hasVoted}
                              onClick={() => handleVote(idea.id, "good")}
                              type="button"
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-bold bg-[#F8FAFC]/50 transition-all cursor-pointer ${
                                hasVoted === "good"
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-extrabold"
                                  : hasVoted
                                  ? "bg-slate-50 border-slate-100 text-slate-400"
                                  : "text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                              }`}
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                              <span>Good Idea ({idea.goodVotes})</span>
                            </button>

                            <button
                              disabled={!!hasVoted}
                              onClick={() => handleVote(idea.id, "bad")}
                              type="button"
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-bold bg-[#F8FAFC]/50 transition-all cursor-pointer ${
                                hasVoted === "bad"
                                  ? "bg-rose-50 border-rose-200 text-rose-700 font-extrabold"
                                  : hasVoted
                                  ? "bg-slate-50 border-slate-100 text-slate-400"
                                  : "text-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700"
                              }`}
                            >
                              <ThumbsDown className="h-3.5 w-3.5" />
                              <span>Bad Idea ({idea.badVotes})</span>
                            </button>
                          </div>
                        </div>

                        {/* Real-time Indicator Polling Ratio Bar */}
                        {totalVotes > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-bold font-mono uppercase">
                              <span className="text-emerald-600">GOOD IDEA: {goodPct}%</span>
                              <span className="text-rose-500">BAD IDEA: {badPct}%</span>
                            </div>
                            <div className="h-1 w-full rounded-full bg-rose-500 overflow-hidden flex">
                              <div className="h-full bg-emerald-500" style={{ width: `${goodPct}%` }}></div>
                            </div>
                          </div>
                        )}
                        {hasVoted && (
                          <div className="text-[9px] font-bold text-slate-400 italic text-right font-mono mt-1">
                            ✓ Your vote has been recorded on this proposal ({hasVoted === "good" ? "Good Idea" : "Bad Idea"})
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          </div>
          )}

          {viksitSubTab === "gyan" && (
            <div className="space-y-6 animate-fadeIn">
              {/* BioShield Hero Banner Header */}
              <div
                id="bioshield-hero-banner"
                className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 w-full h-48 sm:h-64 md:h-80 lg:h-[380px]"
              >
                <img
                  src="https://ayfmpebpnhtsahrlqnsu.supabase.co/storage/v1/object/sign/Viksit%20bharat%20hub/Bio%20shield.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZjk4OTVkYy1hNjA5LTQ1MzUtODFkMC01MTg0YmMwZDM5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWtzaXQgYmhhcmF0IGh1Yi9CaW8gc2hpZWxkLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODU0NTgyNTksImV4cCI6MjczMTUzODI1OX0._tRIqgWC5bzrdSsDZquFuTMgAOPeoTLISHORl3LJRqw"
                  alt="BioShield Nature Protection Banner"
                  referrerPolicy="no-referrer"
                  className="w-full h-full block object-fill object-center rounded-3xl"
                />
              </div>

              {/* Collapsible / Interactive 4 BioShield Pillars Overview */}
              <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Trees className="h-4 w-4 text-emerald-600" />
                    <span>Core BioShield Ecological Frameworks</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold">Click any pillar to inspect policy</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {GYAN_PILLARS.map((pillar) => {
                    const IconComp = pillar.icon;
                    return (
                      <div
                        key={pillar.id}
                        onClick={() => setActivePillarInfo(activePillarInfo === pillar.id ? null : pillar.id)}
                        className={`cursor-pointer rounded-2xl border p-3.5 transition-all relative overflow-hidden ${
                          activePillarInfo === pillar.id
                            ? "bg-emerald-50 border-emerald-300 shadow-md ring-1 ring-emerald-200"
                            : "bg-slate-50/70 border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-200"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`p-2 rounded-xl bg-white border border-slate-100 shrink-0 ${pillar.color}`}>
                            <IconComp className="h-4 w-4" />
                          </div>
                          <div>
                            <h5 className="text-xs font-extrabold text-slate-900 leading-tight">{pillar.title}</h5>
                            <p className="text-[9px] text-slate-400 font-mono mt-0.5">{pillar.metric}</p>
                          </div>
                        </div>

                        {activePillarInfo === pillar.id && (
                          <div className="mt-2.5 pt-2 border-t border-emerald-200 text-[10px] text-slate-700 space-y-1 animate-fadeIn">
                            <p className="font-semibold leading-snug">{pillar.description}</p>
                            <span className="inline-block text-[9px] font-bold text-emerald-700 font-mono">
                              Target Progress: {pillar.progress}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Main Ideation Section: Form + Community Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Side: Submit BioShield Idea Form (span 5) */}
                <div className="lg:col-span-5 rounded-3xl border border-emerald-100 bg-gradient-to-b from-white via-emerald-50/20 to-teal-50/30 p-6 shadow-md space-y-5">
                  <div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase font-mono tracking-wide">
                      Citizen Proposal Portal
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-2 flex items-center gap-2">
                      <Sprout className="h-5 w-5 text-emerald-600" />
                      <span>Propose a BioShield Idea</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      Share your innovative vision for protecting trees, expanding forest cover, and conserving nature while India grows into a developed nation.
                    </p>
                  </div>

                  {bioSubmitSuccess && (
                    <div className="rounded-2xl bg-emerald-500 text-white p-4 text-xs font-bold flex items-center gap-3 animate-fadeIn shadow-md">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <div>
                        <p className="font-black">BioShield Idea Submitted!</p>
                        <p className="text-[10px] opacity-90 font-normal">Your nature protection proposal has been added to the national Viksit Bharat Hub feed.</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleBioIdeaSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                        Idea Title <span className="text-emerald-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={bioTitle}
                        onChange={(e) => setBioTitle(e.target.value)}
                        placeholder="e.g., Mandatory Miyawaki Micro-Forests in City Zones"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                        Category Pillar
                      </label>
                      <select
                        value={bioCategory}
                        onChange={(e) => setBioCategory(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      >
                        <option value="Tree & Forest Protection">🌳 Tree & Forest Protection (पेड़ व वन संरक्षण)</option>
                        <option value="Eco-Smart Urban Zoning">🏙️ Eco-Smart Urban Zoning (इको-स्मार्ट शहरी नियोजन)</option>
                        <option value="Biodiversity & Wildlife Preservation">🐅 Biodiversity & Wildlife Preservation (जैव विविधता)</option>
                        <option value="Community Afforestation Rewards">🌿 Community Afforestation Rewards (हरित पुरस्कार)</option>
                        <option value="Waterway & Wetland Eco-Restoration">💧 Waterway & Wetland Eco-Restoration (जल संरक्षण)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                        Location / District
                      </label>
                      <input
                        type="text"
                        value={bioLocation}
                        onChange={(e) => setBioLocation(e.target.value)}
                        placeholder="e.g., Indore, MP"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                        Detailed Proposal & Impact <span className="text-emerald-600">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={bioDescription}
                        onChange={(e) => setBioDescription(e.target.value)}
                        placeholder="Explain how your idea protects trees, wildlife, or nature while supporting urban development and infrastructure growth..."
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 py-3 text-xs font-black text-white hover:from-emerald-700 hover:to-teal-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                      <span>Submit BioShield Proposal</span>
                    </button>
                  </form>
                </div>

                {/* Right Side: Community Ideas Feed (span 7) */}
                <div className="lg:col-span-7 rounded-3xl border border-slate-100 bg-white p-6 shadow-md space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <Trees className="h-5 w-5 text-emerald-600" />
                        <span>Community BioShield Proposals</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        Vote and endorse tree protection & nature preservation ideas submitted by citizens across India.
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
                      <span>{bioIdeas.length} Active Ideas</span>
                    </div>
                  </div>

                  {/* Search Bar & Category Filter Pills */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={bioSearchQuery}
                        onChange={(e) => setBioSearchQuery(e.target.value)}
                        placeholder="Search nature ideas, trees, forests, drones..."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {["All", "Tree & Forest Protection", "Eco-Smart Urban Zoning", "Biodiversity & Wildlife Preservation", "Community Afforestation Rewards", "Waterway & Wetland Eco-Restoration"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setBioCategoryFilter(cat)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            bioCategoryFilter === cat
                              ? "bg-emerald-600 text-white shadow-sm font-extrabold"
                              : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                          }`}
                        >
                          {cat === "All" ? "All Pillars" : cat.split(" ")[0] + " " + (cat.split(" ")[1] || "")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feed List */}
                  <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
                    {bioIdeas
                      .filter((idea: any) => {
                        const matchesCategory = bioCategoryFilter === "All" || idea.category === bioCategoryFilter;
                        const matchesSearch =
                          !bioSearchQuery ||
                          idea.title.toLowerCase().includes(bioSearchQuery.toLowerCase()) ||
                          idea.description.toLowerCase().includes(bioSearchQuery.toLowerCase()) ||
                          idea.authorName.toLowerCase().includes(bioSearchQuery.toLowerCase()) ||
                          idea.location.toLowerCase().includes(bioSearchQuery.toLowerCase());
                        return matchesCategory && matchesSearch;
                      })
                      .map((idea: any) => {
                        const hasVoted = votedBioIdeaIds[idea.id];
                        const totalVotes = idea.goodVotes + idea.badVotes;
                        const goodPct = totalVotes > 0 ? Math.round((idea.goodVotes / totalVotes) * 100) : 100;
                        const badPct = totalVotes > 0 ? 100 - goodPct : 0;

                        return (
                          <div
                            key={idea.id}
                            className="rounded-2xl border border-slate-100 bg-slate-50/40 p-4 space-y-3 hover:border-emerald-200 transition-all shadow-2xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 uppercase font-mono">
                                🌿 {idea.category}
                              </span>

                              <span className="text-[10px] text-slate-400 font-medium font-mono">
                                {idea.location} • {new Date(idea.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </span>
                            </div>

                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                                {idea.title}
                              </h4>
                              <p className="text-xs text-slate-600 font-medium mt-1.5 leading-relaxed">
                                {idea.description}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[10px]">
                              <span className="text-slate-500 font-semibold">
                                Proposed by <span className="text-slate-800 font-bold">{idea.authorName}</span>
                              </span>

                              {/* Vote buttons */}
                              <div className="flex items-center gap-2">
                                <button
                                  disabled={!!hasVoted}
                                  onClick={() => handleBioVote(idea.id, "good")}
                                  type="button"
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all cursor-pointer ${
                                    hasVoted === "good"
                                      ? "bg-emerald-100 border-emerald-300 text-emerald-800 font-extrabold shadow-2xs"
                                      : hasVoted
                                      ? "bg-slate-100 border-slate-200 text-slate-400"
                                      : "bg-white border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800"
                                  }`}
                                >
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                  <span>Support ({idea.goodVotes})</span>
                                </button>

                                <button
                                  disabled={!!hasVoted}
                                  onClick={() => handleBioVote(idea.id, "bad")}
                                  type="button"
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all cursor-pointer ${
                                    hasVoted === "bad"
                                      ? "bg-rose-100 border-rose-300 text-rose-800 font-extrabold shadow-2xs"
                                      : hasVoted
                                      ? "bg-slate-100 border-slate-200 text-slate-400"
                                      : "bg-white border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-800"
                                  }`}
                                >
                                  <ThumbsDown className="h-3.5 w-3.5" />
                                  <span>Needs Work ({idea.badVotes})</span>
                                </button>
                              </div>
                            </div>

                            {/* Ratio Bar */}
                            {totalVotes > 0 && (
                              <div className="space-y-1 pt-1">
                                <div className="flex justify-between text-[9px] font-bold font-mono uppercase">
                                  <span className="text-emerald-700">COMMUNITY SUPPORT: {goodPct}%</span>
                                  <span className="text-rose-600">NEEDS REFINEMENT: {badPct}%</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-rose-200 overflow-hidden flex">
                                  <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${goodPct}%` }}></div>
                                </div>
                              </div>
                            )}

                            {hasVoted && (
                              <div className="text-[9px] font-bold text-emerald-700 italic text-right font-mono mt-1 flex items-center justify-end gap-1">
                                <Check className="h-3 w-3" />
                                <span>Your vote was recorded on this BioShield proposal</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {viksitSubTab === "pledge" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Animal Sanctuary Professional Hero Banner */}
              <div
                id="animal-sanctuary-hero-banner"
                className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 w-full h-48 sm:h-64 md:h-80 lg:h-[380px]"
              >
                <img
                  src="https://ayfmpebpnhtsahrlqnsu.supabase.co/storage/v1/object/sign/Viksit%20bharat%20hub/Animal%20sancutary%20image.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZjk4OTVkYy1hNjA5LTQ1MzUtODFkMC01MTg0YmMwZDM5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWtzaXQgYmhhcmF0IGh1Yi9BbmltYWwgc2FuY3V0YXJ5IGltYWdlLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODU1MTEwMDAsImV4cCI6MzA0Njk1MTAwMH0.-2CwvXeBh2R-qgporyp0_9I9ZWsW46cVy1n7uts006k"
                  alt="The Animal Sanctuary Banner"
                  referrerPolicy="no-referrer"
                  className="w-full h-full block object-cover object-center rounded-3xl"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side: The Animal Sanctuary Framework (span 5) */}
                <div className="lg:col-span-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-md space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-emerald-100 p-2 text-emerald-900 flex items-center gap-1">
                        <Bird className="h-5 w-5 animate-pulse text-emerald-700" />
                        <PawPrint className="h-4 w-4 text-emerald-800" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">The Animal Sanctuary Charter</h3>
                        <p className="text-[10px] font-bold text-slate-400">5 Avian & Animal Protection Initiatives for Viksit Bharat</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {SANCTUARY_IDEAS.map((idea, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedPran(index)}
                          className={`cursor-pointer rounded-2xl border p-3.5 transition-all flex items-start gap-3.5 ${
                            selectedPran === index
                              ? "bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-200"
                              : "bg-white border-slate-100 hover:bg-emerald-50/40 hover:border-emerald-200"
                          }`}
                        >
                          <div className={`h-6 w-6 rounded-md font-black text-xs text-white flex items-center justify-center shrink-0 mt-0.5 ${
                            selectedPran === index ? "bg-emerald-600" : "bg-slate-300"
                          }`}>
                            0{index + 1}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-black text-slate-900 leading-tight">
                              {idea.title}
                            </h4>
                            <p className="text-[9px] font-bold text-emerald-700 font-mono tracking-wide">
                              {idea.titleHi}
                            </p>
                            <p className="text-[10px] text-slate-600 font-semibold leading-relaxed mt-1">
                              {idea.text}
                            </p>
                            <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed mt-1 border-t border-slate-100 pt-1">
                              {idea.textHi}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: Digital Certificate Generator (span 7) */}
                <div className="lg:col-span-7 rounded-3xl border border-slate-100 bg-white p-6 shadow-md flex flex-col justify-between min-h-[500px]">
                  {!pledgeTaken ? (
                    <div className="space-y-6 my-auto max-w-md mx-auto text-center py-10">
                      <div className="mx-auto h-16 px-4 bg-emerald-50 rounded-2xl flex items-center justify-center gap-2 border border-emerald-100 text-emerald-600">
                        <Bird className="h-8 w-8 animate-bounce text-emerald-600" />
                        <PawPrint className="h-6 w-6 text-emerald-700 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-black text-slate-900">National Wildlife & Avian Sanctuary Registry</h4>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                          Enter your name below to sign the official Animal Sanctuary Charter, pledging your dedication to safe avian habitats, pesticide-free foraging, and animal protection in smart developed India.
                        </p>
                      </div>

                      <div className="space-y-4 text-left">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Full Legal Name</label>
                          <input
                            type="text"
                            value={pledgeName}
                            onChange={(e) => setPledgeName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all shadow-inner"
                          />
                        </div>

                        <button
                          onClick={() => {
                            if (!pledgeName.trim()) return;
                            const randSerial = "AS-" + Math.floor(100000 + Math.random() * 900000);
                            setCertSerialNumber(randSerial);
                            setPledgeTaken(true);
                          }}
                          disabled={!pledgeName.trim()}
                          className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 hover:opacity-95 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                        >
                          <span>Sign Charter & Generate Certificate</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* High-Fidelity Printable Digital Certificate layout */}
                      <div id="printable-certificate" className="border-[8px] border-double border-emerald-600 rounded-2xl p-6 bg-[#FAFDFB] relative overflow-hidden shadow-inner text-center space-y-6 select-none font-sans">
                        {/* Soft light overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-white to-teal-500/10 opacity-70 pointer-events-none" />
                        
                        {/* Ashoka Chakra background watermark */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                          <svg width="300" height="300" viewBox="0 0 100 100" fill="none" stroke="#000080" strokeWidth="1">
                            <circle cx="50" cy="50" r="45" />
                            <circle cx="50" cy="50" r="8" />
                            <circle cx="50" cy="50" r="2" />
                            {Array.from({ length: 24 }).map((_, i) => (
                              <line
                                key={i}
                                x1="50"
                                y1="50"
                                x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)}
                                y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)}
                              />
                            ))}
                          </svg>
                        </div>

                        <div className="space-y-2 relative z-10">
                          <div className="flex items-center justify-center gap-1.5 text-[9px] font-black text-emerald-800 tracking-widest uppercase">
                            <span>Satyameva Jayate</span>
                          </div>
                          <h4 className="text-xs font-black text-emerald-950 tracking-wide uppercase">
                            Government of India • Ministry of Environment, Forest & Climate Change
                          </h4>
                          <div className="h-[2px] w-32 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 mx-auto" />
                        </div>

                        <div className="space-y-4 relative z-10 py-4">
                          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest font-mono">Animal Sanctuary & Avian Protection Certificate</p>
                          <h3 className="text-lg font-serif italic text-slate-800 font-bold">This is to solemnly certify that</h3>
                          <p className="text-xl font-black text-emerald-900 underline underline-offset-4 tracking-tight font-sans">
                            {pledgeName}
                          </p>
                          <p className="text-xs text-slate-700 font-semibold leading-relaxed max-w-md mx-auto">
                            has solemnly signed <span className="font-extrabold text-emerald-900">The Animal Sanctuary Charter</span>, committing to protect birds, wildlife, and natural ecosystems in a developed <span className="text-emerald-700 font-extrabold">Viksit Bharat by 2047</span> with zero-deforestation smart cities and abundant natural habitats.
                          </p>
                        </div>

                        <div className="flex justify-between items-end border-t border-emerald-200/60 pt-4 relative z-10">
                          <div className="text-left space-y-1">
                            <span className="text-[9px] font-bold text-emerald-600 block font-mono">CERTIFICATE ID</span>
                            <span className="text-[10px] font-black font-mono text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200">{certSerialNumber}</span>
                          </div>

                          {/* Digital Signature stamp */}
                          <div className="text-right space-y-1 flex flex-col items-end">
                            <div className="h-10 w-10 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center relative shadow-sm">
                              <CheckCircle2 className="h-6 w-6 text-emerald-700" />
                              <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping"></div>
                            </div>
                            <span className="text-[8px] font-bold text-emerald-700 block uppercase font-mono mt-1">WILDLIFE NODE INTEGRATED</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => setPledgeTaken(false)}
                          className="flex-1 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-black text-xs rounded-xl transition-all cursor-pointer border border-emerald-200"
                        >
                          Sign Another Charter
                        </button>
                        <button
                          onClick={() => handleDownloadAndPrintCertificate(pledgeName, certSerialNumber)}
                          className="flex-1 py-3 bg-emerald-900 hover:bg-emerald-950 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download / Print Certificate</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {viksitSubTab === "poverty" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Zero Poverty Professional Hero Banner */}
              <div
                id="zero-poverty-hero-banner"
                className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 w-full h-48 sm:h-64 md:h-80 lg:h-[380px]"
              >
                <img
                  src="https://ayfmpebpnhtsahrlqnsu.supabase.co/storage/v1/object/sign/Viksit%20bharat%20hub/poverty%20image.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZjk4OTVkYy1hNjA5LTQ1MzUtODFkMC01MTg0YmMwZDM5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWtzaXQgYmhhcmF0IGh1Yi9wb3ZlcnR5IGltYWdlLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODU1MTM0NjAsImV4cCI6MzA0Njk1MzQ2MH0.Ad4OIBRjyIK0zjjXudgLQrT9Qy0__iB6aDq-_kNmEmY"
                  alt="Zero Poverty Banner"
                  referrerPolicy="no-referrer"
                  className="w-full h-full block object-fill object-center rounded-3xl"
                />
              </div>

              {/* 4 Core Pillars of Zero Poverty Strategy */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Target className="h-5 w-5 text-amber-600" />
                      <span>4 Strategic Frameworks for Zero Poverty (Garibi Mukt Bharat)</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Backed by Union Government Policy & NITI Aayog Multidimensional Poverty Alleviation Guidelines
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                    SDG Goal 1: Zero Poverty
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ZERO_POVERTY_PILLARS.map((pillar) => {
                    const IconComp = pillar.icon;
                    return (
                      <div
                        key={pillar.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 hover:border-amber-300 hover:bg-amber-50/20 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${pillar.bg} flex items-center justify-center`}>
                              <IconComp className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900">{pillar.title}</h4>
                              <p className="text-[10px] font-bold text-amber-700 font-mono">{pillar.titleHi}</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {pillar.details}
                        </p>

                        <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Key Target Benchmarks</p>
                          <div className="space-y-1">
                            {pillar.keyMetrics.map((metric, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <span>{metric}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white border border-amber-100 p-2.5 rounded-xl flex items-center gap-2 text-[11px] font-bold text-amber-900 mt-2">
                          <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                          <span>2047 Target: {pillar.target2047}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form & Community Feed for Zero Poverty Proposals */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Side: Submit Form (span 5) */}
                <div className="lg:col-span-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-md space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-amber-100 p-2 text-amber-900">
                        <HandHeart className="h-5 w-5 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">Propose Zero Poverty Project</h3>
                        <p className="text-[10px] font-bold text-slate-400">Directly syncs to District Poverty Elimination Cell</p>
                      </div>
                    </div>

                    {zpSubmitSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs space-y-1 animate-fadeIn">
                        <p className="font-black">Proposal Submitted Successfully!</p>
                        <p className="text-[10px] text-emerald-600 font-medium">Your grassroots initiative has been recorded in the BharatOS Zero Poverty Ledger.</p>
                      </div>
                    )}

                    <form onSubmit={handleZpIdeaSubmit} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Proposal Title</label>
                        <input
                          type="text"
                          value={zpTitle}
                          onChange={(e) => setZpTitle(e.target.value)}
                          placeholder="e.g. Solar Flour Mill for Rural Women SHG"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:bg-white"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Poverty Alleviation Category</label>
                        <select
                          value={zpCategory}
                          onChange={(e) => setZpCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:bg-white"
                        >
                          <option value="Lakhpati Didi & SHGs">Lakhpati Didi & SHGs</option>
                          <option value="PM Vishwakarma & Artisans">PM Vishwakarma & Artisans</option>
                          <option value="Financial Inclusion & Policy">Financial Inclusion & Policy</option>
                          <option value="Skill Development & Employment">Skill Development & Employment</option>
                          <option value="Agri-Incomes & Small Farmers">Agri-Incomes & Small Farmers</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location / District</label>
                        <input
                          type="text"
                          value={zpLocation}
                          onChange={(e) => setZpLocation(e.target.value)}
                          placeholder="District, State"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:bg-white"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Detailed Proposal Description</label>
                        <textarea
                          value={zpDescription}
                          onChange={(e) => setZpDescription(e.target.value)}
                          placeholder="Describe the target beneficiaries, required micro-credit or equipment, and expected income enhancement impact..."
                          rows={3}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-600 focus:bg-white resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 hover:opacity-95 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        <HandHeart className="h-4 w-4" />
                        <span>Submit Zero Poverty Proposal</span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Side: Feed of Community Proposals (span 7) */}
                <div className="lg:col-span-7 rounded-3xl border border-slate-100 bg-white p-6 shadow-md space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <Users className="h-4 w-4 text-amber-600" />
                        <span>Community Zero Poverty Proposals</span>
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold">Vetted grassroots initiatives for income enhancement & micro-credit</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={zpSearchQuery}
                          onChange={(e) => setZpSearchQuery(e.target.value)}
                          placeholder="Search proposals..."
                          className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-600 w-36 sm:w-44"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {["All", "Lakhpati Didi & SHGs", "PM Vishwakarma & Artisans", "Financial Inclusion & Policy", "Skill Development & Employment"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setZpCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          zpCategoryFilter === cat
                            ? "bg-amber-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Feed Items */}
                  <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                    {zpIdeas
                      .filter(item => {
                        const matchesCat = zpCategoryFilter === "All" || item.category === zpCategoryFilter;
                        const matchesSearch = !zpSearchQuery || item.title.toLowerCase().includes(zpSearchQuery.toLowerCase()) || item.description.toLowerCase().includes(zpSearchQuery.toLowerCase()) || item.location.toLowerCase().includes(zpSearchQuery.toLowerCase());
                        return matchesCat && matchesSearch;
                      })
                      .map((item) => {
                        const hasVoted = votedZpIdeaIds[item.id];
                        return (
                          <div
                            key={item.id}
                            className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                                    {item.category}
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-400 font-mono">
                                    📍 {item.location}
                                  </span>
                                </div>
                                <h4 className="text-sm font-black text-slate-900 leading-snug">
                                  {item.title}
                                </h4>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 bg-white border border-slate-200 px-2 py-1 rounded-xl shadow-2xs">
                                <button
                                  onClick={() => handleZpVote(item.id, "good")}
                                  disabled={!!hasVoted}
                                  className={`p-1 rounded-lg transition-all cursor-pointer ${
                                    hasVoted === "good"
                                      ? "bg-emerald-100 text-emerald-700 font-bold"
                                      : "hover:bg-slate-100 text-slate-600"
                                  }`}
                                  title="Upvote Proposal"
                                >
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                </button>
                                <span className="text-xs font-black text-slate-800 font-mono">
                                  {item.goodVotes - item.badVotes}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                              {item.description}
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100">
                              <span>By {item.authorName}</span>
                              <span className="text-emerald-700 font-mono font-bold">Synced with District Poverty Cell</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {viksitSubTab === "farmers" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Farmers & Agriculture Hero Banner Image */}
              <div
                id="farmers-hero-banner"
                className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 w-full h-48 sm:h-64 md:h-80 lg:h-[380px]"
              >
                <img
                  src="https://ayfmpebpnhtsahrlqnsu.supabase.co/storage/v1/object/sign/Viksit%20bharat%20hub/farmer%20tab%20image.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZjk4OTVkYy1hNjA5LTQ1MzUtODFkMC01MTg0YmMwZDM5NmUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJWaWtzaXQgYmhhcmF0IGh1Yi9mYXJtZXIgdGFiIGltYWdlLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODU1MTQzMjIsImV4cCI6MzA0Njk1NDMyMn0.ovAiWvUfe7exkEwhtSL19f_rsH8eVszyNNsvOnm1BPM"
                  alt="Farmers and Agriculture Banner"
                  referrerPolicy="no-referrer"
                  className="w-full h-full block object-fill object-center rounded-3xl"
                />
              </div>

              {/* 4 Core Strategic Pillars of Agri Modernization */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Target className="h-5 w-5 text-emerald-600" />
                      <span>4 Core Pillars of Agricultural Modernization (Food Basket Strategy)</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Framework for transforming Indian agriculture into a high-tech, high-income global export powerhouse
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    SDG Goal 2: Zero Hunger & Sustainable Farming
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FARMERS_AGRI_PILLARS.map((pillar) => {
                    const IconComp = pillar.icon;
                    return (
                      <div
                        key={pillar.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${pillar.bg} flex items-center justify-center`}>
                              <IconComp className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900">{pillar.title}</h4>
                              <p className="text-[10px] font-bold text-emerald-700 font-mono">{pillar.titleHi}</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {pillar.details}
                        </p>

                        <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Key Target Benchmarks</p>
                          <div className="space-y-1">
                            {pillar.keyMetrics.map((metric, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <span>{metric}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white border border-emerald-100 p-2.5 rounded-xl flex items-center gap-2 text-[11px] font-bold text-emerald-900 mt-2">
                          <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>2047 Target: {pillar.target2047}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>



              {/* Form & Community Feed for Farmers Proposals */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Side: Submit Form (span 5) */}
                <div className="lg:col-span-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-md space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-emerald-100 p-2 text-emerald-900">
                        <Wheat className="h-5 w-5 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">Propose Agri-Tech Project</h3>
                        <p className="text-[10px] font-bold text-slate-400">Directly syncs with District Agriculture Cell & Krishi Vigyan Kendra</p>
                      </div>
                    </div>

                    {farmersSubmitSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs space-y-1 animate-fadeIn">
                        <p className="font-black">Agri Proposal Submitted Successfully!</p>
                        <p className="text-[10px] text-emerald-600 font-medium">Your innovation proposal has been published on the BharatOS Farmers Modernization Ledger.</p>
                      </div>
                    )}

                    <form onSubmit={handleFarmersIdeaSubmit} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Proposal Title</label>
                        <input
                          type="text"
                          value={farmersTitle}
                          onChange={(e) => setFarmersTitle(e.target.value)}
                          placeholder="e.g. Solar Cold Storage Pods for Panchayat Vegetables"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Agri Innovation Category</label>
                        <select
                          value={farmersCategory}
                          onChange={(e) => setFarmersCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                        >
                          <option value="Precision Agri & AI">Precision Agri & AI</option>
                          <option value="Agri Logistics & Cold Chain">Agri Logistics & Cold Chain</option>
                          <option value="Kisan Drones & Mechanization">Kisan Drones & Mechanization</option>
                          <option value="Global Exports & ONDC">Global Exports & ONDC</option>
                          <option value="Shree Anna Millets & Organic">Shree Anna Millets & Organic</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location / District</label>
                        <input
                          type="text"
                          value={farmersLocation}
                          onChange={(e) => setFarmersLocation(e.target.value)}
                          placeholder="District, State"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Detailed Proposal Description</label>
                        <textarea
                          value={farmersDescription}
                          onChange={(e) => setFarmersDescription(e.target.value)}
                          placeholder="Describe the target crops, required equipment or software, expected yield multiplier, and farmer benefit..."
                          rows={3}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white resize-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 via-emerald-700 to-slate-900 hover:opacity-95 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        <Tractor className="h-4 w-4" />
                        <span>Submit Agri-Tech Proposal</span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Side: Feed of Farmers Proposals (span 7) */}
                <div className="lg:col-span-7 rounded-3xl border border-slate-100 bg-white p-6 shadow-md space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <Wheat className="h-4 w-4 text-emerald-600" />
                        <span>Community Agri-Tech & Farmers Proposals</span>
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold">Vetted grassroots initiatives for modernizing farming & exports</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={farmersSearchQuery}
                          onChange={(e) => setFarmersSearchQuery(e.target.value)}
                          placeholder="Search proposals..."
                          className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 w-36 sm:w-44"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {["All", "Precision Agri & AI", "Agri Logistics & Cold Chain", "Kisan Drones & Mechanization", "Global Exports & ONDC"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFarmersCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          farmersCategoryFilter === cat
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Feed Items */}
                  <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                    {farmersIdeas
                      .filter(item => {
                        const matchesCat = farmersCategoryFilter === "All" || item.category === farmersCategoryFilter;
                        const matchesSearch = !farmersSearchQuery || item.title.toLowerCase().includes(farmersSearchQuery.toLowerCase()) || item.description.toLowerCase().includes(farmersSearchQuery.toLowerCase()) || item.location.toLowerCase().includes(farmersSearchQuery.toLowerCase());
                        return matchesCat && matchesSearch;
                      })
                      .map((item) => {
                        const hasVoted = votedFarmersIdeaIds[item.id];
                        return (
                          <div
                            key={item.id}
                            className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                                    {item.category}
                                  </span>
                                  <span className="text-[10px] font-semibold text-slate-400 font-mono">
                                    📍 {item.location}
                                  </span>
                                </div>
                                <h4 className="text-sm font-black text-slate-900 leading-snug">
                                  {item.title}
                                </h4>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 bg-white border border-slate-200 px-2 py-1 rounded-xl shadow-2xs">
                                <button
                                  onClick={() => handleFarmersVote(item.id, "good")}
                                  disabled={!!hasVoted}
                                  className={`p-1 rounded-lg transition-all cursor-pointer ${
                                    hasVoted === "good"
                                      ? "bg-emerald-100 text-emerald-700 font-bold"
                                      : "hover:bg-slate-100 text-slate-600"
                                  }`}
                                  title="Upvote Proposal"
                                >
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                </button>
                                <span className="text-xs font-black text-slate-800 font-mono">
                                  {item.goodVotes - item.badVotes}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                              {item.description}
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100">
                              <span>By {item.authorName}</span>
                              <span className="text-emerald-700 font-mono font-bold">Synced with Krishi Vigyan Kendra</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
