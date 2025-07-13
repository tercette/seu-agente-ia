import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("test") // ou o nome que você quiser
    const collection = db.collection("ping")
    await collection.insertOne({ timestamp: new Date() })

    return NextResponse.json({ message: "Mongo conectado com sucesso!" })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao conectar com Mongo" }, { status: 500 })
  }
}