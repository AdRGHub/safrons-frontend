import type {
  ImprovementStep,
  JagungParameterKey,
  ParameterClass,
  SuitabilityClass,
} from '../types/api.types';

export const SUITABILITY_LABELS: Record<SuitabilityClass, string> = {
  S1: 'Sangat Sesuai',
  S2: 'Cukup Sesuai',
  S3: 'Sesuai Marginal',
  N: 'Tidak Sesuai',
};

/** Warna kelas sama dengan kartu kesesuaian lama: S1 hijau, S2 kuning, S3 oranye, N merah. */
export const SUITABILITY_STYLES: Record<SuitabilityClass, { card: string; badge: string }> = {
  S1: {
    card: 'bg-green-50 border-green-200 text-green-800',
    badge: 'bg-green-100 text-green-800 border-green-300',
  },
  S2: {
    card: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  S3: {
    card: 'bg-orange-50 border-orange-200 text-orange-800',
    badge: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  N: {
    card: 'bg-red-50 border-red-200 text-red-800',
    badge: 'bg-red-100 text-red-800 border-red-300',
  },
};

export const NEUTRAL_BADGE = 'bg-slate-100 text-slate-700 border-slate-300';

export const PARAMETER_SHORT_LABELS: Record<JagungParameterKey, string> = {
  ph: 'pH',
  n: 'N',
  p: 'P',
  k: 'K',
  lereng: 'Lereng',
  tekstur: 'Tekstur',
  drainase: 'Drainase',
};

export const IMPROVEMENT_LABELS: Record<ImprovementStep, string> = {
  ke_S1: 'naik ke S1 dengan pemupukan/pengapuran',
  naik_satu_kelas: 'naik satu kelas dengan saluran drainase',
};

export function formatCategory(value: string): string {
  return value.replace(/_/g, ' ');
}

export function formatParameterValue(item: ParameterClass): string {
  if (item.category) return formatCategory(item.category);
  if (typeof item.raw_value === 'number') {
    return item.raw_value.toLocaleString('id-ID', { maximumFractionDigits: 2 });
  }
  return item.raw_value ?? 'Tidak tersedia';
}

export function formatHectare(value: number | null): string | null {
  if (value === null) return null;
  return `${value.toLocaleString('id-ID', { maximumFractionDigits: 0 })} ha`;
}

/** Faktor pembatas yang dapat diperbaiki pengelolaan (kelas potensial lebih baik dari aktual). */
export function isImprovable(item: ParameterClass | undefined): boolean {
  if (!item?.actual_class || !item.potential_class) return false;
  const order: SuitabilityClass[] = ['S1', 'S2', 'S3', 'N'];
  return order.indexOf(item.potential_class) < order.indexOf(item.actual_class);
}
