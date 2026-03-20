import { httpGet, httpPatch, httpPost, httpPut } from '@/lib/http-client';
import type { MaintenanceServiceModel, CreateMaintenanceServiceRequest, UpdateMaintenanceServiceRequest } from '@/types/financial.types';

const BASE_URL = process.env.FINANCIAL_PROCESS_URL!;

export class MaintenanceServiceService {
  async getAll(): Promise<MaintenanceServiceModel[]> {
    return httpGet<MaintenanceServiceModel[]>(`${BASE_URL}/api/v1/maintenance-services`);
  }

  async getById(id: number): Promise<MaintenanceServiceModel> {
    return httpGet<MaintenanceServiceModel>(`${BASE_URL}/api/v1/maintenance-services/${id}`);
  }

  async create(body: CreateMaintenanceServiceRequest): Promise<MaintenanceServiceModel> {
    return httpPost<MaintenanceServiceModel>(`${BASE_URL}/api/v1/maintenance-services`, body);
  }

  async update(id: number, body: UpdateMaintenanceServiceRequest): Promise<MaintenanceServiceModel> {
    return httpPut<MaintenanceServiceModel>(`${BASE_URL}/api/v1/maintenance-services/${id}`, body);
  }

  async inactivate(id: number): Promise<MaintenanceServiceModel> {
    return httpPatch<MaintenanceServiceModel>(`${BASE_URL}/api/v1/maintenance-services/${id}/inactivate`);
  }
}
