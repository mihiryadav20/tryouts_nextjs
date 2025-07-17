import { NextRequest } from 'next/server';
import { getAllTodos, createTodo } from '@/server/api/todos/todos';

// GET /api/todos - list all todos
export async function GET() {
  return getAllTodos();
}

// POST /api/todos - create new todo: { text: string }
export async function POST(request: NextRequest) {
  return createTodo(request);
}
