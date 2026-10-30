import React from 'react';
import { MapPin, ShieldCheck, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-12 border-t border-slate-200/80 bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex items-center gap-2 font-bold text-base text-white">
              <Zap className="h-5 w-5 text-amber-300" />
              <span>Direct Local Hiring</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Connecting local shops and informal workers across Hyderabad in minutes with zero resumes and zero commissions.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex items-center gap-2 font-bold text-base text-white">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <span>Verified Direct Contacts</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Employers and candidates connect directly via phone call or WhatsApp once shortlisted.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 flex items-center gap-2 font-bold text-base text-white">
              <MapPin className="h-5 w-5 text-red-300" />
              <span>Hyperlocal in Hyderabad</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Active across Madhapur, Gachibowli, Banjara Hills, Ameerpet, Kukatpally, and more.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} PocketPay. Built for local workers and businesses.</p>
          <div className="flex gap-4">
            <span>No AI • No Chat • No Middleman Fees</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
