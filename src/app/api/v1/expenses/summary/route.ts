import { NextRequest, NextResponse } from 'next/server';
import { ExpenseService } from '@/services/expense.service';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new ExpenseService();

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const farmId = searchParams.get('farmId') ?? undefined;

  logger.info('[expenses/summary] GET request received', { farmId });

  try {
    const result = await service.getSummary(farmId);
    logger.info('[expenses/summary] GET completed');
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof HttpError) {
      logger.warn('[expenses/summary] GET failed', { status: error.status });
      return NextResponse.json({ error: error.body }, { status: error.status });
    }
    logger.error('[expenses/summary] GET failed', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
