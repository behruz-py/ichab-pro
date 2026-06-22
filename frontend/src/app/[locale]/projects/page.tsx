import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Factory } from "lucide-react";
import { locales } from "@/i18n/request";
import { api } from "@/lib/api-client";
import { mediaUrl, formatDate } from "@/lib/utils";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-content mb-4">{t("title")}</h1>
        <p className="text-content-secondary text-lg max-w-2xl">{t("subtitle")}</p>
      </div>

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
    </div>
  );
}
