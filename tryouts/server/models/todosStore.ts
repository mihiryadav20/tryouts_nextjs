import { Todo } from './Todo';

const todos: Todo[] = [];

export function getTodos(): Todo[] {
  return todos;
}

export function getTodo(id: string): Todo | undefined {
  return todos.find((t) => t.id === id);
}

export function addTodo(text: string): Todo {
  const todo: Todo = {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
  };
  todos.push(todo);
  return todo;
}

export function updateTodo(
  id: string,
  data: Partial<Omit<Todo, "id">>
): Todo | undefined {
  const todo = getTodo(id);
  if (!todo) return;
  Object.assign(todo, data);
  return todo;
}

export function deleteTodo(id: string): boolean {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}
