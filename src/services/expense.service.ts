import { httpDelete, httpGet, httpPost, httpPut } from '@/lib/http-client';
import type { ExpenseModel, CreateExpenseRequest, UpdateExpenseRequest } from '@/types/financial.types';

const BASE_URL = process.env.FINANCIAL_PROCESS_URL!;

export class ExpenseService {
  async getAll(): Promise<ExpenseModel[]> {
    return httpGet<ExpenseModel[]>(`${BASE_URL}/api/v1/expenses`);
  }

  async getById(id: number): Promise<ExpenseModel> {
    return httpGet<ExpenseModel>(`${BASE_URL}/api/v1/expenses/${id}`);
  }

  async create(body: CreateExpenseRequest): Promise<ExpenseModel> {
    return httpPost<ExpenseModel>(`${BASE_URL}/api/v1/expenses`, body);
  }

  async update(id: number, body: UpdateExpenseRequest): Promise<ExpenseModel> {
    return httpPut<ExpenseModel>(`${BASE_URL}/api/v1/expenses/${id}`, body);
  }

  async delete(id: number): Promise<void> {
    return httpDelete(`${BASE_URL}/api/v1/expenses/${id}`);
  }
}
