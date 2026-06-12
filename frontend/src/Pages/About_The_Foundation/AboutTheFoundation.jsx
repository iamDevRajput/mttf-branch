import React from "react";
import { Link } from "react-router-dom";
import { Users, Building2, Award, GraduationCap } from "lucide-react";

export default function AboutFoundationMegaMenu() {
  return (
    <div className="absolute left-1/2 top-full mt-6 w-[900px] -translate-x-1/2 z-50">
      <div className="relative rounded-xl bg-white border border-slate-200 border-t-[3px] border-t-blue-600 p-8 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />

        <div className="grid grid-cols-4 gap-10 text-sm font-['Plus_Jakarta_Sans',sans-serif]">

          {/* OUR ORGANISATION */}
          <div>
            <div className="flex items-center gap-3 text-blue-600 mb-4">
              <Users size={18} />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.14em]">
                Our Organisation
              </h3>
            </div>
            <ul className="space-y-3">
              {[
                { label: "Advisors", to: "/about/organisation/advisors" },
                { label: "Leaders", to: "/about/organisation/leaders" },
                { label: "Executives", to: "/about/organisation/executives" },
                { label: "Mentors", to: "/about/organisation/mentors" },
                { label: "Technical Team", to: "/about/organisation/technical-team" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-slate-600 hover:text-blue-600 text-[13px] font-medium transition-colors inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ABOUT MTTF */}
          <div>
            <div className="flex items-center gap-3 text-blue-600 mb-4">
              <Building2 size={18} />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.14em]">
                About MTTF
              </h3>
            </div>
            <ul className="space-y-3">
              {[
                { label: "About", to: "/about" },
                { label: "Contact", to: "/contact" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-slate-600 hover:text-blue-600 text-[13px] font-medium transition-colors inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* MATHTECH CIRCLE */}
          <div>
            <div className="flex items-center gap-3 text-blue-600 mb-4">
              <Award size={18} />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.14em]">
                MathTech Circle
              </h3>
            </div>
            <ul className="space-y-3">
              {[
                { label: "Individual Membership", to: "/about/mathtech-circle/individual" },
                { label: "Institutional Membership", to: "/about/mathtech-circle/institutional" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-slate-600 hover:text-blue-600 text-[13px] font-medium transition-colors inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CHAPTERS */}
          <div>
            <div className="flex items-center gap-3 text-blue-600 mb-4">
              <GraduationCap size={18} />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.14em]">
                Chapters
              </h3>
            </div>
            <ul className="space-y-3">
              {[
                { label: "Student Chapter", to: "/about/chapters/student" },
                { label: "About Chapter", to: "/about/chapters/about" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-slate-600 hover:text-blue-600 text-[13px] font-medium transition-colors inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
