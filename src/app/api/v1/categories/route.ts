import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/services/category.service';
import { adaptCategoryList, adaptCategory } from '@/adapters/category.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { CreateCategoryRequest } from '@/types/financial.types';

const service = new CategoryService();

export async function GET(): Promise<NextResponse> {
  logger.info('[categories] GET list request received');

  try {
    const data    = await service.getAll();
    const adapted = adaptCategoryList(data);

    logger.info('[categories] GET list completed', { total: adapted.length });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[categories] GET list failed');
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as CreateCategoryRequest;

  logger.info('[categories] POST request received', { name: body.name });

  try {
    const created = await service.create(body);
    const adapted = adaptCategory(created);

    logger.info('[categories] POST completed', { id: adapted.id });

    return NextResponse.json(adapted, { status: 201 });
  } catch (error) {
    return handleError(error, '[categories] POST failed');
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
