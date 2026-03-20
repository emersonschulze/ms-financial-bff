import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/product.service';
import { adaptProduct } from '@/adapters/product.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new ProductService();

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[products] PATCH inactivate request received', { id });

  try {
    const updated = await service.inactivate(Number(id));
    const adapted = adaptProduct(updated);

    logger.info('[products] PATCH inactivate completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[products] PATCH inactivate failed', id);
  }
}

function handleError(error: unknown, context: string, id?: string): NextResponse {
  if (error instanceof HttpError) {
    logger.warn(context, { status: error.status, id });
    return NextResponse.json({ error: error.body }, { status: error.status });
  }

  logger.error(context, { error: String(error), id });
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
