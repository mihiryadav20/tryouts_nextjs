import { NextResponse, NextRequest } from 'next/server';
import { getTodo, updateTodo, deleteTodo } from '@/lib/todosStore';

interface Params {
  params: { id: string };
}

// GET /api/todos/:id
export function GET(_req: NextRequest, { params }: Params) {
  const todo = getTodo(params.id);
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(todo);
}

// PUT /api/todos/:id  { text?: string, completed?: boolean }
export async function PUT(req: NextRequest, { params }: Params) {
  const body = await req.json();
  const updated = updateTodo(params.id, body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/todos/:id
export function DELETE(_req: NextRequest, { params }: Params) {
  const ok = deleteTodo(params.id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
