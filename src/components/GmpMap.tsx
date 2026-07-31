import { useState, useEffect, useRef } from "react";
import { Key, MapPin, ExternalLink, ArrowRight, AlertTriangle } from "lucide-react";
import { t } from "../data";

// Google Maps Platform API Key is removed in favor of free and open source Leaflet with OpenStreetMap tiles.
export const GOOGLE_MAPS_API_KEY = "";
export const hasValidKey = false;

interface GmpApiKeySplashProps {
  onProceedSimulation: () => void;
}

export function GmpApiKeySplash({ onProceedSimulation }: GmpApiKeySplashProps) {
  // Splash screen is no longer needed because OpenStreetMap is natively used.
  return null;
}

interface InteractiveGmpMapProps {
  latitude: number;
  longitude: number;
  onPositionChange: (lat: number, lng: number) => void;
  height?: string;
  className?: string;
  readOnly?: boolean;
  selectedLanguage?: string;
  multipleComplaints?: Array<{
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    severity: string;
    onClick?: () => void;
  }>;
}

export function LeafletFallbackMap({
  latitude,
  longitude,
  onPositionChange,
  height = "100%",
  className = "",
  readOnly = false,
  selectedLanguage = "English",
  multipleComplaints = [],
}: InteractiveGmpMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);
  const complaintMarkersRef = useRef<any[]>([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Check if Leaflet is loaded from CDN
  useEffect(() => {
    const checkL = () => {
      if ((window as any).L) {
        setLeafletLoaded(true);
      } else {
        setTimeout(checkL, 100);
      }
    };
    checkL();
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([latitude, longitude], 14);

    mapInstanceRef.current = map;

    // Add OpenStreetMap tile layer (completely free and open source)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Create marker colors / styles
    const createCustomIcon = (color: string, animate = false) => {
      return L.divIcon({
        html: `
          <div class="relative flex items-center justify-center" style="width: 24px; height: 24px;">
            ${animate ? `<div class="absolute w-8 h-8 rounded-full bg-[${color}] opacity-30 animate-ping"></div>` : ""}
            <div class="w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center" style="background-color: ${color};">
              <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        `,
        className: "custom-leaflet-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
    };

    if (multipleComplaints.length > 0) {
      // Plot multiple complaints
      multipleComplaints.forEach((c) => {
        const markerColor =
          c.severity === "Emergency"
            ? "#ef4444" // red
            : c.severity === "High"
            ? "#f97316" // orange
            : "#0ea5e9"; // blue

        const translatedSeverityLabel = t(selectedLanguage, "severity") || "Severity";
        const translatedSeverityVal = t(selectedLanguage, c.severity) || c.severity;

        const marker = L.marker([c.latitude, c.longitude], {
          icon: createCustomIcon(markerColor, true),
        })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: system-ui, sans-serif; padding: 2px;">
              <strong style="display: block; font-size: 13px; color: #0f172a;">${c.title}</strong>
              <span style="font-size: 11px; color: #64748b;">${translatedSeverityLabel}: ${translatedSeverityVal}</span>
            </div>
          `);

        if (c.onClick) {
          marker.on("click", () => {
            c.onClick?.();
          });
        }

        complaintMarkersRef.current.push(marker);
      });
    } else {
      // Single interactive marker
      const marker = L.marker([latitude, longitude], {
        draggable: !readOnly,
        icon: createCustomIcon("#f97316", true),
      }).addTo(map);

      markerInstanceRef.current = marker;

      if (!readOnly) {
        // Drag end handler
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          onPositionChange(pos.lat, pos.lng);
        });

        // Click on map to move marker
        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          onPositionChange(lat, lng);
        });
      }
    }

    // Cleanup map on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      complaintMarkersRef.current = [];
    };
  }, [leafletLoaded, multipleComplaints.length]);

  // Update center when externally changed
  useEffect(() => {
    if (mapInstanceRef.current && !multipleComplaints.length) {
      mapInstanceRef.current.setView([latitude, longitude], mapInstanceRef.current.getZoom());
      if (markerInstanceRef.current) {
        markerInstanceRef.current.setLatLng([latitude, longitude]);
      }
    }
  }, [latitude, longitude]);

  const getLoadingMessage = () => {
    switch (selectedLanguage) {
      case "Hindi":
        return "इनबिल्ट मानचित्र इंजन लोड किया जा रहा है...";
      case "Tamil":
        return "உள்ளமைக்கப்பட்ட வரைபட இயந்திரத்தை ஏற்றுகிறது...";
      case "Telugu":
        return "అంతర్నిర్మిత మ్యాప్ ఇంజిన్‌ను లోడ్ చేస్తోంది...";
      case "Kannada":
        return "ಅಂತರ್ನಿರ್ಮಿತ ನಕ್ಷೆ ಎಂಜಿನ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...";
      case "Malayalam":
        return "ഇൻബിൽറ്റ് മാപ്പ് എഞ്ചിൻ ലോഡ് ചെയ്യുന്നു...";
      case "Marathi":
        return "इनबिल्ट मॅप इंजिन लोड होत आहे...";
      case "Bengali":
        return "ইনবিল্ট ম্যাপ ইঞ্জিন লোড হচ্ছে...";
      case "Gujarati":
        return "ઇનબિલ્ટ નકશો એન્જિન લોડ થઈ રહ્યું છે...";
      case "Punjabi":
        return "ਇਨਬਿਲਟ ਨਕਸ਼ਾ ਇੰਜਣ ਲੋਡ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...";
      case "Odia":
        return "ଇନବିଲ୍ଟ ମାନଚିତ୍ର ଇଞ୍ଜିନ ଲୋଡ୍ ହେଉଛି...";
      case "Assamese":
        return "ইনবিল্ট মেপ ইঞ্জিন লোড হৈ আছে...";
      case "Urdu":
        return "ان بلٹ نقشہ انجن لوڈ ہو رہا ہے...";
      default:
        return "Loading Inbuilt Map Engine...";
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 ${className}`} style={{ height }}>
      {!leafletLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10 text-xs text-slate-500 font-medium">
          {getLoadingMessage()}
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
}

export function InteractiveGmpMap({
  latitude,
  longitude,
  onPositionChange,
  height = "100%",
  className = "",
  readOnly = false,
  selectedLanguage = "English",
  multipleComplaints = [],
}: InteractiveGmpMapProps) {
  // Always use the built-in Leaflet + OpenStreetMap map implementation
  return (
    <LeafletFallbackMap
      latitude={latitude}
      longitude={longitude}
      onPositionChange={onPositionChange}
      height={height}
      className={className}
      readOnly={readOnly}
      selectedLanguage={selectedLanguage}
      multipleComplaints={multipleComplaints}
    />
  );
}
