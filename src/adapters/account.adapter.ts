import type { AccountModel } from '@/types/financial.types';

// The BFF passes through the account shape as-is — no field renames needed.
// The adapter layer exists to isolate the frontend from backend contract changes.

export function adaptAccount(data: AccountModel): AccountModel {
  return data;
}

export function adaptAccountList(data: AccountModel[]): AccountModel[] {
  return data.map(adaptAccount);
}
