import { NextRequest, NextResponse } from 'next/server';
import { ItemExpenseService } from '@/services/item-expense.service';
import { adaptItemExpenseList } from '@/adapters/item-expense.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new ItemExpenseService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[expenses] GET items request received', { expenseId: id });

  try {
    const data    = await service.getAllByExpense(Number(id));
    const adapted = adaptItemExpenseList(data);

    logger.info('[expenses] GET items completed', { expenseId: id, total: adapted.length });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[expenses] GET items failed', id);
  }
}

function handleError(error: unknown, context: string, expenseId?: string): NextResponse {
  if (error instanceof HttpError) {
    logger.warn(context, { status: error.status, expenseId });
    return NextResponse.json({ error: error.body }, { status: error.status });
  }

  logger.error(context, { error: String(error), expenseId });
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
