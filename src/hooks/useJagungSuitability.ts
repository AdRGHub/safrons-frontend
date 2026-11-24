import { useState, useEffect } from 'react';
import { jagungService } from '../services/jagung.service';
import type { GeoJSONFeature, JagungSuitabilityRead } from '../types/api.types';

interface LoadedState {
  feature: GeoJSONFeature | null;
  data: JagungSuitabilityRead | null;
  error: string | null;
}

/**
 * Memuat kelas kesesuaian jagung dan tipe profil hara untuk poligon terpilih.
 * Dimuat ulang setiap kali objek fitur berganti, termasuk setelah expert
 * menyimpan perubahan data hara (kelas dan klaster ikut diperbarui backend).
 * Status loading diturunkan dari fitur terakhir yang selesai dimuat, sehingga
 * effect hanya memanggil setState di dalam callback asinkron.
 */
export function useJagungSuitability(selectedFeature: GeoJSONFeature | null) {
  const [loaded, setLoaded] = useState<LoadedState>({ feature: null, data: null, error: null });

  useEffect(() => {
    if (!selectedFeature) return;
    let isMounted = true;

    jagungService
      .getJagungArea(selectedFeature.properties.id)
      .then((data) => {
        if (isMounted) setLoaded({ feature: selectedFeature, data, error: null });
      })
      .catch((error: unknown) => {
        console.error('Gagal memuat kesesuaian jagung:', error);
        if (isMounted) {
          setLoaded({
            feature: selectedFeature,
            data: null,
            error: 'Kesesuaian jagung tidak dapat dimuat.',
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedFeature]);

  const isCurrent = selectedFeature !== null && loaded.feature === selectedFeature;
  return {
    jagung: isCurrent ? loaded.data : null,
    isJagungLoading: selectedFeature !== null && !isCurrent,
    jagungError: isCurrent ? loaded.error : null,
  };
}
