// app/api/jobs/route.ts
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function GET(req: Request) {
  const user = getUserFromToken(req)
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const jobs = await prisma.job.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: "desc" }
  })

  return Response.json(jobs)
}

// add this to app/api/jobs/route.ts
export async function POST(req: Request) {
  const user = getUserFromToken(req)
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, company, url } = await req.json()

  if (!title || !company) {
    return Response.json({ error: "Title and company required" }, { status: 400 })
  }

  const job = await prisma.job.create({
    data: {
      title,
      company,
      url,
      userId: user.userId,
    },
  })

  return Response.json(job, { status: 201 })
}