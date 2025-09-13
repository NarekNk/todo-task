"use client";

import { Ref, SetStateAction, Dispatch, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import type { Todo } from "@prisma/client";
import { updateTodo, deleteTodo } from "@/lib/api/todo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function TodoItem({
  todo,
  onDelete,
  setTodos,
  setTotalDone,
  ref,
}: {
  todo: Todo;
  onDelete: () => Promise<void>;
  setTodos: Dispatch<SetStateAction<Array<Todo>>>;
  setTotalDone: Dispatch<SetStateAction<number>>;
  ref?: Ref<HTMLDivElement>;
}) {
  const [loading, setLoading] = useState(false);
  const { id, done } = todo;

  const toggleTodo = async () => {
    setLoading(true);
    try {
      await updateTodo(id, { done: !done });

      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      );

      setTotalDone((totalDone) => (!done ? ++totalDone : --totalDone));

      toast.success(`Todo marked as ${!done ? "completed" : "incomplete"}!`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update todo"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async () => {
    setLoading(true);
    try {
      await deleteTodo(id);

      await onDelete();

      toast.success("Todo deleted successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete todo"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors",
        {
          "opacity-70": loading,
        }
      )}
    >
      <Checkbox
        checked={todo.done}
        onCheckedChange={toggleTodo}
        disabled={loading}
      />
      <span
        className={`flex-1 ${
          todo.done ? "line-through text-muted-foreground" : "text-foreground"
        }`}
      >
        {todo.title}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDeleteTodo}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
