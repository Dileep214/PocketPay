import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Search, ArrowRight, Zap, CheckCircle2, PhoneCall, ShieldCheck, Briefcase } from 'lucide-react';
import { jobService } from '../services/jobService';
import { JobCard } from '../components/jobs/JobCard';
import { Button } from '../components/common/Button';
import { HYDERABAD_LOCALITIES } from '../utils/constants';

export const HomePage = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocality, setSelectedLocality] = useState('All Localities');
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

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 text-white p-6 sm:p-12 shadow-xl">
        <div className="max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Hyperlocal Marketplace • Hyderabad</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Find Work Near You Today. <span className="text-amber-300">No Resumes.</span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100 font-normal leading-relaxed">
            Connect directly with local cafes, shops, restaurants, and warehouses across Hyderabad. Daily wages, part-time shifts, and instant hiring via direct phone call.
          </p>

          {/* Quick Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold rounded-2xl shadow-lg transition-all text-base"
            >
              <span>Browse Hyderabad Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/employer/post-job"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/25 transition-all text-base"
            >
              <span>Need Staff? Post a Job</span>
            </Link>
          </div>
        </div>

        {/* Floating Quick Facts */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            <span>Zero Agency Commissions</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span>Direct Phone Contact</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-300 flex-shrink-0" />
            <span>Within 2-5 KM Radius</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-300 flex-shrink-0" />
            <span>Verified Local Employers</span>
          </div>
        </div>
      </section>

      {/* Popular Hyderabad Hubs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Explore Hyderabad Localities</h2>
            <p className="text-xs sm:text-sm text-gray-500">Pick your neighborhood to see available jobs</p>
          </div>
          <Link to="/jobs" className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700">
            View All Areas →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {topLocalities.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSearchLocality(loc)}
              className="flex items-center gap-2 p-3 bg-white border border-gray-200 hover:border-brand-500 hover:bg-brand-50/50 rounded-2xl text-left transition-all group shadow-sm"
            >
              <div className="w-7 h-7 rounded-xl bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center text-gray-500 group-hover:text-brand-600 transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-brand-700">
                {loc}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Latest Urgent Openings</h2>
            <p className="text-xs sm:text-sm text-gray-500">Local businesses hiring immediately in Hyderabad</p>
          </div>
          <Link to="/jobs" className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700">
            See all jobs →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-gray-200 rounded-2xl p-5 h-64 animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-10 bg-gray-100 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">No jobs posted yet.</p>
          </div>
        )}
      </section>

      {/* How it Works / Trust Pillars */}
      <section className="bg-gray-100/70 rounded-3xl p-6 sm:p-10 border border-gray-200">
        <div className="text-center max-w-lg mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Hiring Made Frictionless</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Built specifically for the informal workforce and independent local businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-brand-600 flex items-center justify-center font-bold text-lg mb-3">
              1
            </div>
            <h3 className="font-bold text-gray-900 text-base">Browse Nearby Jobs</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Filter by your Hyderabad area (Madhapur, Kukatpally, Banjara Hills) and see transparent daily wages upfront.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg mb-3">
              2
            </div>
            <h3 className="font-bold text-gray-900 text-base">1-Tap Application</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              No PDFs or resumes. Your phone number, skills, and shift availability act as your digital identity.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg mb-3">
              3
            </div>
            <h3 className="font-bold text-gray-900 text-base">Direct Phone Call</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Employers shortlist and call you directly or send a WhatsApp message to confirm shift details.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
