import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { JagungSuitabilityRead, SuitabilityClass } from '../../types/api.types';
import {
  PARAMETER_SHORT_LABELS,
  SUITABILITY_LABELS,
  SUITABILITY_STYLES,
  formatCategory,
  formatHectare,
  formatParameterValue,
  isImprovable,
} from '../../utils/jagungHelper';

interface JagungSuitabilityCardProps {
  jagung: JagungSuitabilityRead | null;
  isLoading: boolean;
  error: string | null;
}

function SectionTitle({ pulse = false }: { pulse?: boolean }) {
  return (
    <h3 className="font-semibold text-on-surface flex items-center gap-2">
      <span className={`w-1.5 h-6 bg-primary rounded-full ${pulse ? 'animate-pulse' : ''}`}></span>
      Kesesuaian Jagung
    </h3>
  );
}

function ClassBadge({ label, value }: { label: string; value: SuitabilityClass }) {
  return (
    <div className="flex-1 flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
      <div
        className={`px-3 py-2 rounded-xl border flex items-center gap-2 ${SUITABILITY_STYLES[value].badge}`}
      >
        <span className="font-mono text-base font-bold">{value}</span>
        <span className="text-[10px] uppercase font-sans font-bold tracking-wide leading-tight">
          {SUITABILITY_LABELS[value]}
        </span>
      </div>
    </div>
  );
}

export const JagungSuitabilityCard: React.FC<JagungSuitabilityCardProps> = ({
  jagung,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <SectionTitle pulse />
        <div className="h-40 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <SectionTitle />
        <div className="p-4 rounded-2xl border border-error/30 bg-error/5 text-sm text-error">
          {error}
        </div>
      </div>
    );
  }

  if (!jagung) return null;

  if (jagung.status === 'insufficient_data' || !jagung.actual_class || !jagung.potential_class) {
    return (
      <div className="space-y-3">
        <SectionTitle />
        <div className="p-4 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest text-sm text-on-surface-variant space-y-1">
          <p className="font-semibold text-on-surface">Data tidak cukup untuk menilai kesesuaian jagung.</p>
          {jagung.missing_parameters.length > 0 && (
            <p>
              Data belum tersedia:{' '}
              {jagung.missing_parameters.map((key) => PARAMETER_SHORT_LABELS[key]).join(', ')}.
            </p>
          )}
        </div>
      </div>
    );
  }

  const parameterByKey = new Map(jagung.parameters.map((item) => [item.parameter, item]));
  const area = formatHectare(jagung.area_ha);

  return (
    <div className="space-y-3">
      <SectionTitle />
      <div
        className={`p-4 rounded-2xl border flex flex-col gap-3 ${SUITABILITY_STYLES[jagung.potential_class].card}`}
      >
        <div className="flex items-end gap-2">
          <ClassBadge label="Kelas Aktual" value={jagung.actual_class} />
          <ArrowRightIcon className="w-4 h-4 mb-3 shrink-0 opacity-60" />
          <ClassBadge label="Kelas Potensial" value={jagung.potential_class} />
        </div>

        {jagung.limiting_factors.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-current/10">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 mr-0.5">
              Faktor Pembatas:
            </span>
            {jagung.limiting_factors.map((key) => {
              const improvable = isImprovable(parameterByKey.get(key));
              return (
                <span
                  key={key}
                  title={improvable ? 'Dapat diperbaiki dengan pengelolaan' : 'Faktor permanen'}
                  className={`font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase text-white ${
                    improvable ? 'bg-amber-600' : 'bg-red-600'
                  }`}
                >
                  {PARAMETER_SHORT_LABELS[key]} · {improvable ? 'dapat diperbaiki' : 'permanen'}
                </span>
              );
            })}
          </div>
        )}

        {jagung.potential_limiting_factors.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 mr-0.5">
              Pembatas setelah perbaikan:
            </span>
            {jagung.potential_limiting_factors.map((key) => (
              <span
                key={key}
                className="font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase border border-current/30"
              >
                {PARAMETER_SHORT_LABELS[key]}
              </span>
            ))}
          </div>
        )}

        <details className="group text-xs">
          <summary className="cursor-pointer font-bold select-none">Rincian per parameter</summary>
          <table className="w-full mt-2 text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider opacity-80">
                <th className="py-1 font-bold">Parameter</th>
                <th className="py-1 font-bold">Nilai</th>
                <th className="py-1 font-bold text-right">Aktual → Potensial</th>
              </tr>
            </thead>
            <tbody>
              {jagung.parameters.map((item) => (
                <tr key={item.parameter} className="border-t border-current/10 align-top">
                  <td className="py-1.5 pr-2 font-semibold">{PARAMETER_SHORT_LABELS[item.parameter]}</td>
                  <td className="py-1.5 pr-2">{formatParameterValue(item)}</td>
                  <td className="py-1.5 text-right font-mono whitespace-nowrap">
                    {item.actual_class ?? '–'} → {item.potential_class ?? '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </div>

      <p className="text-[10px] text-on-surface-variant leading-relaxed">
        Kriteria {jagung.rule_set_version} (Ritung dkk. 2011, Juknis Evaluasi Lahan).
        {area ? ` Luas satuan lahan ±${area}.` : ''} Drainase{' '}
        {formatCategory(parameterByKey.get('drainase')?.category ?? 'tidak tersedia')} adalah
        perkiraan dari jenis tanah dan bentang lahan.
      </p>
    </div>
  );
};
