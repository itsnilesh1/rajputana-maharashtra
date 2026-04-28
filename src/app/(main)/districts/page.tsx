export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Users, ArrowRight } from "lucide-react";
import dbConnect from "@/lib/db";
import { District } from "@/models/index";
import MemberProfile from "@/models/MemberProfile";

export const metadata: Metadata = {
  title: "Districts | Rajputana Maharashtra",
  description: "Rajput community across all 36 districts of Maharashtra",
};

type DistrictDoc = {
  _id: unknown;
  __v?: number;
  name: string;
  slug: string;
  region?: string;
  headquarters?: string;
  isActive?: boolean;
  liveMemberCount: number;
};

async function getDistrictsWithCounts(): Promise<DistrictDoc[]> {
  await dbConnect();

  const districts = (await District.find({ isActive: true })
    .sort({ region: 1, name: 1 })
    .lean()) as unknown as Omit<DistrictDoc, "liveMemberCount">[];

  const memberCounts = await MemberProfile.aggregate<{
    _id: string;
    count: number;
  }>([
    { $match: { approvalStatus: "approved", isPublic: true } },
    { $group: { _id: "$district", count: { $sum: 1 } } },
  ]);

  const countMap: Record<string, number> = {};

  for (const c of memberCounts) {
    if (c._id) countMap[c._id] = c.count;
  }

  return districts.map((district) => ({
    ...district,
    region: district.region || "Other",
    liveMemberCount: countMap[district.name] || 0,
  }));
}

export default async function DistrictsPage() {
  const districts = await getDistrictsWithCounts();

  const byRegion: Record<string, DistrictDoc[]> = {};

  for (const district of districts) {
    const region = district.region || "Other";
    if (!byRegion[region]) byRegion[region] = [];
    byRegion[region].push(district);
  }

  const regionOrder = [
    "Konkan",
    "North Maharashtra",
    "Western Maharashtra",
    "Marathwada",
    "Vidarbha",
    "Other",
  ];

  const sortedRegions = [
    ...regionOrder.filter((region) => byRegion[region]),
    ...Object.keys(byRegion).filter((region) => !regionOrder.includes(region)),
  ];

  return (
    <main className="bg-royal-black min-h-screen pt-20">
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-royal-gold/4 blur-[120px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center mb-16">
          <p className="font-display text-royal-gold/60 tracking-[0.5em] text-xs uppercase mb-4">
            Across Maharashtra
          </p>

          <h1 className="font-display text-5xl md:text-6xl text-white tracking-wide mb-6">
            Our <span className="gold-text">36 Districts</span>
          </h1>

          <div className="w-24 h-0.5 bg-gold-gradient mx-auto mb-6" />

          <p className="font-serif text-lg text-white/55 italic leading-relaxed">
            The Rajputana Maharashtra network spans all 36 official districts —
            from the coast of Konkan to the forests of Vidarbha.
          </p>

          <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
            <div className="text-center">
              <p className="font-display text-3xl text-royal-gold">
                {districts.length}
              </p>
              <p className="font-sans text-xs text-white/40">Districts</p>
            </div>

            <div className="w-px h-8 bg-gold-dim/30" />

            <div className="text-center">
              <p className="font-display text-3xl text-royal-gold">
                {districts.reduce(
                  (total, district) => total + district.liveMemberCount,
                  0
                )}
              </p>
              <p className="font-sans text-xs text-white/40">
                Approved Members
              </p>
            </div>

            <div className="w-px h-8 bg-gold-dim/30" />

            <div className="text-center">
              <p className="font-display text-3xl text-royal-gold">
                {sortedRegions.length}
              </p>
              <p className="font-sans text-xs text-white/40">Regions</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto space-y-14">
          {sortedRegions.map((region) => (
            <div key={region}>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-royal-gold" />
                  <h2 className="font-display text-royal-gold text-lg tracking-widest uppercase">
                    {region}
                  </h2>
                </div>

                <div className="flex-1 h-px bg-gradient-to-r from-royal-gold/30 to-transparent" />

                <span className="font-sans text-xs text-white/30">
                  {byRegion[region].length} districts
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {byRegion[region].map((district) => (
                  <Link
                    key={district.slug}
                    href={`/districts/${district.slug}`}
                    className="royal-card rounded-2xl p-6 hover:border-royal-gold/50 hover:shadow-royal transition-all duration-300 group block"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display text-base text-white group-hover:text-royal-gold transition-colors tracking-wide leading-tight">
                          {district.name}
                        </h3>

                        {district.headquarters && (
                          <p className="font-sans text-xs text-white/25 mt-0.5">
                            HQ: {district.headquarters}
                          </p>
                        )}
                      </div>

                      <ArrowRight className="w-4 h-4 text-royal-gold/20 group-hover:text-royal-gold group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                    </div>

                    <div className="h-px bg-gradient-to-r from-royal-gold/20 to-transparent mb-4" />

                    <div className="flex items-center gap-1.5 text-white/35">
                      <Users className="w-3.5 h-3.5" />
                      <span className="font-sans text-xs">
                        {district.liveMemberCount > 0
                          ? `${district.liveMemberCount} member${
                              district.liveMemberCount !== 1 ? "s" : ""
                            }`
                          : "Be first to join"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}