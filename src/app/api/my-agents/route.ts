// src/app/api/my-agents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import Avaliacao from "@/models/Avaliacao";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from '@/models/User'; 

interface MyPayload extends JwtPayload {
  userId: string;
}

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    const token = auth?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Sem token" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as MyPayload;
    const userId = decoded.userId; // agora o TS reconhece
    await connectMongo();

    const agentes = await Avaliacao.find({ userId }).sort({ createdAt: -1 });

    const usuario = await User.findById(userId).select('name');

     return NextResponse.json({
      userName: usuario?.name || '',
      agentes,
    });
    
  } catch (err) {
    console.error("[MY_AGENTS]", err);
    return NextResponse.json(
      { error: "Falha ao buscar agentes" },
      { status: 500 }
    );
  }
}
