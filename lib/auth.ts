// lib/auth.ts
import jwt from "jsonwebtoken"

export function getUserFromToken(req: Request): { userId: string; email: string } | null {
  const authHeader = req.headers.get("authorization")
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string }
    return decoded
  } catch {
    return null
  }
}