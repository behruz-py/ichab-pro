"use client";

import type { ReactNode } from "react";
import type { Certificate, Division, PageContent } from "@/types/api";
import { T, tr, type TrustStat } from "./_sections/copy";
import { Hero } from "./_sections/Hero";
import { MissionReveal } from "./_sections/MissionReveal";
import { Marquee } from "./_sections/Marquee";
import { GoalsSplit } from "./_sections/GoalsSplit";
import { StructureIndex } from "./_sections/StructureIndex";
import { Accreditation } from "./_sections/Accreditation";
import { FinaleCta } from "./_sections/FinaleCta";

export type { TrustStat };

export function AboutShowcase({
  locale, mission, vision, history, divisions, trustStats, certificates,
}: {
  locale: string;
  mission: PageContent | null;
  vision: PageContent | null;
  history: PageContent | null;
  divisions: Division[];
  trustStats: TrustStat[];
  certificates: Certificate[];
}) {
  // Section numbers follow whatever content actually exists, so a missing
  // block never leaves a gap like 01, 03, 04.
  let n = 0;
  const next = () => ++n;

  const sections: ReactNode[] = [];
  if (mission?.body) {
    sections.push(<MissionReveal key="mission" index={next()} label={tr(T.mission, locale)} body={mission.body} />);
    sections.push(<Marquee key="marquee" locale={locale} />);
  }
  if (vision?.body) {
    sections.push(<GoalsSplit key="vision" index={next()} label={tr(T.goals, locale)} title={vision.title} subtitle={vision.subtitle} body={vision.body} />);
  }
  if (history?.body) {
    sections.push(<GoalsSplit key="history" index={next()} label={tr(T.history, locale)} title={history.title} subtitle={history.subtitle} body={history.body} />);
  }
  if (divisions.length > 0) {
    sections.push(<StructureIndex key="structure" index={next()} locale={locale} divisions={divisions.slice(0, 6)} />);
  }
  if (certificates.length > 0) {
    sections.push(<Accreditation key="accreditation" index={next()} locale={locale} certificates={certificates} />);
  }

  return (
    <div className="relative">
      <Hero locale={locale} title={mission?.title || "ICHAB"} subtitle={mission?.subtitle} stats={trustStats} />
      {sections}
      <FinaleCta locale={locale} />
    </div>
  );
}
