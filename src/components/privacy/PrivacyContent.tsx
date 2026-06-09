"use client";

import { Shield, Lock, FileText, Database, Eye, Video, Server, CheckCircle2 } from "lucide-react";

export default function PrivacyContent() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-sky-100 to-pink-100 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-sm">
          <Shield className="w-10 h-10 text-sky-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 tracking-tight">
          Privacy <span className="bg-gradient-to-r from-sky-400 to-pink-400 bg-clip-text text-transparent">Policy</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          At CUS Solution, we are committed to safeguarding your privacy. This comprehensive policy details how we collect, use, and protect your data across our learning platform, compiler, and interview services.
        </p>
      
      </div>

      {/* Main Content Split */}
      <div className="grid lg:grid-cols-3 gap-12 items-start">
        
        {/* Sticky Sidebar Navigation */}
        <div className="lg:col-span-1 sticky top-24 hidden lg:block">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 text-lg">Contents</h3>
            <nav className="space-y-3">
              <a href="#data-collection" className="flex items-center gap-3 text-slate-500 hover:text-sky-500 transition-colors font-medium">
                <Database className="w-4 h-4" /> Information Collection
              </a>
              <a href="#platform-usage" className="flex items-center gap-3 text-slate-500 hover:text-sky-500 transition-colors font-medium">
                <Server className="w-4 h-4" /> Platform Usage Data
              </a>
              <a href="#mock-interviews" className="flex items-center gap-3 text-slate-500 hover:text-sky-500 transition-colors font-medium">
                <Video className="w-4 h-4" /> Mock Interviews & AI
              </a>
              <a href="#data-sharing" className="flex items-center gap-3 text-slate-500 hover:text-sky-500 transition-colors font-medium">
                <Eye className="w-4 h-4" /> Data Sharing & Privacy
              </a>
              <a href="#security" className="flex items-center gap-3 text-slate-500 hover:text-sky-500 transition-colors font-medium">
                <Lock className="w-4 h-4" /> Security Measures
              </a>
            </nav>
          </div>
        </div>

        {/* Policy Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1 */}
          <div id="data-collection" className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-sky-100 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-sky-50 text-sky-500 rounded-xl group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">1. Information We Collect</h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>When you register on CUS Solution, we collect essential information to provide you with a personalized learning experience.</p>
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Account Data:</strong> Full name, email address, phone number, and educational background.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Payment Information:</strong> Handled securely via encrypted third-party gateways; we do not store raw credit card details.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div id="platform-usage" className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-pink-100 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-pink-50 text-pink-500 rounded-xl group-hover:scale-110 transition-transform">
                <Server className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">2. Code Compiler & Platform Usage</h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>Our interactive compiler and DSA practice tracks are core to the platform. To optimize these services, we log specific usage data:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mt-4">
                <li><strong>Source Code Submissions:</strong> Code compiled on our servers is temporarily stored to evaluate accuracy and provide algorithmic feedback.</li>
                <li><strong>Progress Tracking:</strong> We track your completion rates across courses (like System Design and Web Dev) to generate your performance certificates.</li>
                <li><strong>Device Metrics:</strong> Browser type, IP address, and session duration to ensure security and prevent abuse of our computing resources.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div id="mock-interviews" className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">3. AI & Mock Interviews</h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>CUS Solution offers premium AI Mock Interviews and expert HR sessions. We handle this highly sensitive data with the utmost care:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mt-4">
                <li><strong>Audio/Video Recordings:</strong> Sessions are recorded strictly for your personal review and AI-driven feedback generation. You retain the right to delete these recordings at any time.</li>
                <li><strong>AI Processing:</strong> Transcripts are processed by our secure AI models to evaluate communication skills and technical accuracy. These transcripts are not used to train public AI models.</li>
              </ul>
            </div>
          </div>

          {/* Section 4 & 5 Combined */}
          <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sky-500/20 to-pink-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div id="data-sharing" className="relative z-10 mb-10">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-sky-400" /> Data Sharing
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We never sell your personal data. We may share your profile and performance metrics with corporate recruiters <strong>only</strong> if you explicitly opt-in to our "Corporate Staffing" program. Otherwise, your data remains strictly confidential and is only shared with necessary third-party service providers (like AWS for hosting) under strict confidentiality agreements.
              </p>
            </div>

            <div id="security" className="relative z-10 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Lock className="w-6 h-6 text-pink-400" /> Security
              </h2>
              <p className="text-slate-300 leading-relaxed">
                We employ industry-standard encryption protocols (TLS/SSL) for data transmission. All user passwords and sensitive API keys are securely hashed. While we strive for 100% security, we encourage users to maintain strong passwords and enable two-factor authentication if available.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
