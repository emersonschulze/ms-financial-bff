import type { CategoryModel } from '@/types/financial.types';

// The BFF passes through the category shape as-is — no field renames needed.
// The adapter layer exists to isolate the frontend from backend contract changes.

export function adaptCategory(data: CategoryModel): CategoryModel {
  return data;
}

export function adaptCategoryList(data: CategoryModel[]): CategoryModel[] {
  return data.map(adaptCategory);
}
