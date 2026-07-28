import React from "react";
import { ShieldCheck } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white text-slate-800 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <header className="pb-10 border-b border-slate-200 mb-10">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Refund Policy</h1>
          <p className="text-slate-500 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
          
          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                1. Overview & General Terms
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                <p>
                  At CUS Solution, our primary goal is to provide exceptional educational resources, mock interviews, and an advanced online compilation environment. Because all of our services and products are strictly digital and instantaneously delivered, we maintain a strict Zero Refund Policy.
                </p>
                <p>
                  By accessing, browsing, or purchasing any services from CUS Solution, you expressly agree to the terms outlined in this document. It is your responsibility to thoroughly review the features, preview content, and system requirements before making a financial commitment.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                2. Digital Goods & Services Policy
              </h2>
              <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                <p>
                  Due to the nature of our digital products and services, all sales are considered final and irrevocable upon completion of the transaction. Once you have made a purchase, we are completely unable to process or issue a refund under any circumstances.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mt-2">
                  Any one-time payment made for a specific course, learning track, or service is strictly non-refundable. Credits purchased for AI or expert mock interviews are final. Unused credits cannot be refunded, transferred, or exchanged for cash under any circumstances. Items bought during sales, promotional events, or using discount codes are strictly non-refundable.
                </p>
                
                <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2"></h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    By proceeding with a payment for any of our courses, subscriptions, mock interviews, or premium services, you acknowledge and agree that this amount is strictly non-refundable. Because our products are entirely digital and grant immediate access to intellectual property, video lectures, and platform features upon purchase, all sales are considered final. Once a transaction is successfully processed, we do not offer any refunds, pro-rated credits, or exchanges for any reason whatsoever. We strongly encourage all users to carefully review the course syllabus, platform features, and preview materials before finalizing their purchase to ensure it meets their learning objectives.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                3. Subscription Cancellations
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                If you are enrolled in a recurring subscription plan, you have the right to cancel your subscription at any time through your account settings. However, cancellation only ensures that you will not be billed for the subsequent billing cycles. Subscription fees that have already been processed are completely non-refundable. You will retain full access to your subscription benefits until the end of your current paid billing period. We do not provide prorated refunds for partial-month memberships or unused time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                4. Chargebacks and Payment Disputes
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                We take payment disputes and chargebacks very seriously. Since our policy strictly prohibits refunds, if you initiate a chargeback with your credit card company or bank for a valid transaction made on CUS Solution, your account and all associated access will be immediately and permanently suspended pending investigation. Fraudulent chargebacks will result in permanent bans from our platform and potential legal action to recover lost funds and associated fees. We urge you to contact our support team to resolve any technical issues rather than initiating a dispute.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                5. Changes to the Policy
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                CUS Solution reserves the right to modify, amend, or update this No Refund Policy at any time without prior individual notice. Any changes will be posted on this page with an updated revision date. By continuing to use our platform and services after any such changes, you are indicating your acceptance of the new terms.
              </p>
            </section>

            <section className="pt-8 border-t border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">6. Contact Support</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                While we do not offer refunds, our team is always here to assist you with any technical issues, account access problems, or questions about the platform. If you encounter any technical anomalies, please reach out to us.
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
