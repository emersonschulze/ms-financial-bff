import { NextRequest, NextResponse } from 'next/server';
import { ExpenseService } from '@/services/expense.service';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { MarkExpenseAsPaidRequest } from '@/types/financial.types';

const service = new ExpenseService();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body   = (await request.json()) as MarkExpenseAsPaidRequest;

  logger.info('[expenses/pay] POST request received', { id });

  try {
    const result = await service.pay(Number(id), body);
    logger.info('[expenses/pay] POST completed', { id });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof HttpError) {
      logger.warn('[expenses/pay] POST failed', { status: error.status, id });
      return NextResponse.json({ error: error.body }, { status: error.status });
    }
    logger.error('[expenses/pay] POST failed', { error: String(error), id });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
