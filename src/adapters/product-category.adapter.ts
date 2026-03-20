import type { ProductCategoryModel } from '@/types/financial.types';

export function adaptProductCategory(data: ProductCategoryModel): ProductCategoryModel { return data; }
export function adaptProductCategoryList(data: ProductCategoryModel[]): ProductCategoryModel[] { return data.map(adaptProductCategory); }
