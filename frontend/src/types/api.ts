// ─── Shared ──────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ─── Division ─────────────────────────────────────────────────────────────────

export interface DivisionStat {
  id: number;
  icon: string;
  value: number;
  suffix: string;
  label: string;
  order: number;
}

export interface DivisionCapability {
  id: number;
  icon: string;
  title: string;
  order: number;
}

export interface DivisionEquipment {
  id: number;
  icon: string;
  image: string | null;
  name: string;
  model_name: string;
  order: number;
}

export interface DivisionGalleryImage {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export interface DivisionStandard {
  id: number;
  name: string;
  order: number;
}

export interface DivisionTeamMember {
  id: number;
  photo: string | null;
  name: string;
  position: string;
  order: number;
}

export interface Division {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  full_description?: string;
  logo: string | null;
  cover_image: string | null;
  leader_name?: string;
  leader_position?: string;
  contact_phone: string;
  contact_email: string;
  // Present only on the detail (retrieve) response — undefined on list rows.
  stats?: DivisionStat[];
  capabilities?: DivisionCapability[];
  equipment?: DivisionEquipment[];
  gallery?: DivisionGalleryImage[];
  standards?: DivisionStandard[];
  team_members?: DivisionTeamMember[];
  related_projects?: Project[];
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface ProductCategory {
  id: number;
  slug: string;
  name: string;
  icon: string;
  cover_image: string | null;
  parent?: number | null;
  order: number;
}

export interface ProductSpec {
  id: number;
  label: string;
  value: string;
  unit?: string;
  order: number;
}

export interface ProductImage {
  id: number;
  image: string;
  alt?: string;
  alt_uz: string;
  alt_ru: string;
  alt_en: string;
  is_main: boolean;
  order: number;
}

export type Availability = "available" | "on_order" | "discontinued";

export interface VariantTable {
  variants: string[];
  rows: { label: string; unit: string; values: string[] }[];
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  short_description?: string;
  description?: string;
  sku?: string;
  brand?: string;
  availability?: Availability;
  meta_title?: string;
  meta_description?: string;
  category: ProductCategory | null;
  category_name?: string;
  main_image: string | null;
  images?: ProductImage[];
  specs?: ProductSpec[];
  variant_table?: VariantTable | null;
  catalog_file: string | null;
  order: number;
  is_active: boolean;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export interface ServiceImage {
  id: number;
  image: string;
  is_main: boolean;
  order: number;
}

export interface Service {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  description?: string;
  icon: string;
  cover_image: string | null;
  images?: ServiceImage[];
  division: number | null;
  division_name?: string;
  price_from: string | null;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Certificate ──────────────────────────────────────────────────────────────

export interface Certificate {
  id: number;
  name: string;
  issuing_organization: string;
  issued_date: string | null;
  expiry_date: string | null;
  image: string | null;
  document: string | null;
  is_international: boolean;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Partner ──────────────────────────────────────────────────────────────────

export interface Partner {
  id: number;
  name: string;
  description: string;
  logo: string;
  website: string;
  is_featured: boolean;
  order: number;
  is_active: boolean;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface ProjectImage {
  id: number;
  image: string;
  caption_uz: string;
  caption_ru: string;
  caption_en: string;
  is_main: boolean;
  order: number;
}

export interface Project {
  id: number;
  slug: string;
  name: string;
  client: string;
  description?: string;
  result?: string;
  location: string;
  completed_date: string | null;
  division: number | null;
  main_image: string | null;
  images?: ProjectImage[];
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Statistic ────────────────────────────────────────────────────────────────

export interface Statistic {
  id: number;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  order: number;
  is_active: boolean;
}

// ─── PageContent ──────────────────────────────────────────────────────────────

export interface PageContent {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  body: string;
  image: string | null;
  meta: Record<string, unknown>;
  order: number;
  is_active: boolean;
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

export interface LeadCreate {
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  message?: string;
  subject?: string;
  source_page?: string;
}

export interface LeadCreateResponse {
  detail: string;
}
