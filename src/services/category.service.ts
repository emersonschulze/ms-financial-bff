import { httpDelete, httpGet, httpPost, httpPut } from '@/lib/http-client';
import type { CategoryModel, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/financial.types';

const BASE_URL = process.env.FINANCIAL_PROCESS_URL!;

export class CategoryService {
  async getAll(): Promise<CategoryModel[]> {
    return httpGet<CategoryModel[]>(`${BASE_URL}/api/v1/categories`);
  }

  async getById(id: string): Promise<CategoryModel> {
    return httpGet<CategoryModel>(`${BASE_URL}/api/v1/categories/${id}`);
  }

  async create(body: CreateCategoryRequest): Promise<CategoryModel> {
    return httpPost<CategoryModel>(`${BASE_URL}/api/v1/categories`, body);
  }

  async update(id: string, body: UpdateCategoryRequest): Promise<CategoryModel> {
    return httpPut<CategoryModel>(`${BASE_URL}/api/v1/categories/${id}`, body);
  }

  async delete(id: string): Promise<void> {
    return httpDelete(`${BASE_URL}/api/v1/categories/${id}`);
  }
}
