import { NextRequest } from 'next/server';
import { getSingleTodo, updateSingleTodo, deleteSingleTodo } from '@/server/api/todos/todos';

interface Params {
  params: { id: string };
}

// GET /api/todos/:id
export function GET(_req: NextRequest, { params }: Params) {
  return getSingleTodo(params.id);
}

// PUT /api/todos/:id  { text?: string, completed?: boolean }
export async function PUT(req: NextRequest, { params }: Params) {
  return updateSingleTodo(params.id, req);
}

// DELETE /api/todos/:id
export function DELETE(_req: NextRequest, { params }: Params) {
  return deleteSingleTodo(params.id);
}
