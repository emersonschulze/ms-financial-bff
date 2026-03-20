import type { ExpenseModel } from '@/types/financial.types';

export function adaptExpense(data: ExpenseModel): ExpenseModel { return data; }
export function adaptExpenseList(data: ExpenseModel[]): ExpenseModel[] { return data.map(adaptExpense); }
