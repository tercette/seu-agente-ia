import clientPromise from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json()

    const client = await clientPromise
    const db = client.db("seu-agente-ia")
    const users = db.collection("users")

    const existing = await users.findOne({ email: userData.email })

    if (!existing) {
      await users.insertOne({ ...userData, createdAt: new Date() })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 500 })
  }
}