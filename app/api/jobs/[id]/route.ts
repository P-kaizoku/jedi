import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromToken(req)
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { status } = await req.json()

  const job = await prisma.job.update({
    where: { id, userId: user.userId },
    data: { status },
  })

  return Response.json(job)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromToken(req)
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  await prisma.job.delete({
    where: { id, userId: user.userId },
  })

  return Response.json({ message: "Deleted" })
}