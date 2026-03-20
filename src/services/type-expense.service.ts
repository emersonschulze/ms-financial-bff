import { httpGet, httpPatch, httpPost, httpPut } from '@/lib/http-client';
import type { TypeExpenseModel, CreateTypeExpenseRequest, UpdateTypeExpenseRequest } from '@/types/financial.types';

const BASE_URL = process.env.FINANCIAL_PROCESS_URL!;

export class TypeExpenseService {
  async getAll(): Promise<TypeExpenseModel[]> {
    return httpGet<TypeExpenseModel[]>(`${BASE_URL}/api/v1/type-expenses`);
  }

  async getById(id: number): Promise<TypeExpenseModel> {
    return httpGet<TypeExpenseModel>(`${BASE_URL}/api/v1/type-expenses/${id}`);
  }

  async create(body: CreateTypeExpenseRequest): Promise<TypeExpenseModel> {
    return httpPost<TypeExpenseModel>(`${BASE_URL}/api/v1/type-expenses`, body);
  }

  async update(id: number, body: UpdateTypeExpenseRequest): Promise<TypeExpenseModel> {
    return httpPut<TypeExpenseModel>(`${BASE_URL}/api/v1/type-expenses/${id}`, body);
  }

  async inactivate(id: number): Promise<TypeExpenseModel> {
    return httpPatch<TypeExpenseModel>(`${BASE_URL}/api/v1/type-expenses/${id}/inactivate`);
  }
}
