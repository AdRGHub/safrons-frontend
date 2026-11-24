import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import type { RankingItem } from '../../types/api.types';
import {
  PARAMETER_SHORT_LABELS,
  SUITABILITY_LABELS,
  SUITABILITY_STYLES,
  formatHectare,
} from '../../utils/jagungHelper';

interface RankingTableProps {
  items: RankingItem[];
  profileNames: Map<number, string>;
  onShowOnMap: (item: RankingItem) => void;
  openingAreaId: number | null;
}

function ClassPill({ value }: { value: RankingItem['actual_class'] }) {
  return (
    <span
      title={SUITABILITY_LABELS[value]}
      className={`inline-flex px-2 py-0.5 rounded-full border font-mono text-xs font-bold ${SUITABILITY_STYLES[value].badge}`}
    >
      {value}
    </span>
  );
}

export const RankingTable: React.FC<RankingTableProps> = ({
  items,
  profileNames,
  onShowOnMap,
  openingAreaId,
}) => {
  return (
    <div className="overflow-x-auto bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-surface-dim text-[11px] uppercase tracking-wider text-on-surface-variant">
          <tr>
            <th className="px-4 py-3 font-bold">#</th>
            <th className="px-4 py-3 font-bold">Lahan</th>
            <th className="px-4 py-3 font-bold">Aktual</th>
            <th className="px-4 py-3 font-bold">Potensial</th>
            <th className="px-4 py-3 font-bold">Faktor Pembatas</th>
            <th className="px-4 py-3 font-bold">Tipe Profil Hara</th>
            <th className="px-4 py-3 font-bold text-right">Luas</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.area_id} className="border-t border-outline-variant/40 align-top hover:bg-primary/5">
              <td className="px-4 py-3 font-mono font-bold text-on-surface">{item.rank}</td>
              <td className="px-4 py-3">
                <div className="font-semibold text-on-surface">{item.name ?? 'Tanpa nama'}</div>
                <div className="text-[11px] text-on-surface-variant font-mono">id {item.area_id}</div>
              </td>
              <td className="px-4 py-3"><ClassPill value={item.actual_class} /></td>
              <td className="px-4 py-3"><ClassPill value={item.potential_class} /></td>
              <td className="px-4 py-3">
                {item.limiting_factors.length === 0 ? (
                  <span className="text-xs text-on-surface-variant">Tidak ada</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {item.limiting_factors.map((key) => {
                      const improvable = item.improvable_factors.includes(key);
                      return (
                        <span
                          key={key}
                          title={improvable ? 'Dapat diperbaiki dengan pengelolaan' : 'Faktor permanen'}
                          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded text-white ${
                            improvable ? 'bg-amber-600' : 'bg-red-600'
                          }`}
                        >
                          {PARAMETER_SHORT_LABELS[key]}
                        </span>
                      );
                    })}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-xs text-on-surface-variant">
                {item.cluster_id === null ? '–' : (profileNames.get(item.cluster_id) ?? `Klaster ${item.cluster_id}`)}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap text-on-surface-variant">
                {formatHectare(item.area_ha) ?? '–'}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onShowOnMap(item)}
                  disabled={openingAreaId !== null}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-3 py-1.5 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-wait whitespace-nowrap"
                >
                  <MapPinIcon className="w-4 h-4" />
                  {openingAreaId === item.area_id ? 'Membuka...' : 'Lihat di Peta'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
