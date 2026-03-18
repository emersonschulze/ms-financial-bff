import { httpDelete, httpGet, httpPost, httpPut } from '@/lib/http-client';
import type { AccountModel, CreateAccountRequest, UpdateAccountRequest } from '@/types/financial.types';

const BASE_URL = process.env.FINANCIAL_PROCESS_URL!;

export class AccountService {
  async getAll(): Promise<AccountModel[]> {
    return httpGet<AccountModel[]>(`${BASE_URL}/api/v1/accounts`);
  }

  async getById(id: string): Promise<AccountModel> {
    return httpGet<AccountModel>(`${BASE_URL}/api/v1/accounts/${id}`);
  }

  async create(body: CreateAccountRequest): Promise<AccountModel> {
    return httpPost<AccountModel>(`${BASE_URL}/api/v1/accounts`, body);
  }

  async update(id: string, body: UpdateAccountRequest): Promise<AccountModel> {
    return httpPut<AccountModel>(`${BASE_URL}/api/v1/accounts/${id}`, body);
  }

  async delete(id: string): Promise<void> {
    return httpDelete(`${BASE_URL}/api/v1/accounts/${id}`);
  }
}
