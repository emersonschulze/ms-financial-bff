import { NextRequest, NextResponse } from 'next/server';
import { TypeExpenseService } from '@/services/type-expense.service';
import { adaptTypeExpenseList, adaptTypeExpense } from '@/adapters/type-expense.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { CreateTypeExpenseRequest } from '@/types/financial.types';

const service = new TypeExpenseService();

export async function GET(): Promise<NextResponse> {
  logger.info('[type-expenses] GET list request received');

  try {
    const data    = await service.getAll();
    const adapted = adaptTypeExpenseList(data);

    logger.info('[type-expenses] GET list completed', { total: adapted.length });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[type-expenses] GET list failed');
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as CreateTypeExpenseRequest;

  logger.info('[type-expenses] POST request received', { description: body.description });

  try {
    const created = await service.create(body);
    const adapted = adaptTypeExpense(created);

    logger.info('[type-expenses] POST completed', { id: adapted.id });

    return NextResponse.json(adapted, { status: 201 });
  } catch (error) {
    return handleError(error, '[type-expenses] POST failed');
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
