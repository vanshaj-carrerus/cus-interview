import React from "react";

export default function PrivacyContent() {
  return (
    <div className="min-h-screen bg-white text-slate-800 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <header className="pb-10 border-b border-slate-200 mb-10">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
          
          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1. Overview & Information Collection
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                <p>
                  At CUS Solution, we are strongly committed to protecting the privacy of our users. This Privacy Policy details the types of personal information we collect, how it is used, and the steps we take to ensure your personal information is handled appropriately.
                </p>
                <p>
                  When you register for an account, subscribe to our services, or interact with our platform, we may collect identifiable information such as your full name, email address, phone number, and educational background. This data is essential for personalizing your learning experience and maintaining the security of your account.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                2. Platform Usage & Code Compilation Data
              </h2>
              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  Our interactive compiler and Data Structures & Algorithms practice tracks are core features of the CUS Solution platform. To optimize these services and provide accurate feedback, we automatically log specific technical and usage data.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mt-2">
                  When you submit code through our online compiler, the source code is temporarily transmitted to our secure servers for compilation and execution. We analyze the execution results to provide you with algorithmic feedback and track your progress across different problem sets. Additionally, we collect standard device metrics including your IP address, browser type, and session duration to monitor platform performance and prevent abuse of our computing resources.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                3. AI Services & Mock Interviews
              </h2>
              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  For users utilizing our premium AI Mock Interviews and expert HR sessions, we process highly sensitive conversational data with the utmost care and security.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mt-2">
                  During an AI mock interview, audio and video data may be recorded exclusively for the purpose of providing you with personal review materials and generating AI-driven feedback on your performance. The transcripts and communication metrics are processed by secure AI models to evaluate your technical and soft skills. We strictly prohibit the use of your private interview data for training public AI models, and you retain full rights to delete your interview records at any time.
                </p>
              </div>
            </section>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                4. Data Sharing & Third-Party Disclosure
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our business partners and trusted affiliates. Your data remains strictly confidential and is only shared with necessary third-party service providers (such as cloud hosting providers and payment processors) under strict confidentiality agreements. If you explicitly opt-in to our "Corporate Staffing" program, we may share your profile and performance metrics with prospective employers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                5. Data Security Measures
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our site. We employ industry-standard encryption protocols (TLS/SSL) for all sensitive data transmission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. Cookies & Tracking Technologies
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                Our site may use "cookies" to enhance user experience. Your web browser places cookies on your hard drive for record-keeping purposes and sometimes to track information about you. You may choose to set your web browser to refuse cookies, or to alert you when cookies are being sent. If you do so, note that some parts of the site may not function properly. We use these technologies to remember your preferences and analyze how our platform is used.
              </p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">7. Contact Information</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact our Data Protection Officer.
              </p>
              <p className="text-slate-900 font-medium text-sm">
                Email: info@custech.co
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
