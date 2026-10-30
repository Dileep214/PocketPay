import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Zap, CheckCircle2, PhoneCall, ShieldCheck } from 'lucide-react';
import { jobService } from '../services/jobService';
import { JobCard } from '../components/jobs/JobCard';

export const HomePage = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await jobService.getJobs({ limit: 4 });
        setFeaturedJobs(res.data || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearchLocality = (locality) => {
    navigate(`/jobs?locality=${encodeURIComponent(locality)}`);
  };

  const topLocalities = ['Madhapur', 'Gachibowli', 'Ameerpet', 'Kukatpally', 'Banjara Hills', 'Hitec City'];

  const quickStats = [
    { value: 'No CV', label: 'apply without a resume', accent: 'text-amber-300' },
    { value: '₹0', label: 'agency commission', accent: 'text-emerald-300' },
    { value: 'Direct', label: 'employer contact', accent: 'text-sky-300' }
  ];

  return (
    <div className="space-y-10 pb-6 md:space-y-12">
      <section className="relative overflow-hidden rounded-[32px] border border-slate-800/80 bg-slate-950 px-5 py-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.28)] sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />

        <div className="relative grid gap-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              Hyperlocal Marketplace • Hyderabad
            </div>

            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl">
                Work that starts <span className="text-amber-300">near you</span>, fast.
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Skip the resumes. PocketPay connects local workers and employers in Hyderabad through direct openings, instant contact, and flexible daily shifts.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-400 px-5 py-3.5 text-base font-black text-slate-900 shadow-[0_18px_32px_rgba(251,191,36,0.35)] transition-transform hover:-translate-y-0.5"
              >
                Browse jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/employer/post-job"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                Need staff? Post a job
              </Link>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-2 xl:grid-cols-4">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Zero commission
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200">
                <PhoneCall className="h-4 w-4 text-amber-300" />
                Direct phone
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200">
                <MapPin className="h-4 w-4 text-red-300" />
                Nearby only
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Verified employers
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.32)] backdrop-blur-xl">
              <div className="rounded-[24px] bg-slate-900/80 p-4 ring-1 ring-white/10">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Featured roles</p>
                    <h2 className="mt-1 text-xl font-black text-white">Hyderabad now</h2>
                  </div>
                  <Link to="/jobs" className="text-xs font-semibold text-emerald-300 transition-colors hover:text-emerald-200">
                    Explore all
                  </Link>
                </div>

                <div className="space-y-3">
                  {featuredJobs.slice(0, 3).map((job) => (
                    <div
                      key={job._id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">{job.title}</p>
                        <p className="text-xs text-slate-400">
                          {job.location?.locality} · ₹{job.wage?.amount?.toLocaleString('en-IN')}/{job.wage?.type === 'hourly' ? 'hr' : job.wage?.type === 'monthly' ? 'month' : 'day'}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 flex-shrink-0 text-brand-300" />
                    </div>
                  ))}
                  {!loading && featuredJobs.length === 0 && (
                    <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      New openings will appear here as local businesses post them.
                    </p>
                  )}
                  {loading && (
                    <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      Finding nearby openings…
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-center">
                    <div className={`text-xl font-black ${stat.accent}`}>{stat.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="section-header">
          <div>
            <div className="section-kicker">areas</div>
            <h2 className="section-title">Explore Hyderabad localities</h2>
          </div>
          <Link to="/jobs" className="text-sm font-bold text-brand-600 transition-colors hover:text-brand-700">
            View all areas →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {topLocalities.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSearchLocality(loc)}
              className="group flex items-center gap-2 rounded-[22px] border border-slate-200 bg-white/90 p-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/60"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-brand-100 group-hover:text-brand-600">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-slate-800 group-hover:text-brand-700">{loc}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="section-header">
          <div>
            <div className="section-kicker">featured</div>
            <h2 className="section-title">Latest urgent openings</h2>
          </div>
          <Link to="/jobs" className="text-sm font-bold text-brand-600 transition-colors hover:text-brand-700">
            See all jobs →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-72 animate-pulse rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-[0_18px_35px_rgba(15,23,42,0.04)]">
                <div className="mb-4 h-5 w-1/3 rounded-full bg-slate-200" />
                <div className="mb-3 h-7 w-3/4 rounded-full bg-slate-200" />
                <div className="mb-5 h-10 rounded-2xl bg-slate-100" />
                <div className="space-y-2">
                  <div className="h-4 w-2/3 rounded-full bg-slate-200" />
                  <div className="h-4 w-1/2 rounded-full bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-slate-200 bg-white/80 p-10 text-center shadow-[0_18px_35px_rgba(15,23,42,0.04)]">
            <p className="text-sm text-slate-500">No jobs posted yet.</p>
          </div>
        )}
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 shadow-[0_18px_46px_rgba(15,23,42,0.05)] sm:p-8 lg:p-10">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <div className="section-kicker">how it works</div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Hiring made frictionless</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Built specifically for the informal workforce and independent local businesses.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              number: '1',
              title: 'Browse nearby jobs',
              copy: 'Filter by your neighborhood and discover work that fits your schedule, location, and skill set.',
              color: 'from-blue-100 to-indigo-50 text-blue-700'
            },
            {
              number: '2',
              title: 'Apply in one tap',
              copy: 'No PDFs or resumes. Your phone number, availability, and local profile are enough to get noticed.',
              color: 'from-emerald-100 to-green-50 text-emerald-700'
            },
            {
              number: '3',
              title: 'Get picked up directly',
              copy: 'Employers shortlist and contact you immediately through call or WhatsApp without layers of friction.',
              color: 'from-amber-100 to-yellow-50 text-amber-700'
            }
          ].map((item) => (
            <div key={item.title} className="rounded-[26px] border border-slate-200 bg-white/85 p-6 shadow-[0_18px_35px_rgba(15,23,42,0.04)] transition-transform hover:-translate-y-1">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-lg font-black`}>
                {item.number}
              </div>
              <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
