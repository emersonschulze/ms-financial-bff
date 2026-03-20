import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/product.service';
import { adaptProduct } from '@/adapters/product.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { UpdateProductRequest } from '@/types/financial.types';

const service = new ProductService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[products] GET by id request received', { id });

  try {
    const data    = await service.getById(Number(id));
    const adapted = adaptProduct(data);

    logger.info('[products] GET by id completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[products] GET by id failed', id);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body   = (await request.json()) as UpdateProductRequest;

  logger.info('[products] PUT request received', { id });

  try {
    const updated = await service.update(Number(id), body);
    const adapted = adaptProduct(updated);

    logger.info('[products] PUT completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[products] PUT failed', id);
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
