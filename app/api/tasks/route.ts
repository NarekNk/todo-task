import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { Todo } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10", 10);

    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * pageSize;

    const total = await prisma.todo.count({
      where: {
        userId,
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    const totalDone = await prisma.todo.count({
      where: {
        userId,
        done: true,
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    });

    const items = await prisma.todo.findMany({
      where: {
        userId,
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      items,
      page,
      pageSize,
      total,
      totalPages,
      totalDone,
    });
  } catch (error) {
    console.error("GET /api/todos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 403 });
    }

    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (title.length > 500) {
      return NextResponse.json(
        { error: "Title must be less than 500 characters" },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({
      data: {
        done: false,
        title: title.trim(),
        userId: userId,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("POST /api/todos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, done } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Todo ID is required" },
        { status: 400 }
      );
    }

    // Validate title if provided
    if (
      title !== undefined &&
      (typeof title !== "string" || title.trim().length === 0)
    ) {
      return NextResponse.json(
        { error: "Title must be a non-empty string" },
        { status: 400 }
      );
    }

    if (title && title.length > 500) {
      return NextResponse.json(
        { error: "Title must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Validate done if provided
    if (done !== undefined && typeof done !== "boolean") {
      return NextResponse.json(
        { error: "Done must be a boolean" },
        { status: 400 }
      );
    }

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    const updateData: Partial<Todo> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (done !== undefined) updateData.done = done;

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error("PATCH /api/todos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Todo ID is required" },
        { status: 400 }
      );
    }

    const existingTodo = await prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/todos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
