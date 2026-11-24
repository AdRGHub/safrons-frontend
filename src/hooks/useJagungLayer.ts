import { useEffect, useMemo, useState } from 'react';
import { jagungService } from '../services/jagung.service';
import type { MapFilterType } from '../layouts/DashboardLayout';
import type { JagungSuitabilityProperties, SuitabilityClass } from '../types/api.types';

interface LoadedLayer {
  version: number;
  properties: JagungSuitabilityProperties[];
}

/**
 * Memuat lapisan kesesuaian jagung saat filter "JAGUNG" aktif.
 * `version` dinaikkan setelah expert mengubah lahan agar kelas dimuat ulang.
 * Mengembalikan peta area_id -> kelas potensial untuk pewarnaan poligon.
 */
export function useJagungLayer(activeFilter: MapFilterType, version: number) {
  const [loaded, setLoaded] = useState<LoadedLayer | null>(null);
  const [failedVersion, setFailedVersion] = useState<number | null>(null);
  const isActive = activeFilter === 'JAGUNG';

  useEffect(() => {
    if (!isActive || loaded?.version === version) return;
    let isMounted = true;
    jagungService
      .getSuitabilityLayer(version)
      .then((collection) => {
        if (isMounted) {
          setLoaded({ version, properties: collection.features.map((f) => f.properties) });
        }
      })
      .catch((error: unknown) => {
        console.error('Gagal memuat lapisan kesesuaian jagung:', error);
        if (isMounted) setFailedVersion(version);
      });
    return () => {
      isMounted = false;
    };
  }, [isActive, version, loaded?.version]);

  const potentialClasses = useMemo(() => {
    const classes = new Map<number, SuitabilityClass | null>();
    for (const item of loaded?.properties ?? []) {
      classes.set(item.id, item.potential_class);
    }
    return classes;
  }, [loaded]);

  return {
    potentialClasses: isActive ? potentialClasses : null,
    isJagungLayerLoading: isActive && loaded?.version !== version && failedVersion !== version,
    jagungLayerError: isActive && failedVersion === version,
  };
}
