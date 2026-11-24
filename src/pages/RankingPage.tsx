import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { RankingTable } from '../components/ranking/RankingTable';
import { jagungService } from '../services/jagung.service';
import { clusterService } from '../services/cluster.service';
import { haraService } from '../services/hara.service';
import { useToast } from '../contexts/ToastContext';
import type { JagungRankingRead, RankingItem, SuitabilityClass } from '../types/api.types';
import { SUITABILITY_LABELS } from '../utils/jagungHelper';

const FILTERS: { value: SuitabilityClass; label: string }[] = [
  { value: 'S1', label: 'S1 saja' },
  { value: 'S2', label: 'S1–S2' },
  { value: 'S3', label: 'S1–S3' },
  { value: 'N', label: 'Semua' },
];

interface LoadedRanking {
  minClass: SuitabilityClass;
  data: JagungRankingRead | null;
  error: string | null;
}

export default function RankingPage() {
  const [minClass, setMinClass] = useState<SuitabilityClass>('S3');
  const [loaded, setLoaded] = useState<LoadedRanking | null>(null);
  const [profileNames, setProfileNames] = useState<Map<number, string>>(new Map());
  const [openingAreaId, setOpeningAreaId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    jagungService
      .getRanking(minClass, 200)
      .then((data) => {
        if (isMounted) setLoaded({ minClass, data, error: null });
      })
      .catch((error: unknown) => {
        console.error('Gagal memuat peringkat lahan jagung:', error);
        if (isMounted) {
          setLoaded({ minClass, data: null, error: 'Peringkat lahan tidak dapat dimuat.' });
        }
      });
    return () => {
      isMounted = false;
    };
  }, [minClass]);

  useEffect(() => {
    let isMounted = true;
    clusterService
      .getClusters()
      .then((clusters) => {
        if (isMounted) {
          setProfileNames(new Map(clusters.clusters.map((c) => [c.cluster_id, c.profile_name])));
        }
      })
      .catch((error: unknown) => {
        // Nama profil hanya pelengkap; peringkat tetap tampil dengan nomor klaster.
        console.error('Gagal memuat tipe profil hara:', error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const current = loaded?.minClass === minClass ? loaded : null;
  const isLoading = current === null;
  const summary = useMemo(() => {
    if (!current?.data) return null;
    const counts = new Map<SuitabilityClass, number>();
    for (const item of current.data.items) {
      counts.set(item.potential_class, (counts.get(item.potential_class) ?? 0) + 1);
    }
    return counts;
  }, [current]);

  const showOnMap = async (item: RankingItem) => {
    setOpeningAreaId(item.area_id);
    try {
      const feature = await haraService.getAreaById(item.area_id);
      const center = L.geoJSON(feature.geometry as GeoJSON.GeoJsonObject).getBounds().getCenter();
      void navigate('/dashboard', {
        state: { flyToFeature: feature, flyTo: { lat: center.lat, lon: center.lng } },
      });
    } catch (error) {
      console.error('Gagal membuka lahan di peta:', error);
      showToast('Lahan tidak dapat dibuka di peta.', 'error');
      setOpeningAreaId(null);
    }
  };

  return (
    <div className="h-full bg-surface-dim p-4 md:p-10 overflow-y-auto pb-24 pointer-events-auto relative z-20">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-on-surface tracking-tight flex items-center gap-3">
            <TrophyIcon className="w-9 h-9 text-primary" />
            Peringkat Lahan Jagung
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm md:text-base max-w-3xl">
            Lahan diurutkan menurut kelas potensial, lalu kelas aktual, jumlah faktor yang perlu
            diperbaiki, dan luas. Kelas mengikuti kriteria Juknis Evaluasi Lahan (Ritung dkk. 2011).
            Setiap baris adalah satu satuan peta tanah, bukan petak kebun.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mr-1">
            Kelas potensial:
          </span>
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setMinClass(filter.value)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                minClass === filter.value
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-bright text-on-surface border-outline-variant hover:border-primary/50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {current?.data && summary && (
          <div className="flex flex-wrap gap-2 text-xs text-on-surface-variant">
            <span className="font-semibold text-on-surface">
              {current.data.total_candidates} lahan
            </span>
            {(['S1', 'S2', 'S3', 'N'] as SuitabilityClass[])
              .filter((value) => summary.has(value))
              .map((value) => (
                <span key={value}>
                  · {value} {SUITABILITY_LABELS[value]}: {summary.get(value)}
                </span>
              ))}
            <span>· kriteria {current.data.rule_set_version}</span>
          </div>
        )}

        {isLoading && (
          <div className="h-64 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl animate-pulse" />
        )}

        {current?.error && (
          <div className="bg-error/10 text-error p-4 rounded-xl font-medium">{current.error}</div>
        )}

        {current?.data?.items.length === 0 && (
          <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant text-on-surface-variant">
            Tidak ada lahan dengan kelas potensial ini.
          </div>
        )}

        {current?.data && current.data.items.length > 0 && (
          <RankingTable
            items={current.data.items}
            profileNames={profileNames}
            onShowOnMap={(item) => void showOnMap(item)}
            openingAreaId={openingAreaId}
          />
        )}

        <p className="text-[11px] text-on-surface-variant">
          Faktor pembatas oranye dapat diperbaiki (pemupukan, pengapuran, saluran drainase); merah
          bersifat permanen. Tipe profil hara dipakai untuk memilih paket pemupukan dan tidak
          memengaruhi urutan.
        </p>
      </div>
    </div>
  );
}
