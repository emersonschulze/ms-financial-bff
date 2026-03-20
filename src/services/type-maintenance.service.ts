import { httpGet } from '@/lib/http-client';
import type { TypeMaintenanceModel } from '@/types/financial.types';

const BASE_URL = process.env.FINANCIAL_PROCESS_URL!;

export class TypeMaintenanceService {
  async getAll(): Promise<TypeMaintenanceModel[]> {
    return httpGet<TypeMaintenanceModel[]>(`${BASE_URL}/api/v1/type-maintenances`);
  }
}
