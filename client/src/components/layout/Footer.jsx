import React from 'react';
import { MapPin, ShieldCheck, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
              <Zap className="w-5 h-5 text-brand-600" />
              <span>Direct Local Hiring</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Connecting local shops and informal workers across Hyderabad in minutes with zero resumes and zero commissions.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Verified Direct Contacts</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Employers and candidates connect directly via phone call or WhatsApp once shortlisted.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
              <MapPin className="w-5 h-5 text-red-500" />
              <span>Hyperlocal in Hyderabad</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Active across Madhapur, Gachibowli, Banjara Hills, Ameerpet, Kukatpally, and more.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <p>© {new Date().getFullYear()} PocketPay. Built for local workers and businesses.</p>
          <div className="flex gap-4">
            <span>No AI • No Chat • No Middleman Fees</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
