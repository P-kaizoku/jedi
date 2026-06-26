import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

// GET /api/notes?jobId=xxx - Get all notes for a job
export async function GET(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  // Verify the job belongs to the user
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { userId: true },
  });

  if (!job || job.userId !== user.userId) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const notes = await prisma.note.findMany({
    where: { jobId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notes);
}

// POST /api/notes - Create a new note
export async function POST(req: NextRequest) {
  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { text, jobId } = body;

  if (!text || !jobId) {
    return NextResponse.json(
      { error: "text and jobId are required" },
      { status: 400 }
    );
  }

  // Verify the job belongs to the user
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { userId: true },
  });

  if (!job || job.userId !== user.userId) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const note = await prisma.note.create({
    data: {
      text,
      jobId,
    },
  });

  return NextResponse.json(note, { status: 201 });
}
