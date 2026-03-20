import { NextRequest, NextResponse } from 'next/server';
import { ProductCategoryService } from '@/services/product-category.service';
import { adaptProductCategoryList, adaptProductCategory } from '@/adapters/product-category.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { CreateProductCategoryRequest } from '@/types/financial.types';

const service = new ProductCategoryService();

export async function GET(): Promise<NextResponse> {
  logger.info('[product-categories] GET list request received');

  try {
    const data    = await service.getAll();
    const adapted = adaptProductCategoryList(data);

    logger.info('[product-categories] GET list completed', { total: adapted.length });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[product-categories] GET list failed');
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as CreateProductCategoryRequest;

  logger.info('[product-categories] POST request received', { description: body.description });

  try {
    const created = await service.create(body);
    const adapted = adaptProductCategory(created);

    logger.info('[product-categories] POST completed', { id: adapted.id });

    return NextResponse.json(adapted, { status: 201 });
  } catch (error) {
    return handleError(error, '[product-categories] POST failed');
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
