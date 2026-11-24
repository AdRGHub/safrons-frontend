import { apiClient } from './axios';
import type {
  ClustersRead,
  ModelRunRead,
  PackageRead,
  PackageUpdate,
  RetrainRequest,
} from '../types/api.types';

export const clusterService = {
  getClusters: async (): Promise<ClustersRead> => {
    const response = await apiClient.get<ClustersRead>('/api/v1/clusters');
    return response.data;
  },

  updatePackage: async (clusterId: number, data: PackageUpdate): Promise<PackageRead> => {
    const response = await apiClient.patch<PackageRead>(
      `/api/v1/expert/clusters/${clusterId}/package`,
      data
    );
    return response.data;
  },

  retrain: async (data: RetrainRequest = {}): Promise<ModelRunRead> => {
    const response = await apiClient.post<ModelRunRead>('/api/v1/admin/clusters/retrain', data);
    return response.data;
  },

  getRuns: async (): Promise<ModelRunRead[]> => {
    const response = await apiClient.get<ModelRunRead[]>('/api/v1/admin/clusters/runs');
    return response.data;
  },
};
