import type { TypeExpenseModel } from '@/types/financial.types';

export function adaptTypeExpense(data: TypeExpenseModel): TypeExpenseModel { return data; }
export function adaptTypeExpenseList(data: TypeExpenseModel[]): TypeExpenseModel[] { return data.map(adaptTypeExpense); }
