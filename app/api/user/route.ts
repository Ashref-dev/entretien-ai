import { NextRequest } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<Record<string, string | string[]>> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Delete user data
    await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response("Error deleting user", { status: 500 });
  }
}
