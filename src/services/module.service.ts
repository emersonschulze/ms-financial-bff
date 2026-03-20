import { httpGet } from '@/lib/http-client';
import type { ModuleModel } from '@/types/financial.types';

const BASE_URL = process.env.FINANCIAL_PROCESS_URL!;

export class ModuleService {
  async getAll(): Promise<ModuleModel[]> {
    return httpGet<ModuleModel[]>(`${BASE_URL}/api/v1/modules`);
  }
}
