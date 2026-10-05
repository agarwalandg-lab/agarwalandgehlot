import { ShieldCheck, ExternalLink, AlertCircle } from 'lucide-react';
import { IVORY_COUNTY_DATA } from '../../data/ivoryCountyData';

export default function IvoryLegal() {
  const { reraNumbers, promoter } = IVORY_COUNTY_DATA.projectOverview;

  return (
    <section className="w-full bg-[#171717] py-16 text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#B59A6A]/30 bg-[#1e1a17] p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-xl font-display font-medium text-[#F5F1E8]">
                  RERA &amp; Regulatory Disclosures
                </h3>
                <p className="text-xs text-[#DED3C1]/70">
                  Official Uttar Pradesh Real Estate Regulatory Authority Registrations
                </p>
              </div>
            </div>

            <a
              href={reraNumbers.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B59A6A] hover:underline"
            >
              <span>Visit Official UP RERA Portal</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* RERA Numbers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/10 bg-[#171717] p-4 text-xs">
              <span className="block text-white/50 uppercase tracking-wider text-[10px]">
                Phase 1 RERA No.
              </span>
              <span className="mt-1 block font-mono font-bold text-white text-sm">
                {reraNumbers.phase1}
              </span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#171717] p-4 text-xs">
              <span className="block text-white/50 uppercase tracking-wider text-[10px]">
                Phase 2 RERA No.
              </span>
              <span className="mt-1 block font-mono font-bold text-white text-sm">
                {reraNumbers.phase2}
              </span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#171717] p-4 text-xs">
              <span className="block text-white/50 uppercase tracking-wider text-[10px]">
                Phase 3 RERA No.
              </span>
              <span className="mt-1 block font-mono font-bold text-white text-sm">
                {reraNumbers.phase3}
              </span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#171717] p-4 text-xs">
              <span className="block text-white/50 uppercase tracking-wider text-[10px]">
                Promoter Registration
              </span>
              <span className="mt-1 block font-mono font-bold text-[#B59A6A] text-xs leading-tight">
                {promoter}
              </span>
            </div>
          </div>

          {/* Legal Advisory Note */}
          <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 text-xs text-[#DED3C1]/80 leading-relaxed font-light">
            <AlertCircle size={16} className="text-[#B59A6A] shrink-0 mt-0.5" />
            <p>
              <strong className="text-white font-medium">Statutory Disclaimer:</strong> This microsite is marketed and managed by Agarwal &amp; Gehlot Realtors (A&amp;G), an authorized channel partner for Ivory County Sector 115 Noida. The project details, architectural layouts, 3D renderings, and amenities shown herein are conceptual and subject to revisions by the developer or competent statutory authorities. Prospective buyers are advised to independently verify all approvals, title records, and payment milestones on the official UP RERA portal (<a href={reraNumbers.portalUrl} target="_blank" rel="noopener noreferrer" className="text-[#B59A6A] underline">www.up-rera.in</a>) prior to entering into any transaction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
