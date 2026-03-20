import { NextRequest, NextResponse } from 'next/server';
import { ExpenseService } from '@/services/expense.service';
import { adaptExpenseList, adaptExpense } from '@/adapters/expense.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { CreateExpenseRequest } from '@/types/financial.types';

const service = new ExpenseService();

export async function GET(): Promise<NextResponse> {
  logger.info('[expenses] GET list request received');

  try {
    const data    = await service.getAll();
    const adapted = adaptExpenseList(data);

    logger.info('[expenses] GET list completed', { total: adapted.length });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[expenses] GET list failed');
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as CreateExpenseRequest;

  logger.info('[expenses] POST request received', { codeExpense: body.codeExpense });

  try {
    const created = await service.create(body);
    const adapted = adaptExpense(created);

    logger.info('[expenses] POST completed', { id: adapted.id });

    return NextResponse.json(adapted, { status: 201 });
  } catch (error) {
    return handleError(error, '[expenses] POST failed');
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
