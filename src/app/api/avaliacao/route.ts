import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import Avaliacao from "@/models/Avaliacao";
import { avaliacaoSchema } from "@/OnboardForm/avaliacaoSchema";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const parsedData = avaliacaoSchema.safeParse(data);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.issues },
        { status: 400 }
      );
    }

    await connectMongo();

    const avaliacao = new Avaliacao(parsedData.data);

    await avaliacao.save();

    return NextResponse.json(
      { message: "Avaliação recebida com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[AVALIACAO_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao processar avaliação" },
      { status: 500 }
    );
  }
}
