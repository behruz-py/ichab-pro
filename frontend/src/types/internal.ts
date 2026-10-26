// Staff-only datasets served by GET /api/v1/internal/datasets/ (auth required).
// Every key is optional: a section whose dataset hasn't been entered in the
// admin simply isn't rendered.

export type Loc = Record<string, string>;

export interface KpiRow { value: number; suffix: string; rgb: string; label: Loc }
export interface ProductionRow { year: number; prod: number; helio?: number; forecast?: boolean }
export interface BreakdownDonut { title: Loc; total: number; segments: { label: Loc; value: number }[] }
export interface IndicatorRow { name: Loc; unit: Loc; v2024: string; v2025: string; change: string; pct?: string; level: number }
export interface EnergyRow { n?: string; name: Loc; v2025: string; v2026: string; pct?: string; total?: boolean }
export interface CostRow { name: Loc; bSum: string; bShare?: string; kSum: string; kShare?: string; y2026: string; pct?: string; bold?: boolean }
export interface DivisionShare { total: number; segments: { label: Loc; value: number; pct: string; rgb: string }[] }
export interface GrowthRow { year: number; dona: number; vol: string; volNum: number; forecast?: boolean }
export interface LocalizedProduct { uz: string; ru: string; en: string; count: string; value: string }
export interface LocalizedProducts { types: number; volume: string; products: LocalizedProduct[] }

export interface InternalDatasets {
  kpis?: KpiRow[];
  production_volume?: ProductionRow[];
  product_breakdown_2026?: BreakdownDonut[];
  main_indicators?: IndicatorRow[];
  energy_efficiency?: EnergyRow[];
  cost_estimate?: CostRow[];
  divisions_share_2025?: DivisionShare;
  divisions_share_2026?: DivisionShare;
  localization_growth?: GrowthRow[];
  localized_products_2026?: LocalizedProducts;
}

export interface StaffUser { username: string; full_name: string }
