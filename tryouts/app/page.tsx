"use client";
import { useEffect, useState } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newText, setNewText] = useState("");

  // Fetch all todos on mount
  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    fetch("/api/todos")
      .then((res) => res.json())
      .then(setTodos)
      .catch(console.error);
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const text = newText.trim();
    if (!text) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setNewText("");
    refresh();
  }

  async function toggleComplete(todo: Todo) {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    refresh();
  }

  async function editTodo(todo: Todo) {
    const text = prompt("Edit todo", todo.text);
    if (text === null) return; // cancelled
    await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    refresh();
  }

  async function removeTodo(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Next.js Todo List</h1>

      {/* Add */}
      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-grow border rounded px-3 py-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      {/* List */}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between border rounded px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo)}
              />
              <span
                className={
                  "cursor-pointer " +
                  (todo.completed ? "line-through text-gray-500" : "")
                }
                onDoubleClick={() => editTodo(todo)}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => removeTodo(todo.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
