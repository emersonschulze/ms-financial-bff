import type { ProductUnitOfMeasureModel } from '@/types/financial.types';

export function adaptProductUnitOfMeasure(data: ProductUnitOfMeasureModel): ProductUnitOfMeasureModel { return data; }
export function adaptProductUnitOfMeasureList(data: ProductUnitOfMeasureModel[]): ProductUnitOfMeasureModel[] { return data.map(adaptProductUnitOfMeasure); }
