import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Factory } from "lucide-react";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { mediaUrl, formatDate } from "@/lib/utils";
import { CompletedProjectsTimeline } from "@/components/sections/CompletedProjectsTimeline";

type Props = { params: { locale: string } };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "projects" });
  return { title: t("title") };
}

export default async function ProjectsPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "projects" });

  const res = await api.projects.list(locale).catch(() => null);
  const projects = res?.results ?? [];

  return (
    <div className="relative overflow-hidden">
      {/* ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="stat-orb" style={{ top: "2%", left: "-4%", background: "radial-gradient(circle, rgba(56,189,248,0.16), transparent 70%)" }} />
        <div className="stat-orb" style={{ top: "44%", right: "-6%", background: "radial-gradient(circle, rgba(16,185,129,0.14), transparent 70%)", animationDelay: "-9s" }} />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-12">
          <h1 className="font-display font-bold text-content mb-4 leading-tight" style={{ fontSize: "clamp(32px,4.5vw,56px)" }}>{t("title")}</h1>
          <p className="max-w-2xl" style={{ color: "var(--content-secondary)", fontSize: "clamp(16px,2vw,19px)" }}>{t("subtitle")}</p>
        </div>

        {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group glass-card rounded-2xl border border-border-subtle overflow-hidden hover:border-accent/40 transition-all duration-300 hover:shadow-glow"
          >
            <div className="relative h-56 bg-surface-secondary overflow-hidden">
              {project.main_image ? (
                <Image
                  src={mediaUrl(project.main_image)}
                  alt={project.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent/10 to-transparent flex items-center justify-center text-accent/30">
                  <Factory size={48} strokeWidth={1.5} />
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="font-display font-bold text-content text-xl mb-3 group-hover:text-accent transition-colors">
                {project.name}
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-content-muted text-xs uppercase tracking-wider mb-1">{t("client")}</p>
                  <p className="text-content-secondary text-sm font-medium">{project.client}</p>
                </div>
                <div>
                  <p className="text-content-muted text-xs uppercase tracking-wider mb-1">{t("location")}</p>
                  <p className="text-content-secondary text-sm font-medium">{project.location}</p>
                </div>
                {project.completed_date && (
                  <div>
                    <p className="text-content-muted text-xs uppercase tracking-wider mb-1">{t("completed")}</p>
                    <p className="text-content-secondary text-sm font-medium">
                      {formatDate(project.completed_date, locale)}
                    </p>
                  </div>
                )}
              </div>
              {project.result && (
                <div className="pt-3 border-t border-border-subtle">
                  <p className="text-content-muted text-xs uppercase tracking-wider mb-1">{t("result")}</p>
                  <p className="text-content-secondary text-sm line-clamp-2">{project.result}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
        )}

        <CompletedProjectsTimeline locale={locale} />
      </div>
    </div>
  );
}
