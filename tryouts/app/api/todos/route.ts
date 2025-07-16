import { NextResponse } from 'next/server';
import { getTodos, addTodo } from '@/lib/todosStore';

// GET /api/todos - list all todos
export async function GET() {
  return NextResponse.json(getTodos());
}

// POST /api/todos - create new todo: { text: string }
export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.text || typeof body.text !== 'string') {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }
  const todo = addTodo(body.text);
  return NextResponse.json(todo, { status: 201 });
}
