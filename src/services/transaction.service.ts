import { httpDelete, httpGet, httpPost, httpPut } from '@/lib/http-client';
import type { TransactionModel, CreateTransactionRequest, UpdateTransactionRequest } from '@/types/financial.types';

const BASE_URL = process.env.FINANCIAL_PROCESS_URL!;

export class TransactionService {
  async getAll(): Promise<TransactionModel[]> {
    return httpGet<TransactionModel[]>(`${BASE_URL}/api/v1/transactions`);
  }

  async getById(id: string): Promise<TransactionModel> {
    return httpGet<TransactionModel>(`${BASE_URL}/api/v1/transactions/${id}`);
  }

  async create(body: CreateTransactionRequest): Promise<TransactionModel> {
    return httpPost<TransactionModel>(`${BASE_URL}/api/v1/transactions`, body);
  }

  async update(id: string, body: UpdateTransactionRequest): Promise<TransactionModel> {
    return httpPut<TransactionModel>(`${BASE_URL}/api/v1/transactions/${id}`, body);
  }

  async delete(id: string): Promise<void> {
    return httpDelete(`${BASE_URL}/api/v1/transactions/${id}`);
  }
}
