import type { ProductModel } from '@/types/financial.types';

export function adaptProduct(data: ProductModel): ProductModel { return data; }
export function adaptProductList(data: ProductModel[]): ProductModel[] { return data.map(adaptProduct); }
