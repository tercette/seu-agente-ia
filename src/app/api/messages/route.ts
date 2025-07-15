import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import Message from '@/models/Message';

export async function GET() {
  await connectMongo();

  const messages = await Message.find().sort({ createdAt: -1 }).limit(100);

  return NextResponse.json(messages);
}
