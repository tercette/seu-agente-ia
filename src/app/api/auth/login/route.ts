import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectMongo } from "@/lib/mongoose";
import User from "@/models/User";
import Agent from "@/models/Agent";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    await connectMongo();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
    }

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // Buscar ou criar a avaliação
    const avaliacao = await Agent.findOne({ userId: user._id }).sort({
      createdAt: -1,
    });
    const agentId = avaliacao ? avaliacao._id.toString() : null;

    const response = NextResponse.json({
      message: "Login bem-sucedido",
      accessToken,
      agentId,
      userId: user._id.toString(),
      userName: user.name,
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json({ error: "Erro no login" }, { status: 500 });
  }
}
