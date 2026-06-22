"use client";

import Image from "next/image";
import { Handshake, Building2, ArrowUpRight, Star } from "lucide-react";
import type { Partner } from "@/types/api";
import { mediaUrl } from "@/lib/utils";

interface Props {
  partners: Partner[];
  visitSite: string;
}

export function PartnerGrid({ partners, visitSite }: Props) {
  if (partners.length === 0) {
    return (
      <div className="text-center py-24" style={{ color: "#94A3B8" }}>
        <Handshake size={56} strokeWidth={1.5} style={{ margin: "0 auto 20px", opacity: 0.4 }} />
        <p className="text-lg font-medium">Hamkorlar hali qo&apos;shilmagan</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
      {partners.map((partner) => (
        <PartnerCard key={partner.id} partner={partner} visitSite={visitSite} />
      ))}
    </div>
  );
}

function PartnerCard({ partner, visitSite }: { partner: Partner; visitSite: string }) {
  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-[5px]"
      style={{
        background: "rgba(247,249,252,0.75)",
        border: "1px solid rgba(47,94,148,0.13)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      {/* Hover glow ring — overlays the card */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1px rgba(47,94,148,0.40), 0 12px 48px rgba(47,94,148,0.18)" }}
      />

      {/* White logo zone */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ background: "#FFFFFF", height: "118px", padding: "18px 20px" }}
      >
        {partner.logo ? (
          <Image
            src={mediaUrl(partner.logo)}
            alt={partner.name}
            width={140}
            height={80}
            className="object-contain w-full transition-transform duration-300 group-hover:scale-[1.06]"
            style={{ maxHeight: "72px" }}
            sizes="(max-width:640px) 45vw, 200px"
          />
        ) : (
          <Building2 size={44} strokeWidth={1.5} style={{ opacity: 0.22, color: "#94A3B8" }} />
        )}

        {/* Top blue accent line that slides in on hover */}
        <div
          className="absolute top-0 inset-x-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "linear-gradient(90deg, #244C77, #2F5E94, #3D72AD)" }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <p
          className="font-semibold text-sm text-center leading-snug mb-1 group-hover:text-[#244C77] transition-colors duration-200"
          style={{ color: "#1E293B" }}
        >
          {partner.name}
        </p>

        {partner.description && (
          <p
            className="text-[11px] text-center leading-relaxed mb-3 line-clamp-2"
            style={{ color: "#64748B" }}
          >
            {partner.description}
          </p>
        )}

        {partner.website && (
          <a
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl transition-all duration-200 hover:bg-blue-500/20"
            style={{
              background: "rgba(47,94,148,0.10)",
              border: "1px solid rgba(47,94,148,0.22)",
              color: "#2F5E94",
              textDecoration: "none",
            }}
          >
            {visitSite}
            <ArrowUpRight size={14} />
          </a>
        )}
      </div>

      {/* Featured star badge */}
      {partner.is_featured && (
        <div
          className="absolute top-2.5 right-2.5 flex items-center justify-center w-6 h-6 rounded-lg"
          style={{
            background: "rgba(239,142,54,0.18)",
            border: "1px solid rgba(239,142,54,0.38)",
            color: "#E8852C",
            fontSize: "11px",
          }}
          title="Strategik hamkor"
        >
          <Star size={12} fill="#E8852C" />
        </div>
      )}
    </div>
  );
}
