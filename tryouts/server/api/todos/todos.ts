import { NextRequest, NextResponse } from 'next/server';
import { getTodos, addTodo, getTodo, updateTodo, deleteTodo } from '../../models/todosStore';

export function getAllTodos() {
  return NextResponse.json(getTodos());
}

export async function createTodo(request: NextRequest) {
  const body = await request.json();
  if (!body?.text || typeof body.text !== 'string') {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }
  const todo = addTodo(body.text);
  return NextResponse.json(todo, { status: 201 });
}

export function getSingleTodo(id: string) {
  const todo = getTodo(id);
  if (!todo) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }
  return NextResponse.json(todo);
}

export async function updateSingleTodo(id: string, request: NextRequest) {
  const body = await request.json();
  const updatedTodo = updateTodo(id, body);
  if (!updatedTodo) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }
  return NextResponse.json(updatedTodo);
}

export function deleteSingleTodo(id: string) {
  const deleted = deleteTodo(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
