import {prisma} from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
    const {email, password} = await request.json();

    if (!email || !password) {
        return Response.json({error: "Email and Password required"}, {status: 400})
    }

    const existingUser = await prisma.user.findUnique({where:{email}})
    if (existingUser){
        return Response.json({error: "User already exists"}, {status:400})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {email, hashedPassword},
    })

    return Response.json({ id: user.id, email: user.email }, { status: 201 })
}

