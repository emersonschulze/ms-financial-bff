import { httpDelete, httpGet, httpPost, httpPut } from '@/lib/http-client';
import type { ItemExpenseModel, CreateItemExpenseRequest, UpdateItemExpenseRequest } from '@/types/financial.types';

const BASE_URL = process.env.FINANCIAL_PROCESS_URL!;

export class ItemExpenseService {
  async getAllByExpense(expenseId: number): Promise<ItemExpenseModel[]> {
    return httpGet<ItemExpenseModel[]>(`${BASE_URL}/api/v1/expenses/${expenseId}/items`);
  }

  async getById(id: number): Promise<ItemExpenseModel> {
    return httpGet<ItemExpenseModel>(`${BASE_URL}/api/v1/item-expenses/${id}`);
  }

  async create(body: CreateItemExpenseRequest): Promise<ItemExpenseModel> {
    return httpPost<ItemExpenseModel>(`${BASE_URL}/api/v1/item-expenses`, body);
  }

  async update(id: number, body: UpdateItemExpenseRequest): Promise<ItemExpenseModel> {
    return httpPut<ItemExpenseModel>(`${BASE_URL}/api/v1/item-expenses/${id}`, body);
  }

  async delete(id: number): Promise<void> {
    return httpDelete(`${BASE_URL}/api/v1/item-expenses/${id}`);
  }
}
