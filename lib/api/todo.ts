import { Todo } from "@prisma/client";
import { Paginated } from "../types/generic";

export async function fetchTodos({
  page = 1,
  pageSize,
  search = "",
}: {
  page?: number;
  pageSize: number;
  search?: string;
}): Promise<Paginated<Todo> & { totalDone: number }> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    search,
  });

  const res = await fetch(`/api/tasks?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch todos");
  }
  return res.json();
}

export async function createTodo({ title }: { title: string }): Promise<Todo> {
  const res = await fetch(`/api/tasks`, {
    method: "POST",
    body: JSON.stringify({
      title,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create todo");
  }
  return res.json();
}

export async function updateTodo(
  id: string,
  { done }: { done: boolean }
): Promise<Todo> {
  const res = await fetch(`/api/tasks`, {
    method: "PATCH",
    body: JSON.stringify({
      id,
      done,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to patch todo");
  }
  return res.json();
}

export async function deleteTodo(id: string) {
  const res = await fetch(`/api/tasks?${new URLSearchParams({ id })}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete todo");
  }
  return res.json();
}
