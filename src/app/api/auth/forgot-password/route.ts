import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { connectMongo } from "@/lib/mongoose";
import User from "@/models/User";

const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET || "your-reset-secret";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Gerar o token de recuperação de senha
    const resetToken = jwt.sign({ userId: user._id }, JWT_RESET_SECRET, {
      expiresIn: "1h",
    });

    // Criar um link para o usuário
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    // Configurar o serviço de email (por exemplo, usando Nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Recuperação de Senha",
      text: `Clique no link abaixo para redefinir sua senha: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "Link de recuperação enviado para seu email.",
    });
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao enviar o link de recuperação" },
      { status: 500 }
    );
  }
}
