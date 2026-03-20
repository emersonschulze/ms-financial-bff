import type { ItemExpenseModel } from '@/types/financial.types';

export function adaptItemExpense(data: ItemExpenseModel): ItemExpenseModel { return data; }
export function adaptItemExpenseList(data: ItemExpenseModel[]): ItemExpenseModel[] { return data.map(adaptItemExpense); }
