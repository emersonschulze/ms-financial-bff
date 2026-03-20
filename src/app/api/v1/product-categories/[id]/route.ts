import { NextRequest, NextResponse } from 'next/server';
import { ProductCategoryService } from '@/services/product-category.service';
import { adaptProductCategory } from '@/adapters/product-category.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { UpdateProductCategoryRequest } from '@/types/financial.types';

const service = new ProductCategoryService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[product-categories] GET by id request received', { id });

  try {
    const data    = await service.getById(Number(id));
    const adapted = adaptProductCategory(data);

    logger.info('[product-categories] GET by id completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[product-categories] GET by id failed', id);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body   = (await request.json()) as UpdateProductCategoryRequest;

  logger.info('[product-categories] PUT request received', { id });

  try {
    const updated = await service.update(Number(id), body);
    const adapted = adaptProductCategory(updated);

    logger.info('[product-categories] PUT completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[product-categories] PUT failed', id);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[product-categories] DELETE request received', { id });

  try {
    await service.delete(Number(id));

    logger.info('[product-categories] DELETE completed', { id });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error, '[product-categories] DELETE failed', id);
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
