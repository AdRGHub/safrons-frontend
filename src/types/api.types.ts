export interface UserRead {
  id: number;
  email: string;
  full_name: string;
  role: 'user' | 'expert' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface HaraProperties {
  id: number;
  name: string;
  ph_rata2: number;
  n_rata2: number;
  p_rata2: number;
  k_rata2: number;
  slope__?: string;
  texture_of?: string;
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: any;
  properties: HaraProperties;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export interface AdvisoryRead {
  id: number;
  hara_area_id: number;
  title: string;
  content: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface SavedRegionPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface SavedRegionRead {
  id: number;
  hara_area_id: number;
  selected_point: SavedRegionPoint;
  label: string;
  area: GeoJSONFeature;
  created_at: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  password: string;
  full_name: string;
}

export interface HaraAreaUpdate {
  name?: string | null;
  ph_rata2?: number | null;
  n_rata2?: number | null;
  p_rata2?: number | null;
  k_rata2?: number | null;
  slope__?: string | null;
  texture_of?: string | null;
}

export interface AdvisoryCreate {
  title: string;
  content: string;
  category?: 'soil' | 'fertilizer' | 'general' | null;
  is_active?: boolean;
}

export interface AdvisoryUpdate {
  title?: string | null;
  content?: string | null;
  category?: 'soil' | 'fertilizer' | 'general' | null;
  is_active?: boolean | null;
}

export interface GlossaryTerm {
  id: number;
  term: string;
  definition: string;
  created_at: string;
  updated_at?: string;
}

export interface GlossaryCreate {
  term: string;
  definition: string;
}

export interface GlossaryUpdate {
  term?: string;
  definition?: string;
}

export interface HaraAreaCreate {
  geometry: any;
  properties: {
    name?: string | null;
    ph_rata2?: number | null;
    n_rata2?: number | null;
    p_rata2?: number | null;
    k_rata2?: number | null;
    slope__?: string | null;
    texture_of?: string | null;
  };
}

export interface Averages {
  ph: number;
  n: number;
  p: number;
  k: number;
}

export interface PhDistribution {
  sangat_masam: number;
  masam: number;
  sedikit_masam: number;
  netral: number;
  sedikit_alkalis: number;
  alkalis: number;
}

export interface CriticalArea {
  id: number;
  name: string;
  value: number;
  parameter: string;
}

export interface MacroAnalyticsRead {
  averages: Averages;
  ph_distribution: PhDistribution;
  critical_areas: CriticalArea[];
}

export interface DiagnosisFactor {
  key: string;
  label: string;
  value: number | string | null;
  status: string;
  status_label: string;
  severity: 'info' | 'watch' | 'attention' | 'critical';
  message: string;
}

export interface DiagnosisRecommendation {
  priority: number;
  category: string;
  title: string;
  action: string;
  reason: string;
}

export interface CropSuitability {
  crop: string;
  class: 'S1' | 'S2' | 'S3' | 'N';
  limiting_factors: string[];
  ph_class: 'S1' | 'S2' | 'S3' | 'N';
  n_class: 'S1' | 'S2' | 'S3' | 'N';
  p_class: 'S1' | 'S2' | 'S3' | 'N';
  k_class: 'S1' | 'S2' | 'S3' | 'N';
}

export interface HaraDiagnosisRead {
  rule_set_version: string;
  status: 'ready' | 'insufficient_data';
  summary: string;
  area: any;
  factors: DiagnosisFactor[];
  recommendations: DiagnosisRecommendation[];
  crop_suitabilities: CropSuitability[];
}

export interface HaraAreaChangeRead {
  id: number;
  hara_area_id: number;
  user_id: number;
  action: 'create' | 'update' | string;
  changed_fields: Record<string, any>;
  created_at: string;
  user: UserRead;
  area_name?: string | null;
}

// ---------------------------------------------------------------------------
// SAFRONS Jagung: kesesuaian lahan jagung dan tipe profil hara (klaster)
// Mengikuti schema backend app/schemas/jagung.py dan app/schemas/cluster.py.
// ---------------------------------------------------------------------------

export type SuitabilityClass = 'S1' | 'S2' | 'S3' | 'N';

export type JagungParameterKey = 'ph' | 'n' | 'p' | 'k' | 'lereng' | 'tekstur' | 'drainase';

export type ImprovementStep = 'ke_S1' | 'naik_satu_kelas';

export interface ParameterClass {
  parameter: JagungParameterKey;
  label: string;
  raw_value: number | string | null;
  category: string | null;
  actual_class: SuitabilityClass | null;
  potential_class: SuitabilityClass | null;
  rule_key: string | null;
  improvable: boolean;
  improvement_step: ImprovementStep | null;
  source: string | null;
}

export interface PackageRead {
  cluster_id: number;
  title: string;
  content: string;
  is_draft: boolean;
  updated_by: number | null;
  updated_at: string;
}

export interface PackageUpdate {
  title: string;
  content: string;
  is_draft: boolean;
}

export interface NutrientProfile {
  model_version: string;
  cluster_id: number;
  profile_name: string;
  package: PackageRead | null;
}

export interface JagungSuitabilityRead {
  area_id: number;
  name: string | null;
  status: 'evaluated' | 'insufficient_data';
  rule_set_version: string;
  actual_class: SuitabilityClass | null;
  potential_class: SuitabilityClass | null;
  limiting_factors: JagungParameterKey[];
  improvable_factors: JagungParameterKey[];
  potential_limiting_factors: JagungParameterKey[];
  missing_parameters: JagungParameterKey[];
  parameters: ParameterClass[];
  summary: string;
  area_ha: number | null;
  nutrient_profile: NutrientProfile | null;
}

export interface RankingItem {
  rank: number;
  area_id: number;
  name: string | null;
  actual_class: SuitabilityClass;
  potential_class: SuitabilityClass;
  limiting_factors: JagungParameterKey[];
  improvable_factors: JagungParameterKey[];
  cluster_id: number | null;
  area_ha: number | null;
}

export interface JagungRankingRead {
  rule_set_version: string;
  min_class: SuitabilityClass;
  limit: number;
  total_candidates: number;
  items: RankingItem[];
}

export interface JagungSuitabilityProperties {
  id: number;
  name: string | null;
  status: 'evaluated' | 'insufficient_data';
  actual_class: SuitabilityClass | null;
  potential_class: SuitabilityClass | null;
  limiting_factors: JagungParameterKey[];
  potential_limiting_factors: JagungParameterKey[];
  area_ha: number | null;
  cluster_id: number | null;
}

/** Geometri GeoJSON (Polygon/MultiPolygon) dari PostGIS; null di lingkungan tanpa PostGIS. */
export interface JagungGeometry {
  type: string;
  coordinates: unknown;
}

export interface JagungSuitabilityFeature {
  type: 'Feature';
  geometry: JagungGeometry | null;
  properties: JagungSuitabilityProperties;
}

export interface JagungSuitabilityCollection {
  type: 'FeatureCollection';
  rule_set_version: string;
  features: JagungSuitabilityFeature[];
}

export interface ClusterRead {
  cluster_id: number;
  profile_name: string;
  n_areas: number;
  mean_ph: number;
  mean_n: number;
  mean_p: number;
  mean_k: number;
  median_ph: number;
  median_n: number;
  median_p: number;
  median_k: number;
  package: PackageRead | null;
}

export interface ClustersRead {
  model_version: string | null;
  silhouette: number | null;
  clusters: ClusterRead[];
  note: string;
}

export interface RetrainRequest {
  k?: number;
  n_init?: number;
  random_state?: number;
}

export interface ModelRunRead {
  model_version: string;
  algorithm: string;
  k: number;
  n_init: number;
  random_state: number;
  n_samples: number;
  n_unique: number;
  silhouette: number | null;
  ari_mean: number | null;
  ari_min: number | null;
  cluster_sizes: number[];
  artifact_path: string;
  is_active: boolean;
  triggered_by: number | null;
  trained_at: string;
}
