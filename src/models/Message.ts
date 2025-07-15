// models/Message.ts
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    phone: String,
    role: { type: String, enum: ['user', 'assistant'], required: true },
    text: String,
    name: { type: String, default: 'Desconhecido' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model('Message', messageSchema);