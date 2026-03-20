import { NextResponse } from 'next/server';
import { ProductUnitOfMeasureService } from '@/services/product-unit-of-measure.service';
import { adaptProductUnitOfMeasureList } from '@/adapters/product-unit-of-measure.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new ProductUnitOfMeasureService();

export async function GET(): Promise<NextResponse> {
  logger.info('[product-unit-of-measures] GET list request received');

  try {
    const data    = await service.getAll();
    const adapted = adaptProductUnitOfMeasureList(data);

    logger.info('[product-unit-of-measures] GET list completed', { total: adapted.length });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[product-unit-of-measures] GET list failed');
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
