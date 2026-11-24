import React from 'react';
import { BeakerIcon } from '@heroicons/react/24/outline';
import type { NutrientProfile } from '../../types/api.types';

interface NutrientProfileSectionProps {
  profile: NutrientProfile | null;
  isLoading: boolean;
}

export const NutrientProfileSection: React.FC<NutrientProfileSectionProps> = ({
  profile,
  isLoading,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-on-surface flex items-center gap-2">
        <span className={`w-1.5 h-6 bg-secondary rounded-full ${isLoading ? 'animate-pulse' : ''}`}></span>
        Tipe Profil Hara
      </h3>

      {isLoading && (
        <div className="h-28 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl animate-pulse" />
      )}

      {!isLoading && !profile && (
        <p className="text-sm text-on-surface-variant bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-4">
          Tipe profil hara belum tersedia untuk lahan ini.
        </p>
      )}

      {!isLoading && profile && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/50 p-4 space-y-3">
          <div className="flex items-start gap-2">
            <BeakerIcon className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-sm font-display font-bold text-on-surface">
                {profile.profile_name}
              </span>
              <span className="text-[10px] text-on-surface-variant">
                Klaster {profile.cluster_id} · model {profile.model_version}
              </span>
            </div>
          </div>

          {profile.package && (
            <div className="border-t border-outline-variant/30 pt-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-on-surface">Paket Pemupukan</span>
                {profile.package.is_draft ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-800 border-amber-300">
                    Draf · menunggu validasi pakar
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-green-50 text-green-800 border-green-300">
                    Divalidasi pakar
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-on-surface">{profile.package.title}</p>
              <p className="text-xs text-on-surface-variant whitespace-pre-line leading-relaxed">
                {profile.package.content}
              </p>
            </div>
          )}

          <p className="text-[10px] text-on-surface-variant leading-relaxed">
            Tipe profil menggambarkan pola hara untuk memilih paket pemupukan, bukan tingkat
            kesuburan, dan tidak memengaruhi kelas kesesuaian jagung.
          </p>
        </div>
      )}
    </div>
  );
};
