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

// ── Module ────────────────────────────────────────────────────────────────────
export interface ModuleModel { id: number; description: string; }

// ── TypeExpense ────────────────────────────────────────────────────────────────
export interface TypeExpenseModel {
  id:                number;
  description:       string;
  moduleId:          number;
  moduleDescription: string;
  isActive:          boolean;
}
export interface CreateTypeExpenseRequest { description: string; moduleId: number; }
export interface UpdateTypeExpenseRequest { description?: string; moduleId?: number; }

// ── TypeMaintenance ────────────────────────────────────────────────────────────
export interface TypeMaintenanceModel { id: number; description: string; }

// ── ProductUnitOfMeasure ───────────────────────────────────────────────────────
export interface ProductUnitOfMeasureModel { id: number; description: string; symbol: string; }

// ── ProductCategory ────────────────────────────────────────────────────────────
export interface ProductCategoryModel { id: number; description: string; }
export interface CreateProductCategoryRequest { description: string; }
export interface UpdateProductCategoryRequest { description?: string; }

// ── Product ────────────────────────────────────────────────────────────────────
export interface ProductModel {
  id:                              number;
  description:                     string;
  productCategoryId:               number;
  productCategoryDescription:      string;
  productUnitOfMeasureId:          number;
  productUnitOfMeasureDescription: string;
  productUnitOfMeasureSymbol:      string;
  isActive:                        boolean;
}
export interface CreateProductRequest { description: string; productCategoryId: number; productUnitOfMeasureId: number; }
export interface UpdateProductRequest { description?: string; productCategoryId?: number; productUnitOfMeasureId?: number; }

// ── Expense ────────────────────────────────────────────────────────────────────
export interface ExpenseModel {
  id:                     number;
  codeExpense:            string;
  description:            string;
  typeExpenseId:          number;
  typeExpenseDescription: string;
  farmId:                 string;
  purchaseDate:           string;
  dueDate:                string;
  isPaid:                 boolean;
  totalAmount:            number;
}
export interface CreateExpenseRequest { codeExpense: string; description: string; typeExpenseId: number; farmId: string; purchaseDate: string; dueDate: string; }
export interface UpdateExpenseRequest { codeExpense?: string; description?: string; typeExpenseId?: number; farmId?: string; purchaseDate?: string; dueDate?: string; }

// ── ItemExpense ────────────────────────────────────────────────────────────────
export interface ItemExpenseModel {
  id:                 number;
  expenseId:          number;
  quantity:           number;
  unitPrice:          number;
  totalPrice:         number;
  productId:          number;
  productDescription: string;
}
export interface CreateItemExpenseRequest { expenseId: number; quantity: number; unitPrice: number; totalPrice: number; productId: number; }
export interface UpdateItemExpenseRequest { quantity?: number; unitPrice?: number; totalPrice?: number; productId?: number; }

// ── PaymentHistory ─────────────────────────────────────────────────────────────
export interface PaymentHistoryModel {
  id:            number;
  expenseId:     number;
  paymentMethod: string;
  paidAmount:    number;
  paymentDate:   string;
  createdAt:     string;
}
export interface MarkExpenseAsPaidRequest {
  paymentMethod: string;  // "cash" | "card" | "check"
  paidAmount:    number;
  paymentDate:   string;  // ISO date string
}

// ── ExpenseSummary ─────────────────────────────────────────────────────────────
export interface ExpenseSummaryBucket { count: number; totalAmount: number; }
export interface ExpenseSummaryModel {
  due5Days:  ExpenseSummaryBucket;
  due30Days: ExpenseSummaryBucket;
  overdue:   ExpenseSummaryBucket;
}

// ── MaintenanceService ─────────────────────────────────────────────────────────
export interface MaintenanceServiceModel {
  id:                         number;
  description:                string;
  typeMaintenanceId:          number;
  typeMaintenanceDescription: string;
  isActive:                   boolean;
}
export interface CreateMaintenanceServiceRequest { description: string; typeMaintenanceId: number; }
export interface UpdateMaintenanceServiceRequest { description?: string; typeMaintenanceId?: number; }
