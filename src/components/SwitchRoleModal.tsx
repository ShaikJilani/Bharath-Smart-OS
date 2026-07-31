import React, { useState } from "react";
import { ShieldCheck, Building2, Lock, Mail, X, AlertCircle, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Role, User as UserType } from "../types";
import { supabase } from "../lib/supabase";

interface SwitchRoleModalProps {
  targetRole: Role;
  currentRole: Role;
  selectedLanguage: string;
  onClose: () => void;
  onSuccess: (user: UserType, token: string) => void;
}

export default function SwitchRoleModal({
  targetRole,
  currentRole,
  selectedLanguage,
  onClose,
  onSuccess,
}: SwitchRoleModalProps) {
  const [emailOrPhone, setEmailOrPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isTargetOfficer = targetRole === "officer";

  const handleSwitchAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanInput = emailOrPhone.trim().toLowerCase();
    if (!cleanInput) {
      setErrorMsg(
        isTargetOfficer
          ? "Please enter official Ward Member Email address."
          : "Please enter your Citizen Email Address or Mobile Number."
      );
      return;
    }

    if (!password) {
      setErrorMsg("Please enter password to authenticate.");
      return;
    }

    if (password.length < 4) {
      setErrorMsg("Password must be at least 4 characters long.");
      return;
    }

    setLoading(true);

    try {
      const cleanDigits = cleanInput.replace(/\D/g, "");
      const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : cleanInput;

      // 1. Try Supabase query
      let dbUser: any = null;
      try {
        const isEmail = cleanInput.includes("@");
        const { data } = await supabase
          .from("users")
          .select("*")
          .or(isEmail ? `email.eq.${cleanInput}` : `mobile_number.eq.${formattedPhone}`)
          .maybeSingle();
        if (data) dbUser = data;
      } catch (err) {
        console.warn("Supabase fetch notice during role switch:", err);
      }

      if (dbUser) {
        if (dbUser.password && dbUser.password !== password) {
          setErrorMsg("Incorrect password. Please verify credentials for this account.");
          setLoading(false);
          return;
        }

        const newUser: UserType = {
          id: dbUser.id || `usr_${Date.now()}`,
          name: dbUser.email
            ? dbUser.email.split("@")[0].replace(/\./g, " ")
            : isTargetOfficer
            ? "Ward Member"
            : `Citizen (${dbUser.mobile_number})`,
          email: dbUser.email || (cleanInput.includes("@") ? cleanInput : "user@indore.gov.in"),
          phone: dbUser.mobile_number || formattedPhone,
          role: targetRole,
          language: selectedLanguage,
          state: "Madhya Pradesh",
          district: "Indore",
          ward: isTargetOfficer ? (dbUser.ward || "Ward 34") : undefined,
          department: isTargetOfficer ? (dbUser.department || "Roads & Infrastructure") : undefined,
        };

        onSuccess(newUser, `token_sw_${Date.now()}`);
        return;
      }

      // 2. Check local users cache
      const localUsers: Array<any> = JSON.parse(
        localStorage.getItem("supa_public_users") || "[]"
      );

      const matched = localUsers.find(
        (u) =>
          u.email === cleanInput ||
          u.mobile_number === cleanInput ||
          u.mobile_number === formattedPhone ||
          (cleanDigits && u.mobile_number?.includes(cleanDigits))
      );

      if (matched) {
        if (matched.password && matched.password !== password) {
          setErrorMsg("Incorrect password. Please verify credentials for this account.");
          setLoading(false);
          return;
        }

        const newUser: UserType = {
          ...matched.user,
          role: targetRole,
        };

        onSuccess(newUser, `token_sw_${Date.now()}`);
        return;
      }

      // 3. Authenticate and create session for new user
      let newUser: UserType;
      if (isTargetOfficer) {
        const namePart = cleanInput.includes("@")
          ? cleanInput.split("@")[0].replace(/\./g, " ")
          : "Officer Rajesh Kumar";
        newUser = {
          id: `off_${Date.now()}`,
          name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
          email: cleanInput.includes("@") ? cleanInput : "officer@indore.gov.in",
          phone: "+91 98765 12345",
          role: "officer",
          language: selectedLanguage,
          state: "Madhya Pradesh",
          district: "Indore",
          ward: "Ward 34",
          department: "Roads & Infrastructure",
        };
      } else {
        const rawName = cleanInput.includes("@")
          ? cleanInput.split("@")[0].replace(/\./g, " ")
          : `Citizen (${cleanInput})`;
        newUser = {
          id: `usr_${Date.now()}`,
          name: rawName.charAt(0).toUpperCase() + rawName.slice(1),
          email: cleanInput.includes("@") ? cleanInput : `${cleanDigits || "citizen"}@nic.in`,
          phone: formattedPhone || "+91 9876543210",
          role: "citizen",
          language: selectedLanguage,
          state: "Madhya Pradesh",
          district: "Indore",
        };
      }

      localUsers.push({
        email: cleanInput.includes("@") ? cleanInput : "",
        mobile_number: formattedPhone,
        password: password,
        role: targetRole,
        user: newUser,
      });
      localStorage.setItem("supa_public_users", JSON.stringify(localUsers));

      onSuccess(newUser, `token_sw_${Date.now()}`);
    } catch (err: any) {
      setErrorMsg("Authentication error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden relative">
        {/* Modal Header */}
        <div
          className={`p-6 text-white flex items-center justify-between ${
            isTargetOfficer
              ? "bg-gradient-to-r from-sky-700 to-slate-900"
              : "bg-gradient-to-r from-emerald-700 to-slate-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              {isTargetOfficer ? (
                <Building2 className="h-5 w-5" />
              ) : (
                <ShieldCheck className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                Authentication Required
              </h3>
              <p className="text-xs text-white/80 font-medium">
                Switching to {isTargetOfficer ? "Ward Member Portal" : "Citizen Portal"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSwitchAuth} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 font-medium">
            <Lock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {isTargetOfficer
                ? "Please enter Ward Member official Email and Password to authenticate and switch role."
                : "Please enter Citizen Email Address/Mobile Number and Password to authenticate and switch role."}
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-800 font-bold">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email / Phone Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              {isTargetOfficer ? "Official Ward Member Email" : "Citizen Email / Mobile Number"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder={
                  isTargetOfficer
                    ? "e.g. rajesh.kumar@indore.gov.in"
                    : "e.g. aarav.mehta@nic.in or 9876543210"
                }
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Account Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                isTargetOfficer
                  ? "bg-sky-600 hover:bg-sky-700 shadow-sky-600/20"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Switch</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
