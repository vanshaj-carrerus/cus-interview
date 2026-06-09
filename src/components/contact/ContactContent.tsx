"use client";

import { Mail, MapPin, Phone, Send, HelpCircle, ArrowRight, MessageCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ContactContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const FacebookIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>;
  const TwitterIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
  const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.555.556.9 1.11 1.152 1.772.249.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.216 1.79-.465 2.428a4.883 4.883 0 01-1.152 1.772 c-.556.555-1.11.9-1.772 1.152-.637.249-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.216-2.428-.465a4.89 4.89 0 01-1.772-1.152 4.884 4.884 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z"/></svg>;
  const LinkedinIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;

  const faqs = [
    {
      question: "How quickly do you respond to queries?",
      answer: "Our support team typically responds within 24 hours during business days. For urgent corporate training inquiries, we aim to get back to you within 4 hours."
    },
    {
      question: "Do you offer custom corporate training plans?",
      answer: "Yes! We can tailor our DSA, Web Development, and AI Mock Interview platforms specifically to your company's onboarding or upskilling needs."
    },
    {
      question: "I found a bug on the compiler. Where do I report it?",
      answer: "Please select 'Report a Bug' in the subject dropdown of the contact form above. Include as much detail as possible, such as the programming language and specific problem."
    },
    {
      question: "Are your offices open for in-person visits?",
      answer: "We are primarily a digital-first platform. In-person visits to our corporate office in Noida are currently by appointment only."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/support@careerus.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            _template: "table"
        })
      });

      if (response.ok) {
        alert("Message sent successfully! We will get back to you soon.");
        setFormData({ firstName: "", lastName: "", email: "", subject: "General Inquiry", message: "" });
      } else {
        alert("Oops! Something went wrong. Please try again later.");
      }
    } catch (error) {
      alert("Oops! Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto mb-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-sky-200/40 to-pink-200/40 blur-3xl rounded-full -z-10" />
        <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight">
          Get in <span className="bg-gradient-to-r from-sky-400 to-pink-400 bg-clip-text text-transparent">Touch</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          Whether you have a question about our courses, need corporate staffing, or want to report an issue, our dedicated team is ready to assist you.
        </p>
      </div>

      {/* Split Contact Form Area */}
      <div className="grid lg:grid-cols-5 gap-0 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden mb-24">
        
        {/* Contact Info (Left) */}
        <div className="lg:col-span-2 bg-slate-900 p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-sky-500/20 to-pink-500/20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3" />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Contact Information</h2>
            <p className="text-slate-400 mb-10 text-sm">Fill out the form and our team will get back to you within 24 hours.</p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-5 group cursor-pointer">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-sky-500/20 transition-colors">
                  <Mail className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Email Us</p>
                  <p className="font-medium text-lg">info@custech.co</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5 group cursor-pointer">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-pink-500/20 transition-colors">
                  <Phone className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Call Us</p>
                  <p className="font-medium text-lg">+91 7574-014000</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group cursor-pointer">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">WhatsApp</p>
                  <p className="font-medium text-lg">+91 7574-014000</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 mt-16 pt-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors">
                <FacebookIcon />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors">
                <TwitterIcon />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors">
                <InstagramIcon />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors">
                <LinkedinIcon />
              </Link>
            </div>
            {/* <p className="text-xs text-slate-500">&copy; Sanchhaya Education Pvt Ltd</p> */}
          </div>
        </div>

        {/* Contact Form (Right) */}
        <div className="lg:col-span-3 p-10 md:p-14 bg-white">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 tracking-tight">Send a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-slate-200 focus:outline-none focus:border-sky-500 transition-colors text-slate-800 placeholder:text-slate-300"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-slate-200 focus:outline-none focus:border-sky-500 transition-colors text-slate-800 placeholder:text-slate-300"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-slate-200 focus:outline-none focus:border-sky-500 transition-colors text-slate-800 placeholder:text-slate-300"
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-slate-200 focus:outline-none focus:border-sky-500 transition-colors appearance-none text-slate-800"
                >
                  <option>General Inquiry</option>
                  <option>Report a Bug</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-0 py-3 bg-transparent border-b-2 border-slate-200 focus:outline-none focus:border-sky-500 transition-colors resize-none text-slate-800 placeholder:text-slate-300"
                placeholder="How can we help you today?"
              ></textarea>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full md:w-auto px-10 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-full font-bold tracking-wide transition-all shadow-lg shadow-sky-500/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 hover:scale-[1.02]"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                {!isSubmitting && <Send className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <HelpCircle className="w-10 h-10 text-sky-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-100 rounded-2xl p-6 cursor-pointer hover:shadow-md transition-all group"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex justify-between items-center gap-4">
                <h3 className="font-bold text-slate-800 group-hover:text-sky-500 transition-colors">{faq.question}</h3>
                <ArrowRight className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-90 text-sky-500' : ''}`} />
              </div>
              {activeFaq === idx && (
                <p className="mt-4 text-slate-500 leading-relaxed text-sm animate-in fade-in slide-in-from-top-2">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
