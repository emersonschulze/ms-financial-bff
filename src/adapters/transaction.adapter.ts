import type { TransactionModel } from '@/types/financial.types';

// The BFF passes through the transaction shape as-is — no field renames needed.
// The adapter layer exists to isolate the frontend from backend contract changes.

export function adaptTransaction(data: TransactionModel): TransactionModel {
  return data;
}

export function adaptTransactionList(data: TransactionModel[]): TransactionModel[] {
  return data.map(adaptTransaction);
}
