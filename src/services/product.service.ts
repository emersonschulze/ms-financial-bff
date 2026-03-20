import { httpGet, httpPatch, httpPost, httpPut } from '@/lib/http-client';
import type { ProductModel, CreateProductRequest, UpdateProductRequest } from '@/types/financial.types';

const BASE_URL = process.env.FINANCIAL_PROCESS_URL!;

export class ProductService {
  async getAll(): Promise<ProductModel[]> {
    return httpGet<ProductModel[]>(`${BASE_URL}/api/v1/products`);
  }

  async getById(id: number): Promise<ProductModel> {
    return httpGet<ProductModel>(`${BASE_URL}/api/v1/products/${id}`);
  }

  async create(body: CreateProductRequest): Promise<ProductModel> {
    return httpPost<ProductModel>(`${BASE_URL}/api/v1/products`, body);
  }

  async update(id: number, body: UpdateProductRequest): Promise<ProductModel> {
    return httpPut<ProductModel>(`${BASE_URL}/api/v1/products/${id}`, body);
  }

  async inactivate(id: number): Promise<ProductModel> {
    return httpPatch<ProductModel>(`${BASE_URL}/api/v1/products/${id}/inactivate`);
  }
}
