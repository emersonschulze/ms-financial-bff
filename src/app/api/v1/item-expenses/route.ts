import { NextRequest, NextResponse } from 'next/server';
import { ItemExpenseService } from '@/services/item-expense.service';
import { adaptItemExpense } from '@/adapters/item-expense.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { CreateItemExpenseRequest } from '@/types/financial.types';

const service = new ItemExpenseService();

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as CreateItemExpenseRequest;

  logger.info('[item-expenses] POST request received', { expenseId: body.expenseId });

  try {
    const created = await service.create(body);
    const adapted = adaptItemExpense(created);

    logger.info('[item-expenses] POST completed', { id: adapted.id });

    return NextResponse.json(adapted, { status: 201 });
  } catch (error) {
    return handleError(error, '[item-expenses] POST failed');
  }
}

function handleError(error: unknown, context: string): NextResponse {
  if (error instanceof HttpError) {
    logger.warn(context, { status: error.status, url: error.url });
    return NextResponse.json({ error: error.body }, { status: error.status });
  }

  logger.error(context, { error: String(error) });
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
