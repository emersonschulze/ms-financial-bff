import { httpGet } from '@/lib/http-client';
import type { ProductUnitOfMeasureModel } from '@/types/financial.types';

const BASE_URL = process.env.FINANCIAL_PROCESS_URL!;

export class ProductUnitOfMeasureService {
  async getAll(): Promise<ProductUnitOfMeasureModel[]> {
    return httpGet<ProductUnitOfMeasureModel[]>(`${BASE_URL}/api/v1/product-unit-of-measures`);
  }
}
