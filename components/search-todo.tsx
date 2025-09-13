"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchTodoProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SearchTodo({ searchQuery, onSearchChange }: SearchTodoProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search todos..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
          onClick={() => onSearchChange("")}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
