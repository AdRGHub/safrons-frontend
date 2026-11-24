import { apiClient } from './axios';
import type {
  JagungRankingRead,
  JagungSuitabilityCollection,
  JagungSuitabilityRead,
  SuitabilityClass,
} from '../types/api.types';

export const jagungService = {
  getJagungArea: async (areaId: number): Promise<JagungSuitabilityRead> => {
    const response = await apiClient.get<JagungSuitabilityRead>(`/api/v1/jagung/areas/${areaId}`);
    return response.data;
  },

  getRanking: async (minClass: SuitabilityClass = 'S3', limit = 50): Promise<JagungRankingRead> => {
    const response = await apiClient.get<JagungRankingRead>('/api/v1/jagung/ranking', {
      params: { min_class: minClass, limit },
    });
    return response.data;
  },

  getSuitabilityLayer: async (): Promise<JagungSuitabilityCollection> => {
    const response = await apiClient.get<JagungSuitabilityCollection>('/api/v1/jagung/suitability');
    return response.data;
  },
};
