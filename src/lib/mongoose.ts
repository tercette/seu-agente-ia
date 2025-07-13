// src/lib/mongoose.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

export async function connectMongo() {
  if (mongoose.connection.readyState >= 1) {
    return
  }

  return mongoose.connect(MONGODB_URI, {
    dbName: 'seu-agente-ia', // ou o nome do banco
  })
}
