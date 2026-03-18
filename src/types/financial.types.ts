export interface AccountModel {
  id: string;
  name: string;
  type: number;          // 1=Checking, 2=Savings, 3=Cash, 4=Credit
  balance: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryModel {
  id: number;
  name: string;
  type: number;          // 1=Income, 2=Expense
  description: string | null;
  createdAt: string;
}

export interface TransactionModel {
  id: string;
  accountId: string;
  accountName: string | null;
  categoryId: number;
  categoryName: string | null;
  description: string;
  amount: number;
  type: number;          // 1=Income, 2=Expense
  date: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountRequest { name: string; type: number; balance: number; description: string | null; }
export interface UpdateAccountRequest { name: string; type: number; description: string | null; }
export interface CreateCategoryRequest { name: string; type: number; description: string | null; }
export interface UpdateCategoryRequest { name: string; type: number; description: string | null; }
export interface CreateTransactionRequest { accountId: string; categoryId: number; description: string; amount: number; type: number; date: string; notes: string | null; }
export interface UpdateTransactionRequest { accountId: string; categoryId: number; description: string; amount: number; type: number; date: string; notes: string | null; }
