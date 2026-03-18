import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/services/category.service';
import { adaptCategory } from '@/adapters/category.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { UpdateCategoryRequest } from '@/types/financial.types';

const service = new CategoryService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[categories] GET by id request received', { id });

  try {
    const data    = await service.getById(id);
    const adapted = adaptCategory(data);

    logger.info('[categories] GET by id completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[categories] GET by id failed', id);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body   = (await request.json()) as UpdateCategoryRequest;

  logger.info('[categories] PUT request received', { id });

  try {
    const updated = await service.update(id, body);
    const adapted = adaptCategory(updated);

    logger.info('[categories] PUT completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[categories] PUT failed', id);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[categories] DELETE request received', { id });

  try {
    await service.delete(id);

    logger.info('[categories] DELETE completed', { id });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error, '[categories] DELETE failed', id);
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
