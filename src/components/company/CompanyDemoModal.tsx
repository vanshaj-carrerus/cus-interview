"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, Building2, Loader2 } from "lucide-react";

interface CompanyDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanyDemoModal({ isOpen, onClose }: CompanyDemoModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    isStudent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Work Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.isStudent && !formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      companyName: "",
      isStudent: false,
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleResetAndClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl transition-all border border-slate-200 z-10 my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="company-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Close form"
        >
          <X className="h-5 w-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-slate-900">
              Demo Request Received!
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 max-w-md mx-auto">
              Thank you for reaching out, <span className="font-semibold text-slate-900">{formData.name}</span>. Our enterprise specialist team will contact you shortly at <span className="font-semibold text-slate-900">{formData.email}</span> to set up your personalized demo.
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-secondary px-8 py-3 text-sm font-semibold text-white transition hover:bg-secondary/90 shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="pr-6">
              <div className="inline-flex items-center gap-2 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200/80 mb-3">
                <Building2 className="h-3.5 w-3.5 text-amber-700" /> Enterprise Demo
              </div>
              <h2
                id="company-modal-title"
                className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight"
              >
                Sign up for a demo of CUS Interview for Enterprises
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
                You will love our personalised demo! Get in touch with our friendly team and we’ll get back to you soon.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="company-name-input" className="block text-sm font-semibold text-slate-800 mb-1">
                  Name
                </label>
                <input
                  id="company-name-input"
                  type="text"
                  placeholder="Enter Full Name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  className={`w-full rounded-lg border bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                    errors.name
                      ? "border-red-400 focus:ring-red-300"
                      : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Work Email ID Field */}
              <div>
                <label htmlFor="company-email-input" className="block text-sm font-semibold text-slate-800 mb-1">
                  Work Email ID
                </label>
                <input
                  id="company-email-input"
                  type="email"
                  placeholder="Enter work email ID*"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full rounded-lg border bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                    errors.email
                      ? "border-red-400 focus:ring-red-300"
                      : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Phone number Field */}
              <div>
                <label htmlFor="company-phone-input" className="block text-sm font-semibold text-slate-800 mb-1">
                  Phone number
                </label>
                <input
                  id="company-phone-input"
                  type="tel"
                  placeholder="Enter phone number*"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  className={`w-full rounded-lg border bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                    errors.phone
                      ? "border-red-400 focus:ring-red-300"
                      : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"
                  }`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Company Name Field (if not student) */}
              {!formData.isStudent && (
                <div>
                  <label htmlFor="company-org-input" className="block text-sm font-semibold text-slate-800 mb-1">
                    Company Name
                  </label>
                  <input
                    id="company-org-input"
                    type="text"
                    placeholder="Enter company name*"
                    value={formData.companyName}
                    onChange={(e) => {
                      setFormData({ ...formData, companyName: e.target.value });
                      if (errors.companyName) setErrors({ ...errors, companyName: "" });
                    }}
                    className={`w-full rounded-lg border bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition ${
                      errors.companyName
                        ? "border-red-400 focus:ring-red-300"
                        : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"
                    }`}
                  />
                  {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
                </div>
              )}

              {/* Student/Job Seeker Checkbox */}
              <div className="pt-1">
                <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={formData.isStudent}
                    onChange={(e) =>
                      setFormData({ ...formData, isStudent: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span>I am a Student/Job Seeker</span>
                </label>
              </div>

              {/* Privacy Policy disclaimer */}
              <p className="text-xs leading-relaxed text-slate-500 pt-1">
                By clicking on &quot;Access Free Demo&quot;, you acknowledge having read our{" "}
                <a href="#" className="font-semibold text-slate-700 underline hover:text-slate-900">
                  Privacy Policy
                </a>
                .
              </p>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-[#a33318] hover:bg-[#8a2912] px-6 py-3.5 text-base font-semibold text-white shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#a33318] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Access Free Demo"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
