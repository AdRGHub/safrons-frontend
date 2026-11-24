import React, { useEffect, useState } from 'react';
import { BeakerIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { clusterService } from '../../services/cluster.service';
import { useToast } from '../../contexts/ToastContext';
import type { ClusterRead, ClustersRead } from '../../types/api.types';

interface Draft {
  title: string;
  content: string;
  validated: boolean;
}

function draftOf(cluster: ClusterRead): Draft {
  return {
    title: cluster.package?.title ?? `Paket pemupukan: ${cluster.profile_name}`,
    content: cluster.package?.content ?? '',
    validated: cluster.package ? !cluster.package.is_draft : false,
  };
}

function formatNumber(value: number): string {
  return value.toLocaleString('id-ID', { maximumFractionDigits: 2 });
}

/**
 * Bagian Panel Pakar untuk menyunting paket pemupukan per tipe profil hara (F-13).
 * Memuat datanya sendiri agar halaman Panel Pakar cukup merender komponen ini.
 */
export const ClusterPackageForm: React.FC = () => {
  const { showToast } = useToast();
  const [data, setData] = useState<ClustersRead | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    clusterService
      .getClusters()
      .then((result) => {
        if (!isMounted) return;
        setData(result);
        setDrafts(Object.fromEntries(result.clusters.map((c) => [c.cluster_id, draftOf(c)])));
      })
      .catch((error: unknown) => {
        console.error('Gagal memuat tipe profil hara:', error);
        if (isMounted) setLoadError('Tipe profil hara tidak dapat dimuat.');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const updateDraft = (clusterId: number, patch: Partial<Draft>) => {
    setDrafts((prev) => ({ ...prev, [clusterId]: { ...prev[clusterId], ...patch } }));
  };

  const handleSave = async (e: React.FormEvent, cluster: ClusterRead) => {
    e.preventDefault();
    const draft = drafts[cluster.cluster_id];
    if (draft.title.trim().length < 3 || draft.content.trim().length < 10) {
      showToast('Judul minimal 3 karakter dan isi paket minimal 10 karakter.', 'error');
      return;
    }
    setSavingId(cluster.cluster_id);
    try {
      const saved = await clusterService.updatePackage(cluster.cluster_id, {
        title: draft.title.trim(),
        content: draft.content.trim(),
        is_draft: !draft.validated,
      });
      setData((prev) =>
        prev
          ? {
              ...prev,
              clusters: prev.clusters.map((c) =>
                c.cluster_id === cluster.cluster_id ? { ...c, package: saved } : c
              ),
            }
          : prev
      );
      showToast(
        saved.is_draft ? 'Paket disimpan sebagai draf.' : 'Paket disimpan dan ditandai divalidasi.',
        'success'
      );
    } catch (error) {
      console.error('Gagal menyimpan paket pemupukan:', error);
      showToast('Gagal menyimpan paket pemupukan.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold font-display text-on-surface flex items-center gap-2">
          <BeakerIcon className="w-7 h-7 text-primary" />
          Paket Pemupukan per Tipe Profil Hara
        </h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Paket ini tampil di panel lahan untuk setiap lahan dengan tipe profil yang sama. Tipe
          profil adalah pola hara hasil k-means, bukan tingkat kesuburan, dan tidak memengaruhi
          kelas kesesuaian jagung.
        </p>
        {data?.model_version && (
          <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
            Model aktif {data.model_version}
            {data.silhouette !== null ? ` · silhouette ${formatNumber(data.silhouette)}` : ''}
          </p>
        )}
      </div>

      {!data && !loadError && (
        <div className="h-48 bg-surface-container-lowest border border-outline-variant/50 rounded-3xl animate-pulse" />
      )}

      {loadError && (
        <div className="bg-error/10 text-error p-4 rounded-xl font-medium">{loadError}</div>
      )}

      {data?.model_version === null && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 text-sm text-on-surface-variant">
          Belum ada model klaster aktif. Minta admin melatih model dari Panel Admin.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {data?.clusters.map((cluster) => {
          const draft = drafts[cluster.cluster_id] ?? draftOf(cluster);
          return (
            <form
              key={cluster.cluster_id}
              onSubmit={(e) => void handleSave(e, cluster)}
              className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-5 shadow-sm flex flex-col gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-on-surface-variant">
                    Klaster {cluster.cluster_id} · {cluster.n_areas} lahan
                  </span>
                  {cluster.package && !cluster.package.is_draft ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-green-50 text-green-800 border-green-300">
                      <CheckCircleIcon className="w-3 h-3" />
                      Divalidasi
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-800 border-amber-300">
                      Draf
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-on-surface mt-1">{cluster.profile_name}</h3>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Median pH {formatNumber(cluster.median_ph)} · N {formatNumber(cluster.median_n)} · P{' '}
                  {formatNumber(cluster.median_p)} · K {formatNumber(cluster.median_k)}
                </p>
              </div>

              <label className="text-xs font-bold text-on-surface-variant font-display">
                Judul paket
                <input
                  type="text"
                  value={draft.title}
                  maxLength={128}
                  onChange={(e) => updateDraft(cluster.cluster_id, { title: e.target.value })}
                  className="mt-1 w-full bg-surface border border-outline-variant rounded-xl px-3 py-2 text-sm text-on-surface font-sans font-normal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>

              <label className="text-xs font-bold text-on-surface-variant font-display">
                Isi anjuran
                <textarea
                  value={draft.content}
                  rows={8}
                  maxLength={5000}
                  onChange={(e) => updateDraft(cluster.cluster_id, { content: e.target.value })}
                  className="mt-1 w-full bg-surface border border-outline-variant rounded-xl px-3 py-2 text-xs text-on-surface font-sans font-normal leading-relaxed focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>

              <label className="flex items-center gap-2 text-xs text-on-surface cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.validated}
                  onChange={(e) => updateDraft(cluster.cluster_id, { validated: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                Tandai sudah divalidasi pakar
              </label>

              <button
                type="submit"
                disabled={savingId !== null}
                className="mt-auto bg-primary text-white py-2.5 rounded-full font-bold font-display text-sm hover:bg-primary/95 transition-all cursor-pointer disabled:opacity-50"
              >
                {savingId === cluster.cluster_id ? 'Menyimpan...' : 'Simpan Paket'}
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
};
