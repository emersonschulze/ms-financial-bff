import { NextRequest, NextResponse } from 'next/server';
import { TransactionService } from '@/services/transaction.service';
import { adaptTransactionList, adaptTransaction } from '@/adapters/transaction.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { CreateTransactionRequest } from '@/types/financial.types';

const service = new TransactionService();

export async function GET(): Promise<NextResponse> {
  logger.info('[transactions] GET list request received');

  try {
    const data    = await service.getAll();
    const adapted = adaptTransactionList(data);

    logger.info('[transactions] GET list completed', { total: adapted.length });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[transactions] GET list failed');
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as CreateTransactionRequest;

  logger.info('[transactions] POST request received', { description: body.description });

  try {
    const created = await service.create(body);
    const adapted = adaptTransaction(created);

    logger.info('[transactions] POST completed', { id: adapted.id });

    return NextResponse.json(adapted, { status: 201 });
  } catch (error) {
    return handleError(error, '[transactions] POST failed');
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
