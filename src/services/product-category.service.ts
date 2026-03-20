import { httpDelete, httpGet, httpPost, httpPut } from '@/lib/http-client';
import type { ProductCategoryModel, CreateProductCategoryRequest, UpdateProductCategoryRequest } from '@/types/financial.types';

const BASE_URL = process.env.FINANCIAL_PROCESS_URL!;

export class ProductCategoryService {
  async getAll(): Promise<ProductCategoryModel[]> {
    return httpGet<ProductCategoryModel[]>(`${BASE_URL}/api/v1/product-categories`);
  }

  async getById(id: number): Promise<ProductCategoryModel> {
    return httpGet<ProductCategoryModel>(`${BASE_URL}/api/v1/product-categories/${id}`);
  }

  async create(body: CreateProductCategoryRequest): Promise<ProductCategoryModel> {
    return httpPost<ProductCategoryModel>(`${BASE_URL}/api/v1/product-categories`, body);
  }

  async update(id: number, body: UpdateProductCategoryRequest): Promise<ProductCategoryModel> {
    return httpPut<ProductCategoryModel>(`${BASE_URL}/api/v1/product-categories/${id}`, body);
  }

  async delete(id: number): Promise<void> {
    return httpDelete(`${BASE_URL}/api/v1/product-categories/${id}`);
  }
}
