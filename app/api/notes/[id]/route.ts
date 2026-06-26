import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Find the note and verify ownership through the job relation
  const note = await prisma.note.findUnique({
    where: { id },
    include: { job: { select: { userId: true } } },
  });

  if (!note || note.job.userId !== user.userId) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  await prisma.note.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Note deleted" });
}
