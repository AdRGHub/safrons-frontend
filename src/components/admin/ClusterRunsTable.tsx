import React, { useEffect, useState } from 'react';
import { ArrowPathIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { clusterService } from '../../services/cluster.service';
import { useToast } from '../../contexts/ToastContext';
import type { ModelRunRead } from '../../types/api.types';

function formatNumber(value: number | null, digits = 3): string {
  if (value === null) return '–';
  return value.toLocaleString('id-ID', { maximumFractionDigits: digits });
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

/**
 * Bagian Panel Admin: riwayat model klaster tipe profil hara dan tombol latih ulang (F-16).
 * Memuat datanya sendiri agar halaman Panel Admin cukup merender komponen ini.
 */
export const ClusterRunsTable: React.FC = () => {
  const { showToast } = useToast();
  const [runs, setRuns] = useState<ModelRunRead[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    let isMounted = true;
    clusterService
      .getRuns()
      .then((result) => {
        if (isMounted) {
          setRuns(result);
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        console.error('Gagal memuat riwayat model klaster:', error);
        if (isMounted) setLoadError('Riwayat model klaster tidak dapat dimuat.');
      });
    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const handleRetrain = async () => {
    setIsTraining(true);
    try {
      const run = await clusterService.retrain();
      showToast(
        `Model ${run.model_version} aktif (silhouette ${formatNumber(run.silhouette)}).`,
        'success'
      );
      setReloadKey((key) => key + 1);
    } catch (error) {
      console.error('Gagal melatih ulang model klaster:', error);
      showToast('Gagal melatih ulang model klaster.', 'error');
    } finally {
      setIsTraining(false);
      setIsConfirming(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold font-display text-on-surface flex items-center gap-2">
            <CpuChipIcon className="w-7 h-7 text-primary" />
            Model Tipe Profil Hara
          </h2>
          <p className="text-sm text-on-surface-variant mt-1 max-w-3xl">
            K-means (k=3) pada pH dan log N, P, K. Latih ulang setelah data hara banyak berubah.
            Paket yang sudah divalidasi pakar dibawa ke versi baru bila nama profilnya sama.
          </p>
        </div>
        {isConfirming ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">Aktifkan versi baru?</span>
            <button
              onClick={() => void handleRetrain()}
              disabled={isTraining}
              className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold cursor-pointer disabled:opacity-50"
            >
              {isTraining ? 'Melatih...' : 'Ya, latih ulang'}
            </button>
            <button
              onClick={() => setIsConfirming(false)}
              disabled={isTraining}
              className="px-4 py-2 rounded-full text-sm font-semibold border border-outline text-on-surface-variant cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsConfirming(true)}
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-primary/95 cursor-pointer"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Latih Ulang Model
          </button>
        )}
      </div>

      {loadError && (
        <div className="bg-error/10 text-error p-4 rounded-xl font-medium">{loadError}</div>
      )}

      {!runs && !loadError && (
        <div className="h-32 bg-surface-container-lowest border border-outline-variant/50 rounded-3xl animate-pulse" />
      )}

      {runs?.length === 0 && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 text-sm text-on-surface-variant">
          Belum ada model. Jalankan ml/train_clusters.py atau tekan Latih Ulang Model.
        </div>
      )}

      {runs && runs.length > 0 && (
        <div className="overflow-x-auto bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-md">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-dim text-[11px] uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="px-4 py-3 font-bold">Versi</th>
                <th className="px-4 py-3 font-bold">Parameter</th>
                <th className="px-4 py-3 font-bold">Sampel</th>
                <th className="px-4 py-3 font-bold">Silhouette</th>
                <th className="px-4 py-3 font-bold">ARI rata-rata / min</th>
                <th className="px-4 py-3 font-bold">Ukuran klaster</th>
                <th className="px-4 py-3 font-bold">Dilatih</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.model_version} className="border-t border-outline-variant/40 align-top">
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs font-bold text-on-surface">{run.model_version}</div>
                    {run.is_active && (
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-green-50 text-green-800 border-green-300">
                        Aktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant whitespace-nowrap">
                    k={run.k}, n_init={run.n_init}, seed={run.random_state}
                  </td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant whitespace-nowrap">
                    {run.n_samples} ({run.n_unique} unik)
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{formatNumber(run.silhouette)}</td>
                  <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                    {formatNumber(run.ari_mean)} / {formatNumber(run.ari_min)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{run.cluster_sizes.join(' / ')}</td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant whitespace-nowrap">
                    {formatDate(run.trained_at)}
                    <div className="text-[10px]">
                      {run.triggered_by === null ? 'skrip offline' : `oleh pengguna #${run.triggered_by}`}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
