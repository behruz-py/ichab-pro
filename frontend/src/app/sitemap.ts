import type { MetadataRoute } from "next";
import { locales } from "@/i18n/request";
import { SITE_URL } from "@/lib/site";
import { api } from "@/lib/api-client";

export const revalidate = 3600;

const STATIC_PATHS = [
  "", "/about", "/products", "/services", "/divisions",
  "/projects", "/partners", "/certificates", "/contact",
];

type SlugList = { slug: string }[];

async function safeSlugs(fn: () => Promise<{ results: SlugList }>): Promise<string[]> {
  try {
    const res = await fn();
    return res.results.map(r => r.slug);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
      });
    }
  }

  const [products, divisions, services, projects] = await Promise.all([
    safeSlugs(() => api.products.list({}, "uz")),
    safeSlugs(() => api.divisions.list("uz")),
    safeSlugs(() => api.services.list("uz")),
    safeSlugs(() => api.projects.list("uz")),
  ]);

  const dynamic: [string, string[], number][] = [
    ["products", products, 0.8],
    ["divisions", divisions, 0.6],
    ["services", services, 0.6],
    ["projects", projects, 0.6],
  ];

  for (const [base, slugs, priority] of dynamic) {
    for (const slug of slugs) {
      for (const locale of locales) {
        entries.push({
          url: `${SITE_URL}/${locale}/${base}/${slug}`,
          changeFrequency: "weekly",
          priority,
        });
      }
    }
  }

  return entries;
}
