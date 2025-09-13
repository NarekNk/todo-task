"use client";

import AuthForm from "@/components/auth-form";
import AuthHeader from "@/components/auth-header";
import AuthLoading from "@/components/auth-loading";
import TodoList from "@/components/todo-list";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <AuthLoading />;
  }

  if (!session) {
    return <AuthForm />;
  }

  return (
    <main>
      <AuthHeader email={session.user.email!} />

      <TodoList />
    </main>
  );
}
