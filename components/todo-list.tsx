"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import type { Todo } from "@prisma/client";
import { createTodo, fetchTodos } from "@/lib/api/todo";
import { TodoListSkeleton } from "@/components/todo-skeleton";
import { SearchTodo } from "@/components/search-todo";
import { toast } from "sonner";
import TodoProgress from "./todo-progress";
import TodoItem from "./todo-item";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalDone, setTotalDone] = useState(0);

  const observerRef = useRef<IntersectionObserver>(null);
  const lastTodoElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreTodos();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      await createTodo({
        title: newTodo,
      });

      setNewTodo("");
      setCurrentPage(1);
      setTodos([]);
      await loadTodos(1, true);

      toast.success("Todo created successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create todo"
      );
    }
  };

  const loadTodos = async (page = 1, reset = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const data = await fetchTodos({
        page,
        search: searchQuery || undefined,
        pageSize: 10,
      });

      if (reset || page === 1) {
        setTodos(data.items);
      } else {
        setTodos((prev) => [...prev, ...data.items]);
      }

      setTotalCount(data.total);
      setTotalDone(data.totalDone);

      setHasMore(page < data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load todos"
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreTodos = () => {
    if (!loadingMore && hasMore) {
      loadTodos(currentPage + 1);
    }
  };

  const handleDelete = async () => {
    setCurrentPage(1);
    setTodos([]);
    await loadTodos(1, true);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      setTodos([]);
      loadTodos(1, true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-balance">
              Todo List
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {totalDone} of {totalCount} completed
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Input
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                className="flex-1"
              />
              <Button onClick={addTodo} size="icon" disabled={!newTodo.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <SearchTodo
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Todo list */}
            <div className="space-y-2">
              {loading ? (
                <TodoListSkeleton />
              ) : todos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery
                    ? "No todos found matching your search."
                    : "No tasks yet. Add one above to get started!"}
                </div>
              ) : (
                <>
                  {todos.map((todo, index) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onDelete={handleDelete}
                      setTodos={setTodos}
                      setTotalDone={setTotalDone}
                      ref={
                        index === todos.length - 1 ? lastTodoElementRef : null
                      }
                    />
                  ))}

                  {loadingMore && (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </>
              )}
            </div>

            {totalCount > 0 && (
              <TodoProgress progress={(totalDone / totalCount) * 100} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
