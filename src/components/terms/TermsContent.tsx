import React from "react";

export default function TermsContent() {
  return (
    <div className="min-h-screen bg-white text-slate-800 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <header className="pb-10 border-b border-slate-200 mb-10">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Terms and Conditions</h1>
          <p className="text-slate-500 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
          
          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1. Agreement to Terms
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                <p>
                  These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and CUS Solution ("Company", "we", "us", or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
                </p>
                <p>
                  You agree that by accessing the site, you have read, understood, and agreed to be bound by all of these Terms and Conditions. If you do not agree with all of these terms and conditions, then you are expressly prohibited from using the site and you must discontinue use immediately.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                2. Intellectual Property Rights
              </h2>
              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  Unless otherwise indicated, the site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the "Content") and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mt-2">
                  The Content and the Marks are provided on the Site "AS IS" for your information and personal use only. Except as expressly provided in these Terms and Conditions, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                3. User Representations
              </h2>
              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  By using the Site, you represent and warrant that all registration information you submit will be true, accurate, current, and complete. You agree to maintain the accuracy of such information and promptly update such registration information as necessary.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mt-2">
                  You further represent that you have the legal capacity and you agree to comply with these Terms and Conditions. You will not access the Site through automated or non-human means, whether through a bot, script or otherwise. You will not use the Site for any illegal or unauthorized purpose, and your use of the Site will not violate any applicable law or regulation.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                4. Free Trial and Billing
              </h2>
              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  We offer a 14-day free trial for new users to explore our premium features. During this 14-day trial period, you will not be charged any money. Your access to the premium services is completely free of charge.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mt-2">
                  At the end of the 14-day free trial period, your selected payment method will automatically be charged for the subscription plan you chose during registration, unless you cancel your subscription prior to the end of the trial period.
                </p>
              </div>
            </section>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                5. Prohibited Activities
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Prohibited activities include systematically retrieving data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us, or tricking, defrauding, or misleading us and other users, especially in any attempt to learn sensitive account information such as user passwords.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                6. User Generated Contributions
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                The Site may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Site, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material. Contributions may be viewable by other users of the Site and through third-party websites. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                7. Term and Termination
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                These Terms and Conditions shall remain in full force and effect while you use the Site. Without limiting any other provision of these Terms and Conditions, we reserve the right to, in our sole discretion and without notice or liability, deny access to and use of the Site, to any person for any reason or for no reason, including without limitation for breach of any representation, warranty, or covenant contained in these Terms and Conditions or of any applicable law or regulation.
              </p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">8. Contact Us</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
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
